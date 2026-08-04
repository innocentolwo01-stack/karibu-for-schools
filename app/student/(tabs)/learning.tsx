import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Card, Header, IconButton, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { useApp } from '@/context/AppContext';

const toneFor = (status: string) => status === 'Marked' || status === 'Submitted' ? 'green' : status === 'In progress' ? 'blue' : status === 'Returned for changes' ? 'red' : 'yellow';

export default function Learning() {
  const { data } = useApp();
  return (
    <Screen>
      <Header title="Learning" subtitle="Subjects, assignments and resources" right={<IconButton icon="search-outline" onPress={() => router.push('/student/subjects')} />} />
      <Section title="Assignments" action="View all" onAction={() => router.push('/student/assignments')} />
      {data.assignments.map(item => <Card key={item.id} style={styles.assignment}><Pill label={item.status.toUpperCase()} tone={toneFor(item.status) as never} /><Text style={styles.title}>{item.title}</Text><Text style={styles.sub}>{item.subject} · Due {item.due}</Text><Text style={styles.open} onPress={() => router.push(`/student/assignment/${item.id}` as never)}>Open assignment →</Text></Card>)}
      <Section title="My subjects" />
      <Card style={{ paddingVertical: 2 }}>
        {subjects.map((subject, index) => <Row key={subject.id} icon="book-outline" title={subject.name} subtitle={`${subject.teacher} · Current score ${subject.score}%`} onPress={() => router.push('/student/subjects')} last={index === subjects.length - 1} />)}
      </Card>
      <Section title="Study tools" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="clipboard-outline" title="Tests and examinations" onPress={() => router.push('/student/tests')} />
        <Row icon="folder-open-outline" title="Revision resources" subtitle="Demo subject notes and worksheets" onPress={() => router.push('/student/subjects')} />
        <Row icon="sparkles-outline" title="Personal revision plan" subtitle="Human-reviewed AI support module" onPress={() => router.push('/modules/ai-support')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  assignment: { marginBottom: 9 },
  title: { fontSize: 16, fontWeight: '900', marginTop: 10 },
  sub: { color: colors.muted, marginTop: 5 },
  open: { color: colors.red, fontWeight: '900', marginTop: 13 },
});
