import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </AppProvider>
  );
}
