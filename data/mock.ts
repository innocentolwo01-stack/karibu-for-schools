export type ChildProfile = {
  id: string;
  name: string;
  school: string;
  className: string;
  stream: string;
  term: string;
  attendance: number;
  average: number;
  avatar: string;
};

export const children: ChildProfile[] = [
  { id: 'amani', name: 'Amani Olwo', school: 'Greenhill Academy', className: 'Senior 3', stream: 'Blue', term: 'Term 2, 2026', attendance: 94, average: 77, avatar: '👦🏾' },
  { id: 'malaika', name: 'Malaika Olwo', school: 'Greenhill Academy', className: 'Primary 6', stream: 'Gold', term: 'Term 2, 2026', attendance: 98, average: 84, avatar: '👧🏾' },
];

export const child = children[0];

export const subjects = [
  { id: 'math', name: 'Mathematics', score: 82, teacher: 'Mr Ssenyonga', teacherId: 'tch-math' },
  { id: 'english', name: 'English', score: 76, teacher: 'Ms Atim', teacherId: 'tch-eng' },
  { id: 'biology', name: 'Biology', score: 79, teacher: 'Mrs Nakato', teacherId: 'tch-bio' },
  { id: 'history', name: 'History', score: 70, teacher: 'Mr Okello', teacherId: 'tch-his' },
];

export const teachers = [
  { id: 'tch-math', name: 'Mr Ssenyonga', subject: 'Mathematics', room: 'Mathematics Office' },
  { id: 'tch-eng', name: 'Ms Atim', subject: 'English', room: 'Humanities Office' },
  { id: 'tch-bio', name: 'Mrs Nakato', subject: 'Biology', room: 'Science Block · Room 12' },
  { id: 'tch-his', name: 'Mr Okello', subject: 'History', room: 'Humanities Office' },
];

export const appointmentDates = [
  { date: '2026-08-11', label: 'Tue 11 Aug', times: ['15:00', '15:30', '16:00'] },
  { date: '2026-08-12', label: 'Wed 12 Aug', times: ['13:30', '14:00', '15:30'] },
  { date: '2026-08-13', label: 'Thu 13 Aug', times: ['14:30', '15:00', '16:00'] },
  { date: '2026-08-14', label: 'Fri 14 Aug', times: ['13:00', '13:30', '14:00'] },
];

export const attendanceDays = [
  { date: 'Mon 3 Aug', status: 'Present', arrival: '08:02' },
  { date: 'Fri 31 Jul', status: 'Present', arrival: '07:55' },
  { date: 'Thu 30 Jul', status: 'Late', arrival: '08:24' },
  { date: 'Wed 29 Jul', status: 'Present', arrival: '08:01' },
  { date: 'Tue 28 Jul', status: 'Absent', arrival: 'Excused' },
];

export const feeItems = [
  { id: 'tuition', title: 'Term 2 tuition', amount: 1200000, compulsory: true, paid: 500000 },
  { id: 'boarding', title: 'Boarding', amount: 600000, compulsory: true, paid: 250000 },
  { id: 'development', title: 'Development fee', amount: 150000, compulsory: true, paid: 0 },
  { id: 'exams', title: 'Examination fee', amount: 80000, compulsory: true, paid: 0 },
];

export const trips = [
  { id: 'jinja', title: 'Jinja Science Trip', date: '18 September 2026', amount: 180000, destination: 'Jinja, Uganda', departure: '06:30', returnTime: '18:00', teacher: 'Mrs Nakato', description: 'A full-day science and geography trip including the Source of the Nile and industrial study visits.' },
  { id: 'museum', title: 'Uganda Museum Visit', date: '13 November 2026', amount: 75000, destination: 'Kampala, Uganda', departure: '08:00', returnTime: '15:30', teacher: 'Mr Okello', description: 'A curriculum visit covering Ugandan history, culture and natural heritage.' },
];

