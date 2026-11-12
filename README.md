# EVA — Smart College Event & Venue Management Platform
> **Institution:** Thapar Institute of Engineering and Technology (TIET), Patiala  
> **Course:** UCS 503P — Software Engineering  
> **Architecture:** Decoupled Full-Stack Web Application (React + Node.js/Express + Relational Database + AI Recommender)

---

## 1. Executive Summary

**EVA** is a centralized, end-to-end event and venue lifecycle management platform built specifically for college campuses. It unifies historically fragmented and paper-heavy workflows into a single responsive system:

$$\text{Create Event} \longrightarrow \text{Book Venue (AI Match)} \longrightarrow \text{Publish Event} \longrightarrow \text{Student Registration} \longrightarrow \text{QR Check-in} \longrightarrow \text{Feedback} \longrightarrow \text{Analytics}$$

### Primary User Roles
EVA enforces a strict two-role model with no separate public administrator:
1. **Student:** Self-signup (`@thapar.edu` domain), discover published events, register with real-time seat lock, retrieve unique non-guessable QR pass, check in at venue, and provide multi-criteria feedback for attended events.
2. **Club Coordinator:** Authenticated using pre-provisioned credentials (`COO001`–`COO006`), manages only their assigned club's events, searches campus venues with deterministic capacity/facility filters and AI-assisted match scoring, confirms atomic bookings, scans student QR codes using device camera or manual input, prevents duplicate entries, and tracks live footfall and post-event analytics.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v3, React Router v7, Lucide React icons, Recharts, `html5-qrcode` (camera QR scanner), `qrcode.react` (SVG/PNG ticket generation), Axios |
| **Backend** | Node.js (v20+), Express 5, JWT authentication (`jsonwebtoken`), Dual-verifier (`bcrypt` + PBKDF2), Native high-performance `node:sqlite` driver with transactions, CORS, Centralized Error Handling |
| **Database** | Relational schema with foreign keys, compound unique constraints, check constraints, and performance indexes. Provided as SQLite (`database/eva.db`) and PostgreSQL DDL (`database/schema_postgres.sql`) + Prisma schema (`database/prisma/schema.prisma`) |
| **AI Recommendation** | Multi-factor, deterministic, explainable venue recommendation engine (`ai-service/venue_recommendation/recommender.py` and JavaScript native service) evaluating Capacity Fit (35%), Facility Match (25%), Historical Category Utilization (25%), and Venue Reliability (15%) |
| **Testing** | 22-assertion backend API test suite (`backend/test_api.js`), 21-step end-to-end master acceptance suite (`test_e2e_full.js`), and schema verification suite (`database/verify_database.py`) |

---

## 3. Project Directory Structure

