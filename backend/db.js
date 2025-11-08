const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function initDatabase() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      payment INTEGER NOT NULL,
      difficulty INTEGER NOT NULL,
      minRating INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      money INTEGER DEFAULT 1000,
      rating INTEGER DEFAULT 13,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id TEXT PRIMARY KEY,
      top INTEGER NOT NULL,
      left INTEGER NOT NULL,
      name TEXT NOT NULL,
      admin BOOLEAN DEFAULT 0,
      account BOOLEAN DEFAULT 0,
      active BOOLEAN DEFAULT 0,
      password TEXT
    )
  `);

    console.log('Database initialized successfully');
}

initDatabase();

module.exports = db;

