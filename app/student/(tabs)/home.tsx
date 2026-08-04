import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Progress, Row, Screen, Section, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { getGreeting } from '@/lib/greeting';
import { timetable } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function StudentHome() {
  const { session, data, unreadCount } = useApp();
  const due = data.assignments.filter(item => !['Submitted', 'Marked'].includes(item.status));
  return (
    <Screen>
      <Header title={getGreeting(session?.name ?? 'Student')} subtitle="Your school day is ready." right={<View style={styles.headerActions}><IconButton icon="apps-outline" onPress={() => router.push('/modules')} /><IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/student/messages')} /></View>} />
      <View style={styles.grid}><Stat label="Next class" value="Mathematics" helper="08:30 · Room 14" tone="yellow" /><Stat label="Attendance" value="94%" helper="This term" /></View>
      <Section title="Today" action="Full timetable" onAction={() => router.push('/student/calendar')} />
      <Card style={{ paddingVertical: 2 }}>
        {timetable.slice(0, 3).map((item, index) => <Row key={item.time} title={`${item.time} · ${item.subject}`} subtitle={item.room} right={index === 0 ? <Pill label="NEXT" tone="red" /> : undefined} />)}
      </Card>
      <Section title="Needs attention" />
      {due.slice(0, 2).map(item => <Card key={item.id} style={styles.assignment}><View style={{ flex: 1 }}><Pill label={item.status.toUpperCase()} tone={item.status === 'In progress' ? 'blue' : 'yellow'} /><Text style={styles.assignmentTitle}>{item.title}</Text><Text style={styles.sub}>{item.subject} · Due {item.due}</Text></View><Text style={styles.open} onPress={() => router.push(`/student/assignment/${item.id}` as never)}>Open →</Text></Card>)}
      <Section title="Progress this term" />
      <Card><View style={styles.progressTop}><Text style={styles.progressTitle}>Overall average</Text><Text style={styles.progressValue}>77%</Text></View><View style={{ marginTop: 13 }}><Progress value={77} tone="blue" /></View><Text style={styles.sub}>Up 6% from Term 1. Mathematics is your strongest subject.</Text></Card>
      <Section title="Quick access" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="document-text-outline" title="Assignments" subtitle={`${due.length} need attention`} onPress={() => router.push('/student/learning')} />
        <Row icon="qr-code-outline" title="Scan attendance QR" subtitle="Join an active classroom register" onPress={() => router.push('/student/scan')} />
        <Row icon="stats-chart-outline" title="Results and reports" onPress={() => router.push('/student/results')} />
        <Row icon="settings-outline" title="Account and settings" onPress={() => router.push('/more')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: 8 },
  grid: { flexDirection: 'row', gap: 10 },
  assignment: { flexDirection: 'row', alignItems: 'center', marginBottom: 9, gap: 10 },
  assignmentTitle: { fontSize: 16, fontWeight: '900', marginTop: 10 },
  sub: { color: colors.muted, marginTop: 5, lineHeight: 19 },
  open: { color: colors.red, fontWeight: '900' },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontWeight: '900' },
  progressValue: { fontSize: 25, fontWeight: '900', color: colors.blue },
});
