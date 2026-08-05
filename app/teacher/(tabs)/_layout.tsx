import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, shadows } from '@/constants/theme';

const icon =
  (inactive: keyof typeof Ionicons.glyphMap, active: keyof typeof Ionicons.glyphMap) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} color={color} size={focused ? size + 1 : size} />
  );

export default function TeacherTabs() {
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
      <Tabs.Screen name="classes" options={{ title: 'Classes', tabBarIcon: icon('people-outline', 'people') }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance', tabBarIcon: icon('checkmark-circle-outline', 'checkmark-circle') }} />
      <Tabs.Screen name="markbook" options={{ title: 'Markbook', tabBarIcon: icon('grid-outline', 'grid') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: icon('chatbubbles-outline', 'chatbubbles') }} />
    </Tabs>
  );
}
