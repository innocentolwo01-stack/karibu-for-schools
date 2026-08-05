import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Money, Pill, SuccessArtwork } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

export default function PaymentSuccess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useApp();
  const payment = data.payments.find(item => item.id === id);

  if (!payment) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Payment not found</Text>
          <Button label="Return to payments" onPress={() => router.replace('/parent/payments')} />
        </View>
      </SafeAreaView>
    );
  }

  const successful = payment.status === 'successful';
  const pending = payment.status === 'pending';
  const tone = successful ? 'green' : pending ? 'yellow' : 'red';

  return (
    <SafeAreaView style={[styles.safe, successful ? styles.successBackground : pending ? styles.pendingBackground : styles.failedBackground]}>
      <Image source={require('../../assets/illustrations/confetti.png')} style={styles.confetti} resizeMode="cover" />
      <View style={styles.content}>
        <SuccessArtwork tone={tone} icon={successful ? 'checkmark' : pending ? 'time' : 'close'} />

        <Text style={styles.kicker}>{successful ? 'PAYMENT RECEIVED' : pending ? 'PAYMENT PROCESSING' : 'PAYMENT NOT COMPLETED'}</Text>
        <Text style={styles.title}>{successful ? 'Payment successful' : pending ? 'Payment pending' : 'Payment failed'}</Text>
        <Text style={styles.subtitle}>{successful ? 'Your school balance has been updated.' : pending ? 'We will update you as soon as it is confirmed.' : 'No money was taken. You can retry safely.'}</Text>

        <Card style={styles.receiptCard}>
          <Text style={styles.receiptLabel}>AMOUNT</Text>
          <Money value={payment.amount} style={styles.amount} />
          <View style={styles.divider} />
          <View style={styles.detailRow}><Text style={styles.detailKey}>Payment for</Text><Text style={styles.detailValue}>{payment.title}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailKey}>Method</Text><Text style={styles.detailValue}>{payment.method}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailKey}>Status</Text><Pill label={payment.status.toUpperCase()} tone={tone} /></View>
          <View style={styles.detailRow}><Text style={styles.detailKey}>Reference</Text><Text style={styles.reference}>{payment.id.toUpperCase()}</Text></View>
        </Card>

        <View style={styles.buttons}>
          <Button label="View detailed receipt" icon="receipt-outline" onPress={() => router.replace(`/parent/payment-receipt/${payment.id}` as never)} />
          <Button label="Back to payments" variant="outline" onPress={() => router.replace('/parent/payments')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  successBackground: { backgroundColor: '#F4FBF7' },
  pendingBackground: { backgroundColor: '#FFFAEC' },
  failedBackground: { backgroundColor: '#FFF4F5' },
  confetti: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: 290, opacity: 0.55 },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 45, alignItems: 'center' },
  kicker: { color: colors.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginTop: 15 },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '900', letterSpacing: -1.1, textAlign: 'center', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 300 },
  receiptCard: { width: '100%', marginTop: 28, padding: 20, ...shadows.floating },
  receiptLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  amount: { fontSize: 38, fontWeight: '900', letterSpacing: -1.2, marginTop: 7 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 13 },
  detailKey: { color: colors.muted, fontSize: 12 },
  detailValue: { flex: 1, textAlign: 'right', fontWeight: '800', fontSize: 12 },
  reference: { flex: 1, textAlign: 'right', fontWeight: '800', fontSize: 9, color: colors.muted },
  buttons: { width: '100%', gap: 10, marginTop: 'auto', paddingBottom: 10 },
});
