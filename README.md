# COA Student Portfolio + Interactive COA Laboratory

**Student:** Prateek · UID: 25BAI10050  
**Programme:** B.Tech Computer Science & Engineering (AI & ML / Generative AI · CS235)  
**University:** Chandigarh University  
**Year:** First Year (2025–2026)

---

## Overview

A full-stack portfolio and interactive Computer Organization & Architecture (COA) learning toolkit comprising:

- **Portfolio** — Landing, Home, About, Achievements pages with factual academic data
- **COA Lab** — Three interactive tools: Instruction Set Simulator, Number System Converter, and a persistent Assignments manager
- **Backend API** — FastAPI + SQLAlchemy with PostgreSQL (production) / SQLite (local dev)

---

## Features

| Feature | Details |
|---|---|
| **ISS** | Shunting-yard infix→postfix; generates three-, two-, one-, and zero-address code |
| **Number Converter** | BigInt-based; supports any base 2–36; live conversion |
| **Assignments** | Persistent CRUD via API; Bearer-token admin auth; search + filter |
| **Achievements** | Data-driven; category filter + search; no fabricated claims |
| **Resume** | Download button with graceful "coming soon" fallback |

---

## Stack

**Frontend:** React 18 · Vite 8 · Tailwind CSS 3 · React Router v7 · lucide-react  
**Backend:** Python 3.11+ · FastAPI · SQLAlchemy 2 · Pydantic v2 · psycopg2  
**Database:** PostgreSQL (production) · SQLite (local dev fallback)  
**Testing:** Vitest · 49 unit tests (ISS + Number Converter)  
**Fonts:** Space Grotesk · JetBrains Mono (via Google Fonts)

---

## Architecture

```
Browser
  │
  ├── Static Frontend (Render Static Site)
  │     React SPA → /dist
  │
  └── FastAPI Backend (Render Web Service)
        │
        └── PostgreSQL (Render Managed DB)
```

---

## Local Setup (Windows)

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone and enter the project

```powershell
git clone https://github.com/Prateekinnovates/YOUR_REPO_NAME.git
cd coa-portfolio
```

### 2. Frontend

```powershell
npm install
```

Create `.env` in the project root:
```
VITE_API_URL=http://localhost:8000
```

Start dev server:
```powershell
npm run dev
```
→ Opens at `http://localhost:5173`

Run unit tests:
```powershell
npm run test
```

Build for production:
```powershell
npm run build
```

### 3. Backend

```powershell
cd server
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `server/.env` (or set env vars in shell):
```
DATABASE_URL=           # leave empty to use SQLite locally
COA_ADMIN_TOKEN=your-secret-token-here
FRONTEND_ORIGIN=http://localhost:5173
```

Start the API:
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
→ API at `http://localhost:8000`  
→ Swagger docs at `http://localhost:8000/docs`

---

## Environment Variables

| Variable | Where | Required | Description |
|---|---|---|---|
| `VITE_API_URL` | Frontend `.env` | Yes (prod) | Backend URL, no trailing slash |
| `DATABASE_URL` | Backend `.env` | No (uses SQLite if unset) | PostgreSQL connection string |
| `COA_ADMIN_TOKEN` | Backend `.env` | Yes | Secret token for write endpoints |
| `FRONTEND_ORIGIN` | Backend `.env` | Yes (prod) | Frontend URL for CORS |

---

## PostgreSQL Setup (Local)

```sql
-- Run as postgres superuser
CREATE DATABASE coa_portfolio;
CREATE USER coa_user WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE coa_portfolio TO coa_user;
\c coa_portfolio
GRANT ALL ON SCHEMA public TO coa_user;
```

Then set:
```
DATABASE_URL=postgresql+psycopg2://coa_user:yourpassword@localhost:5432/coa_portfolio
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Status + active DB backend |
| `GET` | `/api/assignments` | None | List assignments (search/filter params) |
| `POST` | `/api/assignments` | Bearer token | Create assignment |
| `GET` | `/api/assignments/{id}` | None | Get single assignment |
| `PUT` | `/api/assignments/{id}` | Bearer token | Update assignment |
| `DELETE` | `/api/assignments/{id}` | Bearer token | Delete assignment |

### Test with curl

```bash
# Health check
curl http://localhost:8000/api/health

