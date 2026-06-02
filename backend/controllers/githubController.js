const axios = require('axios');
const User = require('../models/User');

// fetch recent commits from GitHub public API
const getCommits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const username = user.githubUsername;

    if (!username) {
      return res.status(400).json({ message: 'No GitHub username saved. Add it in settings.' });
    }

    // get all public repos first
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
      headers: { 'User-Agent': 'devdiary-app' }
    });

    // get commits from the most recently updated repo
    const recentRepo = reposRes.data[0];
    if (!recentRepo) return res.json({ commits: [], repoName: null });

    const commitsRes = await axios.get(
      `https://api.github.com/repos/${username}/${recentRepo.name}/commits?per_page=10`,
      { headers: { 'User-Agent': 'devdiary-app' } }
    );

    const commits = commitsRes.data.map((c) => ({
      message: c.commit.message,
      date: c.commit.author.date,
      sha: c.sha.slice(0, 7),
      url: c.html_url,
    }));

    res.json({ commits, repoName: recentRepo.name, repoUrl: recentRepo.html_url });
  } catch (err) {
    // GitHub API rate limit or wrong username
    res.status(500).json({ message: 'Could not fetch GitHub data. Check username or try later.' });
  }
};

// get contribution summary — repos count and recent activity
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const username = user.githubUsername;
    if (!username) return res.status(400).json({ message: 'No GitHub username saved' });

    const profileRes = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'devdiary-app' }
    });

    const { public_repos, followers, following, avatar_url, html_url, bio } = profileRes.data;
    res.json({ username, public_repos, followers, following, avatar_url, html_url, bio });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch GitHub profile' });
  }
};

module.exports = { getCommits, getProfile };
