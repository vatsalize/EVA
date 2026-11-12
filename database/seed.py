#!/usr/bin/env python3
"""
EVA Platform Database Seed Script
=================================
Populates the database with initial dataset (dummy/mock or production)
while keeping data files decoupled from database operations.

Usage:
    python database/seed.py [--reset] [--data-dir PATH] [--db-path PATH]
"""

import os
import sys
import json
import csv
import sqlite3
import argparse
import hashlib
import binascii

# Default configurations
DEFAULT_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "dummy")
DEFAULT_CONFIG_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "config")
DEFAULT_DB_PATH = os.path.join(os.path.dirname(__file__), "eva.db")
DEFAULT_SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema_sqlite.sql")

DEFAULT_COORDINATOR_PASSWORD = os.getenv("EVA_DEMO_COORDINATOR_PASSWORD", "EVA-Demo@2026")
DEFAULT_STUDENT_PASSWORD = os.getenv("EVA_DEMO_STUDENT_PASSWORD", "Student@2026")


def hash_password(password: str, salt: bytes = None) -> str:
    """
    Standard PBKDF2-HMAC-SHA256 password hasher with salt.
    Format: pbkdf2_sha256$iterations$salt_hex$hash_hex
    Zero external dependencies, cross-platform, enterprise standard.
    """
    if salt is None:
        salt = os.urandom(16)
    iterations = 100_000
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    salt_hex = binascii.hexlify(salt).decode("ascii")
    hash_hex = binascii.hexlify(derived).decode("ascii")
    return f"pbkdf2_sha256${iterations}${salt_hex}${hash_hex}"


def load_json_file(file_path: str):
    if not os.path.exists(file_path):
        print(f"  [WARN] File not found: {file_path}")
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_csv_file(file_path: str):
    if not os.path.exists(file_path):
        print(f"  [WARN] File not found: {file_path}")
        return []
    rows = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    return rows


