const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const pool = require('../utils/db');

const router = express.Router();

// Получить все категории
router.get('/', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM ticket_categories ORDER BY name');
		res.status(200).json(result.rows);
	}
	catch (error) {
		console.error('Error fetching categories:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Создать новую категорию (только для админов)
router.post('/', authenticateToken, async (req, res) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Only admin can create categories' });
	}

	const { name, description, default_priority } = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO ticket_categories
                 (name, description, default_priority)
             VALUES ($1, $2, $3) RETURNING *`,
			[name, description, default_priority],
		);
		res.status(201).json(result.rows[0]);
	}
	catch (error) {
		console.error('Error creating category:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Обновить категорию (только для админов)
router.put('/:id', authenticateToken, async (req, res) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Only admin can update categories' });
	}

	const { id } = req.params;
	const { name, description, default_priority } = req.body;

	try {
		const result = await pool.query(
			`UPDATE ticket_categories
             SET name = $1,
                 description = $2,
                 default_priority = $3
             WHERE category_id = $4 RETURNING *`,
			[name, description, default_priority, id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Category not found' });
		}

		res.status(200).json(result.rows[0]);
	}
	catch (error) {
		console.error('Error updating category:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Удалить категорию (только для админов)
router.delete('/:id', authenticateToken, async (req, res) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Only admin can delete categories' });
	}

	const { id } = req.params;

	try {
		// Проверяем, есть ли задачи с этой категорией
		const ticketsRes = await pool.query(
			'SELECT 1 FROM tickets WHERE category_id = $1 LIMIT 1',
			[id],
		);

		if (ticketsRes.rows.length > 0) {
			return res.status(400).json({
				error: 'Cannot delete category with associated tickets',
			});
		}

		const result = await pool.query(
			'DELETE FROM ticket_categories WHERE category_id = $1 RETURNING *',
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Category not found' });
		}

		res.status(200).json({ message: 'Category deleted successfully' });
	}
	catch (error) {
		console.error('Error deleting category:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;