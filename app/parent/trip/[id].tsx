import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Header, Money, Pill, Row, Screen, Section } from '@/components/ui';
import { trips } from '@/data/mock';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, setModuleValue } = useApp();
  const trip = trips.find(item => item.id === id) ?? trips[0];
  const paid = Boolean(data.paidTrips[trip.id]);
  const consent = data.tripConsent[trip.id];
  const setConsent = (value: boolean) => {
    // Consent is stored with module state to keep the workflow persistent in the demo.
    setModuleValue(`consent:${trip.id}`, value);
  };
  const storedConsent = data.moduleState[`consent:${trip.id}`];
  const effectiveConsent = typeof storedConsent === 'boolean' ? storedConsent : consent;
  return (
    <Screen>
      <Header title={trip.title} subtitle={trip.date} back onBack={() => router.back()} />
      <Card style={styles.hero}><View style={styles.pills}><Pill label={paid ? 'PAID' : 'PAYMENT DUE'} tone={paid ? 'green' : 'red'} /><Pill label={effectiveConsent === true ? 'CONSENT GIVEN' : effectiveConsent === false ? 'DECLINED' : 'CONSENT NEEDED'} tone={effectiveConsent === true ? 'green' : effectiveConsent === false ? 'red' : 'yellow'} /></View><Text style={styles.destination}>{trip.destination}</Text><Money value={trip.amount} style={styles.amount} /></Card>
      <Section title="Trip information" />
      <Card style={{ paddingVertical: 2 }}>
        <Row icon="time-outline" title="Departure" subtitle={trip.departure} />
        <Row icon="return-down-back-outline" title="Expected return" subtitle={trip.returnTime} />
        <Row icon="person-outline" title="Lead teacher" subtitle={trip.teacher} />
        <Row icon="location-outline" title="Destination" subtitle={trip.destination} last />
      </Card>
      <Section title="About this trip" />
      <Card><Text style={styles.body}>{trip.description}</Text></Card>
      <Section title="Parent consent" />
      <View style={{ gap: 9 }}>
        <Button label="Give consent" variant={effectiveConsent === true ? 'green' : 'outline'} onPress={() => setConsent(true)} />
        <Button label="Decline consent" variant={effectiveConsent === false ? 'red' : 'outline'} onPress={() => setConsent(false)} />
      </View>
      {!paid ? <View style={{ marginTop: 18 }}><Button label={`Pay UGX ${trip.amount.toLocaleString('en-GB')}`} onPress={() => router.push({ pathname: '/parent/pay', params: { category: 'trip', itemId: trip.id, title: trip.title, amount: String(trip.amount) } })} /></View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.black, borderColor: colors.black },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  destination: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 17 },
  amount: { color: colors.yellow, fontSize: 31, fontWeight: '900', marginTop: 10 },
  body: { color: colors.muted, lineHeight: 22 },
});
