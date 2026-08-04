import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, EmptyState, Header, Pill, Row, Screen, Section, Segmented } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function TeacherAppointments() {
  const { data, updateAppointment } = useApp();
  const [view, setView] = useState<'appointments' | 'availability'>('appointments');
  const [video, setVideo] = useState(true);
  const [phone, setPhone] = useState(true);
  const [inPerson, setInPerson] = useState(true);
  const [saved, setSaved] = useState(false);
  return (
    <Screen>
      <Header title="Parent appointments" subtitle="Bookings, availability and follow-up" back onBack={() => router.back()} />
      <Segmented value={view} onChange={setView} options={[{ value: 'appointments', label: 'Appointments' }, { value: 'availability', label: 'Availability' }]} />
      {view === 'appointments' ? (
        <>
          <Section title="Requests and confirmed meetings" />
          {!data.appointments.length ? <EmptyState icon="calendar-outline" title="No appointments" body="Parent bookings will appear here." /> : data.appointments.map(appointment => <Card key={appointment.id} style={styles.meeting}><View style={styles.top}><Pill label={appointment.status.toUpperCase()} tone={appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : appointment.status === 'cancelled' ? 'red' : 'blue'} /><Pill label={appointment.method.toUpperCase()} tone="black" /></View><Text style={styles.title}>{appointment.childName} · {appointment.subject}</Text><Text style={styles.sub}>{appointment.dateLabel} at {appointment.time} · {appointment.duration} minutes</Text><Text style={styles.reason}>{appointment.reason}</Text>{appointment.status === 'pending' ? <View style={styles.actions}><Button label="Approve appointment" variant="green" onPress={() => updateAppointment(appointment.id, { status: 'confirmed' })} /><Button label="Decline" variant="outline" onPress={() => updateAppointment(appointment.id, { status: 'cancelled' })} /></View> : appointment.status === 'confirmed' ? <View style={styles.actions}><Button label={appointment.method === 'video' ? 'Open test meeting' : appointment.method === 'phone' ? 'Call parent' : 'View room details'} onPress={() => router.push(`/meeting/${appointment.id}` as never)} /><Button label="Mark completed" variant="outline" onPress={() => updateAppointment(appointment.id, { status: 'completed' })} /></View> : null}</Card>)}
        </>
      ) : (
        <>
          {saved ? <Card style={{ backgroundColor: colors.paleGreen, marginTop: 12 }}><Text style={{ color: colors.green, fontWeight: '900' }}>✓ Availability saved and parent calendar updated.</Text></Card> : null}
          <Section title="Recurring weekly availability" />
          <Card style={{ paddingVertical: 2 }}>
            <Row icon="calendar-outline" title="Monday" subtitle="15:30–17:00 · 20-minute slots" onPress={() => setSaved(false)} />
            <Row icon="calendar-outline" title="Wednesday" subtitle="13:00–15:00 · 20-minute slots" onPress={() => setSaved(false)} />
            <Row icon="calendar-outline" title="Friday" subtitle="14:00–16:00 · 20-minute slots" onPress={() => setSaved(false)} last />
          </Card>
          <Section title="Meeting types" />
          <Card style={{ paddingVertical: 2 }}>
            <Row icon="videocam-outline" title="Video calls" right={<Switch value={video} onValueChange={setVideo} trackColor={{ true: colors.green }} />} />
            <Row icon="call-outline" title="Phone calls" right={<Switch value={phone} onValueChange={setPhone} trackColor={{ true: colors.green }} />} />
            <Row icon="location-outline" title="In-person meetings" right={<Switch value={inPerson} onValueChange={setInPerson} trackColor={{ true: colors.green }} />} last />
          </Card>
          <Section title="Booking rules" />
          <Card style={{ paddingVertical: 2 }}><Row title="Appointment length" right={<Pill label="20 MIN" tone="blue" />} /><Row title="Buffer between meetings" right={<Pill label="10 MIN" tone="black" />} /><Row title="Minimum notice" right={<Pill label="24 HOURS" tone="yellow" />} /><Row title="Teacher approval" right={<Pill label="OPTIONAL" tone="green" />} last /></Card>
          <View style={{ marginTop: 18 }}><Button label="Save availability" onPress={() => setSaved(true)} /></View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meeting: { marginBottom: 10 }, top: { flexDirection: 'row', gap: 7 }, title: { fontSize: 18, fontWeight: '900', marginTop: 13 }, sub: { color: colors.muted, marginTop: 6 }, reason: { color: colors.muted, lineHeight: 20, marginTop: 11 }, actions: { gap: 8, marginTop: 15 },
});
