const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json()); 

const DB_FILE = './drawings.json';

let db = {};
try {
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE)); 
  }
} catch (error) {
  console.error("Error reading JSON file, initializing with empty data.");
  db = {}; 
}

app.post('/api/drawings', (req, res) => {
  const { name, shapes } = req.body; 
  db[name] = shapes; 
  fs.writeFileSync(DB_FILE, JSON.stringify(db)); 
  res.sendStatus(200); 
});

app.get('/api/drawings/:name', (req, res) => {
  const { name } = req.params;
  const shapes = db[name];
  if (shapes) {
    res.json({ shapes });
  } else {
    res.sendStatus(404);
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
