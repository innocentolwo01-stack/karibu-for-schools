import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, IconButton, Money, Pill, Progress, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const toneFor = (status: string) => status === 'successful' ? 'green' : status === 'pending' ? 'yellow' : status === 'failed' ? 'red' : 'black';

export default function PaymentsPage() {
  const { data, selectedChild } = useApp();
  return (
    <Screen>
      <Header title="Payments" subtitle={`${selectedChild.name} · Family account`} right={<IconButton icon="receipt-outline" onPress={() => router.push('/parent/fees')} />} />
      <Card style={styles.balance}>
        <Text style={styles.balanceLabel}>Outstanding school balance</Text>
        <Money value={data.feeBalance} style={styles.balanceValue} />
        <Text style={styles.balanceHelper}>UGX 750,000 paid of UGX 2,000,000</Text>
        <View style={{ marginTop: 16 }}><Progress value={37.5} tone="green" /></View>
        <View style={{ marginTop: 18 }}><Button label="Pay school fees" variant="yellow" onPress={() => router.push({ pathname: '/parent/pay', params: { category: 'fees', title: 'Term 2 school fees', amount: String(Math.min(500000, data.feeBalance)) } })} /></View>
      </Card>
      <Section title="Quick payments" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="school-outline" title="School fee statement" subtitle="Charges, discounts, credits and instalments" onPress={() => router.push('/parent/fees')} />
        <Row icon="bus-outline" title="Trips and events" subtitle="Payment and digital consent" onPress={() => router.push('/parent/trips')} />
        <Row icon="restaurant-outline" title="Cafeteria top-up" subtitle={`Balance UGX ${Number(data.moduleState.cafeteriaBalance ?? 0).toLocaleString('en-GB')}`} onPress={() => router.push('/modules/cafeteria')} />
        <Row icon="bag-handle-outline" title="School shop" subtitle="Uniform, books and stationery" onPress={() => router.push('/modules/shop')} />
        <Row icon="heart-outline" title="Fundraising and donations" onPress={() => router.push('/modules/fundraising')} last />
      </Card>
      <Section title="Payment history" />
      {data.payments.map(payment => (
        <Card key={payment.id} style={styles.payment}>
          <View style={{ flex: 1 }}><Text style={styles.paymentTitle}>{payment.title}</Text><Text style={styles.paymentSub}>{payment.method} · {new Date(payment.createdAt).toLocaleDateString('en-GB')}</Text></View>
          <View style={{ alignItems: 'flex-end', gap: 7 }}><Money value={payment.amount} style={{ fontWeight: '900' }} /><Pill label={payment.status.toUpperCase()} tone={toneFor(payment.status) as never} /></View>
          <Text style={styles.open} onPress={() => router.push(`/parent/payment-receipt/${payment.id}` as never)}>View receipt →</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  balance: { backgroundColor: colors.black, borderColor: colors.black },
  balanceLabel: { color: '#CFCFD2' },
  balanceValue: { color: colors.white, fontSize: 38, fontWeight: '900', marginTop: 8 },
  balanceHelper: { color: '#CFCFD2', marginTop: 7 },
  payment: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 9 },
  paymentTitle: { fontWeight: '900' },
  paymentSub: { color: colors.muted, marginTop: 5, fontSize: 12 },
  open: { width: '100%', color: colors.red, fontWeight: '900', marginTop: 4 },
});
