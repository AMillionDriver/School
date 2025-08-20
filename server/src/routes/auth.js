const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', protect, authController.getMe);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;
