import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, X, FileText, MessageSquare, Flag } from 'lucide-react';

const transactions = [
  { id: 'TXN-20260407-001', date: '7 Apr · 9:00 AM', initials: 'KH', name: 'Khalid Hassan', pid: 'PT-002', type: 'Cardiology Follow-up', typeStyle: 'bg-teal-50 text-teal-700', gross: 400, fee: 32, net: 368, insurance: 'ADNIC', insAmount: 360, insStatus: 'pending', status: 'pending', rowBg: '' },
  { id: 'TXN-20260407-002', date: '7 Apr · 9:30 AM', initials: 'PY', name: 'Parnia Yazdkhasti', pid: 'PT-001', type: 'Post-MRI Review', typeStyle: 'bg-teal-50 text-teal-700', gross: 400, fee: 32, net: 368, insurance: 'Daman Gold', insAmount: 360, insStatus: 'approved', status: 'settled', rowBg: '' },
  { id: 'TXN-20260407-003', date: '7 Apr · 10:00 AM', initials: 'MS', name: 'Mohammed Al Shamsi', pid: 'PT-004', type: 'New Patient', typeStyle: 'bg-blue-50 text-blue-700', gross: 400, fee: 32, net: 368, insurance: 'Daman Basic', insAmount: 320, insStatus: 'pending', status: 'pending', rowBg: '' },
  { id: 'TXN-20260407-004', date: '7 Apr · 10:45 AM', initials: 'FB', name: 'Fatima Bint Rashid', pid: 'PT-003', type: 'Echo Review', typeStyle: 'bg-teal-50 text-teal-700', gross: 400, fee: 32, net: 368, insurance: 'Thiqa', insAmount: 400, insStatus: 'approved', status: 'settled', rowBg: '' },
  { id: 'TXN-20260407-005', date: '7 Apr · 11:30 AM', initials: 'AH', name: 'Abdullah Hassan', pid: 'PT-005', type: 'Emergency Walk-in', typeStyle: 'bg-amber-50 text-amber-700', gross: 450, fee: 36, net: 414, insurance: 'Daman Gold', insAmount: 405, insStatus: 'pending', status: 'pending', rowBg: '' },
  { id: 'TXN-20260407-006', date: '7 Apr · 2:00 PM', initials: 'AM', name: 'Aisha Mohammed', pid: 'PT-006', type: 'HF Follow-up', typeStyle: 'bg-teal-50 text-teal-700', gross: 0, fee: 0, net: 0, insurance: 'AXA Gulf', insAmount: 0, insStatus: 'not_submitted', status: 'inprogress', rowBg: 'bg-teal-50/30' },
  { id: 'TXN-20260407-007', date: '7 Apr · 2:45 PM', initials: 'SM', name: 'Saeed Al Mansoori', pid: 'PT-007', type: 'Scheduled', typeStyle: 'bg-slate-50 text-slate-500', gross: 0, fee: 0, net: 0, insurance: 'Oman Insurance', insAmount: 0, insStatus: 'upcoming', status: 'upcoming', rowBg: 'bg-slate-50/20' },
  { id: 'TXN-20260407-008', date: '7 Apr · 3:30 PM', initials: 'NB', name: 'Noura Bint Khalid', pid: 'PT-008', type: 'Scheduled', typeStyle: 'bg-slate-50 text-slate-500', gross: 0, fee: 0, net: 0, insurance: 'Daman Basic', insAmount: 0, insStatus: 'upcoming', status: 'upcoming', rowBg: 'bg-slate-50/20' },
];

