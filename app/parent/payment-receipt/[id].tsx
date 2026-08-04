import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Money, Pill, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function Receipt() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, refundPayment, updatePaymentStatus } = useApp();
  const payment = data.payments.find(item => item.id === id);
  if (!payment) return <Screen><Header title="Receipt" back onBack={() => router.back()} /><Card><Text>Payment not found.</Text></Card></Screen>;
  const tone = payment.status === 'successful' ? 'green' : payment.status === 'pending' ? 'yellow' : payment.status === 'failed' ? 'red' : 'black';
  return (
    <Screen>
      <Header title="Payment receipt" subtitle="Sandbox transaction record" back onBack={() => router.back()} />
      <Card style={styles.receipt}>
        <View style={styles.logo}><Text style={styles.logoText}>K</Text></View>
        <Pill label={payment.status.toUpperCase()} tone={tone} />
        <Text style={styles.title}>{payment.title}</Text>
        <Money value={payment.amount} style={styles.amount} />
        <Text style={styles.ref}>{payment.id.toUpperCase()}</Text>
      </Card>
      <Section title="Transaction details" />
      <Card style={{ paddingVertical: 2 }}>
        <Row title="Payment method" right={<Text style={styles.value}>{payment.method}</Text>} />
        <Row title="Date" right={<Text style={styles.value}>{new Date(payment.createdAt).toLocaleString('en-GB')}</Text>} />
        <Row title="Category" right={<Text style={styles.value}>{payment.category}</Text>} />
        <Row title="Status" right={<Pill label={payment.status.toUpperCase()} tone={tone} />} last />
      </Card>
      <View style={{ marginTop: 18, gap: 9 }}>
        {payment.status === 'pending' ? <Button label="Confirm pending sandbox payment" variant="green" onPress={() => updatePaymentStatus(payment.id, 'successful')} /> : null}
        {payment.status === 'failed' ? <Button label="Retry payment" onPress={() => router.push({ pathname: '/parent/pay', params: { category: payment.category, itemId: payment.relatedId, title: payment.title, amount: String(payment.amount) } })} /> : null}
        {payment.status === 'successful' ? <Button label="Simulate refund" variant="yellow" onPress={() => refundPayment(payment.id)} /> : null}
        <Button label="Share receipt" variant="outline" onPress={() => void Share.share({ message: `${payment.title} — UGX ${payment.amount.toLocaleString('en-GB')} — ${payment.status.toUpperCase()} — ${payment.id.toUpperCase()}` })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  receipt: { alignItems: 'center', paddingVertical: 27 },
  logo: { width: 55, height: 55, borderRadius: 18, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoText: { fontSize: 38, color: colors.red, fontWeight: '900' },
  title: { fontSize: 21, fontWeight: '900', marginTop: 16, textAlign: 'center' },
  amount: { fontSize: 34, fontWeight: '900', marginTop: 10 },
  ref: { color: colors.muted, fontSize: 10, marginTop: 10 },
  value: { color: colors.muted, maxWidth: '52%', textAlign: 'right', fontSize: 12 },
});
