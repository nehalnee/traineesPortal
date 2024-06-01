const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, './trainees.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS trainees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      place_of_birth TEXT NOT NULL,
      affiliation_number TEXT NOT NULL,
      number TEXT NOT NULL,
      card_pic_url TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log("Database and table 'trainees' created (if not exists).");
    }
    db.close((err) => {
      if (err) {
        console.error('Error closing the database connection:', err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  });
});
