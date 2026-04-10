import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare, Eye, Filter } from 'lucide-react';
import { prescriptions, Prescription } from '../../data/pharmacyData';

interface Props {
  onNavigate: (page: string, rxId?: string) => void;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  on_hold: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-teal-100 text-teal-700',
  dispensed: 'bg-emerald-100 text-emerald-700',
  upcoming: 'bg-slate-100 text-slate-500',
};
const statusLabels: Record<string, string> = {
  new: 'NEW',
  on_hold: 'ON HOLD',
  in_progress: 'IN PROGRESS',
  dispensed: 'DISPENSED',
  upcoming: 'UPCOMING',
};
const statusBorder: Record<string, string> = {
  new: 'border-l-blue-500',
  on_hold: 'border-l-amber-500',
  in_progress: 'border-l-teal-500',
  dispensed: 'border-l-emerald-400',
  upcoming: 'border-l-slate-300',
};

const PharmacyPrescriptions: React.FC<Props> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  const filterCounts = {
    all: prescriptions.length,
    new: prescriptions.filter(p => p.status === 'new').length,
    on_hold: prescriptions.filter(p => p.status === 'on_hold').length,
    dispensed: prescriptions.filter(p => p.status === 'dispensed').length,
    upcoming: prescriptions.filter(p => p.status === 'upcoming').length,
  };

  const filtered = prescriptions
    .filter(p => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.patientName.toLowerCase().includes(q) ||
          p.rxRef.toLowerCase().includes(q) ||
          p.doctorName.toLowerCase().includes(q) ||
          p.drugs.some(d => d.genericName.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const order = ['new', 'on_hold', 'upcoming', 'in_progress', 'dispensed'];
      if (sortNewest) return order.indexOf(a.status) - order.indexOf(b.status);
      return order.indexOf(b.status) - order.indexOf(a.status);
    });

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
            Prescriptions
          </h2>
          <div className="text-slate-400" style={{ fontSize: 13 }}>Today — 7 April 2026</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Patient name, Rx number, doctor..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-400 transition-colors"
              style={{ fontSize: 13 }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {([
              ['all', `All (${filterCounts.all})`],
              ['new', `Queue (${filterCounts.new})`],
              ['on_hold', `On Hold (${filterCounts.on_hold})`],
              ['dispensed', `Dispensed (${filterCounts.dispensed})`],
              ['upcoming', `Upcoming (${filterCounts.upcoming})`],
            ] as [string, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortNewest(!sortNewest)}
            className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition-colors ml-auto"
          >
            {sortNewest ? 'Status Priority' : 'Oldest First'} <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Received', 'Patient', 'Doctor', 'Drugs', 'Insurance', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-500 uppercase tracking-wider font-semibold" style={{ fontSize: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(rx => (
              <tr
                key={rx.id}
                className={`border-b border-slate-50 border-l-4 hover:bg-emerald-50/30 cursor-pointer transition-colors ${statusBorder[rx.status] || 'border-l-slate-200'}`}
                onClick={() => rx.status !== 'upcoming' && onNavigate('dispense', rx.id)}
              >
                <td className="px-4 py-3 text-slate-400 w-28" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                  {rx.receivedTime !== '—' ? rx.receivedTime : '—'}
                  <br />
                  <span style={{ fontSize: 10 }}>{rx.receivedTimeAgo}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${rx.patientAvatarColor}`}>
                      {rx.patientInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>{rx.patientName}</div>
                      <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                        {rx.patientId} · {rx.patientAge}{rx.patientGender}
                        {rx.allergies.length > 0 && <span className="text-red-500 ml-1">⚠️</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600" style={{ fontSize: 12 }}>
                  {rx.doctorName}
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <div className="text-slate-700 truncate" style={{ fontSize: 12 }}>
                    {rx.drugs.map(d => `${d.genericName} ${d.strength}`).join(' + ') || '—'}
                  </div>
                  <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                    {rx.rxRef}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-600" style={{ fontSize: 12 }}>{rx.insurance}</div>
                  {rx.copay > 0 && (
                    <div className="text-emerald-600 font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                      AED {rx.copay}
                    </div>
                  )}
                  {rx.copay === 0 && <div className="text-emerald-600" style={{ fontSize: 10 }}>100% covered</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[rx.status]} ${rx.status === 'new' ? 'animate-pulse' : ''}`}>
                    {statusLabels[rx.status]}
                  </span>
                  {rx.dhaRecord && (
                    <div className="text-emerald-600 mt-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
                      {rx.dhaRecord} ✅
                    </div>
                  )}
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {rx.status === 'new' && (
                      <button
                        onClick={() => onNavigate('dispense', rx.id)}
                        className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Dispense
                      </button>
                    )}
                    {rx.status === 'on_hold' && (
                      <button
                        onClick={() => onNavigate('dispense', rx.id)}
                        className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        Review
                      </button>
                    )}
                    {rx.status === 'dispensed' && (
                      <button
                        onClick={() => onNavigate('dispense', rx.id)}
                        className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('messages')}
                      className="bg-slate-100 text-slate-500 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400" style={{ fontSize: 14 }}>
            No prescriptions found
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyPrescriptions;
