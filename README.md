# Duostudy — Duolingo-Style AI Learning App (FastAPI + React)

Goal:
- Duolingo-like frontend UI (skill tree, animated nodes, XP/streaks basics)
- AI backend (OpenAI) that extracts text from uploaded PDFs/DOCX/TXT/images (OCR), generates flashcards, then lessons
- Supabase integration for Auth and persistence; local JSON fallback
- Single-container deploy via Docker

## Project Structure
- backend/
  - app/
    - server.py
    - ai_brains.py
    - supabase_client.py
    - storage.py
  - requirements.txt
  - .env.example
- frontend/
  - package.json
  - vite.config.js
  - tailwind.config.js
  - postcss.config.js
  - index.html
  - .env.example
  - src/
    - main.jsx
    - tailwind.css
    - api.js
    - supabaseClient.js
    - pages/ (Home.jsx, Lesson.jsx, Flashcards.jsx, Auth.jsx)
    - components/ (SkillTree.jsx, FileDrop.jsx, Flashcard.jsx, QuizEngine.jsx, TopBar.jsx)
- supabase.schema.sql
- Dockerfile

## Environment Variables
Copy `backend/.env.example` to `backend/.env` and set:
- OPENAI_API_KEY
- MODEL (optional)
- PORT (optional, default 8080)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_ANON_KEY (optional for server-to-client support)

Copy `frontend/.env.example` to `frontend/.env` and set:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Setup Supabase
1. Create a Supabase project
2. Open SQL Editor and run contents of `supabase.schema.sql`
3. Copy Project URL and keys into your env files

## Run Locally (two terminals)
Backend:
```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set envs: cp .env.example .env and fill values
uvicorn backend.app.server:app --reload --port 8080
```

Frontend:
```
cd frontend
npm ci
npm run dev
```
Vite dev server on http://localhost:3000 proxies `/api` to backend http://localhost:8080.

## Single-Container Build & Run (Docker)
```
docker build -t duostudy .
# Pass envs at runtime; for local dev you can use --env-file
# Example:
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=... \
  -e SUPABASE_URL=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e PORT=8080 \
  duostudy
```
App will be served at http://localhost:8080 (static frontend + API).

## How to Use
1. Go to frontend, register/sign in with Supabase Auth
2. Upload PDF/DOCX/TXT/IMG (OCR) on Home
3. The app extracts text, generates flashcards, creates lessons, and persists progress
4. Open lessons from Skill Tree; review flashcards

Notes:
- OpenAI calls cost tokens; control via `MODEL`
- For production, secure env vars, restrict CORS, and use HTTPS
