const express = require('express')
const SubmittedContainer = require('../controller/SubmittedController')
const router = express.Router()

router.post('/Submitted', SubmittedContainer.createSubmitted)
router.get('/Submitted', SubmittedContainer.getAll)

module.exports = router