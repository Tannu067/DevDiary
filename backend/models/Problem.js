const mongoose = require('mongoose');

// each problem log entry — what was solved, how hard, what topics
const problemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  platform: { type: String, enum: ['LeetCode', 'Codeforces', 'HackerRank', 'Other'], default: 'LeetCode' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }], // like 'arrays', 'dp', 'graphs'
  notes: { type: String, default: '' },
  timeSpent: { type: Number, default: 0 }, // in minutes
  solved: { type: Boolean, default: true },
  solvedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
