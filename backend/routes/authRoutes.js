const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// For initial admin/user setup, restrict in production
router.post('/register', registerUser); // Consider protecting this with authorize('admin') after first admin is created
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;