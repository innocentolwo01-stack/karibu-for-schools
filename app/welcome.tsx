import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.glowRed} />
      <View style={styles.glowYellow} />

      <View style={styles.topBar}>
        <Logo light compact />
        <View style={styles.securePill}>
          <Text style={styles.secureText}>SECURE SCHOOL PLATFORM</Text>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.eyebrow}>EVERY CHILD. EVERY SCHOOL DAY.</Text>
        <Text style={styles.title}>School life,{`\n`}beautifully connected.</Text>
        <Text style={styles.body}>
          Learning, attendance, payments, meetings, transport and communication in one thoughtful app.
        </Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCard}>
          <Image source={require('../assets/illustrations/family.png')} style={styles.heroImage} resizeMode="contain" />
          <View style={styles.liveCard}>
            <View style={styles.liveDot} />
            <View>
              <Text style={styles.liveTitle}>Amani arrived safely</Text>
              <Text style={styles.liveSub}>Greenhill Academy · 07:48</Text>
            </View>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>TERM AVERAGE</Text>
            <Text style={styles.scoreValue}>82%</Text>
            <Text style={styles.scoreTrend}>↑ 6% this term</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Button label="Get started" icon="arrow-forward" onPress={() => router.push('/onboarding')} />
        <Pressable onPress={() => router.push('/login')} style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.65 }]}>
          <Text style={styles.login}>Already registered? <Text style={styles.loginStrong}>Log in</Text></Text>
        </Pressable>
        <Text style={styles.footnote}>Built for schools, families and learners across East Africa.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black, paddingHorizontal: 22, overflow: 'hidden' },
  glowRed: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: '#4A0010', top: -130, right: -150, opacity: 0.65 },
  glowYellow: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#594A00', bottom: 170, left: -180, opacity: 0.48 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  securePill: { borderWidth: 1, borderColor: '#3A3A3D', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  secureText: { color: '#CFCFD4', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  copy: { marginTop: 32 },
  eyebrow: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.45 },
  title: { color: colors.white, fontSize: 42, lineHeight: 45, fontWeight: '900', letterSpacing: -1.8, marginTop: 12 },
  body: { color: '#C9C9CE', fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 350 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 290 },
  heroCard: { width: '100%', height: 315, borderRadius: 32, backgroundColor: colors.white, overflow: 'hidden', ...shadows.floating },
  heroImage: { width: '100%', height: '100%', transform: [{ scale: 1.04 }] },
  liveCard: { position: 'absolute', left: 14, right: 76, bottom: 15, minHeight: 66, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13, ...shadows.soft },
  liveDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.green },
  liveTitle: { fontWeight: '900', fontSize: 13 },
  liveSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  scoreCard: { position: 'absolute', top: 15, right: 14, width: 105, borderRadius: 20, backgroundColor: colors.black, padding: 13 },
  scoreLabel: { color: '#BEBEC4', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  scoreValue: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 6 },
  scoreTrend: { color: colors.yellow, fontSize: 9, fontWeight: '800', marginTop: 3 },
  bottom: { gap: 10, paddingBottom: 8 },
  loginButton: { minHeight: 42, justifyContent: 'center' },
  login: { color: '#CFCFD4', textAlign: 'center', fontWeight: '700' },
  loginStrong: { color: colors.white, fontWeight: '900' },
  footnote: { color: '#77777D', textAlign: 'center', fontSize: 10, marginTop: 2, marginBottom: 4 },
});
