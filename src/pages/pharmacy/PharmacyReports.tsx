import React from 'react';
import { Download, ShieldCheck, TrendingUp, FileText, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const dailyDispensing = [
  { day: '1 Apr', count: 15 },
  { day: '2 Apr', count: 18 },
  { day: '3 Apr', count: 11 },
  { day: '4 Apr', count: 22 },
  { day: '5 Apr', count: 16 },
  { day: '6 Apr', count: 19 },
  { day: 'Today', count: 8 },
];

const insuranceData = [
  { name: 'Daman', value: 34, color: '#0EA5E9' },
  { name: 'AXA Gulf', value: 22, color: '#6366F1' },
  { name: 'ADNIC', value: 18, color: '#F59E0B' },
  { name: 'Thiqa', value: 14, color: '#10B981' },
  { name: 'Cash', value: 7, color: '#64748B' },
  { name: 'Other', value: 5, color: '#CBD5E1' },
];

const topDrugs = [
  { drug: 'Atorvastatin 20mg', count: 89 },
  { drug: 'Metformin 850mg', count: 76 },
  { drug: 'Amlodipine 5mg', count: 68 },
  { drug: 'Furosemide 40mg', count: 45 },
  { drug: 'Bisoprolol 5mg', count: 38 },
  { drug: 'Ramipril 5mg', count: 31 },
  { drug: 'Omeprazole 40mg', count: 28 },
];

const kpis = [
  { label: 'Prescriptions this month', value: '187', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Dispensing accuracy', value: '99.5%', sub: 'DHA target: 99%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Insurance approval rate', value: '96.2%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Controlled substance compliance', value: '100% ✅', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const PharmacyReports: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
            Reports & Analytics
          </h2>
          <div className="text-slate-400" style={{ fontSize: 13 }}>April 2026 · Al Shifa Pharmacy</div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export Dispensing Ledger
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" /> DHA Monthly Report
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${kpi.bg}`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className={`font-bold mb-1 ${kpi.color}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: 22 }}>
                {kpi.value}
              </div>
              <div className="text-slate-500" style={{ fontSize: 12 }}>{kpi.label}</div>
              {kpi.sub && <div className="text-emerald-600 text-xs mt-0.5">{kpi.sub} ✅</div>}
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Daily dispensing chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
            Daily Dispensing Volume — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyDispensing} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                formatter={(v) => [v, 'Prescriptions']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {dailyDispensing.map((entry, i) => (
                  <Cell key={i} fill={i === dailyDispensing.length - 1 ? '#14B8A6' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Past days</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" /> Today (in progress)</span>
          </div>
        </div>

        {/* Insurance breakdown */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
            Insurance Claims Breakdown — This Month
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={insuranceData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {insuranceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend
                formatter={(val) => <span style={{ fontSize: 11, color: '#64748B' }}>{val}</span>}
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top drugs chart */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-5">
        <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
          Top Dispensed Drugs — Monthly Average (tabs/day)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topDrugs} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="drug" tick={{ fontSize: 11, fill: '#475569', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} width={130} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => [v, 'tabs/day avg']} />
            <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DHA Compliance Report */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
                DHA Monthly Dispensing Report
              </h3>
              <div className="text-slate-400 text-xs">April 2026 · Al Shifa Pharmacy · DHA-PHARM-2019-003481</div>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
            100% Compliant ✅
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            ['Total dispensing records', '187'],
            ['Submitted to DHA', '187 ✅ (100%)'],
            ['Controlled substance records', '12 ✅'],
            ['Last submitted', 'Today 2:00 PM'],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl p-3">
              <div className="text-slate-400 text-xs mb-1">{k}</div>
              <div className="font-bold text-slate-800" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors" style={{ height: 44 }}>
            <Download className="w-4 h-4" /> Download DHA Monthly Report
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyReports;
