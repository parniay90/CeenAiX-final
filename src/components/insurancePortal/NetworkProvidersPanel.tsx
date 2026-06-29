import React from 'react';
import { Building2, ArrowUpRight } from 'lucide-react';
import type { NetworkProvider } from '../../types/insurancePortal';

interface Props {
  providers: NetworkProvider[];
  onNavigate: (page: string) => void;
}

const RiskBadge: React.FC<{ risk: string; flagged?: boolean }> = ({ risk, flagged }) => {
  const config = {
    LOW:      { bg: '#DCFCE7', color: '#065F46' },
    MEDIUM:   { bg: '#FEF3C7', color: '#92400E' },
    HIGH:     { bg: '#FEE2E2', color: '#991B1B' },
    CRITICAL: { bg: '#FEE2E2', color: '#7F1D1D' },
  }[risk] ?? { bg: '#F1F5F9', color: '#64748B' };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 ${flagged ? 'animate-pulse' : ''}`}
      style={{ background: config.bg, color: config.color, fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}
    >
      {risk}
    </span>
  );
};

const NetworkProvidersPanel: React.FC<Props> = ({ providers, onNavigate }) => (
  <div
    className="rounded-xl"
    style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #0D9488', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div className="flex items-center gap-2">
        <Building2 style={{ width: 14, height: 14, color: '#0D9488' }} />
        <div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
            Top Network Providers
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>by claims volume this month</span>
        </div>
      </div>
      <button
        onClick={() => onNavigate('network')}
        className="flex items-center gap-1 transition-colors"
        style={{ fontSize: 11, color: '#0D9488', fontWeight: 600 }}
        onMouseEnter={e => { e.currentTarget.style.color = '#0F766E'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#0D9488'; }}
      >
        View all <ArrowUpRight style={{ width: 11, height: 11 }} />
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
            {['Provider', 'Claims', 'Avg Value', 'Denial %', 'Fraud Risk'].map(col => (
              <th
                key={col}
                className="text-left px-4 py-2.5"
                style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {providers.map((p, idx) => (
            <tr
              key={p.id}
              onClick={() => onNavigate('network')}
              className="cursor-pointer transition-colors"
              style={{
                borderBottom: idx < providers.length - 1 ? '1px solid #F8FAFC' : 'none',
                background: p.flagged ? 'rgba(254,226,226,0.4)' : 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = p.flagged ? 'rgba(254,226,226,0.6)' : '#F8FAFC'; }}
              onMouseLeave={e => { e.currentTarget.style.background = p.flagged ? 'rgba(254,226,226,0.4)' : 'transparent'; }}
            >
              <td className="px-4 py-2.5" style={{ minWidth: 160 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.flagged ? '#DC2626' : '#0F172A', lineHeight: 1.3 }}>
                  {p.name}
                </div>
                {p.note && (
                  <div style={{ fontSize: 10, color: p.flagged ? '#DC2626' : p.denialRate > 6 ? '#D97706' : '#059669', marginTop: 1 }}>
                    {p.note}
                  </div>
                )}
              </td>
              <td className="px-4 py-2.5">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                  {p.claims.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#475569' }}>
                  AED {p.avgValue.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: p.denialRate > 6 ? '#D97706' : '#059669' }}>
                  {p.denialRate}%
                </span>
              </td>
              <td className="px-4 py-2.5">
                <RiskBadge risk={p.fraudScore} flagged={p.flagged} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default NetworkProvidersPanel;
