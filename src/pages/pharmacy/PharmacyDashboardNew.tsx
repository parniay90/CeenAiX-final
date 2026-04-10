import React, { useState } from 'react';
import {
  Pill, Clock, AlertTriangle, CircleDollarSign, ShieldCheck,
  ChevronDown, ChevronUp, Package, MessageSquare, AlertCircle
} from 'lucide-react';
import { prescriptions } from '../../data/pharmacyData';

interface Props {
  onNavigate: (page: string, rxId?: string) => void;
}

const stockAlerts = [
  {
    id: 'sa1', type: 'out_of_stock', drug: 'Atorvastatin 20mg — Lipitor Brand',
    detail: 'Generic available: ✅', impact: '1 prescription on hold: Parnia Yazdkhasti',
  },
  {
    id: 'sa2', type: 'low', drug: 'Metformin 850mg',
    detail: '12 boxes remaining', impact: '~6 days supply at current rate',
  },
  {
    id: 'sa3', type: 'low', drug: 'Bisoprolol 5mg',
    detail: '8 boxes remaining', impact: '~4 days supply at current rate',
  },
  {
    id: 'sa4', type: 'expiring', drug: 'Warfarin 5mg — Batch BT-2025-WAR5-002',
    detail: 'Expires: 30 April 2026 (23 days)', impact: 'Qty: 240 tabs — use before expiry',
  },
];

