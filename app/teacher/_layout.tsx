import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function RoleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
