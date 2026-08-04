import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Pill, Progress, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function StudentResource() {
  const { id, type = 'notes' } = useLocalSearchParams<{ id: string; type?: 'notes' | 'video' | 'document' }>();
  const { data, setModuleValue } = useApp();
  const subject = subjects.find(item => item.id === id);
  const assignment = data.assignments.find(item => item.id === id);
  const title = assignment?.attachment ?? `${subject?.name ?? 'School'} ${type === 'video' ? 'revision lesson' : type === 'notes' ? 'Term 2 notes' : 'assignment resource'}`;
  const stateKey = `resourceComplete:${id}:${type}`;
  const completed = Boolean(data.moduleState[stateKey]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(completed ? 100 : 35);

  const advanceVideo = () => {
    setPlaying(true);
    const next = Math.min(100, progress + 25);
    setProgress(next);
    if (next === 100) setModuleValue(stateKey, true);
  };

  return (
    <Screen>
      <Header title={title} subtitle={assignment?.subject ?? subject?.name ?? 'Learning resource'} back onBack={() => router.back()} />
      {type === 'video' ? (
        <>
          <Card style={styles.video}>
            <Text style={styles.videoIcon}>{playing ? '▶' : '▸'}</Text>
            <Text style={styles.videoTitle}>{subject?.name ?? 'Subject'} revision lesson</Text>
            <Text style={styles.videoSub}>{playing ? 'Test lesson is playing' : '12-minute interactive lesson'}</Text>
          </Card>
          <Section title="Lesson progress" />
          <Card><Progress value={progress} tone="green" /><Text style={styles.progressText}>{progress}% completed</Text></Card>
          <View style={{ marginTop: 16 }}><Button label={progress === 100 ? 'Lesson completed' : playing ? 'Continue test lesson' : 'Play test lesson'} variant={progress === 100 ? 'green' : 'red'} disabled={progress === 100} onPress={advanceVideo} /></View>
        </>
      ) : (
        <>
          <Card style={styles.document}>
            <Pill label={type === 'notes' ? 'STUDY NOTES' : 'TEACHER ATTACHMENT'} tone="blue" />
            <Text style={styles.documentTitle}>{title}</Text>
            <Text style={styles.paragraph}>Learning objective</Text>
            <Text style={styles.body}>Understand the main ideas, use subject vocabulary accurately and apply the concept in a worked example.</Text>
            <Text style={styles.paragraph}>Key points</Text>
            <Text style={styles.body}>• Review the definitions and examples.{`\n`}• Check each step before moving on.{`\n`}• Complete the short practice task.{`\n`}• Ask your teacher about anything that remains unclear.</Text>
            <Text style={styles.paragraph}>Practice task</Text>
            <Text style={styles.body}>Write a five-sentence summary and one question you would like to discuss in class.</Text>
          </Card>
          <View style={{ marginTop: 16 }}><Button label={completed ? 'Resource marked complete' : 'Mark resource complete'} variant={completed ? 'green' : 'red'} disabled={completed} onPress={() => setModuleValue(stateKey, true)} /></View>
        </>
      )}
      <Section title="Learning actions" />
      <Card>
        <Pressable onPress={() => router.push('/student/learning')}><Text style={styles.action}>Return to Learning →</Text></Pressable>
        <Pressable onPress={() => router.push('/messages/compose')}><Text style={styles.action}>Ask the teacher a question →</Text></Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  video: { minHeight: 250, backgroundColor: colors.black, borderColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  videoIcon: { color: colors.yellow, fontSize: 72, fontWeight: '900' },
  videoTitle: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 15, textAlign: 'center' },
  videoSub: { color: '#CFCFD2', marginTop: 7 },
  progressText: { color: colors.muted, fontWeight: '800', marginTop: 10 },
  document: { padding: 22 },
  documentTitle: { fontSize: 24, fontWeight: '900', marginTop: 15 },
  paragraph: { fontSize: 17, fontWeight: '900', marginTop: 22 },
  body: { color: colors.muted, lineHeight: 23, marginTop: 7 },
  action: { color: colors.red, fontWeight: '900', paddingVertical: 10 },
});
