// authRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { register, login, updateGithub } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.put('/github', protect, updateGithub);

module.exports = router;
