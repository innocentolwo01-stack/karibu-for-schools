import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Header, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { AssignmentStatus, useApp } from '@/context/AppContext';

const toneFor = (status: string) => status === 'Marked' || status === 'Submitted' ? 'green' : status === 'In progress' ? 'blue' : status === 'Returned for changes' ? 'red' : 'yellow';

export default function AssignmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateAssignmentStatus } = useApp();
  const assignment = data.assignments.find(item => item.id === id);
  const [answer, setAnswer] = useState('My working and written response are attached in this sandbox submission.');
  const [fileAttached, setFileAttached] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  if (!assignment) return <Screen><Header title="Assignment" back onBack={() => router.back()} /><Card><Text>Assignment not found.</Text></Card></Screen>;
  const submit = async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 650));
    updateAssignmentStatus(assignment.id, 'Submitted', { submittedAt: new Date().toISOString() });
    setSubmitting(false);
  };
  const update = (status: AssignmentStatus) => updateAssignmentStatus(assignment.id, status);
  return (
    <Screen>
      <Header title={assignment.title} subtitle={`${assignment.subject} · Due ${assignment.due}`} back onBack={() => router.back()} />
      <Card style={styles.hero}><Pill label={assignment.status.toUpperCase()} tone={toneFor(assignment.status) as never} /><Text style={styles.heroTitle}>{assignment.title}</Text><Text style={styles.heroSub}>{assignment.instructions ?? 'Complete the task and submit a written response or attachment.'}</Text></Card>
      <Section title="Assignment resources" />
      <Card style={{ paddingVertical: 2 }}><Row icon="document-attach-outline" title={assignment.attachment ?? 'Assignment instructions'} subtitle="Open teacher resource" onPress={() => router.push({ pathname: '/student/resource/[id]', params: { id: assignment.id, type: 'document' } })} last /></Card>
      <Section title="Your work" />
      <Field label="Written response" value={answer} onChangeText={value => { setAnswer(value); if (assignment.status === 'Not started') update('In progress'); }} multiline />
      <Button label={fileAttached ? '✓ Test file attached' : 'Attach test file'} variant={fileAttached ? 'green' : 'outline'} icon="attach" onPress={() => { setFileAttached(true); if (assignment.status === 'Not started') update('In progress'); }} />
      {assignment.feedback ? <><Section title="Teacher feedback" /><Card><Text style={styles.feedback}>{assignment.feedback}</Text>{assignment.score !== undefined ? <Text style={styles.score}>{assignment.score}%</Text> : null}</Card></> : null}
      <View style={{ marginTop: 20, gap: 9 }}>
        <Button label={assignment.status === 'Submitted' ? 'Submitted successfully' : 'Submit assignment'} disabled={!answer.trim() || assignment.status === 'Submitted'} loading={submitting} onPress={() => void submit()} />
        {assignment.status === 'Submitted' ? <Button label="Withdraw and edit" variant="outline" onPress={() => update('In progress')} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.black, borderColor: colors.black },
  heroTitle: { color: colors.white, fontSize: 23, fontWeight: '900', marginTop: 15 },
  heroSub: { color: '#CFCFD2', lineHeight: 21, marginTop: 8 },
  feedback: { lineHeight: 22, fontWeight: '700' },
  score: { color: colors.green, fontSize: 28, fontWeight: '900', marginTop: 12 },
});
