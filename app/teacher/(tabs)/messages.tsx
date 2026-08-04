import { router } from 'expo-router';
import { Header, IconButton, Screen } from '@/components/ui';
import { NotificationList } from '@/components/NotificationList';
import { useApp } from '@/context/AppContext';

export default function TeacherMessages() {
  const { unreadCount } = useApp();
  return <Screen><Header title="Messages" subtitle={`${unreadCount} unread staff and parent updates`} right={<IconButton icon="create-outline" onPress={() => router.push('/messages/compose')} />} /><NotificationList role="teacher" /></Screen>;
}
