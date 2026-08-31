# ScamShield 🛡️

AI-powered scam checker and crowd-sourced scam reporting, built for the general public.

## Structure

```
scamshield/
├── backend/    Node/Express API — deploy to Render
└── frontend/   React app — deploy to GitHub Pages
```

This follows the same architecture pattern as the rest of the portfolio:
**React (GitHub Pages) → Node/Express API (Render) → Anthropic API**, with PostgreSQL for storage.

## Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY and DATABASE_URL
npm run db:init         # creates the reports & checks tables
npm run dev              # starts on http://localhost:4000
```

### Deploying to Render
1. Create a new **Web Service**, point it at the `backend/` folder of this repo.
2. Build command: `npm install`. Start command: `npm start`.
3. Create a **PostgreSQL** instance on Render and copy its connection string into `DATABASE_URL`.
4. Add `ANTHROPIC_API_KEY` and `CLIENT_ORIGIN` (your GitHub Pages URL) as environment variables.
5. After first deploy, run `npm run db:init` once (via Render's shell) to create the tables.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # set REACT_APP_API_BASE to your Render backend URL once deployed
npm start                # starts on http://localhost:3000
```

### Deploying to GitHub Pages
1. Update `homepage` in `frontend/package.json` to match your GitHub repo/username.
2. `npm run build`
3. `npm run deploy` (uses `gh-pages`, already in devDependencies)

## API endpoints

| Method | Route              | Description                          |
|--------|---------------------|---------------------------------------|
| POST   | `/api/check`        | Analyze pasted text or a URL for scam risk |
| POST   | `/api/reports`       | Submit a crowd-sourced scam report    |
| GET    | `/api/reports?q=`    | Search existing reports               |
| GET    | `/health`            | Health check                          |

## v2 ideas (not in this scaffold)
- Browser extension
- Community voting/verification on reports
- SME-focused dashboard
- Categorized analytics / trending scams feed
