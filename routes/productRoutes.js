const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')   
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware')

router.get('/', productController.getProduct)
router.get('/:id', productController.getProduct)

router.post('/create',authenticateToken,authorizeRole('admin'),productController.createProduct)

module.exports = router