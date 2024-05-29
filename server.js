const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const db = new sqlite3.Database('./trainees.db');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize the database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS trainees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      place_of_birth TEXT,
      affiliation_number TEXT NOT NULL,
      number TEXT,
      card_pic_url TEXT NOT NULL
    )
  `);
});

// Routes
const traineeRoutes = require('./routes/trainees');
const viewRoutes = require('./routes/view');
app.use('/api/trainees', traineeRoutes);
app.use('/view', viewRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
