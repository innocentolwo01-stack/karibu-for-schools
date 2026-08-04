import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function MeetingRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateAppointment } = useApp();
  const appointment = data.appointments.find(item => item.id === id);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [callActive, setCallActive] = useState(false);
  if (!appointment) return <Screen><Header title="Meeting" back onBack={() => router.back()} /><Card><Text>Meeting not found.</Text></Card></Screen>;

  if (appointment.method === 'video') {
    return (
      <View style={styles.videoPage}>
        {!joined ? (
          <View style={styles.lobby}>
            <View style={styles.teacherAvatar}><Text style={{ fontSize: 64 }}>👩🏾‍🏫</Text></View>
            <Text style={styles.videoTitle}>Video meeting with {appointment.teacher}</Text>
            <Text style={styles.videoSub}>{appointment.subject} · {appointment.childName}</Text>
            <Text style={styles.videoSub}>{appointment.dateLabel} at {appointment.time}</Text>
            <View style={styles.lobbyActions}><Button label="Join test meeting" icon="videocam" onPress={() => setJoined(true)} /><Button label="Back to confirmation" variant="outline" onPress={() => router.back()} /></View>
          </View>
        ) : (
          <>
            <View style={styles.remoteVideo}><Text style={styles.remoteEmoji}>👩🏾‍🏫</Text><Text style={styles.remoteName}>{appointment.teacher}</Text><Pill label="TEST VIDEO CALL" tone="yellow" /></View>
            <View style={styles.selfVideo}>{camera ? <Text style={{ fontSize: 38 }}>👨🏾</Text> : <Text style={{ color: colors.white, fontWeight: '900' }}>Camera off</Text>}</View>
            <View style={styles.callControls}>
              <Pressable onPress={() => setMuted(!muted)} style={[styles.control, muted && styles.controlOff]}><Text style={styles.controlIcon}>{muted ? '🔇' : '🎙️'}</Text></Pressable>
              <Pressable onPress={() => setCamera(!camera)} style={[styles.control, !camera && styles.controlOff]}><Text style={styles.controlIcon}>📹</Text></Pressable>
              <Pressable onPress={() => { updateAppointment(appointment.id, { status: 'completed' }); router.replace(`/parent/appointment-confirmation/${appointment.id}` as never); }} style={[styles.control, styles.end]}><Text style={styles.controlIcon}>☎</Text></Pressable>
            </View>
          </>
        )}
      </View>
    );
  }

  if (appointment.method === 'phone') {
    return (
      <Screen>
        <Header title="Telephone appointment" subtitle={`${appointment.subject} · ${appointment.teacher}`} back onBack={() => router.back()} />
        <Card style={styles.phoneCard}>
          <View style={styles.teacherAvatar}><Text style={{ fontSize: 64 }}>👩🏾‍🏫</Text></View>
          <Text style={styles.phoneTitle}>{appointment.teacher}</Text>
          <Text style={styles.phoneNumber}>{appointment.phone}</Text>
          <Pill label={callActive ? 'CALL IN PROGRESS' : 'SCHEDULED CALL'} tone={callActive ? 'green' : 'blue'} />
          {callActive ? <Text style={styles.timer}>00:12</Text> : null}
        </Card>
        <Section title="Call instructions" />
        <Card><Text style={styles.body}>The teacher will call the parent at the scheduled time. For this installed test build, the button starts an in-app simulated phone appointment.</Text></Card>
        <View style={{ marginTop: 18, gap: 9 }}>
          {!callActive ? <Button label="Start test phone call" icon="call" onPress={() => setCallActive(true)} /> : <Button label="End call and complete meeting" variant="red" onPress={() => { updateAppointment(appointment.id, { status: 'completed' }); router.back(); }} />}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="In-person appointment" subtitle={`${appointment.subject} · ${appointment.teacher}`} back onBack={() => router.back()} />
      <Card style={styles.locationCard}><Text style={styles.mapEmoji}>📍</Text><Text style={styles.locationTitle}>{appointment.location}</Text><Text style={styles.body}>Arrive 10 minutes early and check in at main reception with the appointment QR confirmation.</Text></Card>
      <Section title="Arrival plan" />
      <Card style={{ paddingVertical: 2 }}><Row icon="business-outline" title="Campus" subtitle="Greenhill Academy · Main campus" /><Row icon="enter-outline" title="Check-in" subtitle="Main reception · Visitor desk" /><Row icon="time-outline" title="Arrival time" subtitle={`${appointment.dateLabel} · ${appointment.time}`} /><Row icon="navigate-outline" title="Meeting room" subtitle="Science Block · Room 12" last /></Card>
      <View style={{ marginTop: 18 }}><Button label="Confirm arrival and complete test" onPress={() => { updateAppointment(appointment.id, { status: 'completed' }); router.back(); }} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  videoPage: { flex: 1, backgroundColor: colors.black },
  lobby: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  teacherAvatar: { width: 132, height: 132, borderRadius: 45, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  videoTitle: { color: colors.white, fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 22 },
  videoSub: { color: '#CFCFD2', marginTop: 7, textAlign: 'center' },
  lobbyActions: { width: '100%', gap: 9, marginTop: 30 },
  remoteVideo: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  remoteEmoji: { fontSize: 130 },
  remoteName: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 15, marginBottom: 12 },
  selfVideo: { position: 'absolute', top: 70, right: 18, width: 100, height: 140, borderRadius: 22, backgroundColor: '#343438', borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  callControls: { position: 'absolute', bottom: 45, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 16 },
  control: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#343438', alignItems: 'center', justifyContent: 'center' },
  controlOff: { backgroundColor: '#6B6B70' },
  end: { backgroundColor: colors.red },
  controlIcon: { fontSize: 25, color: colors.white },
  phoneCard: { alignItems: 'center', paddingVertical: 28 },
  phoneTitle: { fontSize: 24, fontWeight: '900', marginTop: 18 },
  phoneNumber: { color: colors.muted, marginVertical: 10 },
  timer: { fontSize: 35, fontWeight: '900', marginTop: 20 },
  body: { color: colors.muted, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  locationCard: { alignItems: 'center', padding: 25 },
  mapEmoji: { fontSize: 70 },
  locationTitle: { fontSize: 21, fontWeight: '900', textAlign: 'center', marginTop: 13 },
});
