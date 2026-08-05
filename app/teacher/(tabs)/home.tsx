import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Card,
  Header,
  IconButton,
  Pill,
  QuickAction,
  Row,
  Screen,
  Section,
} from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { getGreeting } from '@/lib/greeting';
import { useApp } from '@/context/AppContext';

export default function TeacherHome() {
  const { session, data, unreadCount } = useApp();
  const pendingMeetings = data.appointments.filter(item => item.status === 'pending').length;
  const submittedAssignments = data.assignments.filter(item => item.status === 'Submitted').length;

  return (
    <Screen background="warm">
      <Header
        title={getGreeting(session?.name ?? 'Teacher')}
        subtitle="Your classes and priority work are ready."
        right={
          <View style={styles.actions}>
            <IconButton icon="search-outline" onPress={() => router.push('/teacher/student-search')} />
            <IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/teacher/messages')} />
          </View>
        }
      />

      <Card style={styles.classHero}>
        <View style={styles.classHeroTop}>
          <Pill label="NEXT CLASS" tone="yellow" />
          <Text style={styles.classTime}>08:30</Text>
        </View>
        <Text style={styles.classTitle}>Senior 3 Biology</Text>
        <Text style={styles.classMeta}>Lab 2 · 36 students · Cell transport</Text>
        <View style={styles.classActions}>
          <Pressable onPress={() => router.push('/teacher/manual-attendance')} style={styles.heroAction}>
            <Text style={styles.heroActionIcon}>✓</Text>
            <Text style={styles.heroActionText}>Manual register</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/teacher/qr-attendance')} style={[styles.heroAction, styles.heroActionYellow]}>
            <Text style={styles.heroActionIcon}>▦</Text>
            <Text style={styles.heroActionText}>Start QR attendance</Text>
          </Pressable>
        </View>
      </Card>

      <View style={styles.quickRow}>
        <QuickAction icon="create" label="Assignment" tone="red" onPress={() => router.push('/teacher/assignments')} />
        <QuickAction icon="grid" label="Markbook" tone="blue" onPress={() => router.push('/teacher/markbook')} />
        <QuickAction icon="calendar" label="Meetings" tone="yellow" onPress={() => router.push('/teacher/appointments')} />
        <QuickAction icon="apps" label="All tools" tone="black" onPress={() => router.push('/modules')} />
      </View>

      <Section title="Priority work" />
      <Card style={styles.taskList}>
        <Row
          icon="checkmark-circle-outline"
          title="Complete S3 Biology register"
          subtitle="Choose manual or QR attendance"
          right={<Pill label="DUE" tone="red" />}
          onPress={() => router.push('/teacher/attendance')}
        />
        <Row
          icon="document-text-outline"
          title="Mark assignment submissions"
          subtitle={`${submittedAssignments || 1} waiting for feedback`}
          right={<Pill label="MARK" tone="yellow" />}
          onPress={() => router.push('/teacher/assignments')}
        />
        <Row
          icon="calendar-outline"
          title="Parent meeting requests"
          subtitle={`${pendingMeetings || 2} waiting for a response`}
          right={<Pill label="RESPOND" tone="blue" />}
          onPress={() => router.push('/teacher/appointments')}
          last
        />
      </Card>

      <Section title="Today's classes" action="View timetable" onAction={() => router.push('/teacher/classes')} />
      <Card style={styles.schedule}>
        {[
          ['08:30', 'Senior 3 Biology', 'Lab 2 · 36 students'],
          ['10:15', 'Senior 2 Biology', 'Room 12 · 41 students'],
          ['12:00', 'Senior 4 Science', 'Lab 1 · 33 students'],
        ].map((item, index) => (
          <Pressable key={item[0]} onPress={() => router.push('/teacher/classes')} style={[styles.classRow, index === 2 && { borderBottomWidth: 0 }]}>
            <View style={[styles.timeBox, index === 0 && styles.timeBoxActive]}><Text style={[styles.timeBoxText, index === 0 && { color: colors.white }]}>{item[0]}</Text></View>
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{item[1]}</Text>
              <Text style={styles.rowSub}>{item[2]}</Text>
            </View>
            {index === 0 ? <Pill label="NEXT" tone="red" /> : null}
          </Pressable>
        ))}
      </Card>

      <Section title="Teaching tools" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="book-outline" title="Lesson planning and curriculum" subtitle="Schemes, resources and coverage" onPress={() => router.push('/modules/ai-support')} />
        <Row icon="people-outline" title="Classes and student profiles" subtitle="Progress, behaviour and support" onPress={() => router.push('/teacher/classes')} />
        <Row icon="chatbubbles-outline" title="Messages and announcements" subtitle="Parents, classes and staff" onPress={() => router.push('/teacher/messages')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: 8 },
  classHero: { backgroundColor: colors.black, padding: 20, ...shadows.floating },
  classHeroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  classTime: { color: colors.white, fontSize: 17, fontWeight: '900' },
  classTitle: { color: colors.white, fontSize: 31, fontWeight: '900', letterSpacing: -1, marginTop: 19 },
  classMeta: { color: '#C8C8CD', fontSize: 12, marginTop: 7 },
  classActions: { flexDirection: 'row', gap: 9, marginTop: 20 },
  heroAction: { flex: 1, minHeight: 58, borderRadius: 18, backgroundColor: '#2A2A2D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  heroActionYellow: { backgroundColor: colors.yellow },
  heroActionIcon: { fontSize: 18, fontWeight: '900' },
  heroActionText: { fontWeight: '900', fontSize: 11 },
  quickRow: { flexDirection: 'row', gap: 7, marginTop: 20 },
  taskList: { paddingVertical: 2 },
  schedule: { paddingVertical: 3 },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, borderBottomWidth: 1, borderBottomColor: colors.border },
  timeBox: { width: 58, height: 42, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  timeBoxActive: { backgroundColor: colors.red },
  timeBoxText: { fontWeight: '900', fontSize: 12 },
  rowTitle: { fontWeight: '900', fontSize: 15 },
  rowSub: { color: colors.muted, fontSize: 11, marginTop: 4 },
});
