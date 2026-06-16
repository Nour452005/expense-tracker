const express = require('express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');

const app = express();

// Middleware
app.use(express.json());          // parse JSON request bodies
app.use(express.static('public')); // serve frontend files

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));