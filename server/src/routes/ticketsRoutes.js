const express = require('express');
const pool = require('../utils/db');
require('dotenv').config();
const authenticateToken = require('../middleware/authenticateToken');
const axios = require('axios');
const router = express.Router();

// Создание заявки (доступно всем авторизованным пользователям)
router.post('/tickets', authenticateToken, async (req, res) => {
	const { title, description } = req.body;
	const userId = req.user.id;

	if (!title || !description) {
		return res.status(400).json({ error: 'Title and description are required' });
	}

	try {
		// 1. Получаем прогноз от модели
		const response = await axios.post('http://127.0.0.1:8000/predict', {
			text: `${title} ${description}`
		});

		const modelPrediction = response.data;
		const predictedCategory = modelPrediction.category_name;
		const predictedPriority = modelPrediction.priority || 'medium';
		const confidence = modelPrediction.confidence || 0.0;

		// 2. Получаем ID категории через связь с переводом
		const categoryResult = await pool.query(
			`SELECT tc.category_id, tc.name as category_name
             FROM category_translations ct
                      JOIN ticket_categories tc ON ct.category_ru = tc.name
             WHERE ct.category_en = $1`,
			[predictedCategory]
		);

		if (categoryResult.rows.length === 0) {
			return res.status(400).json({
				error: `Unknown category: ${predictedCategory}`,
				details: 'No matching category found in database'
			});
		}

		const categoryId = categoryResult.rows[0].category_id;

		// 3. Ищем подходящего исполнителя (по специализации, нагрузке и рейтингу)
		const assigneeResult = await pool.query(
			`SELECT employee_id
             FROM assignees
             WHERE specialization = $1
               AND current_workload < max_workload
             ORDER BY current_workload ASC, rating DESC
                 LIMIT 1`,
			[predictedCategory]
		);

		const assigneeId = assigneeResult.rows[0]?.employee_id || null;

		// 4. Создаем заявку
		const ticketResult = await pool.query(
			`INSERT INTO tickets
             (title, description, status, priority, category_id,
              created_by, assigned_to, ai_confidence)
             VALUES ($1, $2, 'new', $3, $4, $5, $6, $7)
                 RETURNING *`,
			[
				title,
				description,
				predictedPriority,
				categoryId,
				userId,
				assigneeId,
				confidence
			]
		);

		const newTicket = ticketResult.rows[0];

		// 5. Добавляем запись в историю
		await pool.query(
			`INSERT INTO ticket_history
                 (ticket_id, changed_field, new_value, changed_by)
             VALUES ($1, 'status', 'new', $2)`,
			[newTicket.ticket_id, userId]
		);

		// 6. Увеличиваем нагрузку на исполнителя, если назначен
		if (assigneeId) {
			await pool.query(
				`UPDATE assignees
                 SET current_workload = current_workload + 1
                 WHERE employee_id = $1`,
				[assigneeId]
			);
		}

		// 7. Возвращаем полную информацию о заявке
		const fullTicket = await getTicketWithDetails(newTicket.ticket_id);

		console.log(fullTicket);

		res.status(201).json({
			...fullTicket,
			ai_analysis: {
				category: predictedCategory,
				priority: predictedPriority,
				confidence: confidence,
				assignee_suggestion: assigneeId ? {
					employee_id: assigneeId,
					specialization: predictedCategory
				} : null
			}
		});
	} catch (error) {
		console.error('Error creating ticket:', error);

		let errorMessage = 'Internal server error';
		let statusCode = 500;

		if (error.response?.data) {
			errorMessage = 'Prediction service error';
			statusCode = 502;
		} else if (error.code === 'ECONNREFUSED') {
			errorMessage = 'Prediction service unavailable';
			statusCode = 503;
		}

		res.status(statusCode).json({
			error: errorMessage,
			details: error.message,
			...(error.response?.data && { prediction_error: error.response.data })
		});
	}
});

// Вспомогательная функция для получения полной информации о заявке
async function getTicketWithDetails(ticketId) {
	const result = await pool.query(
		`SELECT t.*, 
                tc.name as category_name,
                u.username as created_by_username,
                a.user_id as assignee_user_id,
                au.username as assignee_username
         FROM tickets t
         LEFT JOIN ticket_categories tc ON t.category_id = tc.category_id
         LEFT JOIN users u ON t.created_by = u.id
         LEFT JOIN assignees a ON t.assigned_to = a.employee_id
         LEFT JOIN users au ON a.user_id = au.id
         WHERE t.ticket_id = $1`,
		[ticketId]
	);
	return result.rows[0];
}

