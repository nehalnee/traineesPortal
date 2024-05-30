const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./trainees.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE trainees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      place_of_birth TEXT NOT NULL,
      affiliation_number TEXT NOT NULL,
      number TEXT NOT NULL,
      card_pic_url TEXT NOT NULL
    );
  `);

  console.log('Database schema created.');
});

db.close();
