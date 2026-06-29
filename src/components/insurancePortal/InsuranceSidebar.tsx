import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutDashboard, ClipboardList, FileText, Users,
  AlertTriangle, BarChart3, Building2, FileBarChart,
  Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ── Keyframe CSS injected once ─────────────────────────────── */
const KEYFRAMES = `
  @keyframes badge-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
  @keyframes sla-pulse   { 0%,100%{opacity:1}          50%{opacity:0.4} }
  @keyframes fraud-pulse { 0%,100%{color:#F87171}       50%{color:#FCA5A5} }
  @keyframes status-dot  { 0%,100%{opacity:1}          50%{opacity:0.5} }
`;

/* ── Types ───────────────────────────────────────────────────── */
interface BadgeSpec { count: number; type: 'urgent' | 'amber' | 'info' | 'ai' }

interface NavItemDef {
  id: string;
  label: string;
  Icon: React.ElementType;
  iconSize?: number;
  badge?: BadgeSpec;
  subLabel?: string;
  subLabelColor?: string;
  subLabelMono?: boolean;
  aiDot?: boolean;
  secondary?: boolean;
}

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  slaBreached?: boolean;
}

/* ── Badge colours ──────────────────────────────────────────── */
const BADGE_BG: Record<string, string> = {
  urgent: '#DC2626', amber: '#D97706', info: '#2563EB', ai: '#7C3AED',
};

/* ── Nav structure ──────────────────────────────────────────── */
type NavEntry = { section?: string; divider?: boolean; item?: NavItemDef };

const NAV: NavEntry[] = [
  { item: { id: 'dashboard',  label: 'Dashboard',          Icon: LayoutDashboard, badge: { count: 2,  type: 'urgent' } } },
  { item: { id: 'preauth',    label: 'Pre-Authorizations',  Icon: ClipboardList,   badge: { count: 16, type: 'amber'  } } },
  { divider: true },
  { item: { id: 'claims',     label: 'Claims',              Icon: FileText,        badge: { count: 42, type: 'info'   } } },
  { item: { id: 'members',    label: 'Members',             Icon: Users,           subLabel: '8,247 active',         subLabelColor: 'rgba(96,165,250,0.6)', subLabelMono: true } },
  { section: 'INTELLIGENCE' },
  { item: { id: 'fraud',      label: 'Fraud Detection',     Icon: AlertTriangle,   badge: { count: 5,  type: 'urgent' } } },
  { item: { id: 'analytics',  label: 'Risk Analytics',      Icon: BarChart3,       subLabel: 'AI-powered insights',  subLabelColor: 'rgba(167,139,250,0.7)', aiDot: true } },
  { item: { id: 'network',    label: 'Network Providers',   Icon: Building2,       subLabel: '847 doctors · 34 orgs',subLabelColor: 'rgba(96,165,250,0.6)',  subLabelMono: true } },
  { section: 'REPORTING' },
  { item: { id: 'reports',    label: 'Reports',             Icon: FileBarChart,    subLabel: 'DHA format available', subLabelColor: 'rgba(45,212,191,0.6)' } },
  { divider: true },
  { section: 'ACCOUNT' },
  { item: { id: 'settings',   label: 'Settings',            Icon: Settings, iconSize: 16, secondary: true } },
];

/* ── Badge ───────────────────────────────────────────────────── */
const Badge: React.FC<{ spec: BadgeSpec; small?: boolean }> = ({ spec, small }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: small ? 18 : 20, height: small ? 18 : 20,
      padding: '0 5px', borderRadius: 10,
      background: BADGE_BG[spec.type], color: '#fff',
      fontFamily: 'DM Mono, monospace', fontSize: small ? 9 : 10, fontWeight: 700,
      animation: spec.type === 'urgent' ? 'badge-pulse 2s ease-in-out infinite' : undefined,
      flexShrink: 0,
    }}
    aria-label={`${spec.count} ${spec.type}`}
  >
    {spec.count >= 100 ? '99+' : spec.count}
  </span>
);