export const seededAssignments = [
  { id: 'asg-math-1', subject: 'Mathematics', title: 'Quadratic equations worksheet', due: 'Tomorrow', status: 'Not started' as const, feedback: '', instructions: 'Complete every question and show each stage of your working.', attachment: 'Quadratic-equations-worksheet.pdf' },
  { id: 'asg-bio-1', subject: 'Biology', title: 'Plant transport report', due: '7 Aug', status: 'Submitted' as const, feedback: 'Good structure. Add one labelled diagram.', instructions: 'Write a short report explaining xylem and phloem transport.', attachment: 'Plant-transport-guide.pdf' },
  { id: 'asg-eng-1', subject: 'English', title: 'Essay: My Community', due: '10 Aug', status: 'In progress' as const, feedback: '', instructions: 'Write 600–800 words and include a clear introduction and conclusion.', attachment: 'Essay-writing-checklist.pdf' },
];

export const tests = [
  { subject: 'Biology', title: 'Cell structure test', date: '7 Aug', score: null },
  { subject: 'Mathematics', title: 'Algebra assessment', date: '12 Aug', score: null },
  { subject: 'English', title: 'Comprehension test', date: '28 Jul', score: 84 },
];

export const timetable = [
  { time: '08:30', subject: 'Mathematics', room: 'Room 14' },
  { time: '10:00', subject: 'English', room: 'Room 8' },
  { time: '11:30', subject: 'Biology', room: 'Lab 2' },
  { time: '14:00', subject: 'History', room: 'Room 5' },
];

export const teacherStudents = [
  { id: 'stu-amani', name: 'Amani Olwo' },
  { id: 'stu-tendo', name: 'Tendo Nsubuga' },
  { id: 'stu-grace', name: 'Grace Namusoke' },
  { id: 'stu-samuel', name: 'Samuel Kato' },
  { id: 'stu-joan', name: 'Joan Atim' },
  { id: 'stu-daniel', name: 'Daniel Okello' },
];

export const schoolModules = [
  { slug: 'transport', title: 'School transport', icon: 'bus-outline', summary: 'Routes, live tracking, boarding and drop-off.' },
  { slug: 'digital-id', title: 'Digital ID', icon: 'id-card-outline', summary: 'Student, staff and guardian QR identity.' },
  { slug: 'visitors', title: 'Visitor management', icon: 'people-circle-outline', summary: 'Pre-register visitors and issue QR passes.' },
  { slug: 'cafeteria', title: 'Cafeteria', icon: 'restaurant-outline', summary: 'Meal plans, menus, balances and purchases.' },
  { slug: 'shop', title: 'School shop', icon: 'bag-handle-outline', summary: 'Uniforms, books, stationery and collections.' },
  { slug: 'library', title: 'Library', icon: 'library-outline', summary: 'Catalogue, reservations, loans and returns.' },
  { slug: 'boarding', title: 'Boarding', icon: 'bed-outline', summary: 'Rooms, roll calls, leave and parent updates.' },
  { slug: 'admissions', title: 'Admissions', icon: 'document-attach-outline', summary: 'Apply, upload documents and track progress.' },
  { slug: 'alumni', title: 'Alumni', icon: 'school-outline', summary: 'Events, mentoring, news and engagement.' },
  { slug: 'fundraising', title: 'Fundraising', icon: 'heart-outline', summary: 'Campaigns, donations and receipts.' },
  { slug: 'integrations', title: 'Learning integrations', icon: 'git-network-outline', summary: 'Google Classroom, Microsoft Education and LMS.' },
  { slug: 'government-reporting', title: 'Government reporting', icon: 'business-outline', summary: 'Validated education reports and export history.' },
  { slug: 'examination-boards', title: 'Examination boards', icon: 'ribbon-outline', summary: 'Candidate entries, results and board integrations.' },
  { slug: 'school-groups', title: 'School groups', icon: 'layers-outline', summary: 'Multi-school chains, campuses and shared staff.' },
  { slug: 'student-transfer', title: 'Student transfers', icon: 'swap-horizontal-outline', summary: 'Secure cross-school records and acceptance.' },
  { slug: 'nfc-attendance', title: 'NFC attendance', icon: 'radio-outline', summary: 'Future-ready tap attendance using the same register.' },
  { slug: 'events', title: 'Events and clubs', icon: 'calendar-number-outline', summary: 'Activities, bookings, attendance and calendars.' },
  { slug: 'ai-support', title: 'AI school support', icon: 'sparkles-outline', summary: 'Human-reviewed drafts, summaries and insights.' },
];
