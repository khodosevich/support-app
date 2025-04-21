const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
require('dotenv').config();

const router = express.Router();

const generateAccessToken = (user) => {
	return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (user) => {
	const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

	await pool.query(
		'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) ON CONFLICT (token) DO NOTHING',
		[user.id, refreshToken]
	);

	return refreshToken;
};

// Регистрация пользователя
router.post('/register', async (req, res) => {
	const { username, password, email, role } = req.body;

	if (!username || !password || !email) {
		return res.status(400).json({ error: 'All fields are required' });
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await pool.query(
			'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
			[username, hashedPassword, email, role || 'user']
		);

		const newUser = result.rows[0];

		// Если регистрируется исполнитель — создаём запись в assignees
		if (newUser.role === 'assignee') {
			await pool.query(
				'INSERT INTO assignees (user_id, specialization, skills) VALUES ($1, $2, $3)',
				[newUser.id, '', []]
			);
		}

		const accessToken = generateAccessToken(newUser);
		const refreshToken = await generateRefreshToken(newUser);

		res.status(201).json({ user: newUser, accessToken, refreshToken });
	} catch (error) {
		console.error(error);
		if (error.code === '23505') {
			res.status(400).json({ error: 'Username or email already exists' });
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

// Вход в систему
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: 'All fields are required' });
	}

	try {
		const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
		const user = result.rows[0];

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// Обновление времени последней активности
		await pool.query('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

		const accessToken = generateAccessToken(user);
		const refreshToken = await generateRefreshToken(user);

		res.json({ accessToken, refreshToken });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Обновление access-токена
router.post('/refresh', async (req, res) => {
	const { token } = req.body;

	if (!token) return res.status(401).json({ error: 'Refresh token required' });

	try {
		const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
		if (result.rows.length === 0) return res.status(403).json({ error: 'Invalid refresh token' });

		jwt.verify(token, process.env.REFRESH_SECRET, async (err, userPayload) => {
			if (err) return res.status(403).json({ error: 'Invalid refresh token' });

			const userResult = await pool.query('SELECT id, role FROM users WHERE id = $1', [userPayload.id]);
			const user = userResult.rows[0];
			if (!user) return res.status(404).json({ error: 'User not found' });

			await pool.query('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

			const newAccessToken = generateAccessToken(user);
			res.json({ accessToken: newAccessToken, refreshToken: token });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Выход из системы
router.post('/logout', async (req, res) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Authorization header with Bearer token required' });
	}

	const token = req.headers.authorization.replace('Bearer ', '');

	try {
		await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
		res.json({ message: 'Logged out successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;