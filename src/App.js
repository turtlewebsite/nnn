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
  }; // Example passwords

  // Fetch initial status data from the server
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data.json');
      const data = await response.json();
      setStatus(data);
    };

    fetchData();
  }, []);

  const handleChangeStatus = async (name, newStatus) => {
    const updatedStatus = status.map((item) =>
      item.name === name ? { ...item, status: newStatus } : item
    );
    setStatus(updatedStatus);
  
    console.log('Updated Status:', updatedStatus);
  
    // Send updated status to the backend
    const response = await fetch('/api/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, newStatus }), // Send updated data
    });
  
    if (response.ok) {
      const message = await response.text();
      console.log(message); // Log success message
    } else {
      console.error('Error updating status in backend');
    }
  };
  
const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.keys(passwords).find(user => passwords[user] === password);

    console.log('User:', user); // Log the user found
    console.log('Current Status:', status); // Log the current status array

    if (user) {
        const userStatus = status.find(item => item.name === user);
        
        console.log('User Status:', userStatus); // Log the user status object

        if (userStatus) {
            // Toggle status between 'Good' and 'Bad'
            const newStatus = userStatus.status === 'Good' ? 'Bad' : 'Good';
            handleChangeStatus(user, newStatus);
            alert(`${user}'s status updated to ${newStatus}!`);
        } else {
            alert('User not found in status list.');
        }
    } else {
        alert('Invalid password. Please try again.');
    }
    setPassword(''); // Clear input after submission
};

  return (
    <div style={{ textAlign: 'center' ,marginTop: '60px'}}>
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
