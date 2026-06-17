const pool = require('../db');

// GET /expenses
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /expenses
const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ error: 'Amount and category are required.' });
  }

  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, description, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, amount, category, description, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// PUT /expenses/:id
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;

  try {
    // IMPORTANT: check user_id too — users must not be able to edit each other's expenses
    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1, category = $2, description = $3, date = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [amount, category, description, date, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or not yours.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE /expenses/:id
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or not yours.' });
    }

    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /expenses/summary
const getSummary = async (req, res) => {
  try {
    // Total per category
    const byCategory = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1
       GROUP BY category
       ORDER BY total DESC`,
      [req.user.id]
    );

    // Total this month
    const monthly = await pool.query(
      `SELECT SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1
         AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)`,
      [req.user.id]
    );

    res.json({
      by_category: byCategory.rows,
      this_month_total: monthly.rows[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense, getSummary };