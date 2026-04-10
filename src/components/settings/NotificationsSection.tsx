import { useState } from 'react';
import { Bell, BellOff, Clock, Shield } from 'lucide-react';
import { NotificationCategory, NotificationChannel } from '../../types/settings';

export default function NotificationsSection() {
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');

  const categories: Array<{
    id: NotificationCategory;
    label: string;
    description: string;
    enabled: boolean;
    channels: NotificationChannel[];
    canDisable: boolean;
  }> = [
    {
      id: 'appointments',
      label: 'Appointments',
      description: 'Reminders for upcoming appointments and confirmations',
      enabled: true,
      channels: ['push', 'sms', 'email'],
      canDisable: true,
    },
    {
      id: 'lab-results',
      label: 'Lab Results',
      description: 'Notifications when new lab results are available',
      enabled: true,
      channels: ['push', 'email'],
      canDisable: true,
    },
    {
      id: 'medications',
      label: 'Medications',
      description: 'Medication reminders and refill notifications',
      enabled: true,
      channels: ['push', 'sms'],
      canDisable: true,
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      description: 'Personalized health insights and recommendations',
      enabled: true,
      channels: ['push'],
      canDisable: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'New messages from healthcare providers',
      enabled: true,
      channels: ['push', 'sms', 'email', 'whatsapp'],
      canDisable: true,
    },
    {
      id: 'promotions',
      label: 'Promotions',
      description: 'Health campaigns and wellness program updates',
      enabled: false,
      channels: ['email'],
      canDisable: true,
    },
  ];

  const channelLabels: Record<NotificationChannel, string> = {
    push: 'Push',
    sms: 'SMS',
    email: 'Email',
    whatsapp: 'WhatsApp',
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Quiet Hours</h3>
            </div>
            <p className="text-sm text-slate-400">
              Pause non-urgent notifications during specific hours. Emergency alerts will always be delivered.
            </p>
          </div>
          <button
            onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              quietHoursEnabled ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                quietHoursEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Start Time</label>
              <input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">End Time</label>
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Notification Categories</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Choose which notifications you want to receive and through which channels.
        </p>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-700 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1">{category.label}</h4>
                  <p className="text-xs text-slate-400">{category.description}</p>
                </div>
                {category.canDisable ? (
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      category.enabled ? 'bg-teal-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        category.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg">
                    <Shield className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500 font-bold">Always On</span>
                  </div>
                )}
              </div>

              {category.enabled && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-600">
                  {(Object.keys(channelLabels) as NotificationChannel[]).map((channel) => {
                    const isActive = category.channels.includes(channel);
                    return (
                      <button
                        key={channel}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                          isActive
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
                        }`}
                      >
                        {channelLabels[channel]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-blue-300 mb-1">Emergency Alerts</h4>
            <p className="text-xs text-blue-200">
              Critical health alerts and emergency notifications are always enabled and will bypass quiet hours. This cannot be disabled for your safety.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
