const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ _id: user._id, name: user.name, email: user.email, githubUsername: user.githubUsername, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// save github username to user profile
const updateGithub = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { githubUsername: req.body.githubUsername },
      { new: true }
    );
    res.json({ githubUsername: user.githubUsername });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, updateGithub };
