import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = () => {
    axios.get('/expenses')
      .then(res => {
        console.log('Fetched expenses:', res.data);
        setExpenses(res.data);
      })
      .catch(err => console.error('Error fetching expenses:', err));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>All Expenses</h2>
      <button onClick={fetchExpenses} style={{ marginBottom: '1rem' }}>
        Refresh List
      </button>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map(exp => (
            <li key={exp.id}>
              <strong>{exp.title}</strong> – ${exp.amount} [{exp.category}] ({new Date(exp.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;