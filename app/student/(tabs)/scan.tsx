import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, QrVisual, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function StudentScan() {
  const { data, scanQr } = useApp();
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds(data.qrSession ? Math.max(0, Math.ceil((data.qrSession.expiresAt - Date.now()) / 1000)) : 0), 500);
    return () => clearInterval(timer);
  }, [data.qrSession]);
  const scan = () => {
    const result = scanQr('stu-amani');
    setMessage(result.message);
  };
  return (
    <Screen>
      <Header title="Scan attendance" subtitle="Classroom QR check-in" right={<Pill label="CAMERA TEST" tone="yellow" />} />
      {data.qrSession?.active ? (
        <>
          <Card style={styles.session}><Pill label="ACTIVE CLASS" tone="green" /><Text style={styles.title}>{data.qrSession.className}</Text><Text style={styles.sub}>{data.qrSession.lesson} · Code expires in {seconds}s</Text></Card>
          <Section title="Test scanner" />
          <View style={styles.scanner}><QrVisual token={data.qrSession.token} size={230} /><Text style={styles.token}>{data.qrSession.token}</Text></View>
          {message ? <Card style={{ marginTop: 14, backgroundColor: message.includes('successfully') ? colors.paleGreen : colors.paleRed }}><Text style={{ fontWeight: '900', color: message.includes('successfully') ? colors.green : colors.red }}>{message}</Text></Card> : null}
          <View style={{ marginTop: 18 }}><Button label="Scan current classroom QR" icon="qr-code" onPress={scan} /></View>
        </>
      ) : (
        <Card style={styles.noSession}><Text style={styles.noIcon}>▦</Text><Text style={styles.noTitle}>No active classroom QR</Text><Text style={styles.noBody}>Switch to the teacher test account, start a QR register, then switch back to the student account to scan it.</Text><View style={{ marginTop: 17, width: '100%' }}><Button label="Switch test role" variant="outline" onPress={() => router.push('/more')} /></View></Card>
      )}
      <Section title="Digital student ID" />
      <Card style={styles.idCard}><View><Text style={styles.idSchool}>GREENHILL ACADEMY</Text><Text style={styles.idName}>Amani Olwo</Text><Text style={styles.idMeta}>Senior 3 Blue · IA9TDJM</Text></View><View style={styles.idPhoto}><Text style={{ fontSize: 40 }}>👦🏾</Text></View></Card>
      <Text style={styles.help}>The production scanner can use the device camera. The emulator test button completes the same attendance validation flow without requiring a physical camera.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  session: { backgroundColor: colors.black, borderColor: colors.black },
  title: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 14 },
  sub: { color: '#CFCFD2', marginTop: 6 },
  scanner: { alignItems: 'center' },
  token: { fontWeight: '900', letterSpacing: 2, marginTop: 12 },
  noSession: { alignItems: 'center', padding: 25 },
  noIcon: { fontSize: 70 },
  noTitle: { fontSize: 21, fontWeight: '900', marginTop: 12 },
  noBody: { color: colors.muted, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  idCard: { backgroundColor: colors.black, borderColor: colors.black, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idSchool: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  idName: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 12 },
  idMeta: { color: '#CFCFD2', marginTop: 6 },
  idPhoto: { width: 70, height: 70, borderRadius: 22, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  help: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 13 },
});
