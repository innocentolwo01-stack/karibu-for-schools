import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Header,
  Pill,
  Row,
  Screen,
  Section,
  SuccessArtwork,
} from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AppointmentConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateAppointment } = useApp();
  const appointment = data.appointments.find(item => item.id === id);

  if (!appointment) {
    return (
      <Screen>
        <Header title="Appointment" back onBack={() => router.back()} />
        <Card><Text>Appointment not found.</Text></Card>
      </Screen>
    );
  }

  const cancelled = appointment.status === 'cancelled';
  const pending = appointment.status === 'pending';
  const tone = cancelled ? 'red' : pending ? 'yellow' : 'green';
  const methodTitle =
    appointment.method === 'video'
      ? 'Video call'
      : appointment.method === 'phone'
        ? 'Telephone call'
        : 'In-person meeting';

  return (
    <Screen background={cancelled ? 'warm' : 'white'}>
      <Header
        title="Meeting details"
        subtitle="Saved in your Karibu calendar"
        back
        onBack={() => router.replace('/parent/calendar')}
      />

      <View style={styles.hero}>
        <Image source={require('../../../assets/illustrations/confetti.png')} style={styles.confetti} resizeMode="cover" />
        <SuccessArtwork tone={tone} icon={cancelled ? 'close' : pending ? 'time' : 'checkmark'} />
        <Text style={styles.kicker}>{cancelled ? 'CANCELLED' : pending ? 'REQUEST SENT' : 'MEETING CONFIRMED'}</Text>
        <Text style={styles.title}>{cancelled ? 'Appointment cancelled' : pending ? 'Waiting for teacher approval' : 'You are all set.'}</Text>
        <Text style={styles.subtitle}>{appointment.subject} with {appointment.teacher}</Text>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.teacherAvatar}><Text style={styles.teacherEmoji}>👩🏾‍🏫</Text></View>
          <View style={styles.flex}>
            <Text style={styles.teacherName}>{appointment.teacher}</Text>
            <Text style={styles.teacherSubject}>{appointment.subject} · {appointment.childName}</Text>
          </View>
          <Pill label={appointment.status.toUpperCase()} tone={tone} />
        </View>

        <View style={styles.divider} />
        <Row icon="calendar-outline" title={`${appointment.dateLabel} at ${appointment.time}`} subtitle={`${appointment.duration} minutes`} />
        <Row
          icon={appointment.method === 'video' ? 'videocam-outline' : appointment.method === 'phone' ? 'call-outline' : 'location-outline'}
          title={methodTitle}
          subtitle={appointment.meetingLink ?? appointment.phone ?? appointment.location}
          last
        />
      </Card>

      {!cancelled ? (
        <View style={styles.primaryAction}>
          <Button
            label={
              appointment.method === 'video'
                ? 'Join test video meeting'
                : appointment.method === 'phone'
                  ? `Start test phone call`
                  : 'View arrival instructions'
            }
            icon={appointment.method === 'video' ? 'videocam' : appointment.method === 'phone' ? 'call' : 'navigate'}
            onPress={() => router.push(`/meeting/${appointment.id}` as never)}
          />
        </View>
      ) : null}

      <Section title="Reason for meeting" />
      <Card><Text style={styles.reason}>{appointment.reason}</Text></Card>

      {!cancelled ? (
        <>
          <Section title="Calendar and reminders" />
          <Card style={styles.reminderCard}>
            <View style={styles.reminderIcon}><Text style={styles.reminderEmoji}>🔔</Text></View>
            <View style={styles.flex}>
              <Text style={styles.reminderTitle}>We will remind you before the meeting</Text>
              <Text style={styles.reminderBody}>A notification appears 30 minutes before the scheduled start time.</Text>
            </View>
          </Card>

          <View style={styles.manageButtons}>
            <Button
              label={appointment.calendarAdded ? 'Added to calendar' : 'Add to calendar'}
              variant={appointment.calendarAdded ? 'green' : 'yellow'}
              disabled={appointment.calendarAdded}
              icon="calendar"
              onPress={() => updateAppointment(appointment.id, { calendarAdded: true })}
            />
            <Button
              label="Reschedule appointment"
              variant="outline"
              icon="refresh"
              onPress={() => router.push({ pathname: '/parent/book-appointment', params: { rescheduleId: appointment.id } })}
            />
            <Button
              label="Cancel appointment"
              variant="outline"
              icon="close-circle-outline"
              onPress={() => updateAppointment(appointment.id, { status: 'cancelled' })}
            />
          </View>
        </>
      ) : (
        <View style={styles.manageButtons}>
          <Button label="Book another appointment" icon="calendar" onPress={() => router.push('/parent/book-appointment')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: 'center', paddingTop: 8, paddingBottom: 22, overflow: 'hidden' },
  confetti: { position: 'absolute', top: -20, width: '100%', height: 250, opacity: 0.48 },
  kicker: { color: colors.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 10 },
  title: { fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -1, marginTop: 8, textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 7, textAlign: 'center' },
  summaryCard: { paddingVertical: 4, ...shadows.floating },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  teacherAvatar: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  teacherEmoji: { fontSize: 31 },
  teacherName: { fontWeight: '900', fontSize: 16 },
  teacherSubject: { color: colors.muted, fontSize: 11, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border },
  primaryAction: { marginTop: 16 },
  reason: { color: colors.text, lineHeight: 21 },
  reminderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.paleBlue },
  reminderIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  reminderEmoji: { fontSize: 23 },
  reminderTitle: { fontWeight: '900', fontSize: 13 },
  reminderBody: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  manageButtons: { gap: 10, marginTop: 18 },
});
