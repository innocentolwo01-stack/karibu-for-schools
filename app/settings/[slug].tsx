import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Switch, Text } from 'react-native';
import { Button, Card, Field, Header, Row, Screen, Section } from '@/components/ui';
import { colors } from '@/constants/theme';

const titles: Record<string, string> = {
  profile: 'Personal details', notifications: 'Notification settings', security: 'Security and password', accessibility: 'Accessibility and data mode', support: 'Help and support', about: 'About Karibu For Schools',
};

export default function SettingPage() {
  const { slug = 'profile' } = useLocalSearchParams<{ slug: string }>();
  const [name, setName] = useState('Innocent Olwo');
  const [phone, setPhone] = useState('+256 700 123 456');
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const title = titles[slug] ?? 'Settings';
  return (
    <Screen>
      <Header title={title} subtitle="Saved locally in this test build" back onBack={() => router.back()} />
      {saved ? <Card style={{ backgroundColor: colors.paleGreen, marginBottom: 12 }}><Text style={{ color: colors.green, fontWeight: '900' }}>✓ Settings saved</Text></Card> : null}
      {slug === 'profile' ? <><Field label="Full name" value={name} onChangeText={setName} /><Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></> : null}
      {slug === 'about' ? <Card><Text style={{ fontSize: 24, fontWeight: '900' }}>Karibu For Schools</Text><Text style={{ color: colors.muted, lineHeight: 21, marginTop: 8 }}>Version 0.3.0 · Complete interactive school platform test build.</Text></Card> : null}
      {slug === 'support' ? <><Card style={{ paddingVertical: 2 }}><Row icon="chatbubble-outline" title="Start support conversation" subtitle="Creates a local test support case" onPress={() => setSaved(true)} /><Row icon="mail-outline" title="Email school support" subtitle="support@greenhill.demo" onPress={() => setSaved(true)} last /></Card></> : null}
      {!['profile', 'about', 'support'].includes(slug) ? <Card><Row title="Enable this setting" subtitle="Toggle is persisted for the current screen session" right={<Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: colors.green }} />} last /></Card> : null}
      {slug !== 'about' ? <><Section title="Save changes" /><Button label="Save settings" onPress={() => setSaved(true)} /></> : null}
    </Screen>
  );
}
