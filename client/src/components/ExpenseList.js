import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', amount: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(expenses.map(e => e.category).filter(Boolean))];
  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!exp.category) return acc;
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const startEdit = (expense) => {
    setEditId(expense.id);
    setEditData({ title: expense.title, amount: expense.amount, category: expense.category });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/expenses/${id}`, editData);
      setEditId(null);
      fetchExpenses();
      toast.success('Expense updated');
    } catch (err) {
      console.error('Error updating expense:', err.response?.data || err.message || err);
      toast.error('Failed to update expense');
    }
  };

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

  // Handle deleting an expense
  const handleDelete = (id) => {
    axios.delete(`/expenses/${id}`)
      .then(() => {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        toast.success('Expense deleted');
      })
      .catch(err => {
        console.error('Error deleting expense:', err.response?.data || err.message || err);
        toast.error('Failed to delete expense');
      });
  };

  return (
    <div className="expense-container">
      <h2 className="expense-title">All Expenses</h2>
      <label className="category-filter">
        Filter by category:
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat || 'Uncategorized'}</option>
          ))}
        </select>
      </label>
      <h3 className="total-spent">Total Spent: ${totalSpent.toFixed(2)}</h3>
      <h4 className="category-breakdown">Breakdown by Category:</h4>
      <ul className="breakdown-list">
        {Object.entries(categoryTotals).map(([cat, amount]) => (
          <li key={cat}>
            {cat}: ${amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <h4 className="chart-title">Spending by Category (Chart)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {Object.keys(categoryTotals).map((_, index) => (
              <Cell key={index} fill={`hsl(${(index * 60) % 360}, 70%, 60%)`} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <button onClick={fetchExpenses} style={{ marginBottom: '1rem' }}>
        Refresh List
      </button>
      {filteredExpenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul className="expense-list">
          {filteredExpenses.map(exp => (
            <li key={exp.id}>
              {editId === exp.id ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={e => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <input
                    type="text"
                    value={editData.category}
                    onChange={e => setEditData(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <button onClick={() => handleUpdate(exp.id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <div className="expense-content">
                    <strong>{exp.title}</strong> – ${exp.amount} [{exp.category}] ({new Date(exp.created_at).toLocaleDateString()})
                  </div>
                  <div className="expense-actions">
                    <button onClick={() => startEdit(exp)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(exp.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;