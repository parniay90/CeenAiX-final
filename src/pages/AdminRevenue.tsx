import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Download, MoreHorizontal, ChevronDown,
  AlertCircle, AlertTriangle, RefreshCw, DollarSign, Users,
  CreditCard, FileText, BarChart3, ArrowUpRight, ArrowDownRight,
  CheckCircle, XCircle, Clock, Repeat, Shield, Zap, Activity,
  ChevronRight, Eye, EyeOff, RotateCcw, Trash2, Plus,
  ArrowLeft, ArrowRight, Search, X, Copy, Check,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import {
  Currency, FX_RATES, CURRENCY_SYMBOLS, formatCurrency,
  REVENUE_KPIS, REVENUE_TREND, REVENUE_BY_SOURCE, SOURCE_COLORS,
  WORKSPACE_REVENUE, MRR_WATERFALL, SUBSCRIPTION_PLANS, SUBSCRIPTIONS_LIST,
  TRANSACTIONS, INVOICES, PAYOUTS, INSURANCE_KPIS, INSURANCE_TPA,
  REJECTION_REASONS, REFUNDS, DISPUTES, FORECAST_DATA, QUARTERLY_TARGETS,
  REVENUE_ACTIVITY, COHORT_DATA,
} from '../data/revenueData';

// ─── Shared primitives ────────────────────────────────────────────────────────

type Tab =
  | 'overview' | 'subscriptions' | 'transactions' | 'invoices'
  | 'payouts' | 'insurance' | 'refunds' | 'forecasts' | 'reports';

type DateRange = 'today' | '7d' | 'mtd' | '30d' | 'qtd' | 'ytd' | '12m' | 'custom';

const DATE_PRESETS: { id: DateRange; label: string }[] = [
  { id: 'today', label: 'Today'         },
  { id: '7d',    label: 'Last 7 days'   },
  { id: 'mtd',   label: 'Month-to-date' },
  { id: '30d',   label: 'Last 30 days'  },
  { id: 'qtd',   label: 'Quarter-to-date'},
  { id: 'ytd',   label: 'Year-to-date'  },
  { id: '12m',   label: 'Last 12 months'},
  { id: 'custom',label: 'Custom…'       },
];

function Delta({ pct, small }: { pct: number; small?: boolean }) {
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5" style={{ fontSize: small ? 10 : 12, color: up ? '#34D399' : '#F87171', fontFamily: 'DM Mono, monospace' }}>
      <Icon style={{ width: small ? 10 : 12, height: small ? 10 : 12 }} />
      {Math.abs(pct)}%
    </span>
  );
}

function Sparkline({ data, color = '#2DD4BF', height = 28 }: { data: number[]; color?: string; height?: number }) {
  const w = 72;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={height} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Active':       { bg: 'rgba(16,185,129,0.1)',   color: '#34D399' },
    'Paid':         { bg: 'rgba(16,185,129,0.1)',   color: '#34D399' },
    'Succeeded':    { bg: 'rgba(16,185,129,0.1)',   color: '#34D399' },
    'Completed':    { bg: 'rgba(16,185,129,0.1)',   color: '#34D399' },
    'In transit':   { bg: 'rgba(59,130,246,0.12)',  color: '#60A5FA' },
    'Pending':      { bg: 'rgba(245,158,11,0.12)',  color: '#FCD34D' },
    'Sent':         { bg: 'rgba(245,158,11,0.12)',  color: '#FCD34D' },
    'Trial':        { bg: 'rgba(96,165,250,0.12)',  color: '#93C5FD' },
    'Past due':     { bg: 'rgba(239,68,68,0.1)',    color: '#F87171' },
    'Overdue':      { bg: 'rgba(239,68,68,0.1)',    color: '#F87171' },
    'Failed':       { bg: 'rgba(239,68,68,0.1)',    color: '#F87171' },
    'Refunded':     { bg: 'rgba(100,116,139,0.15)', color: '#94A3B8' },
    'Disputed':     { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
    'Canceled':     { bg: 'rgba(100,116,139,0.15)', color: '#94A3B8' },
    'Open':         { bg: 'rgba(245,158,11,0.12)',  color: '#FCD34D' },
    'Lost':         { bg: 'rgba(239,68,68,0.1)',    color: '#F87171' },
  };
  const s = map[status] ?? { bg: 'rgba(100,116,139,0.15)', color: '#94A3B8' };
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5" style={{ background: s.bg, fontSize: 10, color: s.color, fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

const TIER_COLORS: Record<string, string> = {
  Enterprise: '#0D9488', Professional: '#0891B2', Growth: '#8B5CF6', Pilot: '#64748B',
};

function TierChip({ tier }: { tier: string }) {
  const c = TIER_COLORS[tier] ?? '#64748B';
  return (
    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: `${c}22`, color: c, fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', border: `1px solid ${c}33` }}>
      {tier}
    </span>
  );
}

function WorkspaceLogo({ code, color = '#0D9488' }: { code: string; color?: string }) {
  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold flex-shrink-0" style={{ background: `${color}22`, color, fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', border: `1px solid ${color}33` }}>
      {code}
    </div>
  );
}

