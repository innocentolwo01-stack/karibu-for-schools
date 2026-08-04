import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Progress, Row, Screen, Section, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { children } from '@/data/mock';
import { getGreeting } from '@/lib/greeting';
import { useApp } from '@/context/AppContext';

export default function ParentHome() {
  const { session, data, selectedChild, selectChild, unreadCount } = useApp();
  const upcoming = data.appointments.find(item => item.status === 'confirmed' || item.status === 'pending');
  return (
    <Screen>
      <Header
        title={getGreeting(session?.name ?? 'Parent')}
        subtitle="Here is what needs your attention today."
        right={<View style={styles.headerActions}><IconButton icon="apps-outline" onPress={() => router.push('/modules')} /><IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/parent/messages')} /></View>}
      />
      <View style={styles.childTabs}>
        {children.map(item => (
          <Pressable key={item.id} onPress={() => selectChild(item.id)} style={[styles.childChip, selectedChild.id === item.id && styles.childChipActive]}>
            <Text style={styles.childEmoji}>{item.avatar}</Text><Text style={[styles.childChipText, selectedChild.id === item.id && { color: colors.red }]}>{item.name.split(' ')[0]}</Text>
          </Pressable>
        ))}
      </View>
      <Card style={styles.childCard}>
        <View style={styles.avatar}><Text style={{ fontSize: 31 }}>{selectedChild.avatar}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.name}>{selectedChild.name}</Text><Text style={styles.sub}>{selectedChild.school} · {selectedChild.className} {selectedChild.stream}</Text></View>
        <Pill label={selectedChild.term.toUpperCase()} tone="yellow" />
      </Card>
      <View style={styles.grid}><Stat label="Attendance" value={`${selectedChild.attendance}%`} helper="2 absences this term" /><Stat label="Average" value={`${selectedChild.average}%`} helper="Up 6% from Term 1" /></View>
      <Section title="Needs attention" />
      <Card style={styles.alertCard}>
        <View style={styles.alertTop}><Pill label="PAYMENT DUE" tone="red" /><Text style={styles.alertAmount}>UGX 500,000</Text></View>
        <Text style={styles.alertTitle}>Term 2 instalment</Text>
        <Text style={styles.sub}>Due by 14 August. Your current balance is UGX {data.feeBalance.toLocaleString('en-GB')}.</Text>
        <View style={{ marginTop: 15 }}><Progress value={62} /></View>
        <Text style={styles.link} onPress={() => router.push('/parent/payments')}>View statement and pay →</Text>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <Pill label={upcoming ? 'UPCOMING MEETING' : 'TEACHER MEETINGS'} tone="blue" />
        <Text style={styles.alertTitle}>{upcoming ? `${upcoming.subject} with ${upcoming.teacher}` : 'Book a subject teacher'}</Text>
        <Text style={styles.sub}>{upcoming ? `${upcoming.dateLabel} at ${upcoming.time} · ${upcoming.method}` : 'Choose a child, subject, meeting type and an available calendar slot.'}</Text>
        <Text style={styles.link} onPress={() => router.push(upcoming ? `/parent/appointment-confirmation/${upcoming.id}` as never : '/parent/book-appointment')}>{upcoming ? 'View confirmation →' : 'Book appointment →'}</Text>
      </Card>
      <Section title="School life" action="All modules" onAction={() => router.push('/modules')} />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="bar-chart-outline" title="Performance and reports" subtitle="Scores, trends and teacher comments" onPress={() => router.push('/parent/performance')} />
        <Row icon="calendar-outline" title="Attendance" subtitle="Present, absent and late records" onPress={() => router.push('/parent/attendance')} />
        <Row icon="bus-outline" title="Trips and consent" subtitle="Itinerary, payment and permissions" onPress={() => router.push('/parent/trips')} />
        <Row icon="school-outline" title="Assignments and school work" subtitle="See what is due or missing" onPress={() => router.push('/parent/assignments')} />
        <Row icon="settings-outline" title="Account and settings" onPress={() => router.push('/more')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: 8 },
  childTabs: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  childChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 42, borderRadius: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  childChipActive: { backgroundColor: colors.paleRed, borderColor: colors.red },
  childEmoji: { fontSize: 20 },
  childChipText: { fontWeight: '900' },
  childCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5, lineHeight: 19 },
  grid: { flexDirection: 'row', gap: 10, marginTop: 10 },
  alertCard: { backgroundColor: colors.white },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertAmount: { fontWeight: '900', color: colors.red },
  alertTitle: { fontWeight: '900', fontSize: 17, marginTop: 12 },
  link: { color: colors.red, fontWeight: '900', marginTop: 13 },
});
