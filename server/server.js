const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const dataPath = path.join(__dirname, 'data.json');

// Endpoint to get status data
app.get('/api/status', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' }); // Return JSON error response
      }
      
      try {
        const parsedData = JSON.parse(data);
        console.log('Data read from file:', parsedData); // Log the data
        res.json(parsedData);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Error parsing JSON' }); // Handle parsing errors
      }
    });
  });
// Endpoint to update status
app.post('/api/status', (req, res) => {
  const { name, newStatus } = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const jsonData = JSON.parse(data);

    const updatedData = jsonData.map(item =>
      item.name === name ? { ...item, status: newStatus } : item
    );

    fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.send('Status updated successfully');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});