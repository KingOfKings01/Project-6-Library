const express = require('express')
const BookContainer = require('../controller/BookController')
const router = express.Router()

router.post('/book', BookContainer.createBook)
router.get('/book', BookContainer.getBooks)
router.get('/book/:id', BookContainer.getBookById)
router.delete('/book/:id', BookContainer.deleteBook)

module.exports = router