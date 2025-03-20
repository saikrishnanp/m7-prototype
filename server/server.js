// filepath: d:\React Projects\test-and-learn-project\server\server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const dataFilePath = path.join(__dirname, './data/dummy.json');

// API to read the contents of dummy.json
app.get('/api/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });

  fs.stat(dataFilePath, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    console.log(stats);
  });
});

// API to update the contents of dummy.json
app.post('/api/data', (req, res) => {
  const newData = req.body;

  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update data' });
    }

    res.json({ message: 'Data updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});