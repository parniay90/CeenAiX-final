import React, { useState, useEffect } from 'react';
import { ClipboardList, FileText, Zap, AlertTriangle, Clock, Users } from 'lucide-react';

interface KpiCard {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  valueColor: string;
  label: string;
  sub1: string;
  sub2?: string;
  sub2Color?: string;
  pulse?: boolean;
  navTarget: string;
}

const cards: KpiCard[] = [
  {
    icon: ClipboardList,
    iconBg: '#FEF3C7', iconColor: '#D97706',
    value: '16', valueColor: '#D97706',
    label: 'PENDING PRE-AUTHORIZATIONS',
    sub1: '8 urgent (4h) · 8 standard',
    pulse: true,
    navTarget: 'preauth',
  },
  {
    icon: FileText,
    iconBg: '#DBEAFE', iconColor: '#2563EB',
    value: '312', valueColor: '#1E293B',
    label: 'CLAIMS SUBMITTED TODAY',
    sub1: 'AED 1,247,840',
    sub2: '78.2% auto-approved',
    sub2Color: '#059669',
    navTarget: 'claims',
  },
  {
    icon: Zap,
    iconBg: '#D1FAE5', iconColor: '#059669',
    value: '78.2%', valueColor: '#059669',
    label: 'AI AUTO-APPROVAL RATE',
    sub1: '244 of 312 claims today',
    sub2: '↑ +2.1% vs last week',
    sub2Color: '#059669',
    navTarget: 'analytics',
  },
  {
    icon: AlertTriangle,
    iconBg: '#FEE2E2', iconColor: '#DC2626',
    value: '5', valueColor: '#DC2626',
    label: 'ACTIVE FRAUD ALERTS',
    sub1: '2 HIGH risk · 3 medium',
    pulse: true,
    navTarget: 'fraud',
  },
  {
    icon: Clock,
    iconBg: '#CCFBF1', iconColor: '#0D9488',
    value: '4.2h', valueColor: '#0D9488',
    label: 'AVG PROCESSING TIME',
    sub1: 'DHA target: 8h standard ✅',
    sub2: '4h urgent ⚠️ (1 breach)',
    sub2Color: '#D97706',
    navTarget: 'analytics',
  },
  {
    icon: Users,
    iconBg: '#DBEAFE', iconColor: '#2563EB',
    value: '8,247', valueColor: '#2563EB',
    label: 'ACTIVE MEMBERS ON CEENAIX',
    sub1: 'Gold 2,847 · Silver 3,104 · Basic 1,892',
    navTarget: 'members',
  },
];

interface Props {
  onNavigate: (page: string) => void;
}

const KpiCard: React.FC<{ card: KpiCard; idx: number; onNavigate: (page: string) => void }> = ({ card, idx, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150 + idx * 60);
    return () => clearTimeout(t);
  }, [idx]);

  const Icon = card.icon;
  return (
    <div
      onClick={() => onNavigate(card.navTarget)}
      className="flex flex-col rounded-2xl p-4 cursor-pointer transition-all duration-200"
      style={{
        background: '#fff',
        border: card.pulse ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 400ms ease, transform 400ms ease, box-shadow 150ms, background 150ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,95,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: card.iconBg }}
        >
          <Icon style={{ width: 20, height: 20, color: card.iconColor }} />
        </div>
        {card.pulse && (
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: card.iconColor }} />
        )}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 30, fontWeight: 700, color: card.valueColor, lineHeight: 1, marginBottom: 4 }}>
        {card.value}
      </div>
      <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>
        {card.label}
      </div>
      <div style={{ fontSize: 11, color: '#64748B' }}>{card.sub1}</div>
      {card.sub2 && (
        <div style={{ fontSize: 11, color: card.sub2Color ?? '#64748B', marginTop: 2 }}>{card.sub2}</div>
      )}
      <div className="mt-auto pt-3 flex items-center gap-1" style={{ fontSize: 10, color: '#94A3B8' }}>
        <span>View details →</span>
      </div>
    </div>
  );
};

const KpiStrip: React.FC<Props> = ({ onNavigate }) => (
  <div className="grid grid-cols-6 gap-4 mb-5">
    {cards.map((card, idx) => (
      <KpiCard key={card.label} card={card} idx={idx} onNavigate={onNavigate} />
    ))}
  </div>
);

export default KpiStrip;