// Получение списка заявок (пользователь — свои, админ — все)
router.get('/tickets', authenticateToken, async (req, res) => {
	try {
		const isAdmin = req.user.role === 'admin' || req.user.role === 'assignee';
		const query = `
            SELECT t.*, u.username
            FROM tickets t
                     JOIN users u ON t.created_by = u.id
                ${isAdmin ? '' : 'WHERE t.created_by = $1'}
		`;

		const values = isAdmin ? [] : [req.user.id];
		const result = await pool.query(query, values);

		res.json(result.rows);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Получение заявки по ID
router.get('/tickets/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			`SELECT
                 t.*,
                 u.username as created_by_username,
                 a.employee_id,
                 au.username as assigned_to_username
             FROM tickets t
                      JOIN users u ON t.created_by = u.id
                      LEFT JOIN assignees a ON t.assigned_to = a.employee_id
                      LEFT JOIN users au ON a.user_id = au.id
             WHERE t.ticket_id = $1`,
			[id]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: 'Ticket not found' });
		}

		const ticket = result.rows[0];

		// Формируем ответ в удобном формате
		const response = {
			...ticket,
			assigned_to: ticket.assigned_to ? {
				employee_id: ticket.employee_id,
				username: ticket.assigned_to_username
			} : null,
			created_by: {
				user_id: ticket.created_by,
				username: ticket.created_by_username
			}
		};

		// Удаляем временные поля, которые больше не нужны
		delete response.created_by_username;
		delete response.assigned_to_username;
		delete response.employee_id;

		res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/assignee/tickets/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		const employeeResult = await pool.query(
			`SELECT employee_id
             FROM assignees
             WHERE user_id = $1`,
			[id],
		);

		if (employeeResult.rowCount === 0) {
			return res.status(404).json({ error: 'Employee not found for this user' });
		}

		const employeeId = employeeResult.rows[0].employee_id;

		const ticketsResult = await pool.query(
			`SELECT t.*, u.username
             FROM tickets t
                      JOIN users u ON t.created_by = u.id
             WHERE t.assigned_to = $1`,
			[employeeId],
		);

		if (ticketsResult.rowCount === 0) {
			return res.status(404).json({ error: 'No tickets found for this employee' });
		}

		res.json(ticketsResult.rows);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Удаление заявки
router.delete('/tickets/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		// Проверка: только автор или админ может удалить заявку
		const ticketCheck = await pool.query(
			'SELECT * FROM tickets WHERE ticket_id = $1',
			[id],
		);

		if (ticketCheck.rowCount === 0) {
			return res.status(404).json({ error: 'Ticket not found' });
		}

		const ticket = ticketCheck.rows[0];

		if (ticket.created_by !== req.user.id && req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Access denied' });
		}

		await pool.query('DELETE FROM tickets WHERE ticket_id = $1', [id]);

		res.json({ message: 'Ticket deleted successfully' });
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Получение самой старой заявки
router.get('/ticket/oldest', authenticateToken, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT t.*, u.username
             FROM tickets t
                      JOIN users u ON t.created_by = u.id
             WHERE t.status NOT IN ('resolved', 'closed')
             ORDER BY t.created_at ASC LIMIT 1`,
		);
		res.json(result.rows[0] || { message: 'No tickets found' });
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.put('/tickets/:id/status', authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	const userId = req.user.id;

	// Валидация статуса
	const validStatuses = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];
	if (!validStatuses.includes(status)) {
		return res.status(400).json({
			error: 'Invalid status',
			validStatuses: validStatuses,
		});
	}

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// 1. Получаем заявку и блокируем строку
		const ticketRes = await client.query(
			`SELECT status, assigned_to
             FROM tickets
             WHERE ticket_id = $1
                 FOR UPDATE`,
			[id],
		);

		if (ticketRes.rows.length === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'Ticket not found' });
		}

		const currentStatus = ticketRes.rows[0].status;
		const assigneeId = ticketRes.rows[0].assigned_to;

		let assigneeUserId = null;

		// 2. Получаем user_id исполнителя, если он есть
		if (assigneeId) {
			const assigneeRes = await client.query(
				`SELECT user_id
                 FROM assignees
                 WHERE employee_id = $1`,
				[assigneeId],
			);
			assigneeUserId = assigneeRes.rows[0]?.user_id;
		}

		if (ticketRes.rows.length === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'Ticket not found' });
		}

		// 2. Проверка прав на изменение статуса
		if (req.user.role !== 'admin' && assigneeUserId !== userId) {
			await client.query('ROLLBACK');
			return res.status(403).json({
				error: 'You can only update tickets assigned to you',
			});
		}

		// 3. Обновляем статус заявки
		const updateResult = await client.query(
			`UPDATE tickets
             SET status      = $1,
                 resolved_at = CASE WHEN $2 = 'resolved' THEN NOW() ELSE resolved_at END
             WHERE ticket_id = $3 RETURNING *`,
			[status, status, id],  // передаём status дважды
		);

		// 4. Записываем в историю изменений
		await client.query(
			`INSERT INTO ticket_history
                 (ticket_id, changed_field, old_value, new_value, changed_by)
             VALUES ($1, 'status', $2, $3, $4)`,
			[id, currentStatus, status, userId],
		);

		// 5. Если заявка закрыта, уменьшаем нагрузку сотрудника
		if (status === 'closed' && assigneeId) {
			await client.query(
				`UPDATE assignees
                 SET current_workload = GREATEST(0, current_workload - 1)
                 WHERE employee_id = $1`,
				[assigneeId],
			);
		}

		await client.query('COMMIT');

		res.status(200).json({
			message: 'Status updated successfully',
			ticket: updateResult.rows[0],
			previousStatus: currentStatus,
		});

	}
	catch (error) {
		await client.query('ROLLBACK');
		console.error('Error updating ticket status:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		client.release();
	}
});

