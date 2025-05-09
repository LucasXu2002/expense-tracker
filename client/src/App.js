import React, { useEffect, useState } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import axios from 'axios';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <AddExpense onRefresh={getExpenses} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default App;
