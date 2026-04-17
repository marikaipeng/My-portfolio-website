require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ FIXED DATABASE CONNECTION
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// TEST
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// GET PROJECTS
app.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// CONTACT API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts(name, email, message) VALUES($1,$2,$3)",
      [name, email, message]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

app.get("/messages", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM contacts ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

[
  {
    "id": 1,
    "name": "John",
    "email": "john@gmail.com",
    "message": "Hello"
  }
]
