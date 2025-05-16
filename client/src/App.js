import React, { useEffect, useState } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import axios from 'axios';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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
    <div className={darkMode ? 'App dark-mode' : 'App'}>
      <button onClick={() => setDarkMode(prev => !prev)} style={{ marginBottom: '1rem' }}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <h1>Expense Tracker</h1>
      <AddExpense onRefresh={getExpenses} />
      <ExpenseList expenses={expenses} />
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;
