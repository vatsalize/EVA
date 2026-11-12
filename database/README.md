# EVA Database Architecture & Seed Process Documentation

## Overview
**EVA (Smart College Event & Venue Management Platform)** is designed for Thapar Institute of Engineering and Technology (UCS 503P).
The database provides the foundational data engine for the complete event lifecycle:
```
Create Event -> Book Venue -> Student Registration -> Event -> QR Footfall -> Feedback -> Analytics
```

This database architecture satisfies all SRS requirements (FR-01 through FR-15) and strictly follows the design recommendation:
> **Decouple dummy/mock data completely from application code and database schema logic.**

---

## 1. Directory Structure

```
Eva/
├── data/
│   ├── config/                     # Institutional configuration & rules
│   │   ├── academic_calendar.json  # Semester dates & exam blackout periods
│   │   └── booking_rules.json      # Advance notice, buffers, duration constraints
│   ├── dummy/                      # Extracted development/testing dummy dataset
│   │   ├── clubs.json              # 6 demo clubs
│   │   ├── venues.json             # 8 campus venues with capacity & facilities
│   │   ├── coordinators.json       # 6 demo coordinator accounts
│   │   ├── students.json           # 12 demo students
│   │   ├── events.json             # 10 events (9 published, 1 draft)
│   │   ├── bookings.json           # 9 confirmed venue allocations
│   │   ├── registrations.json      # 57 student registrations with QR tokens
│   │   ├── checkins.json           # 18 accepted QR footfall records
│   │   ├── feedback.json           # 18 post-event feedback & rating records
│   │   ├── historical_venue_usage.csv # 60 historical records for AI recommendation
│   │   └── DATA_INVENTORY.json     # Verification counts
│   └── production/                 # Clean target directory for real Thapar data
│       └── README.md               # Formatting instructions & migration guide
└── database/
    ├── schema_sqlite.sql           # SQLite physical schema DDL
    ├── schema_postgres.sql         # PostgreSQL production DDL
    ├── prisma/
    │   └── schema.prisma           # Prisma ORM schema for Node/TS backend
    ├── seed.py                     # Configurable, idempotent seed runner
    ├── verify_database.py          # Automated verification test suite
    └── eva.db                      # Initialized & verified SQLite database
```

---

## 2. Entity-Relationship & Table Specifications

| Table | Description | Key Constraints |
|---|---|---|
| `clubs` | College student societies & clubs | `PRIMARY KEY (club_id)`, `UNIQUE (name)` |
| `users` | Unified users table (Students & Club Coordinators) | `PRIMARY KEY (user_id)`, `UNIQUE (email)`, `CHECK (role IN ('STUDENT', 'COORDINATOR', 'ADMIN'))` |
| `venues` | Campus venues with capacities and facility tags | `PRIMARY KEY (venue_id)`, `UNIQUE (name)`, `CHECK (capacity > 0)` |
| `events` | Club events created by coordinators | `PRIMARY KEY (event_id)`, `FOREIGN KEY (club_id)`, `FOREIGN KEY (coordinator_id)`, `FOREIGN KEY (venue_id)` |
| `bookings` | Venue booking slots with atomic conflict detection | `PRIMARY KEY (booking_id)`, `FOREIGN KEY (event_id)`, `FOREIGN KEY (venue_id)`, `CHECK (start_time < end_time)`, `INDEX (venue_id, booking_date, status)` |
| `registrations` | Event registrations with unique QR tokens | `PRIMARY KEY (registration_id)`, `UNIQUE (event_id, student_id)`, `UNIQUE (qr_token)` |
| `checkins` | Actual QR footfall verification records | `PRIMARY KEY (checkin_id)`, `UNIQUE (registration_id)` (prevents double check-in) |
| `feedback` | Post-event reviews by students who attended | `PRIMARY KEY (feedback_id)`, `UNIQUE (event_id, student_id)`, `CHECK (ratings BETWEEN 1 AND 5)` |
| `historical_venue_usage`| Historical baseline for Smart Venue AI ranking | `PRIMARY KEY (usage_id)`, `FOREIGN KEY (venue_id)` |
| `system_config` | Key-value store for booking rules & parameters | `PRIMARY KEY (config_key)` |
| `academic_calendar` | Institutional calendar & blackout periods | `PRIMARY KEY (calendar_id)` |

