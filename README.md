# QuizCard Web

React + Vite frontend for QuizCard — an AI-driven MCQ study app built on the **Core Intelligence** design system.

## Design

- Dark-first UI with electric green (`#4edea3`) accents
- Inter + Geist typography
- Glassmorphic cards, segmented toggles, and bottom navigation
- See `../DESIGN.md` for full tokens and [Stitch prototype](https://stitch.withgoogle.com/preview/1448183802800799043?node-id=fefc0b1e4537487db660a031ee855921)

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
