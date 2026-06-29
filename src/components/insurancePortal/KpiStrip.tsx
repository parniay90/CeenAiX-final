import React, { useState, useEffect } from 'react';
import { ClipboardList, FileText, Zap, AlertTriangle, Clock, Users } from 'lucide-react';

interface KpiCard {
  icon: React.ElementType;
  accent: string;
  value: string;
  label: string;
  sub: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  pulse?: boolean;
  navTarget: string;
}

const cards: KpiCard[] = [
  {
    icon: ClipboardList,
    accent: '#F59E0B',
    value: '16',
    label: 'Pending Pre-Auths',
    sub: '8 urgent · 8 standard',
    badge: '1 OVERDUE',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    pulse: true,
    navTarget: 'preauth',
  },
  {
    icon: FileText,
    accent: '#2563EB',
    value: '312',
    label: 'Claims Today',
    sub: 'AED 1,247,840 total value',
    badge: '42 pending',
    badgeColor: '#2563EB',
    badgeBg: '#DBEAFE',
    navTarget: 'claims',
  },
  {
    icon: Zap,
    accent: '#059669',
    value: '78.2%',
    label: 'AI Auto-Approval',
    sub: '244 of 312 claims approved',
    badge: '↑ +2.1%',
    badgeColor: '#059669',
    badgeBg: '#DCFCE7',
    navTarget: 'analytics',
  },
  {
    icon: AlertTriangle,
    accent: '#DC2626',
    value: '5',
    label: 'Fraud Alerts',
    sub: '2 HIGH · 3 MEDIUM risk',
    badge: '2 HIGH',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    pulse: true,
    navTarget: 'fraud',
  },
  {
    icon: Clock,
    accent: '#0D9488',
    value: '4.2h',
    label: 'Avg Processing',
    sub: 'DHA 4h urgent · 8h standard',
    badge: '1 breach',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    navTarget: 'analytics',
  },
  {
    icon: Users,
    accent: '#7C3AED',
    value: '8,247',
    label: 'Active Members',
    sub: 'Gold · Silver · Basic',
    navTarget: 'members',
  },
];

interface Props {
  onNavigate: (page: string) => void;
}

const KpiCard: React.FC<{ card: KpiCard; idx: number; onNavigate: (page: string) => void }> = ({ card, idx, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 60);
    return () => clearTimeout(t);
  }, [idx]);

  const Icon = card.icon;

  return (
    <div
      onClick={() => onNavigate(card.navTarget)}
      className="cursor-pointer rounded-xl flex flex-col"
      style={{
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        borderLeft: `3px solid ${card.accent}`,
        padding: '16px 16px 14px',
        boxShadow: hovered ? `0 4px 16px rgba(0,0,0,0.1)` : '0 1px 3px rgba(0,0,0,0.05)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 350ms ease, transform 350ms ease, box-shadow 150ms, border-color 150ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.accent}18` }}>
          <Icon style={{ width: 15, height: 15, color: card.accent }} />
        </div>
        {card.badge && (
          <span
            className="rounded-full px-2 py-0.5"
            style={{ fontSize: 10, fontWeight: 700, color: card.badgeColor, background: card.badgeBg, fontFamily: 'DM Mono, monospace' }}
          >
            {card.pulse && <span className="inline-block w-1 h-1 rounded-full mr-1 align-middle animate-pulse" style={{ background: card.badgeColor }} />}
            {card.badge}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1, marginBottom: 4 }}>
        {card.value}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
        {card.label}
      </div>

      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 'auto' }}>
        {card.sub}
      </div>
    </div>
  );
};

const KpiStrip: React.FC<Props> = ({ onNavigate }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    {cards.map((card, idx) => (
      <KpiCard key={card.label} card={card} idx={idx} onNavigate={onNavigate} />
    ))}
  </div>
);

export default KpiStrip;
