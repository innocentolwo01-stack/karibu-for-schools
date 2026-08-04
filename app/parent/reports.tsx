import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function Reports() {
  const { selectedChild } = useApp();
  return (
    <Screen>
      <Header title="Official reports" subtitle={selectedChild.name} back onBack={() => router.back()} />
      <Card style={styles.latest}>
        <Pill label="LATEST REPORT" tone="green" />
        <Text style={styles.title}>Term 2 Progress Report</Text>
        <Text style={styles.sub}>Published 31 July 2026 · Average 77%</Text>
        <View style={{ marginTop: 17 }}><Button label="Open report" variant="yellow" onPress={() => router.push('/parent/performance')} /></View>
      </Card>
      <Section title="Report archive" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="document-text-outline" title="Term 1, 2026" subtitle="Final report · Average 71%" onPress={() => router.push('/parent/performance')} />
        <Row icon="document-text-outline" title="Term 3, 2025" subtitle="Final report · Average 69%" onPress={() => router.push('/parent/performance')} />
        <Row icon="ribbon-outline" title="Academic certificate" subtitle="Most improved in Mathematics" onPress={() => router.push('/parent/certificate')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  latest: { backgroundColor: colors.black, borderColor: colors.black },
  title: { color: colors.white, fontSize: 23, fontWeight: '900', marginTop: 15 },
  sub: { color: '#CFCFD2', marginTop: 8 },
});
