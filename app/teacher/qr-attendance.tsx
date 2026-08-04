import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Progress, QrVisual, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { teacherStudents } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function QrAttendance() {
  const { data, startQrSession, rotateQrToken, scanQr, closeQrSession } = useApp();
  const [seconds, setSeconds] = useState(25);
  const [message, setMessage] = useState('');
  const active = data.qrSession?.active ? data.qrSession : null;
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((active.expiresAt - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) rotateQrToken();
    }, 500);
    return () => clearInterval(timer);
  }, [active?.expiresAt]);
  const simulate = (studentId: string) => {
    const result = scanQr(studentId);
    setMessage(result.message);
  };
  return (
    <Screen>
      <Header title="QR attendance" subtitle="Senior 3 Biology · Cell structure" back onBack={() => router.back()} />
      {!active ? (
        <Card style={styles.start}><Text style={styles.icon}>▦</Text><Text style={styles.startTitle}>Start a dynamic classroom code</Text><Text style={styles.startBody}>The code rotates every 25 seconds, prevents duplicate check-ins and updates the class list live.</Text><View style={{ width: '100%', marginTop: 18 }}><Button label="Start QR attendance" onPress={() => startQrSession('Senior 3 Biology', 'Cell structure')} /></View></Card>
      ) : (
        <>
          <Card style={styles.live}><View style={styles.liveTop}><Pill label="LIVE" tone="green" /><Text style={styles.timer}>{seconds}s</Text></View><View style={styles.qrWrap}><QrVisual token={active.token} size={228} /></View><Text style={styles.token}>{active.token}</Text><Progress value={(seconds / 25) * 100} tone="green" /><Text style={styles.help}>Students scan this code in their app. It will refresh automatically when the timer reaches zero.</Text></Card>
          {message ? <Card style={{ marginTop: 10, backgroundColor: message.includes('successfully') ? colors.paleGreen : colors.paleRed }}><Text style={{ fontWeight: '900', color: message.includes('successfully') ? colors.green : colors.red }}>{message}</Text></Card> : null}
          <Section title={`Live check-ins · ${active.scannedIds.length}/${teacherStudents.length}`} action="Refresh code" onAction={rotateQrToken} />
          {teacherStudents.map((student, index) => {
            const scanned = active.scannedIds.includes(student.id);
            return <Pressable key={student.id} onPress={() => simulate(student.id)}><Card style={[styles.student, scanned && styles.scanned]}><View style={styles.avatar}><Text style={{ fontSize: 23 }}>{index % 2 ? '👧🏾' : '👦🏾'}</Text></View><View style={{ flex: 1 }}><Text style={styles.name}>{student.name}</Text><Text style={styles.sub}>{scanned ? 'Checked in via QR' : 'Tap to simulate student scan'}</Text></View><Pill label={scanned ? 'SCANNED' : 'WAITING'} tone={scanned ? 'green' : 'black'} /></Card></Pressable>;
          })}
          <View style={{ marginTop: 16 }}><Button label="Close and submit register" variant="black" onPress={() => { closeQrSession(); router.replace('/teacher/attendance'); }} /></View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  start: { alignItems: 'center', padding: 26 }, icon: { fontSize: 80 }, startTitle: { fontSize: 22, fontWeight: '900', marginTop: 15, textAlign: 'center' }, startBody: { color: colors.muted, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  live: { backgroundColor: colors.black, borderColor: colors.black }, liveTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, timer: { color: colors.yellow, fontSize: 25, fontWeight: '900' }, qrWrap: { alignItems: 'center', marginVertical: 18 }, token: { color: colors.white, textAlign: 'center', fontWeight: '900', letterSpacing: 2, marginBottom: 14 }, help: { color: '#CFCFD2', lineHeight: 19, marginTop: 13, textAlign: 'center' },
  student: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }, scanned: { backgroundColor: colors.paleGreen, borderColor: '#B9E6CB' }, avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' }, name: { fontWeight: '900' }, sub: { color: colors.muted, marginTop: 4, fontSize: 12 },
});