router.put('/tickets/:id/update', authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { field, value } = req.body;
	const userId = req.user.id;

	// Проверяем, что поле разрешено для обновления
	const allowedFields = ['status', 'category_id', 'assigned_to', 'priority'];
	if (!allowedFields.includes(field)) {
		return res.status(400).json({ error: 'Invalid field for update' });
	}

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// 1. Получаем текущее значение поля
		const ticketRes = await client.query(
			`SELECT ${field}, assigned_to
             FROM tickets
             WHERE ticket_id = $1 FOR UPDATE`,
			[id],
		);

		if (ticketRes.rows.length === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'Ticket not found' });
		}

		const currentValue = ticketRes.rows[0][field];
		const assigneeId = ticketRes.rows[0].assigned_to;

		// 2. Проверка прав (админ или назначенный сотрудник)
		if (req.user.role !== 'admin') {
			if (field === 'assigned_to') {
				// Только админ может переназначать
				await client.query('ROLLBACK');
				return res.status(403).json({ error: 'Only admin can reassign tickets' });
			}

			// Для других полей проверяем, что пользователь назначен на задачу
			const assigneeRes = await client.query(
				'SELECT user_id FROM assignees WHERE employee_id = $1',
				[assigneeId],
			);
			const assigneeUserId = assigneeRes.rows[0]?.user_id;

			if (assigneeUserId !== userId) {
				await client.query('ROLLBACK');
				return res.status(403).json({ error: 'You can only update tickets assigned to you' });
			}
		}

		// 3. Валидация значений
		if (field === 'status') {
			const validStatuses = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];
			if (!validStatuses.includes(value)) {
				await client.query('ROLLBACK');
				return res.status(400).json({ error: 'Invalid status value' });
			}
		}
		else if (field === 'priority') {
			const validPriorities = ['low', 'medium', 'high', 'critical'];
			if (!validPriorities.includes(value)) {
				await client.query('ROLLBACK');
				return res.status(400).json({ error: 'Invalid priority value' });
			}
		}
		else if (field === 'category_id' && isNaN(Number(value))) {
			await client.query('ROLLBACK');
			return res.status(400).json({ error: 'Invalid category ID' });
		}
		else if (field === 'assigned_to' && isNaN(Number(value))) {
			await client.query('ROLLBACK');
			return res.status(400).json({ error: 'Invalid assignee ID' });
		}

		// 4. Обновляем поле
		const updateQuery = `UPDATE tickets
                             SET ${field} = $1
                             WHERE ticket_id = $2 RETURNING *`;
		const updateResult = await client.query(updateQuery, [value, id]);

		// 5. Записываем в историю изменений
		await client.query(
			`INSERT INTO ticket_history
                 (ticket_id, changed_field, old_value, new_value, changed_by)
             VALUES ($1, $2, $3, $4, $5)`,
			[id, field, currentValue, value, userId],
		);

		// 6. Если изменился назначенный сотрудник, обновляем workload
		if (field === 'assigned_to') {
			// Уменьшаем нагрузку предыдущего сотрудника
			if (assigneeId) {
				await client.query(
					`UPDATE assignees
                     SET current_workload = GREATEST(0, current_workload - 1)
                     WHERE employee_id = $1`,
					[assigneeId],
				);
			}

			// Увеличиваем нагрузку нового сотрудника
			if (value) {
				await client.query(
					`UPDATE assignees
                     SET current_workload = current_workload + 1
                     WHERE employee_id = $1`,
					[value],
				);
			}
		}

		await client.query('COMMIT');
		res.status(200).json(updateResult.rows[0]);
	}
	catch (error) {
		await client.query('ROLLBACK');
		console.error('Error updating ticket:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		client.release();
	}
});

module.exports = router;
