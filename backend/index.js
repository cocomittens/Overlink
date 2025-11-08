const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/missions', (req, res) => {
  try {
    const missions = db.prepare('SELECT * FROM missions ORDER BY createdAt DESC').all();
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

app.post('/api/missions', (req, res) => {
  try {
    const { title, date, payment, difficulty, minRating } = req.body;
    const stmt = db.prepare(`
      INSERT INTO missions (title, date, payment, difficulty, minRating)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, date, payment, difficulty, minRating);
    res.json({ id: result.lastInsertRowid, message: 'Mission created successfully' });
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

app.get('/api/nodes', (req, res) => {
  try {
    const nodes = db.prepare('SELECT * FROM nodes').all();
    res.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, money: user.money, rating: user.rating } });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Database connected: ${db.name}`);
});
