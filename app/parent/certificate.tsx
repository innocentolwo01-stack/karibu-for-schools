import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AcademicCertificate() {
  const { selectedChild, setModuleValue, data } = useApp();
  const saved = Boolean(data.moduleState.certificateSaved);
  return (
    <Screen>
      <Header title="Academic certificate" subtitle="Verified school achievement" back onBack={() => router.back()} />
      <Card style={styles.certificate}>
        <View style={styles.badge}><Text style={styles.badgeText}>K</Text></View>
        <Pill label="GREENHILL ACADEMY" tone="green" />
        <Text style={styles.heading}>Certificate of Achievement</Text>
        <Text style={styles.small}>This certificate is proudly presented to</Text>
        <Text style={styles.name}>{selectedChild.name}</Text>
        <Text style={styles.body}>for being the most improved student in Mathematics during Term 2, 2026.</Text>
        <Text style={styles.signature}>Headteacher · Greenhill Academy</Text>
        <Text style={styles.reference}>Certificate KFS-CERT-2026-041</Text>
      </Card>
      <View style={{ marginTop: 18, gap: 9 }}><Button label={saved ? 'Certificate saved' : 'Save certificate to test documents'} variant={saved ? 'green' : 'red'} disabled={saved} onPress={() => setModuleValue('certificateSaved', true)} /><Button label="Share achievement" variant="outline" onPress={() => router.push('/messages/compose')} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  certificate: { alignItems: 'center', padding: 28, borderWidth: 3, borderColor: colors.yellow, backgroundColor: '#FFFDF4' },
  badge: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  badgeText: { color: colors.yellow, fontSize: 42, fontWeight: '900' },
  heading: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 24 },
  small: { color: colors.muted, marginTop: 20 },
  name: { color: colors.red, fontSize: 29, fontWeight: '900', textAlign: 'center', marginTop: 9 },
  body: { textAlign: 'center', lineHeight: 23, marginTop: 18 },
  signature: { fontWeight: '900', marginTop: 32 },
  reference: { color: colors.muted, fontSize: 10, marginTop: 8 },
});
