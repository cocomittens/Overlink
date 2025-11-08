const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "database.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

function initDatabase() {
  // db.exec("DROP TABLE IF EXISTS missions;");

  db.exec(`
    CREATE TABLE missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      employer TEXT NOT NULL,
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mission_id INTEGER NOT NULL,
      status TEXT DEFAULT 'accepted',
      accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
      UNIQUE(user_id, mission_id)
    )
  `);

  // Add demo user for now until auth is implemented
  const existingUser = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get("demo");
  if (!existingUser) {
    const stmt = db.prepare(`
            INSERT INTO users (username, password, money, rating)
            VALUES (?, ?, ?, ?)
        `);
    stmt.run("demo", "demo123", 1000, 13);
    console.log('Demo user created: username="demo", password="demo123"');
  }

  // Add initial missions if they don't exist
  const missions = [
    {
      id: 1,
      title: "Falsify a social security document",
      description: "Test decription 1",
      employer: "Test company 1",
      date: "2023-10-01",
      payment: 5300,
      difficulty: 4,
      minRating: 12,
    },
    {
      id: 2,
      title: "Find and destroy crucial data on a mainframe",
      date: "2023-10-02",
      employer: "Test company 2",
      description: "Test decription 2",
      payment: 1700,
      difficulty: 2,
      minRating: 14,
    },
    {
      id: 3,
      title: "Break into a rival computer system and sabotage files",
      description: "Test decription 3",
      employer: "Test company 3",
      date: "2023-10-03",
      payment: 1600,
      difficulty: 2,
      minRating: 15,
    },
  ];

  missions.forEach((mission) => {
    const existingMission = db
      .prepare("SELECT id FROM missions WHERE id = ?")
      .get(mission.id);
    if (!existingMission) {
      const stmt = db.prepare(`
                INSERT INTO missions (id, title, date, payment, difficulty, minRating, description, employer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
      stmt.run(
        mission.id,
        mission.title,
        mission.date,
        mission.payment,
        mission.difficulty,
        mission.minRating,
        mission.description,
        mission.employer
      );
      console.log(`Mission added: "${mission.title}"`);
    }
  });

  console.log("Database initialized successfully");
}

initDatabase();

module.exports = db;
