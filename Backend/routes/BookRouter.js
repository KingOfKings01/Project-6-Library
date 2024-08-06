const express = require('express')
const BookContainer = require('../controller/BookController')
const router = express.Router()

router.post('/Book', BookContainer.createBook)
router.get('/Book/:id', BookContainer.getBookById)
router.delete('/Book/:id', BookContainer.deleteBook)

module.exports = router