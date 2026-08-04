import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function ParentTabs() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.red,
      tabBarInactiveTintColor: colors.muted,
      tabBarHideOnKeyboard: true,
      tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 10, borderTopColor: colors.border, backgroundColor: colors.white },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="children" options={{ title: 'Children', tabBarIcon: icon('people-outline') }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments', tabBarIcon: icon('card-outline') }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: icon('chatbubbles-outline') }} />
    </Tabs>
  );
}
