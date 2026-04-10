import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Heart,
  Pill,
  Bot,
  Settings,
  LogOut,
  Activity,
  User,
  ShieldCheck,
  Scan,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PatientSidebarProps {
  currentPage?: string;
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PatientSidebar({ currentPage = 'dashboard' }: PatientSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: Home, href: '/dashboard' },
    { id: 'appointments', labelKey: 'sidebar.appointments', icon: Calendar, href: '/appointments' },
    { id: 'health', labelKey: 'sidebar.myHealth', icon: Heart, href: '/my-health' },
    { id: 'medications', labelKey: 'sidebar.medications', icon: Pill, href: '/medications' },
    { id: 'lab-results', labelKey: 'sidebar.labResults', icon: Activity, href: '/lab-results' },
    { id: 'imaging', labelKey: 'sidebar.imaging', icon: Scan, href: '/imaging' },
    { id: 'documents', labelKey: 'sidebar.documents', icon: FolderOpen, href: '/documents', badge: 3 },
    { id: 'messages', labelKey: 'sidebar.messages', icon: MessageSquare, href: '/messages', badge: 2 },
    { id: 'ai-assistant', labelKey: 'sidebar.aiAssistant', icon: Bot, href: '/ai-assistant' },
    { id: 'insurance', labelKey: 'sidebar.insurance', icon: ShieldCheck, href: '/patient/insurance' },
  ];

  const bottomItems = [
    { id: 'profile', labelKey: 'sidebar.profile', icon: User, href: '/profile' },
    { id: 'settings', labelKey: 'nav.settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 overflow-hidden ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isRTL ? 'flex-row-reverse' : ''
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className={`font-medium text-sm flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t(item.labelKey)}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200">
        <nav className="space-y-1 px-3 py-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-300 ${
                  isRTL ? 'flex-row-reverse' : ''
                } ${
                  isActive
                    ? 'bg-slate-100 text-slate-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!isCollapsed && (
                  <span className={`font-medium text-[13px] ${isRTL ? 'text-right' : ''}`}>{t(item.labelKey)}</span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!isCollapsed && <span className={`font-medium text-[13px] ${isRTL ? 'text-right' : ''}`}>{t('sidebar.signOut')}</span>}
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isCollapsed ? (
              <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            ) : (
              <>
                <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                <span className="ml-2 text-sm font-medium">{t('nav.collapse')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
