# Karibu For Schools v0.2

Android-first, installable preview prototype. It does not use Expo Go or expo-dev-client.

## What works in this prototype
- Branded splash, welcome and three-step onboarding
- Persistent onboarding and demo session
- Parent, student and teacher logins and role dashboards
- Parent: child overview, performance, attendance, reports, fees, trips, trip consent, demo payments, receipts and appointments
- Student: subjects, assignments, tests, results and timetable
- Teacher: classes, register, assignments, results and parent appointments
- Time-based personalised greetings
- Local demo data and state persistence

## Demo accounts
School code: `GREENHILL`

- Parent: `PARENT001`
- Student: `IA9TDJM`
- Teacher: `TCH00427`
- Any password works in this prototype.

## Build an installed APK in the cloud

```bash
npm install
npx eas-cli@latest build --platform android --profile preview
```

When the build finishes, install it on the running emulator:

```bash
npx eas-cli@latest build:run --platform android
```

This creates a normal app icon and launches without Expo Go. Real mobile-money/card transactions, live school data and authentication still require backend/provider integration.
