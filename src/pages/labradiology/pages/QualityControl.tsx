import { useState } from 'react';
import { Plus, Eye, ChevronRight, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine,
  Tooltip, ResponsiveContainer
} from 'recharts';

const qcRuns = [
  { time: '6:00 AM', dept: 'Chemistry', instrument: 'Roche Cobas 6000', lot: 'QC-2026-CH-044', level: 'L1 + L2', result: 'PASS', status: 'pass' },
  { time: '6:15 AM', dept: 'Haematology', instrument: 'Sysmex XN-3000', lot: 'QC-2026-HM-038', level: 'L1 + L2', result: 'PASS', status: 'pass' },
  { time: '6:30 AM', dept: 'Immunology', instrument: 'Roche Cobas 8000', lot: 'QC-2026-IM-021', level: 'L1 + L2', result: 'PASS', status: 'pass' },
  { time: '6:45 AM', dept: 'Microbiology', instrument: 'BioMerieux VITEK 2', lot: 'QC-2026-MC-017', level: 'Positive control', result: 'PASS', status: 'pass' },
  { time: 'N/A', dept: 'Coagulation', instrument: 'Siemens BCS XP', lot: 'N/A', level: 'N/A', result: 'MAINTENANCE', status: 'maintenance' },
  { time: '1:30 PM', dept: 'Coagulation (backup)', instrument: 'Sysmex CA-600', lot: 'QC-2026-CO-009', level: 'L1 + L2', result: 'PASS (recal.)', status: 'pass' },
];

const ljData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 4.82 + (Math.random() - 0.5) * 0.4,
  mean: 4.82,
  plus1s: 5.02, plus2s: 5.22, plus3s: 5.42,
  minus1s: 4.62, minus2s: 4.42, minus3s: 4.22,
}));

export default function QualityControl() {
  const [showLJ, setShowLJ] = useState(false);
  const [showNewQC, setShowNewQC] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span>Laboratory</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Quality Control</span>
        </div>
        <button
          onClick={() => setShowNewQC(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={12} /> Log New QC Run
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '4/5 QC PASS ✅', sub: 'All instruments today', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: '1 MAINTENANCE ⚠️', sub: 'Siemens BCS XP', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
            { label: '0 FAILURES', sub: 'No QC failures today ✅', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Last QC: 6:45 AM', sub: 'Microbiology · PASS ✅', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map((c, i) => (
            <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
              <div className={`font-bold text-base ${c.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{c.label}</div>
              <div className="text-slate-500 text-xs mt-1">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800 text-sm">Siemens BCS XP (Coagulation) — Under Maintenance</div>
            <div className="text-amber-700 text-xs mt-0.5">
              Since 1:30 PM · ETA: 3:00 PM · Reason: Daily maintenance + ISI calibration
            </div>
            <div className="text-amber-700 text-xs mt-0.5">
              Samples rerouted to Sysmex CA-600 backup analyzer. ✅ All coagulation samples being processed.
            </div>
            <button className="text-amber-700 text-xs hover:underline mt-1.5 font-medium">View Maintenance Log →</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <div className="font-semibold text-slate-700 text-sm">QC Results — Today 7 April 2026</div>
          </div>

          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Time', 'Department', 'Instrument', 'QC Lot', 'Level', 'Result', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-semibold" style={{ fontSize: 10 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {qcRuns.map((q, i) => (
                <tr key={i} className={q.status === 'maintenance' ? 'bg-amber-50' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3 font-mono text-slate-600">{q.time}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{q.dept}</td>
                  <td className="px-4 py-3 text-slate-600">{q.instrument}</td>
                  <td className="px-4 py-3 font-mono text-indigo-600">{q.lot}</td>
                  <td className="px-4 py-3 text-slate-500">{q.level}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      q.status === 'pass' ? 'bg-emerald-100 text-emerald-700' :
                      q.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`} style={{ fontSize: 10 }}>
                      {q.result}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {q.status === 'pass' && (
                      <button
                        onClick={() => setShowLJ(true)}
                        className="flex items-center gap-1.5 text-indigo-600 hover:underline font-medium"
                      >
                        <Eye size={10} /> Levey-Jennings
                      </button>
                    )}
                    {q.status === 'maintenance' && (
                      <button className="text-amber-600 hover:underline font-medium">
                        View Log
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showLJ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[700px] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Levey-Jennings Chart</div>
                <div className="text-slate-500 text-xs">Cobas 6000 — Chemistry QC Level 1 · March–April 2026</div>
              </div>
              <button onClick={() => setShowLJ(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={ljData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                  <YAxis domain={[3.8, 5.8]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <ReferenceLine y={4.82} stroke="#64748b" strokeDasharray="4 4" label={{ value: 'Mean', fill: '#64748b', fontSize: 9 }} />
                  <ReferenceLine y={5.22} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth={1} />
                  <ReferenceLine y={5.42} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} label={{ value: '+3s', fill: '#ef4444', fontSize: 9 }} />
                  <ReferenceLine y={4.42} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth={1} />
                  <ReferenceLine y={4.22} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} label={{ value: '-3s', fill: '#ef4444', fontSize: 9 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    dot={(props) => {
                      const v = props.value;
                      const color = v > 5.42 || v < 4.22 ? '#ef4444' : v > 5.22 || v < 4.42 ? '#f59e0b' : '#10b981';
                      return <circle key={`dot-${props.index}`} cx={props.cx} cy={props.cy} r={4} fill={color} stroke="white" strokeWidth={1} />;
                    }}
                    strokeWidth={2}
                    name="QC Value"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full" /> Within ±2s (Pass)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full" /> ±2s to ±3s (Warning)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full" /> Beyond ±3s (Reject)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewQC && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-slate-800">Log New QC Run</div>
              <button onClick={() => setShowNewQC(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Department', type: 'select', options: ['Chemistry', 'Haematology', 'Microbiology', 'Immunology', 'Coagulation'] },
                { label: 'Instrument', type: 'select', options: ['Roche Cobas 6000', 'Sysmex XN-3000', 'Roche Cobas 8000', 'Siemens BCS XP', 'Sysmex CA-600', 'VITEK 2'] },
                { label: 'QC Lot', type: 'text' },
                { label: 'Level', type: 'select', options: ['Level 1', 'Level 2', 'Both'] },
                { label: 'Result', type: 'select', options: ['PASS', 'FAIL', 'REPEAT'] },
                { label: 'Comments', type: 'text' },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400">
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400" />
                  )}
                </div>
              ))}
              <button
                onClick={() => setShowNewQC(false)}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Submit QC Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
