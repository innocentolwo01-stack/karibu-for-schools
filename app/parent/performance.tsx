import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Pill, Progress, Screen, Section, Stat } from '@/components/ui';
import { subjects } from '@/data/mock';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function Performance() {
  const { selectedChild } = useApp();
  return (
    <Screen>
      <Header title="Academic performance" subtitle={`${selectedChild.name} · Term 2, 2026`} back onBack={() => router.back()} />
      <View style={styles.grid}><Stat label="Current average" value={`${selectedChild.average}%`} helper="Up 6% from Term 1" /><Stat label="Strongest subject" value="82%" helper="Mathematics" tone="yellow" /></View>
      <Section title="Subject performance" />
      {subjects.map(subject => <Card key={subject.id} style={styles.subject}><View style={styles.top}><View><Text style={styles.title}>{subject.name}</Text><Text style={styles.sub}>{subject.teacher}</Text></View><Pill label={`${subject.score}%`} tone={subject.score >= 80 ? 'green' : subject.score >= 75 ? 'blue' : 'yellow'} /></View><View style={{ marginTop: 14 }}><Progress value={subject.score} tone={subject.score >= 80 ? 'green' : 'blue'} /></View><Text style={styles.comment}>{subject.score >= 80 ? 'Excellent progress. Continue practising higher-order questions.' : subject.score >= 75 ? 'Good progress. Focus on consistency and written explanations.' : 'Support recommended in the next revision cycle.'}</Text></Card>)}
      <Section title="Teacher summary" />
      <Card><Text style={styles.quote}>“Amani is making steady progress and participates confidently. The next priority is completing written work on time.”</Text><Text style={styles.teacher}>Mrs Nakato · Class teacher</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  subject: { marginBottom: 9 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5 },
  comment: { color: colors.muted, lineHeight: 20, marginTop: 12 },
  quote: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
  teacher: { color: colors.muted, marginTop: 13 },
});
