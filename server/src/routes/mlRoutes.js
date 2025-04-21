const express = require('express');
const pool = require('../utils/db');
const authenticateToken = require('../middleware/authenticateToken');
const { predictCategory } = require('../services/mlService');

const router = express.Router();

// Предсказание категории заявки (можно вызывать при создании заявки)
router.post('/predict', authenticateToken, async (req, res) => {
	const { text } = req.body;

	if (!text) {
		return res.status(400).json({ error: 'Text is required' });
	}

	try {
		// Здесь можно интегрировать реальную ML модель
		const predictedCategory = await predictCategory(text);

		res.json({
			category: predictedCategory,
			confidence: 0.95 // Примерное значение уверенности
		});
	} catch (error) {
		console.error('Prediction error:', error);
		res.status(500).json({ error: 'Prediction failed' });
	}
});

module.exports = router;