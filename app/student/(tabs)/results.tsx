import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Progress, Screen, Section, Stat } from '@/components/ui';
import { subjects, tests } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function Results() {
  return (
    <Screen>
      <Header title="Results" subtitle="Scores, reports and progress" right={<IconButton icon="document-text-outline" onPress={() => router.push('/parent/reports')} />} />
      <View style={styles.grid}><Stat label="Average" value="77%" helper="Up 6% this term" /><Stat label="Attendance" value="94%" helper="Above target" tone="yellow" /></View>
      <Section title="Subject results" />
      {subjects.map(subject => <Card key={subject.id} style={styles.subject}><View style={styles.top}><View><Text style={styles.title}>{subject.name}</Text><Text style={styles.sub}>{subject.teacher}</Text></View><Pill label={`${subject.score}%`} tone={subject.score >= 80 ? 'green' : subject.score >= 75 ? 'blue' : 'yellow'} /></View><View style={{ marginTop: 12 }}><Progress value={subject.score} tone={subject.score >= 80 ? 'green' : 'blue'} /></View></Card>)}
      <Section title="Recent assessments" />
      {tests.filter(item => item.score !== null).map(item => <Card key={item.title} style={styles.assessment}><View><Text style={styles.title}>{item.title}</Text><Text style={styles.sub}>{item.subject} · {item.date}</Text></View><Text style={styles.score}>{item.score}%</Text></Card>)}
      <Section title="Report card" />
      <Card><Text style={styles.title}>Term 2 Progress Report</Text><Text style={styles.sub}>Published 31 July 2026</Text><Text style={styles.open} onPress={() => router.push('/parent/reports')}>Open official report →</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  subject: { marginBottom: 9 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '900', fontSize: 16 },
  sub: { color: colors.muted, marginTop: 5 },
  assessment: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  score: { color: colors.green, fontSize: 24, fontWeight: '900' },
  open: { color: colors.red, fontWeight: '900', marginTop: 13 },
});
