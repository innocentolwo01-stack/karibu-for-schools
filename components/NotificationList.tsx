import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Card, EmptyState, Pill, Row, Section } from '@/components/ui';
import { AppNotification, Role, useApp } from '@/context/AppContext';

function NotificationRow({ item }: { item: AppNotification }) {
  const { markNotificationRead } = useApp();
  return (
    <Row
      icon={item.read ? 'notifications-outline' : 'notifications'}
      title={item.title}
      subtitle={item.body}
      right={<View style={{ alignItems: 'flex-end', gap: 5 }}><Pill label={item.read ? 'READ' : 'NEW'} tone={item.read ? 'black' : 'red'} /><Text style={{ fontSize: 10, color: '#777' }}>Open</Text></View>}
      onPress={() => {
        markNotificationRead(item.id);
        router.push(item.route as never);
      }}
    />
  );
}

export function NotificationList({ role }: { role: Role }) {
  const { data, markAllNotificationsRead } = useApp();
  const notifications = data.notifications.filter(item => item.role === role || item.role === 'all');
  if (!notifications.length) return <EmptyState icon="notifications-off-outline" title="No notifications" body="School updates and confirmations will appear here." />;
  return (
    <>
      <Section title="Inbox" action="Mark all read" onAction={markAllNotificationsRead} />
      <Card style={{ paddingVertical: 2 }}>
        {notifications.map((item, index) => <NotificationRow key={item.id} item={item} />)}
      </Card>
    </>
  );
}
