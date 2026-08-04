import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Money, Pill, Progress, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';
import { feeItems } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function Fees() {
  const { data, selectedChild } = useApp();
  const totalCharges = feeItems.reduce((sum, item) => sum + item.amount, 0);
  return (
    <Screen>
      <Header title="School fee statement" subtitle={`${selectedChild.name} · Term 2, 2026`} back onBack={() => router.back()} />
      <Card style={styles.balance}><Text style={styles.label}>Outstanding balance</Text><Money value={data.feeBalance} style={styles.amount} /><Text style={styles.helper}>Charges, payments, discounts and credits are shown below.</Text><View style={{ marginTop: 17 }}><Progress value={37.5} tone="green" /></View><View style={{ marginTop: 18 }}><Button label="Pay school fees" variant="yellow" onPress={() => router.push({ pathname: '/parent/pay', params: { category: 'fees', title: 'Term 2 school fees', amount: String(Math.min(500000, data.feeBalance)) } })} /></View></Card>
      <Section title="Ledger summary" />
      <Card style={styles.summaryRow}><View><Text style={styles.muted}>Total charges</Text><Money value={totalCharges} style={styles.value} /></View><View><Text style={styles.muted}>Payments and credits</Text><Money value={750000} style={styles.value} /></View></Card>
      <Section title="Charge breakdown" />
      {feeItems.map(item => <Card key={item.id} style={styles.item}><View style={{ flex: 1 }}><Text style={styles.title}>{item.title}</Text><Pill label={item.compulsory ? 'COMPULSORY' : 'OPTIONAL'} tone={item.compulsory ? 'black' : 'yellow'} /></View><View style={{ alignItems: 'flex-end' }}><Money value={item.amount} style={styles.money} /><Text style={styles.muted}>Paid UGX {item.paid.toLocaleString('en-GB')}</Text></View></Card>)}
      <Section title="Adjustments" />
      <Card style={{ gap: 10 }}><View style={styles.adjust}><Text style={styles.title}>Sibling discount</Text><Text style={styles.credit}>- UGX 50,000</Text></View><View style={styles.adjust}><Text style={styles.title}>Opening balance</Text><Text style={styles.money}>UGX 0</Text></View></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  balance: { backgroundColor: colors.black, borderColor: colors.black }, label: { color: '#CFCFD2' }, amount: { color: colors.white, fontSize: 38, fontWeight: '900', marginTop: 9 }, helper: { color: '#CFCFD2', marginTop: 7 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' }, muted: { color: colors.muted, fontSize: 11, marginTop: 5 }, value: { fontWeight: '900', marginTop: 6 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 9, gap: 12 }, title: { fontWeight: '900', fontSize: 15, marginBottom: 8 }, money: { fontWeight: '900' }, adjust: { flexDirection: 'row', justifyContent: 'space-between' }, credit: { color: colors.green, fontWeight: '900' },
});
