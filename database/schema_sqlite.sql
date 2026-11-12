-- ====================================================================
-- EVA Platform Database Schema (SQLite)
-- Smart College Event & Venue Management Platform
-- Thapar Institute of Engineering and Technology (UCS 503P)
-- ====================================================================

PRAGMA foreign_keys = ON;

-- 1. Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    club_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Students & Club Coordinators)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK(role IN ('STUDENT', 'COORDINATOR', 'ADMIN')),
    club_id VARCHAR(50) REFERENCES clubs(club_id) ON DELETE SET NULL,
    department VARCHAR(100),
    year_of_study INTEGER CHECK(year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 5)),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    is_verified INTEGER NOT NULL DEFAULT 0 CHECK(is_verified IN (0, 1)),
    must_change_password INTEGER NOT NULL DEFAULT 0 CHECK(must_change_password IN (0, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Venues Table
CREATE TABLE IF NOT EXISTS venues (
    venue_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    building VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK(capacity > 0),
    facilities TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
    operating_start VARCHAR(10) NOT NULL DEFAULT '08:00',
    operating_end VARCHAR(10) NOT NULL DEFAULT '22:00',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'UNDER_MAINTENANCE', 'INACTIVE')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    club_id VARCHAR(50) NOT NULL REFERENCES clubs(club_id) ON DELETE RESTRICT,
    coordinator_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    category VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    venue_id VARCHAR(50) REFERENCES venues(venue_id) ON DELETE SET NULL,
    registration_capacity INTEGER NOT NULL CHECK(registration_capacity > 0),
    expected_participants INTEGER NOT NULL CHECK(expected_participants > 0),
    required_facilities TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
    registration_deadline DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bookings Table (Explicit Venue Allocations & Conflict Checks)
CREATE TABLE IF NOT EXISTS bookings (
    booking_id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    venue_id VARCHAR(50) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED' CHECK(status IN ('CONFIRMED', 'CANCELLED', 'PENDING')),
    created_by VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK(start_time < end_time)
);

-- 6. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    registration_id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    qr_token VARCHAR(255) NOT NULL UNIQUE,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED' CHECK(status IN ('CONFIRMED', 'CANCELLED')),
    CONSTRAINT uq_event_student UNIQUE (event_id, student_id)
);

-- 7. CheckIns (Footfall) Table
CREATE TABLE IF NOT EXISTS checkins (
    checkin_id VARCHAR(50) PRIMARY KEY,
    registration_id VARCHAR(50) NOT NULL UNIQUE REFERENCES registrations(registration_id) ON DELETE CASCADE,
    event_id VARCHAR(50) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scanned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scan_status VARCHAR(30) NOT NULL DEFAULT 'ACCEPTED' CHECK(scan_status IN ('ACCEPTED', 'REJECTED')),
    scanner_id VARCHAR(100) NOT NULL DEFAULT 'SCANNER-DEMO-01',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    overall_rating INTEGER NOT NULL CHECK(overall_rating BETWEEN 1 AND 5),
    organization_rating INTEGER NOT NULL CHECK(organization_rating BETWEEN 1 AND 5),
    venue_rating INTEGER NOT NULL CHECK(venue_rating BETWEEN 1 AND 5),
    comments TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_event_student_feedback UNIQUE (event_id, student_id)
);

-- 9. Historical Venue Usage Table (Analytics & Smart Venue Recommendation AI Baseline)
CREATE TABLE IF NOT EXISTS historical_venue_usage (
    usage_id VARCHAR(50) PRIMARY KEY,
    event_date DATE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    venue_id VARCHAR(50) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    venue_capacity INTEGER NOT NULL,
    expected_participants INTEGER NOT NULL,
    actual_footfall INTEGER NOT NULL,
    facilities_used TEXT NOT NULL,
    duration_hours REAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. System Configuration / Booking Rules Table
CREATE TABLE IF NOT EXISTS system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Academic Calendar Table
CREATE TABLE IF NOT EXISTS academic_calendar (
    calendar_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    holidays TEXT NOT NULL DEFAULT '[]', -- JSON array of dates
    exam_period_start DATE NOT NULL,
    exam_period_end DATE NOT NULL,
    is_demo INTEGER NOT NULL DEFAULT 1 CHECK(is_demo IN (0, 1))
);

-- Performance & Conflict Detection Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_events_club ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_bookings_lookup ON bookings(venue_id, booking_date, status);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_checkins_event ON checkins(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_event ON feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_historical_venue ON historical_venue_usage(venue_id);
