import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Logo light />
        <Text style={styles.title}>Every part of school life. Connected.</Text>
        <Text style={styles.body}>Learning, attendance, fees, meetings, transport and communication in one secure school app.</Text>
      </View>
      <View style={styles.art}>
        <View style={styles.phone}>
          <Text style={styles.small}>GOOD AFTERNOON</Text>
          <Text style={styles.name}>Amani</Text>
          <View style={styles.metric}><Text style={styles.metricLabel}>Attendance</Text><Text style={styles.metricValue}>94%</Text></View>
          <View style={styles.line} />
          <Text style={styles.small}>NEXT</Text>
          <Text style={styles.lesson}>Biology · Lab 2</Text>
        </View>
        <View style={styles.float}><Text style={{ fontSize: 30 }}>✓</Text></View>
      </View>
      <View style={styles.bottom}>
        <Button label="Get started" onPress={() => router.push('/onboarding')} />
        <Text style={styles.login} onPress={() => router.push('/login')}>Already registered? Log in</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black, padding: 24 },
  top: { marginTop: 18 },
  title: { color: colors.white, fontSize: 39, lineHeight: 43, fontWeight: '900', marginTop: 42 },
  body: { color: '#CFCFD2', fontSize: 17, lineHeight: 25, marginTop: 16 },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  phone: { width: 235, height: 300, borderRadius: 35, backgroundColor: colors.white, padding: 24, transform: [{ rotate: '-3deg' }] },
  small: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  name: { fontSize: 37, fontWeight: '900', marginTop: 5 },
  metric: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 },
  metricLabel: { fontWeight: '900' },
  metricValue: { color: colors.green, fontSize: 26, fontWeight: '900' },
  line: { height: 8, borderRadius: 9, backgroundColor: colors.yellow, marginVertical: 28 },
  lesson: { fontSize: 20, fontWeight: '900', marginTop: 8 },
  float: { position: 'absolute', right: 23, bottom: 74, width: 66, height: 66, borderRadius: 22, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '6deg' }] },
  bottom: { gap: 15 },
  login: { color: colors.white, textAlign: 'center', fontWeight: '800', marginBottom: 6 },
});
