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

  const ensureColumn = (table, column, definition) => {
    const info = db.prepare(`PRAGMA table_info(${table})`).all();
    const hasColumn = info.some((col) => col.name === column);
    if (!hasColumn) {
      db.prepare(
        `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`
      ).run();
      console.log(`Added column ${column} to ${table}`);
    }
  };

  /**
   * Ensure a table includes all required columns without dropping data.
   * Only adds columns that can be safely appended via ALTER TABLE.
   */
  const ensureTableHasColumns = (table, requiredDefinitions) => {
    const info = db.prepare(`PRAGMA table_info(${table})`).all();
    const names = new Set(info.map((col) => col.name));
    const missing = Object.entries(requiredDefinitions).filter(
      ([col]) => !names.has(col)
    );

    missing.forEach(([column, definition]) => {
      const disallowed =
        definition.toLowerCase().includes("primary key") ||
        definition.toLowerCase().includes("unique");
      if (disallowed) {
        console.warn(
          `Skipped adding column ${column} to ${table} because constraints require manual migration.`
        );
        return;
      }
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
      console.log(`Added missing column ${column} to ${table}`);
    });
  };

  const tableColumnDefinitions = {
    nodes: {
      id: "TEXT",
      top: "INTEGER",
      left: "INTEGER",
      name: "TEXT",
      admin: "BOOLEAN DEFAULT 0",
      account: "BOOLEAN DEFAULT 0",
      active: "BOOLEAN DEFAULT 0",
      password: "TEXT",
      securityTier: "TEXT",
      traceProfileId: "TEXT",
      hasTrace: "BOOLEAN DEFAULT 0",
    },
    missions: {
      id: "INTEGER",
      title: "TEXT",
      description: "TEXT",
      employer: "TEXT",
      date: "TEXT",
      payment: "INTEGER",
      difficulty: "INTEGER",
      minRating: "INTEGER",
      traceProfileId: "TEXT",
      targets: "TEXT",
    },
  };

  db.exec(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      employer TEXT NOT NULL,
      date TEXT NOT NULL,
      payment INTEGER NOT NULL,
      difficulty INTEGER NOT NULL,
      minRating INTEGER NOT NULL,
      traceProfileId TEXT,
      targets TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  ensureColumn("missions", "description", "TEXT");
  ensureColumn("missions", "employer", "TEXT");
  ensureColumn("missions", "traceProfileId", "TEXT");
  ensureColumn("missions", "targets", "TEXT");
  ensureTableHasColumns("missions", tableColumnDefinitions.missions);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      money INTEGER DEFAULT 1000,
      rating INTEGER DEFAULT 13,
      xp INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  ensureColumn("users", "xp", "INTEGER DEFAULT 0");

  db.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id TEXT PRIMARY KEY,
      top INTEGER NOT NULL,
      left INTEGER NOT NULL,
      name TEXT NOT NULL,
      admin BOOLEAN DEFAULT 0,
      account BOOLEAN DEFAULT 0,
      active BOOLEAN DEFAULT 0,
      password TEXT,
      securityTier TEXT,
      traceProfileId TEXT,
      hasTrace BOOLEAN DEFAULT 0
    )
  `);
  ensureColumn("nodes", "securityTier", "TEXT");
  ensureColumn("nodes", "traceProfileId", "TEXT");
  ensureColumn("nodes", "hasTrace", "BOOLEAN DEFAULT 0");
  ensureTableHasColumns("nodes", tableColumnDefinitions.nodes);

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
            INSERT INTO users (username, password, money, rating, xp)
            VALUES (?, ?, ?, ?, ?)
        `);
    stmt.run("demo", "demo123", 1000, 13, 420);
    console.log('Demo user created: username="demo", password="demo123"');
  } else {
    db.prepare("UPDATE users SET xp = ? WHERE username = ?").run(420, "demo");
  }

  const nodes = [
    {
      id: "personal_gateway",
      top: 280,
      left: 190,
      name: "Gateway",
      admin: 1,
      account: 0,
      active: 0,
      password: null,
      securityTier: "low",
      traceProfileId: null,
      hasTrace: 0,
    },
    {
      id: "internal_1",
      top: 500,
      left: 350,
      name: "Nordsec Internal Services",
      admin: 0,
      account: 1,
      active: 0,
      password: "pass123",
      securityTier: "low",
      traceProfileId: "high",
      hasTrace: 1,
    },
    {
      id: "public_access_1",
      top: 300,
      left: 800,
      name: "SilentWave Public Access Server",
      admin: 0,
      account: 0,
      active: 0,
      password: null,
      securityTier: "public",
      traceProfileId: null,
      hasTrace: 0,
    },
    {
      id: "internal_2",
      top: 420,
      left: 420,
      name: "SilentWave Internal Services",
      admin: 0,
      account: 0,
      active: 0,
      password: "catslol",
      securityTier: "low",
      traceProfileId: "high",
      hasTrace: 1,
    },
    {
      id: "bank_1",
      top: 200,
      left: 250,
      name: "Helix Finance Group",
      admin: 1,
      account: 0,
      active: 1,
      password: "rosebud",
      securityTier: "medium",
      traceProfileId: "medium",
      hasTrace: 1,
    },
    {
      id: "mainframe_1",
      top: 150,
      left: 600,
      name: "Cryo-Dyne Systems Mainframe",
      admin: 1,
      account: 0,
      active: 1,
      password: "icebreaker",
      securityTier: "high",
      traceProfileId: "medium",
      hasTrace: 1,
    },
  ];

  nodes.forEach((node) => {
    const existingNode = db
      .prepare("SELECT id FROM nodes WHERE id = ?")
      .get(node.id);
    if (!existingNode) {
      const stmt = db.prepare(`
        INSERT INTO nodes (id, top, left, name, admin, account, active, password, securityTier, traceProfileId, hasTrace)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        node.id,
        node.top,
        node.left,
        node.name,
        node.admin,
        node.account,
        node.active,
        node.password,
        node.securityTier,
        node.traceProfileId,
        node.hasTrace
      );
      console.log(`Node added: "${node.name}"`);
    } else {
      db.prepare(
        `UPDATE nodes 
         SET securityTier = COALESCE(securityTier, ?),
             traceProfileId = COALESCE(traceProfileId, ?),
             hasTrace = COALESCE(hasTrace, ?)
         WHERE id = ?`
      ).run(node.securityTier, node.traceProfileId, node.hasTrace, node.id);
    }
  });

  // Add initial missions if they don't exist
  const missions = [
    {
      id: 1,
      title: "Extract credentials from a low-security intranet node",
      description:
        "A small firm needs access to an employee portal they locked themselves out of. Break into their intranet server, run a password-breaker on the 'auth.txt' file, and return the recovered credentials.",
      employer: "NordSec Consultants",
      date: "2023-10-01",
      payment: 900,
      difficulty: 1,
      minRating: 1,
      traceProfileId: null,
      targets: JSON.stringify([
        { nodeId: "internal_1", objective: "crack", filePattern: "auth.txt" },
      ]),
    },
    {
      id: 2,
      title: "Purge access logs from a regional data relay",
      description:
        "A client was caught snooping where they shouldn't have been. Remotely access the relay node, locate 'connection.log', and delete all entries from the last 24 hours. Cover your tracks and avoid triggering the trace.",
      employer: "SilentWave Analytics",
      date: "2023-10-02",
      payment: 1400,
      difficulty: 2,
      minRating: 2,
      traceProfileId: null,
      targets: JSON.stringify([
        {
          nodeId: "internal_2",
          objective: "delete",
          filePattern: "connection.log",
        },
      ]),
    },
    {
      id: 3,
      title: "Copy classified project file from a corporate mainframe",
      description:
        "A rival corporation needs the blueprints for a classified project codenamed 'Atlas'. Infiltrate the Cryo-Dyne Systems mainframe, locate the file 'proj_atlas.tar.gz' in the File Server, and copy it to your hard drive. Admin access is required — break the password first.",
      employer: "Obsidian Dynamics",
      date: "2023-10-03",
      payment: 2200,
      difficulty: 3,
      minRating: 2,
      traceProfileId: null,
      targets: JSON.stringify([
        {
          nodeId: "mainframe_1",
          objective: "copy",
          filePattern: "proj_atlas.tar.gz",
          adminRequired: true,
        },
      ]),
    },
    {
      id: 4,
      title: "Recover a corrupted report from a corporate fileserver",
      description:
        "A corrupted financial report is stuck behind basic security. Break into the fileserver, navigate to /reports/q3/, and copy 'ledger-final.dat' to your workspace. Expect mild intrusion countermeasures.",
      employer: "Helix Finance Group",
      date: "2023-10-03",
      payment: 1800,
      difficulty: 3,
      minRating: 3,
      traceProfileId: null,
      targets: JSON.stringify([
        {
          nodeId: "bank_1",
          objective: "copy",
          filePattern: "ledger-final.dat",
          adminRequired: true,
        },
      ]),
    },
  ];

  missions.forEach((mission) => {
    const existingMission = db
      .prepare("SELECT id FROM missions WHERE id = ?")
      .get(mission.id);
    if (!existingMission) {
      const stmt = db.prepare(`
                INSERT INTO missions (id, title, date, payment, difficulty, minRating, description, employer, traceProfileId, targets)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
      stmt.run(
        mission.id,
        mission.title,
        mission.date,
        mission.payment,
        mission.difficulty,
        mission.minRating,
        mission.description,
        mission.employer,
        mission.traceProfileId,
        mission.targets
      );
      console.log(`Mission added: "${mission.title}"`);
    } else {
      db.prepare(
        `UPDATE missions
         SET title = ?, description = ?, employer = ?, payment = ?, difficulty = ?, minRating = ?, traceProfileId = ?, targets = ?
         WHERE id = ?`
      ).run(
        mission.title,
        mission.description,
        mission.employer,
        mission.payment,
        mission.difficulty,
        mission.minRating,
        mission.traceProfileId,
        mission.targets,
        mission.id
      );
    }
  });

  console.log("Database initialized successfully");
}

initDatabase();

module.exports = db;
