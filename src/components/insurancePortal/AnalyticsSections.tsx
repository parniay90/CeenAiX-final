import React, { useState, useMemo } from 'react';
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell, ReferenceLine,
} from 'recharts';
import {
  financialBreakdown, riskStratification, providerPerformance,
  utilizationTrend, quarterlyProjections, fullYearProjection,
} from '../../data/analyticsData';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';

const fmt = (n: number) =>
  n >= 1000000
    ? `AED ${(n / 1000000).toFixed(2)}M`
    : n >= 1000
    ? `AED ${(n / 1000).toFixed(0)}K`
    : `AED ${n.toLocaleString()}`;

const fmtShort = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

const MONO = "'DM Mono', monospace";

type AnalyticsTab = 'financial' | 'risk' | 'provider' | 'utilization' | 'predictive';

interface Props {
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

// ─── FINANCIAL BREAKDOWN ──────────────────────────────────────────────────────
function FinancialTab() {
  const total = financialBreakdown.reduce((s, r) => ({ ytdActual: s.ytdActual + r.ytdActual, ytdBudget: s.ytdBudget + r.ytdBudget }), { ytdActual: 0, ytdBudget: 0 });

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 380px' }}>
      {/* Table */}
      <div>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <table className="w-full" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Category', 'Q1 Budget', 'Q1 Actual', 'YTD Budget', 'YTD Actual', 'Variance', '%'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {financialBreakdown.map((row, i) => (
                <tr key={row.category} style={{ borderBottom: i < financialBreakdown.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <td className="px-4 py-3" style={{ fontWeight: 500, color: '#1E293B' }}>{row.category}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569', fontSize: 12 }}>{fmtShort(row.q1Budget)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#1E293B', fontSize: 12, fontWeight: 600 }}>{fmtShort(row.q1Actual)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569', fontSize: 12 }}>{fmtShort(row.ytdBudget)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#1E293B', fontSize: 12, fontWeight: 600 }}>{fmtShort(row.ytdActual)}</td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: MONO, fontSize: 12, color: row.variance > 0 ? '#DC2626' : row.variance < 0 ? '#16A34A' : '#64748B', fontWeight: 600 }}>
                      {row.variance > 0 ? '+' : ''}{fmtShort(row.variance)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{
                      fontFamily: MONO,
                      background: row.variancePct > 10 ? '#FEE2E2' : row.variancePct > 0 ? '#FEF3C7' : row.variancePct < -5 ? '#DCFCE7' : '#F1F5F9',
                      color: row.variancePct > 10 ? '#DC2626' : row.variancePct > 0 ? '#92400E' : row.variancePct < -5 ? '#15803D' : '#64748B',
                    }}>
                      {row.variancePct > 0 ? '+' : ''}{row.variancePct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1' }}>
                <td className="px-4 py-3" style={{ fontWeight: 700, color: '#0F172A' }}>Total</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3" />
                <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569', fontSize: 12 }}>{fmtShort(total.ytdBudget)}</td>
                <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#1E293B', fontSize: 12, fontWeight: 700 }}>{fmtShort(total.ytdActual)}</td>
                <td className="px-4 py-3">
                  <span style={{ fontFamily: MONO, fontSize: 12, color: total.ytdActual - total.ytdBudget > 0 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
                    {total.ytdActual - total.ytdBudget > 0 ? '+' : ''}{fmtShort(total.ytdActual - total.ytdBudget)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
                    {(((total.ytdActual - total.ytdBudget) / total.ytdBudget) * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget variance chart */}
      <div className="rounded-xl p-5" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Budget vs Actual — YTD</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={financialBreakdown} layout="vertical" margin={{ left: 16, right: 40, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtShort} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} width={120} />
            <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="ytdBudget" name="Budget" fill="#CBD5E1" radius={[0, 2, 2, 0]} animationDuration={800} />
            <Bar dataKey="ytdActual" name="Actual" radius={[0, 2, 2, 0]} animationDuration={800}>
              {financialBreakdown.map((entry) => (
                <Cell key={entry.category} fill={entry.ytdActual > entry.ytdBudget ? '#EF4444' : '#22C55E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── RISK STRATIFICATION ──────────────────────────────────────────────────────
function RiskTab() {
  const total = riskStratification.reduce((s, r) => s + r.totalSpend, 0);

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px' }}>
      <div className="flex flex-col gap-4">
        {riskStratification.map((tier) => (
          <div key={tier.tier} className="rounded-xl p-5" style={{ border: `1px solid ${tier.color}30`, background: tier.bgColor }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tier.tier} Risk</p>
                  <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{tier.members.toLocaleString()} members ({tier.pct}%)</p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Avg cost / member</p>
                <p style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: tier.color }}>{fmt(tier.avgSpend)}</p>
              </div>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div>
                <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Month-to-Date Spend</p>
                <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{fmt(tier.totalSpend)}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Projected Annual</p>
                <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: tier.color }}>{fmt(tier.projectedSpend)}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>% of Total Spend</p>
                <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{((tier.totalSpend / total) * 100).toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-3">
              <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Top Conditions</p>
              <div className="flex gap-2 flex-wrap">
                {tier.topConditions.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded" style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', background: `${tier.color}18`, color: tier.color, fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            </div>
            {/* Spend bar */}
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: `${tier.color}20` }}>
              <div className="h-full rounded-full" style={{ width: `${(tier.totalSpend / total) * 100}%`, background: tier.color, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cost concentration donut */}
      <div className="rounded-xl p-5" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>Cost Concentration</p>
        <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>% of total spend by risk tier</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskStratification.map(r => ({ name: r.tier, value: parseFloat(((r.totalSpend / total) * 100).toFixed(1)), color: r.color }))} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} width={70} />
            <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
              {riskStratification.map(r => <Cell key={r.tier} fill={r.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#92400E', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>Cost Concentration Alert</p>
          <p style={{ fontSize: 11, color: '#78350F', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
            2.7% of members (Critical tier) account for {((riskStratification[0].totalSpend / total) * 100).toFixed(0)}% of claims spend.
            Targeted care management could reduce this significantly.
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {riskStratification.map(r => (
            <div key={r.tier} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                <span style={{ fontSize: 12, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{r.tier}</span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 12, color: '#1E293B', fontWeight: 600 }}>{((r.totalSpend / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROVIDER SCORECARD ───────────────────────────────────────────────────────
function ProviderTab() {
  const [sortBy, setSortBy] = useState<'overallScore' | 'totalPaid' | 'slaScore' | 'fraudFlags'>('overallScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    return [...providerPerformance].sort((a, b) => {
      const diff = (a[sortBy] as number) - (b[sortBy] as number);
      return sortDir === 'desc' ? -diff : diff;
    });
  }, [sortBy, sortDir]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 90 ? '#16A34A' : score >= 80 ? '#2563EB' : score >= 70 ? '#D97706' : '#DC2626';
    return (
      <div className="relative flex items-center justify-center" style={{ width: 36, height: 36 }}>
        <svg width="36" height="36" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3" />
          <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 87.96} 87.96`} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color, position: 'relative', zIndex: 1 }}>{score}</span>
      </div>
    );
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col
      ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
      : null;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) =>
    trend === 'up' ? <TrendingUp size={12} color="#16A34A" /> :
    trend === 'down' ? <TrendingDown size={12} color="#DC2626" /> :
    <Minus size={12} color="#94A3B8" />;

  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <table className="w-full" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider</th>
              <th className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Claims</th>
              <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-700" style={{ fontSize: 11, fontWeight: 600, color: sortBy === 'totalPaid' ? '#1E3A5F' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => handleSort('totalPaid')}>
                <div className="flex items-center gap-1">Paid <SortIcon col="totalPaid" /></div>
              </th>
              <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-700" style={{ fontSize: 11, fontWeight: 600, color: sortBy === 'slaScore' ? '#1E3A5F' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => handleSort('slaScore')}>
                <div className="flex items-center gap-1">SLA <SortIcon col="slaScore" /></div>
              </th>
              <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-700" style={{ fontSize: 11, fontWeight: 600, color: sortBy === 'fraudFlags' ? '#1E3A5F' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => handleSort('fraudFlags')}>
                <div className="flex items-center gap-1">Fraud <SortIcon col="fraudFlags" /></div>
              </th>
              <th className="text-left px-4 py-3 cursor-pointer select-none hover:text-slate-700" style={{ fontSize: 11, fontWeight: 600, color: sortBy === 'overallScore' ? '#1E3A5F' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => handleSort('overallScore')}>
                <div className="flex items-center gap-1">Score <SortIcon col="overallScore" /></div>
              </th>
              <th className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((prov, i) => (
              <tr key={prov.id} style={{ borderBottom: i < sorted.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                <td className="px-4 py-3">
                  <div>
                    <p style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{prov.name}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>{prov.city} · {prov.type}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p style={{ fontFamily: MONO, fontSize: 12, color: '#1E293B' }}>{prov.claimsSubmitted.toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>{((prov.claimsApproved / prov.claimsSubmitted) * 100).toFixed(1)}% approved</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p style={{ fontFamily: MONO, fontSize: 12, color: '#1E293B', fontWeight: 600 }}>{fmtShort(prov.totalPaid)}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>avg {fmtShort(prov.avgClaim)}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{
                    fontFamily: MONO,
                    background: prov.slaScore >= 90 ? '#DCFCE7' : prov.slaScore >= 80 ? '#EFF6FF' : '#FEF3C7',
                    color: prov.slaScore >= 90 ? '#15803D' : prov.slaScore >= 80 ? '#1D4ED8' : '#92400E',
                  }}>{prov.slaScore}%</span>
                </td>
                <td className="px-4 py-3">
                  {prov.fraudFlags > 0
                    ? <span className="flex items-center gap-1" style={{ color: '#DC2626', fontSize: 12, fontWeight: 600 }}><AlertTriangle size={12} />{prov.fraudFlags}</span>
                    : <span style={{ color: '#16A34A', fontSize: 12, fontFamily: MONO }}>—</span>
                  }
                </td>
                <td className="px-4 py-3"><ScoreRing score={prov.overallScore} /></td>
                <td className="px-4 py-3"><TrendIcon trend={prov.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparative bar */}
      <div className="mt-5 rounded-xl p-5" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Overall Provider Score Comparison</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={providerPerformance.map(p => ({ name: p.name.split(' ')[0], score: p.overallScore, color: p.overallScore >= 90 ? '#16A34A' : p.overallScore >= 80 ? '#2563EB' : p.overallScore >= 70 ? '#D97706' : '#DC2626' }))} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
            <Tooltip formatter={(v: number) => `${v}/100`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <ReferenceLine y={80} stroke="#CBD5E1" strokeDasharray="4 4" label={{ value: 'Target 80', position: 'right', fontSize: 10, fill: '#94A3B8' }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={800}>
              {providerPerformance.map(p => <Cell key={p.id} fill={p.overallScore >= 90 ? '#16A34A' : p.overallScore >= 80 ? '#2563EB' : p.overallScore >= 70 ? '#D97706' : '#DC2626'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── UTILIZATION TRENDS ───────────────────────────────────────────────────────
function UtilizationTab() {
  const categories = [
    { key: 'inpatient', label: 'Inpatient', color: '#1E40AF' },
    { key: 'outpatient', label: 'Outpatient', color: '#0369A1' },
    { key: 'pharmacy', label: 'Pharmacy', color: '#0F766E' },
    { key: 'dental', label: 'Dental', color: '#7C3AED' },
    { key: 'vision', label: 'Vision', color: '#BE185D' },
  ];

  const conditionData = [
    { condition: 'Hypertension', encounters: 4218, cost: 2841200 },
    { condition: 'Diabetes (T2)', encounters: 3847, cost: 5412800 },
    { condition: 'Upper Respiratory', encounters: 6412, cost: 1284100 },
    { condition: 'Musculoskeletal', encounters: 2941, cost: 4184200 },
    { condition: 'Anxiety/Depression', encounters: 2184, cost: 1841200 },
    { condition: 'Ischemic Heart', encounters: 1247, cost: 6284100 },
    { condition: 'Asthma/COPD', encounters: 1841, cost: 2641800 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl p-5" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>Claims Spend by Care Category</p>
        <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Monthly stacked spend — Jan through Apr 2026</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={utilizationTrend} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
            <Tooltip formatter={(v: number, name: string) => [fmt(v), name]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Legend iconType="square" wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
            {categories.map(c => (
              <Area key={c.key} type="monotone" dataKey={c.key} name={c.label} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.15} animationDuration={800} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>Top Condition Frequency (YTD)</p>
        </div>
        <table className="w-full" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Condition', 'Encounters', 'Total Cost', 'Avg Cost / Encounter', '% of Total Spend'].map(h => (
                <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conditionData.map((row, i) => {
              const totalCost = conditionData.reduce((s, r) => s + r.cost, 0);
              return (
                <tr key={row.condition} style={{ borderBottom: i < conditionData.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <td className="px-4 py-3" style={{ fontWeight: 500, color: '#1E293B' }}>{row.condition}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569' }}>{row.encounters.toLocaleString()}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, fontWeight: 600, color: '#1E293B' }}>{fmt(row.cost)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569' }}>{fmt(Math.round(row.cost / row.encounters))}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9', minWidth: 60 }}>
                        <div className="h-full rounded-full" style={{ width: `${(row.cost / totalCost) * 100}%`, background: '#1E3A5F' }} />
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: '#64748B', minWidth: 36 }}>{((row.cost / totalCost) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PREDICTIVE MODELING ──────────────────────────────────────────────────────
function PredictiveTab({ onToast }: { onToast: (msg: string, type: 'success' | 'warning' | 'info') => void }) {
  const [memberGrowth, setMemberGrowth] = useState(3);
  const [medInflation, setMedInflation] = useState(6);
  const [fraudReduction, setFraudReduction] = useState(15);
  const [careManagement, setCareManagement] = useState(8);

  const adjustedProjections = useMemo(() => {
    const growthFactor = 1 + memberGrowth / 100;
    const inflationFactor = 1 + medInflation / 100;
    const fraudFactor = 1 - (fraudReduction / 100) * 0.05;
    const careFactor = 1 - (careManagement / 100) * 0.04;
    const combined = growthFactor * inflationFactor * fraudFactor * careFactor;
    return quarterlyProjections.map(q => ({
      ...q,
      adjusted: Math.round(q.baseCase * combined),
    }));
  }, [memberGrowth, medInflation, fraudReduction, careManagement]);

  const totalAdjusted = adjustedProjections.reduce((s, q) => s + q.adjusted, 0);
  const totalBase = quarterlyProjections.reduce((s, q) => s + q.baseCase, 0);
  const savingsVsBase = totalBase - totalAdjusted;

  return (
    <div className="flex flex-col gap-5">
      {/* Full-year projection chart */}
      <div className="rounded-xl p-5" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>Full-Year Claims Projection — 2026</p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Actual (Jan–Apr) + AI projection (May–Dec)</p>
          </div>
          <div className="flex items-center gap-4" style={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#1E40AF' }} /><span style={{ color: '#64748B' }}>Actual</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#0F766E', borderBottom: '2px dashed #0F766E', height: 0 }} /><span style={{ color: '#64748B' }}>Projected</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: '#CBD5E1' }} /><span style={{ color: '#64748B' }}>Budget</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={fullYearProjection} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
            <Tooltip formatter={(v: number | null, name: string) => v ? [fmt(v), name] : ['-', name]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="actual" name="Actual" fill="#1E40AF" fillOpacity={0.8} radius={[2, 2, 0, 0]} animationDuration={800} />
            <Bar dataKey="projected" name="Projected" fill="#0F766E" fillOpacity={0.5} radius={[2, 2, 0, 0]} animationDuration={800} />
            <Line dataKey="budget" name="Budget" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={800} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 360px' }}>
        {/* Quarterly projections table */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>Quarterly Projection Detail</p>
          </div>
          <table className="w-full" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Quarter', 'Base Case', 'Adjusted', 'Optimistic', 'Pessimistic', 'Confidence'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjustedProjections.map((q, i) => (
                <tr key={q.quarter} style={{ borderBottom: i < adjustedProjections.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <td className="px-4 py-3" style={{ fontWeight: 600, color: '#1E293B' }}>{q.quarter}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#475569', fontSize: 12 }}>{fmtShort(q.baseCase)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: q.adjusted < q.baseCase ? '#16A34A' : '#DC2626' }}>{fmtShort(q.adjusted)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#16A34A', fontSize: 12 }}>{fmtShort(q.optimistic)}</td>
                  <td className="px-4 py-3" style={{ fontFamily: MONO, color: '#DC2626', fontSize: 12 }}>{fmtShort(q.pessimistic)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ width: 48, background: '#F1F5F9' }}>
                        <div className="h-full rounded-full" style={{ width: `${q.confidence}%`, background: q.confidence >= 80 ? '#16A34A' : q.confidence >= 65 ? '#D97706' : '#DC2626' }} />
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: '#64748B' }}>{q.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#F0FDF4', borderTop: '2px solid #BBF7D0' }}>
                <td className="px-4 py-3" style={{ fontWeight: 700, color: '#15803D' }}>Full Year</td>
                <td className="px-4 py-3" style={{ fontFamily: MONO, fontSize: 12, color: '#475569' }}>{fmtShort(totalBase)}</td>
                <td className="px-4 py-3" style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#15803D' }}>{fmtShort(totalAdjusted)}</td>
                <td colSpan={3} className="px-4 py-3" style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>
                  {savingsVsBase > 0 ? `Saves ${fmtShort(savingsVsBase)} vs base` : `+${fmtShort(-savingsVsBase)} vs base`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scenario sliders */}
        <div className="rounded-xl p-5 flex flex-col gap-4" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Scenario Modeling</p>
            <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Adjust assumptions to model outcomes</p>
          </div>

          {[
            { label: 'Member Growth Rate', value: memberGrowth, set: setMemberGrowth, min: -5, max: 20, unit: '%', color: '#2563EB' },
            { label: 'Medical Inflation', value: medInflation, set: setMedInflation, min: 0, max: 20, unit: '%', color: '#EA580C' },
            { label: 'Fraud Reduction', value: fraudReduction, set: setFraudReduction, min: 0, max: 40, unit: '%', color: '#16A34A' },
            { label: 'Care Management Savings', value: careManagement, set: setCareManagement, min: 0, max: 30, unit: '%', color: '#7C3AED' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 12, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{s.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: s.color }}>{s.value > 0 ? '+' : ''}{s.value}{s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))}
                className="w-full" style={{ accentColor: s.color, height: 4 }} />
            </div>
          ))}

          <div className="mt-2 p-3 rounded-lg" style={{ background: savingsVsBase > 0 ? '#F0FDF4' : '#FFF5F5', border: `1px solid ${savingsVsBase > 0 ? '#BBF7D0' : '#FCA5A5'}` }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: savingsVsBase > 0 ? '#15803D' : '#DC2626', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
              Scenario Result vs Base
            </p>
            <p style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: savingsVsBase > 0 ? '#16A34A' : '#DC2626' }}>
              {savingsVsBase > 0 ? '−' : '+'}{fmt(Math.abs(savingsVsBase))}
            </p>
            <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>Projected annual claim cost delta</p>
          </div>

          <button
            onClick={() => onToast('Scenario saved to report queue', 'success')}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 12 }}
          >
            Save Scenario to Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const TABS: { id: AnalyticsTab; label: string }[] = [
  { id: 'financial', label: 'Financial Breakdown' },
  { id: 'risk', label: 'Risk Stratification' },
  { id: 'provider', label: 'Provider Scorecard' },
  { id: 'utilization', label: 'Utilization Trends' },
  { id: 'predictive', label: 'Predictive Modeling' },
];

export default function AnalyticsSections({ onToast }: Props) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('financial');

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: activeTab === tab.id ? '#1E3A5F' : '#64748B',
              borderBottom: activeTab === tab.id ? '2px solid #1E3A5F' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'financial' && <FinancialTab />}
        {activeTab === 'risk' && <RiskTab />}
        {activeTab === 'provider' && <ProviderTab />}
        {activeTab === 'utilization' && <UtilizationTab />}
        {activeTab === 'predictive' && <PredictiveTab onToast={onToast} />}
      </div>
    </div>
  );
}
