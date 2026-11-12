# EVA — Backend Service & Full-Stack Engine

The EVA backend is an Express 5 and Node.js REST API service connected to an SQLite relational database via the native `node:sqlite` driver. When the frontend is built, the backend also serves the complete React SPA on the same port.

---

## Quickstart (Single Command)

To run the entire full-stack application:

1. Ensure **Node.js** (v20+) and **Python** (v3.10+) are installed.
2. Open this directory in your terminal:
   ```bash
   cd backend
   ```
3. Run:
   ```bash
   npm start
   ```
4. Open **`http://localhost:5000`** in your browser.

---

## What Happens Automatically on `npm start`

The `prestart` lifecycle script runs `scripts/setup.js`, which handles all setup steps before launching the Express server:

1. **Environment Configuration (`.env`):**
   - Creates root `.env` and `backend/.env` from `.env.example` templates if missing.
   - Never overwrites existing configuration files.
2. **Dependency Verification:**
   - Checks backend and frontend `node_modules`.
   - Runs `npm ci` automatically if dependencies are missing or lockfiles have changed.
   - Skips installation when dependencies are up to date.
3. **Database Initialization:**
   - Checks for `database/eva.db`.
   - If missing, initializes tables (`python database/seed.py --init-only`) and seeds demo data (`python database/seed.py`).
   - If `database/eva.db` exists, it is **never reset or modified**. Existing student accounts, bookings, and events are 100% preserved.
4. **Frontend Production Build:**
   - Verifies `frontend/dist`.
   - If missing or source files have been updated, automatically triggers `npm run build`.
   - Skips rebuild if assets are already fresh.
5. **Server Boot:**
   - Express launches on `http://localhost:5000`.
   - Handles graceful shutdown on `Ctrl+C`.

---

## Available NPM Scripts

| Command | Action |
| :--- | :--- |
| **`npm start`** | Runs automatic setup (`prestart`) and starts the full-stack server on port 5000. |
| **`npm run dev`** | Starts backend in development mode with `node --watch` (hot-reloads on file changes). |
| **`npm run setup`** | Executes pre-flight verification without starting the server. |
| **`npm test`** (or `node test_api.js`) | Runs the 22-assertion backend API automated test suite. |

---

## Production & Staging Notes

- **Port Configuration:** Defaults to `5000`. Change `PORT=XXXX` in `.env` if 5000 is occupied.
- **JWT Secret:** Replace `JWT_SECRET` in `.env` with a strong random secret before deploying publicly.
