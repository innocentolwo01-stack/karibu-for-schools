# Karibu For Schools v0.3 acceptance test

## 1. First launch

1. Install and launch the APK.
2. Confirm the black Karibu native splash appears.
3. Complete all welcome and onboarding screens.
4. Log in as Parent using school code `GREENHILL`, ID `PARENT001`, and any non-empty password.
5. Close and reopen the application. Confirm onboarding and the session remain saved.

## 2. Parent

1. Switch between Amani and Daniel.
2. Open performance, attendance, reports and assignments.
3. Open Payments and complete one successful fee payment.
4. Complete one pending payment and one failed payment; retry the failed payment.
5. Open a receipt and run the refund simulation.
6. Open the Jinja trip, record consent and complete the trip payment.
7. Book a Biology video appointment, confirm it, add it to the calendar, open the meeting and complete it.
8. Book a phone appointment and an in-person appointment.
9. Reschedule one appointment and cancel another.
10. Open Messages and confirm notification deep links work.

## 3. Teacher

1. Switch role from More to Teacher.
2. Open Manual attendance, mark selected students late or absent and submit the register.
3. Start QR attendance and simulate several student scans.
4. Close the QR session and confirm the submitted register appears.
5. Create an assignment, publish it and open the assignment list.
6. Mark a submitted assignment or return it for changes.
7. Enter markbook scores and publish results.
8. Approve or decline a parent appointment.
9. Configure recurring availability and meeting types.
10. Open a confirmed video or telephone appointment and complete the simulated meeting.

## 4. Student

1. Switch role to Student.
2. Open Learning and start an assignment.
3. Add the test attachment and submit the assignment.
4. Open results, timetable and subject resources.
5. While a teacher QR session is active, use Scan to record attendance.
6. Confirm duplicate scans are rejected.
7. Open the digital student ID.

## 5. School modules

Use More → School modules and complete the primary action in every module:

- Advance transport and scan boarding
- Refresh a digital ID
- Create and close a visitor pass
- Purchase a cafeteria meal and top up the balance
- Add school-shop products and complete checkout
- Search, reserve and renew a library book
- Submit boarding leave
- Pay and submit an admission application
- Join the alumni network
- Complete a fundraising donation
- Toggle learning integrations
- Generate government reports
- Submit examination-board test entries
- Switch school campuses
- Submit a student transfer
- Simulate NFC attendance
- Confirm event participation
- Generate and approve an AI-assisted draft

## 6. Persistence and navigation

1. Move between all bottom tabs and confirm each role keeps its own navigation structure.
2. Use the Android back button from detail pages.
3. Close and reopen the app after payments, appointments, attendance and assignment changes.
4. Confirm the changes remain present.
5. Use More → Reset test data and confirm the seeded test state returns.
