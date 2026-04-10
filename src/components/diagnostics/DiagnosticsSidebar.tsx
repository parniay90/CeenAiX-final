import React from 'react';
import {
  LayoutDashboard, FlaskConical, ClipboardList, CheckSquare, Microscope,
  ScanLine, FileText, BarChart3, Activity, Upload, Building2, Settings,
  ChevronLeft, ChevronRight, LogOut, AlertTriangle, Layers, Cpu, Zap
} from 'lucide-react';

interface DiagnosticsSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: '1', badgeType: 'red' as const },
    ],
  },
  {
    title: 'IMAGING',
    items: [
      { id: 'mri', icon: Layers, label: 'MRI Scans', badge: '2', badgeType: 'violet' as const, dot: '#8B5CF6' },
      { id: 'ct', icon: Cpu, label: 'CT Scans', badge: '1', badgeType: 'blue' as const, dot: '#3B82F6' },
      { id: 'imaging-queue', icon: ScanLine, label: 'All Imaging', badge: '7', badgeType: 'blue' as const },
      { id: 'reports', icon: FileText, label: 'Reports', badge: '9', badgeType: 'amber' as const },
    ],
  },
  {
    title: 'LABORATORY',
    items: [
      { id: 'lab', icon: FlaskConical, label: 'Lab Portal', badge: '1', badgeType: 'red' as const, dot: '#6366F1' },
      { id: 'lab-orders', icon: ClipboardList, label: 'Lab Orders' },
      { id: 'lab-results', icon: CheckSquare, label: 'Lab Results', badge: '5', badgeType: 'amber' as const },
      { id: 'lab-qc', icon: Microscope, label: 'Quality Control', badge: '⚠', badgeType: 'amber' as const },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'equipment', icon: Zap, label: 'Equipment', badge: '⚠', badgeType: 'amber' as const },
      { id: 'nabidh', icon: Upload, label: 'NABIDH', badge: '5', badgeType: 'teal' as const },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    title: 'FACILITY',
    items: [
      { id: 'profile', icon: Building2, label: 'Facility Profile' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

const badgeColors = {
  red:    'bg-red-500/90 animate-pulse',
  blue:   'bg-blue-500/90',
  indigo: 'bg-indigo-500/90',
  violet: 'bg-violet-500/90',
  amber:  'bg-amber-500/90',
  teal:   'bg-teal-500/90',
};

const DiagnosticsSidebar: React.FC<DiagnosticsSidebarProps> = ({ isCollapsed, onToggle, activePage, onNavigate }) => {
  return (
    <div
      className="flex flex-col h-full flex-shrink-0 transition-all duration-300 overflow-hidden"
      style={{ background: '#10121A', width: isCollapsed ? 64 : 240, minWidth: isCollapsed ? 64 : 240, borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 flex-shrink-0" style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {!isCollapsed ? (
          <>
            <div>
              <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17 }}>
                CeenAiX
              </div>
              <div className="uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: 'rgba(139,92,246,0.8)' }}>
                Diagnostics
              </div>
            </div>
            <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </>
        ) : (
          <button onClick={onToggle} className="w-full flex justify-center py-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #4F46E5, #1D4ED8)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              C
            </div>
          </button>
        )}
      </div>

      {/* Facility pill */}
      {!isCollapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)' }}>
          <div className="font-semibold text-white leading-tight" style={{ fontSize: 11 }}>Dubai Medical & Imaging</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Day Shift · Fatima Al Rashidi</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navSections.map(section => (
          <div key={section.title} className="mb-3">
            {!isCollapsed && (
              <div className="px-2 py-1 uppercase tracking-widest mb-1" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const badge = (item as any).badge as string | undefined;
              const badgeType = (item as any).badgeType as keyof typeof badgeColors | undefined;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className="w-full flex items-center gap-2.5 rounded-lg transition-all duration-150 mb-0.5"
                  style={{
                    padding: isCollapsed ? '10px 0' : '8px 10px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    background: isActive
                      ? item.id === 'mri' ? 'rgba(139,92,246,0.15)' :
                        item.id === 'ct'  ? 'rgba(59,130,246,0.15)' :
                        item.id === 'lab' ? 'rgba(99,102,241,0.15)' :
                        'rgba(255,255,255,0.08)'
                      : 'transparent',
                    border: isActive
                      ? item.id === 'mri' ? '1px solid rgba(139,92,246,0.25)' :
                        item.id === 'ct'  ? '1px solid rgba(59,130,246,0.25)' :
                        item.id === 'lab' ? '1px solid rgba(99,102,241,0.25)' :
                        '1px solid rgba(255,255,255,0.07)'
                      : '1px solid transparent',
                  }}
                >
                  <Icon
                    className="flex-shrink-0"
                    style={{
                      width: 15, height: 15,
                      color: isActive
                        ? item.id === 'mri' ? '#A78BFA' :
                          item.id === 'ct'  ? '#60A5FA' :
                          item.id === 'lab' ? '#818CF8' :
                          '#94A3B8'
                        : 'rgba(255,255,255,0.25)',
                    }}
                  />
                  {!isCollapsed && (
                    <>
                      <span
                        className="flex-1 text-left"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 13,
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                      {badge && badgeType && (
                        <span className={`text-white font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${badgeColors[badgeType]}`} style={{ fontSize: 9 }}>
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom summary */}
      {!isCollapsed && (
        <div className="mx-3 mb-2 px-3 py-2.5 rounded-xl space-y-1" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: 'rgba(99,102,241,0.9)' }}>Lab</span>
            <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.5)' }}>234 samples · 80.8%</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: 'rgba(59,130,246,0.9)' }}>Imaging</span>
            <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.5)' }}>47 studies · 28 done</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
            <span style={{ fontSize: 10, color: 'rgba(248,113,113,0.9)' }}>1 critical unnotified</span>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-2 rounded-lg p-2.5 transition-colors hover:bg-red-500/10"
          style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
          {!isCollapsed && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default DiagnosticsSidebar;
