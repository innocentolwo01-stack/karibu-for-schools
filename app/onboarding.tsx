import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, StepBar } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const slides = [
  { emoji: '📚', title: 'Know what needs attention', body: 'See learning, reports, attendance, behaviour, timetables and school updates for every linked child.' },
  { emoji: '💳', title: 'Payments without queues', body: 'Pay fees, trips, meals and school-shop orders, then keep statements and receipts in one place.' },
  { emoji: '📅', title: 'Book teachers properly', body: 'Choose a child, subject, teacher, meeting type and available calendar slot.' },
  { emoji: '🚌', title: 'The complete school day', body: 'Transport, digital IDs, library, cafeteria, boarding and future school modules are ready to explore.' },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const { finishOnboarding } = useApp();
  const slide = slides[index];
  const complete = async () => {
    await finishOnboarding();
    router.replace('/login');
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.skip}><Text onPress={complete} style={{ fontWeight: '800' }}>Skip</Text></View>
      <StepBar current={index + 1} total={slides.length} />
      <View style={styles.art}><Text style={styles.emoji}>{slide.emoji}</Text></View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.body}>{slide.body}</Text>
      <View style={{ marginTop: 'auto' }}>
        <Button label={index === slides.length - 1 ? 'Continue to login' : 'Continue'} onPress={() => index < slides.length - 1 ? setIndex(index + 1) : void complete()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white, padding: 24 },
  skip: { alignItems: 'flex-end', marginTop: 8, marginBottom: 16 },
  art: { height: 300, borderRadius: 32, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  emoji: { fontSize: 105 },
  title: { fontSize: 34, lineHeight: 39, fontWeight: '900', marginTop: 34 },
  body: { fontSize: 17, lineHeight: 25, color: colors.muted, marginTop: 12 },
});
