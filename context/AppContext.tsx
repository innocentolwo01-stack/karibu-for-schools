import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { children, seededAssignments, teacherStudents } from '@/data/mock';

export type Role = 'parent' | 'student' | 'teacher';
export type Session = { role: Role; name: string; identifier: string; schoolCode: string };
export type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded';
export type Payment = {
  id: string;
  title: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  category: 'fees' | 'trip' | 'cafeteria' | 'shop' | 'donation' | 'admission';
  createdAt: string;
  relatedId?: string;
};
export type MeetingMethod = 'video' | 'phone' | 'in-person';
export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type Appointment = {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  teacher: string;
  teacherId: string;
  method: MeetingMethod;
  date: string;
  dateLabel: string;
  time: string;
  duration: number;
  reason: string;
  status: AppointmentStatus;
  meetingLink?: string;
  phone?: string;
  location?: string;
  calendarAdded?: boolean;
  createdAt: string;
};
export type AppNotification = {
  id: string;
  role: Role | 'all';
  title: string;
  body: string;
  route: string;
  read: boolean;
  createdAt: string;
};
export type AssignmentStatus = 'Not started' | 'In progress' | 'Submitted' | 'Submitted late' | 'Returned for changes' | 'Marked';
export type Assignment = {
  id: string;
  subject: string;
  title: string;
  due: string;
  status: AssignmentStatus;
  feedback: string;
  score?: number;
  submittedAt?: string;
  instructions?: string;
  attachment?: string;
};
export type AttendanceStatus = 'Present' | 'Late' | 'Absent';
export type AttendanceEntry = {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  arrival?: string;
  note?: string;
};
export type AttendanceRegister = {
  id: string;
  className: string;
  lesson: string;
  date: string;
  source: 'manual' | 'qr';
  submitted: boolean;
  entries: AttendanceEntry[];
};
export type QrSession = {
  id: string;
  className: string;
  lesson: string;
  token: string;
  expiresAt: number;
  scannedIds: string[];
  active: boolean;
};

type DemoData = {
  selectedChildId: string;
  feeBalance: number;
  paidTrips: Record<string, boolean>;
  tripConsent: Record<string, boolean>;
  payments: Payment[];
  appointments: Appointment[];
  notifications: AppNotification[];
  assignments: Assignment[];
  registers: AttendanceRegister[];
  qrSession: QrSession | null;
  moduleState: Record<string, string | number | boolean>;
};

type BookAppointmentInput = Omit<Appointment, 'id' | 'createdAt' | 'status' | 'meetingLink' | 'phone' | 'location'> & {
  requiresApproval?: boolean;
};

