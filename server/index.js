// server/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const expensesRoutes = require('./routes/expenses'); 
app.use('/expenses', expensesRoutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});

