require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Contact form API
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(200).json({ message: "Message saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
