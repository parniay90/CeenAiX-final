import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare, Play } from 'lucide-react';
import { prescriptions, PrescriptionStatus } from '../../data/pharmacyData';

interface Props {
  onNavigate: (page: string, rxId?: string) => void;
}

type FilterType = 'all' | 'new' | 'in_progress' | 'on_hold' | 'dispensed' | 'cancelled';
type SortType = 'newest' | 'oldest' | 'patient' | 'status';

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  new: { label: 'NEW', bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6' },
  in_progress: { label: 'IN PROGRESS', bg: '#F0FDFA', text: '#0F766E', border: '#14B8A6' },
  on_hold: { label: 'ON HOLD', bg: '#FFFBEB', text: '#B45309', border: '#F59E0B' },
  dispensed: { label: 'DISPENSED', bg: '#F0FDF4', text: '#15803D', border: '#22C55E' },
  upcoming: { label: 'UPCOMING', bg: '#F8FAFC', text: '#475569', border: '#94A3B8' },
  cancelled: { label: 'CANCELLED', bg: '#F8FAFC', text: '#94A3B8', border: '#CBD5E1' },
};

const filterCounts: Record<FilterType, number> = {
  all: prescriptions.length,
  new: prescriptions.filter(p => p.status === 'new').length,
  in_progress: prescriptions.filter(p => p.status === 'in_progress').length,
  on_hold: prescriptions.filter(p => p.status === 'on_hold').length,
  dispensed: prescriptions.filter(p => p.status === 'dispensed').length,
  cancelled: prescriptions.filter(p => p.status === 'cancelled').length,
};

const filterLabels: Record<FilterType, string> = {
  all: 'All',
  new: 'New',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  dispensed: 'Dispensed',
  cancelled: 'Cancelled',
};

