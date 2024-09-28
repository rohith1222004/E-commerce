const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController')
const {authenticateToken, authorizeRole} = require('../middleware/authMiddleware')

router.post('/register', authController.register)
router.post('/login',authController.login)

module.exports = router