const express = require('express');
const router = express.Router(); // make a mini Express app just for routes
const db = require('../db');     // get your MySQL connection

// GET /expenses → return all expenses
router.get('/', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /expenses → add a new expense
router.post('/', (req, res) => {
  const { title, amount, category } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount are required' });
  }

  const sql = 'INSERT INTO expenses (title, amount, category) VALUES (?, ?, ?)';
  db.query(sql, [title, amount, category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, title, amount, category });
  });
});

// DELETE /expenses/:id → delete a specific expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM expenses WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted' });
  });
});

// PUT /expenses/:id → update an existing expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount are required' });
  }

  const sql = 'UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ?';
  db.query(sql, [title, amount, category, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense updated' });
  });
});

module.exports = router;