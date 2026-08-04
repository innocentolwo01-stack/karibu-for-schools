import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Header, Money, Pill, Screen, Section, Segmented, StepBar } from '@/components/ui';
import { colors } from '@/constants/theme';
import { PaymentStatus, useApp } from '@/context/AppContext';

const methods = ['MTN Mobile Money', 'Airtel Money', 'Visa or Mastercard', 'Bank transfer'];

export default function Pay() {
  const params = useLocalSearchParams<{ category?: string; itemId?: string; title?: string; amount?: string }>();
  const initialAmount = Number(params.amount || 0);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(String(initialAmount));
  const [method, setMethod] = useState(methods[0]);
  const [phone, setPhone] = useState('+256 700 123 456');
  const [outcome, setOutcome] = useState<PaymentStatus>('successful');
  const [loading, setLoading] = useState(false);
  const { createPayment } = useApp();
  const amountNumber = Number(amount.replace(/[^0-9]/g, ''));

  const submit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    const payment = await createPayment({
      title: params.title ?? 'School payment',
      amount: amountNumber,
      method,
      status: outcome,
      category: (params.category as never) ?? 'fees',
      relatedId: params.itemId,
    });
    router.replace({ pathname: '/parent/payment-success', params: { id: payment.id } });
  };

  return (
    <Screen>
      <Header title={step === 1 ? 'Payment amount' : step === 2 ? 'Payment method' : 'Review payment'} subtitle={params.title ?? 'School payment'} back onBack={() => step > 1 ? setStep(step - 1) : router.back()} />
      <StepBar current={step} total={3} />
      {step === 1 ? (
        <>
          <Card style={styles.summary}><Text style={styles.label}>Amount due</Text><Money value={initialAmount} style={styles.amount} /><Text style={styles.demo}>Sandbox payment · no real money will be taken.</Text></Card>
          <Section title="Amount to pay" />
          <Field label="UGX amount" value={amount} onChangeText={value => setAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
          <View style={styles.quick}>{[100000, 250000, 500000, initialAmount].filter((item, index, arr) => item > 0 && arr.indexOf(item) === index).map(item => <Pressable key={item} onPress={() => setAmount(String(item))} style={[styles.quickChip, amountNumber === item && styles.selected]}><Text style={{ fontWeight: '900' }}>UGX {item.toLocaleString('en-GB')}</Text></Pressable>)}</View>
        </>
      ) : null}
      {step === 2 ? (
        <>
          <Section title="Choose payment method" />
          {methods.map(item => <Pressable key={item} onPress={() => setMethod(item)}><Card style={[styles.method, method === item && styles.selected]}><View style={{ flex: 1 }}><Text style={styles.methodText}>{item}</Text><Text style={styles.methodSub}>{item.includes('Money') ? 'Confirmation prompt sent to the test phone number' : item.includes('Visa') ? 'Secure sandbox card checkout' : 'Bank reference generated instantly'}</Text></View><View style={[styles.radio, method === item && styles.radioOn]} /></Card></Pressable>)}
          {method.includes('Money') ? <Field label="Mobile money number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /> : null}
          <Section title="Test outcome" />
          <Segmented value={outcome} onChange={setOutcome} options={[{ value: 'successful', label: 'Success' }, { value: 'pending', label: 'Pending' }, { value: 'failed', label: 'Failed' }]} />
        </>
      ) : null}
      {step === 3 ? (
        <>
          <Card style={styles.summary}>
            <Pill label={outcome.toUpperCase()} tone={outcome === 'successful' ? 'green' : outcome === 'pending' ? 'yellow' : 'red'} />
            <Text style={styles.reviewTitle}>{params.title ?? 'School payment'}</Text>
            <Money value={amountNumber} style={styles.reviewAmount} />
            <Text style={styles.reviewLine}>{method}</Text>
            {method.includes('Money') ? <Text style={styles.reviewLine}>{phone}</Text> : null}
          </Card>
          <Section title="What happens next" />
          <Card><Text style={{ lineHeight: 21, color: colors.muted }}>{outcome === 'successful' ? 'The payment will be posted to the sandbox ledger, a receipt generated and the relevant balance updated.' : outcome === 'pending' ? 'The payment will remain pending and can be opened from payment history.' : 'The payment will be recorded as failed and can be retried from the receipt screen.'}</Text></Card>
        </>
      ) : null}
      <View style={{ marginTop: 24 }}><Button label={step === 3 ? `Pay UGX ${amountNumber.toLocaleString('en-GB')}` : 'Continue'} disabled={!amountNumber || (method.includes('Money') && step === 2 && !phone.trim())} loading={loading} onPress={() => step < 3 ? setStep(step + 1) : void submit()} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: colors.black, borderColor: colors.black },
  label: { color: '#CFCFD2' },
  amount: { color: colors.white, fontSize: 38, fontWeight: '900', marginTop: 8 },
  demo: { color: colors.yellow, fontWeight: '800', marginTop: 14 },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { minHeight: 46, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  method: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  selected: { borderColor: colors.red, borderWidth: 2, backgroundColor: colors.paleRed },
  methodText: { fontWeight: '900' },
  methodSub: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#B5B5BA' },
  radioOn: { backgroundColor: colors.red, borderColor: colors.red },
  reviewTitle: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 15 },
  reviewAmount: { color: colors.yellow, fontSize: 36, fontWeight: '900', marginTop: 10 },
  reviewLine: { color: '#CFCFD2', marginTop: 8 },
});
