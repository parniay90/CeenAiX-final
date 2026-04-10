import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, ReferenceLine
} from 'recharts';
import { TrendingUp, Brain, ArrowUpRight } from 'lucide-react';

const monthlyTrend = [
  { month: 'Jan', gross2026: 25200, gross2025: 21800, net2026: 23184, net2025: 20056 },
  { month: 'Feb', gross2026: 31200, gross2025: 26400, net2026: 28704, net2025: 24288 },
  { month: 'Mar', gross2026: 35600, gross2025: 30200, net2026: 32752, net2025: 27784 },
  { month: 'Apr', gross2026: 7650, gross2025: 6640, net2026: 7038, net2025: 6109, partial: true },
];

const weeklyData = [
  { week: 'W1 Mar', gross: 8200 },
  { week: 'W2 Mar', gross: 9100 },
  { week: 'W3 Mar', gross: 8800 },
  { week: 'W4 Mar', gross: 9500 },
  { week: 'W1 Apr', gross: 7650 },
];

const insurancePie = [
  { name: 'Daman', value: 38, color: '#0D9488' },
  { name: 'Thiqa', value: 22, color: '#0891B2' },
  { name: 'ADNIC', value: 18, color: '#0284C7' },
  { name: 'AXA Gulf', value: 14, color: '#0369A1' },
  { name: 'Other', value: 8, color: '#94A3B8' },
];

const visitTypePie = [
  { name: 'In-Clinic', value: 62, color: '#0D9488' },
  { name: 'Telemedicine', value: 28, color: '#0891B2' },
  { name: 'Follow-up', value: 10, color: '#94A3B8' },
];

const performanceMetrics = [
  { metric: 'Avg. revenue per consultation', jan: 'AED 400', feb: 'AED 400', mar: 'AED 400', trend: 'stable' },
  { metric: 'Avg. consultations per week', jan: '15.8', feb: '19.5', mar: '22.3', trend: 'up' },
  { metric: 'Insurance claim approval rate', jan: '91%', feb: '93%', mar: '95%', trend: 'up' },
  { metric: 'Avg. claim turnaround', jan: '3.2h', feb: '2.8h', mar: '2.1h', trend: 'up' },
  { metric: 'Telemedicine share', jan: '22%', feb: '25%', mar: '28%', trend: 'up' },
  { metric: 'Rejection rate', jan: '9%', feb: '7%', mar: '5%', trend: 'down-good' },
  { metric: 'Platform fee (8%)', jan: 'AED 2,016', feb: 'AED 2,496', mar: 'AED 2,848', trend: 'up' },
];

const RADIAN = Math.PI / 180;
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === 'up') return <span className="text-emerald-500 text-xs font-bold">↑</span>;
  if (trend === 'down-good') return <span className="text-emerald-500 text-xs font-bold">↓</span>;
  return <span className="text-slate-400 text-xs">→</span>;
}

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Section A — Monthly Trend ComposedChart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Revenue Trend — 2026 vs 2025</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly gross earnings comparison with net overlay</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-teal-500" />
              <span className="text-slate-500">2026 Gross</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-300" />
              <span className="text-slate-500">2025 Gross</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-0.5 bg-emerald-500" />
              <span className="text-slate-500">2026 Net</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={monthlyTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number, name: string) => [`AED ${value.toLocaleString()}`, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
            <ReferenceLine y={25000} stroke="#CBD5E1" strokeDasharray="4 4" label={{ value: 'Monthly target', position: 'right', fontSize: 10, fill: '#94A3B8' }} />
            <Bar dataKey="gross2025" name="2025 Gross" fill="#E2E8F0" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="gross2026" name="2026 Gross" fill="#0D9488" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Line dataKey="net2026" name="2026 Net" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} animationDuration={800} type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Section B — Pie Charts */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 text-sm mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Revenue by Insurance Provider</h3>
          <p className="text-xs text-slate-400 mb-4">April 2026 · 11 claims</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={insurancePie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" labelLine={false} label={renderCustomLabel} animationDuration={800}>
                  {insurancePie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {insurancePie.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 text-sm mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Revenue by Consultation Type</h3>
          <p className="text-xs text-slate-400 mb-4">April 2026 · 18 consultations</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={visitTypePie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" labelLine={false} label={renderCustomLabel} animationDuration={800}>
                  {visitTypePie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {visitTypePie.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-700">{item.value}%</span>
                </div>
              ))}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-teal-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Telemedicine +6% vs Jan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section C — Weekly Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Weekly Gross Revenue — Last 5 Weeks</h3>
        <p className="text-xs text-slate-400 mb-5">W1 Apr is partial (Apr 1–7 only)</p>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={weeklyData} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
            <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, 'Gross']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="gross" name="Gross" fill="#0D9488" radius={[6, 6, 0, 0]} animationDuration={800}>
              {weeklyData.map((_, i) => (
                <Cell key={i} fill={i === weeklyData.length - 1 ? '#5EEAD4' : '#0D9488'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Section D — Performance Metrics Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Performance Metrics — Q1 2026</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Metric</th>
                <th className="px-6 py-3 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide">January</th>
                <th className="px-6 py-3 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide">February</th>
                <th className="px-6 py-3 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide">March</th>
                <th className="px-6 py-3 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {performanceMetrics.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-slate-700">{row.metric}</td>
                  <td className="px-6 py-3.5 text-center font-mono text-sm text-slate-500">{row.jan}</td>
                  <td className="px-6 py-3.5 text-center font-mono text-sm text-slate-600">{row.feb}</td>
                  <td className="px-6 py-3.5 text-center font-mono text-sm font-semibold text-slate-800">{row.mar}</td>
                  <td className="px-6 py-3.5 text-center">
                    <TrendBadge trend={row.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section E — Revenue Projection AI Card */}
      <div className="rounded-2xl p-6 border-2 border-blue-200 bg-blue-50/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-blue-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>CeenAiX Revenue Intelligence</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-semibold border border-blue-200">AI Projection</span>
            </div>
            <p className="text-sm text-blue-800 mb-4 leading-relaxed">
              Based on your April trajectory (18 consultations / 7 working days = 2.57/day), and assuming 22 remaining working days, your projected April gross is <span className="font-mono font-bold">AED 22,754</span> — that's <span className="font-mono font-bold">AED 20,934 net</span> after the 8% platform fee.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="text-[10px] text-blue-500 uppercase tracking-wide mb-1">Projected Gross</div>
                <div className="font-mono text-lg font-bold text-blue-800">AED 22,754</div>
                <div className="text-[10px] text-slate-400 mt-0.5">April 2026</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="text-[10px] text-blue-500 uppercase tracking-wide mb-1">Projected Net</div>
                <div className="font-mono text-lg font-bold text-emerald-600">AED 20,934</div>
                <div className="text-[10px] text-slate-400 mt-0.5">After 8% fee</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="text-[10px] text-blue-500 uppercase tracking-wide mb-1">vs March</div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  <div className="font-mono text-lg font-bold text-emerald-600">-36%</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Partial month</div>
              </div>
            </div>
            <div className="text-xs text-blue-600 bg-blue-100/50 rounded-lg p-3 border border-blue-100">
              <span className="font-semibold">Recommendation:</span> Adding 3 telemedicine slots per week (at AED 400 each) would add approximately AED 4,800/month to your gross — pushing your monthly target achievement from 91% to 110%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
