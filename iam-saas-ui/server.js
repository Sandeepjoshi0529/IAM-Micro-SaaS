require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);  // For debugging

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
