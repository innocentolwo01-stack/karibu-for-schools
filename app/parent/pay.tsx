import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Field,
  Header,
  Money,
  Pill,
  Screen,
  Section,
  Segmented,
  StepBar,
} from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import { PaymentStatus, useApp } from '@/context/AppContext';

const methods = [
  { id: 'MTN Mobile Money', title: 'MTN Mobile Money', subtitle: 'Approve securely from your phone', icon: 'phone-portrait-outline' as const, badge: 'MTN' },
  { id: 'Airtel Money', title: 'Airtel Money', subtitle: 'Instant mobile money confirmation', icon: 'phone-portrait-outline' as const, badge: 'AIRTEL' },
  { id: 'Visa or Mastercard', title: 'Card payment', subtitle: 'Visa, Mastercard or supported wallet', icon: 'card-outline' as const, badge: 'CARD' },
  { id: 'Bank transfer', title: 'Bank transfer', subtitle: 'Generate a reference and instructions', icon: 'business-outline' as const, badge: 'BANK' },
];

export default function Pay() {
  const params = useLocalSearchParams<{ category?: string; itemId?: string; title?: string; amount?: string }>();
  const initialAmount = Number(params.amount || 0);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(String(initialAmount));
  const [method, setMethod] = useState(methods[0].id);
  const [phone, setPhone] = useState('+256 700 123 456');
  const [outcome, setOutcome] = useState<PaymentStatus>('successful');
  const [loading, setLoading] = useState(false);
  const { createPayment, selectedChild } = useApp();
  const amountNumber = Number(amount.replace(/[^0-9]/g, ''));
  const selectedMethod = methods.find(item => item.id === method) ?? methods[0];

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
    <Screen background="warm">
      <Header
        title={step === 1 ? 'Choose amount' : step === 2 ? 'Payment method' : 'Review payment'}
        subtitle={`${params.title ?? 'School payment'} · ${selectedChild.name}`}
        back
        onBack={() => step > 1 ? setStep(step - 1) : router.back()}
      />
      <StepBar current={step} total={3} />

      <Card style={styles.schoolCard}>
        <View style={styles.schoolBadge}><Text style={styles.schoolBadgeText}>G</Text></View>
        <View style={styles.flex}>
          <Text style={styles.schoolName}>Greenhill Academy</Text>
          <Text style={styles.schoolMeta}>{selectedChild.className} {selectedChild.stream} · {selectedChild.term}</Text>
        </View>
        <View style={styles.secure}><Ionicons name="shield-checkmark" size={18} color={colors.green} /></View>
      </Card>

      {step === 1 ? (
        <>
          <Card style={styles.amountCard}>
            <Text style={styles.amountLabel}>AMOUNT DUE</Text>
            <Money value={initialAmount} style={styles.amountDue} />
            <Text style={styles.sandbox}>Secure sandbox payment · no real money will be taken.</Text>
          </Card>

          <Section title="How much would you like to pay?" />
          <Field label="Amount in UGX" value={amount} onChangeText={value => setAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />

          <View style={styles.quickAmounts}>
            {[100000, 250000, 500000, initialAmount]
              .filter((item, index, array) => item > 0 && array.indexOf(item) === index)
              .map(item => (
                <Pressable
                  key={item}
                  onPress={() => setAmount(String(item))}
                  style={({ pressed }) => [styles.amountChip, amountNumber === item && styles.amountChipActive, pressed && { opacity: 0.7 }]}
                >
                  <Text style={[styles.amountChipText, amountNumber === item && { color: colors.red }]}>
                    UGX {item.toLocaleString('en-GB')}
                  </Text>
                </Pressable>
              ))}
          </View>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Section title="Select a payment method" />
          {methods.map(item => {
            const active = method === item.id;
            return (
              <Pressable key={item.id} onPress={() => setMethod(item.id)} style={({ pressed }) => [pressed && { opacity: 0.72 }]}>
                <Card style={[styles.methodCard, active && styles.methodCardActive]}>
                  <View style={[styles.methodIcon, active && styles.methodIconActive]}>
                    <Ionicons name={item.icon} size={23} color={active ? colors.white : colors.black} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.methodTitle}>{item.title}</Text>
                    <Text style={styles.methodSub}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.methodBadge}><Text style={styles.methodBadgeText}>{item.badge}</Text></View>
                  <View style={[styles.radio, active && styles.radioActive]}>{active ? <View style={styles.radioInner} /> : null}</View>
                </Card>
              </Pressable>
            );
          })}

          {method.includes('Money') ? (
            <View style={{ marginTop: 14 }}>
              <Field label="Mobile money number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>
          ) : null}

          <Section title="Test payment outcome" />
          <Segmented
            value={outcome}
            onChange={setOutcome}
            options={[
              { value: 'successful', label: 'Success' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Card style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Pill label={outcome.toUpperCase()} tone={outcome === 'successful' ? 'green' : outcome === 'pending' ? 'yellow' : 'red'} />
              <Ionicons name="shield-checkmark" size={24} color={colors.yellow} />
            </View>
            <Text style={styles.reviewTitle}>{params.title ?? 'School payment'}</Text>
            <Money value={amountNumber} style={styles.reviewAmount} />
            <View style={styles.reviewDivider} />
            <View style={styles.reviewLine}><Text style={styles.reviewKey}>Student</Text><Text style={styles.reviewValue}>{selectedChild.name}</Text></View>
            <View style={styles.reviewLine}><Text style={styles.reviewKey}>Method</Text><Text style={styles.reviewValue}>{selectedMethod.title}</Text></View>
            {method.includes('Money') ? <View style={styles.reviewLine}><Text style={styles.reviewKey}>Phone</Text><Text style={styles.reviewValue}>{phone}</Text></View> : null}
          </Card>

          <Section title="What happens next" />
          <Card style={styles.infoCard}>
            <View style={styles.infoIcon}><Ionicons name="sparkles" size={21} color={colors.amber} /></View>
            <Text style={styles.infoText}>
              {outcome === 'successful'
                ? 'The payment posts to the school ledger, updates the balance and creates a detailed receipt.'
                : outcome === 'pending'
                  ? 'The payment stays pending and can be tracked from payment history until confirmed.'
                  : 'The payment is recorded as failed and can be retried safely from its receipt screen.'}
            </Text>
          </Card>
        </>
      ) : null}

      <View style={styles.footer}>
        <Button
          label={step === 3 ? `Pay UGX ${amountNumber.toLocaleString('en-GB')}` : 'Continue'}
          icon={step === 3 ? 'lock-closed' : 'arrow-forward'}
          disabled={!amountNumber || (method.includes('Money') && step === 2 && !phone.trim())}
          loading={loading}
          onPress={() => step < 3 ? setStep(step + 1) : void submit()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  schoolCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  schoolBadge: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  schoolBadgeText: { color: colors.yellow, fontSize: 23, fontWeight: '900' },
  schoolName: { fontWeight: '900', fontSize: 15 },
  schoolMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  secure: { width: 36, height: 36, borderRadius: 13, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center' },
  amountCard: { backgroundColor: colors.black, marginTop: 12, padding: 20, ...shadows.floating },
  amountLabel: { color: '#C7C7CC', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  amountDue: { color: colors.white, fontSize: 40, fontWeight: '900', letterSpacing: -1.4, marginTop: 8 },
  sandbox: { color: colors.yellow, fontSize: 11, fontWeight: '800', marginTop: 12 },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amountChip: { minHeight: 46, paddingHorizontal: 13, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  amountChipActive: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  amountChipText: { fontWeight: '900', fontSize: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9, padding: 14 },
  methodCardActive: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  methodIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  methodIconActive: { backgroundColor: colors.red },
  methodTitle: { fontWeight: '900', fontSize: 14 },
  methodSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  methodBadge: { backgroundColor: '#F0F0F3', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 5 },
  methodBadgeText: { fontSize: 8, fontWeight: '900', color: colors.muted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.red },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.red },
  reviewCard: { backgroundColor: colors.black, padding: 20, marginTop: 12 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 18 },
  reviewAmount: { color: colors.yellow, fontSize: 40, fontWeight: '900', letterSpacing: -1.3, marginTop: 9 },
  reviewDivider: { height: 1, backgroundColor: '#343438', marginVertical: 18 },
  reviewLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 10 },
  reviewKey: { color: '#B9B9BF', fontSize: 12 },
  reviewValue: { color: colors.white, fontSize: 12, fontWeight: '800', textAlign: 'right', flex: 1 },
  infoCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  infoIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, color: colors.muted, lineHeight: 20, fontSize: 12 },
  footer: { marginTop: 26 },
});
