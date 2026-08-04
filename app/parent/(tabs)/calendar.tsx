import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, EmptyState, Header, IconButton, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ParentCalendar() {
  const { data } = useApp();
  const active = data.appointments.filter(item => item.status !== 'cancelled');
  return (
    <Screen>
      <Header title="Calendar" subtitle="Meetings, events and school dates" right={<IconButton icon="add" onPress={() => router.push('/parent/book-appointment')} />} />
      <Card style={styles.month}>
        <View style={styles.monthTop}><Text style={styles.monthTitle}>August 2026</Text><View style={{ flexDirection: 'row', gap: 8 }}><Pill label="MONTH" tone="red" /><Pill label="WEEK" tone="black" /></View></View>
        <View style={styles.week}>{['M','T','W','T','F','S','S'].map((day, index) => <Text key={`${day}-${index}`} style={styles.dayName}>{day}</Text>)}</View>
        <View style={styles.dates}>{Array.from({ length: 31 }, (_, index) => index + 1).map(day => <View key={day} style={[styles.date, [11,12,13,14,22].includes(day) && styles.dateBusy, day === 11 && styles.dateSelected]}><Text style={[styles.dateText, day === 11 && { color: colors.white }]}>{day}</Text></View>)}</View>
      </Card>
      <Section title="Appointments" action="Book new" onAction={() => router.push('/parent/book-appointment')} />
      {!active.length ? <EmptyState icon="calendar-outline" title="No teacher appointments" body="Book by child, subject and teacher, then choose video, phone or in-person." action="Book an appointment" onAction={() => router.push('/parent/book-appointment')} /> : active.map(item => (
        <Card key={item.id} style={styles.appointment}>
          <View style={{ flex: 1 }}><Pill label={item.status.toUpperCase()} tone={item.status === 'confirmed' ? 'green' : 'yellow'} /><Text style={styles.appointmentTitle}>{item.subject} · {item.teacher}</Text><Text style={styles.sub}>{item.dateLabel} at {item.time} · {item.method}</Text></View>
          <Text style={styles.open} onPress={() => router.push(`/parent/appointment-confirmation/${item.id}` as never)}>Open →</Text>
        </Card>
      ))}
      <Section title="School dates" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="football-outline" title="Sports day" subtitle="Saturday, 22 August" />
        <Row icon="document-text-outline" title="Mid-term reports published" subtitle="Friday, 28 August" />
        <Row icon="airplane-outline" title="Jinja Science Trip" subtitle="Friday, 18 September" onPress={() => router.push('/parent/trip/jinja')} last />
      </Card>
      <View style={{ marginTop: 18 }}><Button label="Book teacher appointment" onPress={() => router.push('/parent/book-appointment')} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  month: { padding: 15 },
  monthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthTitle: { fontSize: 20, fontWeight: '900' },
  week: { flexDirection: 'row', marginTop: 20 },
  dayName: { width: '14.28%', textAlign: 'center', color: colors.muted, fontWeight: '900', fontSize: 11 },
  dates: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  date: { width: '14.28%', height: 39, alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  dateBusy: { backgroundColor: colors.paleYellow },
  dateSelected: { backgroundColor: colors.red },
  dateText: { fontWeight: '800' },
  appointment: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  appointmentTitle: { fontWeight: '900', marginTop: 10 },
  sub: { color: colors.muted, marginTop: 5 },
  open: { color: colors.red, fontWeight: '900' },
});
