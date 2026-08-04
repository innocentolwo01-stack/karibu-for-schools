# Karibu For Schools v0.3

A full interactive Android test build for parents, students and teachers. It installs as a normal application and does not require Expo Go.

## Test accounts

School code: `GREENHILL`

| Role | ID | Password |
|---|---|---|
| Parent | `PARENT001` | Any non-empty password |
| Student | `IA9TDJM` | Any non-empty password |
| Teacher | `TCH00427` | Any non-empty password |

The **More** screen lets testers switch roles without losing the shared sandbox data.

## Complete test journeys

- Native splash, welcome and four-step onboarding
- Persistent login, onboarding, role, child selection and app state
- Smooth role-specific bottom navigation and native stack transitions
- Parent: multiple children, academic progress, attendance, reports, assignments, payments, trips, consent, appointments and messages
- Student: timetable, subjects, assignments, submissions, feedback, results, QR attendance, digital ID and messages
- Teacher: classes, manual attendance, dynamic QR attendance, assignments, marking, markbook, appointments, availability and messages
- Appointment booking by child and subject with video, phone and in-person meeting simulations
- Sandbox payments with successful, pending and failed outcomes, receipts, retries and refund simulation
- Interactive transport, digital ID, visitors, cafeteria, school shop, library, boarding, admissions, alumni, fundraising, integrations, reporting, transfers, NFC and AI-assistance modules
- In-app notifications and deep links
- Local persistence through AsyncStorage

## Build the preview APK

```bash
npm install
npm run typecheck
npx eas-cli@latest build --platform android --profile preview --clear-cache
```

Install the completed APK on the running Android emulator:

```bash
npx eas-cli@latest build:run --platform android
```

## Test boundaries

This build uses controlled sandbox adapters. No real money is transferred, no real school records are changed, and no external Google Meet, Teams, Zoom, SMS, government or GPS provider is contacted. The internal workflows, state changes, receipts, attendance records, meeting confirmations and notifications are functional and testable.

See `TESTING.md` for the recommended acceptance test sequence.
