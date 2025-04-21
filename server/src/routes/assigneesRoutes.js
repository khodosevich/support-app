const express = require('express');
const pool = require('../utils/db');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Получение списка сотрудников с их специализациями
router.get('/assignees', authenticateToken, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT a.employee_id,
                    u.username,
                    u.email,
                    a.specialization,
                    a.current_workload,
                    a.max_workload,
                    a.rating,
                    a.skills,
                    a.avatar_url,
                    u.created_at,
                    u.id
             FROM assignees a
                      JOIN users u ON a.user_id = u.id`,
		);
		res.json(result.rows);
	}
	catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/assignees/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	if (isNaN(id)) {
		return res.status(400).json({ error: 'Invalid employee ID' });
	}

	try {
		const result = await pool.query(
			`SELECT a.employee_id,
                    u.username,
                    u.email,
                    a.specialization,
                    a.current_workload,
                    a.max_workload,
                    a.rating,
                    a.skills,
                    a.avatar_url,
                    u.created_at,
                    u.id,
                    u.role
             FROM assignees a
                      JOIN users u ON a.user_id = u.id
             WHERE u.id = $1`, [id],
		);

		res.json(result.rows[0]);
	}
	catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.delete('/assignees/:id', authenticateToken, async (req, res) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Access denied' });
	}

	const employeeId = parseInt(req.params.id);

	if (isNaN(employeeId)) {
		return res.status(400).json({ error: 'Invalid employee ID' });
	}

	try {
		await pool.query(
			'DELETE FROM assignees WHERE employee_id = $1',
			[employeeId],
		);

		await pool.query(
			'DELETE FROM users WHERE id = (SELECT user_id FROM assignees WHERE employee_id = $1)',
			[employeeId],
		);

		res.status(204).send();
	}
	catch (error) {
		console.error('Error deleting assignee:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.put('/assignees/:id', async (req, res) => {
	const employeeId = parseInt(req.params.id);
	const {
		username,
		email,
		role,
		specialization,
		skills,
		current_workload,
		max_workload,
		rating,
		avatar_url,
	} = req.body;

	if (isNaN(employeeId)) {
		return res.status(400).json({ error: 'Invalid employee ID' });
	}

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// 1. Обновляем информацию о пользователе
		const userUpdateQuery = `
            UPDATE users
            SET username = $1,
                email    = $2,
                role     = $3
            WHERE id = (SELECT user_id FROM assignees WHERE employee_id = $4) RETURNING id, username, email, role, created_at
		`;
		const userUpdateResult = await client.query(userUpdateQuery, [
			username,
			email,
			role,
			employeeId,
		]);

		if (userUpdateResult.rows.length === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'User not found' });
		}

		// 2. Обновляем информацию о сотруднике
		const assigneeUpdateQuery = `
            UPDATE assignees
            SET specialization   = $1,
                skills           = $2,
                current_workload = $3,
                max_workload     = $4,
                rating           = $5,
                avatar_url       = $6
            WHERE employee_id = $7 RETURNING 
        employee_id,
        specialization,
        skills,
        current_workload,
        max_workload,
        rating,
        avatar_url,
        user_id
		`;
		const assigneeUpdateResult = await client.query(assigneeUpdateQuery, [
			specialization,
			skills,
			current_workload,
			max_workload,
			rating,
			avatar_url,
			employeeId,
		]);

		if (assigneeUpdateResult.rows.length === 0) {
			await client.query('ROLLBACK');
			return res.status(404).json({ error: 'Assignee not found' });
		}

		await client.query('COMMIT');

		// 3. Формируем полный объект сотрудника для ответа
		const updatedAssignee = {
			...userUpdateResult.rows[0],
			...assigneeUpdateResult.rows[0],
			employee_id: assigneeUpdateResult.rows[0].employee_id,
		};

		res.status(200).json({
			message: 'Assignee updated successfully',
			assignee: updatedAssignee,
		});

	}
	catch (error) {
		await client.query('ROLLBACK');
		console.error('Error updating assignee:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		client.release();
	}
});

module.exports = router;