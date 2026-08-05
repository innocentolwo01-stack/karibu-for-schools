import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, shadows } from '@/constants/theme';

const icon =
  (inactive: keyof typeof Ionicons.glyphMap, active: keyof typeof Ionicons.glyphMap) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} color={color} size={focused ? size + 1 : size} />
  );

export default function ParentTabs() {
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
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="children" options={{ title: 'Children', tabBarIcon: icon('people-outline', 'people') }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments', tabBarIcon: icon('card-outline', 'card') }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: icon('calendar-outline', 'calendar') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: icon('chatbubbles-outline', 'chatbubbles') }} />
    </Tabs>
  );
}
