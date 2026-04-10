import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsSection } from '../types/settings';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import AccountSection from '../components/settings/AccountSection';
import PrivacyDataSection from '../components/settings/PrivacyDataSection';
import NotificationsSection from '../components/settings/NotificationsSection';
import LanguageAccessibilitySection from '../components/settings/LanguageAccessibilitySection';
import SecuritySection from '../components/settings/SecuritySection';
import HelpSupportSection from '../components/settings/HelpSupportSection';

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'account':
        return 'Account Settings';
      case 'profile':
        return 'Profile Information';
      case 'privacy':
        return 'Privacy & Data';
      case 'notifications':
        return 'Notification Preferences';
      case 'language':
        return 'Language & Accessibility';
      case 'insurance':
        return 'Insurance Information';
      case 'devices':
        return 'Connected Devices';
      case 'security':
        return 'Security Settings';
      case 'support':
        return 'Help & Support';
      default:
        return 'Settings';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'account':
        return 'Manage your personal information, emergency contacts, and linked family accounts';
      case 'profile':
        return 'Update your profile details and preferences';
      case 'privacy':
        return 'Control your data sharing preferences and privacy settings';
      case 'notifications':
        return 'Customize how and when you receive notifications';
      case 'language':
        return 'Change language, font size, and accessibility options';
      case 'insurance':
        return 'Manage your insurance providers and coverage details';
      case 'devices':
        return 'View and manage connected devices and wearables';
      case 'security':
        return 'Secure your account with password and two-factor authentication';
      case 'support':
        return 'Get help, submit feedback, or report issues';
      default:
        return '';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
      case 'profile':
        return <AccountSection />;
      case 'privacy':
        return <PrivacyDataSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'language':
        return <LanguageAccessibilitySection />;
      case 'security':
        return <SecuritySection />;
      case 'support':
        return <HelpSupportSection />;
      case 'insurance':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Insurance Settings</h3>
            <p className="text-sm text-slate-600">
              This section is under development. Insurance management features coming soon.
            </p>
          </div>
        );
      case 'devices':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connected Devices</h3>
            <p className="text-sm text-slate-600">
              This section is under development. Device management features coming soon.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PatientTopNav patientName="Parnia Yazdkhasti" />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="settings" />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="max-w-5xl mx-auto p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{getSectionTitle()}</h2>
                  <p className="text-sm text-slate-600">{getSectionDescription()}</p>
                </div>

                {renderSection()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

