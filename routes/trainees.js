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
  const { name, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
  const file = req.file;

  // Validate input
  if (!name || !age || !gender || !placeOfBirth || !affiliationNumber || !number || !file) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const cardPicUrl = `/uploads/${affiliationNumber}_${file.originalname}`;

  const query = `
    INSERT INTO trainees (name, age, gender, place_of_birth, affiliation_number, number, card_pic_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [name, age, gender, placeOfBirth, affiliationNumber, number, cardPicUrl];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Trainee info submitted successfully!' });
  });
});

// Edit trainee information
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender, placeOfBirth, affiliationNumber, number } = req.body;

  if (!name || !age || !gender || !placeOfBirth || !affiliationNumber || !number) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    UPDATE trainees
    SET name = ?, age = ?, gender = ?, place_of_birth = ?, affiliation_number = ?, number = ?
    WHERE id = ?
  `;
  const params = [name, age, gender, placeOfBirth, affiliationNumber, number, id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
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
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Trainee info deleted successfully!' });
  });
});

module.exports = router;
