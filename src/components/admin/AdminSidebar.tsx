import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Shield,
  Bot, Link2, TrendingUp, Activity, ShieldCheck, FileText,
  Lock, Server, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap,
} from 'lucide-react';
import { SUPER_ADMIN_USER, PLATFORM_INFO } from '../../data/superAdminData';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'amber' | 'red' | 'teal' | 'blue' | 'static-teal';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '3', badgeType: 'amber' },
    ],
  },
  {
    title: 'USERS & ORGANIZATIONS',
    items: [
      { id: 'patients', label: 'Patients', icon: Users, badge: '48,231', badgeType: 'static-teal' },
      { id: 'doctors', label: 'Doctors', icon: Stethoscope, badge: '23', badgeType: 'amber' },
      { id: 'organizations', label: 'Organizations', icon: Building2, badge: '4', badgeType: 'blue' },
      { id: 'insurance', label: 'Insurance', icon: Shield },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      { id: 'ai', label: 'AI Analytics', icon: Bot, badge: '8,921', badgeType: 'static-teal' },
      { id: 'integrations', label: 'Integrations', icon: Link2, badge: '⚠️', badgeType: 'amber' },
      { id: 'revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'nabidh', label: 'NABIDH', icon: Activity },
    ],
  },
  {
    title: 'COMPLIANCE & SECURITY',
    items: [
      { id: 'compliance', label: 'DHA Compliance', icon: ShieldCheck, badge: '3', badgeType: 'red' },
      { id: 'audit', label: 'Audit Logs', icon: FileText },
      { id: 'security', label: 'Security', icon: Lock, badge: '1', badgeType: 'amber' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'system', label: 'System Health', icon: Server },
      { id: 'platform-settings', label: 'Platform Settings', icon: Settings },
    ],
  },
];

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<Props> = ({ activeSection, onSectionChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex flex-col flex-shrink-0 h-screen overflow-y-auto transition-all duration-300"
      style={{
        width: collapsed ? 72 : 260,
        background: '#0A1628',
        borderRight: '1px solid rgba(30,41,59,0.8)',
      }}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
        {!collapsed && (
          <div>
            <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
              CeenAiX
            </div>
            <div className="uppercase tracking-widest font-bold mt-0.5" style={{ fontSize: 9, color: '#2DD4BF' }}>
              Super Admin Portal
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Environment badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-bold text-emerald-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
            {PLATFORM_INFO.environment}
          </span>
          <span className="text-slate-500 ml-auto" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
            v{PLATFORM_INFO.version}
          </span>
        </div>
      )}

      {/* Identity card */}
      {!collapsed && (
        <div className="mx-3 mb-4 rounded-xl p-3" style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.25)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)' }}
            >
              {SUPER_ADMIN_USER.initials}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white truncate" style={{ fontSize: 12 }}>
                {SUPER_ADMIN_USER.name}
              </div>
              <div style={{ fontSize: 10, color: '#5EEAD4' }}>
                {SUPER_ADMIN_USER.role} · {SUPER_ADMIN_USER.company}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold px-2 py-0.5 rounded-full" style={{ fontSize: 9, background: 'rgba(5,150,105,0.2)', color: '#34D399' }}>
              Super Admin · Full Access
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span style={{ fontSize: 9, color: '#34D399' }}>Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto pb-2">
        {navSections.map(section => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <div className="px-4 mb-1 mt-3" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className="w-full flex items-center transition-all"
                  style={{
                    padding: collapsed ? '10px 0' : '9px 12px 9px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 'rgba(13,148,136,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #0D9488' : '3px solid transparent',
                    color: isActive ? '#2DD4BF' : '#94A3B8',
                    gap: 10,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className="font-bold rounded-full px-1.5 py-0.5"
                          style={{
                            fontSize: 9,
                            fontFamily: 'DM Mono, monospace',
                            background:
                              item.badgeType === 'amber' ? 'rgba(245,158,11,0.2)' :
                              item.badgeType === 'red' ? 'rgba(239,68,68,0.2)' :
                              item.badgeType === 'blue' ? 'rgba(59,130,246,0.2)' :
                              'rgba(13,148,136,0.2)',
                            color:
                              item.badgeType === 'amber' ? '#FCD34D' :
                              item.badgeType === 'red' ? '#FCA5A5' :
                              item.badgeType === 'blue' ? '#93C5FD' :
                              '#5EEAD4',
                            animation: (item.badgeType === 'amber' || item.badgeType === 'red') ? 'pulse 2s infinite' : undefined,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* System status */}
      {!collapsed && (
        <div className="flex-shrink-0 px-4 pb-2 pt-3" style={{ borderTop: '1px solid rgba(30,41,59,0.8)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontSize: 11, color: '#34D399', fontFamily: 'Inter, sans-serif' }}>All Systems Operational</span>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569' }}>
            CeenAiX v{PLATFORM_INFO.version} · Production
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
        className="flex-shrink-0 flex items-center gap-3 transition-colors"
        style={{
          padding: collapsed ? '12px 0' : '12px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderTop: '1px solid rgba(30,41,59,0.8)',
          color: '#475569',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
        title={collapsed ? 'Sign Out' : undefined}
      >
        <LogOut style={{ width: 15, height: 15, flexShrink: 0 }} />
        {!collapsed && <span style={{ fontSize: 12 }}>Sign Out</span>}
      </button>
    </div>
  );
};

export default AdminSidebar;
