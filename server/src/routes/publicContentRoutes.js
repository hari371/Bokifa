const express = require('express')
const controller = require('../controllers/adminContentController')

const router = express.Router()

router.get('/books', controller.getBooks)
router.get('/authors', controller.getAuthors)
router.get('/blogs', controller.getBlogs)

module.exports = router