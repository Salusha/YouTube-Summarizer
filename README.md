# YouTube Video Summarizer

AI-powered YouTube video summarizer built with React, Node.js, and Google Gemini 2.5 Flash.

Paste any YouTube link and get an instant structured summary with key points, timestamps, quotes, FAQs, and action items.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![Tech Stack](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange) ![Tech Stack](https://img.shields.io/badge/CSS-Tailwind-06B6D4)

---

## Features

- **Summary Levels** — Short, Medium, or Detailed summaries
- **Key Points** — Top takeaways extracted from the video
- **Timestamps** — Major topic transitions with time markers
- **Action Items** — Actionable recommendations from the video
- **Notable Quotes** — Important quotes translated to English
- **FAQs** — AI-generated Q&A based on the content
- **Dark Mode** — Toggle with system preference support
- **Copy to Clipboard** — Full formatted summary with toast notification
- **PDF Export** — Professional formatted PDF download
- **Smart Sampling** — Handles videos from 1 minute to 10+ hours
- **Multi-language** — Summarizes Hindi/other language videos in English

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS      |
| Backend  | Node.js + Express                   |
| AI       | Google Gemini 2.5 Flash             |
| Deploy   | Vercel (frontend) + Render (backend)|

---

## Project Structure

```
youtube-summarizer/
├── frontend/
│   └── src/
│       ├── components/       # UI components
│       ├── hooks/            # useDarkMode, useToast
│       ├── utils/            # API client, formatters
│       ├── App.jsx
│       └── main.jsx
├── backend/
│   └── src/
│       ├── controllers/      # Request handlers
│       ├── services/         # Gemini AI, transcript fetching
│       ├── utils/            # URL parser, errors, time format
│       ├── routes/           # API route definitions
│       ├── app.js            # Express + CORS config
│       └── server.js         # Entry point
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Gemini API key](https://aistudio.google.com/apikey) (free tier: 20 requests/day)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/youtube-summarizer.git
cd youtube-summarizer

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## API

### `POST /api/summarize`

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "level": "medium"
}
```

`level` options: `"short"`, `"medium"`, `"detailed"`

**Response:**
```json
{
  "title": "Video Title",
  "shortSummary": "100-word overview",
  "detailedSummary": "Detailed multi-paragraph summary",
  "keyPoints": ["Point 1", "Point 2"],
  "timestamps": [{"time": "0:00", "description": "Intro"}],
  "actionItems": ["Action 1"],
  "quotes": ["Notable quote"],
  "faqs": [{"question": "Q?", "answer": "A."}],
  "transcript": [{"text": "...", "offset": 0, "duration": 5000}]
}
```

---

## Deployment

### Backend → Render

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:** `GEMINI_API_KEY`, `FRONTEND_URL`, `NODE_ENV=production`

### Frontend → Vercel

- **Root Directory:** `frontend`
- **Framework:** Vite
- **Environment Variables:** `VITE_API_URL` (your Render backend URL)

---

## Constraints

| Constraint | Reason |
|-----------|--------|
| Private/age-restricted videos | Can't access transcript |
| Videos with no captions | Nothing to summarize |
| Live streams | No transcript available |
| Free tier | 20 requests/day |
| Very short videos (< 2 min) | Fewer sections generated |
| Very long videos (2+ hours) | Sampled from 5 sections, not word-for-word |

---

## License

MIT
