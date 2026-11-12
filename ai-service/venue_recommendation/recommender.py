#!/usr/bin/env python3
"""
EVA AI Smart Venue Recommendation Engine
=========================================
Explainable, deterministic ranking layer for college campus venue allocation.

Algorithm:
1. Deterministic Filtering (Backend source of truth):
   - Capacity fit (capacity >= expected_participants)
   - Facility coverage (all required facilities present)
   - Venue active status
   - Operating hours compatibility
   - Zero confirmed booking time conflicts
2. Explainable Multi-Factor Scoring (0 - 100):
   - Capacity Fit & Efficiency (0 - 35 points)
   - Facility Match & Amenities (0 - 25 points)
   - Category-Specific Historical Track Record (0 - 25 points)
   - Overall Venue Reliability & Utilization (0 - 15 points)
3. Transparent Explanation Generation for Club Coordinators
"""

import sys
import json
import sqlite3
import argparse
from typing import List, Dict, Any


def evaluate_venue_recommendations(
    db_path: str,
    expected_participants: int,
    required_facilities: List[str],
    event_category: str,
    event_date: str,
    start_time: str,
    end_time: str,
    exclude_event_id: str = None
) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Step 1: Retrieve all active venues
    cursor.execute("""
        SELECT venue_id, name, building, capacity, facilities, operating_start, operating_end, status
        FROM venues
        WHERE status = 'ACTIVE'
    """)
    all_venues = cursor.fetchall()

    # Step 2: Retrieve conflicting bookings
    conflict_query = """
        SELECT venue_id, start_time, end_time, event_id
        FROM bookings
        WHERE booking_date = ?
          AND status = 'CONFIRMED'
          AND NOT (end_time <= ? OR start_time >= ?)
    """
    params = [event_date, start_time, end_time]
    if exclude_event_id:
        conflict_query += " AND event_id != ?"
        params.append(exclude_event_id)

    cursor.execute(conflict_query, params)
    conflicts = {row["venue_id"]: row for row in cursor.fetchall()}

    # Step 3: Fetch historical usage data for category affinity
    cursor.execute("""
        SELECT venue_id, event_category, actual_footfall, venue_capacity, duration_hours
        FROM historical_venue_usage
    """)
    historical_rows = cursor.fetchall()

    # Aggregate historical metrics per venue
    hist_by_venue: Dict[str, List[sqlite3.Row]] = {}
    for r in historical_rows:
        vid = r["venue_id"]
        if vid not in hist_by_venue:
            hist_by_venue[vid] = []
        hist_by_venue[vid].append(r)

    conn.close()

    candidate_results = []
    required_facilities_set = set(f.strip().lower() for f in required_facilities if f.strip())

    for v in all_venues:
        venue_id = v["venue_id"]
        venue_name = v["name"]
        capacity = int(v["capacity"])
        venue_facilities = set(json.loads(v["facilities"])) if v["facilities"] else set()
        op_start = v["operating_start"]
        op_end = v["operating_end"]

        # Deterministic Filter A: Capacity Check
        if capacity < expected_participants:
            continue

        # Deterministic Filter B: Facilities Check
        if not required_facilities_set.issubset(venue_facilities):
            continue

        # Deterministic Filter C: Operating Hours Check
        if start_time < op_start or end_time > op_end:
            continue

        # Deterministic Filter D: Booking Conflict Check
        if venue_id in conflicts:
            continue

        # Venue is valid! Now perform Explainable Scoring
        reasons = []

        # 1. Capacity Fit & Efficiency (35 max)
        util_ratio = expected_participants / max(1, capacity)
        if 0.55 <= util_ratio <= 0.85:
            capacity_score = 35.0
            reasons.append(f"Ideal capacity fit ({round(util_ratio * 100)}% utilization for {expected_participants} attendees).")
        elif util_ratio < 0.55:
            # Too large, slight penalty for excess space
            capacity_score = max(10.0, 35.0 * (util_ratio / 0.55))
            reasons.append(f"Capacity is generous ({capacity} seats for {expected_participants} expected attendees).")
        else:
            # Over 85% full, tight fit
            capacity_score = max(15.0, 35.0 - (util_ratio - 0.85) * 60.0)
            reasons.append(f"Near full capacity ({round(util_ratio * 100)}% seats filled).")

        # 2. Facility Match & Amenities (25 max)
        facility_score = 18.0
        extra_facilities = venue_facilities - required_facilities_set
        bonus_amenities = extra_facilities.intersection({"air_conditioning", "sound_system", "stage", "wifi"})
        bonus = min(7.0, len(bonus_amenities) * 2.5)
        facility_score += bonus
        if bonus_amenities:
            reasons.append(f"Includes requested equipment plus bonus amenities: {', '.join(sorted(bonus_amenities)).replace('_', ' ')}.")
        else:
            reasons.append("Matches 100% of required technical and room facilities.")

        # 3. Category Historical Affinity (25 max)
        venue_history = hist_by_venue.get(venue_id, [])
        cat_history = [h for h in venue_history if h["event_category"].lower() == event_category.lower()]

        if cat_history:
            avg_cat_footfall = sum(h["actual_footfall"] for h in cat_history) / len(cat_history)
            avg_cat_util = sum(h["actual_footfall"] / h["venue_capacity"] for h in cat_history) / len(cat_history)
            cat_score = min(25.0, 15.0 + avg_cat_util * 10.0)
            reasons.append(f"Proven track record for {event_category} events (avg {round(avg_cat_footfall)} attendees across {len(cat_history)} past sessions).")
        elif venue_history:
            cat_score = 15.0
            reasons.append(f"High historical reliability ({len(venue_history)} prior campus events hosted successfully).")
        else:
            cat_score = 12.0
            reasons.append("Clean operational record with standard readiness.")

        # 4. Overall Venue Reliability & Operating Balance (15 max)
        if venue_history:
            avg_util = sum(h["actual_footfall"] / h["venue_capacity"] for h in venue_history) / len(venue_history)
            overall_score = min(15.0, 8.0 + avg_util * 7.0)
        else:
            overall_score = 10.0

        total_score = round(capacity_score + facility_score + cat_score + overall_score, 1)

        candidate_results.append({
            "venue_id": venue_id,
            "name": venue_name,
            "building": v["building"],
            "capacity": capacity,
            "facilities": list(venue_facilities),
            "score": total_score,
            "subscores": {
                "capacity_fit": round(capacity_score, 1),
                "facility_match": round(facility_score, 1),
                "category_affinity": round(cat_score, 1),
                "overall_reliability": round(overall_score, 1)
            },
            "reasons": reasons,
            "recommendation_summary": f"Recommended with {total_score}/100 match: {' '.join(reasons)}"
        })

    # Sort descending by score
    candidate_results.sort(key=lambda x: x["score"], reverse=True)
    return candidate_results


