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

  // Use the correct base path for GitHub Pages
  const basePath = '/nnn'; // Your repository name

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the correct path for GitHub Pages
        const response = await fetch(`${process.env.NODE_ENV === 'production' ? basePath : ''}/data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Try to get data from localStorage first
        const storedData = localStorage.getItem('statusData');
        if (storedData) {
          setStatus(JSON.parse(storedData));
        } else {
          setStatus(data);
        }
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
        localStorage.setItem('statusData', JSON.stringify(defaultData));
      }
    };

    fetchData();
  }, []);

  const handleChangeStatus = (name, newStatus) => {
    const updatedStatus = status.map((item) =>
      item.name === name ? { ...item, status: newStatus } : item
    );
    setStatus(updatedStatus);
    
    // Save to localStorage
    localStorage.setItem('statusData', JSON.stringify(updatedStatus));
  };

  // Rest of your component remains the same...
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.keys(passwords).find(user => passwords[user] === password);

    if (user) {
      const userStatus = status.find(item => item.name === user);
      
      if (userStatus) {
        const newStatus = userStatus.status === 'Good' ? 'Bad' : 'Good';
        handleChangeStatus(user, newStatus);
        alert(`${user}'s status updated to ${newStatus}!`);
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