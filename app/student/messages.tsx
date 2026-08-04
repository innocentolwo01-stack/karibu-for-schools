import { router } from 'expo-router';
import { Header, IconButton, Screen } from '@/components/ui';
import { NotificationList } from '@/components/NotificationList';
import { useApp } from '@/context/AppContext';

export default function StudentMessages() {
  const { unreadCount } = useApp();
  return <Screen><Header title="Notifications" subtitle={`${unreadCount} unread updates`} back onBack={() => router.back()} right={<IconButton icon="create-outline" onPress={() => router.push('/messages/compose')} />} /><NotificationList role="student" /></Screen>;
}
