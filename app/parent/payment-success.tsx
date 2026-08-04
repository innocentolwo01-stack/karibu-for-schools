import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Money } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function PaymentSuccess() {
  const params = useLocalSearchParams<{
    title?: string;
    amount?: string;
    method?: string;
  }>();

  const title = params.title ?? 'School payment';
  const amount = Number(params.amount ?? 0);
  const method = params.method ?? 'Payment method';
  const reference = `KFS-${Date.now().toString().slice(-8)}`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.check}>
          <Text style={styles.tick}>✓</Text>
        </View>

        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.sub}>{title}</Text>
        <Money value={amount} style={styles.amount} />

        <Text style={styles.detail}>{method}</Text>
        <Text style={styles.reference}>Reference {reference}</Text>

        <View style={styles.buttons}>
          <Button
            label="View dashboard"
            onPress={() => router.replace('/parent/home')}
          />
          <Button
            label="Done"
            variant="black"
            onPress={() => router.replace('/parent/home')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4FFF8',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    fontSize: 54,
    fontWeight: '900',
    color: colors.white,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 25,
  },
  sub: {
    color: colors.muted,
    marginTop: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.red,
    marginTop: 22,
  },
  detail: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 16,
  },
  reference: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 6,
  },
  buttons: {
    width: '100%',
    gap: 10,
    marginTop: 'auto',
  },
});
