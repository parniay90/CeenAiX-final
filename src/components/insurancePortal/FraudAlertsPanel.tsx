import React, { useState } from 'react';
import { ShieldAlert, Search, Lock, ChevronDown } from 'lucide-react';
import type { FraudAlert } from '../../types/insurancePortal';

interface Props {
  alerts: FraudAlert[];
}

const riskConfig = {
  HIGH: { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B', dot: '#DC2626', label: '🔴 HIGH' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', color: '#7F1D1D', dot: '#DC2626', label: '🔴 CRITICAL' },
  MEDIUM: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', dot: '#D97706', label: '🟡 MEDIUM' },
  LOW: { bg: '#F0FDF4', border: '#BBF7D0', color: '#065F46', dot: '#059669', label: '🟢 LOW' },
};

const FraudAlertsPanel: React.FC<Props> = ({ alerts }) => {
  const [showMedium, setShowMedium] = useState(false);

  const highAlerts = alerts.filter(a => a.risk === 'HIGH' || a.risk === 'CRITICAL');
  const mediumAlerts = alerts.filter(a => a.risk === 'MEDIUM' || a.risk === 'LOW');

  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: '4px solid #DC2626' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-red-600" />
          <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
            Fraud Alerts
          </h3>
          <span className="text-red-400" style={{ fontSize: 12 }}>5 active · AI-flagged</span>
        </div>
        <button className="text-red-500 font-semibold hover:text-red-700 transition-colors" style={{ fontSize: 11 }}>
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {highAlerts.map(alert => {
          const cfg = riskConfig[alert.risk];
          return (
            <div
              key={alert.id}
              className="rounded-xl p-3.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: cfg.dot }} />
                  <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: cfg.color }}>
                    {cfg.label} ({alert.confidence}% confidence)
                  </span>
                </div>
              </div>
              <p className="font-bold text-slate-800 mb-0.5" style={{ fontSize: 12 }}>{alert.subject}</p>
              <p className="text-slate-600 mb-2" style={{ fontSize: 11 }}>{alert.pattern}</p>
              <p className="font-bold mb-3" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#DC2626' }}>
                Amount at risk: AED {alert.amountAtRisk.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white font-bold transition-colors hover:bg-red-700"
                  style={{ background: '#DC2626', fontSize: 11 }}
                >
                  <Search size={11} />
                  Investigate
                </button>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-colors hover:bg-red-50"
                  style={{ border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 11 }}
                >
                  <Lock size={11} />
                  Freeze Claims
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {mediumAlerts.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowMedium(v => !v)}
            className="flex items-center gap-1.5 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            style={{ fontSize: 11 }}
          >
            <ChevronDown size={13} className={`transition-transform ${showMedium ? 'rotate-180' : ''}`} />
            {mediumAlerts.length} medium risk alerts
          </button>

          {showMedium && (
            <div className="mt-2 space-y-2">
              {mediumAlerts.map(alert => {
                const cfg = riskConfig[alert.risk];
                return (
                  <div
                    key={alert.id}
                    className="rounded-xl p-3"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                      <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: cfg.color }}>
                        {cfg.label} ({alert.confidence}%)
                      </span>
                      <span className="ml-auto font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#D97706' }}>
                        AED {alert.amountAtRisk.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700" style={{ fontSize: 11 }}>{alert.subject}</p>
                    <p className="text-slate-500" style={{ fontSize: 10 }}>{alert.pattern}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FraudAlertsPanel;