# List assignments
curl http://localhost:8000/api/assignments

# Create (replace TOKEN with your COA_ADMIN_TOKEN value)
curl -X POST http://localhost:8000/api/assignments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Memory Addressing","question":"Explain direct vs indirect addressing.","topic":"Addressing","difficulty":"Medium"}'

# Update
curl -X PUT http://localhost:8000/api/assignments/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answer":"Direct addressing uses the operand field as the memory address."}'

# Delete
curl -X DELETE http://localhost:8000/api/assignments/1 \
  -H "Authorization: Bearer TOKEN"
```

---

## Deployment on Render

### Step 1: Push to GitHub
```powershell
git init
git add .
git commit -m "Initial commit — COA Portfolio"
git remote add origin https://github.com/Prateekinnovates/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create Render PostgreSQL Database
- Dashboard → New → PostgreSQL
- Copy the **Internal Database URL**

### Step 3: Deploy Backend (Web Service)
- Root directory: `server`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `DATABASE_URL` → paste the Render PostgreSQL Internal URL
  - `COA_ADMIN_TOKEN` → your secret token
  - `FRONTEND_ORIGIN` → your frontend Render URL (set after step 4)

### Step 4: Deploy Frontend (Static Site)
- Root directory: `.` (project root)
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable:
  - `VITE_API_URL` → your backend Render URL
- Add redirect/rewrite rule: `/* → /index.html` (status 200) — enables client-side routing

### Step 5: Update CORS
Once both services are deployed, set `FRONTEND_ORIGIN` on the backend to your frontend's Render URL and redeploy.

---

## Project Structure

```
coa-portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SocialIcons.jsx
│   │   └── tools/
│   │       ├── InstructionSetSimulator.jsx
│   │       ├── NumberConverter.jsx
│   │       └── Assignments.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Achievements.jsx
│   │   └── COALab.jsx           ← tool registry pattern
│   ├── utils/
│   │   ├── instructionSetSimulator.js
│   │   ├── instructionSetSimulator.test.js
│   │   ├── numberConverter.js
│   │   └── numberConverter.test.js
│   ├── data/
│   │   ├── achievements.js
│   │   └── projects.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── main.py                  ← FastAPI app, routes, auth
│   ├── database.py              ← SQLAlchemy engine (PG/SQLite)
│   ├── models.py                ← Assignment ORM model
│   └── requirements.txt
├── public/
│   └── resume.pdf               ← Replace with real PDF before deploy
├── .env                         ← Local dev config (not committed)
├── .env.example                 ← Placeholder template
├── .gitignore
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Verification Results

| Check | Result |
|---|---|
| `npm run test` — ISS (23 tests) | ✅ All passed |
| `npm run test` — Number Converter (26 tests) | ✅ All passed |
| `npm run build` | ✅ 740ms, 19 chunks, no errors |
| Backend `GET /api/health` | ✅ Returns status + db_backend |
| Backend CRUD curl tests | ✅ Verified (see above) |

---

## Adding a New COA Lab Tool

1. Create `src/components/tools/YourTool.jsx`
2. Add one entry to the `TOOLS` array in `src/pages/COALab.jsx`:
   ```js
   {
     id: 'your-tool',
     label: 'Your Tool',
     fullLabel: 'Full Tool Name',
     icon: SomeLucideIcon,
     description: 'What it does.',
     component: lazy(() => import('../components/tools/YourTool')),
   }
   ```
3. Done — the secondary nav and routing update automatically.

---

## Remaining Limitations / Placeholders

- `public/resume.pdf` — currently a placeholder PDF; replace with the real file before deployment
- AZ-900 credential URL — empty string in `src/data/achievements.js`; add when available
- Project GitHub URLs for ZeroTrace, Cyber Citadel, SQL Explainer, Voice Wheelchair — not yet public; fields left empty
- No Docker or container orchestration — straightforward Render deployment only

---

## Future Improvements

- Add more COA tools (pipeline simulator, cache simulator)
- Dark/light theme toggle
- Offline support (PWA)
- Admin panel with proper JWT auth (when backend is expanded)
- Add project screenshots once deployed

---

*Content rules: All data on this site represents only verified, factual information about Prateek (25BAI10050). No awards, placements, metrics, or achievements have been fabricated.*
