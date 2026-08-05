import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  Card,
  Header,
  IconButton,
  Pill,
  Progress,
  QuickAction,
  Row,
  Screen,
  Section,
} from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { getGreeting } from '@/lib/greeting';
import { timetable } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function StudentHome() {
  const { session, data, unreadCount } = useApp();
  const due = data.assignments.filter(item => !['Submitted', 'Marked'].includes(item.status));

  return (
    <Screen background="warm">
      <Header
        title={getGreeting(session?.name ?? 'Student')}
        subtitle="Here is the clearest path through your day."
        right={
          <View style={styles.actions}>
            <IconButton icon="search-outline" onPress={() => router.push('/modules/search')} />
            <IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/student/messages')} />
          </View>
        }
      />

      <Card style={styles.nextCard}>
        <View style={styles.nextTop}>
          <Pill label="NEXT CLASS" tone="yellow" />
          <Text style={styles.nextTime}>08:30</Text>
        </View>
        <Text style={styles.nextTitle}>Mathematics</Text>
        <Text style={styles.nextMeta}>Room 14 · Mr Ssenyonga · Starts in 18 minutes</Text>
        <View style={styles.nextFooter}>
          <View style={styles.nextProgress}><Progress value={72} tone="blue" /></View>
          <Text style={styles.nextProgressText}>On track</Text>
        </View>
      </Card>

      <View style={styles.quickRow}>
        <QuickAction icon="qr-code" label="Scan QR" tone="red" onPress={() => router.push('/student/scan')} />
        <QuickAction icon="document-text" label="Assignments" tone="blue" onPress={() => router.push('/student/learning')} />
        <QuickAction icon="id-card" label="My ID" tone="yellow" onPress={() => router.push('/modules/digital-id')} />
        <QuickAction icon="library" label="Library" tone="green" onPress={() => router.push('/modules/library')} />
      </View>

      <Section title="Today's timetable" action="Full day" onAction={() => router.push('/student/calendar')} />
      <Card style={styles.timelineCard}>
        {timetable.slice(0, 4).map((item, index) => (
          <View key={item.time} style={[styles.timelineRow, index === timetable.slice(0, 4).length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.timeColumn}>
              <Text style={[styles.time, index === 0 && { color: colors.red }]}>{item.time}</Text>
              <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
            </View>
            <View style={styles.timelineCopy}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.room}>{item.room}</Text>
            </View>
            {index === 0 ? <Pill label="NEXT" tone="red" /> : null}
          </View>
        ))}
      </Card>

      <Section title="Needs attention" action={`${due.length} items`} />
      {due.slice(0, 2).map((item, index) => (
        <Card key={item.id} style={[styles.assignmentCard, index > 0 && { marginTop: 10 }]}>
          <View style={styles.assignmentIcon}><Text style={styles.assignmentEmoji}>{item.subject === 'Mathematics' ? '∑' : '✎'}</Text></View>
          <View style={styles.assignmentCopy}>
            <Pill label={item.status.toUpperCase()} tone={item.status === 'In progress' ? 'blue' : 'yellow'} />
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <Text style={styles.assignmentMeta}>{item.subject} · Due {item.due}</Text>
          </View>
          <Text style={styles.open} onPress={() => router.push(`/student/assignment/${item.id}` as never)}>Open</Text>
        </Card>
      ))}

      <Section title="Your progress" />
      <Card>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressLabel}>TERM AVERAGE</Text>
            <Text style={styles.progressValue}>77%</Text>
          </View>
          <View style={styles.trend}><Text style={styles.trendText}>↑ 6%</Text></View>
        </View>
        <Progress value={77} tone="blue" />
        <Text style={styles.progressBody}>Mathematics is your strongest subject. English has improved for three weeks in a row.</Text>
      </Card>

      <Section title="More for you" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="calendar-outline" title="Tests and exams" subtitle="Two assessments coming up" onPress={() => router.push('/student/tests')} />
        <Row icon="stats-chart-outline" title="Results and reports" subtitle="Scores, comments and trends" onPress={() => router.push('/student/results')} />
        <Row icon="heart-outline" title="Wellbeing support" subtitle="Request private support from school" onPress={() => router.push('/modules/ai-support')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8 },
  nextCard: { backgroundColor: colors.black, padding: 20, ...shadows.floating },
  nextTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nextTime: { color: colors.white, fontSize: 17, fontWeight: '900' },
  nextTitle: { color: colors.white, fontSize: 32, fontWeight: '900', letterSpacing: -1, marginTop: 20 },
  nextMeta: { color: '#C9C9CE', fontSize: 12, marginTop: 7 },
  nextFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  nextProgress: { flex: 1 },
  nextProgressText: { color: colors.yellow, fontWeight: '800', fontSize: 11 },
  quickRow: { flexDirection: 'row', gap: 7, marginTop: 20 },
  timelineCard: { paddingVertical: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', minHeight: 67, borderBottomWidth: 1, borderBottomColor: colors.border },
  timeColumn: { width: 66, alignItems: 'flex-start' },
  time: { fontWeight: '900', color: colors.text, fontSize: 13 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong, marginTop: 5 },
  timelineDotActive: { backgroundColor: colors.red },
  timelineCopy: { flex: 1 },
  subject: { fontWeight: '900', fontSize: 15 },
  room: { color: colors.muted, fontSize: 11, marginTop: 4 },
  assignmentCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assignmentIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  assignmentEmoji: { fontSize: 24, fontWeight: '900' },
  assignmentCopy: { flex: 1 },
  assignmentTitle: { fontWeight: '900', fontSize: 15, marginTop: 8 },
  assignmentMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  open: { color: colors.red, fontWeight: '900', fontSize: 12 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  progressLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  progressValue: { fontSize: 32, fontWeight: '900', marginTop: 5 },
  trend: { backgroundColor: colors.paleGreen, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  trendText: { color: colors.green, fontWeight: '900', fontSize: 12 },
  progressBody: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 13 },
});
