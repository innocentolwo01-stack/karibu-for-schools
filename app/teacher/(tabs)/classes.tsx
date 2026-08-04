import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Progress, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { teacherStudents } from '@/data/mock';

export default function Classes() {
  return (
    <Screen>
      <Header title="Classes" subtitle="Students, learning and pastoral overview" right={<IconButton icon="search-outline" onPress={() => router.push('/teacher/student-search')} />} />
      <Card style={styles.classHero}><Pill label="CLASS TEACHER" tone="yellow" /><Text style={styles.heroTitle}>Senior 3 Biology</Text><Text style={styles.heroSub}>36 students · Monday, Wednesday and Friday</Text><View style={{ marginTop: 14 }}><Progress value={94} tone="green" /></View><Text style={styles.heroSub}>94% attendance this term</Text></Card>
      <Section title="Class tools" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="checkmark-circle-outline" title="Take manual attendance" onPress={() => router.push('/teacher/manual-attendance')} />
        <Row icon="qr-code-outline" title="Start QR attendance" onPress={() => router.push('/teacher/qr-attendance')} />
        <Row icon="document-text-outline" title="Assignments and submissions" onPress={() => router.push('/teacher/assignments')} />
        <Row icon="grid-outline" title="Markbook and results" onPress={() => router.push('/teacher/markbook')} last />
      </Card>
      <Section title="Students" />
      {teacherStudents.map((student, index) => <Card key={student.id} style={styles.student}><View style={styles.avatar}><Text style={{ fontSize: 23 }}>{index % 2 ? '👧🏾' : '👦🏾'}</Text></View><View style={{ flex: 1 }}><Text style={styles.name}>{student.name}</Text><Text style={styles.sub}>{index === 0 ? '94% attendance · 79% Biology' : `${90 + index}% attendance · ${68 + index * 3}% Biology`}</Text></View>{index === 0 ? <Pill label="NEEDS FEEDBACK" tone="yellow" /> : <Pill label="ON TRACK" tone="green" />}</Card>)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  classHero: { backgroundColor: colors.black, borderColor: colors.black },
  heroTitle: { color: colors.white, fontSize: 25, fontWeight: '900', marginTop: 14 },
  heroSub: { color: '#CFCFD2', marginTop: 7 },
  student: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5, fontSize: 12 },
});
