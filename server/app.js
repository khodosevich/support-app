const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const ticketsRoutes = require('./src/routes/ticketsRoutes');
const assigneesRoutes = require('./src/routes/assigneesRoutes');
const commentsRoutes = require('./src/routes/commentsRoutes');
const categoryRoutes = require('./src/routes/category');
const authenticateToken = require('./src/middleware/authenticateToken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  if (req.path.startsWith('/auth')) return next();
  authenticateToken(req, res, next);
});

app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/', ticketsRoutes);
app.use('/', assigneesRoutes);
app.use('/', commentsRoutes);
app.use('/ticket-categories', categoryRoutes);
//app.use('/ml', mlRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});