def run_seed(data_dir: str, config_dir: str, db_path: str, schema_path: str, reset: bool = False):
    print("================================================================")
    print("EVA Database Seed Process Initiated")
    print(f"  Data Directory   : {data_dir}")
    print(f"  Config Directory : {config_dir}")
    print(f"  Database Path    : {db_path}")
    print(f"  Schema Path      : {schema_path}")
    print(f"  Reset Tables     : {reset}")
    print("================================================================")

    if not os.path.exists(data_dir):
        print(f"ERROR: Data directory does not exist: {data_dir}", file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)

    if reset and os.path.exists(db_path):
        print("Reset requested: Removing existing database file...")
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # 1. Initialize schema
    print("\n[Step 1/11] Initializing Schema...")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)
    print("  Schema tables and indexes created successfully.")

    # 2. Seed Clubs
    print("\n[Step 2/11] Seeding Clubs...")
    clubs_data = load_json_file(os.path.join(data_dir, "clubs.json"))
    club_count = 0
    if clubs_data:
        for c in clubs_data:
            desc = c.get("description", f"{c['name']} - student organization specializing in {c.get('category')}")
            cursor.execute("""
                INSERT OR REPLACE INTO clubs (club_id, name, category, description)
                VALUES (?, ?, ?, ?)
            """, (c["club_id"], c["name"], c.get("category", "General"), desc))
            club_count += 1
    print(f"  Seeded {club_count} clubs.")

    # 3. Seed Venues
    print("\n[Step 3/11] Seeding Venues...")
    venues_data = load_json_file(os.path.join(data_dir, "venues.json"))
    venue_count = 0
    if venues_data:
        for v in venues_data:
            facilities_json = json.dumps(v.get("facilities", []))
            cursor.execute("""
                INSERT OR REPLACE INTO venues (venue_id, name, building, capacity, facilities, operating_start, operating_end, status)
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
            venue_count += 1
    print(f"  Seeded {venue_count} venues.")

    # 4. Seed Coordinators and Students into Users
    print("\n[Step 4/11] Seeding Users (Coordinators & Students)...")
    user_count = 0
    coordinators_data = load_json_file(os.path.join(data_dir, "coordinators.json"))
    coord_pw_hash = hash_password(DEFAULT_COORDINATOR_PASSWORD)
    club_to_coord = {}

    if coordinators_data:
        for co in coordinators_data:
            cursor.execute("""
                INSERT OR REPLACE INTO users (
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
            club_to_coord[co["club_id"]] = co["coordinator_id"]
            user_count += 1

    students_data = load_json_file(os.path.join(data_dir, "students.json"))
    student_pw_hash = hash_password(DEFAULT_STUDENT_PASSWORD)
    if students_data:
        for st in students_data:
            cursor.execute("""
                INSERT OR REPLACE INTO users (
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
            user_count += 1
    print(f"  Seeded {user_count} total users ({len(coordinators_data or [])} coordinators, {len(students_data or [])} students).")

    # 5. Seed Events
    print("\n[Step 5/11] Seeding Events...")
    events_data = load_json_file(os.path.join(data_dir, "events.json"))
    event_count = 0
    if events_data:
        for ev in events_data:
            coord_id = club_to_coord.get(ev.get("club_id"))
            if not coord_id:
                coord_id = "COO001"
            req_fac = json.dumps(ev.get("required_facilities", []))
            cursor.execute("""
                INSERT OR REPLACE INTO events (
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
            event_count += 1
    print(f"  Seeded {event_count} events.")

    # 6. Seed Bookings
    print("\n[Step 6/11] Seeding Bookings...")
    bookings_data = load_json_file(os.path.join(data_dir, "bookings.json"))
    booking_count = 0
    if bookings_data:
        for bk in bookings_data:
            cursor.execute("""
                INSERT OR REPLACE INTO bookings (
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
            # Also update event venue_id reference
            cursor.execute("""
                UPDATE events SET venue_id = ? WHERE event_id = ?
            """, (bk["venue_id"], bk["event_id"]))
            booking_count += 1
    print(f"  Seeded {booking_count} bookings.")

    # 7. Seed Registrations
    print("\n[Step 7/11] Seeding Registrations...")
    registrations_data = load_json_file(os.path.join(data_dir, "registrations.json"))
    reg_count = 0
    if registrations_data:
        for rg in registrations_data:
            cursor.execute("""
                INSERT OR REPLACE INTO registrations (
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
            reg_count += 1
    print(f"  Seeded {reg_count} registrations.")

    # 8. Seed Checkins (Footfall)
    print("\n[Step 8/11] Seeding Checkins (Footfall)...")
    checkins_data = load_json_file(os.path.join(data_dir, "checkins.json"))
    chk_count = 0
    if checkins_data:
        for ch in checkins_data:
            cursor.execute("""
                INSERT OR REPLACE INTO checkins (
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
            chk_count += 1
    print(f"  Seeded {chk_count} checkins.")

    # 9. Seed Feedback
    print("\n[Step 9/11] Seeding Feedback...")
    feedback_data = load_json_file(os.path.join(data_dir, "feedback.json"))
    fdb_count = 0
    if feedback_data:
        for fb in feedback_data:
            cursor.execute("""
                INSERT OR REPLACE INTO feedback (
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
            fdb_count += 1
    print(f"  Seeded {fdb_count} feedback submissions.")

    # 10. Seed Historical Venue Usage (for AI Smart Venue Recommendation)
    print("\n[Step 10/11] Seeding Historical Venue Usage (AI Training Data)...")
    historical_csv = os.path.join(data_dir, "historical_venue_usage.csv")
    his_rows = load_csv_file(historical_csv)
    his_count = 0
    if his_rows:
        for row in his_rows:
            cursor.execute("""
                INSERT OR REPLACE INTO historical_venue_usage (
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
            his_count += 1
    print(f"  Seeded {his_count} historical venue usage records.")

    # 11. Seed Config Rules & Academic Calendar
    print("\n[Step 11/11] Seeding System Rules and Academic Calendar...")
    rules_file = os.path.join(config_dir, "booking_rules.json")
    if not os.path.exists(rules_file):
        rules_file = os.path.join(data_dir, "booking_rules.json")
    rules_data = load_json_file(rules_file)
    rule_count = 0
    if rules_data:
        for k, v in rules_data.items():
            cursor.execute("""
                INSERT OR REPLACE INTO system_config (config_key, config_value, description)
                VALUES (?, ?, ?)
            """, (k, json.dumps(v), f"System booking and operational rule for {k}"))
            rule_count += 1

    cal_file = os.path.join(config_dir, "academic_calendar.json")
    if not os.path.exists(cal_file):
        cal_file = os.path.join(data_dir, "academic_calendar.json")
    cal_data = load_json_file(cal_file)
    cal_count = 0
    if cal_data:
        for cal in cal_data:
            cursor.execute("""
                INSERT OR REPLACE INTO academic_calendar (
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
            cal_count += 1
    print(f"  Seeded {rule_count} system configuration rules and {cal_count} academic calendars.")

    conn.commit()
    conn.close()

    print("\n================================================================")
    print("Database seeding completed successfully!")
    print(f"Database ready at: {os.path.abspath(db_path)}")
    print("================================================================")


def main():
    parser = argparse.ArgumentParser(description="EVA Database Seeder")
    parser.add_argument("--reset", action="store_true", help="Reset/drop existing database before seeding")
    parser.add_argument("--data-dir", default=DEFAULT_DATA_DIR, help="Path to data directory (e.g. data/dummy or data/production)")
    parser.add_argument("--config-dir", default=DEFAULT_CONFIG_DIR, help="Path to config directory (e.g. data/config)")
    parser.add_argument("--db-path", default=DEFAULT_DB_PATH, help="Destination SQLite database file path")
    parser.add_argument("--schema", default=DEFAULT_SCHEMA_PATH, help="Path to SQL schema file")

    args = parser.parse_args()
    run_seed(
        data_dir=os.path.abspath(args.data_dir),
        config_dir=os.path.abspath(args.config_dir),
        db_path=os.path.abspath(args.db_path),
        schema_path=os.path.abspath(args.schema),
        reset=args.reset
    )


if __name__ == "__main__":
    main()
