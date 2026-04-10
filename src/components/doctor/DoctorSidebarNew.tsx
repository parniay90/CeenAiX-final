import React, { useState } from 'react';
import { LayoutDashboard, CalendarCheck, CalendarDays, Users, PenLine, FlaskConical, MessageSquare, TrendingUp, CircleUser as UserCircle, Settings, ChevronLeft, ChevronRight, Heart, LogOut, Calendar, DollarSign, AlertCircle, Scan } from 'lucide-react';

interface DoctorSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeTab?: string;
}

const DoctorSidebarNew: React.FC<DoctorSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeTab = 'dashboard'
}) => {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    window.location.href = '/';
  };
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: 3, badgeColor: 'bg-red-500', section: 'CLINIC', href: '/doctor/dashboard' },
    { id: 'today', icon: CalendarCheck, label: "Today's Appointments", badge: 3, badgeColor: 'bg-amber-500', href: '/doctor/today' },
    { id: 'appointments', icon: CalendarDays, label: 'Appointments', href: '/doctor/appointments' },
    { id: 'patients', icon: Users, label: 'Patient Records', href: '/doctor/patients' },
    { id: 'prescribe', icon: PenLine, label: 'Write Prescription', badge: 1, badgeColor: 'bg-amber-500', href: '/doctor/prescribe' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Referrals', badge: 1, badgeColor: 'bg-red-500 animate-pulse', href: '/doctor/labs' },
    { id: 'imaging', icon: Scan, label: 'Imaging Center', badge: 1, badgeColor: 'bg-amber-500', href: '/doctor/imaging' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 4, badgeColor: 'bg-blue-500', href: '/doctor/messages' },
    { id: 'earnings', icon: TrendingUp, label: 'Earnings', section: 'ANALYTICS', href: '/doctor/earnings' },
    { id: 'profile', icon: UserCircle, label: 'My Profile', section: 'ACCOUNT', href: '/doctor/profile' },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      } bg-[#0A1628] flex flex-col transition-all duration-300 shadow-2xl`}
    >
      <div className="h-[72px] flex items-center justify-between px-6 border-b border-white/[0.06]">
        {!isCollapsed ? (
          <>
            <div>
              <h1 className="text-white font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                CeenAiX
              </h1>
              <p className="text-teal-400 text-[10px] uppercase tracking-wide">Doctor Portal</p>
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors mx-auto"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
              C
            </div>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="px-4 py-4">
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A1628] to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AA
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A1628]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-[13px] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Dr. Ahmed Al Rashidi
                </h3>
                <p className="text-teal-400 text-[11px]">Cardiologist</p>
                <p className="text-slate-400 text-[11px] truncate">Al Noor Medical Center</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 bg-emerald-900/50 rounded text-emerald-300 text-[9px] font-medium">
                  DHA Licensed ✓
                </div>
                <p className="text-slate-500 text-[9px] mt-0.5" style={{ fontFamily: 'monospace' }}>
                  DHA-PRAC-2018-047821
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const showSection = item.section && (index === 0 || navItems[index - 1].section !== item.section);

          return (
            <React.Fragment key={item.id}>
              {!isCollapsed && showSection && (
                <div className="px-3 pt-4 pb-2">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold">
                    {item.section}
                  </p>
                </div>
              )}
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', item.href);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
                } py-2.5 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`${item.badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center`}>
                    {item.badge}
                  </span>
                )}
              </a>
            </React.Fragment>
          );
        })}
      </nav>

      {!isCollapsed && (
        <>
          <div className="px-3 pb-2 border-t border-white/[0.06] pt-2 mt-1">
            <a
              href="/doctor/settings"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/doctor/settings');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4" />
                <span className="text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>Settings</span>
              </div>
            </a>
          </div>

          <div className="border-t border-white/[0.06] p-3.5 space-y-2.5">
            <p className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold px-2">TODAY</p>

            <div className="space-y-2 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>8 appointments</span>
                </div>
                <span className="text-teal-400 font-mono text-[12px] font-semibold">5/8 done</span>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-slate-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Revenue today</span>
                </div>
                <span className="text-emerald-400 font-mono text-[12px] font-semibold">AED 2,400</span>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Critical alerts</span>
                </div>
                <span className="text-red-400 font-mono text-[12px] font-bold">1 URGENT</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 mt-3 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </span>
            </button>
          </div>
        </>
      )}

      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="p-4 border-t border-white/[0.06] hover:bg-white/5 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-400 mx-auto" />
        </button>
      )}
    </aside>
  );
};

export default DoctorSidebarNew;
