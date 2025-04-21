const jwt = require('jsonwebtoken');
const pool = require('../utils/db');

module.exports = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) return res.status(401).json({ error: 'Access token required' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await pool.query(
			'SELECT id, role FROM users WHERE id = $1',
			[decoded.id]
		);

		if (user.rows.length === 0) {
			return res.status(403).json({ error: 'User no longer exists' });
		}

		req.user = {
			id: user.rows[0].id,
			role: user.rows[0].role
		};

		next();
	} catch (error) {
		console.error('Authentication error:', error);

		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired' });
		}

		return res.status(403).json({ error: 'Invalid token' });
	}
};