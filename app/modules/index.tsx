import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, ModuleTile, Pill, Screen, Section } from '@/components/ui';
import { schoolModules } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function Modules() {
  return (
    <Screen>
      <Header title="Complete school platform" subtitle="Every module is available in this interactive test build" back onBack={() => router.back()} right={<IconButton icon="search-outline" onPress={() => router.push('/modules/search')} />} />
      <Card style={styles.intro}><Pill label="MODULAR BY SCHOOL" tone="yellow" /><Text style={styles.title}>One platform. Only the modules each school needs.</Text><Text style={styles.body}>Small schools can keep the experience simple. Larger schools can enable transport, boarding, cafeteria, admissions, alumni and external integrations without rebuilding the app.</Text></Card>
      <Section title="School modules" />
      <View style={styles.grid}>{schoolModules.map(module => <ModuleTile key={module.slug} icon={module.icon as never} title={module.title} summary={module.summary} onPress={() => router.push(`/modules/${module.slug}` as never)} />)}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({ intro: { backgroundColor: colors.black, borderColor: colors.black }, title: { color: colors.white, fontSize: 23, lineHeight: 28, fontWeight: '900', marginTop: 14 }, body: { color: '#CFCFD2', lineHeight: 21, marginTop: 9 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } });
