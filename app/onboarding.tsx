import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const slides = [
  {
    image: require('../assets/illustrations/school.png'),
    eyebrow: 'ONE BEAUTIFUL PLATFORM',
    title: 'A better way to run every school day.',
    body: 'Everything parents, students and teachers need, organised around what matters now.',
    accent: colors.paleBlue,
  },
  {
    image: require('../assets/illustrations/connected.png'),
    eyebrow: 'STAY CONNECTED',
    title: 'Updates arrive at the right moment.',
    body: 'Messages, attendance, assignments, timetable changes and important alerts stay in one place.',
    accent: colors.paleRed,
  },
  {
    image: require('../assets/illustrations/learner.png'),
    eyebrow: 'SUPPORT EVERY LEARNER',
    title: 'See progress. Act early. Celebrate growth.',
    body: 'Track learning, wellbeing, attendance and teacher feedback without losing the human connection.',
    accent: colors.palePurple,
  },
  {
    image: require('../assets/illustrations/family.png'),
    eyebrow: 'STRONGER TOGETHER',
    title: 'Parents, teachers and students. Working as one.',
    body: 'Pay securely, book teachers, approve consent and manage the complete school journey.',
    accent: colors.paleYellow,
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const { finishOnboarding } = useApp();
  const slide = slides[index];

  useEffect(() => {
    opacity.setValue(0);
    translateX.setValue(14);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [index, opacity, translateX]);

  const complete = async () => {
    await finishOnboarding();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Logo compact />
        <Pressable onPress={() => void complete()} hitSlop={10}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.body, { opacity, transform: [{ translateX }] }]}>
        <View style={[styles.art, { backgroundColor: slide.accent }]}>
          <View style={styles.artCircleOne} />
          <View style={styles.artCircleTwo} />
          <Image source={slide.image} style={styles.image} resizeMode="contain" />
        </View>

        <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.body}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, dotIndex) => (
            <View key={dotIndex} style={[styles.dot, dotIndex === index && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.actions}>
          {index > 0 ? (
            <Pressable onPress={() => setIndex(index - 1)} style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : <View style={styles.back} />}
          <View style={styles.continue}>
            <Button
              label={index === slides.length - 1 ? 'Start using Karibu' : 'Continue'}
              icon={index === slides.length - 1 ? 'sparkles' : 'arrow-forward'}
              onPress={() => index < slides.length - 1 ? setIndex(index + 1) : void complete()}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 22 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  skip: { fontWeight: '800', color: colors.muted, padding: 8 },
  body: { flex: 1, paddingTop: 24 },
  art: { height: 330, borderRadius: 34, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  artCircleOne: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.72)', top: -90, right: -70 },
  artCircleTwo: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.5)', bottom: -70, left: -50 },
  image: { width: '96%', height: '96%' },
  eyebrow: { color: colors.red, fontSize: 11, fontWeight: '900', letterSpacing: 1.25, marginTop: 30 },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2, marginTop: 10, color: colors.text },
  description: { fontSize: 16, lineHeight: 24, color: colors.muted, marginTop: 12 },
  footer: { paddingBottom: 10 },
  dots: { flexDirection: 'row', gap: 7, marginBottom: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D9D9DE' },
  dotActive: { width: 28, backgroundColor: colors.red },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 58, minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  backText: { fontWeight: '800', color: colors.muted },
  continue: { flex: 1 },
});
