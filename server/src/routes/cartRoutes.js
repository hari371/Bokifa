const express = require('express')
const cartController = require('../controllers/cartController')
const { authenticateToken } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', cartController.getCart)
router.post('/items', cartController.addToCart)
router.patch('/items/:itemId', cartController.updateCartItem)
router.delete('/items/:itemId', cartController.removeCartItem)

module.exports = router
