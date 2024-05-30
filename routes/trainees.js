const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.affiliationNumber}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
const db = new sqlite3.Database('./trainees.db');

// Submit trainee information
router.post('/submit', upload.single('cardPic'), (req, res) => {
  const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
  const file = req.file;

  // Validate input
  if (!fullName || !age || !gender || !placeOfBirth || !affiliationNumber || !number || !file) {
    console.error('All fields are required.');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const cardPicUrl = `/uploads/${affiliationNumber}_${file.originalname}`;

  const query = `
    INSERT INTO trainees (full_name, age, gender, place_of_birth, affiliation_number, number, card_pic_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPicUrl];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Trainee info submitted successfully!');
    res.status(201).json({ message: 'Trainee info submitted successfully!' });
  });
});

// Edit trainee information
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;

  if (!fullName || !age || !gender || !placeOfBirth || !affiliationNumber || !number) {
    console.error('All fields are required.');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    UPDATE trainees
    SET full_name = ?, age = ?, gender = ?, place_of_birth = ?, affiliation_number = ?, number = ?
    WHERE id = ?
  `;
  const params = [fullName, age, gender, placeOfBirth, affiliationNumber, number, id];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Trainee info updated successfully!');
    res.status(200).json({ message: 'Trainee info updated successfully!' });
  });
});

// Delete trainee information
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM trainees WHERE id = ?`;
  const params = [id];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Trainee info deleted successfully!');
    res.status(200).json({ message: 'Trainee info deleted successfully!' });
  });
});

router.post('/submit', upload.single('cardPic'), (req, res) => {
  const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
  const file = req.file;

  // Log received data for debugging
  console.log('Received data:', { fullName, age, gender, placeOfBirth, affiliationNumber, number });
  console.log('Received file:', file);

  // Validate input
  if (!fullName || !age || !gender || !placeOfBirth || !affiliationNumber || !number || !file) {
    console.error('All fields are required.');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const cardPicUrl = `/uploads/${affiliationNumber}_${file.originalname}`;

  const query = `
    INSERT INTO trainees (full_name, age, gender, place_of_birth, affiliation_number, number, card_pic_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPicUrl];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Trainee info submitted successfully!');
    res.status(201).json({ message: 'Trainee info submitted successfully!' });
  });
});

module.exports = router;
