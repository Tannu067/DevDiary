# DevDiary 📓

A full-stack coding progress tracker I built for developers who want to log what they solve, track their weak topics, and stay consistent. Think of it as a personal journal for your DSA grind.

**Stack:** React · Node.js · Express · MongoDB · Chart.js · GitHub API

---

## Features

- Log problems with difficulty, tags, platform, time spent, and notes
- Dashboard with weekly progress bar chart and difficulty donut chart
- Filter problem history by difficulty and platform
- GitHub integration — connect your username and see recent commits live
- JWT-based auth so your data stays yours

---

## Project Structure

```
devdiary/
├── backend/      # Express + MongoDB API
└── frontend/     # React + Vite app
```

---

## Running Locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# add MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`. The Vite proxy handles API calls so no CORS issues locally.

---

## What I built and why

I wanted a project that I'd actually use myself. I solve problems on LeetCode regularly but never tracked which topics I was weak in — I'd keep attempting graphs problems and getting stuck but had no data to show it. This app gives that visibility.

The GitHub integration was the part I was most curious about — pulling live data from an external API and rendering it cleanly was something I hadn't done before in a personal project.

**The harder parts:**
- Chart.js setup with react-chartjs-2 required registering components manually — took some trial and error to get the charts rendering without errors
- The GitHub API has a rate limit for unauthenticated requests, so I added proper error handling for when it fails
- Getting the Vite proxy config right so `/api` calls hit the backend without needing full URLs everywhere

---

## What's next

- Add streak tracking — how many days in a row you've solved something
- Allow custom tags beyond the preset list
- Add a notes/revision section to revisit hard problems

---

*Built by Tannu Kumari | IGDTUW Delhi | 2026 Batch*
