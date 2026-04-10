import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { Phone } from 'lucide-react';

const dailyData = [
  { day: 'Apr 5', confirmed: 1600, projected: 0, isPast: true, isToday: false },
  { day: 'Apr 6', confirmed: 2000, projected: 0, isPast: true, isToday: false },
  { day: 'Apr 7', confirmed: 2050, projected: 1200, isPast: false, isToday: true },
  { day: 'Apr 8', confirmed: 0, projected: 2500, isPast: false, isToday: false },
  { day: 'Apr 9', confirmed: 0, projected: 2000, isPast: false, isToday: false },
  { day: 'Apr 13', confirmed: 0, projected: 2200, isPast: false, isToday: false },
  { day: 'Apr 14', confirmed: 0, projected: 2200, isPast: false, isToday: false },
  { day: 'Apr 15', confirmed: 0, projected: 2200, isPast: false, isToday: false },
];

const monthlyData = [
  { month: 'Jan', net: 31200, gross: 33913 },
  { month: 'Feb', net: 29800, gross: 32391 },
  { month: 'Mar', net: 32752, gross: 35600 },
  { month: 'Apr', net: 7038, gross: 7650 },
];

const todaysTransactions = [
  { time: '9:00 AM', initials: 'KH', name: 'Khalid Hassan', visit: 'Hypertension Follow-up', amount: 400, copayStatus: 'collected', insurance: 'ADNIC', insAmount: 360, insStatus: 'pending', status: 'partial' },
  { time: '9:30 AM', initials: 'PY', name: 'Parnia Yazdkhasti', visit: 'Cardiac MRI Review', amount: 400, copayStatus: 'collected', insurance: 'Daman Gold', insAmount: 360, insStatus: 'approved', status: 'settled' },
  { time: '10:00 AM', initials: 'MS', name: 'Mohammed Al Shamsi', visit: 'New Patient', amount: 400, copayStatus: 'collected', insurance: 'Daman Basic', insAmount: 320, insStatus: 'pending', status: 'partial' },
  { time: '10:45 AM', initials: 'FB', name: 'Fatima Bint Rashid', visit: 'Echo Review', amount: 400, copayStatus: 'none', insurance: 'Thiqa', insAmount: 400, insStatus: 'approved', status: 'settled' },
  { time: '11:30 AM', initials: 'AH', name: 'Abdullah Hassan', visit: 'Emergency Walk-in', amount: 450, copayStatus: 'collected', insurance: 'Daman Gold', insAmount: 405, insStatus: 'pending', status: 'partial' },
  { time: '2:00 PM', initials: 'AM', name: 'Aisha Mohammed', visit: 'HF Follow-up', amount: 400, copayStatus: 'pending', insurance: 'AXA Gulf', insAmount: 360, insStatus: 'not_submitted', status: 'inprogress' },
  { time: '2:45 PM', initials: 'SM', name: 'Saeed Al Mansoori', visit: 'Scheduled', amount: 400, copayStatus: 'upcoming', insurance: 'Oman Insurance', insAmount: 0, insStatus: 'upcoming', status: 'upcoming' },
  { time: '3:30 PM', initials: 'NB', name: 'Noura Bint Khalid', visit: 'Scheduled', amount: 400, copayStatus: 'upcoming', insurance: 'Daman Basic', insAmount: 0, insStatus: 'upcoming', status: 'upcoming' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <div className="font-semibold text-slate-900 mb-2">{label}</div>
      {payload.map((p: any, i: number) => (
        p.value > 0 && <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-mono font-semibold">AED {p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left 60% */}
      <div className="col-span-3 space-y-5">
        {/* Daily Revenue Chart */}
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Daily Revenue — April 2026</h3>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              <button className="px-3 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-50 transition-colors">Gross</button>
              <button className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-medium transition-colors">Net</button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">April avg/day: AED 1,275 · Last month avg: AED 1,149 · <span className="text-emerald-600">↑ +10.9% improvement</span></p>

          <div className="flex gap-3 mb-2 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /><span className="text-slate-500">Confirmed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-teal-600 rounded-sm" /><span className="text-slate-500">Today</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-teal-100 border border-teal-300 rounded-sm" /><span className="text-slate-500">Projected</span></div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fontFamily: 'DM Mono', fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={1100} stroke="#CBD5E1" strokeDasharray="4 4" />
              <Bar dataKey="confirmed" name="Confirmed" radius={[3, 3, 0, 0]} animationDuration={800}>
                {dailyData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.isToday ? '#0D9488' : entry.isPast ? '#10B981' : '#E2E8F0'} />
                ))}
              </Bar>
              <Bar dataKey="projected" name="Projected" radius={[3, 3, 0, 0]} fill="#CCFBF1" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Monthly Revenue — 2026</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 bg-emerald-500 rounded" /><span className="text-slate-500">Gross</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 bg-teal-600 rounded" /><span className="text-slate-500">Net</span></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">Apr is partial — 3 days only. Monthly target: AED 25,000</p>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fontFamily: 'DM Mono', fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={25000} stroke="#CBD5E1" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="gross" stroke="#10B981" strokeWidth={2} fill="url(#grossGrad)" name="Gross" animationDuration={800} />
              <Area type="monotone" dataKey="net" stroke="#0D9488" strokeWidth={2.5} fill="url(#netGrad)" name="Net" animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right 40% */}
      <div className="col-span-2 space-y-4">
        {/* Today Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Today — 7 April 2026</h3>

          <div className="space-y-1.5">
            {todaysTransactions.map((txn, idx) => (
              <div key={idx} className={`flex items-start justify-between p-2.5 rounded-xl text-xs ${
                txn.status === 'inprogress' ? 'bg-teal-50 border border-teal-100' :
                txn.status === 'upcoming' ? 'bg-slate-50' : 'bg-white border border-slate-100'
              }`}>
                <div className="flex items-start gap-2">
                  <div className="font-mono text-[9px] text-slate-400 w-12 mt-0.5 shrink-0">{txn.time}</div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                    txn.status === 'upcoming' ? 'bg-slate-200 text-slate-500' :
                    'bg-gradient-to-br from-teal-400 to-teal-600 text-white'
                  }`}>{txn.initials}</div>
                  <div>
                    <div className={`font-semibold leading-tight ${txn.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>{txn.name}</div>
                    <div className="text-slate-400 leading-tight">{txn.visit}</div>
                    <div className="leading-tight mt-0.5">
                      {txn.insStatus === 'approved' && <span className="text-emerald-600 font-semibold">✅ Fully settled</span>}
                      {txn.insStatus === 'pending' && <span className="text-amber-600">{txn.insurance}: ⏳ pending</span>}
                      {txn.insStatus === 'not_submitted' && <span className="text-slate-400">Not yet billed</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-mono font-bold ${
                    txn.status === 'upcoming' ? 'text-slate-400' :
                    txn.status === 'inprogress' ? 'text-teal-600' :
                    txn.status === 'settled' ? 'text-emerald-600' : 'text-slate-700'
                  }`}>
                    {txn.status === 'upcoming' ? 'est.' : `AED ${txn.amount}`}
                  </div>
                  {txn.copayStatus === 'collected' && <div className="text-emerald-600 text-[9px]">Co-pay ✅</div>}
                  {txn.status === 'inprogress' && <div className="text-teal-600 text-[9px]">🔵 In progress</div>}
                  {txn.status === 'upcoming' && <div className="text-slate-400 text-[9px]">⏰ Upcoming</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Confirmed:</span>
              <span className="font-mono font-bold text-emerald-600">AED 2,050</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Pending + Upcoming:</span>
              <span className="font-mono text-amber-600">AED 1,200</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Potential full day:</span>
              <span className="font-mono text-teal-600">AED 3,250</span>
            </div>
            <div className="flex justify-between text-xs text-red-400">
              <span>CeenAiX fee (8%):</span>
              <span className="font-mono">- AED 260</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-100 font-semibold">
              <span className="text-slate-700">Net today:</span>
              <span className="font-mono text-emerald-700">AED 2,990</span>
            </div>
          </div>
        </div>

        {/* Insurance Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Insurance Pipeline — April 2026</h3>

          <div className="flex items-center justify-between mb-4">
            {[
              { label: 'Submitted', count: 11, amount: 'AED 6,165', bg: 'bg-slate-600', text: 'text-slate-500' },
              { label: 'Approved', count: 5, amount: 'AED 3,200', bg: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Pending', count: 5, amount: 'AED 2,645', bg: 'bg-amber-500', text: 'text-amber-600' },
              { label: 'Rejected', count: 1, amount: 'AED 320', bg: 'bg-red-500', text: 'text-red-500' },
            ].map((stage, idx, arr) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="text-center">
                  <div className={`w-9 h-9 ${stage.bg} rounded-full flex items-center justify-center text-white font-mono font-bold text-sm mx-auto mb-1`}>{stage.count}</div>
                  <div className="text-[9px] text-slate-500">{stage.label}</div>
                  <div className={`font-mono text-[9px] font-semibold ${stage.text}`}>{stage.amount}</div>
                </div>
                {idx < arr.length - 1 && <div className="text-slate-300 text-sm mb-3">→</div>}
              </div>
            ))}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-red-700">Mohammed Ibrahim — Daman Basic</div>
                <div className="font-mono text-[9px] text-slate-500 mt-0.5">28 Feb 2026 · AED 320</div>
                <div className="text-[10px] text-red-600 italic">Pre-auth not obtained · ⏳ Under appeal</div>
              </div>
              <button className="shrink-0 flex items-center gap-1 px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-medium transition-colors">
                <Phone className="w-3 h-3" />Follow Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
