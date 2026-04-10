import React from 'react';
import {
  LayoutDashboard, ClipboardList, FileText, Users,
  Shield, BarChart3, Building2, BookOpen, Settings,
  ChevronLeft, ChevronRight, AlertTriangle, Clock,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  pulse?: boolean;
  path: string;
}

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const NAV_MAIN: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
    badge: 2,
    badgeColor: 'bg-red-500',
    pulse: true,
    path: '/insurance/dashboard',
  },
  {
    id: 'preauth',
    label: 'Pre-Authorizations',
    icon: <ClipboardList size={16} />,
    badge: 16,
    badgeColor: 'bg-amber-500',
    pulse: true,
    path: '/insurance/preauth',
  },
  {
    id: 'claims',
    label: 'Claims',
    icon: <FileText size={16} />,
    badge: 42,
    badgeColor: 'bg-blue-500',
    path: '/insurance/claims',
  },
  {
    id: 'members',
    label: 'Members',
    icon: <Users size={16} />,
    path: '/insurance/members',
  },
];

const NAV_INTELLIGENCE: NavItem[] = [
  {
    id: 'fraud',
    label: 'Fraud Detection',
    icon: <Shield size={16} />,
    badge: 5,
    badgeColor: 'bg-red-500',
    pulse: true,
    path: '/insurance/fraud',
  },
  {
    id: 'analytics',
    label: 'Risk Analytics',
    icon: <BarChart3 size={16} />,
    path: '/insurance/analytics',
  },
  {
    id: 'network',
    label: 'Network Providers',
    icon: <Building2 size={16} />,
    path: '/insurance/network',
  },
];

const NAV_ADMIN: NavItem[] = [
  {
    id: 'reports',
    label: 'Reports',
    icon: <BookOpen size={16} />,
    path: '/insurance/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={16} />,
    path: '/insurance/settings',
  },
];

const InsuranceSidebar: React.FC<Props> = ({ activePage, onNavigate, isCollapsed, onToggle }) => {
  const renderNavItem = (item: NavItem) => {
    const isActive = activePage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        title={isCollapsed ? item.label : undefined}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group relative ${
          isActive
            ? 'bg-[#1E3A5F] text-white'
            : 'text-blue-200 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left font-medium" style={{ fontSize: 13 }}>
              {item.label}
            </span>
            {item.badge !== undefined && (
              <span
                className={`flex-shrink-0 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ${item.badgeColor ?? 'bg-slate-500'} ${item.pulse ? 'animate-pulse' : ''}`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && item.badge !== undefined && (
          <span
            className={`absolute -top-0.5 -right-0.5 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ${item.badgeColor ?? 'bg-slate-500'} ${item.pulse ? 'animate-pulse' : ''}`}
            style={{ fontSize: 9 }}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (label: string, items: NavItem[]) => (
    <div className="mb-4">
      {!isCollapsed && (
        <p className="text-blue-400 uppercase mb-1.5 px-3" style={{ fontSize: 9, letterSpacing: '0.1em', fontWeight: 600 }}>
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map(renderNavItem)}
      </div>
    </div>
  );

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full relative transition-all duration-300"
      style={{
        width: isCollapsed ? 72 : 260,
        background: '#0F2D4A',
        borderRight: '1px solid rgba(30,58,95,0.8)',
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {isCollapsed ? (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white mx-auto"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D9488)', fontSize: 18 }}
          >
            C
          </div>
        ) : (
          <div>
            <p className="text-white font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
              CeenAiX
            </p>
            <p className="text-blue-300 uppercase tracking-widest" style={{ fontSize: 10, letterSpacing: '0.15em' }}>
              Insurance Portal
            </p>
          </div>
        )}
      </div>

      {/* Company card */}
      {!isCollapsed && (
        <div className="mx-3 my-3 rounded-xl p-3" style={{ background: 'rgba(30,58,95,0.6)', border: '1px solid rgba(30,58,95,1)' }}>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-[#0F2D4A]" style={{ fontSize: 14 }}>D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold leading-tight" style={{ fontSize: 12 }}>
                Daman National Health Insurance
              </p>
              <p className="text-blue-200" style={{ fontSize: 10 }}>شركة ضمان للتأمين الصحي</p>
              <p className="text-blue-300 mt-0.5" style={{ fontSize: 9 }}>UAE Insurance Authority ✅</p>
              <p className="text-white/40 mt-0.5" style={{ fontSize: 9 }}>8,247 active members · CeenAiX</p>
              <p className="text-blue-200 mt-0.5" style={{ fontSize: 9 }}>Mariam Al Khateeb · Senior Claims Officer</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0">
        {renderSection('Main', NAV_MAIN)}
        {renderSection('Intelligence', NAV_INTELLIGENCE)}
        {renderSection('Admin', NAV_ADMIN)}
      </nav>

      {/* Bottom summary */}
      {!isCollapsed && (
        <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-blue-200 font-medium" style={{ fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
            AED 4.8M claims · April to date
          </p>
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-300" style={{ fontSize: 10 }}>2 fraud alerts HIGH</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={10} className="text-amber-400" />
              <span className="text-amber-300" style={{ fontSize: 10 }}>1 pre-auth OVERDUE SLA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-blue-300" />
              <span className="text-blue-300" style={{ fontSize: 10 }}>16 pre-auths pending review</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1E3A5F] border border-[#2a4a6f] flex items-center justify-center text-blue-300 hover:text-white transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default InsuranceSidebar;
