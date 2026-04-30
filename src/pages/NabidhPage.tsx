import React, { useState, useMemo } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowLeft, ArrowUpRight,
  ArrowDownRight, BarChart3, CheckCircle, ChevronDown, ChevronRight,
  Clock, Copy, Download, Eye, EyeOff, FileText, Info, Lock,
  MoreHorizontal, Plus, RefreshCw, RotateCcw, Search, Shield,
  Settings, TestTube, Trash2, Upload, Users, X, XCircle, Zap,
  Server, Key, Map, Webhook, Check, Play, Pause,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import {
  NABIDH_STATUS, COMPLIANCE_STRIP, NABIDH_KPIS,
  HOURLY_DATA, SUBMISSION_TYPES, OUTCOME_DATA, OUTCOME_COLORS,
  QUEUE_ITEMS, REJECTION_CODES, REJECTIONS_LIST,
  CONSENT_KPIS, CONSENT_CATEGORIES, CONSENT_LIST,
  CERTIFICATES, PING_HISTORY, AUDIT_LOG,
  FHIR_PROFILES, UNMAPPED_CODES, NABIDH_REPORTS,
  NABIDH_ACTIVITY, LATENCY_BUCKETS,
} from '../data/nabidhData';

// ─── Shared primitives ────────────────────────────────────────────────────────

type Tab = 'overview' | 'queue' | 'rejections' | 'consent' | 'mappings' | 'certificates' | 'audit' | 'reports' | 'configuration';

