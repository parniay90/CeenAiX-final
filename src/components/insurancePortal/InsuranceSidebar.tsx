import React, { useState } from 'react';
import {
  LayoutDashboard, ClipboardList, FileText, Users,
  AlertOctagon, BarChart3, Building2, BookOpen, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: 'red' | 'amber' | 'blue';
  pulse?: boolean;
  path: string;
}

const NAV_MAIN: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 2, badgeColor: 'red', pulse: true, path: '/insurance/dashboard' },
  { id: 'preauth', label: 'Pre-Authorizations', icon: ClipboardList, badge: 16, badgeColor: 'amber', pulse: true, path: '/insurance/preauth' },
  { id: 'claims', label: 'Claims', icon: FileText, badge: 42, badgeColor: 'blue', path: '/insurance/claims' },
  { id: 'members', label: 'Members', icon: Users, path: '/insurance/members' },
];

const NAV_INTELLIGENCE: NavItem[] = [
  { id: 'fraud', label: 'Fraud Detection', icon: AlertOctagon, badge: 5, badgeColor: 'red', pulse: true, path: '/insurance/fraud' },
  { id: 'analytics', label: 'Risk Analytics', icon: BarChart3, path: '/insurance/analytics' },
  { id: 'network', label: 'Network Providers', icon: Building2, path: '/insurance/network' },
];

const NAV_ADMIN: NavItem[] = [
  { id: 'reports', label: 'Reports', icon: BookOpen, path: '/insurance/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/insurance/settings' },
];

const badgeColors = {
  red: { bg: 'rgba(239,68,68,0.15)', text: '#F87171', border: 'rgba(239,68,68,0.3)' },
  amber: { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  blue: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
};

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

const InsuranceSidebar: React.FC<Props> = ({ activePage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = (item: NavItem) => {
    onNavigate(item.id);
    window.history.pushState({}, '', item.path);
  };

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-5">
      {!collapsed && (
        <div style={{
          fontSize: 9, color: '#4A7AA8', letterSpacing: '0.12em',
          textTransform: 'uppercase', fontFamily: 'DM Mono, monospace',
          padding: '0 16px', marginBottom: 4,
        }}>
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5 px-2">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const bc = item.badgeColor ? badgeColors[item.badgeColor] : null;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item)}
              className="flex items-center rounded-xl transition-all duration-150"
              style={{
                padding: collapsed ? '10px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 10,
                background: isActive ? 'rgba(30,58,95,0.7)' : 'transparent',
                borderLeft: isActive ? '3px solid #2DD4BF' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? '#2DD4BF' : '#7BAFD4' }} />
              {!collapsed && (
                <>
                  <span style={{
                    fontSize: 13, flex: 1, textAlign: 'left',
                    color: isActive ? '#E2F0FF' : '#93C5E8',
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    {item.label}
                  </span>
                  {item.badge != null && bc && (
                    <div
                      className="rounded-full px-1.5 flex items-center justify-center"
                      style={{
                        background: bc.bg, border: `1px solid ${bc.border}`,
                        minWidth: 20, height: 18,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: bc.text, fontFamily: 'DM Mono, monospace' }}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col flex-shrink-0 transition-all duration-300"
      style={{ width: collapsed ? 72 : 260, background: '#0F2D4A', borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: '100vh' }}
    >
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', height: 64 }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>CeenAiX</div>
            <div style={{ fontSize: 10, color: '#7BAFD4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Insurance Portal</div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D9488)' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>C</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#7BAFD4', marginLeft: collapsed ? 0 : 4 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="mx-3 my-3 rounded-xl p-3" style={{ background: 'rgba(30,58,95,0.6)', border: '1px solid rgba(30,58,95,0.8)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#1E3A5F', border: '2px solid #2563EB' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>D</span>
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Daman National Health</div>
              <div style={{ fontSize: 10, color: '#93C5E8' }}>شركة ضمان</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#60A5FA', marginBottom: 3 }}>UAE Insurance Authority ✅</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>8,247 active members · CeenAiX</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>Mariam Al Khateeb · Senior Claims Officer</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-3" style={{ scrollbarWidth: 'none' }}>
        <NavSection title="MAIN" items={NAV_MAIN} />
        <NavSection title="INTELLIGENCE" items={NAV_INTELLIGENCE} />
        <NavSection title="ADMIN" items={NAV_ADMIN} />
      </div>

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 10, color: '#93C5E8', marginBottom: 4, fontFamily: 'DM Mono, monospace' }}>AED 4.8M claims · April to date</div>
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span style={{ fontSize: 9, color: '#F87171' }}>2 fraud alerts HIGH</span>
          </div>
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span style={{ fontSize: 9, color: '#FCD34D' }}>1 pre-auth OVERDUE SLA</span>
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>16 pre-auths pending review</div>
        </div>
      )}

      <div className="px-2 pb-3">
        <button
          className="flex items-center rounded-xl transition-colors w-full"
          style={{ padding: '9px 12px', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut style={{ width: 15, height: 15, color: '#F87171', flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13, color: '#F87171' }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default InsuranceSidebar;
