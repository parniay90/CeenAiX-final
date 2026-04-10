import React from 'react';
import {
  Settings, Palette, Bell, LayoutDashboard, Stethoscope,
  ClipboardList, FlaskConical, Bot, Lock, ShieldCheck, Monitor,
  Accessibility, Globe, Link2, HelpCircle, MessageSquare, Info,
  ChevronRight
} from 'lucide-react';

interface NavCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  group?: string;
}

const categories: NavCategory[] = [
  { id: 'general', label: 'General', icon: Settings, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', group: 'APP SETTINGS' },
  { id: 'appearance', label: 'Appearance', icon: Palette, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: 'notifications', label: 'Notifications', icon: Bell, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { id: 'clinical-tools', label: 'Clinical Tools', icon: Stethoscope, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', group: 'CLINICAL SETTINGS' },
  { id: 'consultation-workspace', label: 'Consultation Workspace', icon: ClipboardList, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { id: 'lab-imaging', label: 'Lab & Imaging', icon: FlaskConical, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 'clinical-ai', label: 'Clinical AI', icon: Bot, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  { id: 'privacy', label: 'Privacy & Data', icon: Lock, iconBg: 'bg-slate-100', iconColor: 'text-slate-700', group: 'PRIVACY & SECURITY' },
  { id: 'security', label: 'Security', icon: ShieldCheck, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  { id: 'devices', label: 'Devices & Sessions', icon: Monitor, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', group: 'ACCESSIBILITY' },
  { id: 'language', label: 'Language & Region', icon: Globe, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 'integrations', label: 'Integrations', icon: Link2, iconBg: 'bg-blue-100', iconColor: 'text-blue-700', group: 'SUPPORT' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 'about', label: 'About CeenAiX', icon: Info, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
];

interface DoctorSettingsNavProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const DoctorSettingsNav: React.FC<DoctorSettingsNavProps> = ({ activeSection, onSectionChange }) => {
  const scrollToSection = (id: string) => {
    onSectionChange(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let lastGroup = '';

  return (
    <div className="w-60 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-3 border-b border-slate-100">
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A1628] to-teal-600 flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
              AA
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                Dr. Ahmed Al Rashidi
              </p>
              <p className="text-[11px] text-slate-400 truncate">Cardiologist · Al Noor</p>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/profile');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-medium mt-0.5 transition-colors"
              >
                View Profile →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((cat) => {
          const showGroup = cat.group && cat.group !== lastGroup;
          if (cat.group) lastGroup = cat.group;
          const Icon = cat.icon;
          const isActive = activeSection === cat.id;

          return (
            <React.Fragment key={cat.id}>
              {showGroup && (
                <div className="px-2 pt-4 pb-1.5">
                  <p
                    className="text-[11px] uppercase tracking-widest font-semibold text-slate-400"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat.group}
                  </p>
                </div>
              )}
              <button
                onClick={() => scrollToSection(cat.id)}
                className={`w-full flex items-center justify-between pr-2 py-2.5 rounded-r-xl transition-all group ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border-l-[3px] border-teal-500 pl-[13px]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 pl-4'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-7 h-7 rounded-lg ${isActive ? 'bg-teal-100' : cat.iconBg} flex items-center justify-center flex-shrink-0 transition-colors`}>
                    <Icon className={`${isActive ? 'text-teal-600' : cat.iconColor}`} style={{ width: 14, height: 14 }} />
                  </div>
                  <span className="text-[13px] font-medium text-left leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {cat.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 flex-shrink-0" />
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-300" style={{ fontFamily: 'DM Mono, monospace' }}>
          CeenAiX Doctor Portal v2.4.1
        </p>
        <p className="text-[10px] text-slate-300 mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>
          Last synced: Today 11:34 AM
        </p>
      </div>
    </div>
  );
};

export default DoctorSettingsNav;
