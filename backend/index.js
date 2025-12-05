const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const mapData = require("./mapData");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/missions", (req, res) => {
  try {
    const missions = db
      .prepare("SELECT * FROM missions ORDER BY createdAt DESC")
      .all();
    // Parse targets JSON string to array
    const missionsWithParsedTargets = missions.map((mission) => {
      if (mission.targets) {
        try {
          mission.targets = JSON.parse(mission.targets);
        } catch (e) {
          console.error(`Error parsing targets for mission ${mission.id}:`, e);
          mission.targets = null;
        }
      }
      return mission;
    });
    res.json(missionsWithParsedTargets);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ error: "Failed to fetch missions" });
  }
});

app.post("/api/missions", (req, res) => {
  try {
    const { title, date, payment, difficulty, minRating } = req.body;
    const stmt = db.prepare(`
      INSERT INTO missions (title, date, payment, difficulty, minRating)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, date, payment, difficulty, minRating);
    res.json({
      id: result.lastInsertRowid,
      message: "Mission created successfully",
    });
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ error: "Failed to create mission" });
  }
});

app.post("/api/users/:userId/missions/:missionId/accept", (req, res) => {
  try {
    const { userId, missionId } = req.params;
    const stmt = db.prepare(`
      INSERT INTO user_missions (user_id, mission_id)
      VALUES (?, ?)
    `);
    stmt.run(userId, missionId);
    res.json({ message: "Mission accepted successfully" });
  } catch (error) {
    console.error("Error accepting mission:", error);
    res.status(500).json({ error: "Failed to accept mission" });
  }
});

app.get("/api/users/:userId/missions", (req, res) => {
  try {
    const { userId } = req.params;
    const missions = db
      .prepare(
        `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.employer,
        m.date,
        m.payment,
        m.difficulty,
        m.minRating,
        m.traceProfileId,
        m.targets,
        um.status,
        um.accepted_at,
        um.completed_at
      FROM missions m
      INNER JOIN user_missions um ON m.id = um.mission_id
      WHERE um.user_id = ?
      ORDER BY um.accepted_at DESC
    `
      )
      .all(userId);
    // Parse targets JSON string to array
    const missionsWithParsedTargets = missions.map((mission) => {
      if (mission.targets) {
        try {
          mission.targets = JSON.parse(mission.targets);
        } catch (e) {
          console.error(`Error parsing targets for mission ${mission.id}:`, e);
          mission.targets = null;
        }
      }
      return mission;
    });
    res.json(missionsWithParsedTargets);
  } catch (error) {
    console.error("Error fetching user missions:", error);
    res.status(500).json({ error: "Failed to fetch user missions" });
  }
});

app.post("/api/users/:userId/missions/:missionId/complete", (req, res) => {
  try {
    const { userId, missionId } = req.params;
    const stmt = db.prepare(`
      UPDATE user_missions
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND mission_id = ?
    `);
    const result = stmt.run(userId, missionId);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Mission not found" });
    }
    res.json({ message: "Mission completed successfully" });
  } catch (error) {
    console.error("Error completing mission:", error);
    res.status(500).json({ error: "Failed to complete mission" });
  }
});

app.get("/api/nodes", (req, res) => {
  try {
    const nodes = db.prepare("SELECT * FROM nodes").all();
    res.json(nodes);
  } catch (error) {
    console.error("Error fetching nodes:", error);
    res.status(500).json({ error: "Failed to fetch nodes" });
  }
});

app.get("/api/data", (req, res) => {
  res.json(mapData);
});

app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db
      .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
      .get(username, password);

    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          money: user.money,
          rating: user.rating,
          xp: user.xp,
        },
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to process login" });
  }
});

app.delete("/api/users/:userId/missions/:missionId/abandon", (req, res) => {
  try {
    const { userId, missionId } = req.params;
    const stmt = db.prepare(`
      DELETE FROM user_missions
      WHERE user_id = ? AND mission_id = ?
    `);
    const result = stmt.run(userId, missionId);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Mission not found for this user" });
    }
    res.json({ message: "Mission abandoned successfully" });
  } catch (error) {
    console.error("Error abandoning mission:", error);
    res.status(500).json({ error: "Failed to abandon mission" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Database connected: ${db.name}`);
});
