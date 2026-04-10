import React, { useState } from 'react';
import {
  Pill, Clock, AlertTriangle, CircleDollarSign, ShieldCheck,
  ChevronDown, ChevronRight, Package, MessageSquare, X
} from 'lucide-react';
import { prescriptions, inventoryItems, messages, Prescription } from '../../data/pharmacyData';

interface Props {
  onNavigate: (page: string, rxId?: string) => void;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  on_hold: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-teal-100 text-teal-700',
  dispensed: 'bg-emerald-100 text-emerald-700',
  upcoming: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-slate-100 text-slate-400',
};

const statusLabels: Record<string, string> = {
  new: 'NEW',
  on_hold: 'ON HOLD',
  in_progress: 'IN PROGRESS',
  dispensed: 'DONE',
  upcoming: 'UPCOMING',
  cancelled: 'CANCELLED',
};

const statusBorderColors: Record<string, string> = {
  new: 'border-l-blue-500',
  on_hold: 'border-l-amber-500',
  in_progress: 'border-l-teal-500',
  dispensed: 'border-l-emerald-500',
  upcoming: 'border-l-slate-300',
};

const stockColors: Record<string, string> = {
  out_of_stock: 'bg-red-50 border-l-red-500',
  low: 'bg-amber-50 border-l-amber-500',
  critical: 'bg-orange-50 border-l-orange-500',
  expiring_soon: 'bg-orange-50 border-l-orange-400',
  in_stock: 'bg-white',
};

