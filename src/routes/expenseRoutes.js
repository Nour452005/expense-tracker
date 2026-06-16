const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getSummary
} = require('../controllers/expenseController');

// All routes here are protected by the auth middleware
router.use(auth);

// IMPORTANT: /summary must come BEFORE /:id
// Otherwise Express will treat "summary" as an :id parameter
router.get('/summary', getSummary);
router.get('/', getExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;