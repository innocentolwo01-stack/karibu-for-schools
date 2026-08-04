import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Row, Screen, Section, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { children } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function ChildrenPage() {
  const { selectedChild, selectChild } = useApp();
  return (
    <Screen>
      <Header title="My children" subtitle="Switch profiles and manage school life" right={<IconButton icon="settings-outline" onPress={() => router.push('/more')} />} />
      {children.map(item => (
        <Pressable key={item.id} onPress={() => selectChild(item.id)}>
          <Card style={[styles.child, selectedChild.id === item.id && styles.active]}>
            <View style={styles.avatar}><Text style={{ fontSize: 34 }}>{item.avatar}</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.name}>{item.name}</Text><Text style={styles.sub}>{item.className} {item.stream} · {item.school}</Text></View>
            <Pill label={selectedChild.id === item.id ? 'SELECTED' : 'VIEW'} tone={selectedChild.id === item.id ? 'red' : 'black'} />
          </Card>
        </Pressable>
      ))}
      <Section title={`${selectedChild.name}'s overview`} />
      <View style={styles.grid}><Stat label="Attendance" value={`${selectedChild.attendance}%`} helper="This term" /><Stat label="Average" value={`${selectedChild.average}%`} helper="Across subjects" /></View>
      <Card style={{ paddingVertical: 2, marginTop: 10 }}>
        <Row icon="stats-chart-outline" title="Academic performance" onPress={() => router.push('/parent/performance')} />
        <Row icon="document-text-outline" title="Official reports" onPress={() => router.push('/parent/reports')} />
        <Row icon="calendar-outline" title="Attendance history" onPress={() => router.push('/parent/attendance')} />
        <Row icon="medical-outline" title="Medical and authorised collection" subtitle="Manage test details" onPress={() => router.push('/settings/profile')} />
        <Row icon="person-add-outline" title="Add another child" subtitle="Start a sibling admissions application" onPress={() => router.push('/modules/admissions')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  child: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  active: { borderColor: colors.red, borderWidth: 2, backgroundColor: colors.paleRed },
  avatar: { width: 62, height: 62, borderRadius: 21, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5 },
  grid: { flexDirection: 'row', gap: 10 },
});
