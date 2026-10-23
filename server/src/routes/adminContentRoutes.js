const express = require('express')
const controller = require('../controllers/adminContentController')
const {
	authenticateToken,
	requireAdmin,
} = require('../middleware/authMiddleware')
const createImageUpload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.use(authenticateToken, requireAdmin)

router.get('/authors', controller.getAuthors)
router.post('/authors', createImageUpload('authors'), controller.createAuthor)
router.put('/authors/:id', createImageUpload('authors'), controller.updateAuthor)
router.delete('/authors/:id', controller.deleteAuthor)

router.get('/books', controller.getBooks)
router.post('/books', createImageUpload('books'), controller.createBook)
router.put('/books/:id', createImageUpload('books'), controller.updateBook)
router.delete('/books/:id', controller.deleteBook)

router.get('/blogs', controller.getBlogs)
router.post('/blogs', createImageUpload('blogs'), controller.createBlog)
router.put('/blogs/:id', createImageUpload('blogs'), controller.updateBlog)
router.delete('/blogs/:id', controller.deleteBlog)

module.exports = router
