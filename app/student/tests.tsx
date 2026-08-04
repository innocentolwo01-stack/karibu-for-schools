import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Pill, Screen, Section } from '@/components/ui';
import { tests } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function Tests() {
  return (
    <Screen>
      <Header title="Tests and examinations" subtitle="Dates, revision topics and results" back onBack={() => router.back()} />
      <Section title="Upcoming" />
      {tests.filter(item => item.score === null).map(item => <Card key={item.title} style={styles.item}><View style={{ flex: 1 }}><Pill label="UPCOMING" tone="yellow" /><Text style={styles.title}>{item.title}</Text><Text style={styles.sub}>{item.subject} · {item.date}</Text><Text style={styles.topic}>Revision: key concepts, examples and teacher practice questions.</Text></View></Card>)}
      <Section title="Completed" />
      {tests.filter(item => item.score !== null).map(item => <Card key={item.title} style={styles.completed}><View><Text style={styles.title}>{item.title}</Text><Text style={styles.sub}>{item.subject} · {item.date}</Text></View><Text style={styles.score}>{item.score}%</Text></Card>)}
    </Screen>
  );
}

const styles = StyleSheet.create({ item: { marginBottom: 9 }, completed: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { fontWeight: '900', fontSize: 17, marginTop: 11 }, sub: { color: colors.muted, marginTop: 5 }, topic: { color: colors.muted, lineHeight: 20, marginTop: 10 }, score: { color: colors.green, fontSize: 28, fontWeight: '900' } });
