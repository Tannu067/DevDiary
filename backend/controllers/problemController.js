const Problem = require('../models/Problem');

// log a new problem
const addProblem = async (req, res) => {
  const { title, platform, difficulty, tags, notes, timeSpent, solved } = req.body;
  try {
    const problem = await Problem.create({
      user: req.user.id,
      title, platform, difficulty, tags, notes, timeSpent, solved,
    });
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all problems for logged in user — with optional filters
const getProblems = async (req, res) => {
  const { difficulty, tag, platform } = req.query;
  const filter = { user: req.user.id };

  if (difficulty) filter.difficulty = difficulty;
  if (platform) filter.platform = platform;
  if (tag) filter.tags = tag; // matches if tag is in tags array

  try {
    const problems = await Problem.find(filter).sort({ solvedAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete a logged problem
const deleteProblem = async (req, res) => {
  try {
    await Problem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// weekly progress — how many problems solved each day this week
const getWeeklyStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const problems = await Problem.find({
      user: req.user.id,
      solvedAt: { $gte: sevenDaysAgo },
    });

    // group by date
    const stats = {};
    problems.forEach((p) => {
      const date = p.solvedAt.toISOString().split('T')[0];
      stats[date] = (stats[date] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// overall summary — total solved, by difficulty, by tag
const getSummary = async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.user.id });

    const summary = {
      total: problems.length,
      easy: problems.filter((p) => p.difficulty === 'Easy').length,
      medium: problems.filter((p) => p.difficulty === 'Medium').length,
      hard: problems.filter((p) => p.difficulty === 'Hard').length,
      tags: {},
    };

    // count how many times each tag appears
    problems.forEach((p) => {
      p.tags.forEach((tag) => {
        summary.tags[tag] = (summary.tags[tag] || 0) + 1;
      });
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProblem, getProblems, deleteProblem, getWeeklyStats, getSummary };
