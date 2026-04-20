import React from 'react';
import { Building2 } from 'lucide-react';
import type { NetworkProvider } from '../../types/insurancePortal';

interface Props {
  providers: NetworkProvider[];
  onNavigate: (page: string) => void;
}

const FraudBadge: React.FC<{ risk: string; flagged?: boolean }> = ({ risk, flagged }) => {
  const config = {
    LOW: { bg: '#ECFDF5', color: '#065F46', label: '🟢 Low' },
    MEDIUM: { bg: '#FFFBEB', color: '#92400E', label: '🟡 Medium' },
    HIGH: { bg: '#FEF2F2', color: '#991B1B', label: '🔴 HIGH' },
    CRITICAL: { bg: '#FEF2F2', color: '#7F1D1D', label: '🔴 CRITICAL' },
  }[risk] ?? { bg: '#F1F5F9', color: '#64748B', label: risk };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold ${flagged ? 'animate-pulse' : ''}`}
      style={{ background: config.bg, color: config.color, fontSize: 10 }}
    >
      {config.label}
    </span>
  );
};

const NetworkProvidersPanel: React.FC<Props> = ({ providers, onNavigate }) => {
  return (
    <div className="bg-white rounded-2xl" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <Building2 size={15} style={{ color: '#0F2D4A' }} />
          <div>
            <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
              Top Network Providers
            </h3>
            <p className="text-slate-400" style={{ fontSize: 11 }}>By claims volume this month</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('network')}
          className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
          style={{ fontSize: 11 }}
        >
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              {['Provider', 'Claims', 'Avg Value', 'Denial %', 'Fraud Score'].map(col => (
                <th
                  key={col}
                  className="text-left text-slate-400 font-semibold uppercase px-4 py-2.5"
                  style={{ fontSize: 9, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers.map(p => (
              <tr
                key={p.id}
                onClick={() => onNavigate('network')}
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${p.flagged ? 'bg-red-50/40' : ''}`}
                style={{ borderBottom: '1px solid #F8FAFC' }}
              >
                <td className="px-4 py-2.5" style={{ minWidth: 160 }}>
                  <p className={`font-bold leading-tight ${p.flagged ? 'text-red-700' : 'text-slate-800'}`} style={{ fontSize: 12 }}>
                    {p.name}
                  </p>
                  {p.note && (
                    <p
                      className="italic leading-tight mt-0.5"
                      style={{ fontSize: 9, color: p.flagged ? '#DC2626' : p.denialRate > 6 ? '#D97706' : '#059669' }}
                    >
                      {p.note}
                    </p>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-bold text-slate-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                    {p.claims.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-medium text-slate-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                    AED {p.avgValue}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 12,
                      color: p.denialRate > 6 ? '#D97706' : '#059669',
                    }}
                  >
                    {p.denialRate}%
                  </span>
                  <span className="ml-1" style={{ fontSize: 10 }}>
                    {p.denialRate > 6 ? '⚠' : '✅'}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <FraudBadge risk={p.fraudScore} flagged={p.flagged} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkProvidersPanel;
