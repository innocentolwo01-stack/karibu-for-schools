import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, IconButton, Pill, Row, Screen, Section, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AttendanceHub() {
  const { data } = useApp();
  const latest = data.registers[0];
  return (
    <Screen>
      <Header title="Attendance" subtitle="Manual and QR registers" right={<IconButton icon="help-circle-outline" onPress={() => router.push('/settings/support')} />} />
      <View style={styles.grid}><Stat label="Today's registers" value={`${data.registers.length}/4`} helper="Completed" /><Stat label="Average attendance" value="94%" helper="All classes" tone="yellow" /></View>
      <Section title="Choose attendance method" />
      <Card style={styles.method}><View style={styles.icon}><Text style={{ fontSize: 30 }}>✓</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>Manual register</Text><Text style={styles.sub}>Everyone starts present. Mark only absent or late students.</Text></View></Card>
      <Button label="Open manual register" onPress={() => router.push('/teacher/manual-attendance')} />
      <Card style={[styles.method, { marginTop: 14 }]}><View style={[styles.icon, { backgroundColor: colors.paleYellow }]}><Text style={{ fontSize: 29 }}>▦</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>Dynamic QR register</Text><Text style={styles.sub}>Display a rotating classroom code and monitor scans live.</Text></View></Card>
      <Button label="Start QR attendance" variant="black" onPress={() => router.push('/teacher/qr-attendance')} />
      <Section title="Register history" />
      {latest ? data.registers.map(register => <Card key={register.id} style={styles.history}><View style={{ flex: 1 }}><Text style={styles.title}>{register.className}</Text><Text style={styles.sub}>{register.lesson} · {register.date}</Text></View><Pill label={register.source.toUpperCase()} tone={register.source === 'qr' ? 'blue' : 'black'} /></Card>) : <Card><Text style={styles.sub}>No registers have been submitted in this test session yet.</Text></Card>}
      <Section title="Attendance rules" />
      <Card style={{ paddingVertical: 2 }}><Row icon="time-outline" title="Late threshold" subtitle="08:15 for morning registration" /><Row icon="notifications-outline" title="Parent notifications" subtitle="Sent when register is submitted" /><Row icon="cloud-offline-outline" title="Offline queue" subtitle="Manual registers save locally before sync" last /></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 10 },
  icon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5, lineHeight: 19 },
  history: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
});
