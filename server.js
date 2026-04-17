require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// ✅ CORS (allow GitHub Pages + localhost)
app.use(cors({
    origin: "*"
}));

app.use(express.json());

// ✅ DATABASE
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ✅ PROJECTS API
app.get("/projects", (req, res) => {
    res.json([
        {
            title: "Portfolio Website",
            description: "Personal portfolio using HTML, CSS, JS",
            techstack: ["HTML", "CSS", "JavaScript"]
        },
        {
            title: "Backend API",
            description: "Node.js + Express + PostgreSQL API",
            techstack: ["Node.js", "Express", "PostgreSQL"]
        }
    ]);
});

// ✅ CONTACT API
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields required" });
        }

        await pool.query(
            "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );

        res.json({ success: true, message: "Message saved" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
