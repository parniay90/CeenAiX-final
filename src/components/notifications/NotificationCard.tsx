import { Calendar, FlaskRound as Flask, Pill, MessageSquare, Settings, Bot, AlertTriangle, Clock, Bell, Eye, X, MailOpen } from 'lucide-react';
import { Notification, NotificationType } from '../../types/notifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
  onView: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onMarkUnread,
  onDismiss,
  onSnooze,
  onView,
}: NotificationCardProps) {
  const getIcon = (type: NotificationType) => {
    const iconMap: Record<string, { icon: any; color: string }> = {
      'appointment-reminder': { icon: Calendar, color: 'text-blue-400' },
      'appointment-start': { icon: Calendar, color: 'text-blue-400' },
      'lab-result-ready': { icon: Flask, color: 'text-green-400' },
      'critical-lab-value': { icon: Flask, color: 'text-rose-400' },
      'critical-result-notification': { icon: Flask, color: 'text-rose-400' },
      'medication-refill': { icon: Pill, color: 'text-purple-400' },
      'prescription-ready': { icon: Pill, color: 'text-purple-400' },
      'new-prescription-received': { icon: Pill, color: 'text-purple-400' },
      'prescription-interaction': { icon: AlertTriangle, color: 'text-amber-400' },
      'interaction-alert': { icon: AlertTriangle, color: 'text-amber-400' },
      'ai-health-alert': { icon: Bot, color: 'text-violet-400' },
      'ai-clinical-insight': { icon: Bot, color: 'text-violet-400' },
      'doctor-message': { icon: MessageSquare, color: 'text-cyan-400' },
      'patient-message': { icon: MessageSquare, color: 'text-cyan-400' },
      'compliance-alert': { icon: AlertTriangle, color: 'text-amber-400' },
      'system-health-event': { icon: Settings, color: 'text-slate-400' },
      'stock-low': { icon: AlertTriangle, color: 'text-amber-400' },
      'insurance-preauth-response': { icon: Bell, color: 'text-teal-400' },
      'new-test-order': { icon: Flask, color: 'text-blue-400' },
      'qc-failure': { icon: AlertTriangle, color: 'text-rose-400' },
      'nabidh-submission': { icon: Settings, color: 'text-amber-400' },
      'new-org-registration': { icon: Settings, color: 'text-blue-400' },
      'dha-notification': { icon: AlertTriangle, color: 'text-amber-400' },
      'referral-received': { icon: MessageSquare, color: 'text-cyan-400' },
    };

    return iconMap[type] || { icon: Bell, color: 'text-slate-400' };
  };

  const { icon: IconComponent, color } = getIcon(notification.type);

  const getPriorityBadge = () => {
    if (notification.priority === 'high') {
      return (
        <span className="px-2 py-0.5 bg-rose-600 bg-opacity-20 border border-rose-600 text-rose-400 text-xs font-bold rounded">
          High Priority
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-slate-800 rounded-lg p-4 transition-all hover:bg-slate-700 ${
        !notification.isRead ? 'border-l-4 border-teal-500' : 'border-l-4 border-transparent'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-sm ${!notification.isRead ? 'font-bold text-white' : 'font-bold text-slate-300'}`}>
              {notification.title}
            </h3>
            <div className="flex items-center gap-2">
              {getPriorityBadge()}
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>

          <p className={`text-sm mb-2 line-clamp-2 ${!notification.isRead ? 'text-slate-300' : 'text-slate-400'}`}>
            {notification.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">from</span>
              <span className="text-xs font-bold text-teal-400">{notification.source}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onView(notification.id)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded transition-colors"
              >
                View
              </button>
              {!notification.isRead ? (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                  title="Mark as read"
                >
                  <MailOpen className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => onMarkUnread(notification.id)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                  title="Mark as unread"
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                </button>
              )}
              <button
                onClick={() => onSnooze(notification.id)}
                className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                title="Snooze 1hr"
              >
                <Clock className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onDismiss(notification.id)}
                className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
