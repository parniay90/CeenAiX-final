import React, { useState } from 'react';
import {
  LayoutDashboard, Pill, Package, MessageSquare, BarChart3,
  DollarSign, Building2, Settings, ChevronLeft, ChevronRight,
  AlertTriangle, LogOut, Activity
} from 'lucide-react';

interface PharmacySidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'MAIN', badge: 3, badgeType: 'blue' as const, href: '/pharmacy/dashboard' },
  { id: 'prescriptions', icon: Pill, label: 'Prescriptions', section: 'MAIN', badge: 3, badgeType: 'blue' as const, href: '/pharmacy/prescriptions' },
  { id: 'inventory', icon: Package, label: 'Inventory', section: 'MAIN', badge: 4, badgeType: 'amber' as const, href: '/pharmacy/inventory' },
  { id: 'messages', icon: MessageSquare, label: 'Messages', section: 'MAIN', badge: 1, badgeType: 'blue' as const, href: '/pharmacy/messages' },
  { id: 'reports', icon: BarChart3, label: 'Reports', section: 'ANALYTICS', href: '/pharmacy/reports' },
  { id: 'revenue', icon: DollarSign, label: 'Revenue', section: 'ANALYTICS', href: '/pharmacy/revenue' },
  { id: 'profile', icon: Building2, label: 'My Pharmacy', section: 'ACCOUNT', href: '/pharmacy/profile' },
  { id: 'settings', icon: Settings, label: 'Settings', section: 'ACCOUNT', href: '/pharmacy/settings' },
];

const sections = ['MAIN', 'ANALYTICS', 'ACCOUNT'];

const PharmacySidebar: React.FC<PharmacySidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activePage,
  onNavigate,
}) => {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);
    window.location.href = '/';
  };

  const handleNav = (item: typeof navItems[0]) => {
    onNavigate(item.id);
    window.history.pushState({}, '', item.href);
  };

  return (
    <div
      className="flex flex-col h-full transition-all duration-300 overflow-hidden"
      style={{ background: '#064E3B', width: isCollapsed ? 72 : 260, minWidth: isCollapsed ? 72 : 260 }}
    >
      {/* Top logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-800/50" style={{ minHeight: 72 }}>
        {!isCollapsed && (
          <div>
            <div className="font-bold text-white leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
              CeenAiX
            </div>
            <div className="text-emerald-300 uppercase tracking-widest" style={{ fontSize: 10 }}>
              Pharmacy Portal
            </div>
          </div>
        )}
        {isCollapsed && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            C
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="text-emerald-300 hover:text-white transition-colors p-1 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pharmacy Identity Card */}
      {!isCollapsed && (
        <div className="mx-3 my-3 rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(6,95,70,0.8)' }}>
          <div className="font-bold text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            Al Shifa Pharmacy
          </div>
          <div className="text-emerald-200 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
            الشفاء للصيدلة
          </div>
          <div className="text-emerald-300 mb-1" style={{ fontSize: 10 }}>
            Al Barsha · DHA Licensed ✅
          </div>
          <div className="text-white/70 mb-2" style={{ fontSize: 10 }}>
            Rania Hassan | Head Pharmacist
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300" style={{ fontSize: 10 }}>Active shift</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map(section => {
          const items = navItems.filter(i => i.section === section);
          return (
            <div key={section} className="mb-1">
              {!isCollapsed && (
                <div className="px-4 py-1.5 text-emerald-500 uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                  {section}
                </div>
              )}
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item)}
                    className={`w-full flex items-center gap-3 transition-all duration-150 rounded-lg mx-2 ${isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'} ${isActive ? 'bg-emerald-700/60 text-white' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/50'}`}
                    style={{ width: isCollapsed ? 'calc(100% - 16px)' : 'calc(100% - 16px)', fontSize: 13 }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} style={{ width: 16, height: 16 }} />
                    {!isCollapsed && (
                      <span className="flex-1 text-left" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${item.badgeType === 'blue' ? 'bg-blue-500' : 'bg-amber-500'} ${item.badgeType === 'blue' ? 'animate-pulse' : ''}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isCollapsed && item.badge && (
                      <span
                        className={`absolute top-1 right-1 w-2 h-2 rounded-full ${item.badgeType === 'blue' ? 'bg-blue-400' : 'bg-amber-400'}`}
                        style={{ position: 'relative', marginLeft: -6, marginTop: -8 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Today Summary */}
      {!isCollapsed && (
        <div className="mx-3 mb-2 rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(6,95,70,0.5)' }}>
          <div className="text-emerald-300 mb-1.5" style={{ fontSize: 11 }}>
            12 prescriptions today
          </div>
          <div className="text-white/60 mb-1.5" style={{ fontSize: 10 }}>
            8 dispensed · 3 in queue · 1 on hold
          </div>
          <div className="text-emerald-400 font-bold mb-1.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
            AED 1,847 today
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="text-amber-400" style={{ fontSize: 10 }}>4 stock alerts</span>
          </div>
        </div>
      )}

      {/* Sign Out */}
      <div className="border-t border-emerald-800/50 p-2">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={`w-full flex items-center gap-2 text-emerald-300/60 hover:text-red-400 transition-colors rounded-lg p-2.5 hover:bg-white/5 disabled:opacity-50 ${isCollapsed ? 'justify-center' : 'px-3'}`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && (
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </span>
          )}
        </button>
      </div>

      {/* Collapsed expand button */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="p-4 border-t border-emerald-800/50 hover:bg-emerald-800/30 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-emerald-400 mx-auto" />
        </button>
      )}
    </div>
  );
};

export default PharmacySidebar;
