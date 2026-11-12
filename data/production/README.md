# Production College Data Integration Guide

This directory is reserved for **real college data** from Thapar Institute of Engineering and Technology (or any other campus deploying EVA).

## Architectural Separation of Data vs. Application Logic
Per project architectural standards, **all application logic and database routines are strictly decoupled from fixtures and mock data**. 
The application does not hardcode any dummy club names, demo venues, coordinator emails, or mock event IDs.

To replace the dummy data with real college data:
1. Place the real JSON/CSV data files in this directory (`data/production/`).
2. Run the seed script pointing to this directory:
   ```bash
   python database/seed.py --data-dir data/production --reset
   ```
3. Set your production environment variable:
   ```env
   EVA_DATA_DIR=data/production
   ```

---

## Required Files and Schemas

### 1. `clubs.json`
List of registered college clubs / student chapters.
```json
[
  {
    "club_id": "CLB-CCS",
    "name": "Creative Computing Society",
    "category": "Technical",
    "description": "Official technical society of Computer Engineering"
  }
]
```

### 2. `venues.json`
List of bookable campus spaces, capacities, facilities, and operating windows.
```json
[
  {
    "venue_id": "VEN-AUD-01",
    "name": "Main Auditorium",
    "building": "Central Campus",
    "capacity": 500,
    "facilities": ["projector", "sound_system", "stage", "air_conditioning", "wifi"],
    "operating_start": "08:00",
    "operating_end": "22:00",
    "status": "ACTIVE"
  }
]
```

### 3. `coordinators.json`
Pre-authorized student coordinators or faculty in-charges assigned to specific clubs.
```json
[
  {
    "coordinator_id": "COO-2026-001",
    "full_name": "Full Name",
    "email": "coordinator@thapar.edu",
    "club_id": "CLB-CCS",
    "role": "COORDINATOR",
    "is_active": true,
    "must_change_password": true
  }
]
```

### 4. `academic_calendar.json`
Semester dates, exam blackout periods, and institutional holidays.
```json
[
  {
    "calendar_id": "CAL-2026-ODD",
    "name": "Fall Semester 2026",
    "start_date": "2026-08-01",
    "end_date": "2026-12-24",
    "holidays": ["2026-10-02", "2026-11-12"],
    "exam_period_start": "2026-12-10",
    "exam_period_end": "2026-12-22",
    "demo_only": false
  }
]
```

### 5. `booking_rules.json` (Optional override)
Placed in `data/config/booking_rules.json` or overridden per environment.
```json
{
  "timezone": "Asia/Kolkata",
  "minimum_advance_booking_hours": 24,
  "maximum_booking_duration_hours": 8,
  "buffer_between_events_minutes": 30,
  "allow_overlapping_bookings": false,
  "coordinator_confirmation_required": true,
  "coordinator_can_manage_only_assigned_club": true,
  "registration_requires_published_event": true,
  "prevent_duplicate_registration": true,
  "prevent_duplicate_qr_checkin": true
}
```
