const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { addProblem, getProblems, deleteProblem, getWeeklyStats, getSummary } = require('../controllers/problemController');

router.post('/', protect, addProblem);
router.get('/', protect, getProblems);
router.delete('/:id', protect, deleteProblem);
router.get('/weekly', protect, getWeeklyStats);
router.get('/summary', protect, getSummary);

module.exports = router;