def main():
    parser = argparse.ArgumentParser(description="EVA AI Smart Venue Recommender")
    parser.add_argument("--db", required=True, help="Path to SQLite database")
    parser.add_argument("--expected", type=int, required=True, help="Expected participants")
    parser.add_argument("--category", required=True, help="Event category")
    parser.add_argument("--date", required=True, help="Event date (YYYY-MM-DD)")
    parser.add_argument("--start", required=True, help="Start time (HH:MM)")
    parser.add_argument("--end", required=True, help="End time (HH:MM)")
    parser.add_argument("--facilities", default="[]", help="JSON string or comma-separated facilities")
    parser.add_argument("--exclude-event", default=None, help="Event ID to exclude from conflict checking (for edits)")

    args = parser.parse_args()

    try:
        facilities = json.loads(args.facilities)
    except Exception:
        facilities = [f.strip() for f in args.facilities.split(",") if f.strip()]

    recommendations = evaluate_venue_recommendations(
        db_path=args.db,
        expected_participants=args.expected,
        required_facilities=facilities,
        event_category=args.category,
        event_date=args.date,
        start_time=args.start,
        end_time=args.end,
        exclude_event_id=args.exclude_event
    )

    print(json.dumps(recommendations, indent=2))


if __name__ == "__main__":
    main()