const recentMessages = [
  {
    id: 'rm1',
    type: 'awaiting',
    title: 'Al Shifa Pharmacy → Dr. Ahmed Al Rashidi',
    body: 'Query: Atorvastatin generic substitution for Parnia Yazdkhasti. Sent 1:15 PM.',
    note: 'Awaiting response...',
    action: 'Follow Up',
  },
  {
    id: 'rm2',
    type: 'sent',
    title: 'Patient notified: Parnia Yazdkhasti',
    body: 'Prescription on hold — pharmacist query sent to Dr. Ahmed.',
    note: 'Sent via app: 1:16 PM',
    action: null,
  },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  new: { label: 'NEW', bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6' },
  in_progress: { label: 'IN PROGRESS', bg: '#F0FDFA', text: '#0F766E', border: '#14B8A6' },
  on_hold: { label: 'ON HOLD', bg: '#FFFBEB', text: '#B45309', border: '#F59E0B' },
  dispensed: { label: 'DONE', bg: '#F0FDF4', text: '#15803D', border: '#22C55E' },
  upcoming: { label: 'UPCOMING', bg: '#F8FAFC', text: '#475569', border: '#94A3B8' },
  cancelled: { label: 'CANCELLED', bg: '#F8FAFC', text: '#94A3B8', border: '#CBD5E1' },
};

const PharmacyDashboardNew: React.FC<Props> = ({ onNavigate }) => {
  const [showDispensed, setShowDispensed] = useState(false);

  const queueRxs = prescriptions.filter(p => p.status === 'new' || p.status === 'in_progress' || p.status === 'on_hold');
  const upcomingRxs = prescriptions.filter(p => p.status === 'upcoming');
  const dispensedRxs = prescriptions.filter(p => p.status === 'dispensed');

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F8FAFC' }}>
      {/* Stock Alert Banner */}
      <div className="mx-6 mt-5 rounded-xl border px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: '#FFFBEB', borderColor: '#FCD34D' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-amber-800" style={{ fontSize: 13 }}>
            4 stock alerts require attention: &nbsp;
          </span>
          <span className="text-amber-700" style={{ fontSize: 12 }}>
            Atorvastatin 20mg OUT OF STOCK · Metformin LOW · Bisoprolol LOW · Warfarin EXPIRING 30 Apr
          </span>
        </div>
        <button
          onClick={() => onNavigate('inventory')}
          className="text-white rounded-lg px-3 py-1.5 font-semibold flex-shrink-0 transition-colors"
          style={{ background: '#D97706', fontSize: 12 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B45309'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#D97706'; }}
        >
          View Inventory
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-4 mx-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Pill className="w-5 h-5" style={{ color: '#059669' }} />
            </div>
          </div>
          <div className="font-bold text-slate-900" style={{ fontFamily: 'DM Mono, monospace', fontSize: 30 }}>12</div>
          <div className="uppercase tracking-widest text-slate-400 mb-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>Prescriptions Today</div>
          <div className="text-slate-400 mb-2" style={{ fontSize: 11 }}>8 dispensed · 3 in queue · 1 on hold</div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '67%', background: '#059669' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm" style={{ borderColor: '#93C5FD' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1" />
          </div>
          <div className="font-bold text-blue-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 30 }}>3</div>
          <div className="uppercase tracking-widest text-slate-400 mb-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>In Queue</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>Oldest: 5 min wait (Parnia Yazdkhasti)</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1" />
          </div>
          <div className="font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 30 }}>4</div>
          <div className="uppercase tracking-widest text-slate-400 mb-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>Stock Alerts</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>1 out of stock · 2 low · 1 expiring</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5" style={{ color: '#059669' }} />
            </div>
          </div>
          <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, color: '#059669' }}>AED 1,847</div>
          <div className="uppercase tracking-widest text-slate-400 mb-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>Revenue Today</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>AED 527 collected · AED 1,320 insurance</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" style={{ color: '#059669' }} />
            </div>
          </div>
          <div className="font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#059669' }}>Compliant ✅</div>
          <div className="uppercase tracking-widest text-slate-400 mb-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>DHA Status</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>8/8 records submitted today</div>
        </div>
      </div>

      {/* Prescription Queue */}
      <div className="mx-6 mt-4 bg-white rounded-xl border border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
              Prescription Queue
            </h2>
            <div className="text-slate-400" style={{ fontSize: 12 }}>Pending dispensing — sorted by wait time</div>
          </div>
          <button
            onClick={() => onNavigate('prescriptions')}
            className="font-medium transition-colors"
            style={{ fontSize: 13, color: '#059669' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#047857'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#059669'; }}
          >
            View All →
          </button>
        </div>

        {[...queueRxs, ...upcomingRxs].map(rx => {
          const cfg = statusConfig[rx.status] || statusConfig.upcoming;
          const drugNames = rx.drugs.map(d => `${d.genericName} ${d.strength}`).join(' + ') || '—';
          return (
            <div
              key={rx.id}
              className="flex items-center gap-4 px-5 transition-colors cursor-pointer"
              style={{ height: 80, borderBottom: '1px solid #F8FAFC', borderLeft: `4px solid ${cfg.border}` }}
              onClick={() => rx.status !== 'upcoming' && onNavigate('dispense', rx.id)}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0FDF4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ width: 90, flexShrink: 0 }}>
                <span
                  className="font-bold rounded-full px-2 py-0.5"
                  style={{
                    fontSize: 10, background: cfg.bg, color: cfg.text,
                  }}
                >
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-3" style={{ width: 200, flexShrink: 0 }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${rx.patientAvatarColor}`}
                  style={{ fontSize: 13 }}
                >
                  {rx.patientInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate" style={{ fontSize: 13 }}>
                    {rx.patientName}
                    {rx.allergies.length > 0 && (
                      <span className="ml-1" style={{ color: '#EF4444', fontSize: 10 }}>⚠️</span>
                    )}
                  </div>
                  <div className="text-slate-400 truncate" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                    {rx.patientId} · {rx.patientAge}{rx.patientGender} · {rx.insurance}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-slate-600 truncate" style={{ fontSize: 12 }}>{rx.doctorName}</div>
                <div className="text-slate-500 truncate" style={{ fontSize: 12 }}>{drugNames}</div>
                <div className="text-slate-300 font-mono" style={{ fontSize: 10 }}>
                  {rx.rxRef !== '—' ? rx.rxRef : rx.arrivingETA}
                </div>
              </div>

              <div style={{ width: 150, flexShrink: 0 }}>
                <div className="text-slate-600" style={{ fontSize: 11 }}>
                  {rx.insurance} · {rx.copay > 0 ? `AED ${rx.copay}` : 'AED 0'}
                </div>
                {rx.arrivingETA && (
                  <div style={{ fontSize: 10, color: '#059669' }}>{rx.arrivingETA}</div>
                )}
                {rx.holdReason && (
                  <div className="text-amber-600 truncate" style={{ fontSize: 10, maxWidth: 150 }}>{rx.holdReason.slice(0, 38)}...</div>
                )}
                <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                  {rx.receivedTime} · {rx.receivedTimeAgo}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                {rx.status === 'new' && (
                  <button
                    onClick={() => onNavigate('dispense', rx.id)}
                    className="text-white rounded-lg px-3 py-1.5 font-semibold transition-colors"
                    style={{ background: '#059669', fontSize: 11 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                  >
                    Dispense
                  </button>
                )}
                {rx.status === 'on_hold' && (
                  <button
                    onClick={() => onNavigate('messages')}
                    className="text-amber-700 rounded-lg px-3 py-1.5 font-semibold transition-colors"
                    style={{ background: '#FEF3C7', fontSize: 11 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FDE68A'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                  >
                    Follow Up
                  </button>
                )}
                {rx.status === 'upcoming' && (
                  <button
                    className="text-slate-600 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-slate-200"
                    style={{ background: '#F1F5F9', fontSize: 11 }}
                  >
                    Pre-Alert
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setShowDispensed(!showDispensed)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors text-left"
          style={{ borderTop: '1px solid #F1F5F9' }}
        >
          <span className="text-slate-500 font-medium" style={{ fontSize: 13 }}>
            {dispensedRxs.length} dispensed prescriptions today
          </span>
          {showDispensed ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showDispensed && dispensedRxs.map(rx => (
          <div
            key={rx.id}
            className="flex items-center gap-4 px-5"
            style={{ height: 64, borderBottom: '1px solid #F8FAFC', borderLeft: '4px solid #22C55E', background: '#FAFFFE' }}
          >
            <div style={{ width: 90, flexShrink: 0 }}>
              <span className="font-bold rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700" style={{ fontSize: 10 }}>DONE ✅</span>
            </div>
            <div className="flex items-center gap-3" style={{ width: 200, flexShrink: 0 }}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${rx.patientAvatarColor}`} style={{ fontSize: 12 }}>
                {rx.patientInitials}
              </div>
              <div>
                <div className="font-medium text-slate-600" style={{ fontSize: 12 }}>{rx.patientName}</div>
                <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{rx.dispensedTime} · {rx.dhaRecord}</div>
              </div>
            </div>
            <div className="flex-1 text-slate-400" style={{ fontSize: 11 }}>
              {rx.drugs.map(d => `${d.genericName} ${d.strength}`).join(' · ')}
            </div>
            <div className="font-medium" style={{ fontSize: 11, color: '#059669' }}>AED {rx.copay} collected ✅</div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-4 mx-6 mt-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
              Stock Alerts
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {stockAlerts.map(alert => (
              <div
                key={alert.id}
                className="px-5 py-3.5"
                style={{
                  background: alert.type === 'out_of_stock' ? '#FEF2F2' : alert.type === 'expiring' ? '#FFF7ED' : '#FFFBEB',
                  borderLeft: `3px solid ${alert.type === 'out_of_stock' ? '#EF4444' : alert.type === 'expiring' ? '#F97316' : '#F59E0B'}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>{alert.drug}</div>
                    <div className="text-slate-500 mt-0.5" style={{ fontSize: 11 }}>{alert.detail}</div>
                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: 11,
                        color: alert.type === 'out_of_stock' ? '#DC2626' : '#92400E',
                      }}
                    >
                      {alert.impact}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {alert.type === 'out_of_stock' ? (
                      <>
                        <button
                          onClick={() => onNavigate('inventory')}
                          className="text-red-700 rounded-md px-2.5 py-1 font-semibold whitespace-nowrap transition-colors hover:bg-red-100"
                          style={{ background: '#FEE2E2', fontSize: 10 }}
                        >
                          Order Urgently
                        </button>
                        <button
                          className="text-emerald-700 rounded-md px-2.5 py-1 font-medium whitespace-nowrap transition-colors hover:bg-emerald-100"
                          style={{ background: '#D1FAE5', fontSize: 10 }}
                        >
                          Use Generic
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onNavigate('inventory')}
                        className="text-amber-700 rounded-md px-2.5 py-1 font-semibold whitespace-nowrap transition-colors hover:bg-amber-100"
                        style={{ background: '#FEF3C7', fontSize: 10 }}
                      >
                        {alert.type === 'expiring' ? 'View Batch' : 'Order Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
                Messages
              </h3>
            </div>
            <button
              onClick={() => onNavigate('messages')}
              className="font-medium transition-colors"
              style={{ fontSize: 12, color: '#059669' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#047857'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#059669'; }}
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMessages.map(msg => (
              <div
                key={msg.id}
                className="px-5 py-4"
                style={{ background: msg.type === 'awaiting' ? '#FFFBEB' : '#FFFFFF' }}
              >
                <div className="font-semibold text-slate-700 mb-0.5" style={{ fontSize: 12 }}>{msg.title}</div>
                <div className="text-slate-500 mb-1" style={{ fontSize: 12 }}>{msg.body}</div>
                <div
                  className="italic mb-2"
                  style={{
                    fontSize: 11,
                    color: msg.type === 'awaiting' ? '#D97706' : '#22C55E',
                  }}
                >
                  {msg.note}
                </div>
                {msg.action && (
                  <button
                    onClick={() => onNavigate('messages')}
                    className="text-amber-700 rounded-md px-2.5 py-1 font-semibold transition-colors hover:bg-amber-100"
                    style={{ background: '#FEF3C7', fontSize: 11 }}
                  >
                    {msg.action}
                  </button>
                )}
              </div>
            ))}

            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4" style={{ color: '#059669' }} />
                <span className="font-semibold text-slate-700" style={{ fontSize: 12 }}>CeenAiX ePrescription</span>
                <span className="font-medium" style={{ fontSize: 11, color: '#059669' }}>Connected ✅</span>
              </div>
              <div className="text-slate-400" style={{ fontSize: 11 }}>
                Connected to Dr. Ahmed Al Rashidi + 6 other CeenAiX doctors
              </div>
              <div className="text-slate-400 mt-0.5" style={{ fontSize: 11 }}>
                NABIDH HIE: Synced ✅ · Last sync: 2:05 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboardNew;
