import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Header, Pill, Screen, Section, Segmented } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ComposeMessage() {
  const { session, addNotification } = useApp();
  const [recipient, setRecipient] = useState(session?.role === 'teacher' ? 'Parent of Amani Olwo' : 'Mrs Nakato · Biology');
  const [subject, setSubject] = useState('Student progress');
  const [body, setBody] = useState('Hello, I would like to discuss Amani’s recent progress and the next steps we can take together.');
  const [priority, setPriority] = useState<'normal' | 'important'>('normal');
  const [sent, setSent] = useState(false);

  const send = () => {
    const target = session?.role === 'teacher' ? 'parent' : 'teacher';
    addNotification({
      role: target,
      title: `${priority === 'important' ? 'Important: ' : ''}${subject}`,
      body: `${session?.name ?? 'Karibu user'}: ${body}`,
      route: target === 'parent' ? '/parent/messages' : '/teacher/messages',
    });
    setSent(true);
  };

  return (
    <Screen>
      <Header title="New message" subtitle="Secure school communication" back onBack={() => router.back()} />
      {sent ? (
        <Card style={styles.confirm}>
          <Pill label="MESSAGE SENT" tone="green" />
          <Text style={styles.confirmTitle}>{subject}</Text>
          <Text style={styles.confirmBody}>Sent to {recipient}. A notification has been created for the receiving role.</Text>
          <View style={{ marginTop: 18, width: '100%' }}><Button label="Return to messages" onPress={() => router.back()} /></View>
        </Card>
      ) : (
        <>
          <Field label="Recipient" value={recipient} onChangeText={setRecipient} />
          <Field label="Subject" value={subject} onChangeText={setSubject} />
          <Field label="Message" value={body} onChangeText={setBody} multiline />
          <Section title="Priority" />
          <Segmented value={priority} onChange={setPriority} options={[{ value: 'normal', label: 'Normal' }, { value: 'important', label: 'Important' }]} />
          <Card style={{ marginTop: 14 }}><Text style={styles.guidance}>Messages are stored in the test communication record. Safeguarding or emergency concerns should use the school’s dedicated reporting route.</Text></Card>
          <View style={{ marginTop: 18 }}><Button label="Send message" disabled={!recipient.trim() || !subject.trim() || !body.trim()} onPress={send} /></View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  confirm: { alignItems: 'center', padding: 25 },
  confirmTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: 18 },
  confirmBody: { color: colors.muted, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  guidance: { color: colors.muted, lineHeight: 20 },
});
