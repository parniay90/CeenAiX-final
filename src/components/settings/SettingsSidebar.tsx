import { User, Shield, Bell, Globe, CreditCard, Smartphone, Lock, HelpCircle, CircleUser as UserCircle } from 'lucide-react';
import { SettingsSection } from '../../types/settings';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const menuItems = [
    { id: 'account' as SettingsSection, label: 'Account', icon: User },
    { id: 'profile' as SettingsSection, label: 'Profile', icon: UserCircle },
    { id: 'privacy' as SettingsSection, label: 'Privacy & Data', icon: Shield },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell },
    { id: 'language' as SettingsSection, label: 'Language & Accessibility', icon: Globe },
    { id: 'insurance' as SettingsSection, label: 'Insurance', icon: CreditCard },
    { id: 'devices' as SettingsSection, label: 'Connected Devices', icon: Smartphone },
    { id: 'security' as SettingsSection, label: 'Security', icon: Lock },
    { id: 'support' as SettingsSection, label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="w-[220px] bg-white border-r border-slate-200 overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
