import { Notification } from '../../types/notifications';
import NotificationCard from './NotificationCard';
import EmptyState from './EmptyState';
import { isToday, isYesterday, isThisWeek } from 'date-fns';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
  onView: (id: string) => void;
}

export default function NotificationList({
  notifications,
  onMarkRead,
  onMarkUnread,
  onDismiss,
  onSnooze,
  onView,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return <EmptyState />;
  }

  const groupedNotifications = notifications.reduce((acc, notification) => {
    let group: string;

    if (isToday(notification.timestamp)) {
      group = 'Today';
    } else if (isYesterday(notification.timestamp)) {
      group = 'Yesterday';
    } else if (isThisWeek(notification.timestamp)) {
      group = 'This Week';
    } else {
      group = 'Older';
    }

    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older'];

  return (
    <div className="space-y-6">
      {groupOrder.map((group) => {
        const groupNotifications = groupedNotifications[group];
        if (!groupNotifications || groupNotifications.length === 0) return null;

        return (
          <div key={group}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-bold text-white uppercase">{group}</h2>
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-xs text-slate-500">{groupNotifications.length} notifications</span>
            </div>

            <div className="space-y-3">
              {groupNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onMarkUnread={onMarkUnread}
                  onDismiss={onDismiss}
                  onSnooze={onSnooze}
                  onView={onView}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
