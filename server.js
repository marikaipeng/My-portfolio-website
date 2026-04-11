require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ======================
// DATABASE CONNECTION
// ======================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

// Test DB
pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ======================
// PROJECTS API
// ======================
app.get("/projects", (req, res) => {
  res.json([
    {
      title: "Portfolio Website",
      description: "Personal portfolio",
      techStack: ["HTML", "CSS", "JS"]
    },
    {
      title: "Student Management",
      description: "CRUD App",
      techStack: ["Node.js", "PostgreSQL"]
    }
  ]);
});

// ======================
// CONTACT API
// ======================
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    await pool.query(
      "INSERT INTO contacts (name,email,message) VALUES ($1,$2,$3)",
      [name, email, message]
    );

    res.json({ message: "✅ Message saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ======================
// LOGIN API
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// ======================
// ADMIN API
// ======================
app.get("/admin/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY id DESC");
    res.json(result.rows);
  } catch {
    res.status(500).send("Error");
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
