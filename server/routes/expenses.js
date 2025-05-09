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

module.exports = router;