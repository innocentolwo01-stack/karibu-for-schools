import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Pill, Progress, Row, Screen, Section } from '@/components/ui';
import { subjects } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function Subjects() {
  return (
    <Screen>
      <Header title="Subjects and resources" subtitle="Current modules and teacher materials" back onBack={() => router.back()} />
      {subjects.map(subject => <Card key={subject.id} style={styles.subject}><Pill label={`${subject.score}% CURRENT`} tone={subject.score >= 80 ? 'green' : 'blue'} /><Text style={styles.title}>{subject.name}</Text><Text style={styles.sub}>{subject.teacher}</Text><View style={{ marginTop: 12 }}><Progress value={subject.score} tone="blue" /></View><Section title="Resources" /><Row icon="document-text-outline" title="Term 2 notes" subtitle="Read notes and mark complete" onPress={() => router.push({ pathname: '/student/resource/[id]', params: { id: subject.id, type: 'notes' } })} /><Row icon="play-circle-outline" title="Revision lesson" subtitle="Open the interactive video lesson" onPress={() => router.push({ pathname: '/student/resource/[id]', params: { id: subject.id, type: 'video' } })} last /></Card>)}
    </Screen>
  );
}

const styles = StyleSheet.create({ subject: { marginBottom: 12 }, title: { fontSize: 22, fontWeight: '900', marginTop: 13 }, sub: { color: colors.muted, marginTop: 5 } });
