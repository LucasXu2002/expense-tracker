const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const expensesRoutes = require('./routes/expenses');
app.use('/expenses', expensesRoutes);

app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});
