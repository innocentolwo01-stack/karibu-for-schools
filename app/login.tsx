import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, Logo } from '@/components/ui';
import { colors } from '@/constants/theme';
import { Role, useApp } from '@/context/AppContext';

const ids = { parent: 'PARENT001', student: 'IA9TDJM', teacher: 'TCH00427' };

export default function Login() {
  const [role, setRole] = useState<Role>('parent');
  const [school, setSchool] = useState('GREENHILL');
  const [id, setId] = useState(ids.parent);
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  const choose = (nextRole: Role) => {
    setRole(nextRole);
    setId(ids[nextRole]);
    setError('');
  };

  const submit = async () => {
    if (!school.trim() || !id.trim() || !password.trim()) {
      setError('Enter the school code, account ID and password.');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 450));
    await login(role, id.trim(), school.trim().toUpperCase());
    router.replace(`/${role}/home` as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Logo compact />
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.sub}>Choose your role and continue to the complete school demo.</Text>
          <View style={styles.roles}>
            {(['parent', 'student', 'teacher'] as Role[]).map(item => (
              <Pressable key={item} onPress={() => choose(item)} style={[styles.role, role === item && styles.roleActive]}>
                <Text style={[styles.roleText, role === item && { color: colors.red }]}>{item[0].toUpperCase() + item.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
          <Field label="School code" value={school} onChangeText={setSchool} placeholder="GREENHILL" />
          <Field label={role === 'parent' ? 'Parent ID, phone or email' : role === 'teacher' ? 'Teacher ID' : 'Student ID'} value={id} onChangeText={setId} />
          <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.forgot} onPress={() => setError('Password recovery has been simulated. Check the demo notification after login.')}>Forgot password?</Text>
          <Button label="Log in" onPress={submit} loading={loading} />
          <View style={styles.demo}>
            <Text style={styles.demoTitle}>Test accounts are ready</Text>
            <Text style={styles.demoText}>Details are prefilled. Any non-empty password works. All actions use persistent sandbox data.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flexGrow: 1, padding: 24, paddingBottom: 36 },
  title: { fontSize: 35, fontWeight: '900', marginTop: 42 },
  sub: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 7, marginBottom: 22 },
  roles: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  role: { flex: 1, height: 46, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  roleActive: { borderColor: colors.red, backgroundColor: colors.paleRed },
  roleText: { fontWeight: '900' },
  forgot: { color: colors.red, textAlign: 'right', fontWeight: '800', marginBottom: 16 },
  error: { color: colors.red, fontWeight: '800', marginBottom: 8 },
  demo: { backgroundColor: colors.paleYellow, borderRadius: 16, padding: 14, marginTop: 22 },
  demoTitle: { fontWeight: '900' },
  demoText: { color: colors.muted, marginTop: 4, lineHeight: 19 },
});
