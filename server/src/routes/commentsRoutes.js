const express = require('express');
const pool = require('../utils/db');
require('dotenv').config();
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Получение комментариев
router.get('/tickets/:id/comments', authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;

		console.log(id);

		const result = await pool.query(
			`SELECT c.*, u.username
             FROM ticket_comments c
                      JOIN users u ON c.author_id = u.id
             WHERE ticket_id = $1
             ORDER BY created_at DESC`,
			[id],
		);
		res.status(200).json(result.rows);
	}
	catch (error) {
		console.error('Error fetching comments:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Добавление комментария
router.post('/tickets/:id/comments', authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { content, is_internal } = req.body;
		const author_id = req.user.id;

		const result = await pool.query(
			`INSERT INTO ticket_comments
                 (ticket_id, author_id, content, is_internal)
             VALUES ($1, $2, $3, $4) RETURNING *`,
			[id, author_id, content, is_internal || false],
		);

		res.status(201).json(result.rows[0]);
	}
	catch (error) {
		console.error('Error adding comment:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;