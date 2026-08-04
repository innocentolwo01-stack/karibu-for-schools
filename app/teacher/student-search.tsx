import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Card, EmptyState, Field, Header, Pill, Row, Screen, Section } from '@/components/ui';
import { teacherStudents } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function StudentSearch() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => teacherStudents.filter(student => student.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Screen>
      <Header title="Find a student" subtitle="Search classes and pastoral records" back onBack={() => router.back()} />
      <Field label="Student name or ID" value={query} onChangeText={setQuery} placeholder="Amani Olwo" />
      <Section title="Search results" />
      {!results.length ? <EmptyState icon="person-outline" title="No student found" body="Check the spelling or search another class." /> : results.map((student, index) => <Card key={student.id} style={styles.student}><Pill label="S3 BLUE" tone="blue" /><Text style={styles.name}>{student.name}</Text><Text style={styles.meta}>{student.id.toUpperCase()} · Attendance {94 - index}%</Text><Card style={{ marginTop: 13, paddingVertical: 2 }}><Row title="Academic overview" subtitle="Open current results and assignments" onPress={() => router.push('/teacher/markbook')} /><Row title="Attendance history" subtitle="Manual and QR records" onPress={() => router.push('/teacher/attendance')} /><Row title="Message guardian" subtitle="Secure parent communication" onPress={() => router.push('/messages/compose')} last /></Card></Card>)}
    </Screen>
  );
}

const styles = StyleSheet.create({ student: { marginBottom: 10 }, name: { fontSize: 22, fontWeight: '900', marginTop: 13 }, meta: { color: colors.muted, marginTop: 5 } });