/* ── Tooltip ────────────────────────────────────────────────── */
const Tooltip: React.FC<{ text: string; visible: boolean }> = ({ text, visible }) => (
  <div
    role="tooltip"
    style={{
      position: 'absolute', left: 76, top: '50%', transform: 'translateY(-50%)',
      background: '#1E293B', color: '#fff', borderRadius: 8,
      padding: '6px 12px', fontSize: 12, fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap', zIndex: 200, pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      opacity: visible ? 1 : 0, transition: 'opacity 150ms',
    }}
  >
    {text}
    <div style={{
      position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
      borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderRight: '4px solid #1E293B',
    }} />
  </div>
);

/* ── Sign-out modal ─────────────────────────────────────────── */
const SignOutModal: React.FC<{ open: boolean; onCancel: () => void; onConfirm: () => void }> = ({ open, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: 'rgba(15,45,74,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ width: 400, background: '#fff', borderRadius: 16, boxShadow: '0 24px 48px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        <div className="flex flex-col items-center px-8 pt-8 pb-6 gap-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#EFF6FF' }}>
            <LogOut style={{ width: 28, height: 28, color: '#1E3A5F' }} />
          </div>

          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
            Sign Out?
          </div>

          <div className="w-full rounded-xl p-3 flex items-center gap-3" style={{ background: '#EFF6FF' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>MK</span>
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Mariam Al Khateeb</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Senior Claims Officer</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Daman National Health Insurance</div>
            </div>
            <span className="rounded px-2 py-0.5 flex-shrink-0" style={{ fontSize: 9, fontWeight: 700, color: '#1E40AF', background: '#DBEAFE' }}>
              Insurance Portal
            </span>
          </div>

          <div className="w-full rounded-xl p-3 flex items-start gap-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <AlertTriangle style={{ width: 14, height: 14, color: '#D97706', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
              You have <strong>16 pending pre-authorizations</strong> and <strong>1 SLA breach</strong> active. Make sure these are handled before signing out.
            </span>
          </div>

          <div className="w-full flex flex-col gap-2">
            <button
              onClick={onCancel}
              className="w-full rounded-xl py-3 transition-colors"
              style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            >
              ← Stay Signed In
            </button>
            <button
              onClick={onConfirm}
              className="w-full rounded-xl py-3 transition-colors"
              style={{ background: '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────── */
const InsuranceSidebar: React.FC<Props> = ({ activePage, onNavigate, slaBreached = true }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('insurance-sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const [showSignOut, setShowSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    setTooltipId(null);
    try { localStorage.setItem('insurance-sidebar-collapsed', String(next)); } catch {}
  };

  const onEnter = useCallback((id: string) => {
    setHoveredId(id);
    if (collapsed) {
      timerRef.current[id] = setTimeout(() => setTooltipId(id), 400);
    }
  }, [collapsed]);

  const onLeave = useCallback((id: string) => {
    setHoveredId(prev => prev === id ? null : prev);
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
    setTooltipId(prev => prev === id ? null : prev);
  }, []);

  const handleSignOut = () => {
    setShowSignOut(false);
    setSigningOut(true);
    setTimeout(() => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 700);
  };

  const getTooltipText = (item: NavItemDef) => {
    if (!item.badge || item.badge.count === 0)
      return item.subLabel ? `${item.label} · ${item.subLabel}` : item.label;
    const label = { urgent: 'urgent alerts', amber: 'pending', info: 'pending review', ai: 'items' };
    return `${item.label} (${item.badge.count} ${label[item.badge.type] ?? ''})`;
  };

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Sign-out overlay */}
      {signingOut && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center" style={{ background: '#fff' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D9488)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 22, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Signing out securely...</div>
        </div>
      )}

      <SignOutModal open={showSignOut} onCancel={() => setShowSignOut(false)} onConfirm={handleSignOut} />

      <aside
        className="flex flex-col flex-shrink-0"
        style={{
          width: collapsed ? 72 : 264,
          height: '100vh', position: 'sticky', top: 0,
          background: '#0F2D4A',
          borderRight: '1px solid rgba(71,85,105,0.3)',
          overflow: 'hidden',
          transition: 'width 280ms cubic-bezier(0.4,0,0.2,1)',
          zIndex: 40,
        }}
      >
        {/* ZONE 1 — Header */}
        <div
          className="flex items-center flex-shrink-0"
          style={{
            height: 64, gap: 10, flexShrink: 0,
            padding: collapsed ? '0' : '0 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(71,85,105,0.3)',
          }}
        >
          <div className="flex items-center justify-center flex-shrink-0"
            style={{
              width: collapsed ? 36 : 32, height: collapsed ? 36 : 32,
              borderRadius: collapsed ? 18 : 10,
              background: 'linear-gradient(135deg, #0D9488, #2563EB)',
              transition: 'width 280ms, height 280ms, border-radius 280ms',
            }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: collapsed ? 18 : 16, color: '#fff' }}>C</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', lineHeight: 1.2 }}>CeenAiX</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: 1 }}>
                Insurance Portal
              </div>
            </div>
          )}
        </div>

        {/* ZONE 2 — Company card */}
        <div
          style={{
            margin: '10px 10px 4px', borderRadius: 10,
            background: 'rgba(30,58,95,0.5)', border: '1px solid rgba(96,165,250,0.2)',
            padding: collapsed ? '10px 0' : 12, flexShrink: 0,
          }}
        >
          <div className="flex items-center" style={{ gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div className="flex items-center justify-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', border: '1px solid rgba(96,165,250,0.3)' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 20, color: '#0F2D4A' }}>D</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                  Daman National Health Insurance
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#BFDBFE' }}>شركة ضمان</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <>
              <div style={{ height: 1, background: 'rgba(96,165,250,0.15)', margin: '8px 0' }} />
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#93C5FD', letterSpacing: '0.5px', marginBottom: 2 }}>
                CBUAE-INS-2006-001847
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                8,247 members on CeenAiX
              </div>
              <div style={{ height: 1, background: 'rgba(96,165,250,0.15)', marginBottom: 8 }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34D399', animation: 'status-dot 2s ease-in-out infinite', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Mariam Al Khateeb</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Senior Claims Officer</div>
                </div>
              </div>
              {slaBreached && (
                <div className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 mt-2"
                  style={{ background: 'rgba(127,29,29,0.5)', border: '1px solid rgba(239,68,68,0.3)', animation: 'sla-pulse 1.5s ease-in-out infinite' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: '#F87171', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, color: '#FCA5A5' }}>1 SLA Breach Active</span>
                </div>
              )}
            </>
          )}

          {collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34D399', animation: 'status-dot 2s ease-in-out infinite' }} />
            </div>
          )}
        </div>

        {/* ZONE 3 — Nav */}
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1E3A5F transparent' }}>
          {NAV.map((entry, idx) => {
            if (entry.divider) {
              return <div key={`d-${idx}`} style={{ height: 1, background: 'rgba(71,85,105,0.2)', margin: collapsed ? '8px auto' : '8px 14px', width: collapsed ? 32 : 'auto' }} />;
            }
            if (entry.section) {
              if (collapsed) return null;
              return (
                <div key={`s-${idx}`}
                  style={{ height: 28, padding: '0 22px', display: 'flex', alignItems: 'center', marginTop: 8, fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {entry.section}
                </div>
              );
            }
            if (!entry.item) return null;

            const item = entry.item;
            const isActive = activePage === item.id;
            const isHovered = hoveredId === item.id;
            const isFraud = item.id === 'fraud';
            const isSecondary = item.secondary;
            const iconSz = item.iconSize ?? 18;

            let bg = 'transparent';
            let textColor = '#94A3B8';
            let iconColor = '#64748B';
            let fontWeight: number | string = 400;
            let borderLeft = '3px solid transparent';
            let boxShadow = 'none';

            if (isActive && !isSecondary) {
              bg = 'rgba(30,58,95,0.7)'; textColor = '#BFDBFE'; iconColor = '#60A5FA';
              borderLeft = '3px solid #60A5FA'; fontWeight = 700;
              boxShadow = 'inset 2px 0 8px rgba(96,165,250,0.1)';
            } else if (isActive && isSecondary) {
              bg = 'rgba(51,65,85,0.3)'; textColor = '#64748B'; iconColor = '#64748B';
            } else if (isHovered) {
              bg = 'rgba(30,58,95,0.4)'; textColor = '#BFDBFE'; iconColor = '#BFDBFE';
            }

            return (
              <div
                key={item.id}
                role="button" tabIndex={0}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label}${item.badge ? `, ${item.badge.count}` : ''}`}
                className="relative"
                style={{
                  height: 44, margin: '1px 8px', borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  padding: collapsed ? '0' : '0 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? 0 : 10,
                  background: bg, borderLeft, boxShadow,
                  transition: 'background 100ms',
                }}
                onClick={() => onNavigate(item.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNavigate(item.id); }}
                onMouseEnter={() => onEnter(item.id)}
                onMouseLeave={() => onLeave(item.id)}
              >
                <item.Icon
                  style={{
                    width: collapsed ? 22 : iconSz, height: collapsed ? 22 : iconSz,
                    color: iconColor, flexShrink: 0, transition: 'color 100ms',
                    animation: isFraud && !isActive && (item.badge?.count ?? 0) > 0 ? 'fraud-pulse 2s ease-in-out infinite' : undefined,
                  }}
                />

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <div className="flex-1 min-w-0">
                      {item.aiDot && (
                        <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: 2, background: 'rgba(167,139,250,0.6)', marginRight: 4, verticalAlign: 'middle' }} />
                      )}
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight, color: textColor, transition: 'color 100ms' }}>
                        {item.label}
                      </span>
                      {item.subLabel && (
                        <div style={{ fontFamily: item.subLabelMono ? 'DM Mono, monospace' : 'Inter, sans-serif', fontSize: 9, color: item.subLabelColor ?? 'rgba(96,165,250,0.6)', marginTop: -1, lineHeight: 1.3 }}>
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                    {item.badge && item.badge.count > 0 && <Badge spec={item.badge} />}
                    {item.id === 'dashboard' && slaBreached && (
                      <div title="1 SLA breached" style={{ width: 6, height: 6, borderRadius: 3, background: '#EF4444', animation: 'sla-pulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
                    )}
                  </div>
                )}

                {collapsed && item.badge && item.badge.count > 0 && (
                  <div style={{ position: 'absolute', top: 4, right: 4 }}>
                    <Badge spec={item.badge} small />
                  </div>
                )}

                {collapsed && <Tooltip text={getTooltipText(item)} visible={tooltipId === item.id} />}
              </div>
            );
          })}
        </div>

        {/* ZONE 4 — Footer */}
        <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(71,85,105,0.3)', padding: 8 }}>
          {/* Financial summary */}
          {!collapsed && (
            <div className="rounded-lg mb-2" style={{ background: 'rgba(30,58,95,0.4)', padding: '10px 12px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>APRIL 2026</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700, color: '#34D399' }}>AED 4.8M</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>claims processed</span>
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#93C5FD', marginBottom: 6 }}>312 today · 78.2% auto-approved</div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 6, height: 6, borderRadius: 3, background: '#34D399', animation: 'status-dot 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#6EE7B7' }}>247 sessions active</span>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
            className="flex items-center rounded-lg transition-colors w-full"
            style={{ height: 36, padding: collapsed ? '0' : '0 12px', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8, marginBottom: 4, background: 'transparent', color: '#64748B', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,58,95,0.4)'; e.currentTarget.style.color = '#94A3B8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
          >
            {collapsed
              ? <ChevronRight style={{ width: 16, height: 16 }} />
              : <><ChevronLeft style={{ width: 16, height: 16 }} /><span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }}>Collapse menu</span></>
            }
          </button>

          {/* Sign out */}
          <button
            onClick={() => setShowSignOut(true)}
            aria-label="Sign out"
            className="flex items-center rounded-lg transition-colors w-full"
            style={{ height: 40, padding: collapsed ? '0' : '0 12px', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, background: 'transparent', color: '#64748B', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(127,29,29,0.3)'; e.currentTarget.style.color = '#F87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
          >
            <LogOut style={{ width: collapsed ? 18 : 16, height: collapsed ? 18 : 16 }} />
            {!collapsed && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default InsuranceSidebar;
