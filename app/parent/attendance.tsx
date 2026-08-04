import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Pill, Progress, Screen, Section, Stat } from '@/components/ui';
import { attendanceDays } from '@/data/mock';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function Attendance() {
  const { selectedChild } = useApp();
  return (
    <Screen>
      <Header title="Attendance" subtitle={`${selectedChild.name} · ${selectedChild.term}`} back onBack={() => router.back()} />
      <View style={styles.grid}><Stat label="Attendance rate" value={`${selectedChild.attendance}%`} helper="Above school target" /><Stat label="This term" value="63/67" helper="Days present" /></View>
      <Card style={styles.breakdown}>
        <View><Text style={styles.number}>63</Text><Text style={styles.muted}>Present</Text></View>
        <View><Text style={[styles.number, { color: colors.amber }]}>2</Text><Text style={styles.muted}>Late</Text></View>
        <View><Text style={[styles.number, { color: colors.red }]}>2</Text><Text style={styles.muted}>Absent</Text></View>
      </Card>
      <Section title="Term attendance" />
      <Card><Text style={styles.label}>School target: 90%</Text><View style={{ marginTop: 12 }}><Progress value={selectedChild.attendance} tone="green" /></View></Card>
      <Section title="Recent records" />
      {attendanceDays.map(item => <Card key={item.date} style={styles.day}><View style={{ flex: 1 }}><Text style={styles.title}>{item.date}</Text><Text style={styles.muted}>Arrival: {item.arrival}</Text></View><Pill label={item.status.toUpperCase()} tone={item.status === 'Present' ? 'green' : item.status === 'Late' ? 'yellow' : 'red'} /></Card>)}
      <Section title="How attendance was captured" />
      <Card><Text style={styles.body}>Registers can be completed manually by teachers or recorded through a rotating classroom QR code. Every correction keeps an audit trail.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  breakdown: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  number: { fontSize: 26, fontWeight: '900', textAlign: 'center', color: colors.green },
  muted: { color: colors.muted, marginTop: 4, fontSize: 12 },
  label: { fontWeight: '900' },
  day: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: '900' },
  body: { color: colors.muted, lineHeight: 21 },
});
