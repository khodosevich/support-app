const express = require('express');
const pool = require('../utils/db');
require('dotenv').config();
const authenticateToken = require('../middleware/authenticateToken');
const { compare, hash } = require('bcrypt');

const router = express.Router();

// Получить всех пользователей
router.get('/users', authenticateToken, async (req, res) => {
	try {
		const result = await pool.query(
			'SELECT id, username, email, role, created_at, last_active FROM users'
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Получить пользователя по ID
router.get('/users/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			'SELECT id, username, email, role, created_at, last_active FROM users WHERE id = $1',
			[id]
		);

		if (!result.rows.length) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Обновить данные пользователя (username/email)
router.put('/users/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { username, email } = req.body;

	try {
		await pool.query(
			'UPDATE users SET username = $1, email = $2 WHERE id = $3',
			[username, email, id]
		);
		res.json({ message: 'User updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Удалить пользователя
router.delete('/users/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
		await pool.query('DELETE FROM users WHERE id = $1', [id]);

		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Обновить роль пользователя
router.put('/users/:id/role', authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;

	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Access denied' });
	}

	try {
		await pool.query(
			'UPDATE users SET role = $1 WHERE id = $2',
			[role, id]
		);
		res.json({ message: 'User role updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Обновить пароль пользователя
router.put('/users/:id/password', authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { password, newPassword } = req.body;

	try {
		const userResult = await pool.query(
			'SELECT password FROM users WHERE id = $1',
			[id]
		);

		if (!userResult.rows.length) {
			return res.status(404).json({ error: 'User not found' });
		}

		const isMatch = await compare(password, userResult.rows[0].password);
		if (!isMatch) {
			return res.status(401).json({ error: 'Incorrect old password' });
		}

		const newHashedPassword = await hash(newPassword, 10);

		await pool.query(
			'UPDATE users SET password = $1 WHERE id = $2',
			[newHashedPassword, id]
		);

		res.json({ message: 'Password updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;