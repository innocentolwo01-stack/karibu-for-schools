# Karibu For Schools v0.4 — Premium Interactive Test Build

Karibu For Schools is an Android-first school operating app for parents, students and teachers. This build is designed to install as a normal APK and demonstrates complete, persistent end-to-end workflows without Expo Go.

## Premium experience

- Refined native splash and app icon
- Illustrated welcome and onboarding journey
- Smooth native stack transitions and floating role-specific navigation
- Redesigned parent, student and teacher command centres
- Premium payment, receipt and payment-status flows
- Calendly-style teacher booking by child, subject, meeting type, date and time
- Polished meeting confirmations and simulated video, phone and in-person meetings
- Manual and dynamic QR attendance
- Persistent local application state using AsyncStorage
- Loading, error, pending, failed and confirmation states
- Transport, digital ID, visitors, cafeteria, school shop, library, boarding, admissions, alumni and fundraising test modules

## Demo accounts

School code: `GREENHILL`

- Parent: `PARENT001`
- Student: `IA9TDJM`
- Teacher: `TCH00427`
- Any password works in this interactive test build.

## Validate

```bash
npm install
npm run validate:routes
npm run typecheck
npx expo-doctor
```

## Build an installable Android APK

```bash
npx eas-cli@latest build --platform android --profile preview --clear-cache
```

Install the latest completed build on the running emulator:

```bash
npx eas-cli@latest build:run --platform android --latest
```

## Important production boundary

All internal app workflows are functional and persistent. Payment processing, third-party video creation, SMS, live GPS and external school integrations use controlled test adapters until production credentials and backend services are connected.