const prevDayTxns = [
  { initials: 'OH', name: 'Omar Hassan', type: 'Follow-up', gross: 400, status: 'settled', insurance: 'Daman Gold' },
  { initials: 'NR', name: 'Nadia Al Rashidi', type: 'New Patient', gross: 400, status: 'settled', insurance: 'ADNIC' },
  { initials: 'AZ', name: 'Ahmed Bin Zayed', type: 'Follow-up', gross: 400, status: 'settled', insurance: 'Thiqa' },
  { initials: 'RY', name: 'Rashida Yousuf', type: 'Follow-up', gross: 400, status: 'pending', insurance: 'Daman Basic' },
  { initials: 'MS', name: 'Mahmoud Siddiq', type: 'Consult', gross: 400, status: 'settled', insurance: 'AXA Gulf' },
];

function TransactionDetailModal({ txn, onClose }: { txn: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: '#0A1628' }}>
          <h2 className="text-white font-semibold" style={{ fontFamily: 'Plus Jakarta Sans' }}>Transaction Details</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors">
              <FileText className="w-3.5 h-3.5" />Invoice
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* TXN ID */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">TXN ID:</span>
            <span className="font-mono text-xs text-teal-600 font-semibold">{txn.id}</span>
            <button className="text-[9px] text-slate-400 hover:text-slate-600">Copy</button>
          </div>

          {/* Patient Card */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
                {txn.initials}
              </div>
              <div>
                <div className="font-semibold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{txn.name} · {txn.pid}</div>
                <div className="text-xs text-slate-500">Cardiology Follow-up · {txn.date}</div>
                <div className="text-xs text-slate-500">Suite 301, Al Noor Medical Center</div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Financial Breakdown</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Consultation fee</span>
                <span className="font-mono text-slate-900">AED {txn.gross}.00</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-slate-50">
                <span className="font-semibold text-slate-700">Gross amount</span>
                <span className="font-mono font-bold text-slate-900">AED {txn.gross}.00</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-red-500">CeenAiX fee (8%)</span>
                <span className="font-mono text-red-500">- AED {txn.fee}.00</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm bg-emerald-50">
                <span className="font-semibold text-emerald-700">Net to Dr. Ahmed</span>
                <span className="font-mono font-bold text-emerald-700">AED {txn.net}.00</span>
              </div>
            </div>
          </div>

          {/* Payment Split */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Payment Split</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Patient co-pay (10%)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">AED 40.00</span>
                  <span className="text-emerald-600 text-xs font-semibold">✅ Collected</span>
                </div>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">{txn.insurance} (90%)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">AED {txn.insAmount}.00</span>
                  {txn.insStatus === 'approved' && <span className="text-emerald-600 text-xs font-semibold">✅ Approved</span>}
                  {txn.insStatus === 'pending' && <span className="text-amber-600 text-xs font-semibold">⏳ Pending</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Payout info */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-700">
            <span className="font-mono font-semibold">AED {txn.net}</span> included in next payout: <span className="font-semibold">1 May 2026 — First Abu Dhabi Bank</span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />Download Invoice
            </button>
            <button className="w-full px-4 py-2.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />Message Patient
            </button>
            <button className="w-full px-4 py-2.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2">
              <Flag className="w-3.5 h-3.5" />Flag for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'rejected'>('all');
  const [prevDayExpanded, setPrevDayExpanded] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);

  const filtered = transactions.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchStatus = statusFilter === 'all' ? true :
      statusFilter === 'confirmed' ? t.status === 'settled' :
      statusFilter === 'pending' ? t.status === 'pending' :
      t.status === 'rejected';
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name or transaction ID..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {[['all', 'All'], ['confirmed', 'Confirmed'], ['pending', 'Pending'], ['rejected', 'Rejected']].map(([id, label]) => (
            <button key={id} onClick={() => setStatusFilter(id as any)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${statusFilter === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              {label}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
          Newest First <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
          <div className="col-span-1">Date</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Gross</div>
          <div className="col-span-1">Fee (8%)</div>
          <div className="col-span-1">Net</div>
          <div className="col-span-1">Status</div>
        </div>

        {/* Today Label */}
        <div className="px-5 py-2 bg-white border-b border-slate-50">
          <span className="text-xs font-semibold text-slate-500">Tuesday, 7 April 2026</span>
          <span className="text-xs text-slate-400 ml-2">8 transactions · AED 2,050 gross</span>
        </div>

        {/* Today Rows */}
        {filtered.map(txn => (
          <div key={txn.id} onClick={() => setSelectedTxn(txn)}
            className={`grid grid-cols-8 gap-2 px-5 py-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${txn.rowBg}`}>
            <div className="col-span-1">
              <div className="font-mono text-[11px] text-slate-500">{txn.date}</div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                txn.status === 'upcoming' ? 'bg-slate-200 text-slate-500' :
                'bg-gradient-to-br from-teal-400 to-teal-600 text-white'
              }`}>{txn.initials}</div>
              <div>
                <div className={`text-sm font-medium ${txn.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>{txn.name}</div>
                <div className="font-mono text-[10px] text-slate-400">{txn.pid}</div>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${txn.typeStyle}`}>{txn.type}</span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className={`font-mono text-sm font-semibold ${txn.status === 'upcoming' ? 'text-slate-400' : 'text-emerald-600'}`}>
                {txn.gross ? `AED ${txn.gross}` : '—'}
              </span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className={`font-mono text-xs ${txn.fee ? 'text-red-400' : 'text-slate-400'}`}>
                {txn.fee ? `- AED ${txn.fee}` : '—'}
              </span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className={`font-mono text-sm font-bold ${txn.net ? 'text-teal-600' : 'text-slate-400'}`}>
                {txn.net ? `AED ${txn.net}` : '—'}
              </span>
            </div>
            <div className="col-span-1 flex items-center">
              {txn.status === 'settled' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">✅ Settled</span>}
              {txn.status === 'pending' && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">⏳ Pending</span>}
              {txn.status === 'inprogress' && <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-bold">🔵 In Progress</span>}
              {txn.status === 'upcoming' && <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">⏰ Scheduled</span>}
            </div>
          </div>
        ))}

        {/* Previous Day Group */}
        <div className="border-t border-slate-100">
          <button onClick={() => setPrevDayExpanded(!prevDayExpanded)}
            className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-600">Monday, 6 April 2026</span>
              <span className="text-xs text-slate-400 ml-2">5 transactions · AED 2,000 gross</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${prevDayExpanded ? 'rotate-90' : ''}`} />
          </button>

          {prevDayExpanded && prevDayTxns.map((txn, idx) => (
            <div key={idx} className="grid grid-cols-8 gap-2 px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="col-span-1 font-mono text-[11px] text-slate-400">6 Apr</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-[10px] font-bold">{txn.initials}</div>
                <span className="text-sm text-slate-800">{txn.name}</span>
              </div>
              <div className="col-span-1"><span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded text-[9px]">{txn.type}</span></div>
              <div className="col-span-1 font-mono text-sm text-emerald-600 font-semibold">AED {txn.gross}</div>
              <div className="col-span-1 font-mono text-xs text-red-400">- AED 32</div>
              <div className="col-span-1 font-mono text-sm text-teal-600 font-bold">AED 368</div>
              <div className="col-span-1">
                {txn.status === 'settled' ? <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">✅ Settled</span> :
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">⏳ Pending</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Previous Day 2 */}
        <div className="border-t border-slate-100">
          <button className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-600">Sunday, 5 April 2026</span>
              <span className="text-xs text-slate-400 ml-2">4 transactions · AED 1,600 gross</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing 18 of 312 YTD transactions</span>
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="text-slate-500">Gross: <span className="text-emerald-600 font-bold">AED 7,650</span></div>
            <div className="text-slate-500">Fees: <span className="text-red-400 font-bold">- AED 612</span></div>
            <div className="text-slate-500">Net: <span className="text-teal-600 font-bold">AED 7,038</span></div>
          </div>
        </div>
      </div>

      {selectedTxn && <TransactionDetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />}
    </div>
  );
}
