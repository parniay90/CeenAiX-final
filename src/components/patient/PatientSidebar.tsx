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

interface PatientSidebarProps {
  currentPage?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
  { id: 'health', label: 'My Health', icon: Heart, href: '/my-health' },
  { id: 'medications', label: 'Medications', icon: Pill, href: '/medications' },
  { id: 'lab-results', label: 'Lab Results', icon: Activity, href: '/lab-results' },
  { id: 'imaging', label: 'Imaging & Scans', icon: Scan, href: '/imaging' },
  { id: 'documents', label: 'Documents', icon: FolderOpen, href: '/documents', badge: 3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', badge: 2 },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, href: '/ai-assistant' },
  { id: 'insurance', label: 'Insurance', icon: ShieldCheck, href: '/patient/insurance' },
];

const bottomItems = [
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PatientSidebar({ currentPage = 'dashboard' }: PatientSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 ${
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
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
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
                  isActive
                    ? 'bg-slate-100 text-slate-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-[13px]">{item.label}</span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-[13px]">Sign Out</span>}
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
