const Book = require("../models/Book");

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body); // Use "await Book.create(req.body)" to save and create the book
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll(); // Use lowercase "books" to avoid conflict
    res.json(books);
  } catch (err) {
    console.log(err);
  }
};

// Get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id); // Use lowercase "book" to avoid conflict
    if (!book) return res.status(404).json({ message: "Book not found" }); // Return 404 if the book is not found
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id); // Use lowercase "book" to avoid conflict
    if (!book) return res.status(404).json({ message: "Book not found" }); // Return 404 if the book is not found
    
    await book.destroy(); // Use "book.destroy()" to delete the book
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
