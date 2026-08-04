import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, IconButton, Pill, Row, Screen, Section } from '@/components/ui';
import { timetable, tests } from '@/data/mock';
import { colors } from '@/constants/theme';

export default function StudentCalendar() {
  return (
    <Screen>
      <Header title="Calendar" subtitle="Classes, deadlines and activities" right={<IconButton icon="settings-outline" onPress={() => router.push('/more')} />} />
      <Card style={styles.date}><Text style={styles.day}>TUE</Text><Text style={styles.number}>4</Text><View><Text style={styles.month}>August 2026</Text><Text style={styles.sub}>4 lessons · 1 assignment due soon</Text></View></Card>
      <Section title="Today's timetable" />
      {timetable.map((item, index) => <Card key={item.time} style={styles.lesson}><View style={styles.timeBlock}><Text style={styles.time}>{item.time}</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>{item.subject}</Text><Text style={styles.sub}>{item.room}</Text></View>{index === 0 ? <Pill label="NEXT" tone="red" /> : null}</Card>)}
      <Section title="Upcoming tests" />
      <Card style={{ paddingVertical: 2 }}>
        {tests.filter(item => item.score === null).map((item, index, list) => <Row key={item.title} icon="clipboard-outline" title={item.title} subtitle={`${item.subject} · ${item.date}`} last={index === list.length - 1} />)}
      </Card>
      <Section title="Activities" />
      <Card style={{ paddingVertical: 2 }}><Row icon="football-outline" title="Football training" subtitle="Wednesday · 16:00" /><Row icon="people-outline" title="Debate club" subtitle="Thursday · 15:30" last /></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  date: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.black, borderColor: colors.black },
  day: { color: colors.yellow, fontWeight: '900' },
  number: { color: colors.white, fontSize: 43, fontWeight: '900' },
  month: { color: colors.white, fontSize: 18, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5 },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  timeBlock: { width: 62, height: 48, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  time: { fontWeight: '900', color: colors.red },
  title: { fontWeight: '900' },
});
