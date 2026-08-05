import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, Logo } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { Role, useApp } from '@/context/AppContext';

const accounts: Record<Role, { id: string; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }> = {
  parent: { id: 'PARENT001', label: 'Parent', description: 'Children, payments and meetings', icon: 'people' },
  student: { id: 'IA9TDJM', label: 'Student', description: 'Learning, timetable and results', icon: 'school' },
  teacher: { id: 'TCH00427', label: 'Teacher', description: 'Classes, attendance and markbook', icon: 'briefcase' },
};

export default function Login() {
  const [role, setRole] = useState<Role>('parent');
  const [school, setSchool] = useState('GREENHILL');
  const [identifier, setIdentifier] = useState(accounts.parent.id);
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  const chooseRole = (nextRole: Role) => {
    setRole(nextRole);
    setIdentifier(accounts[nextRole].id);
  };

  const submit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    await login(role, identifier, school);
    router.replace(`/${role}/home` as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <Logo compact />
            <Pressable onPress={() => router.back()} style={styles.close}>
              <Ionicons name="close" size={21} color={colors.black} />
            </Pressable>
          </View>

          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Your school day,{`\n`}ready when you are.</Text>
          <Text style={styles.sub}>Choose how you are signing in. You can switch roles later from your account.</Text>

          <View style={styles.roles}>
            {(Object.keys(accounts) as Role[]).map(item => {
              const active = role === item;
              const account = accounts[item];
              return (
                <Pressable
                  key={item}
                  onPress={() => chooseRole(item)}
                  style={({ pressed }) => [styles.roleCard, active && styles.roleCardActive, pressed && { opacity: 0.75 }]}
                >
                  <View style={[styles.roleIcon, active && styles.roleIconActive]}>
                    <Ionicons name={account.icon} size={22} color={active ? colors.white : colors.black} />
                  </View>
                  <Text style={[styles.roleLabel, active && { color: colors.red }]}>{account.label}</Text>
                  <Text style={styles.roleDescription}>{account.description}</Text>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <View style={styles.radioInner} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.formCard}>
            <View style={styles.schoolHeader}>
              <View style={styles.schoolBadge}><Text style={styles.schoolBadgeText}>G</Text></View>
              <View style={styles.flex}>
                <Text style={styles.schoolTitle}>Greenhill Academy</Text>
                <Text style={styles.schoolSub}>Kampala · Main campus</Text>
              </View>
              <Text style={styles.change}>Change</Text>
            </View>

            <Field label="School code" value={school} onChangeText={setSchool} placeholder="Enter school code" />
            <Field
              label={role === 'parent' ? 'Parent ID, phone or email' : role === 'teacher' ? 'Teacher ID' : 'Student ID'}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Enter your ID"
            />
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" />

            <Pressable style={styles.forgot}><Text style={styles.forgotText}>Forgot password?</Text></Pressable>
            <Button
              label={`Continue as ${accounts[role].label}`}
              icon="arrow-forward"
              loading={loading}
              disabled={!school.trim() || !identifier.trim() || !password.trim()}
              onPress={() => void submit()}
            />
          </View>

          <View style={styles.demo}>
            <Ionicons name="sparkles" size={19} color={colors.amber} />
            <Text style={styles.demoText}><Text style={styles.demoStrong}>Interactive test account.</Text> Details are prefilled and every workflow remains available.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.backgroundWarm },
  content: { paddingHorizontal: 21, paddingTop: 10, paddingBottom: 36 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  close: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  eyebrow: { color: colors.red, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginTop: 34 },
  title: { fontSize: 37, lineHeight: 41, fontWeight: '900', letterSpacing: -1.4, marginTop: 10 },
  sub: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 11 },
  roles: { flexDirection: 'row', gap: 8, marginTop: 24 },
  roleCard: { flex: 1, minHeight: 154, borderRadius: 23, backgroundColor: colors.white, padding: 12, ...shadows.soft },
  roleCardActive: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  roleIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  roleIconActive: { backgroundColor: colors.red },
  roleLabel: { fontWeight: '900', marginTop: 12, fontSize: 14 },
  roleDescription: { color: colors.muted, fontSize: 10, lineHeight: 14, marginTop: 4 },
  radio: { position: 'absolute', top: 13, right: 12, width: 17, height: 17, borderRadius: 9, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.red },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.red },
  formCard: { backgroundColor: colors.white, borderRadius: 28, padding: 18, marginTop: 18, ...shadows.soft },
  schoolHeader: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 18, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  schoolBadge: { width: 45, height: 45, borderRadius: 15, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  schoolBadgeText: { color: colors.yellow, fontSize: 22, fontWeight: '900' },
  schoolTitle: { fontWeight: '900', fontSize: 14 },
  schoolSub: { color: colors.muted, fontSize: 11, marginTop: 3 },
  change: { color: colors.red, fontWeight: '800', fontSize: 12 },
  forgot: { alignSelf: 'flex-end', marginTop: -2, marginBottom: 15 },
  forgotText: { color: colors.red, fontWeight: '800', fontSize: 13 },
  demo: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.paleYellow, borderRadius: 18, padding: 14, marginTop: 16 },
  demoText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
  demoStrong: { color: colors.text, fontWeight: '900' },
});
