const express = require('express');
const { Book, sequelize } = require('./models');

const app = express();
app.use(express.json());

// Database connection check
(async () => {
  try {
    const sequelize = require('./models/index'); // ou './db' ou autre fichier de config

    console.log('Database connected!');
    await sequelize.sync();
  } catch (error) {
    console.error('Database error:', error);
  }
})();

// Test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// GET all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, publication_year, genre } = req.body;
    
    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Title, author, and ISBN are required' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      publication_year,
      genre
    });
    
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'ISBN must be unique' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});