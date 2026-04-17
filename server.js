require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// GET PROJECTS
app.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// CONTACT FORM
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    await pool.query(
      "INSERT INTO contacts(name, email, message) VALUES($1,$2,$3)",
      [name, email, message]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