const PharmacyDashboardNew: React.FC<Props> = ({ onNavigate }) => {
  const [dispensedOpen, setDispensedOpen] = useState(false);
  const [holdModalRx, setHoldModalRx] = useState<Prescription | null>(null);

  const queue = prescriptions.filter(p => p.status === 'new' || p.status === 'on_hold' || p.status === 'upcoming');
  const dispensed = prescriptions.filter(p => p.status === 'dispensed');
  const stockAlerts = inventoryItems.filter(i =>
    i.stockStatus === 'out_of_stock' || i.stockStatus === 'low' || i.stockStatus === 'expiring_soon'
  );
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-full">
      {/* Stock Alert Banner */}
      {stockAlerts.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <span className="font-semibold text-amber-800" style={{ fontSize: 13 }}>
              {stockAlerts.length} stock alerts require attention: &nbsp;
            </span>
            <span className="text-amber-700" style={{ fontSize: 13 }}>
              Atorvastatin 20mg OUT OF STOCK · Metformin LOW · Bisoprolol LOW · Warfarin EXPIRING 30 Apr
            </span>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="flex-shrink-0 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors"
          >
            View Inventory
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900" style={{ fontFamily: 'DM Mono, monospace', fontSize: 28 }}>12</div>
            </div>
          </div>
          <div className="text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>Prescriptions Today</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>8 dispensed · 3 in queue · 1 on hold</div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="font-bold text-blue-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 28 }}>3</div>
          </div>
          <div className="text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>In Queue</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>Oldest: 5 min wait (Parnia Yazdkhasti)</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div className="font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 28 }}>4</div>
          </div>
          <div className="text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>Stock Alerts</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>1 out of stock · 2 low · 1 expiring</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-bold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 22 }}>AED 1,847</div>
          </div>
          <div className="text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>Revenue Today</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>AED 527 collected · AED 1,320 insurance</div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-bold text-emerald-600" style={{ fontSize: 16 }}>Compliant ✅</div>
          </div>
          <div className="text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>DHA Dispensing Status</div>
          <div className="text-slate-400" style={{ fontSize: 11 }}>8/8 records submitted today</div>
        </div>
      </div>

      {/* Prescription Queue */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
              Prescription Queue
            </h2>
            <div className="text-slate-400" style={{ fontSize: 12 }}>Pending dispensing — sorted by wait time</div>
          </div>
          <button
            onClick={() => onNavigate('prescriptions')}
            className="flex items-center gap-1.5 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
            style={{ fontSize: 13 }}
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Queue rows */}
        {queue.map((rx) => (
          <div
            key={rx.id}
            className={`flex items-center px-5 py-4 border-b border-slate-50 border-l-4 hover:bg-emerald-50/40 cursor-pointer transition-colors ${statusBorderColors[rx.status] || 'border-l-slate-200'}`}
            onClick={() => rx.status !== 'upcoming' && onNavigate('dispense', rx.id)}
          >
            {/* Status */}
            <div className="w-24 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[rx.status]} ${rx.status === 'new' ? 'animate-pulse' : ''}`}>
                {statusLabels[rx.status]}
              </span>
            </div>

            {/* Patient */}
            <div className="flex items-center gap-3 w-52 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${rx.patientAvatarColor}`}>
                {rx.patientInitials}
              </div>
              <div>
                <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>{rx.patientName}</div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                    {rx.patientId} · {rx.patientAge}{rx.patientGender} · {rx.insurance}
                  </span>
                  {rx.allergies.length > 0 && (
                    <span className="text-red-500 font-bold" style={{ fontSize: 9 }}>⚠️</span>
                  )}
                </div>
              </div>
            </div>

            {/* Prescription info */}
            <div className="flex-1 min-w-0 px-4">
              <div className="text-slate-600" style={{ fontSize: 12 }}>{rx.doctorName}</div>
              <div className="text-slate-500 truncate" style={{ fontSize: 12 }}>
                {rx.drugs.map(d => `${d.genericName} ${d.strength}`).join(' + ') || rx.notes}
              </div>
              <div className="text-slate-300" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                {rx.rxRef} · {rx.receivedTime !== '—' ? rx.receivedTime : ''} {rx.receivedTimeAgo}
              </div>
            </div>

            {/* Insurance */}
            <div className="w-36 flex-shrink-0 text-right px-2">
              <div className="text-slate-600" style={{ fontSize: 11 }}>{rx.insurance}</div>
              {rx.copay > 0 && (
                <div className="text-emerald-700 font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                  Co-pay AED {rx.copay}
                </div>
              )}
              {rx.holdReason && (
                <div className="text-amber-600 truncate" style={{ fontSize: 10, maxWidth: 130 }}>
                  {rx.holdReason.substring(0, 40)}...
                </div>
              )}
              {rx.arrivingETA && !rx.holdReason && (
                <div className="text-emerald-600" style={{ fontSize: 10 }}>{rx.arrivingETA}</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
              {rx.status === 'new' && (
                <button
                  onClick={() => onNavigate('dispense', rx.id)}
                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ▶ Dispense
                </button>
              )}
              {rx.status === 'on_hold' && (
                <button
                  onClick={() => onNavigate('messages')}
                  className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Follow Up
                </button>
              )}
              {rx.status === 'upcoming' && (
                <button className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  Pre-Alert
                </button>
              )}
              <button
                onClick={() => onNavigate('messages')}
                className="bg-slate-100 text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Dispensed collapsed section */}
        <button
          onClick={() => setDispensedOpen(!dispensedOpen)}
          className="w-full flex items-center justify-between px-5 py-3 text-slate-500 hover:bg-slate-50 transition-colors border-t border-slate-100"
          style={{ fontSize: 13 }}
        >
          <span className="flex items-center gap-2">
            {dispensedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-emerald-600 font-semibold">✅ {dispensed.length} dispensed prescriptions today</span>
          </span>
        </button>
        {dispensedOpen && dispensed.map(rx => (
          <div key={rx.id} className="flex items-center px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${rx.patientAvatarColor} mr-3`}>
              {rx.patientInitials}
            </div>
            <div className="flex-1">
              <span className="font-medium text-slate-700" style={{ fontSize: 13 }}>{rx.patientName}</span>
              <span className="text-slate-400 ml-2" style={{ fontSize: 11 }}>· {rx.dispensedTime}</span>
            </div>
            <span className="text-emerald-600 font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
              {rx.dhaRecord}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom two-column */}
      <div className="grid grid-cols-2 gap-5">
        {/* Stock Alerts */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Stock Alerts
            </h2>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              style={{ fontSize: 12 }}
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Out of stock */}
          <div className="border-l-4 border-l-red-500 bg-red-50 p-4 border-b border-red-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>Atorvastatin 20mg — Lipitor Brand</div>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">OUT OF STOCK</span>
              </div>
            </div>
            <div className="text-slate-600 mb-2" style={{ fontSize: 11 }}>
              Generic available ✅ · 1 prescription affected: <span className="font-semibold">Parnia Yazdkhasti</span>
            </div>
            <div className="flex gap-2">
              <button className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                📦 Order Urgently
              </button>
              <button
                onClick={() => onNavigate('messages')}
                className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                ✅ Use Generic
              </button>
            </div>
          </div>

          {/* Low stock items */}
          {[
            { name: 'Metformin 850mg', qty: '12 boxes remaining', days: '~6 days supply at current rate' },
            { name: 'Bisoprolol 5mg', qty: '8 boxes remaining', days: '~4 days supply at current rate' },
          ].map(alert => (
            <div key={alert.name} className="border-l-4 border-l-amber-500 bg-amber-50 p-4 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>{alert.name}</div>
                  <div className="text-amber-700 font-mono text-xs">{alert.qty}</div>
                  <div className="text-slate-500" style={{ fontSize: 11 }}>{alert.days}</div>
                </div>
                <button className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
                  📦 Order Now
                </button>
              </div>
            </div>
          ))}

          {/* Expiring */}
          <div className="border-l-4 border-l-orange-500 bg-orange-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>Warfarin 5mg — Batch BT-2025-WAR5-002</div>
                <div className="text-orange-700 font-mono text-xs">Expires: 30 April 2026 (23 days)</div>
                <div className="text-slate-500" style={{ fontSize: 11 }}>Qty: 240 tabs — use before expiry</div>
              </div>
              <button className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
                View Batch
              </button>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Messages
            </h2>
            <button
              onClick={() => onNavigate('messages')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              style={{ fontSize: 12 }}
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Awaiting Dr. response */}
          <div className="bg-amber-50 border-b border-amber-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-700" style={{ fontSize: 12 }}>
                  Al Shifa Pharmacy → Dr. Ahmed Al Rashidi
                </div>
                <div className="text-slate-600 mt-1" style={{ fontSize: 12 }}>
                  Query: Atorvastatin generic substitution for Parnia Yazdkhasti. Sent 1:15 PM.
                </div>
                <div className="text-amber-600 italic mt-1" style={{ fontSize: 11 }}>
                  Awaiting response...
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('messages')}
              className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
            >
              💬 Follow Up
            </button>
          </div>

          {/* Patient notification */}
          <div className="p-4 border-b border-slate-100">
            <div className="font-semibold text-slate-700 mb-1" style={{ fontSize: 12 }}>✅ Patient notified: Parnia Yazdkhasti</div>
            <div className="text-slate-500" style={{ fontSize: 12 }}>Prescription on hold — pharmacist query</div>
            <div className="text-slate-400 mt-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Sent via app: 1:16 PM</div>
          </div>

          {/* DHA confirmation */}
          <div className="p-4">
            <div className="font-semibold text-slate-700 mb-1" style={{ fontSize: 12 }}>DHA System · Dispensing Confirmation</div>
            <div className="text-slate-500" style={{ fontSize: 12 }}>8/8 records submitted. All dispensing logs current.</div>
            <div className="text-emerald-600 font-mono mt-1" style={{ fontSize: 10 }}>DIS-20260407-01228 ✅</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboardNew;