```text
EVA/
├── ai-service/
│   └── venue_recommendation/
│       └── recommender.py             # Multi-factor explainable AI recommendation engine
├── backend/
│   ├── src/
│   │   ├── config/                    # Database (node:sqlite) and environment configuration
│   │   ├── middleware/                # JWT verification, Role guard, Club-ownership guard, Error handler
│   │   ├── modules/
│   │   │   ├── auth/                  # Student signup/login, Coordinator login, Password change
│   │   │   ├── users/                 # Profile retrieval and updates
│   │   │   ├── clubs/                 # Club directory and assigned coordinator listing
│   │   │   ├── venues/                # Venue catalogue and equipment details
│   │   │   ├── bookings/              # Availability check, conflict detection, AI scoring, atomic confirmation
│   │   │   ├── events/                # Event lifecycle (Draft, Published, Completed, Cancelled)
│   │   │   ├── registrations/         # Capacity-checked registration, unique tickets, QR generation
│   │   │   ├── checkins/              # Camera QR verification, duplicate check-in prevention, live footfall
│   │   │   ├── feedback/              # Checkin-verified ratings, sentiment analysis, duplicate prevention
│   │   │   └── analytics/             # Turnout yield, venue utilization, rating distribution
│   │   ├── routes/                    # Centralized API router mount (/api)
│   │   ├── utils/                     # Password hashing (bcrypt + PBKDF2) and token generators
│   │   └── server.js                  # Master Express server + SPA static production fallback
│   ├── package.json
│   └── test_api.js                    # 22-assertion backend test runner
├── data/
│   ├── dummy/                         # 14 decoupled seed CSV/JSON files (clubs, venues, users, events, etc.)
│   ├── config/                        # Booking rules, lead times, campus academic calendar
│   └── production/                    # Production drop-in directory + README migration guide
├── database/
│   ├── eva.db                         # Active SQLite relational database
│   ├── schema_sqlite.sql              # Clean SQLite DDL
│   ├── schema_postgres.sql            # Clean PostgreSQL DDL (production ready)
│   ├── prisma/schema.prisma           # Prisma ORM schema
│   ├── seed.py                        # Python seed script (supports --data-dir and --reset)
│   └── verify_database.py             # 9-test schema & business rule validation suite
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, Footer, QRModal, Badges, Loaders, EmptyState, Modal
│   │   ├── context/                   # AuthContext (JWT/User state), ToastContext (alerts)
│   │   ├── layouts/                   # StudentLayout, CoordinatorLayout
│   │   ├── pages/
│   │   │   ├── auth/                  # StudentLogin, StudentSignup, CoordinatorLogin
│   │   │   ├── student/               # Dashboard, ExploreEvents, EventDetails, Registrations, Feedback, Profile
│   │   │   └── coordinator/           # Dashboard, Events, CreateEvent, Venues, Booking, QRScanner, Footfall, Feedback, Analytics, Profile
│   │   ├── services/api.js            # Axios client with automatic Bearer token injection
│   │   ├── App.jsx                    # Route hierarchy & role-based route guards
│   │   └── main.jsx
│   ├── dist/                          # Pre-built production frontend bundle
│   ├── package.json
│   └── tailwind.config.js
├── test_e2e_full.js                   # Master 21-step acceptance test runner
└── README.md
```

---

## 4. Decoupled Data Architecture

As requested, all dummy data is **strictly separated from application code and logic**:
- **Dummy Data Directory (`data/dummy/`):** Contains the 14 reference CSV/JSON files provided for the TIET campus (Clubs, Venues, Users, Events, Historical Usage, etc.).
- **Configuration Directory (`data/config/`):** Contains `booking_rules.json` (lead times, max durations) and `academic_calendar.json` (exam dates, semester breaks).
- **Production Directory (`data/production/`):** Ready to accept real college data files.
- **How to switch to real college data:**
  1. Place exported CSV files into `data/production/` matching the column schemas documented in `data/production/README.md`.
  2. Execute:
     ```bash
     python database/seed.py --data-dir data/production --reset
     ```
  3. The database re-indexes all real college data without modifying a single line of backend or frontend code!

---

## 5. Demo Credentials

### Club Coordinators (Pre-provisioned)
All coordinators use the password: **`EVA-Demo@2026`**

| Coordinator ID | Name | Email | Assigned Club |
| :--- | :--- | :--- | :--- |
| **`COO001`** | Rohan Sharma | `rohan.sharma@thapar.edu` | **Coding Club** (`CLB001`) |
| **`COO002`** | Simran Kaur | `simran.kaur@thapar.edu` | **Robotics Society** (`CLB002`) |
| **`COO003`** | Aarav Mehta | `aarav.mehta@thapar.edu` | **Music Club** (`CLB003`) |
| **`COO004`** | Ananya Verma | `ananya.verma@thapar.edu` | **Literary Society** (`CLB004`) |
| **`COO005`** | Kabir Patel | `kabir.patel@thapar.edu` | **E-Cell** (`CLB005`) |
| **`COO006`** | Ishita Gupta | `ishita.gupta@thapar.edu` | **Fine Arts Club** (`CLB006`) |

### Students (Sample Pre-seeded Accounts)
Pre-seeded students use the password: **`Student@2026`**

| Student ID | Name | Email | Department / Year |
| :--- | :--- | :--- | :--- |
| **`102303001`** | Aman Sharma | `aman.sharma@thapar.edu` | CSED / 3rd Year |
| **`102303002`** | Priya Patel | `priya.patel@thapar.edu` | ECE / 2nd Year |
| **`102303003`** | Rahul Verma | `rahul.verma@thapar.edu` | MEED / 4th Year |
| **`102303004`** | Sneha Singh | `sneha.singh@thapar.edu` | CSED / 1st Year |

