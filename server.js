const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();

// Determine the database file path
const dbPath = path.resolve(__dirname, 'trainees.db'); // Adjust the path as necessary
console.log(`Database path: ${dbPath}`);

// Initialize the database connection
let db;
try {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(`Failed to connect to the database at ${dbPath}:`, err.message);
            process.exit(1);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });
} catch (error) {
    console.error(`Error initializing the database connection: ${error.message}`);
    process.exit(1);
}

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'submit-portal/uploads')));

// Initialize the database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS trainees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
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
const submitRoutes = require('./submit-portal/routes/submitRoutes'); // Adjusted the routes path
app.use('/api', submitRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