type AppState = {
  ready: boolean;
  onboarded: boolean;
  session: Session | null;
  data: DemoData;
  selectedChild: (typeof children)[number];
  unreadCount: number;
  finishOnboarding: () => Promise<void>;
  login: (role: Role, identifier: string, schoolCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  selectChild: (id: string) => void;
  createPayment: (input: Omit<Payment, 'id' | 'createdAt'>) => Promise<Payment>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  refundPayment: (id: string) => void;
  bookAppointment: (input: BookAppointmentInput) => Promise<Appointment>;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (input: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  updateAssignmentStatus: (id: string, status: AssignmentStatus, extras?: Partial<Assignment>) => void;
  createAssignment: (title: string, subject: string, due: string, extras?: Pick<Assignment, 'instructions' | 'attachment'>) => void;
  saveRegister: (input: Omit<AttendanceRegister, 'id'>) => void;
  startQrSession: (className: string, lesson: string) => void;
  rotateQrToken: () => void;
  scanQr: (studentId: string) => { ok: boolean; message: string };
  closeQrSession: () => void;
  setModuleValue: (key: string, value: string | number | boolean) => void;
  resetDemo: () => Promise<void>;
};

const nowLabel = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const makeQrToken = () => `KFS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const initialData: DemoData = {
  selectedChildId: 'amani',
  feeBalance: 1250000,
  paidTrips: {},
  tripConsent: {},
  payments: [
    { id: 'pay-seed-1', title: 'Term 2 school fees', amount: 500000, method: 'MTN Mobile Money', status: 'successful', category: 'fees', createdAt: '2026-05-10T09:20:00.000Z' },
    { id: 'pay-seed-2', title: 'Boarding instalment', amount: 250000, method: 'Airtel Money', status: 'successful', category: 'fees', createdAt: '2026-06-14T11:10:00.000Z' },
  ],
  appointments: [
    { id: 'appointment-seed-1', childId: 'amani', childName: 'Amani Olwo', subject: 'Biology', teacher: 'Mrs Nakato', teacherId: 'tch-bio', method: 'phone', date: '2026-08-11', dateLabel: 'Tue 11 Aug', time: '15:00', duration: 20, reason: 'Discuss recent Biology progress and revision support.', status: 'pending', phone: '+256 700 123 456', createdAt: '2026-08-04T10:30:00.000Z' },
  ],
  notifications: [
    { id: 'n1', role: 'parent', title: 'Term 2 instalment due', body: 'UGX 500,000 is due by 14 August.', route: '/parent/payments', read: false, createdAt: '2026-08-04T08:00:00.000Z' },
    { id: 'n2', role: 'student', title: 'Mathematics assignment due', body: 'Quadratic equations worksheet is due tomorrow.', route: '/student/learning', read: false, createdAt: '2026-08-04T09:15:00.000Z' },
    { id: 'n3', role: 'teacher', title: 'Parent meeting request', body: 'A parent would like to discuss Biology progress.', route: '/teacher/appointments', read: false, createdAt: '2026-08-04T10:30:00.000Z' },
    { id: 'n4', role: 'all', title: 'School sports day', body: 'Sports day is scheduled for Saturday, 22 August.', route: '/modules/events', read: false, createdAt: '2026-08-03T14:00:00.000Z' },
  ],
  assignments: seededAssignments,
  registers: [],
  qrSession: null,
  moduleState: {
    transportProgress: 42,
    cafeteriaBalance: 35000,
    shopOrderPlaced: false,
    libraryReserved: false,
    libraryRenewed: false,
    boardingLeaveRequested: false,
    admissionSubmitted: false,
    alumniRegistered: false,
    visitorRegistered: false,
    googleConnected: false,
    microsoftConnected: false,
    aiDraftGenerated: false,
  },
};

const AppContext = createContext<AppState | null>(null);
const KEYS = {
  onboarded: 'kfs_v03_onboarded',
  session: 'kfs_v03_session',
  data: 'kfs_v03_data',
};

export function AppProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<DemoData>(initialData);

  useEffect(() => {
    (async () => {
      try {
        setOnboarded((await AsyncStorage.getItem(KEYS.onboarded)) === '1');
        const storedSession = await AsyncStorage.getItem(KEYS.session);
        const storedData = await AsyncStorage.getItem(KEYS.data);
        if (storedSession) setSession(JSON.parse(storedSession));
        if (storedData) setData({ ...initialData, ...JSON.parse(storedData) });
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const commit = (updater: (previous: DemoData) => DemoData) => {
    setData(previous => {
      const next = updater(previous);
      void AsyncStorage.setItem(KEYS.data, JSON.stringify(next));
      return next;
    });
  };

  const finishOnboarding = async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(KEYS.onboarded, '1');
  };

  const login = async (role: Role, identifier: string, schoolCode = 'GREENHILL') => {
    const names = { parent: 'Innocent Olwo', student: 'Amani Olwo', teacher: 'Mrs Nakato' };
    const next: Session = { role, name: names[role], identifier, schoolCode };
    setSession(next);
    await AsyncStorage.setItem(KEYS.session, JSON.stringify(next));
  };

  const logout = async () => {
    setSession(null);
    await AsyncStorage.removeItem(KEYS.session);
  };

  const switchRole = async (role: Role) => {
    const identifiers = { parent: 'PARENT001', student: 'IA9TDJM', teacher: 'TCH00427' };
    await login(role, identifiers[role], session?.schoolCode ?? 'GREENHILL');
  };

  const selectChild = (id: string) => commit(previous => ({ ...previous, selectedChildId: id }));

  const addNotification = (input: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const notification: AppNotification = { ...input, id: makeId('notification'), read: false, createdAt: nowLabel() };
    commit(previous => ({ ...previous, notifications: [notification, ...previous.notifications] }));
  };

  const createPayment = async (input: Omit<Payment, 'id' | 'createdAt'>) => {
    const payment: Payment = { ...input, id: makeId('payment'), createdAt: nowLabel() };
    commit(previous => {
      let feeBalance = previous.feeBalance;
      let paidTrips = previous.paidTrips;
      if (input.status === 'successful' && input.category === 'fees') feeBalance = Math.max(0, feeBalance - input.amount);
      if (input.status === 'successful' && input.category === 'trip' && input.relatedId) paidTrips = { ...paidTrips, [input.relatedId]: true };
      return { ...previous, feeBalance, paidTrips, payments: [payment, ...previous.payments] };
    });
    addNotification({
      role: 'parent',
      title: input.status === 'successful' ? 'Payment completed' : input.status === 'pending' ? 'Payment pending' : 'Payment failed',
      body: `${input.title} · UGX ${input.amount.toLocaleString('en-GB')}`,
      route: `/parent/payment-receipt/${payment.id}`,
    });
    return payment;
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    const payment = data.payments.find(item => item.id === id);
    if (!payment || payment.status === status) return;
    commit(previous => {
      let feeBalance = previous.feeBalance;
      let paidTrips = previous.paidTrips;
      const becomingSuccessful = payment.status !== 'successful' && status === 'successful';
      const reversingSuccessful = payment.status === 'successful' && status === 'refunded';
      if (payment.category === 'fees' && becomingSuccessful) feeBalance = Math.max(0, feeBalance - payment.amount);
      if (payment.category === 'fees' && reversingSuccessful) feeBalance += payment.amount;
      if (payment.category === 'trip' && payment.relatedId && becomingSuccessful) paidTrips = { ...paidTrips, [payment.relatedId]: true };
      if (payment.category === 'trip' && payment.relatedId && reversingSuccessful) paidTrips = { ...paidTrips, [payment.relatedId]: false };
      return {
        ...previous,
        feeBalance,
        paidTrips,
        payments: previous.payments.map(item => item.id === id ? { ...item, status } : item),
      };
    });
    addNotification({
      role: 'parent',
      title: status === 'successful' ? 'Pending payment confirmed' : status === 'refunded' ? 'Refund recorded' : 'Payment status updated',
      body: `${payment.title} · UGX ${payment.amount.toLocaleString('en-GB')}`,
      route: `/parent/payment-receipt/${id}`,
    });
  };

  const refundPayment = (id: string) => updatePaymentStatus(id, 'refunded');

  const bookAppointment = async (input: BookAppointmentInput) => {
    const status: AppointmentStatus = input.requiresApproval ? 'pending' : 'confirmed';
    const appointment: Appointment = {
      ...input,
      id: makeId('appointment'),
      createdAt: nowLabel(),
      status,
      meetingLink: input.method === 'video' ? 'https://meet.google.com/kar-ibu-demo' : undefined,
      phone: input.method === 'phone' ? '+256 700 123 456' : undefined,
      location: input.method === 'in-person' ? 'Greenhill Academy · Science Block · Room 12' : undefined,
    };
    commit(previous => ({ ...previous, appointments: [appointment, ...previous.appointments] }));
    addNotification({
      role: 'parent',
      title: status === 'confirmed' ? 'Meeting confirmed' : 'Meeting request sent',
      body: `${appointment.teacher} · ${appointment.dateLabel} at ${appointment.time}`,
      route: `/parent/appointment-confirmation/${appointment.id}`,
    });
    addNotification({
      role: 'teacher',
      title: status === 'confirmed' ? 'New parent appointment' : 'Appointment approval required',
      body: `${appointment.childName} · ${appointment.subject} · ${appointment.dateLabel}`,
      route: '/teacher/appointments',
    });
    return appointment;
  };

  const updateAppointment = (id: string, patch: Partial<Appointment>) => {
    const current = data.appointments.find(item => item.id === id);
    commit(previous => ({
      ...previous,
      appointments: previous.appointments.map(appointment => appointment.id === id ? { ...appointment, ...patch } : appointment),
    }));
    if (!current) return;
    const rescheduled = (patch.date && patch.date !== current.date) || (patch.time && patch.time !== current.time);
    if (rescheduled) {
      addNotification({ role: 'parent', title: 'Appointment rescheduled', body: `${current.teacher} · ${patch.dateLabel ?? current.dateLabel} at ${patch.time ?? current.time}`, route: `/parent/appointment-confirmation/${id}` });
      addNotification({ role: 'teacher', title: 'Appointment rescheduled', body: `${current.childName} · ${patch.dateLabel ?? current.dateLabel} at ${patch.time ?? current.time}`, route: '/teacher/appointments' });
    } else if (patch.status && patch.status !== current.status) {
      const labels: Record<AppointmentStatus, string> = {
        confirmed: 'Appointment confirmed',
        pending: 'Appointment awaiting approval',
        cancelled: 'Appointment cancelled',
        completed: 'Appointment completed',
      };
      addNotification({ role: 'parent', title: labels[patch.status], body: `${current.subject} with ${current.teacher}`, route: `/parent/appointment-confirmation/${id}` });
    }
  };

  const markNotificationRead = (id: string) => commit(previous => ({
    ...previous,
    notifications: previous.notifications.map(notification => notification.id === id ? { ...notification, read: true } : notification),
  }));

  const markAllNotificationsRead = () => commit(previous => ({
    ...previous,
    notifications: previous.notifications.map(notification => ({ ...notification, read: true })),
  }));

  const updateAssignmentStatus = (id: string, status: AssignmentStatus, extras: Partial<Assignment> = {}) => {
    commit(previous => ({
      ...previous,
      assignments: previous.assignments.map(assignment => assignment.id === id ? { ...assignment, status, ...extras } : assignment),
    }));
    if (status === 'Submitted' || status === 'Submitted late') {
      addNotification({ role: 'student', title: 'Assignment submitted', body: 'Your work has been submitted successfully.', route: `/student/assignment/${id}` });
      addNotification({ role: 'teacher', title: 'New assignment submission', body: 'Amani Olwo submitted an assignment.', route: '/teacher/assignments' });
    }
  };

  const createAssignment = (title: string, subject: string, due: string, extras: Pick<Assignment, 'instructions' | 'attachment'> = {}) => {
    const assignment: Assignment = { id: makeId('assignment'), title, subject, due, status: 'Not started', feedback: '', ...extras };
    commit(previous => ({ ...previous, assignments: [assignment, ...previous.assignments] }));
    addNotification({ role: 'student', title: 'New assignment', body: `${subject}: ${title}`, route: `/student/assignment/${assignment.id}` });
  };

  const saveRegister = (input: Omit<AttendanceRegister, 'id'>) => {
    const register: AttendanceRegister = { ...input, id: makeId('register') };
    commit(previous => ({ ...previous, registers: [register, ...previous.registers] }));
    const amani = input.entries.find(entry => entry.studentId === 'stu-amani');
    if (amani) addNotification({ role: 'parent', title: `Attendance: ${amani.status}`, body: `${input.lesson} · ${input.date}`, route: '/parent/attendance' });
  };

  const startQrSession = (className: string, lesson: string) => {
    const qrSession: QrSession = {
      id: makeId('qr'),
      className,
      lesson,
      token: makeQrToken(),
      expiresAt: Date.now() + 25000,
      scannedIds: [],
      active: true,
    };
    commit(previous => ({ ...previous, qrSession }));
  };

  const rotateQrToken = () => commit(previous => previous.qrSession ? ({
    ...previous,
    qrSession: { ...previous.qrSession, token: makeQrToken(), expiresAt: Date.now() + 25000 },
  }) : previous);

  const scanQr = (studentId: string) => {
    const sessionSnapshot = data.qrSession;
    if (!sessionSnapshot || !sessionSnapshot.active) return { ok: false, message: 'There is no active QR attendance session.' };
    if (Date.now() > sessionSnapshot.expiresAt) return { ok: false, message: 'This QR code has expired. Ask the teacher to refresh it.' };
    if (sessionSnapshot.scannedIds.includes(studentId)) return { ok: false, message: 'Attendance has already been recorded for this student.' };
    commit(previous => previous.qrSession ? ({
      ...previous,
      qrSession: { ...previous.qrSession, scannedIds: [...previous.qrSession.scannedIds, studentId] },
    }) : previous);
    return { ok: true, message: 'Attendance recorded successfully.' };
  };

  const closeQrSession = () => {
    if (!data.qrSession) return;
    const entries: AttendanceEntry[] = teacherStudents.map(student => ({
      studentId: student.id,
      studentName: student.name,
      status: data.qrSession?.scannedIds.includes(student.id) ? 'Present' : 'Absent',
      arrival: data.qrSession?.scannedIds.includes(student.id) ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    }));
    saveRegister({
      className: data.qrSession.className,
      lesson: data.qrSession.lesson,
      date: 'Tuesday, 4 August 2026',
      source: 'qr',
      submitted: true,
      entries,
    });
    commit(previous => ({ ...previous, qrSession: previous.qrSession ? { ...previous.qrSession, active: false } : null }));
  };

  const setModuleValue = (key: string, value: string | number | boolean) => commit(previous => ({
    ...previous,
    moduleState: { ...previous.moduleState, [key]: value },
  }));

  const resetDemo = async () => {
    setData(initialData);
    await AsyncStorage.setItem(KEYS.data, JSON.stringify(initialData));
  };

  const selectedChild = children.find(item => item.id === data.selectedChildId) ?? children[0];
  const unreadCount = data.notifications.filter(notification => !notification.read && (notification.role === 'all' || notification.role === session?.role)).length;

  const value = useMemo<AppState>(() => ({
    ready,
    onboarded,
    session,
    data,
    selectedChild,
    unreadCount,
    finishOnboarding,
    login,
    logout,
    switchRole,
    selectChild,
    createPayment,
    updatePaymentStatus,
    refundPayment,
    bookAppointment,
    updateAppointment,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    updateAssignmentStatus,
    createAssignment,
    saveRegister,
    startQrSession,
    rotateQrToken,
    scanQr,
    closeQrSession,
    setModuleValue,
    resetDemo,
  }), [ready, onboarded, session, data, selectedChild, unreadCount]);

  return <AppContext.Provider value={value}>{reactChildren}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be inside AppProvider');
  return context;
}