*Note: Students can also create brand-new accounts anytime via the **Student Sign Up** page.*

---

## 6. How to Clone & Run the Application (Team Quickstart)

### 6.1 Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Python**: v3.10 or higher with standard libraries
- **Git**: Installed and configured

### 6.2 Clone the Repository
```bash
git clone https://github.com/vatsalize/EVA.git
cd EVA
```

### 6.3 Configure Environment Variables
Copy the template environment file to `.env`:
```bash
# Windows PowerShell
copy .env.example .env

# macOS / Linux
cp .env.example .env
```
*(The defaults are pre-configured for instant zero-configuration local development).*

### 6.4 Install Dependencies
Install dependencies for both the backend and frontend:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Return to project root
cd ..
```

### 6.5 Initialize the Database & Seed Demo Data
Seed the relational database with safe fixtures (clubs, venues, coordinator/student accounts, and historical usage):
```bash
python database/seed.py --reset
```
To verify that all tables, foreign keys, and unique constraints are healthy:
```bash
python database/verify_database.py
```

---

## 7. Running the Application

### Option A — Single-Command Full-Stack Deployment (Recommended)
The Express server is configured to serve the production React SPA:

```bash
cd backend
npm start
```
Open **`http://localhost:5000`** in your browser. The entire application is live!

---

### Option B — Concurrent Development Mode (Hot-Reloading)
For active development with live code reloads:

**Terminal 1 (Backend API Server):**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```
Open **`http://localhost:3000`** in your browser. All `/api` requests are automatically proxied to port 5000.

---

## 8. Team Collaboration & Git Workflow

To maintain a clean and reliable codebase, teammates should follow this Git branching model:

### Recommended Branch Structure
- **`main`** — Production-ready, stable integrated application. Protected branch.
- **`feature/frontend`** — UI components, pages, responsive layouts, styling.
- **`feature/backend`** — REST APIs, authentication, middleware, database logic.
- **`feature/database-testing`** — Schemas, seed scripts, automated test cases.
- **`feature/ai-recommendation`** — Scoring algorithms, heuristics, predictive modules.

### Daily Team Workflow
1. **Pull Latest Changes:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Your Work:**
   ```bash
   git add .
   git commit -m "feat: descriptive explanation of changes"
   ```
4. **Push to Remote:**
   ```bash
   git push -u origin feature/your-feature-name
   ```
5. **Open a Pull Request (PR):**
   Open a PR against `main` on GitHub: `https://github.com/vatsalize/EVA/pulls` for code review.

---

## 9. Automated Testing & Verification

EVA includes two comprehensive automated test suites:

### 1. Backend API Test Suite (`backend/test_api.js`)
Tests 22 distinct REST API endpoints covering authentication, venue search, conflict rejection, registration capacity checks, duplicate check-in prevention, and analytics calculation.
```bash
node backend/test_api.js
# Output: Backend API Test Results: 22 PASSED, 0 FAILED
```

### 2. End-to-End Master Acceptance Test Suite (`test_e2e_full.js`)
Simulates the entire 21-step real-world lifecycle from student signup to event completion:
```bash
node test_e2e_full.js
# Output: MASTER ACCEPTANCE SUMMARY: 21 / 21 STEPS PASSED (0 FAILED)
```

**Verified Test Scenarios:**
- [x] Student self-signup with duplicate email/roll number rejection
- [x] Student login and JWT issuance
- [x] Pre-defined Coordinator authentication
- [x] Event creation in `DRAFT` state
- [x] Venue search with capacity filter
- [x] Deterministic availability check
- [x] Overlapping booking conflict prevention (`409 Conflict`)
- [x] Multi-factor AI venue recommendation with transparent score breakdown
- [x] Transactional venue booking confirmation
- [x] Event transition to `PUBLISHED`
- [x] Public event discovery and search
- [x] Student registration with atomic seat decrement
- [x] Rejection of duplicate registration (`409 Conflict`)
- [x] Cryptographic, non-guessable QR token generation
- [x] QR code digital ticket retrieval (PNG / SVG)
- [x] Coordinator QR check-in scanning at venue
- [x] Rejection of duplicate QR check-in attempt (`400 Bad Request`)
- [x] Real-time footfall increment and turnout rate update
- [x] Event status transition to `COMPLETED`
- [x] Attended student post-event feedback submission
- [x] Rejection of duplicate feedback submission (`400 Bad Request`)
- [x] Coordinator analytics dashboard updates (turnout yield, venue utilization, ratings)

