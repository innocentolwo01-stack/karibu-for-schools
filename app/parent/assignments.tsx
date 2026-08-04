import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Card, Header, Pill, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const toneFor = (status: string) => status === 'Marked' || status === 'Submitted' ? 'green' : status === 'In progress' ? 'blue' : status === 'Returned for changes' ? 'red' : 'yellow';

export default function ParentAssignments() {
  const { data, selectedChild } = useApp();
  return <Screen><Header title="Assignments and homework" subtitle={`${selectedChild.name} · Parent view`} back onBack={() => router.back()} /><Section title="Current school work" />{data.assignments.map(item => <Card key={item.id} style={styles.card}><Pill label={item.status.toUpperCase()} tone={toneFor(item.status) as never} /><Text style={styles.title}>{item.title}</Text><Text style={styles.sub}>{item.subject} · Due {item.due}</Text>{item.feedback ? <Text style={styles.feedback}>Teacher feedback: {item.feedback}</Text> : null}</Card>)}</Screen>;
}

const styles = StyleSheet.create({ card: { marginBottom: 9 }, title: { fontSize: 17, fontWeight: '900', marginTop: 11 }, sub: { color: colors.muted, marginTop: 5 }, feedback: { color: colors.muted, lineHeight: 20, marginTop: 11 } });
