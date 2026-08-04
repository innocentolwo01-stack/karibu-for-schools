import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Header, Pill, Screen, Section, Segmented } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const toneFor = (status: string) => status === 'Marked' || status === 'Submitted' ? 'green' : status === 'In progress' ? 'blue' : status === 'Returned for changes' ? 'red' : 'yellow';

export default function TeacherAssignments() {
  const { data, createAssignment, updateAssignmentStatus } = useApp();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [title, setTitle] = useState('Photosynthesis investigation');
  const [subject, setSubject] = useState('Biology');
  const [due, setDue] = useState('14 Aug');
  const [instructions, setInstructions] = useState('Complete the investigation report and include one labelled diagram.');
  const [published, setPublished] = useState(false);
  const [attached, setAttached] = useState(false);
  const publish = () => {
    createAssignment(title, subject, due, { instructions, attachment: attached ? `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-resource.pdf` : undefined });
    setPublished(true);
    setMode('list');
  };
  return (
    <Screen>
      <Header title="Assignments" subtitle="Create, review and mark class work" back onBack={() => router.back()} />
      <Segmented value={mode} onChange={setMode} options={[{ value: 'list', label: 'Published and submissions' }, { value: 'create', label: 'Create assignment' }]} />
      {published ? <Card style={{ backgroundColor: colors.paleGreen, marginTop: 12 }}><Text style={{ color: colors.green, fontWeight: '900' }}>✓ Assignment published and student notification created.</Text></Card> : null}
      {mode === 'create' ? (
        <>
          <Section title="Assignment details" />
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Field label="Subject" value={subject} onChangeText={setSubject} />
          <Field label="Due date" value={due} onChangeText={setDue} />
          <Field label="Instructions" value={instructions} onChangeText={setInstructions} multiline />
          <Button label={attached ? '✓ Resource attached' : 'Attach assignment resource'} variant={attached ? 'green' : 'outline'} icon="attach" onPress={() => setAttached(!attached)} />
          <View style={{ marginTop: 10 }}><Button label="Publish assignment" disabled={!title.trim() || !subject.trim() || !due.trim()} onPress={publish} /></View>
        </>
      ) : (
        <>
          <Section title="Published assignments" action="Create new" onAction={() => setMode('create')} />
          {data.assignments.map(assignment => <Card key={assignment.id} style={styles.assignment}><View style={styles.top}><Pill label={assignment.status.toUpperCase()} tone={toneFor(assignment.status) as never} /><Text style={styles.due}>Due {assignment.due}</Text></View><Text style={styles.title}>{assignment.title}</Text><Text style={styles.sub}>{assignment.subject}</Text>{assignment.status === 'Submitted' ? <View style={styles.actions}><Button label="Mark 86%" variant="green" onPress={() => updateAssignmentStatus(assignment.id, 'Marked', { score: 86, feedback: 'Strong work. Your explanation is clear and the diagram is accurate.' })} /><Button label="Return for changes" variant="outline" onPress={() => updateAssignmentStatus(assignment.id, 'Returned for changes', { feedback: 'Add one labelled diagram and resubmit.' })} /></View> : <Pressable onPress={() => router.push(`/student/assignment/${assignment.id}` as never)}><Text style={styles.open}>Preview student view →</Text></Pressable>}</Card>)}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  assignment: { marginBottom: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  due: { color: colors.muted, fontSize: 12 },
  title: { fontSize: 18, fontWeight: '900', marginTop: 13 },
  sub: { color: colors.muted, marginTop: 5 },
  open: { color: colors.red, fontWeight: '900', marginTop: 13 },
  actions: { gap: 8, marginTop: 15 },
});
