import { useState } from 'react';
import { Bell, CheckCheck, Settings, Filter } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import CategorySidebar from '../components/notifications/CategorySidebar';
import NotificationList from '../components/notifications/NotificationList';
import NotificationSettingsDrawer from '../components/notifications/NotificationSettingsDrawer';
import { MOCK_NOTIFICATIONS, NotificationCategory, Notification } from '../types/notifications';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const handleMarkRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: false } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSnooze = (id: string) => {
    console.log('Snoozing notification:', id);
  };

  const handleView = (id: string) => {
    handleMarkRead(id);
    console.log('Viewing notification:', id);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (activeCategory === 'all') return true;
      return n.category === activeCategory;
    })
    .filter(n => {
      if (showUnreadOnly) return !n.isRead;
      return true;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <PatientSidebar currentPage="notifications" />

      <div className="flex-1 ml-64 flex flex-col">
        <PatientTopNav patientName="Ahmed Al Maktoum" />

        <div className="flex flex-1 overflow-hidden">
          <CategorySidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            notifications={notifications}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Notifications Center</h1>
                    <div className="text-sm text-slate-500">
                      {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 px-6 py-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      unreadCount > 0
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark All Read
                  </button>

                  <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      showUnreadOnly
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-slate-600'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {showUnreadOnly ? 'Show All' : 'Unread Only'}
                  </button>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <NotificationList
                notifications={filteredNotifications}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
                onView={handleView}
              />
            </div>
          </div>

          <NotificationSettingsDrawer
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