const PharmacyPrescriptions: React.FC<Props> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = prescriptions.filter(rx => {
    const matchFilter = filter === 'all' || rx.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || rx.patientName.toLowerCase().includes(q) ||
      rx.rxRef.toLowerCase().includes(q) ||
      rx.doctorName.toLowerCase().includes(q) ||
      rx.drugs.some(d => d.genericName.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  const sortOrderPriority: Record<PrescriptionStatus, number> = {
    new: 0, in_progress: 1, on_hold: 2, upcoming: 3, dispensed: 4, cancelled: 5,
  };

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'status') return sortOrderPriority[a.status] - sortOrderPriority[b.status];
    if (sort === 'patient') return a.patientName.localeCompare(b.patientName);
    if (sort === 'oldest') return a.receivedTime.localeCompare(b.receivedTime);
    return sortOrderPriority[a.status] - sortOrderPriority[b.status];
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F8FAFC' }}>
      <div className="mx-6 mt-5 mb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
            Prescriptions
          </h2>
          <div className="text-slate-400" style={{ fontSize: 13 }}>
            All prescriptions today · Al Shifa Pharmacy
          </div>
        </div>
      </div>

      {/* Filter + Search Row */}
      <div className="mx-6 mb-4 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Patient name, Rx number, doctor..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(filterLabels) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1 font-medium transition-colors"
              style={{
                fontSize: 12,
                background: filter === f ? '#059669' : '#F1F5F9',
                color: filter === f ? '#fff' : '#475569',
              }}
              onMouseEnter={e => { if (filter !== f) e.currentTarget.style.background = '#E2E8F0'; }}
              onMouseLeave={e => { if (filter !== f) e.currentTarget.style.background = '#F1F5F9'; }}
            >
              {filterLabels[f]} ({filterCounts[f]})
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
            style={{ fontSize: 12 }}
          >
            Sort: {sort === 'newest' ? 'Newest First' : sort === 'oldest' ? 'Oldest First' : sort === 'patient' ? 'Patient A-Z' : 'By Status'}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
              {(['newest', 'oldest', 'status', 'patient'] as SortType[]).map(s => (
                <button
                  key={s}
                  onClick={() => { setSort(s); setShowSortMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                  style={{ color: sort === s ? '#059669' : '#475569', fontWeight: sort === s ? 600 : 400 }}
                >
                  {s === 'newest' ? 'Newest First' : s === 'oldest' ? 'Oldest First' : s === 'patient' ? 'Patient A-Z' : 'By Status'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mx-6 mb-6 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
        <div
          className="grid text-slate-400 uppercase tracking-widest px-5 py-3 border-b border-slate-100"
          style={{
            fontSize: 10, fontFamily: 'DM Mono, monospace',
            gridTemplateColumns: '100px 1fr 1fr 1fr 100px 120px 140px',
          }}
        >
          <div>Received</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Drugs</div>
          <div>Insurance</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {sorted.length === 0 && (
          <div className="text-center text-slate-400 py-12" style={{ fontSize: 14 }}>
            No prescriptions match your search
          </div>
        )}

        {sorted.map((rx, idx) => {
          const cfg = statusConfig[rx.status] || statusConfig.dispensed;
          const drugNames = rx.drugs.map(d => `${d.genericName} ${d.strength}`).join(', ') || '—';
          return (
            <div
              key={rx.id}
              className="grid items-center px-5 py-3 transition-colors cursor-pointer"
              style={{
                gridTemplateColumns: '100px 1fr 1fr 1fr 100px 120px 140px',
                borderBottom: idx < sorted.length - 1 ? '1px solid #F8FAFC' : undefined,
                borderLeft: `4px solid ${cfg.border}`,
                minHeight: 64,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0FDF4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div>
                <div className="text-slate-600 font-mono" style={{ fontSize: 11 }}>{rx.receivedTime}</div>
                <div className="text-slate-400" style={{ fontSize: 10 }}>{rx.receivedTimeAgo}</div>
              </div>

              <div className="flex items-center gap-2 pr-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${rx.patientAvatarColor}`}
                  style={{ fontSize: 12 }}
                >
                  {rx.patientInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate" style={{ fontSize: 13 }}>
                    {rx.patientName}
                    {rx.allergies.length > 0 && <span className="ml-1 text-red-500" style={{ fontSize: 9 }}>⚠️</span>}
                  </div>
                  <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                    {rx.patientId} · {rx.patientAge}{rx.patientGender}
                  </div>
                </div>
              </div>

              <div className="pr-3">
                <div className="text-slate-700 truncate" style={{ fontSize: 12 }}>{rx.doctorName}</div>
                <div className="text-slate-400 truncate" style={{ fontSize: 11 }}>{rx.doctorSpecialty.split('·')[0].trim()}</div>
              </div>

              <div className="pr-3">
                <div className="text-slate-600 truncate" style={{ fontSize: 12 }}>{drugNames}</div>
                <div className="text-slate-400 font-mono" style={{ fontSize: 10 }}>{rx.rxRef}</div>
              </div>

              <div>
                <div className="text-slate-600 truncate" style={{ fontSize: 11 }}>{rx.insurance}</div>
                <div className="font-mono font-bold" style={{ fontSize: 11, color: '#059669' }}>
                  AED {rx.copay}
                </div>
              </div>

              <div>
                <span
                  className="font-bold rounded-full px-2 py-0.5 whitespace-nowrap"
                  style={{ fontSize: 10, background: cfg.bg, color: cfg.text }}
                >
                  {cfg.label}
                </span>
                {rx.dispensedTime && (
                  <div className="text-slate-400 mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
                    {rx.dispensedTime}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                {(rx.status === 'new' || rx.status === 'in_progress' || rx.status === 'on_hold') && (
                  <button
                    onClick={() => onNavigate('dispense', rx.id)}
                    className="flex items-center gap-1 text-white rounded-lg px-2.5 py-1.5 font-semibold transition-colors"
                    style={{ background: rx.status === 'on_hold' ? '#F59E0B' : '#059669', fontSize: 11 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    <Play className="w-3 h-3" />
                    {rx.status === 'on_hold' ? 'Resume' : 'Dispense'}
                  </button>
                )}
                {rx.status === 'dispensed' && (
                  <button
                    onClick={() => onNavigate('dispense', rx.id)}
                    className="flex items-center gap-1 text-slate-600 rounded-lg px-2.5 py-1.5 font-medium transition-colors hover:bg-slate-100"
                    style={{ background: '#F1F5F9', fontSize: 11 }}
                  >
                    View
                  </button>
                )}
                <button
                  onClick={() => onNavigate('messages')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PharmacyPrescriptions;
