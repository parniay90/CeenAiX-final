import { X, Bell, Smartphone, Mail, MessageCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings, DeliveryChannel, NotificationFrequency, CATEGORY_CONFIG } from '../../types/notifications';

interface NotificationSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettingsDrawer({ isOpen, onClose }: NotificationSettingsDrawerProps) {
  const [settings, setSettings] = useState<NotificationSettings[]>(DEFAULT_NOTIFICATION_SETTINGS);

  const getChannelIcon = (channel: DeliveryChannel) => {
    switch (channel) {
      case 'in-app':
        return <Bell className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4" />;
      case 'whatsapp':
        return <Zap className="w-4 h-4" />;
    }
  };

  const toggleChannel = (categoryId: string, channel: DeliveryChannel) => {
    setSettings(prev =>
      prev.map(setting => {
        if (setting.category === categoryId) {
          const channels = setting.channels.includes(channel)
            ? setting.channels.filter(c => c !== channel)
            : [...setting.channels, channel];
          return { ...setting, channels };
        }
        return setting;
      })
    );
  };

  const updateFrequency = (categoryId: string, frequency: NotificationFrequency) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.category === categoryId ? { ...setting, frequency } : setting
      )
    );
  };

  const toggleEnabled = (categoryId: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.category === categoryId ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = CATEGORY_CONFIG.find(c => c.id === categoryId);
    return category?.label || categoryId;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Notification Settings</h2>
            <p className="text-sm text-slate-400">Control how and when you receive notifications</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {settings.map((setting) => (
            <div key={setting.category} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{getCategoryLabel(setting.category)}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Configure delivery preferences</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={() => toggleEnabled(setting.category)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {setting.enabled && (
                <>
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Delivery Channels</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['in-app', 'push', 'email', 'sms', 'whatsapp'] as DeliveryChannel[]).map((channel) => {
                        const isActive = setting.channels.includes(channel);
                        return (
                          <button
                            key={channel}
                            onClick={() => toggleChannel(setting.category, channel)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                          >
                            {getChannelIcon(channel)}
                            {channel === 'in-app' ? 'In-App' : channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Frequency</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['immediate', 'daily-digest', 'weekly'] as NotificationFrequency[]).map((freq) => {
                        const isActive = setting.frequency === freq;
                        return (
                          <button
                            key={freq}
                            onClick={() => updateFrequency(setting.category, freq)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                          >
                            {freq === 'immediate'
                              ? 'Immediate'
                              : freq === 'daily-digest'
                              ? 'Daily Digest'
                              : 'Weekly'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
