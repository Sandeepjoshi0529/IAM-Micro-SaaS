// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // if you plan to use cookies
  })
);

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Debug DB connection
pool.query("SELECT current_database() AS db", (err, result) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("Connected to DB:", result.rows[0].db);
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "Access denied" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// ----------------------
// Register Route
// ----------------------
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  
  try {
    // Check if the user already exists by querying the app_users table
    const userQuery = await pool.query(
      "SELECT * FROM public.app_users WHERE email = $1",
      [email]
    );
    if (userQuery.rows.length > 0) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert the new user into the database and return the created user
    const insertQuery = await pool.query(
      "INSERT INTO public.app_users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    
    return res
      .status(201)
      .json({ message: "User registered successfully.", user: insertQuery.rows[0] });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// ----------------------
// Login Route
// ----------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Retrieve the user from the database
    const result = await pool.query("SELECT * FROM public.app_users WHERE email = $1", [email]);
    if (!result.rows.length) return res.status(401).json({ error: "Invalid credentials" });
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    
    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ----------------------
// Protected Routes (require valid token)
// ----------------------

// Get all users
app.get("/users", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM public.app_users");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a user (example; adjust fields as needed)
app.post("/users", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO public.app_users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a user by ID
app.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE public.app_users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a user by ID
app.delete("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM public.app_users WHERE id = $1 RETURNING *",
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Verify token route (protected route to confirm token validity)
app.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ valid: true });
});

// ----------------------
// Public Routes
// ----------------------

// Health check route to verify the server is running
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root route: returns current database time
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send("Database error");
  }
});

// ----------------------
// Start the Server
// ----------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
