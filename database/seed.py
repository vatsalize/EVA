#!/usr/bin/env python3
"""
EVA Platform Database Management & Seeding Tool
================================================
Enterprise-grade, safe database initialization, non-destructive demo seeding,
automated backups, and protected development resets.

Commands & Usage:
-----------------
1. Safe First-Time Schema Initialization (Non-destructive, schema-only):
   python database/seed.py --init-only

2. Non-Destructive Demo Seeding (Safe for development; preserves all existing student accounts):
   python database/seed.py

3. Create Timestamped Database Backup:
   python database/seed.py --backup

4. Protected Development Reset (Destructive; backups up first; blocked in production):
   python database/seed.py --reset [--force]
"""

import os
import sys
import json
import csv
import shutil
import sqlite3
import argparse
import hashlib
import binascii
from datetime import datetime

# Path Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))

DEFAULT_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "dummy")
DEFAULT_CONFIG_DIR = os.path.join(PROJECT_ROOT, "data", "config")
DEFAULT_DB_PATH = os.path.join(SCRIPT_DIR, "eva.db")
DEFAULT_SCHEMA_PATH = os.path.join(SCRIPT_DIR, "schema_sqlite.sql")
BACKUP_DIR = os.path.join(SCRIPT_DIR, "backups")

DEFAULT_COORDINATOR_PASSWORD = os.getenv("EVA_DEMO_COORDINATOR_PASSWORD", "EVA-Demo@2026")
DEFAULT_STUDENT_PASSWORD = os.getenv("EVA_DEMO_STUDENT_PASSWORD", "Student@2026")


def hash_password(password: str, salt: bytes = None) -> str:
    """Standard PBKDF2-HMAC-SHA256 password hasher with salt."""
    if salt is None:
        salt = os.urandom(16)
    iterations = 100_000
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    salt_hex = binascii.hexlify(salt).decode("ascii")
    hash_hex = binascii.hexlify(derived).decode("ascii")
    return f"pbkdf2_sha256${iterations}${salt_hex}${hash_hex}"


def load_json_file(file_path: str):
    if not os.path.exists(file_path):
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_csv_file(file_path: str):
    if not os.path.exists(file_path):
        return []
    rows = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    return rows


def is_production_environment(db_path: str, is_production_flag: bool = False) -> bool:
    """
    Checks whether the current execution targets or runs in a production environment.
    """
    if is_production_flag:
        return True

    node_env = os.getenv("NODE_ENV", "").lower()
    eva_env = os.getenv("EVA_ENV", "").lower()
    if node_env == "production" or eva_env == "production":
        return True

    # Detect if database file or directory path explicitly indicates production
    norm_path = os.path.normpath(db_path).lower()
    if "production" in norm_path or "prod.db" in norm_path:
        return True

    return False


def create_backup(db_path: str) -> str:
    """
    Creates an atomic, timestamped backup copy of the target SQLite database.
    """
    if not os.path.exists(db_path):
        return None

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_name = os.path.splitext(os.path.basename(db_path))[0]
    backup_filename = f"{base_name}_backup_{timestamp}.db"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)

    shutil.copy2(db_path, backup_path)
    size_kb = os.path.getsize(backup_path) / 1024
    print(f"  [Backup] Created snapshot at: {backup_path} ({size_kb:.1f} KB)")
    return backup_path


def init_schema_only(db_path: str, schema_path: str):
    """
    Safe schema initialization.
    Executes CREATE TABLE IF NOT EXISTS from the schema DDL.
    Never drops or modifies existing data.
    """
    print("================================================================")
    print("EVA Database Schema Initialization (Non-Destructive)")
    print(f"  Target Database : {db_path}")
    print(f"  Schema File     : {schema_path}")
    print("================================================================")

    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    cursor.executescript(schema_sql)
    conn.commit()
    conn.close()

    print("  SUCCESS: Database schema verified and initialized without touching existing data.")


