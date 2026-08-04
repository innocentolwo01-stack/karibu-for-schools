import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AppointmentConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateAppointment } = useApp();
  const appointment = data.appointments.find(item => item.id === id);
  if (!appointment) return <Screen><Header title="Appointment" back onBack={() => router.back()} /><Card><Text>Appointment not found.</Text></Card></Screen>;
  const cancelled = appointment.status === 'cancelled';
  return (
    <Screen>
      <Header title="Meeting confirmation" subtitle="Saved in your Karibu calendar" back onBack={() => router.replace('/parent/calendar')} />
      <View style={styles.hero}>
        <View style={[styles.check, cancelled && { backgroundColor: colors.red }]}><Text style={styles.checkText}>{cancelled ? '×' : '✓'}</Text></View>
        <Text style={styles.title}>{cancelled ? 'Appointment cancelled' : appointment.status === 'pending' ? 'Request sent' : 'Meeting confirmed'}</Text>
        <Text style={styles.sub}>{appointment.subject} with {appointment.teacher}</Text>
      </View>
      <Card style={styles.detail}>
        <Row icon="person-outline" title={appointment.childName} subtitle="Student" />
        <Row icon="calendar-outline" title={`${appointment.dateLabel} at ${appointment.time}`} subtitle={`${appointment.duration} minutes`} />
        <Row icon={appointment.method === 'video' ? 'videocam-outline' : appointment.method === 'phone' ? 'call-outline' : 'location-outline'} title={appointment.method === 'video' ? 'Video call' : appointment.method === 'phone' ? 'Telephone call' : 'In-person meeting'} subtitle={appointment.meetingLink ?? appointment.phone ?? appointment.location} last />
      </Card>
      <Section title="Reason" />
      <Card><Text style={{ lineHeight: 21 }}>{appointment.reason}</Text></Card>
      {!cancelled && appointment.method === 'video' ? <View style={{ marginTop: 16 }}><Button label="Join test video meeting" icon="videocam" onPress={() => router.push(`/meeting/${appointment.id}` as never)} /></View> : null}
      {!cancelled && appointment.method === 'phone' ? <View style={{ marginTop: 16 }}><Button label={`Call ${appointment.phone}`} icon="call" onPress={() => router.push(`/meeting/${appointment.id}` as never)} /></View> : null}
      {!cancelled && appointment.method === 'in-person' ? <View style={{ marginTop: 16 }}><Button label="View arrival instructions" icon="navigate" onPress={() => router.push(`/meeting/${appointment.id}` as never)} /></View> : null}
      {!cancelled ? (
        <>
          <Section title="Manage booking" />
          <View style={{ gap: 9 }}>
            <Button label={appointment.calendarAdded ? 'Added to calendar' : 'Add to calendar'} variant={appointment.calendarAdded ? 'green' : 'yellow'} disabled={appointment.calendarAdded} onPress={() => updateAppointment(appointment.id, { calendarAdded: true })} />
            <Button label="Reschedule" variant="outline" onPress={() => router.push({ pathname: '/parent/book-appointment', params: { rescheduleId: appointment.id } })} />
            <Button label="Cancel appointment" variant="outline" onPress={() => updateAppointment(appointment.id, { status: 'cancelled' })} />
          </View>
        </>
      ) : <View style={{ marginTop: 18 }}><Button label="Book another appointment" onPress={() => router.push('/parent/book-appointment')} /></View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 22 },
  check: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.white, fontSize: 50, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '900', marginTop: 18, textAlign: 'center' },
  sub: { color: colors.muted, marginTop: 7, textAlign: 'center' },
  detail: { paddingVertical: 2 },
});
