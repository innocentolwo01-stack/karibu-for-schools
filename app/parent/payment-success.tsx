import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Money, Pill } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function PaymentSuccess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useApp();
  const payment = data.payments.find(item => item.id === id);
  if (!payment) return <SafeAreaView style={styles.safe}><View style={styles.content}><Text>Payment not found.</Text><Button label="Return to payments" onPress={() => router.replace('/parent/payments')} /></View></SafeAreaView>;
  const success = payment.status === 'successful';
  const pending = payment.status === 'pending';
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={[styles.check, { backgroundColor: success ? colors.green : pending ? colors.amber : colors.red }]}><Text style={styles.tick}>{success ? '✓' : pending ? '…' : '×'}</Text></View>
        <Text style={styles.title}>{success ? 'Payment successful' : pending ? 'Payment pending' : 'Payment failed'}</Text>
        <Text style={styles.sub}>{payment.title}</Text>
        <Money value={payment.amount} style={styles.amount} />
        <Pill label={payment.status.toUpperCase()} tone={success ? 'green' : pending ? 'yellow' : 'red'} />
        <Text style={styles.detail}>{payment.method}</Text>
        <Text style={styles.reference}>Reference {payment.id.toUpperCase()}</Text>
        <View style={styles.buttons}>
          <Button label="View receipt" onPress={() => router.replace(`/parent/payment-receipt/${payment.id}` as never)} />
          <Button label="Back to payments" variant="black" onPress={() => router.replace('/parent/payments')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4FFF8' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  check: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  tick: { fontSize: 54, fontWeight: '900', color: colors.white },
  title: { fontSize: 30, fontWeight: '900', marginTop: 25, textAlign: 'center' },
  sub: { color: colors.muted, marginTop: 8, textAlign: 'center' },
  amount: { fontSize: 36, fontWeight: '900', color: colors.red, marginTop: 22, marginBottom: 12 },
  detail: { textAlign: 'center', color: colors.muted, marginTop: 16 },
  reference: { textAlign: 'center', color: colors.muted, marginTop: 6, fontSize: 11 },
  buttons: { width: '100%', gap: 10, marginTop: 'auto' },
});