def seed_database(
    data_dir: str,
    config_dir: str,
    db_path: str,
    schema_path: str,
    destructive_reset: bool = False,
    force_reset: bool = False,
    is_production: bool = False,
    init_only: bool = False
):
    """
    Master database management function supporting:
    - Safe schema initialization (--init-only)
    - Non-destructive demo seeding (default; preserves all custom accounts)
    - Protected dev reset (--reset, with automatic backup and confirmation)
    """
    # 1. Guard against destructive reset in production
    if destructive_reset:
        if is_production_environment(db_path, is_production):
            print("\n" + "=" * 64, file=sys.stderr)
            print("CRITICAL SECURITY ERROR:", file=sys.stderr)
            print("Destructive database reset (--reset) is strictly prohibited", file=sys.stderr)
            print("in a PRODUCTION environment or on a production database path!", file=sys.stderr)
            print("=" * 64 + "\n", file=sys.stderr)
            sys.exit(1)

        # Interactive Confirmation & Safety Check
        if not force_reset:
            if sys.stdin.isatty():
                print("\n" + "!" * 64)
                print("WARNING: You requested a DESTRUCTIVE DATABASE RESET.")
                print(f"Target Database: {os.path.abspath(db_path)}")
                print("This will remove all custom user accounts, registrations, and events.")
                print("!" * 64)
                confirm = input("Type 'yes' to proceed with the reset (a backup will be made): ").strip()
                if confirm.lower() != "yes":
                    print("Reset cancelled by user. No changes were made.")
                    sys.exit(0)
            else:
                print("ERROR: In non-interactive mode, destructive reset requires --force / -y flag.", file=sys.stderr)
                sys.exit(1)

        # Create snapshot backup before deleting
        if os.path.exists(db_path):
            print("\n[Step 0] Creating pre-reset database backup...")
            create_backup(db_path)
            print("Resetting database file...")
            os.remove(db_path)

    # 2. Schema check / initialization
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    print("\n[Step 1] Ensuring Database Schema...")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)
    conn.commit()
    print("  Schema tables and indexes verified.")

    if init_only:
        conn.close()
        print("\n================================================================")
        print("Schema-only initialization complete. No demo records were seeded.")
        print(f"Database ready at: {os.path.abspath(db_path)}")
        print("================================================================")
        return

    # 3. Non-Destructive Seed Logic (Idempotent via INSERT OR IGNORE)
    print("\n[Step 2] Seeding Clubs (Idempotent)...")
    clubs_data = load_json_file(os.path.join(data_dir, "clubs.json")) or []
    inserted_clubs = 0
    for c in clubs_data:
        desc = c.get("description", f"{c['name']} - student organization specializing in {c.get('category')}")
        cursor.execute("""
            INSERT OR IGNORE INTO clubs (club_id, name, category, description)
            VALUES (?, ?, ?, ?)
        """, (c["club_id"], c["name"], c.get("category", "General"), desc))
        if cursor.rowcount > 0:
            inserted_clubs += 1
    print(f"  Clubs: {inserted_clubs} newly added, {len(clubs_data) - inserted_clubs} already present.")

    print("\n[Step 3] Seeding Venues (Idempotent)...")
    venues_data = load_json_file(os.path.join(data_dir, "venues.json")) or []
    inserted_venues = 0
    for v in venues_data:
        facilities_json = json.dumps(v.get("facilities", []))
        cursor.execute("""
            INSERT OR IGNORE INTO venues (venue_id, name, building, capacity, facilities, operating_start, operating_end, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            v["venue_id"],
            v["name"],
            v["building"],
            v["capacity"],
            facilities_json,
            v.get("operating_start", "08:00"),
            v.get("operating_end", "22:00"),
            v.get("status", "ACTIVE")
        ))
        if cursor.rowcount > 0:
            inserted_venues += 1
    print(f"  Venues: {inserted_venues} newly added, {len(venues_data) - inserted_venues} already present.")

    print("\n[Step 4] Seeding Demo Users (Preserves all existing student/coordinator accounts)...")
    coordinators_data = load_json_file(os.path.join(data_dir, "coordinators.json")) or []
    coord_pw_hash = hash_password(DEFAULT_COORDINATOR_PASSWORD)
    club_to_coord = {}
    inserted_coords = 0

    for co in coordinators_data:
        cursor.execute("""
            INSERT OR IGNORE INTO users (
                user_id, full_name, email, password_hash, role, club_id,
                department, year_of_study, is_active, is_verified, must_change_password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            co["coordinator_id"],
            co["full_name"],
            co["email"],
            coord_pw_hash,
            "COORDINATOR",
            co.get("club_id"),
            co.get("department", "Student Affairs"),
            co.get("year_of_study", 4),
            1 if co.get("is_active", True) else 0,
            1,
            1 if co.get("must_change_password", True) else 0
        ))
        if cursor.rowcount > 0:
            inserted_coords += 1
        club_to_coord[co["club_id"]] = co["coordinator_id"]

    students_data = load_json_file(os.path.join(data_dir, "students.json")) or []
    student_pw_hash = hash_password(DEFAULT_STUDENT_PASSWORD)
    inserted_students = 0

    for st in students_data:
        cursor.execute("""
            INSERT OR IGNORE INTO users (
                user_id, full_name, email, password_hash, role, club_id,
                department, year_of_study, is_active, is_verified, must_change_password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            st["student_id"],
            st["full_name"],
            st["email"],
            student_pw_hash,
            "STUDENT",
            None,
            st.get("department", "Computer Science"),
            st.get("year_of_study", 2),
            1,
            1 if st.get("is_verified", True) else 0,
            0
        ))
        if cursor.rowcount > 0:
            inserted_students += 1

    # Count total users currently in database
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'STUDENT'")
    total_db_students = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'COORDINATOR'")
    total_db_coords = cursor.fetchone()[0]

    print(f"  Coordinators: {inserted_coords} demo accounts added (Total active in DB: {total_db_coords})")
    print(f"  Students    : {inserted_students} demo accounts added (Total active in DB: {total_db_students})")

    print("\n[Step 5] Seeding Events (Idempotent)...")
    events_data = load_json_file(os.path.join(data_dir, "events.json")) or []
    inserted_events = 0
    for ev in events_data:
        coord_id = club_to_coord.get(ev.get("club_id"), "COO001")
        req_fac = json.dumps(ev.get("required_facilities", []))
        cursor.execute("""
            INSERT OR IGNORE INTO events (
                event_id, title, description, club_id, coordinator_id, category,
                event_date, start_time, end_time, venue_id, registration_capacity,
                expected_participants, required_facilities, registration_deadline, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ev["event_id"],
            ev["title"],
            ev.get("description", ""),
            ev["club_id"],
            coord_id,
            ev["category"],
            ev["event_date"],
            ev["start_time"],
            ev["end_time"],
            ev.get("venue_id"),
            ev.get("registration_capacity", 100),
            ev.get("expected_participants", 100),
            req_fac,
            ev.get("registration_deadline", ev["event_date"]),
            ev.get("status", "PUBLISHED")
        ))
        if cursor.rowcount > 0:
            inserted_events += 1
    print(f"  Events: {inserted_events} newly added, {len(events_data) - inserted_events} already present.")

    print("\n[Step 6] Seeding Bookings (Idempotent)...")
    bookings_data = load_json_file(os.path.join(data_dir, "bookings.json")) or []
    inserted_bookings = 0
    for bk in bookings_data:
        cursor.execute("""
            INSERT OR IGNORE INTO bookings (
                booking_id, event_id, venue_id, booking_date, start_time, end_time, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            bk["booking_id"],
            bk["event_id"],
            bk["venue_id"],
            bk["booking_date"],
            bk["start_time"],
            bk["end_time"],
            bk.get("status", "CONFIRMED"),
            bk.get("created_by", "COO001")
        ))
        if cursor.rowcount > 0:
            inserted_bookings += 1
            # Link venue_id to event if not set
            cursor.execute("""
                UPDATE events SET venue_id = ? WHERE event_id = ? AND venue_id IS NULL
            """, (bk["venue_id"], bk["event_id"]))
    print(f"  Bookings: {inserted_bookings} newly added, {len(bookings_data) - inserted_bookings} already present.")

    print("\n[Step 7] Seeding Registrations (Idempotent)...")
    registrations_data = load_json_file(os.path.join(data_dir, "registrations.json")) or []
    inserted_regs = 0
    for rg in registrations_data:
        cursor.execute("""
            INSERT OR IGNORE INTO registrations (
                registration_id, event_id, student_id, qr_token, registered_at, status
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            rg["registration_id"],
            rg["event_id"],
            rg["student_id"],
            rg["qr_token"],
            rg.get("registered_at"),
            rg.get("status", "CONFIRMED")
        ))
        if cursor.rowcount > 0:
            inserted_regs += 1
    print(f"  Registrations: {inserted_regs} newly added, {len(registrations_data) - inserted_regs} already present.")

    print("\n[Step 8] Seeding Check-ins (Idempotent)...")
    checkins_data = load_json_file(os.path.join(data_dir, "checkins.json")) or []
    inserted_chks = 0
    for ch in checkins_data:
        cursor.execute("""
            INSERT OR IGNORE INTO checkins (
                checkin_id, registration_id, event_id, student_id, scanned_at, scan_status, scanner_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            ch["checkin_id"],
            ch["registration_id"],
            ch["event_id"],
            ch["student_id"],
            ch.get("scanned_at"),
            ch.get("scan_status", "ACCEPTED"),
            ch.get("scanner_id", "SCANNER-DEMO-01")
        ))
        if cursor.rowcount > 0:
            inserted_chks += 1
    print(f"  Check-ins: {inserted_chks} newly added, {len(checkins_data) - inserted_chks} already present.")

    print("\n[Step 9] Seeding Feedback Submissions (Idempotent)...")
    feedback_data = load_json_file(os.path.join(data_dir, "feedback.json")) or []
    inserted_fdb = 0
    for fb in feedback_data:
        cursor.execute("""
            INSERT OR IGNORE INTO feedback (
                feedback_id, event_id, student_id, overall_rating, organization_rating,
                venue_rating, comments, submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            fb["feedback_id"],
            fb["event_id"],
            fb["student_id"],
            fb["overall_rating"],
            fb.get("organization_rating", fb["overall_rating"]),
            fb.get("venue_rating", fb["overall_rating"]),
            fb.get("comments", ""),
            fb.get("submitted_at")
        ))
        if cursor.rowcount > 0:
            inserted_fdb += 1
    print(f"  Feedback: {inserted_fdb} newly added, {len(feedback_data) - inserted_fdb} already present.")

    print("\n[Step 10] Seeding Historical Venue Usage for AI (Idempotent)...")
    historical_csv = os.path.join(data_dir, "historical_venue_usage.csv")
    his_rows = load_csv_file(historical_csv)
    inserted_his = 0
    for row in his_rows:
        cursor.execute("""
            INSERT OR IGNORE INTO historical_venue_usage (
                usage_id, event_date, event_category, venue_id, venue_capacity,
                expected_participants, actual_footfall, facilities_used, duration_hours
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row["usage_id"],
            row["event_date"],
            row["event_category"],
            row["venue_id"],
            int(row["venue_capacity"]),
            int(row["expected_participants"]),
            int(row["actual_footfall"]),
            row["facilities_used"],
            float(row["duration_hours"])
        ))
        if cursor.rowcount > 0:
            inserted_his += 1
    print(f"  Historical Records: {inserted_his} newly added, {len(his_rows) - inserted_his} already present.")

    print("\n[Step 11] Seeding System Configuration Rules (Idempotent)...")
    rules_file = os.path.join(config_dir, "booking_rules.json")
    if not os.path.exists(rules_file):
        rules_file = os.path.join(data_dir, "booking_rules.json")
    rules_data = load_json_file(rules_file) or {}
    inserted_rules = 0
    for k, v in rules_data.items():
        cursor.execute("""
            INSERT OR IGNORE INTO system_config (config_key, config_value, description)
            VALUES (?, ?, ?)
        """, (k, json.dumps(v), f"System booking and operational rule for {k}"))
        if cursor.rowcount > 0:
            inserted_rules += 1

    cal_file = os.path.join(config_dir, "academic_calendar.json")
    if not os.path.exists(cal_file):
        cal_file = os.path.join(data_dir, "academic_calendar.json")
    cal_data = load_json_file(cal_file) or []
    inserted_cals = 0
    for cal in cal_data:
        cursor.execute("""
            INSERT OR IGNORE INTO academic_calendar (
                calendar_id, name, start_date, end_date, holidays,
                exam_period_start, exam_period_end, is_demo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cal["calendar_id"],
            cal["name"],
            cal["start_date"],
            cal["end_date"],
            json.dumps(cal.get("holidays", [])),
            cal["exam_period_start"],
            cal["exam_period_end"],
            1 if cal.get("demo_only", True) else 0
        ))
        if cursor.rowcount > 0:
            inserted_cals += 1
    print(f"  Configuration: {inserted_rules} rules added, {inserted_cals} calendars added.")

    conn.commit()
    conn.close()

    print("\n================================================================")
    print("Database seeding completed successfully!")
    print(f"Database location: {os.path.abspath(db_path)}")
    print("================================================================")


