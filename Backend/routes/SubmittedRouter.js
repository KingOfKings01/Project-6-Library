const express = require('express')
const SubmittedContainer = require('../controller/SubmittedController')
const router = express.Router()

router.post('/submitted', SubmittedContainer.createSubmitted)
router.get('/submitted', SubmittedContainer.getAll)

module.exports = router