import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { Role, useApp } from '@/context/AppContext';

export default function More() {
  const { session, logout, switchRole, resetDemo } = useApp();
  const goRole = async (role: Role) => {
    await switchRole(role);
    router.replace(`/${role}/home` as never);
  };
  return (
    <Screen>
      <Header title="Account and settings" subtitle="Profile, role and app controls" back onBack={() => router.back()} />
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={{ fontSize: 31 }}>{session?.role === 'teacher' ? '👩🏾‍🏫' : session?.role === 'student' ? '👦🏾' : '👨🏾'}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.name}>{session?.name}</Text><Text style={styles.role}>{session?.role?.toUpperCase()} · Greenhill Academy</Text></View>
      </View>
      <Section title="Switch test role" />
      <View style={styles.roleButtons}>
        <Button label="Parent" variant={session?.role === 'parent' ? 'red' : 'outline'} onPress={() => void goRole('parent')} />
        <Button label="Student" variant={session?.role === 'student' ? 'red' : 'outline'} onPress={() => void goRole('student')} />
        <Button label="Teacher" variant={session?.role === 'teacher' ? 'red' : 'outline'} onPress={() => void goRole('teacher')} />
      </View>
      <Section title="School platform" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="apps-outline" title="All school modules" subtitle="Transport, IDs, shop, library, boarding and more" onPress={() => router.push('/modules')} />
        <Row icon="person-outline" title="Personal details" onPress={() => router.push('/settings/profile')} />
        <Row icon="notifications-outline" title="Notification settings" onPress={() => router.push('/settings/notifications')} />
        <Row icon="shield-checkmark-outline" title="Security and password" onPress={() => router.push('/settings/security')} />
        <Row icon="accessibility-outline" title="Accessibility and data mode" onPress={() => router.push('/settings/accessibility')} />
        <Row icon="help-circle-outline" title="Help and support" onPress={() => router.push('/settings/support')} />
        <Row icon="information-circle-outline" title="About Karibu For Schools" onPress={() => router.push('/settings/about')} last />
      </Card>
      <View style={{ marginTop: 22, gap: 10 }}>
        <Button label="Reset test data" variant="yellow" onPress={() => void resetDemo()} />
        <Button label="Log out" variant="outline" onPress={async () => { await logout(); router.replace('/login'); }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 21, fontWeight: '900' },
  role: { color: colors.muted, marginTop: 4 },
  roleButtons: { gap: 8 },
});
