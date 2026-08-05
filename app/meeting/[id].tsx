import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Row, Screen } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function MeetingRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateAppointment } = useApp();
  const appointment = data.appointments.find(item => item.id === id);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [callActive, setCallActive] = useState(false);

  if (!appointment) {
    return (
      <Screen>
        <Header title="Meeting" back onBack={() => router.back()} />
        <Card><Text>Meeting not found.</Text></Card>
      </Screen>
    );
  }

  if (appointment.method === 'video') {
    if (!joined) {
      return (
        <View style={styles.videoLobby}>
          <View style={styles.videoGlow} />
          <Pressable onPress={() => router.back()} style={styles.videoBack}>
            <Ionicons name="chevron-back" size={23} color={colors.white} />
          </Pressable>

          <View style={styles.lobbyContent}>
            <View style={styles.teacherPortrait}><Text style={styles.teacherPortraitEmoji}>👩🏾‍🏫</Text></View>
            <Pill label="VIDEO APPOINTMENT" tone="yellow" />
            <Text style={styles.lobbyTitle}>{appointment.teacher}</Text>
            <Text style={styles.lobbySubtitle}>{appointment.subject} · {appointment.childName}</Text>
            <Text style={styles.lobbyTime}>{appointment.dateLabel} at {appointment.time}</Text>

            <Card style={styles.previewCard}>
              <View style={styles.previewRow}>
                <View style={styles.previewIcon}><Ionicons name="videocam" size={20} color={camera ? colors.green : colors.red} /></View>
                <View style={styles.previewCopy}>
                  <Text style={styles.previewTitle}>Camera</Text>
                  <Text style={styles.previewSubtitle}>{camera ? 'Ready to use' : 'Camera is off'}</Text>
                </View>
                <Pressable onPress={() => setCamera(!camera)}><Text style={styles.previewAction}>{camera ? 'Turn off' : 'Turn on'}</Text></Pressable>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewRow}>
                <View style={styles.previewIcon}><Ionicons name={muted ? 'mic-off' : 'mic'} size={20} color={muted ? colors.red : colors.green} /></View>
                <View style={styles.previewCopy}>
                  <Text style={styles.previewTitle}>Microphone</Text>
                  <Text style={styles.previewSubtitle}>{muted ? 'Muted' : 'Ready to use'}</Text>
                </View>
                <Pressable onPress={() => setMuted(!muted)}><Text style={styles.previewAction}>{muted ? 'Unmute' : 'Mute'}</Text></Pressable>
              </View>
            </Card>

            <View style={styles.lobbyButtons}>
              <Button label="Join test meeting" icon="videocam" onPress={() => setJoined(true)} />
              <Button label="Back to confirmation" variant="outline" onPress={() => router.back()} />
            </View>
            <Text style={styles.testNote}>This installed test build simulates the complete meeting experience.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoPage}>
        <View style={styles.remoteVideo}>
          <View style={styles.remoteGlow} />
          <Text style={styles.remoteEmoji}>👩🏾‍🏫</Text>
          <Text style={styles.remoteName}>{appointment.teacher}</Text>
          <Text style={styles.remoteSubject}>{appointment.subject}</Text>
        </View>

        <View style={styles.videoTopBar}>
          <View>
            <Text style={styles.videoTimer}>00:12</Text>
            <Text style={styles.videoSecure}>Secure Karibu meeting</Text>
          </View>
          <View style={styles.videoLive}><View style={styles.videoLiveDot} /><Text style={styles.videoLiveText}>LIVE</Text></View>
        </View>

        <View style={styles.selfVideo}>
          {camera ? <Text style={styles.selfEmoji}>👨🏾</Text> : <Ionicons name="videocam-off" size={28} color={colors.white} />}
          <Text style={styles.selfLabel}>{camera ? 'You' : 'Camera off'}</Text>
        </View>

        <View style={styles.callControls}>
          <Control icon={muted ? 'mic-off' : 'mic'} label={muted ? 'Unmute' : 'Mute'} active={muted} onPress={() => setMuted(!muted)} />
          <Control icon={camera ? 'videocam' : 'videocam-off'} label={camera ? 'Camera' : 'Camera off'} active={!camera} onPress={() => setCamera(!camera)} />
          <Control
            icon="call"
            label="End"
            destructive
            onPress={() => {
              updateAppointment(appointment.id, { status: 'completed' });
              router.replace(`/parent/appointment-confirmation/${appointment.id}` as never);
            }}
          />
        </View>
      </View>
    );
  }

  if (appointment.method === 'phone') {
    return (
      <Screen background="warm">
        <Header title="Telephone appointment" subtitle={`${appointment.subject} · ${appointment.teacher}`} back onBack={() => router.back()} />

        <Card style={styles.phoneHero}>
          <View style={styles.phoneGlow} />
          <View style={styles.teacherPortrait}><Text style={styles.teacherPortraitEmoji}>👩🏾‍🏫</Text></View>
          <Text style={styles.phoneTitle}>{appointment.teacher}</Text>
          <Text style={styles.phoneNumber}>{appointment.phone}</Text>
          <Pill label={callActive ? 'CALL IN PROGRESS' : 'SCHEDULED CALL'} tone={callActive ? 'green' : 'blue'} />
          <Text style={styles.phoneTimer}>{callActive ? '00:12' : appointment.time}</Text>
          <Text style={styles.phoneCaption}>{callActive ? 'Connected securely in the test app' : `${appointment.dateLabel} · ${appointment.duration} minutes`}</Text>
        </Card>

        <Card style={styles.callInfo}>
          <View style={styles.callInfoIcon}><Ionicons name="call" size={21} color={colors.green} /></View>
          <View style={styles.callInfoCopy}>
            <Text style={styles.callInfoTitle}>The teacher will call the parent</Text>
            <Text style={styles.callInfoBody}>For this installed test build, the button starts a complete simulated phone appointment inside the app.</Text>
          </View>
        </Card>

        <View style={styles.phoneActions}>
          {!callActive ? (
            <Button label="Start test phone call" icon="call" onPress={() => setCallActive(true)} />
          ) : (
            <Button
              label="End call and complete meeting"
              icon="call"
              onPress={() => {
                updateAppointment(appointment.id, { status: 'completed' });
                router.replace(`/parent/appointment-confirmation/${appointment.id}` as never);
              }}
            />
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen background="warm">
      <Header title="In-person appointment" subtitle={`${appointment.subject} · ${appointment.teacher}`} back onBack={() => router.back()} />

      <Card style={styles.locationHero}>
        <View style={styles.mapPattern}>
          <View style={[styles.road, styles.roadOne]} />
          <View style={[styles.road, styles.roadTwo]} />
          <View style={[styles.road, styles.roadThree]} />
        </View>
        <View style={styles.pin}><Ionicons name="location" size={34} color={colors.white} /></View>
        <Text style={styles.locationTitle}>Greenhill Academy</Text>
        <Text style={styles.locationSubtitle}>Science Block · Room 12</Text>
        <Pill label="ARRIVE 10 MINUTES EARLY" tone="yellow" />
      </Card>

      <Card style={styles.arrivalCard}>
        <Row icon="business-outline" title="Campus" subtitle="Greenhill Academy · Main campus" />
        <Row icon="enter-outline" title="Check in" subtitle="Main reception · Visitor desk" />
        <Row icon="time-outline" title="Arrival time" subtitle={`${appointment.dateLabel} · ${appointment.time}`} />
        <Row icon="navigate-outline" title="Meeting room" subtitle="Science Block · Room 12" last />
      </Card>

      <Card style={styles.arrivalNote}>
        <Ionicons name="information-circle" size={21} color={colors.blue} />
        <Text style={styles.arrivalNoteText}>Show your appointment confirmation at reception. A visitor pass will be prepared for the test journey.</Text>
      </Card>

      <View style={styles.phoneActions}>
        <Button
          label="Confirm arrival and complete test"
          icon="checkmark"
          onPress={() => {
            updateAppointment(appointment.id, { status: 'completed' });
            router.replace(`/parent/appointment-confirmation/${appointment.id}` as never);
          }}
        />
      </View>
    </Screen>
  );
}

function Control({
  icon,
  label,
  active,
  destructive,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.controlWrap}>
      <View style={[styles.control, active && styles.controlActive, destructive && styles.controlDestructive]}>
        <Ionicons name={icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  videoLobby: { flex: 1, backgroundColor: colors.black, paddingHorizontal: 22, overflow: 'hidden' },
  videoGlow: { position: 'absolute', width: 440, height: 440, borderRadius: 220, backgroundColor: '#342B00', top: -230, right: -220, opacity: 0.8 },
  videoBack: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#29292C', alignItems: 'center', justifyContent: 'center', marginTop: 58 },
  lobbyContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 28 },
  teacherPortrait: { width: 128, height: 128, borderRadius: 44, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', ...shadows.floating },
  teacherPortraitEmoji: { fontSize: 72 },
  lobbyTitle: { color: colors.white, fontSize: 30, lineHeight: 34, fontWeight: '900', letterSpacing: -1, textAlign: 'center', marginTop: 15 },
  lobbySubtitle: { color: '#C9C9CE', marginTop: 7, textAlign: 'center' },
  lobbyTime: { color: colors.yellow, fontWeight: '800', marginTop: 7 },
  previewCard: { width: '100%', marginTop: 24, paddingVertical: 5, backgroundColor: '#202023' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 62 },
  previewIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#333336', alignItems: 'center', justifyContent: 'center' },
  previewCopy: { flex: 1 },
  previewTitle: { color: colors.white, fontWeight: '900', fontSize: 13 },
  previewSubtitle: { color: '#AFAFB5', fontSize: 10, marginTop: 3 },
  previewAction: { color: colors.yellow, fontWeight: '800', fontSize: 11 },
  previewDivider: { height: 1, backgroundColor: '#343438' },
  lobbyButtons: { width: '100%', gap: 9, marginTop: 22 },
  testNote: { color: '#77777D', fontSize: 10, textAlign: 'center', marginTop: 12 },

  videoPage: { flex: 1, backgroundColor: colors.black },
  remoteVideo: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  remoteGlow: { position: 'absolute', width: 520, height: 520, borderRadius: 260, backgroundColor: '#303035' },
  remoteEmoji: { fontSize: 138 },
  remoteName: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 15 },
  remoteSubject: { color: '#BDBDC3', marginTop: 5 },
  videoTopBar: { position: 'absolute', top: 58, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  videoTimer: { color: colors.white, fontWeight: '900', fontSize: 18 },
  videoSecure: { color: '#AFAFB5', fontSize: 10, marginTop: 3 },
  videoLive: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#29292C', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  videoLiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  videoLiveText: { color: colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  selfVideo: { position: 'absolute', top: 115, right: 18, width: 112, height: 154, borderRadius: 24, backgroundColor: '#3A3A3F', borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.floating },
  selfEmoji: { fontSize: 47 },
  selfLabel: { color: colors.white, fontSize: 10, fontWeight: '800', marginTop: 8 },
  callControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 22 },
  controlWrap: { alignItems: 'center', gap: 7 },
  control: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#35353A', alignItems: 'center', justifyContent: 'center', ...shadows.floating },
  controlActive: { backgroundColor: '#5C5C62' },
  controlDestructive: { backgroundColor: colors.red },
  controlLabel: { color: '#D0D0D4', fontSize: 10, fontWeight: '800' },

  phoneHero: { alignItems: 'center', paddingVertical: 30, overflow: 'hidden' },
  phoneGlow: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.paleGreen, top: -100, right: -90 },
  phoneTitle: { fontSize: 25, fontWeight: '900', marginTop: 18 },
  phoneNumber: { color: colors.muted, marginTop: 6, marginBottom: 12 },
  phoneTimer: { fontSize: 40, fontWeight: '900', letterSpacing: -1.2, marginTop: 20 },
  phoneCaption: { color: colors.muted, fontSize: 11, marginTop: 5 },
  callInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 12 },
  callInfoIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center' },
  callInfoCopy: { flex: 1 },
  callInfoTitle: { fontWeight: '900', fontSize: 13 },
  callInfoBody: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  phoneActions: { marginTop: 18 },

  locationHero: { alignItems: 'center', paddingVertical: 30, overflow: 'hidden' },
  mapPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.paleBlue },
  road: { position: 'absolute', height: 18, backgroundColor: colors.white, borderRadius: 999, opacity: 0.9 },
  roadOne: { width: 260, top: 50, left: -60, transform: [{ rotate: '18deg' }] },
  roadTwo: { width: 280, top: 115, right: -90, transform: [{ rotate: '-24deg' }] },
  roadThree: { width: 220, bottom: 35, left: 40, transform: [{ rotate: '8deg' }] },
  pin: { width: 68, height: 68, borderRadius: 24, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', ...shadows.floating },
  locationTitle: { fontSize: 24, fontWeight: '900', marginTop: 17 },
  locationSubtitle: { color: colors.muted, marginTop: 5, marginBottom: 12 },
  arrivalCard: { paddingVertical: 2, marginTop: 12 },
  arrivalNote: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 12, backgroundColor: colors.paleBlue },
  arrivalNoteText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
});