---

## 3. Business Rules Enforced at Database Level

1. **Transaction-Safe Booking Conflict Detection (FR-07)**:
   - Overlapping bookings on the same venue and date with status `CONFIRMED` are strictly flagged/prevented.
   - Fast lookup indexed by `(venue_id, booking_date, status)`.
2. **Duplicate Registration Prevention (FR-11)**:
   - Enforced by compound unique constraint: `UNIQUE (event_id, student_id)`.
3. **Unique QR Code Generation (FR-12)**:
   - Enforced by unique constraint on `registrations.qr_token`.
4. **Duplicate QR Check-In Prevention (FR-13)**:
   - Enforced by unique constraint: `UNIQUE (registration_id)` in the `checkins` table.
5. **Duplicate Feedback Prevention (FR-14)**:
   - Enforced by compound unique constraint: `UNIQUE (event_id, student_id)` in `feedback`.
6. **Turnout Rate & Analytics (FR-15)**:
   - Connected relational joins allow computing `Actual Footfall / Registrations` and average ratings directly in real time.
7. **AI Recommendation Cold-Start (FR-08)**:
   - `historical_venue_usage` provides 60 initial empirical data points for capacity fit and utilization scoring.

---

## 4. Database Setup & Management Workflows

### 4.1 First-Time Schema Initialization (Non-Destructive, Schema-Only)
For production or clean environments where you only want to create the relational tables, indexes, and constraints without inserting any dummy/demo records:
```bash
python database/seed.py --init-only
```
- Safe to run on existing databases: uses `CREATE TABLE IF NOT EXISTS`.
- Never drops or alters existing data.

### 4.2 Normal Development Seeding (Non-Destructive, Idempotent)
For everyday development. Inserts missing baseline demo fixtures (clubs, venues, initial coordinators, sample events) without overwriting or deleting any existing student accounts:
```bash
python database/seed.py
```
- **Preserves all user accounts:** Any student who signed up or any custom event created remains 100% untouched.
- **Idempotent:** Running it 1 time or 100 times produces zero duplicate rows.
- **Data Source Selection:** To seed production data templates instead of dummy data:
  ```bash
  python database/seed.py --data-dir data/production
  ```

### 4.3 Database Backup Command
Creates an atomic, timestamped snapshot in `database/backups/`:
```bash
python database/seed.py --backup
# Output: [Backup] Created snapshot at: database/backups/eva_backup_YYYYMMDD_HHMMSS.db
```

### 4.4 Development/Test Reset (Destructive, Development-Only)
Wipes and restores the database to the pristine initial demo state for testing:
```bash
# Interactive mode (creates backup first, prompts for confirmation)
python database/seed.py --reset

# Non-interactive mode (for automated CI/test scripts)
python database/seed.py --reset --force
```
- **Production Lock:** Automatically blocked if `NODE_ENV=production` or `EVA_ENV=production` or `--production` is active.
- **Auto-Backup:** Automatically creates a backup snapshot in `database/backups/` before dropping any tables.

### 4.5 Database Verification Suite (Strictly Read-Only)
Runs 9 comprehensive verification tests (schema constraints, password hashes, foreign keys, duplicate rejection, and analytics):
```bash
python database/verify_database.py
```
- **100% Read-Only:** All constraint probe tests execute inside transaction savepoints with guaranteed rollback.
- Never commits or modifies any database records.
python database/verify_database.py
```
This tests:
- Record count alignment with `DATA_INVENTORY.json`
- PBKDF2/bcrypt password hashing validation
- Foreign key integrity (`PRAGMA foreign_key_check`)
- Prevention of duplicate registrations
- Prevention of duplicate QR check-ins
- Prevention of duplicate feedback
- Conflict detection query performance
- Full lifecycle analytics calculation
- AI Smart Recommendation baseline queries
