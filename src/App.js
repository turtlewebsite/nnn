import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState([]);
  const passwords = {
    'Shreyes': 'sb21k21',
    'Gus': 'garenlover',
    'Logan': 'childtoucher123',
    'Jacob': 'baddiebj'
  };

  // API base URL - adjust this based on your deployment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://nnn-it6j.onrender.com'  // Replace with your deployed API URL
    : 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Initialize with default data if fetch fails
        const defaultData = [
          { name: 'Shreyes', status: 'Good' },
          { name: 'Gus', status: 'Good' },
          { name: 'Logan', status: 'Good' },
          { name: 'Jacob', status: 'Good' }
        ];
        setStatus(defaultData);
      }
    };

    fetchData();
  }, []);

  const handleChangeStatus = async (name, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const { data } = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.keys(passwords).find(user => passwords[user] === password);

    if (user) {
      const userStatus = status.find(item => item.name === user);
      
      if (userStatus) {
        const newStatus = userStatus.status === 'Good' ? 'Bad' : 'Good';
        handleChangeStatus(user, newStatus);
      } else {
        alert('User not found in status list.');
      }
    } else {
      alert('Invalid password. Please try again.');
    }
    setPassword('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1 className="title">Status of Nuts</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        {status.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}
          >
            <span className="label">{item.name}</span>
            <div
              className="bar"
              style={{
                width: '200px',
                height: '25px',
                backgroundColor: item.status === "Good" ? "green" : "red",
              }}
            ></div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '60px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to change status"
          style={{ padding: '10px', fontSize: '1rem' }}
          required
        />
        <button type="submit" style={{ padding: '10px', fontSize: '1rem' }}>Submit</button>
      </form>
    </div>
  );
}

export default App;