#!/usr/bin/env python3
"""
EVA Database Verification & Test Script
=======================================
Verifies database integrity, schema constraints, business rules,
and analytics queries as specified in the SRS and Proposal.
"""

import os
import sys
import json
import sqlite3
import hashlib
import binascii

DB_PATH = os.path.join(os.path.dirname(__file__), "eva.db")
INVENTORY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "dummy", "DATA_INVENTORY.json")


def verify_password(stored_hash: str, password: str) -> bool:
    try:
        parts = stored_hash.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = binascii.unhexlify(parts[2])
        expected_hash = parts[3]
        derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return binascii.hexlify(derived).decode("ascii") == expected_hash
    except Exception:
        return False


def run_verification():
    print("================================================================")
    print("EVA Database Verification & Validation Suite")
    print(f"Database File: {DB_PATH}")
    print("================================================================")

    if not os.path.exists(DB_PATH):
        print(f"ERROR: Database file does not exist at {DB_PATH}", file=sys.stderr)
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    errors = []

    # 1. Inventory counts test
    print("\n--- Test 1: Record Counts against DATA_INVENTORY.json ---")
    inventory = {}
    if os.path.exists(INVENTORY_PATH):
        with open(INVENTORY_PATH, "r", encoding="utf-8") as f:
            inventory = json.load(f)

    tables_to_check = [
        ("clubs", "clubs"),
        ("venues", "venues"),
        ("events", "events"),
        ("bookings", "bookings"),
        ("registrations", "registrations"),
        ("checkins", "checkins"),
        ("feedback", "feedback"),
        ("historical_venue_usage", "historical_usage_rows"),
    ]

    for table, inv_key in tables_to_check:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        expected = inventory.get(inv_key)
        print(f"  {table:25}: {count:3} rows (Expected from inventory: {expected})")
        if expected is not None and count != expected:
            errors.append(f"Count mismatch in {table}: expected {expected}, got {count}")

    # Check coordinators and students count in users table
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'COORDINATOR'")
    coordinators_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'STUDENT'")
    students_count = cursor.fetchone()[0]
    print(f"  users (coordinators)     : {coordinators_count:3} rows (Expected: {inventory.get('coordinators')})")
    print(f"  users (students)         : {students_count:3} rows (Expected: {inventory.get('students')})")

    # 2. Authentication Password Verification Test
    print("\n--- Test 2: Demo Password Hashing & Verification ---")
    cursor.execute("SELECT user_id, password_hash, role FROM users WHERE user_id IN ('COO001', 'STU001')")
    users = cursor.fetchall()
    for uid, phash, role in users:
        test_pw = "EVA-Demo@2026" if role == "COORDINATOR" else "Student@2026"
        valid = verify_password(phash, test_pw)
        print(f"  User {uid} ({role}) password verification: {'PASSED' if valid else 'FAILED'}")
        if not valid:
            errors.append(f"Password verification failed for user {uid}")

    # 3. Foreign Key Integrity Test
    print("\n--- Test 3: Foreign Key Integrity Check (PRAGMA foreign_key_check) ---")
    fk_errors = cursor.execute("PRAGMA foreign_key_check;").fetchall()
    if fk_errors:
        print(f"  FAILED: Foreign key violations detected: {fk_errors}")
        errors.append(f"Foreign key violations: {fk_errors}")
    else:
        print("  PASSED: Zero foreign key violations. All references exist and are valid.")

    # 4. Duplicate Registration Prevention Test
    print("\n--- Test 4: Business Rule - Prevent Duplicate Registration ---")
    try:
        # Try inserting duplicate registration for REG0001 (EVT001, STU001)
        cursor.execute("""
            INSERT INTO registrations (registration_id, event_id, student_id, qr_token, registered_at, status)
            VALUES ('REG_TEST_DUP', 'EVT001', 'STU001', 'UNIQUE_TOKEN_TEST', datetime('now'), 'CONFIRMED')
        """)
        conn.commit()
        errors.append("Constraint violation failed: Allowed duplicate student registration for same event!")
        print("  FAILED: Unique constraint on (event_id, student_id) did not fire.")
    except sqlite3.IntegrityError as e:
        print(f"  PASSED: Duplicate registration correctly prevented by database constraint: {e}")

    # 5. Duplicate Check-in Prevention Test
    print("\n--- Test 5: Business Rule - Prevent Duplicate QR Check-In ---")
    try:
        # CHK0001 already check in for REG0001
        cursor.execute("""
            INSERT INTO checkins (checkin_id, registration_id, event_id, student_id, scanned_at, scan_status, scanner_id)
            VALUES ('CHK_TEST_DUP', 'REG0001', 'EVT001', 'STU001', datetime('now'), 'ACCEPTED', 'SCANNER-DEMO-01')
        """)
        conn.commit()
        errors.append("Constraint violation failed: Allowed duplicate QR checkin for same registration!")
        print("  FAILED: Unique constraint on registration_id in checkins did not fire.")
    except sqlite3.IntegrityError as e:
        print(f"  PASSED: Duplicate QR checkin correctly prevented by unique constraint: {e}")

    # 6. Duplicate Feedback Prevention Test
    print("\n--- Test 6: Business Rule - Prevent Duplicate Feedback ---")
    try:
        cursor.execute("""
            INSERT INTO feedback (feedback_id, event_id, student_id, overall_rating, organization_rating, venue_rating, comments)
            VALUES ('FDB_TEST_DUP', 'EVT001', 'STU001', 5, 5, 5, 'Duplicate feedback test')
        """)
        conn.commit()
        errors.append("Constraint violation failed: Allowed duplicate feedback for same student and event!")
        print("  FAILED: Unique constraint on feedback(event_id, student_id) did not fire.")
    except sqlite3.IntegrityError as e:
        print(f"  PASSED: Duplicate feedback submission correctly rejected: {e}")

    # 7. Venue Booking Conflict Detection Simulation
    print("\n--- Test 7: Conflict Detection Query (Simulated Coordinator Booking) ---")
    # Let's check venue VEN001 on 2026-11-20 (EVT001 is booked 09:00 to 18:00)
    conflict_venue = "VEN001"
    conflict_date = "2026-11-20"
    candidate_start = "14:00"
    candidate_end = "17:00"

    cursor.execute("""
        SELECT booking_id, event_id, start_time, end_time, status
        FROM bookings
        WHERE venue_id = ?
          AND booking_date = ?
          AND status = 'CONFIRMED'
          AND NOT (end_time <= ? OR start_time >= ?)
    """, (conflict_venue, conflict_date, candidate_start, candidate_end))
    conflicts = cursor.fetchall()
    print(f"  Simulated booking request: Venue {conflict_venue} on {conflict_date} from {candidate_start} to {candidate_end}")
    if conflicts:
        print(f"  PASSED: Overlapping booking detected! Conflicts with: {conflicts}")
    else:
        print("  FAILED: Failed to detect conflict with EVT001 on VEN001.")
        errors.append("Conflict detection query failed.")

    # 8. Analytics & Footfall Turnout Metrics Query
    print("\n--- Test 8: Connected Lifecycle Analytics (Turnout Rate & Ratings) ---")
    cursor.execute("""
        SELECT 
            e.event_id,
            e.title,
            e.registration_capacity,
            COUNT(DISTINCT r.registration_id) AS total_registrations,
            COUNT(DISTINCT c.checkin_id) AS actual_footfall,
            ROUND((CAST(COUNT(DISTINCT c.checkin_id) AS REAL) / MAX(1, COUNT(DISTINCT r.registration_id))) * 100, 1) AS turnout_percentage,
            ROUND(AVG(f.overall_rating), 2) AS avg_rating,
            COUNT(DISTINCT f.feedback_id) AS feedback_count
        FROM events e
        LEFT JOIN registrations r ON e.event_id = r.event_id
        LEFT JOIN checkins c ON r.registration_id = c.registration_id AND c.scan_status = 'ACCEPTED'
        LEFT JOIN feedback f ON e.event_id = f.event_id
        GROUP BY e.event_id, e.title, e.registration_capacity
        ORDER BY e.event_id
        LIMIT 5;
    """)
    analytics_rows = cursor.fetchall()
    print(f"  {'Event':<10} | {'Title':<22} | {'Cap':<5} | {'Regs':<5} | {'Footfall':<8} | {'Turnout':<8} | {'Avg Rating':<10} | {'Reviews'}")
    print("  " + "-" * 95)
    for r in analytics_rows:
        eid, title, cap, regs, footfall, turnout, avg_rt, revs = r
        avg_rt_str = f"{avg_rt:.2f}" if avg_rt is not None else "N/A"
        print(f"  {eid:<10} | {title:<22} | {cap:<5} | {regs:<5} | {footfall:<8} | {turnout:>6.1f}% | {avg_rt_str:<10} | {revs}")

    # 9. AI Smart Venue Recommendation Query (Facilities + Capacity Match + Historical Footfall)
    print("\n--- Test 9: AI Venue Recommendation Historical Baseline ---")
    cursor.execute("""
        SELECT 
            h.venue_id,
            v.name,
            COUNT(h.usage_id) AS total_historical_events,
            ROUND(AVG(h.actual_footfall), 1) AS avg_footfall,
            ROUND(AVG(CAST(h.actual_footfall AS REAL) / h.venue_capacity) * 100, 1) AS avg_utilization_pct
        FROM historical_venue_usage h
        JOIN venues v ON h.venue_id = v.venue_id
        GROUP BY h.venue_id, v.name
        ORDER BY avg_utilization_pct DESC
        LIMIT 4;
    """)
    ai_rows = cursor.fetchall()
    print(f"  {'Venue ID':<10} | {'Venue Name':<25} | {'Historical Events':<18} | {'Avg Footfall':<12} | {'Avg Utilization'}")
    print("  " + "-" * 85)
    for r in ai_rows:
        vid, vname, ev_count, avg_ff, avg_util = r
        print(f"  {vid:<10} | {vname:<25} | {ev_count:<18} | {avg_ff:<12} | {avg_util:>5.1f}%")

    conn.close()

    print("\n================================================================")
    if errors:
        print(f"VERIFICATION FAILED WITH {len(errors)} ERROR(S):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (100% HEALTHY)")
        print("================================================================")


if __name__ == "__main__":
    run_verification()