---

## 8. Summary of REST API Endpoints

### Authentication & Profiles (`/api/auth`, `/api/users`)
- `POST /api/auth/student/signup` — Student registration with domain validation
- `POST /api/auth/student/login` — Student authentication
- `POST /api/auth/coordinator/login` — Predefined coordinator authentication
- `GET  /api/users/profile` — Get logged-in user profile
- `PUT  /api/users/profile` — Update user profile
- `PUT  /api/users/change-password` — Change password with current password verification

### Venues & Bookings (`/api/venues`, `/api/bookings`)
- `GET  /api/venues` — List venues with capacity, type, and equipment filters
- `GET  /api/venues/:id` — Get venue details
- `POST /api/bookings/availability` — Check venue availability for specific date & timeslot
- `POST /api/bookings/recommendations` — AI multi-factor venue recommendations with score breakdown
- `POST /api/bookings` — Atomically book a venue (with conflict check)
- `GET  /api/bookings/my-club` — List bookings for the coordinator's club
- `DELETE /api/bookings/:id` — Cancel a booking

### Events (`/api/events`)
- `GET  /api/events` — List published events (with search, category, and date filters)
- `GET  /api/events/my-club` — List all events for coordinator's club (Draft, Published, Completed)
- `GET  /api/events/:id` — Detailed event view (public/authenticated)
- `POST /api/events` — Coordinator creates event (scoped to their club)
- `PUT  /api/events/:id` — Coordinator updates event
- `PATCH /api/events/:id/status` — Lifecycle transition (`PUBLISHED`, `COMPLETED`, `CANCELLED`)

### Registrations & Digital QR Tickets (`/api/registrations`)
- `POST /api/registrations/events/:eventId/register` — Student event registration (atomic capacity check)
- `GET  /api/registrations/my-registrations` — View student's registered events & ticket status
- `GET  /api/registrations/:id/qr` — Retrieve high-res QR code PNG data URL & raw token
- `DELETE /api/registrations/:id` — Cancel event registration

### QR Check-in & Footfall (`/api/checkins`)
- `POST /api/checkins/scan` — Scan and verify QR code token (prevents duplicate entry)
- `GET  /api/checkins/events/:eventId/footfall` — Live footfall metrics & attendee roster
- `GET  /api/checkins/events/:eventId/attendees` — Detailed checked-in student list

### Feedback & Ratings (`/api/feedback`)
- `POST /api/feedback/events/:eventId` — Submit multi-criteria feedback (must have checked in)
- `GET  /api/feedback/events/:eventId` — Review feedback & aggregate ratings for an event
- `GET  /api/feedback/my-feedback` — View feedback submitted by student

### Analytics Dashboard (`/api/analytics`)
- `GET  /api/analytics/overview` — High-level metrics (events, registrations, footfall, turnout rate)
- `GET  /api/analytics/attendance-trend` — Longitudinal turnout trends across past events
- `GET  /api/analytics/venue-utilization` — Campus venue occupancy and utilization rates
- `GET  /api/analytics/feedback-summary` — Multi-criteria rating distributions and student reviews

---

## 9. Academic Integrity & Project Standards
- **Relational Integrity:** Pure relational architecture with zero synthetic mocks or client-side storage substitutes.
- **Security:** Passwords salted and hashed with modern adaptive cryptanalysis resistant algorithms (`bcrypt` / PBKDF2-SHA256). JWTs signed with secret keys, verified on every protected API call.
- **Hardware Integration:** Browser-based camera QR code scanner powered by `html5-qrcode` with instant audio/visual confirmation feedback.
- **Extensibility:** The AI recommender and seed architecture are strictly modular, allowing new venue scoring heuristics or new institutional data to be incorporated with zero regressions.