def main():
    parser = argparse.ArgumentParser(
        description="EVA Database Management & Seeder Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # 1. Safe first-time initialization (schema only, no demo data):
  python database/seed.py --init-only

  # 2. Non-destructive demo seeding (safe; never overwrites custom accounts):
  python database/seed.py

  # 3. Create a snapshot backup:
  python database/seed.py --backup

  # 4. Destructive dev reset (creates backup first, prompts confirmation):
  python database/seed.py --reset

  # 5. Non-interactive automated reset for CI/testing:
  python database/seed.py --reset --force
"""
    )
    parser.add_argument("--init-only", action="store_true", help="Initialize schema tables only without seeding any demo data")
    parser.add_argument("--reset", action="store_true", help="Perform destructive reset to pristine demo state (development only)")
    parser.add_argument("-f", "--force", "-y", "--yes", action="store_true", dest="force", help="Bypass interactive confirmation prompt on reset")
    parser.add_argument("--backup", action="store_true", help="Create a timestamped snapshot backup of the database")
    parser.add_argument("--production", action="store_true", help="Flag indicating target is a production environment (blocks resets)")
    parser.add_argument("--data-dir", default=DEFAULT_DATA_DIR, help="Path to data directory (e.g. data/dummy or data/production)")
    parser.add_argument("--config-dir", default=DEFAULT_CONFIG_DIR, help="Path to config directory (e.g. data/config)")
    parser.add_argument("--db-path", default=DEFAULT_DB_PATH, help="Destination SQLite database file path")
    parser.add_argument("--schema", default=DEFAULT_SCHEMA_PATH, help="Path to SQL schema file")

    args = parser.parse_args()

    db_path = os.path.abspath(args.db_path)

    if args.backup:
        create_backup(db_path)
        sys.exit(0)

    if args.init_only:
        init_schema_only(db_path, os.path.abspath(args.schema))
        sys.exit(0)

    seed_database(
        data_dir=os.path.abspath(args.data_dir),
        config_dir=os.path.abspath(args.config_dir),
        db_path=db_path,
        schema_path=os.path.abspath(args.schema),
        destructive_reset=args.reset,
        force_reset=args.force,
        is_production=args.production,
        init_only=False
    )


if __name__ == "__main__":
    main()
