const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://turtlewebsite.github.io',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Status API is running');
});

let statusData = [
  { name: 'Shreyes', status: 'Good' },
  { name: 'Gus', status: 'Good' },
  { name: 'Logan', status: 'Good' },
  { name: 'Jacob', status: 'Good' }
];

app.get('/api/status', (req, res) => {
  res.json(statusData);
});

app.post('/api/status', (req, res) => {
  const { name, newStatus } = req.body;
  
  try {
    statusData = statusData.map(item =>
      item.name === name ? { ...item, status: newStatus } : item
    );
    res.json({ success: true, data: statusData });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});