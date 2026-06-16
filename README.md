# MCQ Engine Web

React + Vite + Tailwind frontend for the MCQ Engine. Upload test banks, practice with flipable flashcards, and review your score.

## Features

- Drag-and-drop file upload or paste text
- Quiz modes: All Questions or Random Sample
- 3D flip-card UI with study hints
- Animated progress and score dashboard
- Wrong-answer review with explanations

## Setup

```bash
cd front
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173` and proxies API calls to the backend.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL |
