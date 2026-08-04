import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Screen, Section, Segmented } from '@/components/ui';
import { colors } from '@/constants/theme';
import { AttendanceStatus, useApp } from '@/context/AppContext';
import { teacherStudents } from '@/data/mock';

export default function ManualAttendance() {
  const { saveRegister } = useApp();
  const [period, setPeriod] = useState<'morning' | 'lesson'>('lesson');
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(Object.fromEntries(teacherStudents.map(student => [student.id, 'Present'])));
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    saveRegister({
      className: 'Senior 3 Biology',
      lesson: period === 'morning' ? 'Morning registration' : 'Biology · Cell structure',
      date: 'Tuesday, 4 August 2026',
      source: 'manual',
      submitted: true,
      entries: teacherStudents.map(student => ({ studentId: student.id, studentName: student.name, status: statuses[student.id], arrival: statuses[student.id] === 'Late' ? '08:24' : statuses[student.id] === 'Present' ? '08:02' : undefined })),
    });
    setSubmitted(true);
  };
  const counts = teacherStudents.reduce((result, student) => ({ ...result, [statuses[student.id]]: (result[statuses[student.id]] ?? 0) + 1 }), {} as Record<string, number>);
  return (
    <Screen>
      <Header title="Manual attendance" subtitle="Senior 3 Biology · Tuesday, 4 August" back onBack={() => router.back()} />
      {submitted ? <Card style={styles.success}><Text style={styles.successText}>✓ Register submitted and parent notifications created.</Text></Card> : null}
      <Segmented value={period} onChange={setPeriod} options={[{ value: 'morning', label: 'Morning register' }, { value: 'lesson', label: 'Lesson register' }]} />
      <Section title="Register summary" />
      <View style={styles.summary}><Pill label={`${counts.Present ?? 0} PRESENT`} tone="green" /><Pill label={`${counts.Late ?? 0} LATE`} tone="yellow" /><Pill label={`${counts.Absent ?? 0} ABSENT`} tone="red" /></View>
      <Section title="Students" action="Mark all present" onAction={() => setStatuses(Object.fromEntries(teacherStudents.map(student => [student.id, 'Present'])))} />
      {teacherStudents.map((student, index) => <Card key={student.id} style={styles.student}><View style={styles.avatar}><Text style={{ fontSize: 23 }}>{index % 2 ? '👧🏾' : '👦🏾'}</Text></View><View style={{ flex: 1 }}><Text style={styles.name}>{student.name}</Text><Text style={styles.sub}>{statuses[student.id]}{statuses[student.id] === 'Late' ? ' · 08:24' : ''}</Text></View><View style={styles.statuses}>{(['Present', 'Late', 'Absent'] as AttendanceStatus[]).map(status => <Pressable key={status} onPress={() => setStatuses(previous => ({ ...previous, [student.id]: status }))} style={[styles.status, statuses[student.id] === status && { backgroundColor: status === 'Present' ? colors.green : status === 'Late' ? colors.amber : colors.red, borderColor: 'transparent' }]}><Text style={[styles.statusText, statuses[student.id] === status && { color: colors.white }]}>{status[0]}</Text></Pressable>)}</View></Card>)}
      <View style={{ marginTop: 16 }}><Button label={submitted ? 'Register submitted' : 'Submit register'} disabled={submitted} onPress={submit} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  success: { backgroundColor: colors.paleGreen, marginBottom: 10 }, successText: { color: colors.green, fontWeight: '900' },
  summary: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  student: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '900' }, sub: { color: colors.muted, marginTop: 4, fontSize: 12 },
  statuses: { flexDirection: 'row', gap: 5 }, status: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, statusText: { fontWeight: '900', color: colors.muted },
});
