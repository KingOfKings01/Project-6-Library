const Book = require("../models/Book");

exports.createBook = async (req, res) => {
  try {
    const Book = new Book(req.body);
    Book.save();
    res.status(201).json(Book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const Book = await Book.findByPk(req.params.id);
    if (!Book) return res.json({ message: "Book not found" });
    res.json(Book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const Book = await Book.findByPk(req.params.id);
    await Book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}