import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Header, IconButton, Pill, Screen, Section, Segmented } from '@/components/ui';
import { teacherStudents } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function Markbook() {
  const [scores, setScores] = useState<Record<string, string>>(Object.fromEntries(teacherStudents.map((student, index) => [student.id, String(74 + index * 3)])));
  const [mode, setMode] = useState<'draft' | 'published'>('draft');
  const [saved, setSaved] = useState(false);
  const invalid = Object.values(scores).some(value => Number(value) > 100);
  return (
    <Screen>
      <Header title="Markbook" subtitle="S3 Biology · Cell structure test" right={<IconButton icon="ellipsis-horizontal" onPress={() => router.push('/settings/markbook')} />} />
      {saved ? <Card style={{ backgroundColor: colors.paleGreen, marginBottom: 10 }}><Text style={{ color: colors.green, fontWeight: '900' }}>✓ Results {mode === 'published' ? 'published to students and parents' : 'saved as draft'}</Text></Card> : null}
      <Segmented value={mode} onChange={setMode} options={[{ value: 'draft', label: 'Save draft' }, { value: 'published', label: 'Publish results' }]} />
      <Section title="Student scores" action="Max 100" />
      {teacherStudents.map(student => <Card key={student.id} style={styles.row}><View style={{ flex: 1 }}><Text style={styles.name}>{student.name}</Text><Text style={styles.sub}>{Number(scores[student.id] || 0) >= 80 ? 'Grade A' : Number(scores[student.id] || 0) >= 70 ? 'Grade B' : 'Grade C'}</Text></View><TextInput value={scores[student.id] ?? ''} onChangeText={value => setScores(previous => ({ ...previous, [student.id]: value.replace(/[^0-9]/g, '').slice(0, 3) }))} style={[styles.input, Number(scores[student.id]) > 100 && styles.invalid]} keyboardType="number-pad" /><Text style={styles.out}>/100</Text></Card>)}
      {invalid ? <Text style={styles.error}>Scores cannot be higher than 100.</Text> : null}
      <Section title="Moderation" />
      <Card><Pill label={mode === 'published' ? 'READY TO PUBLISH' : 'DRAFT'} tone={mode === 'published' ? 'green' : 'yellow'} /><Text style={styles.moderation}>Class average: 81% · 6 of 6 scores entered · No missing students</Text></Card>
      <View style={{ marginTop: 18 }}><Button label={mode === 'published' ? 'Publish results' : 'Save draft'} disabled={invalid} onPress={() => setSaved(true)} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  name: { fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 4, fontSize: 12 },
  input: { width: 62, height: 46, borderWidth: 1, borderColor: colors.border, borderRadius: 12, textAlign: 'center', fontWeight: '900', backgroundColor: colors.white },
  invalid: { borderColor: colors.red, backgroundColor: colors.paleRed },
  out: { color: colors.muted, marginLeft: 6 },
  error: { color: colors.red, fontWeight: '800', marginTop: 4 },
  moderation: { color: colors.muted, lineHeight: 20, marginTop: 12 },
});
