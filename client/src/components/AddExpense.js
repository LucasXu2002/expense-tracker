import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      setError('Title and amount are required.');
      return;
    }

    try {
      await axios.post('/expenses', formData);
      alert('Expense added!');
      setFormData({ title: '', amount: '', category: '' });
    } catch (err) {
      console.error(err);
      setError('Error adding expense');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add Expense</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (optional)"
          value={formData.category}
          onChange={handleChange}
        />
        <button type="submit" disabled={!formData.title || !formData.amount}>Add</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  );
};

export default AddExpense;