// ─── KPI strip ────────────────────────────────────────────────────────────────
function KpiStrip({ currency }: { currency: Currency }) {
  const kpis = REVENUE_KPIS;
  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue.aed, currency, true),
      delta: kpis.totalRevenue.delta,
      spark: kpis.totalRevenue.spark,
      color: '#2DD4BF',
    },
    {
      label: 'Net Revenue',
      value: formatCurrency(kpis.netRevenue.aed, currency, true),
      delta: kpis.netRevenue.delta,
      spark: kpis.netRevenue.spark,
      color: '#34D399',
    },
    {
      label: 'MRR',
      value: formatCurrency(kpis.mrr.aed, currency, true),
      sub: `ARR ${formatCurrency(kpis.mrr.aed * 12, currency, true)}`,
      delta: kpis.mrr.delta,
      spark: kpis.mrr.spark,
      color: '#60A5FA',
    },
    {
      label: 'ARPU',
      value: formatCurrency(kpis.arpu.aed, currency, true),
      delta: kpis.arpu.delta,
      spark: kpis.arpu.spark,
      color: '#F59E0B',
    },
    {
      label: 'Active Workspaces',
      value: kpis.activeWorkspaces.value.toString(),
      delta: kpis.activeWorkspaces.delta,
      spark: kpis.activeWorkspaces.spark,
      color: '#A78BFA',
    },
    {
      label: 'Outstanding',
      value: formatCurrency(kpis.outstandingReceivables.aed, currency, true),
      delta: kpis.outstandingReceivables.delta,
      aging: kpis.outstandingReceivables.aging,
      color: '#F87171',
    },
  ];

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
      {cards.map(card => (
        <div key={card.label} className="rounded-2xl p-4 flex flex-col gap-2 cursor-pointer transition-all"
          style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{card.label}</span>
            {'spark' in card && card.spark && <Sparkline data={card.spark as number[]} color={card.color} height={20} />}
          </div>
          <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, color: '#F1F5F9', letterSpacing: '-0.5px' }}>
            {card.value}
          </div>
          {card.aging ? (
            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
              {[
                { v: card.aging[0], c: '#34D399' },
                { v: card.aging[1], c: '#FCD34D' },
                { v: card.aging[2], c: '#FB923C' },
                { v: card.aging[3], c: '#F87171' },
              ].map((b, i) => {
                const total = card.aging!.reduce((a, x) => a + x, 0);
                return <div key={i} style={{ width: `${(b.v / total) * 100}%`, background: b.c }} />;
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {'delta' in card && <Delta pct={card.delta!} small />}
              {'sub' in card && card.sub && <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{card.sub}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Revenue trend chart ──────────────────────────────────────────────────────
const STACK_COLORS = ['#2DD4BF', '#60A5FA', '#F59E0B', '#34D399', '#FB923C', '#A78BFA'];
const STACKS = ['subscriptions', 'consultations', 'lab', 'pharmacy', 'insurance', 'other'] as const;
const STACK_LABELS: Record<string, string> = {
  subscriptions: 'Subscriptions', consultations: 'Consultations',
  lab: 'Lab & Radiology', pharmacy: 'Pharmacy',
  insurance: 'Insurance Fees', other: 'Other',
};

function RevenueChart({ currency }: { currency: Currency }) {
  const rate = FX_RATES[currency];
  const sym = CURRENCY_SYMBOLS[currency];
  const data = REVENUE_TREND.slice(-30).map(d => ({
    ...d,
    date: d.date.slice(5),
    subscriptions: Math.round(d.subscriptions * rate),
    consultations:  Math.round(d.consultations  * rate),
    lab:            Math.round(d.lab            * rate),
    pharmacy:       Math.round(d.pharmacy       * rate),
    insurance:      Math.round(d.insurance      * rate),
    other:          Math.round(d.other          * rate),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((a: number, p: any) => a + (p.value || 0), 0);
    return (
      <div className="rounded-xl p-3 text-xs" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 160 }}>
        <div style={{ color: '#94A3B8', fontFamily: 'DM Mono, monospace', marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.fill, fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>
            <span>{STACK_LABELS[p.dataKey]}</span>
            <span>{sym} {p.value?.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between gap-4 mt-2 pt-2" style={{ borderTop: '1px solid rgba(51,65,85,0.5)', color: '#F1F5F9', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
          <span>Total</span>
          <span>{sym} {total.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#CBD5E1' }}>Revenue Trend</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-3 flex-wrap">
            {STACKS.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: STACK_COLORS[i] }} />
                <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{STACK_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            {STACKS.map((s, i) => (
              <linearGradient key={s} id={`grad-${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={STACK_COLORS[i]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={STACK_COLORS[i]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} interval={4} />
          <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}K`} width={52} />
          <Tooltip content={<CustomTooltip />} />
          {STACKS.map((s, i) => (
            <Area key={s} type="monotone" dataKey={s} stackId="1" stroke={STACK_COLORS[i]} fill={`url(#grad-${s})`} strokeWidth={1.5} dot={false} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Revenue by source ────────────────────────────────────────────────────────
function BySourcePanel({ currency }: { currency: Currency }) {
  const sym = CURRENCY_SYMBOLS[currency];
  return (
    <div className="rounded-2xl p-5 flex gap-6" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
      <div style={{ width: 160, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={REVENUE_BY_SOURCE} dataKey="pct" cx="50%" cy="50%" innerRadius={44} outerRadius={72} strokeWidth={0}>
              {REVENUE_BY_SOURCE.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 8, fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 10 }}>By Source</div>
        <table className="w-full">
          <thead>
            <tr>
              {['Source', 'Revenue', '%', 'Growth'].map(h => (
                <th key={h} className="pb-2 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REVENUE_BY_SOURCE.map((row, i) => (
              <tr key={row.source} style={{ borderTop: '1px solid rgba(51,65,85,0.25)' }}>
                <td className="py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: SOURCE_COLORS[i] }} />
                    <span style={{ fontSize: 12, color: '#CBD5E1' }}>{row.source}</span>
                  </div>
                </td>
                <td className="py-1.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{formatCurrency(row.aed, currency, true)}</span></td>
                <td className="py-1.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{row.pct}%</span></td>
                <td className="py-1.5"><Delta pct={row.delta} small /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Workspace table ──────────────────────────────────────────────────────────
function WorkspaceTable({ currency }: { currency: Currency }) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? WORKSPACE_REVENUE : WORKSPACE_REVENUE.slice(0, 7);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#CBD5E1' }}>Revenue by Workspace</span>
        <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Top {rows.length} of {WORKSPACE_REVENUE.length}</span>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
            {['#', 'Workspace', 'Tier', 'Region', 'Revenue', 'Growth', 'Users', 'ARPU', 'Health'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.rank} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{row.rank}</span></td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <WorkspaceLogo code={row.logo} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#CBD5E1', whiteSpace: 'nowrap' }}>{row.name}</span>
                </div>
              </td>
              <td className="px-4 py-2.5"><TierChip tier={row.tier} /></td>
              <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{row.region}</span></td>
              <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#F1F5F9', fontFamily: 'DM Mono, monospace' }}>{formatCurrency(row.aed, currency, true)}</span></td>
              <td className="px-4 py-2.5"><Delta pct={row.delta} small /></td>
              <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{row.users.toLocaleString()}</span></td>
              <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{formatCurrency(row.arpu, currency, true)}</span></td>
              <td className="px-4 py-2.5">
                <span className="rounded-full px-2 py-0.5" style={{
                  fontSize: 10,
                  background: row.health === 'Healthy' ? 'rgba(16,185,129,0.1)' : row.health === 'At risk' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: row.health === 'Healthy' ? '#34D399' : row.health === 'At risk' ? '#FCD34D' : '#F87171',
                  fontFamily: 'DM Mono, monospace',
                }}>{row.health}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowAll(s => !s)} className="w-full py-3 flex items-center justify-center gap-2 transition-colors" style={{ fontSize: 12, color: '#64748B', borderTop: '1px solid rgba(51,65,85,0.3)' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(30,41,59,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}>
        {showAll ? 'Show less' : `Show all ${WORKSPACE_REVENUE.length} workspaces`}
        <ChevronDown style={{ width: 13, height: 13, transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
    </div>
  );
}

// ─── Cohort heatmap ───────────────────────────────────────────────────────────
function CohortHeatmap() {
  const cols = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'];
  const keys = ['m0','m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11'] as const;
  function cellColor(v: number | null): string {
    if (v === null) return 'rgba(51,65,85,0.2)';
    if (v >= 95) return 'rgba(52,211,153,0.6)';
    if (v >= 90) return 'rgba(52,211,153,0.4)';
    if (v >= 85) return 'rgba(52,211,153,0.25)';
    if (v >= 80) return 'rgba(245,158,11,0.3)';
    return 'rgba(239,68,68,0.3)';
  }
  return (
    <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Revenue Cohort Retention</div>
      <div className="overflow-x-auto">
        <table style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th className="pr-3 pb-2 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Cohort</th>
              {cols.map(c => (
                <th key={c} className="px-1.5 pb-2 text-center" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', minWidth: 40 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORT_DATA.map(row => (
              <tr key={row.month}>
                <td className="pr-3 py-1" style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>{row.month}</td>
                {keys.map(k => {
                  const v = row[k] as number | null;
                  return (
                    <td key={k} className="px-1.5 py-1 text-center">
                      <div className="rounded" style={{ background: cellColor(v), padding: '3px 4px', fontSize: 9, color: v !== null ? '#F1F5F9' : 'transparent', fontFamily: 'DM Mono, monospace' }}>
                        {v !== null ? `${v}%` : '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Activity feed ────────────────────────────────────────────────────────────
function ActivityFeed({ currency }: { currency: Currency }) {
  const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
    payment:  { icon: CheckCircle, color: '#34D399' },
    invoice:  { icon: FileText,    color: '#60A5FA' },
    payout:   { icon: ArrowRight,  color: '#2DD4BF' },
    refund:   { icon: RotateCcw,   color: '#94A3B8' },
    dispute:  { icon: AlertTriangle,color: '#FCD34D' },
    churn:    { icon: TrendingDown, color: '#F87171' },
    failed:   { icon: XCircle,     color: '#F87171' },
    new:      { icon: Plus,        color: '#A78BFA'  },
  };
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Activity</span>
        <button style={{ fontSize: 10, color: '#2DD4BF', fontFamily: 'Inter, sans-serif' }}>View all</button>
      </div>
      {REVENUE_ACTIVITY.map((a, i) => {
        const { icon: Icon, color } = iconMap[a.icon] ?? { icon: Activity, color: '#64748B' };
        const neg = a.amount < 0;
        return (
          <div key={i} className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer" style={{ borderBottom: i < REVENUE_ACTIVITY.length - 1 ? '1px solid rgba(51,65,85,0.2)' : 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}18` }}>
              <Icon style={{ width: 12, height: 12, color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 12, color: '#CBD5E1' }}>{a.event}</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{a.workspace}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: neg ? '#F87171' : '#34D399', fontWeight: 600 }}>
                {neg ? '-' : '+'}{formatCurrency(Math.abs(a.amount), currency, true)}
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{a.ts}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ currency }: { currency: Currency }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5 min-w-0" style={{ flex: '1 1 0' }}>
        <RevenueChart currency={currency} />
        <BySourcePanel currency={currency} />
        <WorkspaceTable currency={currency} />
        <CohortHeatmap />
      </div>
      <div style={{ width: 280, flexShrink: 0 }}>
        <ActivityFeed currency={currency} />
      </div>
    </div>
  );
}

// ─── Subscriptions tab ────────────────────────────────────────────────────────
function SubscriptionsTab({ currency }: { currency: Currency }) {
  const kpis = [
    { label: 'MRR', value: formatCurrency(1248000, currency, true), delta: 9.2, color: '#2DD4BF' },
    { label: 'New MRR',       value: formatCurrency(94000,  currency, true), delta: 14.1, color: '#34D399' },
    { label: 'Expansion MRR', value: formatCurrency(61000,  currency, true), delta: 8.3,  color: '#60A5FA' },
    { label: 'Churned MRR',   value: formatCurrency(22000,  currency, true), delta: -4.1, color: '#F87171' },
  ];

  const waterfallMax = Math.max(...MRR_WATERFALL.map(d => Math.abs(d.aed)));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <Delta pct={k.delta} small />
          </div>
        ))}
      </div>

      {/* MRR Waterfall */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 16 }}>MRR Movement</div>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {MRR_WATERFALL.map((item) => {
            const isNeg = item.aed < 0;
            const h = Math.round((Math.abs(item.aed) / waterfallMax) * 90);
            const color = item.type === 'base' || item.type === 'total' ? '#2DD4BF' : isNeg ? '#F87171' : '#34D399';
            return (
              <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
                <span style={{ fontSize: 9, color, fontFamily: 'DM Mono, monospace' }}>{formatCurrency(Math.abs(item.aed), currency, true)}</span>
                <div className="w-full rounded-t" style={{ height: h, background: color, opacity: 0.85 }} />
                <span style={{ fontSize: 9, color: '#64748B', fontFamily: 'Inter, sans-serif', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plans table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Plan Breakdown</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Plan', 'Active', 'MRR', '% Total', 'Avg Length', 'Churn 90d'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUBSCRIPTION_PLANS.map(p => (
              <tr key={p.plan} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}>
                <td className="px-5 py-3"><TierChip tier={p.plan} /></td>
                <td className="px-5 py-3"><span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'DM Mono, monospace' }}>{p.active}</span></td>
                <td className="px-5 py-3"><span style={{ fontSize: 12, color: '#F1F5F9', fontFamily: 'DM Mono, monospace' }}>{formatCurrency(p.mrrAed, currency, true)}</span></td>
                <td className="px-5 py-3"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{p.pctTotal}%</span></td>
                <td className="px-5 py-3"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{p.avgMonths} mo</span></td>
                <td className="px-5 py-3">
                  <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: p.churnRate === 0 ? '#34D399' : p.churnRate < 5 ? '#FCD34D' : '#F87171' }}>
                    {p.churnRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subscription list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Subscriptions</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Workspace', 'Plan', 'Status', 'MRR', 'Cycle', 'Renewal', 'LTV'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUBSCRIPTIONS_LIST.map(sub => (
              <tr key={sub.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{sub.workspace}</span></td>
                <td className="px-4 py-2.5"><TierChip tier={sub.plan} /></td>
                <td className="px-4 py-2.5"><StatusChip status={sub.status} /></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{formatCurrency(sub.mrrAed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{sub.cycle}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{sub.renewal}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{formatCurrency(sub.ltvAed, currency, true)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Transactions tab ─────────────────────────────────────────────────────────
function TransactionsTab({ currency }: { currency: Currency }) {
  const [search, setSearch] = useState('');
  const [live, setLive] = useState(false);
  const sym = CURRENCY_SYMBOLS[currency];
  const rate = FX_RATES[currency];

  const filtered = useMemo(() =>
    TRANSACTIONS.filter(t => !search || t.id.toLowerCase().includes(search) || t.customer.toLowerCase().includes(search) || t.workspace.toLowerCase().includes(search)),
    [search]);

  function riskColor(score: number) {
    if (score <= 20) return '#34D399';
    if (score <= 50) return '#FCD34D';
    return '#F87171';
  }

  const typeIcons: Record<string, React.ElementType> = {
    Consultation: Activity, 'Lab test': BarChart3, Imaging: Eye, Pharmacy: Plus,
    Subscription: Repeat, 'Insurance fee': Shield, Refund: RotateCcw, Adjustment: RefreshCw,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.5)', minWidth: 200 }}>
          <Search style={{ width: 13, height: 13, color: '#475569', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions, ID, customer…"
            className="bg-transparent outline-none flex-1" style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }} />
          {search && <button onClick={() => setSearch('')}><X style={{ width: 12, height: 12, color: '#64748B' }} /></button>}
        </div>
        <button onClick={() => setLive(l => !l)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
          style={{ background: live ? 'rgba(16,185,129,0.1)' : 'rgba(51,65,85,0.3)', color: live ? '#34D399' : '#64748B', border: `1px solid ${live ? 'rgba(16,185,129,0.25)' : 'transparent'}`, fontSize: 12 }}>
          <div className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          Live tail
        </button>
        <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.3)', color: '#64748B', fontSize: 12 }}>
          <Download style={{ width: 13, height: 13 }} />Export
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['ID', 'Time', 'Type', 'Workspace', 'Gross', 'Net', 'Method', 'Status', 'Risk'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(txn => {
              const Icon = typeIcons[txn.type] ?? Activity;
              const neg = txn.aedGross < 0;
              return (
                <tr key={txn.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: txn.status === 'Disputed' ? 'rgba(239,68,68,0.04)' : 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = txn.status === 'Disputed' ? 'rgba(239,68,68,0.04)' : 'transparent'; }}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{txn.id}</span>
                      <Copy style={{ width: 10, height: 10, color: '#475569', cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{txn.ts}</span></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Icon style={{ width: 12, height: 12, color: '#64748B', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{txn.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{txn.workspace}</span></td>
                  <td className="px-4 py-2.5">
                    <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: neg ? '#F87171' : '#F1F5F9' }}>
                      {neg ? '-' : ''}{sym} {Math.abs(Math.round(txn.aedGross * rate)).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>
                      {neg ? '-' : ''}{sym} {Math.abs(Math.round(txn.aedNet * rate)).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{txn.method}</span></td>
                  <td className="px-4 py-2.5"><StatusChip status={txn.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(51,65,85,0.5)' }}>
                        <div className="h-full rounded-full" style={{ width: `${txn.risk}%`, background: riskColor(txn.risk) }} />
                      </div>
                      <span style={{ fontSize: 10, color: riskColor(txn.risk), fontFamily: 'DM Mono, monospace' }}>{txn.risk}</span>
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

// ─── Invoices tab ─────────────────────────────────────────────────────────────
function InvoicesTab({ currency }: { currency: Currency }) {
  const agingTotal = [480000, 210000, 120000, 82000].reduce((a, b) => a + b, 0);
  const agingItems = [
    { label: '0–30 days',   aed: 480000, color: '#34D399' },
    { label: '31–60 days',  aed: 210000, color: '#FCD34D' },
    { label: '61–90 days',  aed: 120000, color: '#FB923C' },
    { label: '90+ days',    aed:  82000, color: '#F87171' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Outstanding',        value: formatCurrency(892000,  currency, true), color: '#FCD34D' },
          { label: 'Overdue (>30 days)', value: formatCurrency(193560,  currency, true), color: '#F87171' },
          { label: 'Collected (period)', value: formatCurrency(3609840, currency, true), color: '#34D399' },
          { label: 'Avg Days to Pay',    value: '14 days',                               color: '#60A5FA' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Aging bar */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Aging Report</div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
          {agingItems.map(a => (
            <div key={a.label} style={{ width: `${(a.aed / agingTotal) * 100}%`, background: a.color }} />
          ))}
        </div>
        <div className="flex gap-6">
          {agingItems.map(a => (
            <div key={a.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
              <div>
                <div style={{ fontSize: 10, color: '#64748B' }}>{a.label}</div>
                <div style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#CBD5E1' }}>{formatCurrency(a.aed, currency, true)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Invoices</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Invoice #', 'Issued', 'Due', 'Customer', 'Amount', 'Balance', 'Status', 'Last Action'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: inv.status === 'Overdue' ? 'rgba(239,68,68,0.03)' : 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = inv.status === 'Overdue' ? 'rgba(239,68,68,0.03)' : 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{inv.id}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{inv.issued}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: inv.status === 'Overdue' ? '#F87171' : '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{inv.due}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{inv.customer}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{formatCurrency(inv.aed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: inv.balance > 0 ? '#FCD34D' : '#34D399' }}>{formatCurrency(inv.balance, currency, true)}</span></td>
                <td className="px-4 py-2.5"><StatusChip status={inv.status} /></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{inv.lastAction}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Payouts tab ──────────────────────────────────────────────────────────────
function PayoutsTab({ currency }: { currency: Currency }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending',    value: formatCurrency(174000,   currency, true), color: '#FCD34D' },
          { label: 'In Transit', value: formatCurrency(1170000,  currency, true), color: '#60A5FA' },
          { label: 'Paid (period)', value: formatCurrency(1810000, currency, true), color: '#34D399' },
          { label: 'Failed',     value: formatCurrency(142000,   currency, true), color: '#F87171' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Payouts</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Payout ID', 'Workspace', 'Bank / Wallet', 'Amount', 'Status', 'Initiated', 'Arrival'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map(po => (
              <tr key={po.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{po.id}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{po.workspace}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{po.bank}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{formatCurrency(po.aed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><StatusChip status={po.status} /></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{po.initiated}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{po.arrival}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Insurance & Claims tab ───────────────────────────────────────────────────
function InsuranceTab({ currency }: { currency: Currency }) {
  const kpis = INSURANCE_KPIS;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Claims Submitted', value: kpis.submitted.count.toLocaleString(), sub: formatCurrency(kpis.submitted.aed, currency, true), color: '#60A5FA' },
          { label: 'Claims Paid',      value: kpis.paid.count.toLocaleString(),      sub: formatCurrency(kpis.paid.aed, currency, true),      color: '#34D399' },
          { label: 'Avg Payment Days', value: `${kpis.avgPayDays}d`,                sub: '',                                                   color: '#FCD34D' },
          { label: 'Rejection Rate',   value: `${kpis.rejectionRate}%`,             sub: '',                                                   color: '#F87171' },
          { label: 'Outstanding',      value: kpis.outstanding.count.toLocaleString(), sub: formatCurrency(kpis.outstanding.aed, currency, true), color: '#FB923C' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* TPA table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TPA / Insurer Breakdown</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['TPA / Insurer', 'Submitted', 'Paid', 'Rejected', 'Pending', 'Avg Days', 'Rej Rate', 'Total Paid', 'Outstanding'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INSURANCE_TPA.map(tpa => (
              <tr key={tpa.name} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontWeight: 500, color: '#CBD5E1' }}>{tpa.name}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{tpa.submitted.toLocaleString()}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#34D399', fontFamily: 'DM Mono, monospace' }}>{tpa.paid.toLocaleString()}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#F87171', fontFamily: 'DM Mono, monospace' }}>{tpa.rejected.toLocaleString()}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{tpa.pending.toLocaleString()}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{tpa.avgDays}d</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: tpa.rejRate > 10 ? '#F87171' : '#FCD34D' }}>{tpa.rejRate}%</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{formatCurrency(tpa.totalAed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#FCD34D' }}>{formatCurrency(tpa.outstandingAed, currency, true)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection reasons */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Top Rejection Reasons</div>
        <div className="flex flex-col gap-2">
          {REJECTION_REASONS.map((r, i) => {
            const maxCount = REJECTION_REASONS[0].count;
            return (
              <div key={r.reason} className="flex items-center gap-3">
                <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', width: 16, flexShrink: 0, textAlign: 'right' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 11, color: '#CBD5E1', truncate: true } as any}>{r.reason}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>{r.count}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(51,65,85,0.4)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(r.count / maxCount) * 100}%`, background: i < 3 ? '#F87171' : '#FCD34D' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Refunds & Disputes tab ───────────────────────────────────────────────────
function RefundsTab({ currency }: { currency: Currency }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Refunded',  value: formatCurrency(1484, currency, true), color: '#94A3B8' },
          { label: 'Refund Rate',     value: '0.03%',                              color: '#34D399' },
          { label: 'Open Disputes',   value: '2',                                  color: '#FCD34D' },
          { label: 'Total at Risk',   value: formatCurrency(1750, currency, true), color: '#F87171' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Refunds</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Refund ID', 'Original Txn', 'Workspace', 'Amount', 'Reason', 'Initiated By', 'Status', 'Date'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REFUNDS.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{r.id}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{r.txn}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{r.workspace}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F87171' }}>−{formatCurrency(r.aed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8' }}>{r.reason}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{r.initiatedBy}</span></td>
                <td className="px-4 py-2.5"><StatusChip status={r.status} /></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{r.created}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Disputes</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['ID', 'Transaction', 'Workspace', 'Customer', 'Amount', 'Reason', 'Stage', 'Evidence Due', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISPUTES.map(d => (
              <tr key={d.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: d.status === 'Open' ? 'rgba(245,158,11,0.02)' : 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = d.status === 'Open' ? 'rgba(245,158,11,0.02)' : 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{d.id}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{d.txn}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{d.workspace}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{d.customer}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{formatCurrency(d.aed, currency, true)}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8' }}>{d.reason}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{d.stage}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: d.status === 'Open' ? '#FCD34D' : '#64748B', fontFamily: 'DM Mono, monospace' }}>{d.evidenceDue}</span></td>
                <td className="px-4 py-2.5"><StatusChip status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Forecasts tab ────────────────────────────────────────────────────────────
function ForecastsTab({ currency }: { currency: Currency }) {
  const sym = CURRENCY_SYMBOLS[currency];
  const rate = FX_RATES[currency];

  const chartData = FORECAST_DATA.map(d => ({
    ...d,
    mid:    Math.round(d.mid    * rate),
    low:    Math.round(d.low    * rate),
    high:   Math.round(d.high   * rate),
    actual: d.actual ? Math.round(d.actual * rate) : null,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl p-3 text-xs" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <div style={{ color: '#94A3B8', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => p.value && (
          <div key={p.dataKey} style={{ color: p.stroke || '#CBD5E1', fontFamily: 'DM Mono, monospace' }}>
            {p.name}: {sym} {p.value?.toLocaleString()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 16 }}>MRR Forecast — Next 12 Months</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}K`} width={56} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="high"   name="High"   stroke="#34D399" strokeWidth={1} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="mid"    name="Mid"    stroke="#2DD4BF" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="low"    name="Low"    stroke="#F87171" strokeWidth={1} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#F1F5F9" strokeWidth={2.5} dot={{ fill: '#F1F5F9', r: 3 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-2">
          {[
            { color: '#F1F5F9', label: 'Actual', dash: false },
            { color: '#2DD4BF', label: 'Forecast (mid)', dash: false },
            { color: '#34D399', label: 'Best case', dash: true  },
            { color: '#F87171', label: 'Worst case', dash: true },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-5 h-0.5" style={{ background: l.color, borderTop: l.dash ? '1px dashed' : 'none', borderColor: l.color }} />
              <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly targets */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Quarterly Targets</div>
        <div className="flex flex-col gap-4">
          {QUARTERLY_TARGETS.map(q => {
            const pct = q.actualAed ? Math.min((q.actualAed / q.targetAed) * 100, 100) : 0;
            const over = q.actualAed && q.actualAed > q.targetAed;
            return (
              <div key={q.quarter}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{q.quarter}</span>
                  <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: q.actualAed ? (over ? '#34D399' : '#FCD34D') : '#475569' }}>
                    {q.actualAed ? formatCurrency(q.actualAed, currency, true) : '—'}
                    {' / '}
                    <span style={{ color: '#64748B' }}>{formatCurrency(q.targetAed, currency, true)}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(51,65,85,0.4)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: over ? '#34D399' : pct > 60 ? '#FCD34D' : '#60A5FA' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reports tab ──────────────────────────────────────────────────────────────
function ReportsTab() {
  const reports = [
    { name: 'Monthly Board Pack',        desc: 'Executive KPIs, MRR, churn, top workspaces', lastRun: '2026-04-01', schedule: 'Monthly', owner: 'OR' },
    { name: 'Investor Update',           desc: 'ARR, NRR, cohort retention, growth metrics',  lastRun: '2026-04-01', schedule: 'Monthly', owner: 'OR' },
    { name: 'TPA Performance',           desc: 'Claims submitted/paid/rejected per TPA',      lastRun: '2026-04-28', schedule: 'Weekly',  owner: 'PN' },
    { name: 'Workspace P&L',             desc: 'Revenue, costs, and margin per workspace',    lastRun: '2026-04-01', schedule: 'Monthly', owner: 'SL' },
    { name: 'Tax Summary (VAT)',         desc: 'UAE VAT-compliant revenue summary',           lastRun: '2026-03-31', schedule: 'Quarterly', owner: 'OR' },
    { name: 'Cohort Revenue Retention',  desc: 'Monthly cohort revenue retention heatmap',    lastRun: '2026-04-01', schedule: 'Monthly', owner: 'SL' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-colors" style={{ background: '#0D9488', color: '#fff', fontSize: 13 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0F766E'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0D9488'; }}>
          <Plus style={{ width: 13, height: 13 }} />
          New report
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {reports.map(r => (
          <div key={r.name} className="rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; }}>
            <div className="flex items-start justify-between">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{r.name}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(13,148,136,0.2)', color: '#2DD4BF', fontSize: 9 }}>{r.owner}</div>
            </div>
            <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>{r.desc}</p>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Last run {r.lastRun}</span>
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: 'rgba(96,165,250,0.12)', color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{r.schedule}</span>
            </div>
            <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid rgba(51,65,85,0.3)' }}>
              {['Run now', 'Edit', 'Schedule'].map(action => (
                <button key={action} className="flex-1 text-center rounded-lg py-1.5 transition-colors" style={{ fontSize: 11, background: 'rgba(51,65,85,0.3)', color: '#94A3B8' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.background = 'rgba(71,85,105,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(51,65,85,0.3)'; }}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Revenue Page ────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',       label: 'Overview'          },
  { id: 'subscriptions',  label: 'Subscriptions'     },
  { id: 'transactions',   label: 'Transactions'      },
  { id: 'invoices',       label: 'Invoices'          },
  { id: 'payouts',        label: 'Payouts'           },
  { id: 'insurance',      label: 'Insurance & Claims'},
  { id: 'refunds',        label: 'Refunds & Disputes'},
  { id: 'forecasts',      label: 'Forecasts'         },
  { id: 'reports',        label: 'Reports'           },
];

export default function AdminRevenue() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currency, setCurrency]   = useState<Currency>('AED');
  const [dateRange, setDateRange] = useState<DateRange>('mtd');
  const [showDateMenu, setShowDateMenu]     = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showKebab, setShowKebab]           = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':      return <OverviewTab currency={currency} />;
      case 'subscriptions': return <SubscriptionsTab currency={currency} />;
      case 'transactions':  return <TransactionsTab currency={currency} />;
      case 'invoices':      return <InvoicesTab currency={currency} />;
      case 'payouts':       return <PayoutsTab currency={currency} />;
      case 'insurance':     return <InsuranceTab currency={currency} />;
      case 'refunds':       return <RefundsTab currency={currency} />;
      case 'forecasts':     return <ForecastsTab currency={currency} />;
      case 'reports':       return <ReportsTab />;
    }
  };

  const dateLabel = DATE_PRESETS.find(d => d.id === dateRange)?.label ?? 'Custom';

  return (
    <AdminPageLayout activeSection="revenue">
      <div className="flex flex-col min-h-full" style={{ background: '#0F172A' }}>

        {/* Page header */}
        <div className="sticky top-0 z-30 px-6 py-4" style={{ background: '#0F172A', borderBottom: '1px solid rgba(30,41,59,0.8)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h1 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>Revenue</h1>
              <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                Platform-wide financial performance across CeenAiX.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Currency selector */}
              <div className="relative">
                <button onClick={() => setShowCurrencyMenu(m => !m)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#CBD5E1', fontSize: 12, border: '1px solid rgba(51,65,85,0.5)' }}>
                  <DollarSign style={{ width: 12, height: 12 }} />
                  {currency}
                  <ChevronDown style={{ width: 11, height: 11, color: '#64748B' }} />
                </button>
                {showCurrencyMenu && (
                  <div className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 w-32" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {(['AED', 'USD', 'EUR', 'SAR'] as Currency[]).map(c => (
                      <button key={c} onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }} className="w-full px-4 py-2 text-left flex items-center justify-between transition-colors"
                        style={{ fontSize: 12, color: c === currency ? '#2DD4BF' : '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {c}
                        {c === currency && <Check style={{ width: 11, height: 11, color: '#2DD4BF' }} />}
                      </button>
                    ))}
                    <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(51,65,85,0.4)', fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>
                      as of 30 Apr 2026 · EOD
                    </div>
                  </div>
                )}
              </div>

              {/* Date range */}
              <div className="relative">
                <button onClick={() => setShowDateMenu(m => !m)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#CBD5E1', fontSize: 12, border: '1px solid rgba(51,65,85,0.5)' }}>
                  <Clock style={{ width: 12, height: 12 }} />
                  {dateLabel}
                  <ChevronDown style={{ width: 11, height: 11, color: '#64748B' }} />
                </button>
                {showDateMenu && (
                  <div className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 w-44" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {DATE_PRESETS.map(p => (
                      <button key={p.id} onClick={() => { setDateRange(p.id); setShowDateMenu(false); }} className="w-full px-4 py-2 text-left flex items-center justify-between transition-colors"
                        style={{ fontSize: 12, color: p.id === dateRange ? '#2DD4BF' : '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {p.label}
                        {p.id === dateRange && <Check style={{ width: 11, height: 11, color: '#2DD4BF' }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="relative">
                <button onClick={() => setShowExportMenu(m => !m)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#CBD5E1', fontSize: 12, border: '1px solid rgba(51,65,85,0.5)' }}>
                  <Download style={{ width: 12, height: 12 }} />
                  Export
                  <ChevronDown style={{ width: 11, height: 11, color: '#64748B' }} />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 w-48" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {['Export as CSV', 'Export as XLSX', 'Export as PDF summary'].map(label => (
                      <button key={label} onClick={() => setShowExportMenu(false)} className="w-full px-4 py-2.5 text-left transition-colors" style={{ fontSize: 12, color: '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kebab */}
              <div className="relative">
                <button onClick={() => setShowKebab(m => !m)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#64748B', border: '1px solid rgba(51,65,85,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}>
                  <MoreHorizontal style={{ width: 15, height: 15 }} />
                </button>
                {showKebab && (
                  <div className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 w-56" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {['Schedule recurring report', 'Configure revenue settings', 'View revenue audit log'].map(label => (
                      <button key={label} onClick={() => setShowKebab(false)} className="w-full px-4 py-2.5 text-left transition-colors" style={{ fontSize: 12, color: '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <KpiStrip currency={currency} />
        </div>

        <div className="flex-1 px-6 pb-6">
          {/* Alert banners */}
          <div className="flex flex-col gap-2 py-4">
            <div className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle style={{ width: 13, height: 13, color: '#F87171', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#F87171' }}>
                <strong>Action required:</strong> Payout PO-2026-0210 failed for Medcare Sharjah · Dispute DIS-001 evidence due 3 May
              </span>
            </div>
            <div className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <AlertTriangle style={{ width: 13, height: 13, color: '#FCD34D', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#FCD34D' }}>
                <strong>Anomaly alert:</strong> NABIDH claim rejection rate up 3.2% vs. 7-day avg — investigate claim submission pipeline
              </span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-px" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2.5 whitespace-nowrap transition-all" style={{
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#2DD4BF' : '#64748B',
                  borderBottom: `2px solid ${isActive ? '#0D9488' : 'transparent'}`,
                  marginBottom: '-1px',
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#64748B'; }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {renderTab()}
        </div>
      </div>
    </AdminPageLayout>
  );
}
