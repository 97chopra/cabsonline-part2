const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Rti1400chopra',
  database: 'cabsonline'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const { booking_ref, cname, phone, snumber, stname, sbname, dsbname, pickup_date, pickup_time } = req.body;
  const sql = `INSERT INTO bookings (booking_ref, cname, phone, snumber, stname, sbname, dsbname, pickup_date, pickup_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [booking_ref, cname, phone, snumber, stname, sbname, dsbname, pickup_date, pickup_time], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Booking created!', id: result.insertId });
  });
});

// Get booking by reference
app.get('/api/bookings/:ref', (req, res) => {
  db.query('SELECT * FROM bookings WHERE booking_ref = ?', [req.params.ref], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(results[0]);
  });
});

// Update booking status
app.put('/api/bookings/:ref/status', (req, res) => {
  const { status } = req.body;
  db.query('UPDATE bookings SET status = ? WHERE booking_ref = ?', [status, req.params.ref], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated!' });
  });
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
  db.query('SELECT * FROM reviews ORDER BY review_datetime DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Submit a review
app.post('/api/reviews', (req, res) => {
  const { booking_ref, cname, rating, comment } = req.body;
  const sql = `INSERT INTO reviews (booking_ref, cname, rating, comment) VALUES (?, ?, ?, ?)`;
  db.query(sql, [booking_ref, cname, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Review submitted!', id: result.insertId });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));