function Sparkline({ data, color = '#2DD4BF', h = 24 }: { data: number[]; color?: string; h?: number }) {
  const w = 64;
  const max = Math.max(...data, 1), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * h}`);
  return (
    <svg width={w} height={h}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

function Delta({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5" style={{ fontSize: 10, color: up ? '#34D399' : '#F87171', fontFamily: 'DM Mono, monospace' }}>
      <Icon style={{ width: 10, height: 10 }} />
      {Math.abs(pct)}%
    </span>
  );
}

function Chip({ label, style }: { label: string; style: React.CSSProperties }) {
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 whitespace-nowrap" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', ...style }}>{label}</span>;
}

function StagePill({ stage }: { stage: string }) {
  const map: Record<string, React.CSSProperties> = {
    Pending:      { background: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
    'In flight':  { background: 'rgba(45,212,191,0.12)',  color: '#2DD4BF' },
    Retrying:     { background: 'rgba(245,158,11,0.12)',  color: '#FCD34D' },
    'Dead-letter':{ background: 'rgba(239,68,68,0.12)',   color: '#F87171' },
    Held:         { background: 'rgba(100,116,139,0.2)',  color: '#94A3B8' },
  };
  return <Chip label={stage} style={map[stage] ?? { background: 'rgba(100,116,139,0.15)', color: '#94A3B8' }} />;
}

function ConnectionPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    Connected:    { bg: 'rgba(16,185,129,0.12)', color: '#34D399', dot: '#34D399' },
    Degraded:     { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', dot: '#FCD34D' },
    Disconnected: { bg: 'rgba(239,68,68,0.12)',  color: '#F87171', dot: '#F87171' },
  };
  const s = map[status] ?? map.Disconnected;
  return (
    <span className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: s.bg, border: `1px solid ${s.dot}44` }}>
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.dot }} />
      <span style={{ fontSize: 12, color: s.color, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{status}</span>
    </span>
  );
}

// ─── Compliance strip ─────────────────────────────────────────────────────────
function ComplianceStrip() {
  const c = COMPLIANCE_STRIP;
  const certWarning = c.certificate.daysLeft <= 60;
  const certCritical = c.certificate.daysLeft <= 30;

  const items = [
    {
      label: 'DHA Facility License',
      value: c.dhaLicense.number,
      sub: `${c.dhaLicense.status} · Expires ${c.dhaLicense.expiry}`,
      ok: true,
      mono: true,
    },
    {
      label: 'NABIDH Onboarding',
      value: c.onboardingStatus.status,
      sub: `Approved ${c.onboardingStatus.approvalDate}`,
      ok: true,
    },
    {
      label: 'mTLS Certificate',
      value: `${c.certificate.daysLeft}d left`,
      sub: `Expires ${c.certificate.expiry}`,
      ok: !certCritical,
      warn: certWarning && !certCritical,
      crit: certCritical,
      action: 'Rotate now',
    },
    {
      label: 'Last Submission',
      value: c.lastSuccessful,
      sub: 'View last event',
      ok: true,
    },
    {
      label: 'Submission Rate 24h',
      value: `${c.submissionRate24h}%`,
      sub: 'Target ≥ 99%',
      ok: c.submissionRate24h >= 99,
      warn: c.submissionRate24h < 99,
    },
    {
      label: 'Outstanding Rejections',
      value: c.outstandingRej.toString(),
      sub: c.outstandingRej > 0 ? 'Resolve now →' : 'None',
      ok: c.outstandingRej === 0,
      warn: c.outstandingRej > 0,
    },
    {
      label: 'Compliance Score',
      value: c.complianceScore,
      sub: 'A = Excellent',
      ok: true,
    },
  ];

  return (
    <div className="flex items-stretch gap-px overflow-x-auto flex-shrink-0" style={{ background: '#0F172A', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
      {items.map((item, i) => {
        const bg = item.crit ? 'rgba(239,68,68,0.07)' : item.warn ? 'rgba(245,158,11,0.06)' : 'transparent';
        const valColor = item.crit ? '#F87171' : item.warn ? '#FCD34D' : '#F1F5F9';
        const border = item.crit ? 'rgba(239,68,68,0.3)' : item.warn ? 'rgba(245,158,11,0.25)' : 'transparent';
        return (
          <div key={i} className="flex flex-col gap-0.5 px-4 py-3 flex-shrink-0" style={{ background: bg, borderLeft: `2px solid ${border}`, minWidth: 140 }}>
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: valColor, fontFamily: item.mono ? 'DM Mono, monospace' : 'Plus Jakarta Sans, sans-serif' }}>{item.value}</span>
            <span style={{ fontSize: 10, color: item.action ? (item.crit ? '#F87171' : '#FCD34D') : '#475569', fontFamily: 'Inter, sans-serif', cursor: item.action ? 'pointer' : 'default' }}>{item.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── KPI strip ────────────────────────────────────────────────────────────────
function KpiStrip() {
  const k = NABIDH_KPIS;
  const cards = [
    { label: 'Submissions 24h',   value: k.submissions24h.value.toLocaleString(),   delta: k.submissions24h.delta,   spark: k.submissions24h.spark,   color: '#2DD4BF' },
    { label: 'Success Rate 24h',  value: `${k.successRate24h.value}%`,              delta: k.successRate24h.delta,   spark: k.successRate24h.spark,   color: '#34D399' },
    { label: 'Latency p50/p95',   value: `${k.avgLatency.p50}ms`,                  sub: `p95: ${k.avgLatency.p95}ms`,                                color: '#60A5FA' },
    { label: 'Pending Queue',     value: k.pendingQueue.value.toString(),           sub: `${k.pendingQueue.breakdown.lt1m} <1m`,                      color: '#FCD34D' },
    { label: 'Rejected 24h',      value: k.rejected24h.value.toString(),           delta: k.rejected24h.delta,      spark: k.submissions24h.spark.map(v => v * 0.01), color: '#F87171' },
    { label: 'Consent Coverage',  value: `${k.consentCoverage.value}%`,            delta: k.consentCoverage.delta,  spark: k.consentCoverage.spark,  color: '#A78BFA' },
  ];

  return (
    <div className="grid gap-4 px-6 pt-5 pb-1" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
      {cards.map(card => (
        <div key={card.label} className="rounded-2xl p-4 flex flex-col gap-2 cursor-pointer transition-all"
          style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{card.label}</span>
            {'spark' in card && card.spark && <Sparkline data={card.spark as number[]} color={card.color} />}
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.5px' }}>{card.value}</div>
          <div className="flex items-center justify-between">
            {'delta' in card && card.delta !== undefined && <Delta pct={card.delta} />}
            {'sub' in card && card.sub && <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{card.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
const EVENT_STACK_KEYS = ['encounters','prescriptions','labOrders','labResults','imaging','diagnoses','discharge','vitals','allergies','immunizations'] as const;
const EVENT_STACK_COLORS = ['#2DD4BF','#60A5FA','#F59E0B','#34D399','#FB923C','#A78BFA','#F87171','#38BDF8','#10B981','#FBBF24'];
const EVENT_STACK_LABELS: Record<string, string> = {
  encounters: 'Encounters', prescriptions: 'Prescriptions', labOrders: 'Lab Orders',
  labResults: 'Lab Results', imaging: 'Imaging', diagnoses: 'Diagnoses',
  discharge: 'Discharge', vitals: 'Vitals', allergies: 'Allergies', immunizations: 'Immunizations',
};

function OverviewTab() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
    return (
      <div className="rounded-xl p-3" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 200 }}>
        <div style={{ color: '#94A3B8', fontFamily: 'DM Mono, monospace', marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.fill, fontFamily: 'DM Mono, monospace', marginBottom: 1 }}>
            <span>{EVENT_STACK_LABELS[p.dataKey]}</span>
            <span>{p.value}</span>
          </div>
        ))}
        <div className="flex justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(51,65,85,0.4)', color: '#F1F5F9', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
          <span>Total</span><span>{total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5 min-w-0" style={{ flex: '1 1 0' }}>
        {/* Throughput chart */}
        <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#CBD5E1' }}>Submission Throughput — 24h</span>
            <div className="flex gap-3 flex-wrap">
              {EVENT_STACK_KEYS.slice(0, 5).map((k, i) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: EVENT_STACK_COLORS[i] }} />
                  <span style={{ fontSize: 10, color: '#64748B' }}>{EVENT_STACK_LABELS[k]}</span>
                </div>
              ))}
              <span style={{ fontSize: 10, color: '#475569' }}>+5 more</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                {EVENT_STACK_KEYS.map((k, i) => (
                  <linearGradient key={k} id={`ngrad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EVENT_STACK_COLORS[i]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={EVENT_STACK_COLORS[i]} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              {EVENT_STACK_KEYS.map((k, i) => (
                <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={EVENT_STACK_COLORS[i]} fill={`url(#ngrad-${k})`} strokeWidth={1.2} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Outcomes donut + latency */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl p-5 flex gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ width: 110, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={OUTCOME_DATA} dataKey="count" cx="50%" cy="50%" innerRadius={30} outerRadius={52} strokeWidth={0}>
                    {OUTCOME_DATA.map((_, i) => <Cell key={i} fill={OUTCOME_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 8 }}>Outcomes</div>
              {OUTCOME_DATA.map((row, i) => (
                <div key={row.outcome} className="flex items-center justify-between py-1" style={{ borderBottom: i < OUTCOME_DATA.length - 1 ? '1px solid rgba(51,65,85,0.2)' : 'none' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: OUTCOME_COLORS[i] }} />
                    <span style={{ fontSize: 11, color: '#CBD5E1' }}>{row.outcome}</span>
                  </div>
                  <div className="text-right">
                    <span style={{ fontSize: 11, color: '#F1F5F9', fontFamily: 'DM Mono, monospace' }}>{row.count.toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginLeft: 4 }}>{row.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 8 }}>Latency Distribution</div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={LATENCY_BUCKETS} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="count" radius={[3,3,0,0]}>
                    {LATENCY_BUCKETS.map((b, i) => (
                      <Cell key={i} fill={i <= 1 ? '#34D399' : i <= 3 ? '#FCD34D' : '#F87171'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* SLA marker */}
              <div className="absolute top-0" style={{ left: '28%', height: '100%', borderLeft: '2px dashed rgba(45,212,191,0.5)' }}>
                <span style={{ position: 'absolute', top: 0, left: 4, fontSize: 8, color: '#2DD4BF', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>DHA SLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event type breakdown */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Event Type Breakdown</span>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
                {['Event Type','Submissions','Success Rate','Avg Latency','Rej Rate','Pending','Last Submitted'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBMISSION_TYPES.map(row => (
                <tr key={row.type} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{row.type}</span></td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#F1F5F9' }}>{row.count.toLocaleString()}</span></td>
                  <td className="px-4 py-2.5">
                    <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: row.successRate >= 99 ? '#34D399' : row.successRate >= 98 ? '#FCD34D' : '#F87171' }}>
                      {row.successRate}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{row.avgLatency}ms</span></td>
                  <td className="px-4 py-2.5">
                    <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: row.rejRate >= 2 ? '#F87171' : row.rejRate >= 1 ? '#FCD34D' : '#34D399' }}>
                      {row.rejRate}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{row.pending}</span></td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{row.lastSubmitted}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div className="rounded-2xl overflow-hidden sticky top-0" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Live Activity</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {NABIDH_ACTIVITY.map((a, i) => {
            const dotColor = a.severity === 'success' ? '#34D399' : a.severity === 'warning' ? '#FCD34D' : a.severity === 'error' ? '#F87171' : '#60A5FA';
            return (
              <div key={i} className="px-4 py-3 transition-colors cursor-pointer" style={{ borderBottom: '1px solid rgba(51,65,85,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 11, color: '#CBD5E1', lineHeight: 1.4 }}>{a.event}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{a.patientId}</span>
                      <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{a.ts}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="w-full py-2.5 text-center transition-colors" style={{ fontSize: 11, color: '#2DD4BF', borderTop: '1px solid rgba(51,65,85,0.3)' }}>
            View all in Audit Log →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Submission Queue tab ─────────────────────────────────────────────────────
function QueueTab() {
  const [activeStage, setActiveStage] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [live, setLive] = useState(false);

  const stages = ['All', 'Pending', 'In flight', 'Retrying', 'Dead-letter', 'Held'];
  const stageCounts: Record<string, number> = {};
  QUEUE_ITEMS.forEach(q => { stageCounts[q.stage] = (stageCounts[q.stage] || 0) + 1; });

  const filtered = useMemo(() =>
    QUEUE_ITEMS.filter(q => {
      if (activeStage !== 'All' && q.stage !== activeStage) return false;
      if (search && !q.id.includes(search) && !q.eventType.toLowerCase().includes(search) && !q.patientId.includes(search)) return false;
      return true;
    }),
    [activeStage, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Dead-letter banner */}
      {QUEUE_ITEMS.filter(q => q.stage === 'Dead-letter').length > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle style={{ width: 14, height: 14, color: '#F87171', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#F87171' }}>
            <strong>{QUEUE_ITEMS.filter(q => q.stage === 'Dead-letter').length} events</strong> in dead-letter queue require admin action — max retries exhausted.
          </span>
          <button className="ml-auto text-xs rounded-lg px-3 py-1" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            Resolve all
          </button>
        </div>
      )}

      {/* Stage sub-tabs */}
      <div className="flex gap-1" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
        {stages.map(s => {
          const cnt = s === 'All' ? QUEUE_ITEMS.length : (stageCounts[s] || 0);
          const isActive = activeStage === s;
          return (
            <button key={s} onClick={() => setActiveStage(s)} className="flex items-center gap-1.5 px-3 py-2.5 transition-all whitespace-nowrap" style={{
              fontSize: 12, color: isActive ? '#2DD4BF' : '#64748B',
              borderBottom: `2px solid ${isActive ? '#0D9488' : 'transparent'}`,
              marginBottom: '-1px', fontFamily: 'Inter, sans-serif', fontWeight: isActive ? 600 : 400,
            }}>
              {s}
              {cnt > 0 && (
                <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 9, background: s === 'Dead-letter' ? 'rgba(239,68,68,0.2)' : s === 'Retrying' ? 'rgba(245,158,11,0.15)' : 'rgba(51,65,85,0.4)', color: s === 'Dead-letter' ? '#F87171' : s === 'Retrying' ? '#FCD34D' : '#64748B', fontFamily: 'DM Mono, monospace' }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.5)', maxWidth: 320 }}>
          <Search style={{ width: 13, height: 13, color: '#475569', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search event ID, patient ID…" className="bg-transparent outline-none flex-1" style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'DM Mono, monospace' }} />
          {search && <button onClick={() => setSearch('')}><X style={{ width: 12, height: 12, color: '#64748B' }} /></button>}
        </div>
        <button onClick={() => setLive(l => !l)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: live ? 'rgba(16,185,129,0.1)' : 'rgba(51,65,85,0.3)', color: live ? '#34D399' : '#64748B', border: `1px solid ${live ? 'rgba(16,185,129,0.25)' : 'transparent'}`, fontSize: 12 }}>
          <div className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          Live tail
        </button>
        <div className="ml-auto flex items-center gap-2">
          {['Retry selected', 'Hold selected', 'Export selected'].map(a => (
            <button key={a} className="rounded-lg px-3 py-1.5 transition-colors" style={{ fontSize: 11, background: 'rgba(51,65,85,0.3)', color: '#64748B' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Queue table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              <th className="px-4 py-2.5 w-8"><input type="checkbox" className="w-3.5 h-3.5 accent-teal-500" /></th>
              {['Event ID','Created','Type','Source','Patient ID','Facility','Stage','Attempts','Next Retry','Last Error',''].map(h => (
                <th key={h} className="px-3 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} className="cursor-pointer group transition-colors" style={{
                borderBottom: '1px solid rgba(51,65,85,0.25)',
                background: q.stage === 'Dead-letter' ? 'rgba(239,68,68,0.03)' : q.stage === 'Held' ? 'rgba(100,116,139,0.04)' : 'transparent',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = q.stage === 'Dead-letter' ? 'rgba(239,68,68,0.03)' : q.stage === 'Held' ? 'rgba(100,116,139,0.04)' : 'transparent'; }}>
                <td className="px-4 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-teal-500" /></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 10, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{q.id}</span>
                    <Copy style={{ width: 10, height: 10, color: '#475569', cursor: 'pointer' }} />
                  </div>
                </td>
                <td className="px-3 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{q.createdAt}</span></td>
                <td className="px-3 py-2.5">
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(45,212,191,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>{q.eventType}</span>
                </td>
                <td className="px-3 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8' }}>{q.source}</span></td>
                <td className="px-3 py-2.5">
                  <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{q.patientId}</span>
                </td>
                <td className="px-3 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{q.facility}</span></td>
                <td className="px-3 py-2.5"><StagePill stage={q.stage} /></td>
                <td className="px-3 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{q.attempts}</span></td>
                <td className="px-3 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{q.nextRetry}</span></td>
                <td className="px-3 py-2.5 max-w-40">
                  {q.lastError && <span style={{ fontSize: 10, color: '#F87171', fontFamily: 'DM Mono, monospace' }} title={q.lastError}>{q.lastError.slice(0, 40)}{q.lastError.length > 40 ? '…' : ''}</span>}
                </td>
                <td className="px-3 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-teal-400 transition-colors" title="View payload"><Eye style={{ width: 11, height: 11 }} /></button>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-amber-400 transition-colors" title="Retry now"><RefreshCw style={{ width: 11, height: 11 }} /></button>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors" title="Cancel"><X style={{ width: 11, height: 11 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="py-12 text-center" style={{ color: '#475569', fontSize: 13 }}>No events in this queue stage.</div>
        )}
      </div>
    </div>
  );
}

// ─── Rejections tab ───────────────────────────────────────────────────────────
function RejectionsTab() {
  const maxCount = Math.max(...REJECTION_CODES.map(r => r.count));
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Rejections',   value: '7',           color: '#F87171' },
          { label: 'Avg Time to Resolve',value: '1.8 days',   color: '#FCD34D' },
          { label: 'Top Reason',        value: 'EID not found',color: '#FB923C', small: true },
          { label: 'Repeat Event Types',value: 'Lab Order',   color: '#A78BFA', small: true },
        ].map(k => (
          <div key={k.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: k.small ? 'Inter, sans-serif' : 'DM Mono, monospace', fontSize: k.small ? 14 : 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Rejection reasons chart */}
        <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Rejection Codes</div>
          <div className="flex flex-col gap-3">
            {REJECTION_CODES.map((r, i) => (
              <div key={r.code} className="cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{r.code}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{r.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.4)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(r.count / maxCount) * 100}%`, background: i < 2 ? '#F87171' : i < 4 ? '#FCD34D' : '#FB923C' }} />
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Remediation guide */}
        <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Remediation Guide — NABIDH-ERR-3008</div>
          <div className="flex flex-col gap-3">
            <div>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>Error</div>
              <div style={{ fontSize: 12, color: '#F1F5F9', fontFamily: 'DM Mono, monospace' }}>NABIDH-ERR-3008: Invalid or unmapped LOINC code</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>Common causes</div>
              <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>Local lab system uses proprietary codes not mapped to LOINC. LOINC version mismatch between CeenAiX and NABIDH registry.</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>Recommended fix</div>
              <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>Add the local code to the LOINC mapping table in Mappings & Schemas tab. Verify LOINC version is 2.76+.</div>
            </div>
            <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.12)'; }}>
              <Map style={{ width: 12, height: 12 }} />
              Create mapping rule to prevent this
            </button>
          </div>
        </div>
      </div>

      {/* Rejection list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Open Rejections</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Event ID','Type','Patient ID','Facility','Code','Reason','Rejected At','Days Open','Assigned','Status',''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REJECTIONS_LIST.map(r => (
              <tr key={r.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{r.id}</span></td>
                <td className="px-4 py-2.5"><span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(45,212,191,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>{r.eventType}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{r.patientId}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8' }}>{r.facility}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#F87171', fontFamily: 'DM Mono, monospace' }}>{r.code}</span></td>
                <td className="px-4 py-2.5 max-w-36"><span style={{ fontSize: 11, color: '#94A3B8' }} title={r.reason}>{r.reason.slice(0,28)}{r.reason.length > 28 ? '…' : ''}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{r.rejectedAt}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: r.daysOpen > 2 ? '#F87171' : '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{r.daysOpen}d</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{r.assignedTo}</span></td>
                <td className="px-4 py-2.5">
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', background: r.status === 'Open' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)', color: r.status === 'Open' ? '#FCD34D' : '#60A5FA' }}>{r.status}</span>
                </td>
                <td className="px-4 py-2.5">
                  <button className="rounded-lg px-2.5 py-1 transition-colors" style={{ fontSize: 10, background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)' }}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Patient Consent tab ──────────────────────────────────────────────────────
function ConsentTab() {
  const k = CONSENT_KPIS;
  const pct = (k.activeWithConsent.value / k.activeWithConsent.total * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Active w/ Consent',   value: k.activeWithConsent.value.toLocaleString(), sub: `of ${k.activeWithConsent.total.toLocaleString()}`, color: '#34D399' },
          { label: 'Coverage %',           value: `${k.coveragePct}%`,                        sub: 'Target ≥ 95%', color: '#2DD4BF' },
          { label: 'Pending Requests',     value: k.pendingRequests.toString(),               sub: '',             color: '#FCD34D' },
          { label: 'Withdrawn (30d)',      value: k.withdrawnLast30d.toString(),              sub: '',             color: '#F87171' },
          { label: 'Expiring (30d)',       value: k.expiringIn30d.toString(),                 sub: '',             color: '#FB923C' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-2xl p-5 col-span-2" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Coverage by Category</div>
          <div className="flex flex-col gap-3">
            {CONSENT_CATEGORIES.map(cat => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: 12, color: '#CBD5E1' }}>{cat.category}</span>
                  <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: cat.covered >= 95 ? '#34D399' : cat.covered >= 85 ? '#FCD34D' : '#F87171' }}>{cat.covered}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.4)' }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.covered}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Bulk Reminder Campaign</div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: '#64748B' }}>Target</label>
              <select className="rounded-xl px-3 py-2 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', color: '#CBD5E1', fontSize: 12 }}>
                <option>Patients without consent</option>
                <option>Expired consents</option>
                <option>Sensitive category gaps</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: '#64748B' }}>Channel</label>
              <select className="rounded-xl px-3 py-2 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', color: '#CBD5E1', fontSize: 12 }}>
                <option>Patient Portal banner</option>
                <option>Email</option>
                <option>SMS</option>
                <option>WhatsApp</option>
              </select>
            </div>
            <button className="rounded-xl py-2 font-semibold transition-colors mt-1" style={{ background: '#0D9488', color: '#fff', fontSize: 12 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0F766E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0D9488'; }}>
              Send campaign ({k.activeWithConsent.total - k.activeWithConsent.value} patients)
            </button>
          </div>
        </div>
      </div>

      {/* Consent list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Record ID','Patient ID','Consent Type','Status','Granted','Expires','Channel','Last Action',''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONSENT_LIST.map(c => (
              <tr key={c.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: c.status === 'Withdrawn' ? 'rgba(239,68,68,0.03)' : 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = c.status === 'Withdrawn' ? 'rgba(239,68,68,0.03)' : 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{c.id}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{c.patientId}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#CBD5E1' }}>{c.type}</span></td>
                <td className="px-4 py-2.5">
                  <Chip label={c.status} style={{ background: c.status === 'Active' ? 'rgba(16,185,129,0.1)' : c.status === 'Pending' ? 'rgba(245,158,11,0.12)' : c.status === 'Withdrawn' ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.15)', color: c.status === 'Active' ? '#34D399' : c.status === 'Pending' ? '#FCD34D' : c.status === 'Withdrawn' ? '#F87171' : '#94A3B8' }} />
                </td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{c.grantedOn}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{c.expiresOn}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{c.channel}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{c.lastAction}</span></td>
                <td className="px-4 py-2.5">
                  {c.status !== 'Active' && (
                    <button className="rounded-lg px-2.5 py-1 text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 10 }}>Re-request</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Certificates tab ─────────────────────────────────────────────────────────
function CertificatesTab() {
  const cert = CERTIFICATES.client;
  const daysLeft = cert.daysLeft;
  const isCritical = daysLeft <= 7;
  const isWarning = daysLeft <= 60;
  const certColor = isCritical ? '#F87171' : isWarning ? '#FCD34D' : '#34D399';

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Connection status */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Connection Health</span>
          <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
            <Zap style={{ width: 12, height: 12 }} />
            Ping NABIDH
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Endpoint', value: 'https://fhir.nabidh.dha.gov.ae/R4', mono: true },
            { label: 'TLS Version', value: cert.tlsVersion },
            { label: 'Cipher Suite', value: cert.cipher, mono: true },
          ].map(f => (
            <div key={f.label} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: f.mono ? 10 : 12, color: '#94A3B8', fontFamily: f.mono ? 'DM Mono, monospace' : 'Inter, sans-serif', wordBreak: 'break-all' }}>{f.value}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 6 }}>Latency — last 60 pings</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={PING_HISTORY}>
              <Line type="monotone" dataKey="ms" stroke="#2DD4BF" strokeWidth={1.5} dot={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <XAxis hide />
              <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 8, fontSize: 10 }} formatter={(v: number) => [`${v}ms`, 'Latency']} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client certificate */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: `1px solid ${isWarning ? certColor + '44' : 'rgba(51,65,85,0.5)'}` }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Client Certificate (mTLS)</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 font-mono text-xs" style={{ background: `${certColor}18`, color: certColor, border: `1px solid ${certColor}33` }}>
              {daysLeft}d left
            </span>
            <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
              <RotateCcw style={{ width: 12, height: 12 }} />
              Rotate certificate
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Subject',      value: cert.subject      },
            { label: 'Issuer',       value: cert.issuer       },
            { label: 'Key Strength', value: cert.keyStrength  },
            { label: 'Valid From',   value: cert.validFrom    },
            { label: 'Valid To',     value: cert.validTo      },
          ].map(f => (
            <div key={f.label} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace', wordBreak: 'break-all' }}>{f.value}</div>
            </div>
          ))}
          <div className="rounded-xl px-3 py-2.5 col-span-2" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
            <div style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 3 }}>SHA-256 Fingerprint</div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{cert.fingerprint}</div>
          </div>
        </div>
      </div>

      {/* Certificate history */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Rotation History</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Rotated On','Rotated By','Reason','Fingerprint (truncated)'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CERTIFICATES.history.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{h.rotatedOn}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#CBD5E1' }}>{h.rotatedBy}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#64748B' }}>{h.reason}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{h.fingerprint}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Audit Log tab ────────────────────────────────────────────────────────────
function AuditLogTab() {
  const [search, setSearch] = useState('');
  const CATEGORY_COLORS: Record<string, string> = {
    Submission: '#2DD4BF', Rejection: '#F87171', Certificate: '#FCD34D',
    Consent: '#A78BFA', 'Mapping': '#60A5FA', Configuration: '#FB923C',
    'PHI access': '#F87171', 'Manual action': '#94A3B8',
  };
  const filtered = AUDIT_LOG.filter(e => !search || e.action.toLowerCase().includes(search) || e.actor.toLowerCase().includes(search));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.5)', maxWidth: 360 }}>
          <Search style={{ width: 13, height: 13, color: '#475569', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions, actors, correlation IDs…" className="bg-transparent outline-none flex-1" style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.3)', color: '#64748B', fontSize: 12 }}>
          <Download style={{ width: 13, height: 13 }} />
          DHA-format export
        </button>
        <div className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.3)' }}>
          <Shield style={{ width: 12, height: 12, color: '#34D399' }} />
          <span style={{ fontSize: 10, color: '#34D399', fontFamily: 'DM Mono, monospace' }}>Retention: 7 years · UAE-region</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Timestamp','Category','Actor','Action','Resource','Outcome','IP','Corr. ID'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const catColor = CATEGORY_COLORS[e.category] ?? '#64748B';
              return (
                <tr key={i} className="cursor-pointer group transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: e.category === 'PHI access' ? 'rgba(239,68,68,0.03)' : 'transparent' }}
                  onMouseEnter={el => { el.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                  onMouseLeave={el => { el.currentTarget.style.background = e.category === 'PHI access' ? 'rgba(239,68,68,0.03)' : 'transparent'; }}>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>{e.ts}</span></td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: `${catColor}18`, color: catColor, fontFamily: 'DM Mono, monospace' }}>{e.category}</span>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#CBD5E1', whiteSpace: 'nowrap' }}>{e.actor}</span></td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8' }}>{e.action}</span></td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{e.resource}</span></td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', background: e.outcome === 'Accepted' || e.outcome === 'Applied' || e.outcome === 'Sent' || e.outcome === 'Approved' ? 'rgba(16,185,129,0.1)' : e.outcome === 'Rejected' || e.outcome === 'Revealed' || e.outcome === 'Withdrawn' ? 'rgba(239,68,68,0.1)' : 'rgba(51,65,85,0.3)', color: e.outcome === 'Accepted' || e.outcome === 'Applied' || e.outcome === 'Sent' || e.outcome === 'Approved' ? '#34D399' : e.outcome === 'Rejected' || e.outcome === 'Revealed' || e.outcome === 'Withdrawn' ? '#F87171' : '#94A3B8' }}>
                      {e.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{e.ip}</span></td>
                  <td className="px-4 py-2.5"><span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{e.corr}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Mappings tab ─────────────────────────────────────────────────────────────
function MappingsTab() {
  return (
    <div className="flex flex-col gap-5">
      {/* Profiles */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>FHIR Profiles — DHA/NABIDH</span>
          <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
            <RefreshCw style={{ width: 12, height: 12 }} />
            Update from DHA registry
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Resource Type','Profile Version','Source','Last Validated','Status'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FHIR_PROFILES.map(p => (
              <tr key={p.resource} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)', background: p.status === 'Review' ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                <td className="px-5 py-2.5"><span style={{ fontSize: 12, fontWeight: 500, color: '#CBD5E1' }}>{p.resource}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{p.version}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: p.source === 'DHA-published' ? '#34D399' : '#FCD34D' }}>{p.source}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{p.validated}</span></td>
                <td className="px-5 py-2.5">
                  <Chip label={p.status} style={{ background: p.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.12)', color: p.status === 'Active' ? '#34D399' : '#FCD34D' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unmapped codes */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Unmapped Codes</span>
          <span style={{ fontSize: 10, color: '#F87171', fontFamily: 'DM Mono, monospace' }}>{UNMAPPED_CODES.length} codes require mapping</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
              {['Code','System','Description','Occurrences','Priority',''].map(h => (
                <th key={h} className="px-5 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {UNMAPPED_CODES.map(c => (
              <tr key={c.code} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}>
                <td className="px-5 py-2.5"><span style={{ fontSize: 12, color: '#F87171', fontFamily: 'DM Mono, monospace' }}>{c.code}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{c.system}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 11, color: '#CBD5E1' }}>{c.description}</span></td>
                <td className="px-5 py-2.5"><span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{c.occurrences}</span></td>
                <td className="px-5 py-2.5">
                  <Chip label={c.priority} style={{ background: c.priority === 'High' ? 'rgba(239,68,68,0.1)' : c.priority === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(51,65,85,0.3)', color: c.priority === 'High' ? '#F87171' : c.priority === 'Medium' ? '#FCD34D' : '#64748B' }} />
                </td>
                <td className="px-5 py-2.5">
                  <button className="rounded-lg px-2.5 py-1 transition-colors" style={{ fontSize: 10, background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)' }}>Add mapping</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports tab ──────────────────────────────────────────────────────────────
function ReportsTab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold" style={{ background: '#0D9488', color: '#fff', fontSize: 13 }}>
          <Plus style={{ width: 13, height: 13 }} />
          New report
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {NABIDH_REPORTS.map(r => (
          <div key={r.name} className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; }}>
            <div className="flex items-start justify-between">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{r.name}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(13,148,136,0.2)', color: '#2DD4BF', fontSize: 9 }}>{r.owner}</div>
            </div>
            <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{r.desc}</p>
            <div>
              <div style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>Recipients</div>
              <div className="flex flex-wrap gap-1">
                {r.recipients.map(rec => (
                  <span key={rec} style={{ fontSize: 9, color: '#64748B', fontFamily: 'DM Mono, monospace', background: 'rgba(51,65,85,0.3)', borderRadius: 4, padding: '1px 6px' }}>{rec}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(51,65,85,0.3)', paddingTop: 8 }}>
              <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Last run {r.lastRun}</span>
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: 'rgba(96,165,250,0.12)', color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>{r.schedule}</span>
            </div>
            <div className="flex gap-2">
              {['Run now', 'Schedule', 'Share'].map(action => (
                <button key={action} className="flex-1 text-center rounded-lg py-1.5 transition-colors" style={{ fontSize: 11, background: 'rgba(51,65,85,0.3)', color: '#94A3B8' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; }}>
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

// ─── Configuration tab ────────────────────────────────────────────────────────
function ConfigurationTab() {
  const [mode, setMode] = useState('Real-time');
  const [strictConsent, setStrictConsent] = useState(true);
  const [twoPerson, setTwoPerson] = useState(true);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Submission Settings</div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 11, color: '#64748B' }}>Submission Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)} className="rounded-xl px-3 py-2.5 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', color: '#CBD5E1', fontSize: 13 }}>
            <option>Real-time</option>
            <option>Near-real-time batched</option>
            <option>Manual approval before submit</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Max retry attempts', value: '5' },
            { label: 'Backoff strategy', value: 'Exponential' },
            { label: 'Dead-letter threshold', value: '5 failures' },
            { label: 'SLA target latency', value: '30s' },
          ].map(f => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: '#64748B' }}>{f.label}</label>
              <input defaultValue={f.value} className="rounded-xl px-3 py-2 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)', color: '#CBD5E1', fontSize: 12, fontFamily: 'DM Mono, monospace' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consent Enforcement</div>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 13, color: '#CBD5E1' }}>Strict consent mode</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Block all submissions without valid consent. Cannot be disabled in Production.</div>
          </div>
          <div className="flex items-center gap-2">
            {strictConsent && <span style={{ fontSize: 10, color: '#34D399', fontFamily: 'DM Mono, monospace' }}>Enforced</span>}
            <div className="w-10 h-5 rounded-full cursor-not-allowed flex items-center" style={{ background: '#0D9488', padding: 3 }}>
              <div className="w-3.5 h-3.5 rounded-full bg-white" style={{ marginLeft: 20 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Security & Governance</div>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 13, color: '#CBD5E1' }}>Two-person approval for production changes</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Require secondary admin to approve mapping changes, certificate rotations, and config changes.</div>
          </div>
          <div className="w-10 h-5 rounded-full cursor-pointer flex items-center" style={{ background: twoPerson ? '#0D9488' : 'rgba(51,65,85,0.6)', padding: 3 }} onClick={() => setTwoPerson(p => !p)}>
            <div className="w-3.5 h-3.5 rounded-full bg-white transition-transform" style={{ marginLeft: twoPerson ? 20 : 0 }} />
          </div>
        </div>
        <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Shield style={{ width: 13, height: 13, color: '#34D399', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#34D399' }}>Data residency: All NABIDH data stored exclusively in UAE North region · Immutable in Production</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',               icon: BarChart3  },
  { id: 'queue',         label: 'Submission Queue',        icon: Activity   },
  { id: 'rejections',    label: 'Rejections & Errors',     icon: XCircle    },
  { id: 'consent',       label: 'Patient Consent',         icon: Users      },
  { id: 'mappings',      label: 'Mappings & Schemas',      icon: Map        },
  { id: 'certificates',  label: 'Connection & Certs',      icon: Lock       },
  { id: 'audit',         label: 'Audit Log',               icon: FileText   },
  { id: 'reports',       label: 'Reports',                 icon: Download   },
  { id: 'configuration', label: 'Configuration',           icon: Settings   },
];

export default function NabidhPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showKebab, setShowKebab] = useState(false);

  const goBack = () => {
    window.history.pushState({}, '', '/admin/integrations');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':      return <OverviewTab />;
      case 'queue':         return <QueueTab />;
      case 'rejections':    return <RejectionsTab />;
      case 'consent':       return <ConsentTab />;
      case 'mappings':      return <MappingsTab />;
      case 'certificates':  return <CertificatesTab />;
      case 'audit':         return <AuditLogTab />;
      case 'reports':       return <ReportsTab />;
      case 'configuration': return <ConfigurationTab />;
    }
  };

  return (
    <AdminPageLayout activeSection="nabidh">
      <div className="flex flex-col min-h-full" style={{ background: '#0F172A' }}>

        {/* Header */}
        <div className="sticky top-0 z-30 px-6 py-4 flex flex-col gap-3" style={{ background: '#0F172A', borderBottom: '1px solid rgba(30,41,59,0.8)' }}>
          <button onClick={goBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit" style={{ fontSize: 12 }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Integrations
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>N</div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>NABIDH</h1>
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(13,148,136,0.15)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>Production</span>
                  <span style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{NABIDH_STATUS.facilityLicense}</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                  Dubai Health Authority's unified health information exchange — submission, compliance, and audit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ConnectionPill status={NABIDH_STATUS.connection} />
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
                <Activity style={{ width: 12, height: 12 }} />
                Test connection
              </button>
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
                <Zap style={{ width: 12, height: 12 }} />
                Submit pending
              </button>
              <div className="relative">
                <button onClick={() => setShowKebab(m => !m)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#64748B' }}>
                  <MoreHorizontal style={{ width: 15, height: 15 }} />
                </button>
                {showKebab && (
                  <div className="absolute right-0 top-10 rounded-xl overflow-hidden z-50 w-52" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {['Configure', 'Rotate certificate', 'Re-authenticate', 'Export compliance report'].map(label => (
                      <button key={label} onClick={() => setShowKebab(false)} className="w-full px-4 py-2.5 text-left transition-colors" style={{ fontSize: 12, color: '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {label}
                      </button>
                    ))}
                    <button onClick={() => setShowKebab(false)} className="w-full px-4 py-2.5 text-left transition-colors" style={{ fontSize: 12, color: '#F87171' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                      Pause submissions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance strip */}
        <ComplianceStrip />

        {/* Alert banners */}
        <div className="px-6 pt-4 flex flex-col gap-2">
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle style={{ width: 13, height: 13, color: '#FCD34D', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#FCD34D' }}>
              <strong>Certificate expiring in 41 days</strong> — mTLS client certificate expires 2026-06-10. Rotate before 2026-05-10 to maintain zero-downtime.
              <button className="ml-2 underline" style={{ color: '#FCD34D' }}>Rotate now</button>
            </span>
          </div>
          {NABIDH_KPIS.pendingQueue.breakdown.gt30m > 0 && (
            <div className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle style={{ width: 13, height: 13, color: '#F87171', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#F87171' }}>
                <strong>{NABIDH_KPIS.pendingQueue.breakdown.gt30m} events</strong> in queue for over 30 minutes — may indicate NABIDH gateway degradation.
                <button className="ml-2 underline" style={{ color: '#F87171' }}>View queue</button>
              </span>
            </div>
          )}
        </div>

        {/* KPI strip */}
        <KpiStrip />

        {/* Tab bar */}
        <div className="px-6 pt-3">
          <div className="flex gap-1 overflow-x-auto pb-px" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-1.5 px-3.5 py-2.5 whitespace-nowrap transition-all" style={{
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#2DD4BF' : '#64748B',
                  borderBottom: `2px solid ${isActive ? '#0D9488' : 'transparent'}`,
                  marginBottom: '-1px',
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#64748B'; }}>
                  <Icon style={{ width: 12, height: 12 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-5">
          {renderTab()}
        </div>
      </div>
    </AdminPageLayout>
  );
}
