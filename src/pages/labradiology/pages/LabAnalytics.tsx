import { ChevronRight, Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart,
  Line, Legend
} from 'recharts';
import { analyticsVolumeData, modalityData, tatChartData } from '../mockData';

const criticalValues = [
  { patient: 'Ibrahim Al Marzouqi', test: 'K+ (Potassium)', value: '6.8 mEq/L ↑↑', notifiedIn: '15 min', status: '⚠️ Pending' },
  { patient: 'Hassan Al Mansoori', test: 'WBC', value: '28.4 × 10⁹/L ↑↑', notifiedIn: '8 min', status: '✅ Notified' },
  { patient: 'Sara Al Khalili', test: 'Hemoglobin', value: '5.2 g/dL ↓↓', notifiedIn: '12 min', status: '✅ Notified' },
  { patient: 'Mohammed Al Shamsi', test: 'Troponin I', value: '42 ng/L ↑', notifiedIn: '23 min', status: '✅ Notified' },
  { patient: 'Fatima Ibrahim', test: 'Na+ (Sodium)', value: '158 mmol/L ↑↑', notifiedIn: '76 min', status: '✅ Notified' },
  { patient: 'Yousuf Al Zaabi', test: 'Glucose', value: '28.4 mmol/L ↑↑', notifiedIn: '19 min', status: '✅ Notified' },
  { patient: 'Noura Al Hashimi', test: 'Potassium', value: '2.3 mEq/L ↓↓', notifiedIn: '31 min', status: '✅ Notified' },
];

const topLabTests = [
  { name: 'CBC', count: 56 }, { name: 'HbA1c', count: 34 }, { name: 'Lipid Panel', count: 29 },
  { name: 'CMP', count: 22 }, { name: 'TSH', count: 19 }, { name: 'Troponin', count: 14 },
];

const topImaging = [
  { name: 'Chest X-Ray', count: 14 }, { name: 'CT Chest', count: 8 }, { name: 'Brain MRI', count: 5 },
  { name: 'Abdomen USS', count: 8 }, { name: 'Knee MRI', count: 4 }, { name: 'Echo', count: 4 },
];

const exports = [
  'DHA Monthly Lab Report', 'DHA Radiology Report', 'Full Diagnostics Ledger',
  'Critical Value Log', 'QC Summary Report',
];

export default function LabAnalytics() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Analytics & Reports</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {['All ●', 'Lab', 'Radiology'].map((d, i) => (
              <button key={i} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${i === 0 ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {['Today ●', 'Week', 'Month', 'Custom'].map((d, i) => (
              <button key={i} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${i === 0 ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {d}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '234', sub: 'Lab Samples', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: '47', sub: 'Radiology Studies', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '281', sub: 'Total Today', color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: '99.7%', sub: 'DHA Compliance Rate', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((k, i) => (
            <div key={i} className={`${k.bg} rounded-xl p-4 text-center`}>
              <div className={`font-bold text-2xl ${k.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{k.label}</div>
              <div className="text-slate-500 text-xs mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-semibold text-slate-700 text-sm mb-3">Daily Volume — 7-Day Trend</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analyticsVolumeData} barSize={14} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="lab" fill="#4F46E5" name="Lab" radius={[3, 3, 0, 0]} />
                <Bar dataKey="radiology" fill="#1D4ED8" name="Radiology" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-semibold text-slate-700 text-sm mb-3">Modality Breakdown — Radiology</div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={modalityData}
                    cx="50%" cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {modalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                <div className="text-center">
                  <div className="font-bold text-slate-800 text-lg" style={{ fontFamily: 'DM Mono, monospace' }}>47</div>
                  <div className="text-slate-400 text-xs">studies</div>
                </div>
                {modalityData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-slate-600">{d.name}</span>
                    <span className="font-mono text-slate-400">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="font-semibold text-slate-700 text-sm mb-1">Turnaround Time Analysis</div>
          <div className="text-slate-400 text-xs mb-3">Actual TAT vs Target — by category</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={tatChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="lab" fill="#4F46E5" name="Lab TAT (h)" barSize={12} radius={[2, 2, 0, 0]} />
              <Bar dataKey="radiology" fill="#1D4ED8" name="Radiology TAT (h)" barSize={12} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Target" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-amber-600">⚠️ MRI reports 4.8h avg — exceeding 4h target</span>
            <span className="text-emerald-600">⭐ Troponin STAT: 17 min avg</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <div className="font-semibold text-slate-700 text-sm">Critical Value Tracking — Today</div>
            <div className="flex gap-4 mt-1 text-xs">
              <span className="text-emerald-600 font-medium">Avg notification: 23 min (target: &lt;60 min ✅)</span>
              <span className="text-emerald-600">Fastest: 8 min</span>
              <span className="text-amber-600">Slowest: 76 min ⚠️</span>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Patient', 'Test', 'Critical Value', 'Notified In', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-slate-400 font-semibold" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {criticalValues.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-700">{c.patient}</td>
                  <td className="px-4 py-2.5 text-slate-600">{c.test}</td>
                  <td className="px-4 py-2.5 font-mono text-red-600 font-bold">{c.value}</td>
                  <td className={`px-4 py-2.5 font-mono font-bold ${parseInt(c.notifiedIn) > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {c.notifiedIn} {parseInt(c.notifiedIn) > 60 ? '⚠️' : ''}
                  </td>
                  <td className="px-4 py-2.5">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-semibold text-slate-700 text-sm mb-3">🧪 Top Requested Lab Tests</div>
            {topLabTests.map((t, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-slate-600 text-xs w-32 truncate">{t.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(t.count / 60) * 100}%` }} />
                </div>
                <span className="font-mono text-indigo-600 text-xs font-bold w-8 text-right">{t.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-semibold text-slate-700 text-sm mb-3">🩻 Top Imaging Studies</div>
            {topImaging.map((t, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-slate-600 text-xs w-32 truncate">{t.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(t.count / 14) * 100}%` }} />
                </div>
                <span className="font-mono text-blue-600 text-xs font-bold w-8 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace' }}>99.7%</span>
            <div>
              <div className="font-bold text-emerald-700 text-sm">NABIDH Submission Rate (30 days)</div>
              <div className="text-emerald-600 text-xs">2 failed submissions (resolved) · 0 currently failed</div>
            </div>
            <button className="ml-auto text-emerald-700 text-xs hover:underline font-medium">📋 Full NABIDH Report →</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="font-semibold text-slate-700 text-sm mb-3">Export Reports</div>
          <div className="flex flex-wrap gap-2">
            {exports.map((e, i) => (
              <button key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                <Download size={12} /> {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
