require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// DATABASE CONNECTION
// ======================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// ======================
// GET PROJECTS API
// ======================
app.get("/projects", (req, res) => {
  res.status(200).json([
    {
      title: "Portfolio Website",
      description: "Personal portfolio with frontend and backend",
      techStack: ["HTML", "CSS", "JavaScript"]
    },
    {
      title: "Student Management",
      description: "CRUD system using Node.js",
      techStack: ["Node.js", "PostgreSQL"]
    }
  ]);
});

// ======================
// CONTACT FORM API
// ======================
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.status(200).json({ message: "✅ Message stored successfully" });

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ======================
// 🔐 LOGIN API
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple authentication (for project/demo)
  if (username === "admin" && password === "1234") {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ======================
// 📊 ADMIN PANEL API
// ======================
app.get("/admin/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
