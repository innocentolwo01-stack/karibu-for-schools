import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function StudentTabs() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.red,
      tabBarInactiveTintColor: colors.muted,
      tabBarHideOnKeyboard: true,
      tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 10, borderTopColor: colors.border, backgroundColor: colors.white },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Today', tabBarIcon: icon('sunny-outline') }} />
      <Tabs.Screen name="learning" options={{ title: 'Learning', tabBarIcon: icon('library-outline') }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: icon('qr-code-outline') }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="results" options={{ title: 'Results', tabBarIcon: icon('stats-chart-outline') }} />
    </Tabs>
  );
}
