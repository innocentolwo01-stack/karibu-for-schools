import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Row, Screen, Section, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { getGreeting } from '@/lib/greeting';
import { useApp } from '@/context/AppContext';

export default function TeacherHome() {
  const { session, data, unreadCount } = useApp();
  const pendingMeetings = data.appointments.filter(item => item.status === 'pending').length;
  const submittedAssignments = data.assignments.filter(item => item.status === 'Submitted').length;
  return (
    <Screen>
      <Header title={getGreeting(session?.name ?? 'Teacher')} subtitle="Four classes and three priority tasks today." right={<View style={styles.actions}><IconButton icon="apps-outline" onPress={() => router.push('/modules')} /><IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/teacher/messages')} /></View>} />
      <View style={styles.grid}><Stat label="First class" value="S3 Biology" helper="08:30 · Lab 2" tone="yellow" /><Stat label="Meeting requests" value={String(pendingMeetings || 2)} helper="Need a response" /></View>
      <Section title="Priority tasks" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="checkmark-circle-outline" title="Complete S3 Biology register" subtitle="Manual or QR attendance" right={<Pill label="DUE" tone="red" />} onPress={() => router.push('/teacher/attendance')} />
        <Row icon="document-text-outline" title="Mark assignment submissions" subtitle={`${submittedAssignments || 1} waiting for feedback`} right={<Pill label="MARK" tone="yellow" />} onPress={() => router.push('/teacher/assignments')} />
        <Row icon="calendar-outline" title="Parent meeting requests" subtitle="Review, approve or reschedule" right={<Pill label="RESPOND" tone="blue" />} onPress={() => router.push('/teacher/appointments')} last />
      </Card>
      <Section title="Today's classes" action="All classes" onAction={() => router.push('/teacher/classes')} />
      <Card style={{ paddingVertical: 2 }}>
        <Row title="08:30 · Senior 3 Biology" subtitle="Lab 2 · 36 students" onPress={() => router.push('/teacher/classes')} />
        <Row title="10:15 · Senior 2 Biology" subtitle="Room 12 · 41 students" onPress={() => router.push('/teacher/classes')} />
        <Row title="12:00 · Senior 4 Science" subtitle="Lab 1 · 33 students" onPress={() => router.push('/teacher/classes')} last />
      </Card>
      <Section title="Teaching tools" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="qr-code-outline" title="Start QR attendance" onPress={() => router.push('/teacher/qr-attendance')} />
        <Row icon="create-outline" title="Create assignment" onPress={() => router.push('/teacher/assignments')} />
        <Row icon="grid-outline" title="Open markbook" onPress={() => router.push('/teacher/markbook')} />
        <Row icon="book-outline" title="Lesson planning and curriculum" onPress={() => router.push('/modules/ai-support')} />
        <Row icon="settings-outline" title="Account and settings" onPress={() => router.push('/more')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ actions: { flexDirection: 'row', gap: 8 }, grid: { flexDirection: 'row', gap: 10 } });
