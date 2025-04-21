const pool = require('../utils/db');

const assignTicketToBestAssignee = async (ticketId) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// 1. Получаем информацию о заявке с блокировкой строки
		const ticketRes = await client.query(
			`SELECT category_id, priority
             FROM tickets
             WHERE ticket_id = $1
                 FOR UPDATE`,
			[ticketId],
		);

		if (ticketRes.rows.length === 0) {
			await client.query('ROLLBACK');
			throw new Error('Ticket not found');
		}

		const ticket = ticketRes.rows[0];

		// 2. Проверяем, не назначена ли уже заявка
		const currentAssigneeRes = await client.query(
			`SELECT assigned_to
             FROM tickets
             WHERE ticket_id = $1`,
			[ticketId],
		);

		if (currentAssigneeRes.rows[0].assigned_to) {
			await client.query('ROLLBACK');
			console.log('Ticket already assigned');
			return (await client.query('SELECT * FROM tickets WHERE ticket_id = $1', [ticketId])).rows[0];
		}

		// 3. Находим подходящего исполнителя с учетом приоритета
		const assigneeQuery = `
            SELECT a.employee_id,
                   a.user_id,
                   a.current_workload,
                   a.max_workload,
                   a.rating,
                   u.username
            FROM assignees a
                     JOIN assignee_specializations asp ON a.employee_id = asp.assignee_id
                     JOIN users u ON a.user_id = u.id
            WHERE asp.category_id = $1
              AND a.current_workload < a.max_workload
              AND (
                ($2 IN ('high', 'critical') AND a.rating >= 4.5
                    OR
                 $2 NOT IN ('high', 'critical')
                    )
            ORDER BY CASE
                         WHEN $2 = 'critical' THEN a.rating * 2
                         WHEN $2 = 'high' THEN a.rating * 1.5
                         ELSE a.rating
                         END DESC,
                     a.current_workload ASC LIMIT 1
		`;

		const assigneeRes = await client.query(assigneeQuery, [
			ticket.category_id,
			ticket.priority,
		]);

		if (assigneeRes.rows.length > 0) {
			const assignee = assigneeRes.rows[0];
			const assigneeId = assignee.employee_id;

			// 4. Назначаем заявку
			await client.query(
				`UPDATE tickets
                 SET assigned_to = $1,
                     status = 'assigned'
                 WHERE ticket_id = $2`,
				[assigneeId, ticketId],
			);

			// 5. Обновляем нагрузку исполнителя
			await client.query(
				`UPDATE assignees
                 SET current_workload = current_workload + 1
                 WHERE employee_id = $1`,
				[assigneeId],
			);

			// 6. Записываем в историю
			await client.query(
				`INSERT INTO ticket_history
                     (ticket_id, changed_field, old_value, new_value, changed_by)
                 VALUES ($1, 'assigned_to', NULL, $2, $3)`,
				[ticketId, assigneeId, assignee.user_id],
			);

			await client.query('COMMIT');

			// 7. Возвращаем обновленную заявку
			const updatedTicket = await pool.query(
				`SELECT t.*, u.username as assigned_to_username
                 FROM tickets t
                          LEFT JOIN assignees a ON t.assigned_to = a.employee_id
                          LEFT JOIN users u ON a.user_id = u.id
                 WHERE t.ticket_id = $1`,
				[ticketId],
			);

			console.log('Ticket assigned successfully:', updatedTicket.rows[0]);
			return updatedTicket.rows[0];
		}

		await client.query('COMMIT');

		// Если исполнитель не найден
		console.log('No suitable assignee found');
		return (await client.query('SELECT * FROM tickets WHERE ticket_id = $1', [ticketId])).rows[0];
	}
	catch (error) {
		await client.query('ROLLBACK');
		console.error('Error assigning ticket:', error);
		throw error;
	}
	finally {
		client.release();
	}
};

module.exports = {
	assignTicketToBestAssignee,
};