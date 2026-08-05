import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, shadows } from '@/constants/theme';

const icon =
  (inactive: keyof typeof Ionicons.glyphMap, active: keyof typeof Ionicons.glyphMap) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} color={color} size={focused ? size + 1 : size} />
  );

export default function StudentTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 12,
          height: 72,
          paddingTop: 8,
          paddingBottom: 9,
          borderTopWidth: 0,
          borderRadius: 24,
          backgroundColor: colors.glass,
          ...shadows.floating,
        },
        tabBarItemStyle: { borderRadius: 18 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginTop: 2 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Today', tabBarIcon: icon('sunny-outline', 'sunny') }} />
      <Tabs.Screen name="learning" options={{ title: 'Learning', tabBarIcon: icon('library-outline', 'library') }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: icon('qr-code-outline', 'qr-code') }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: icon('calendar-outline', 'calendar') }} />
      <Tabs.Screen name="results" options={{ title: 'Results', tabBarIcon: icon('stats-chart-outline', 'stats-chart') }} />
    </Tabs>
  );
}
