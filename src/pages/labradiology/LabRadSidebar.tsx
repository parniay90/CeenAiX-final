import { useState } from 'react';
import {
  FlaskConical, Scan, LayoutDashboard, ClipboardList,
  CheckSquare, Microscope, Activity, FileText, Cpu,
  Upload, BarChart3, User, Settings, ChevronRight,
  AlertCircle, Cloud, Beaker, LogOut
} from 'lucide-react';
import type { LabPage } from './types';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

interface Props {
  activePage: LabPage;
  onNavigate: (page: LabPage) => void;
}

interface NavItem {
  id: LabPage;
  label: string;
  icon: React.ReactNode;
  badge?: { text: string; color: string };
}

const navGroups: { title: string; color: string; items: NavItem[] }[] = [
  {
    title: 'OVERVIEW',
    color: 'text-slate-400',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        badge: { text: '1', color: 'bg-red-500 text-white animate-pulse' },
      },
    ],
  },
  {
    title: 'LABORATORY',
    color: 'text-indigo-300',
    items: [
      {
        id: 'queue',
        label: 'Lab Queue',
        icon: <Beaker size={16} />,
        badge: { text: '14', color: 'bg-blue-500 text-white' },
      },
      {
        id: 'orders',
        label: 'Lab Orders',
        icon: <ClipboardList size={16} />,
        badge: { text: '3', color: 'bg-blue-500 text-white' },
      },
      {
        id: 'results',
        label: 'Lab Results',
        icon: <CheckSquare size={16} />,
        badge: { text: '5', color: 'bg-amber-500 text-white' },
      },
      {
        id: 'qc',
        label: 'Quality Control',
        icon: <Microscope size={16} />,
        badge: { text: '⚠', color: 'bg-amber-500 text-white' },
      },
    ],
  },
  {
    title: 'RADIOLOGY',
    color: 'text-blue-300',
    items: [
      {
        id: 'imaging-queue',
        label: 'Imaging Queue',
        icon: <Scan size={16} />,
        badge: { text: '7', color: 'bg-blue-500 text-white' },
      },
      {
        id: 'imaging-orders',
        label: 'Imaging Orders',
        icon: <ClipboardList size={16} />,
        badge: { text: '3', color: 'bg-blue-500 text-white' },
      },
      {
        id: 'imaging-reports',
        label: 'Radiology Reports',
        icon: <FileText size={16} />,
        badge: { text: '9', color: 'bg-amber-500 text-white' },
      },
      {
        id: 'imaging-equipment',
        label: 'Imaging Equipment',
        icon: <Cpu size={16} />,
        badge: { text: '⚠', color: 'bg-amber-500 text-white' },
      },
    ],
  },
  {
    title: 'SHARED',
    color: 'text-teal-300',
    items: [
      {
        id: 'equipment',
        label: 'Lab Equipment',
        icon: <Activity size={16} />,
        badge: { text: '⚠', color: 'bg-amber-500 text-white' },
      },
      {
        id: 'nabidh',
        label: 'NABIDH Sync',
        icon: <Cloud size={16} />,
        badge: { text: '8', color: 'bg-violet-500 text-white' },
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart3 size={16} />,
      },
    ],
  },
  {
    title: 'ADMIN',
    color: 'text-slate-400',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: <User size={16} />,
      },
    ],
  },
];

export default function LabRadSidebar({ activePage, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0 overflow-hidden"
      style={{
        width: collapsed ? 72 : 260,
        background: '#1E1B4B',
      }}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical size={18} className="text-indigo-300" />
              <Scan size={18} className="text-blue-300" />
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                CeenAiX
              </span>
            </div>
            <div className="text-indigo-300 uppercase tracking-widest mt-0.5" style={{ fontSize: 9 }}>
              Lab & Radiology Portal
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-indigo-300 hover:text-white transition-colors p-1 rounded"
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg p-3" style={{ background: 'rgba(79,70,229,0.2)' }}>
          <div className="text-white font-semibold text-xs leading-tight">Dubai Medical & Imaging Centre</div>
          <div className="text-indigo-200 mt-0.5" style={{ fontSize: 10 }}>
            مركز دبي للتشخيص والتصوير الطبي
          </div>
          <div className="text-indigo-300 mt-1" style={{ fontSize: 9 }}>
            Healthcare City · DHA Licensed ✅
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 rounded px-1.5 py-0.5" style={{ fontSize: 9 }}>
              🧪 DHA Lab ✅
            </span>
            <span className="bg-blue-800 text-blue-100 rounded px-1.5 py-0.5" style={{ fontSize: 9 }}>
              🩻 DHA Radiology ✅
            </span>
          </div>
          <div className="text-white/40 mt-1.5" style={{ fontSize: 9 }}>
            Fatima Al Rashidi · Day Shift
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-3">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div className={`${group.color} uppercase tracking-widest mb-1 px-2`} style={{ fontSize: 9 }}>
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 mb-0.5 transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-indigo-300'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-xs font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${item.badge.color}`} style={{ fontSize: 9, minWidth: 18, textAlign: 'center' }}>
                          {item.badge.text}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className={`absolute left-8 top-0 rounded-full w-3.5 h-3.5 flex items-center justify-center ${item.badge.color}`} style={{ fontSize: 8 }}>
                      •
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        <div className="mt-2">
          {!collapsed && <div className="text-slate-400 uppercase tracking-widest mb-1 px-2" style={{ fontSize: 9 }}>SETTINGS</div>}
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 transition-all text-left ${
              activePage === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings size={16} className="text-indigo-300 shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Settings</span>}
          </button>
        </div>
      </nav>

      <div className="border-t border-white/10 px-2 py-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all text-left"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="border-t border-white/10 px-3 py-3 space-y-0.5" style={{ fontSize: 10 }}>
          <div className="text-indigo-200 flex items-center gap-1">
            <FlaskConical size={10} className="text-indigo-400" />
            234 samples · 189 complete
          </div>
          <div className="text-blue-200 flex items-center gap-1">
            <Scan size={10} className="text-blue-400" />
            47 studies · 28 reported
          </div>
          <div className="text-red-300 flex items-center gap-1">
            <AlertCircle size={10} className="text-red-400" />
            1 critical unnotified
          </div>
          <div className="text-violet-300 flex items-center gap-1">
            <Upload size={10} className="text-violet-400" />
            8 NABIDH pending
          </div>
          <div className="text-slate-500 mt-1">v2.4.1 · Production</div>
        </div>
      )}
    </aside>
  );
}
