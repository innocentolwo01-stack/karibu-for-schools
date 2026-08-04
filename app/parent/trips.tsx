import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Header, Money, Pill, Screen, Section } from '@/components/ui';
import { trips } from '@/data/mock';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function Trips() {
  const { data, selectedChild } = useApp();
  return (
    <Screen>
      <Header title="Trips and events" subtitle={`${selectedChild.name} · Payment and consent`} back onBack={() => router.back()} />
      <Section title="Upcoming" />
      {trips.map(trip => {
        const paid = Boolean(data.paidTrips[trip.id]);
        const storedConsent = data.moduleState[`consent:${trip.id}`];
        const consent = typeof storedConsent === 'boolean' ? storedConsent : data.tripConsent[trip.id];
        return <Card key={trip.id} style={styles.trip}><View style={styles.top}><Pill label={paid ? 'PAID' : 'PAYMENT DUE'} tone={paid ? 'green' : 'red'} /><Pill label={consent === true ? 'CONSENT GIVEN' : consent === false ? 'DECLINED' : 'CONSENT NEEDED'} tone={consent === true ? 'green' : consent === false ? 'red' : 'yellow'} /></View><Text style={styles.title}>{trip.title}</Text><Text style={styles.sub}>{trip.date} · {trip.destination}</Text><Money value={trip.amount} style={styles.amount} /><Text style={styles.link} onPress={() => router.push(`/parent/trip/${trip.id}` as never)}>Open trip details →</Text></Card>;
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  trip: { marginBottom: 10 },
  top: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  title: { fontSize: 19, fontWeight: '900', marginTop: 14 },
  sub: { color: colors.muted, marginTop: 6 },
  amount: { fontSize: 22, fontWeight: '900', marginTop: 14 },
  link: { color: colors.red, fontWeight: '900', marginTop: 14 },
});
