import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import DoctorTopBarNew from '../components/doctor/DoctorTopBarNew';
import DoctorSettingsNav from '../components/settings/doctor/DoctorSettingsNav';
import ToastSystem, { Toast } from '../components/settings/doctor/ToastSystem';

import GeneralSection from '../components/settings/doctor/sections/GeneralSection';
import AppearanceSection from '../components/settings/doctor/sections/AppearanceSection';
import NotificationsSection from '../components/settings/doctor/sections/NotificationsSection';
import DashboardSection from '../components/settings/doctor/sections/DashboardSection';
import ClinicalToolsSection from '../components/settings/doctor/sections/ClinicalToolsSection';
import ConsultationWorkspaceSection from '../components/settings/doctor/sections/ConsultationWorkspaceSection';
import LabImagingSection from '../components/settings/doctor/sections/LabImagingSection';
import ClinicalAISection from '../components/settings/doctor/sections/ClinicalAISection';
import PrivacySection from '../components/settings/doctor/sections/PrivacySection';
import SecuritySection from '../components/settings/doctor/sections/SecuritySection';
import DevicesSection from '../components/settings/doctor/sections/DevicesSection';
import AccessibilitySection from '../components/settings/doctor/sections/AccessibilitySection';
import LanguageSection from '../components/settings/doctor/sections/LanguageSection';
import IntegrationsSection from '../components/settings/doctor/sections/IntegrationsSection';
import HelpSection from '../components/settings/doctor/sections/HelpSection';
import FeedbackSection from '../components/settings/doctor/sections/FeedbackSection';
import AboutSection from '../components/settings/doctor/sections/AboutSection';

const searchIndex = [
  { keyword: 'dark mode', section: 'appearance', label: 'Color Theme', path: 'Appearance > Theme' },
  { keyword: 'theme', section: 'appearance', label: 'Color Theme', path: 'Appearance > Theme' },
  { keyword: '2fa', section: 'security', label: 'Two-Factor Authentication', path: 'Security > Two-Factor' },
  { keyword: 'two factor', section: 'security', label: 'Two-Factor Authentication', path: 'Security > Two-Factor' },
  { keyword: 'nabidh', section: 'clinical-tools', label: 'Nabidh Sync', path: 'Clinical Tools > NABIDH HIE' },
  { keyword: 'font size', section: 'accessibility', label: 'Font Size', path: 'Accessibility > Text Size' },
  { keyword: 'prescribing pin', section: 'security', label: 'Prescribing PIN', path: 'Security > Prescribing PIN' },
  { keyword: 'critical alert', section: 'notifications', label: 'Critical Lab Alerts', path: 'Notifications > Clinical Alerts' },
  { keyword: 'password', section: 'security', label: 'Change Password', path: 'Security > Password' },
  { keyword: 'logout', section: 'general', label: 'Auto-Logout Timer', path: 'General > Auto-Logout' },
  { keyword: 'language', section: 'language', label: 'Portal Language', path: 'Language & Region' },
  { keyword: 'soap', section: 'consultation-workspace', label: 'SOAP Template', path: 'Consultation Workspace > SOAP Notes' },
  { keyword: 'drug interaction', section: 'clinical-tools', label: 'Drug Interaction Alerts', path: 'Clinical Tools > Prescribing' },
  { keyword: 'pharmacy', section: 'clinical-tools', label: 'Default Pharmacy', path: 'Clinical Tools > Prescribing' },
  { keyword: 'accessibility', section: 'accessibility', label: 'Accessibility Options', path: 'Accessibility' },
  { keyword: 'privacy', section: 'privacy', label: 'Privacy & Data', path: 'Privacy & Data' },
  { keyword: 'integrations', section: 'integrations', label: 'Integrations', path: 'Integrations' },
  { keyword: 'devices', section: 'devices', label: 'Devices & Sessions', path: 'Devices & Sessions' },
  { keyword: 'biometric', section: 'security', label: 'Face ID / Touch ID', path: 'Security > Biometric' },
  { keyword: 'dashboard', section: 'dashboard', label: 'Dashboard Widgets', path: 'Dashboard' },
];

const DoctorSettings: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchIndex>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    clearTimeout(searchTimer.current);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    searchTimer.current = setTimeout(() => {
      const q = query.toLowerCase();
      const results = searchIndex.filter((item) => item.keyword.includes(q) || item.label.toLowerCase().includes(q));
      setSearchResults(results.slice(0, 6));
      setShowSearch(results.length > 0);
    }, 150);
  };

  const handleSearchSelect = (item: typeof searchIndex[0]) => {
    setSearchQuery('');
    setShowSearch(false);
    setSearchResults([]);
    setActiveSection(item.section);
    setTimeout(() => {
      const el = document.getElementById(item.section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-teal-300', 'ring-offset-2');
        setTimeout(() => el.classList.remove('ring-2', 'ring-teal-300', 'ring-offset-2'), 2000);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <DoctorSidebarNew
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        activeTab="settings"
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DoctorTopBarNew hasCriticalAlert={false} />

        <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[17px] font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Settings
            </h1>
            <p className="text-[13px] text-slate-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Platform preferences and configuration
            </p>
          </div>

          <div className="relative w-60" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search settings..."
              className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {searchResults.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-teal-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="text-[13px] text-slate-800 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <DoctorSettingsNav activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl">
              <GeneralSection showToast={showToast} />
              <AppearanceSection showToast={showToast} />
              <NotificationsSection showToast={showToast} />
              <DashboardSection showToast={showToast} />
              <ClinicalToolsSection showToast={showToast} />
              <ConsultationWorkspaceSection showToast={showToast} />
              <LabImagingSection showToast={showToast} />
              <ClinicalAISection showToast={showToast} />
              <PrivacySection showToast={showToast} />
              <SecuritySection showToast={showToast} />
              <DevicesSection showToast={showToast} />
              <AccessibilitySection showToast={showToast} />
              <LanguageSection showToast={showToast} />
              <IntegrationsSection showToast={showToast} />
              <HelpSection showToast={showToast} />
              <FeedbackSection showToast={showToast} />
              <AboutSection showToast={showToast} />
            </div>
          </div>
        </div>
      </div>

      <ToastSystem toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default DoctorSettings;
