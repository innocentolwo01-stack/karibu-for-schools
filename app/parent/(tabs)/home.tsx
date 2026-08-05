import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { children } from '@/data/mock';
import { getGreeting } from '@/lib/greeting';
import { useApp } from '@/context/AppContext';

export default function ParentHome() {
  const { session, data, selectedChild, selectChild, unreadCount } = useApp();
  const upcoming = data.appointments.find(item => item.status === 'confirmed' || item.status === 'pending');

  return (
    <Screen background="warm">
      <Header
        title={getGreeting(session?.name ?? 'Parent')}
        subtitle="Everything that needs your attention, in one place."
        right={
          <View style={styles.headerActions}>
            <IconButton icon="search-outline" onPress={() => router.push('/modules/search')} />
            <IconButton icon="notifications-outline" badge={unreadCount} onPress={() => router.push('/parent/messages')} />
          </View>
        }
      />

      <Card style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>FAMILY SCHOOL BALANCE</Text>
            <Text style={styles.balanceValue}>UGX {data.feeBalance.toLocaleString('en-GB')}</Text>
          </View>
          <View style={styles.shield}><Text style={styles.shieldText}>✓</Text></View>
        </View>
        <Text style={styles.balanceHelper}>Across {children.length} linked children · Updated just now</Text>
        <View style={styles.balanceStripe}>
          <View style={styles.stripeRed} />
          <View style={styles.stripeYellow} />
        </View>
      </Card>

      <View style={styles.quickRow}>
        <QuickAction icon="card" label="Pay fees" tone="red" onPress={() => router.push('/parent/payments')} />
        <QuickAction icon="calendar" label="Book teacher" tone="blue" onPress={() => router.push('/parent/book-appointment')} />
        <QuickAction icon="document-text" label="Reports" tone="yellow" onPress={() => router.push('/parent/reports')} />
        <QuickAction icon="apps" label="All services" tone="black" onPress={() => router.push('/modules')} />
      </View>

      <Section title="My children" action="Manage" onAction={() => router.push('/parent/children')} />
      <View style={styles.childSelector}>
        {children.map(item => (
          <Pressable
            key={item.id}
            onPress={() => selectChild(item.id)}
            style={({ pressed }) => [styles.childChip, selectedChild.id === item.id && styles.childChipActive, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.childEmoji}>{item.avatar}</Text>
            <View>
              <Text style={[styles.childChipName, selectedChild.id === item.id && { color: colors.red }]}>{item.name.split(' ')[0]}</Text>
              <Text style={styles.childChipClass}>{item.className.replace('Senior', 'S').replace('Primary', 'P')}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Card style={styles.childCard}>
        <View style={styles.childCardTop}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{selectedChild.avatar}</Text></View>
          <View style={styles.flex}>
            <Text style={styles.childName}>{selectedChild.name}</Text>
            <Text style={styles.childSchool}>{selectedChild.school} · {selectedChild.className} {selectedChild.stream}</Text>
          </View>
          <Pill label="IN SCHOOL" tone="green" />
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Attendance</Text>
            <Text style={styles.metricValue}>{selectedChild.attendance}%</Text>
            <Progress value={selectedChild.attendance} tone="green" />
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Term average</Text>
            <Text style={styles.metricValue}>{selectedChild.average}%</Text>
            <Progress value={selectedChild.average} tone="blue" />
          </View>
        </View>
      </Card>

      <Section title="Needs attention" />
      <Card style={styles.attentionCard}>
        <View style={styles.attentionIcon}><Text style={styles.attentionIconText}>₦</Text></View>
        <View style={styles.flex}>
          <View style={styles.attentionTop}>
            <Pill label="DUE 14 AUG" tone="red" />
            <Text style={styles.attentionAmount}>UGX 500,000</Text>
          </View>
          <Text style={styles.attentionTitle}>Term 2 instalment</Text>
          <Text style={styles.muted}>A reminder will be sent before the due date.</Text>
          <Pressable onPress={() => router.push('/parent/payments')}><Text style={styles.link}>View statement and pay</Text></Pressable>
        </View>
      </Card>

      <Card style={styles.meetingCard}>
        <View style={styles.meetingHeader}>
          <View style={styles.meetingIcon}><Text style={styles.meetingEmoji}>📅</Text></View>
          <Pill label={upcoming ? 'UPCOMING' : 'BOOK A TEACHER'} tone="blue" />
        </View>
        <Text style={styles.meetingTitle}>{upcoming ? `${upcoming.subject} with ${upcoming.teacher}` : 'Talk to the right teacher, at the right time.'}</Text>
        <Text style={styles.muted}>{upcoming ? `${upcoming.dateLabel} at ${upcoming.time} · ${upcoming.method}` : 'Choose your child, subject and a live calendar slot for video, phone or an in-person meeting.'}</Text>
        <Pressable onPress={() => router.push(upcoming ? `/parent/appointment-confirmation/${upcoming.id}` as never : '/parent/book-appointment')}>
          <Text style={styles.link}>{upcoming ? 'Open meeting confirmation' : 'Book an appointment'}</Text>
        </Pressable>
      </Card>

      <Section title="School life" action="See everything" onAction={() => router.push('/modules')} />
      <Card style={styles.listCard}>
        <Row icon="bar-chart-outline" title="Performance and reports" subtitle="Scores, trends and teacher comments" onPress={() => router.push('/parent/performance')} />
        <Row icon="calendar-outline" title="Attendance" subtitle="Present, absent and late records" onPress={() => router.push('/parent/attendance')} />
        <Row icon="bus-outline" title="Trips and consent" subtitle="Itinerary, payment and permissions" onPress={() => router.push('/parent/trips')} />
        <Row icon="school-outline" title="Assignments and school work" subtitle="See what is due or missing" onPress={() => router.push('/parent/assignments')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  balanceCard: { backgroundColor: colors.black, padding: 20, overflow: 'hidden', ...shadows.floating },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#BDBDC3', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  balanceValue: { color: colors.white, fontSize: 34, fontWeight: '900', letterSpacing: -1.2, marginTop: 7 },
  balanceHelper: { color: '#BDBDC3', fontSize: 11, marginTop: 9 },
  shield: { width: 45, height: 45, borderRadius: 17, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  shieldText: { color: colors.black, fontSize: 22, fontWeight: '900' },
  balanceStripe: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, flexDirection: 'row' },
  stripeRed: { flex: 1, backgroundColor: colors.red },
  stripeYellow: { flex: 1, backgroundColor: colors.yellow },
  quickRow: { flexDirection: 'row', gap: 7, marginTop: 20 },
  childSelector: { flexDirection: 'row', gap: 9 },
  childChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 62, borderRadius: 20, backgroundColor: colors.white, paddingHorizontal: 12, ...shadows.soft },
  childChipActive: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  childEmoji: { fontSize: 28 },
  childChipName: { fontWeight: '900', fontSize: 13 },
  childChipClass: { color: colors.muted, fontSize: 10, marginTop: 2 },
  childCard: { marginTop: 10 },
  childCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 58, height: 58, borderRadius: 21, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 31 },
  childName: { fontSize: 18, fontWeight: '900' },
  childSchool: { color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 16 },
  metrics: { flexDirection: 'row', marginTop: 20, paddingTop: 17, borderTopWidth: 1, borderTopColor: colors.border },
  metric: { flex: 1 },
  metricDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  metricLabel: { color: colors.muted, fontSize: 11 },
  metricValue: { fontSize: 24, fontWeight: '900', marginVertical: 8 },
  attentionCard: { flexDirection: 'row', gap: 13 },
  attentionIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.paleRed, alignItems: 'center', justifyContent: 'center' },
  attentionIconText: { color: colors.red, fontSize: 23, fontWeight: '900' },
  attentionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  attentionAmount: { color: colors.red, fontWeight: '900', fontSize: 13 },
  attentionTitle: { fontSize: 17, fontWeight: '900', marginTop: 10 },
  muted: { color: colors.muted, lineHeight: 19, marginTop: 5, fontSize: 12 },
  link: { color: colors.red, fontWeight: '900', marginTop: 13, fontSize: 13 },
  meetingCard: { marginTop: 10, backgroundColor: '#F7F9FF' },
  meetingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meetingIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.paleBlue, alignItems: 'center', justifyContent: 'center' },
  meetingEmoji: { fontSize: 23 },
  meetingTitle: { fontSize: 18, fontWeight: '900', marginTop: 15, lineHeight: 23 },
  listCard: { paddingVertical: 2 },
});
