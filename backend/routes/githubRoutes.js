const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getCommits, getProfile } = require('../controllers/githubController');

router.get('/commits', protect, getCommits);
router.get('/profile', protect, getProfile);

module.exports = router;
