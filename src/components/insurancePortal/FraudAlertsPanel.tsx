import React, { useState } from 'react';
import { ShieldAlert, Search, Lock, ChevronDown } from 'lucide-react';
import type { FraudAlert } from '../../types/insurancePortal';

interface Props {
  alerts: FraudAlert[];
  onNavigate: (page: string) => void;
}

const riskConfig = {
  HIGH:     { dot: '#DC2626', label: 'HIGH',     labelBg: '#FEE2E2', labelColor: '#991B1B' },
  CRITICAL: { dot: '#DC2626', label: 'CRITICAL', labelBg: '#FEE2E2', labelColor: '#7F1D1D' },
  MEDIUM:   { dot: '#D97706', label: 'MEDIUM',   labelBg: '#FEF3C7', labelColor: '#92400E' },
  LOW:      { dot: '#059669', label: 'LOW',       labelBg: '#DCFCE7', labelColor: '#065F46' },
};

const FraudAlertsPanel: React.FC<Props> = ({ alerts, onNavigate }) => {
  const [showMedium, setShowMedium] = useState(false);

  const highAlerts = alerts.filter(a => a.risk === 'HIGH' || a.risk === 'CRITICAL');
  const mediumAlerts = alerts.filter(a => a.risk === 'MEDIUM' || a.risk === 'LOW');

  return (
    <div
      className="rounded-xl"
      style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #DC2626', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <ShieldAlert style={{ width: 14, height: 14, color: '#DC2626' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
            Fraud Alerts
          </span>
          <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', fontFamily: 'DM Mono, monospace' }}>
            5
          </span>
        </div>
        <button
          onClick={() => onNavigate('fraud')}
          style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#B91C1C'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#DC2626'; }}
        >
          View all →
        </button>
      </div>

      <div className="p-4 space-y-3">
        {highAlerts.map(alert => {
          const cfg = riskConfig[alert.risk];
          return (
            <div
              key={alert.id}
              className="rounded-lg p-3"
              style={{ background: '#FFF5F5', border: '1px solid #FECACA' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: cfg.dot }} />
                <span
                  className="rounded px-1.5 py-0.5"
                  style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: cfg.labelColor, background: cfg.labelBg }}
                >
                  {cfg.label}
                </span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8' }}>
                  {alert.confidence}% confidence
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                {alert.subject}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
                {alert.pattern}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 11, color: '#475569' }}>Amount at risk</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 800, color: '#DC2626' }}>
                  AED {alert.amountAtRisk.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onNavigate('fraud'); }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors"
                  style={{ background: '#DC2626', color: '#fff', fontSize: 11, fontWeight: 700 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
                >
                  <Search style={{ width: 11, height: 11 }} />
                  Investigate
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onNavigate('fraud'); }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors"
                  style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontSize: 11, fontWeight: 600 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FECACA'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                >
                  <Lock style={{ width: 11, height: 11 }} />
                  Freeze
                </button>
              </div>
            </div>
          );
        })}

        {mediumAlerts.length > 0 && (
          <div>
            <button
              onClick={() => setShowMedium(v => !v)}
              className="flex items-center gap-1.5 transition-colors"
              style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#B45309'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#D97706'; }}
            >
              <ChevronDown style={{ width: 13, height: 13, transform: showMedium ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
              {mediumAlerts.length} medium risk alerts
            </button>

            {showMedium && (
              <div className="mt-2 space-y-2">
                {mediumAlerts.map(alert => {
                  const cfg = riskConfig[alert.risk];
                  return (
                    <div
                      key={alert.id}
                      onClick={() => onNavigate('fraud')}
                      className="rounded-lg p-3 cursor-pointer transition-colors"
                      style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#FFFBEB'; }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: cfg.labelColor }}>
                          {cfg.label} · {alert.confidence}%
                        </span>
                        <span className="ml-auto" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#D97706' }}>
                          AED {alert.amountAtRisk.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>{alert.subject}</div>
                      <div style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>{alert.pattern}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAlertsPanel;
