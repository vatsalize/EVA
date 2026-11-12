# EVA dummy data package

**Every record is fictional and for local development/testing only.** It does not represent actual Thapar Institute data.

## Files
- clubs.json: 6 demo clubs
- venues.json: 8 demo venues, capacities, facilities and operating hours
- coordinators.json: 6 predefined coordinator profiles
- students.json: 12 demo student profiles
- events.json: 10 events (9 published, 1 draft)
- bookings.json: 9 confirmed bookings
- registrations.json: demo registrations
- checkins.json: accepted sample QR check-ins for the first 3 events
- feedback.json: sample feedback for the first 3 events
- historical_venue_usage.csv: 60 synthetic usage observations
- booking_rules.json: provisional booking and registration rules
- academic_calendar.json: provisional demo calendar
- DATA_INVENTORY.json: record counts

## Demo authentication
Coordinator login IDs: COO001 through COO006.
Temporary local-only password suggestion: `EVA-Demo@2026` for all coordinator accounts.
Hash this password with bcrypt or Argon2 in your backend seed script; never store plaintext passwords in the database. Require password change at first login.
Student records are demo fixtures; student passwords should also be hashed by the seed script if you choose to enable demo student login.

All demo emails use the reserved `.test` domain and cannot receive real email. Use a development OTP/mock mail flow until real institute email configuration is supplied.

## Important implementation rules
1. Keep the IDs and references consistent across files.
2. These are seed data, not a production schema.
3. Replace demo venues, club names, coordinator identities, academic dates and booking rules after receiving verified college data.
4. Synthetic historical usage is only for testing recommendation logic; do not present it as real-world model accuracy.
5. First filter venues deterministically by capacity, facilities, date/time availability and booking conflicts. AI may rank only the valid venues.
6. Enforce booking conflict checks atomically/transaction-safely in the database.
7. Student self-signup remains separate from predefined coordinator accounts; do not create a public coordinator signup endpoint.

## Suggested seed order
Clubs → Venues → Coordinators/Students → Events → Bookings → Registrations → Check-ins → Feedback → Historical venue usage.
