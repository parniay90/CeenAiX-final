import React, { useState, useCallback } from 'react';
import {
  ComposedChart, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Area, AreaChart, ReferenceLine,
} from 'recharts';
import InsuranceSidebar from './InsuranceSidebar';
import AnalyticsSections from './AnalyticsSections';
import {
  financialSnapshot, monthlyActuals, planBreakdown, specialtySpend,
  providerPerformance, riskStratification, slaData, denialRateTrend,
  aiInsights,
} from '../../data/analyticsData';
import {
  Download, TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle,
  CheckCircle, Info, X, FileText, Shield, Users, DollarSign, Activity,
} from 'lucide-react';

const MONO = "'DM Mono', monospace";
const fmt = (n: number) =>
  n >= 1000000 ? `AED ${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `AED ${(n / 1000).toFixed(0)}K` : `AED ${n.toLocaleString()}`;
const fmtShort = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }
type DateRange = 'today' | 'month' | 'last3m' | 'year' | 'custom';

interface ExportModalProps { onClose: () => void; onToast: (msg: string, type: 'success' | 'warning' | 'info') => void; }

function ExportModal({ onClose, onToast }: ExportModalProps) {
  const [format, setFormat] = useState<'pdf' | 'xlsx' | 'csv'>('pdf');
  const [sections, setSections] = useState({ financial: true, risk: true, providers: true, utilization: true, predictive: false, fraud: false });
  const [generating, setGenerating] = useState(false);

  const toggle = (key: keyof typeof sections) => setSections(s => ({ ...s, [key]: !s[key] }));

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onClose();
      onToast(`Report generated (${format.toUpperCase()}) and ready for download`, 'success');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl overflow-hidden" style={{ width: 520, background: '#fff', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', border: '1px solid #E2E8F0' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ background: '#1E3A5F', borderBottom: '1px solid #2D4A6F' }}>
          <div className="flex items-center gap-3">
            <FileText size={18} color="#93C5FD" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Export Report</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X size={16} color="#fff" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Format */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Export Format</p>
            <div className="flex gap-3">
              {(['pdf', 'xlsx', 'csv'] as const).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ border: `2px solid ${format === f ? '#1E3A5F' : '#E2E8F0'}`, background: format === f ? '#EFF6FF' : '#fff', color: format === f ? '#1E3A5F' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                  .{f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Include Sections</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {(Object.entries(sections) as [keyof typeof sections, boolean][]).map(([key, val]) => (
                <label key={key} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ border: `1px solid ${val ? '#BFDBFE' : '#F1F5F9'}`, background: val ? '#EFF6FF' : '#FAFBFC' }}>
                  <input type="checkbox" checked={val} onChange={() => toggle(key)} style={{ accentColor: '#1E3A5F' }} />
                  <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#374151', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p style={{ fontSize: 11, color: '#15803D', fontFamily: 'Inter, sans-serif' }}>
              Report will be generated based on April 2026 (month to date) data. DHA-compliant formatting applied automatically.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleGenerate} disabled={generating} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: generating ? '#94A3B8' : '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', cursor: generating ? 'not-allowed' : 'pointer' }}>
              {generating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Download size={15} />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SNAPSHOT CARD ────────────────────────────────────────────────────────────
interface SnapCardProps { label: string; value: string; sub: string; icon: React.ReactNode; trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; highlight?: boolean; }

function SnapCard({ label, value, sub, icon, trend, trendLabel, highlight }: SnapCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#94A3B8';
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: highlight ? '#1E3A5F' : '#fff', border: `1px solid ${highlight ? '#2D4A6F' : '#E2E8F0'}`, flex: 1 }}>
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl" style={{ background: highlight ? 'rgba(255,255,255,0.12)' : '#F1F5F9' }}>
          {icon}
        </div>
        {trend && trendLabel && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: highlight ? 'rgba(255,255,255,0.1)' : `${trendColor}18` }}>
            <TrendIcon size={11} color={highlight ? '#93C5FD' : trendColor} />
            <span style={{ fontSize: 11, fontWeight: 600, color: highlight ? '#93C5FD' : trendColor, fontFamily: 'Inter, sans-serif' }}>{trendLabel}</span>
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: highlight ? '#93C5FD' : '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</p>
        <p style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: highlight ? '#fff' : '#0F172A', lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,0.6)' : '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── CHART CARD ───────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: subtitle ? 2 : 14 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const RiskAnalyticsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [showExport, setShowExport] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const dateRangeLabels: Record<DateRange, string> = {
    today: 'Today', month: 'This Month', last3m: 'Last 3 Months', year: 'This Year', custom: 'Custom',
  };

  const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
    success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
    warning: { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
    info: { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
  };

  const insightIconConfig = {
    warning: { icon: <AlertTriangle size={14} color="#D97706" />, border: '#FDE68A', bg: '#FFFBEB', titleColor: '#92400E' },
    success: { icon: <CheckCircle size={14} color="#16A34A" />, border: '#BBF7D0', bg: '#F0FDF4', titleColor: '#15803D' },
    info: { icon: <Info size={14} color="#2563EB" />, border: '#BFDBFE', bg: '#EFF6FF', titleColor: '#1D4ED8' },
  };

  // Recharts data
  const claimsTrendData = monthlyActuals.map(m => ({
    month: m.shortMonth, submitted: m.claimsSubmitted, paid: m.claimsPaid, budget: m.budget,
  }));

  const specialtyData = specialtySpend.map(s => ({
    specialty: s.specialty.split(' ')[0], budget: s.budget, actual: s.actual,
  }));

  const slaChartData = slaData.map(s => ({
    category: s.category.split(' ').slice(0, 2).join(' '), target: s.target, actual: s.actual, met: s.met,
  }));

  const planDonutData = planBreakdown.map(p => ({ name: p.shortName, value: p.members, color: p.color }));

  const riskBarData = riskStratification.map(r => ({
    tier: r.tier, members: r.members, spend: r.totalSpend / 1000000, color: r.color,
  }));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <InsuranceSidebar activePage="analytics" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6" style={{ height: 64, background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Risk Analytics</p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Actuarial & Risk Management Intelligence — April 2026</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date range */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              {(['today', 'month', 'last3m', 'year'] as DateRange[]).map(r => (
                <button key={r} onClick={() => setDateRange(r)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: dateRange === r ? '#1E3A5F' : 'transparent', color: dateRange === r ? '#fff' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                  {dateRangeLabels[r]}
                </button>
              ))}
              <button onClick={() => setDateRange('custom')} className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                style={{ background: dateRange === 'custom' ? '#1E3A5F' : 'transparent', color: dateRange === 'custom' ? '#fff' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                <Calendar size={11} /> Custom
              </button>
            </div>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto" style={{ padding: '20px 24px 40px' }}>

          {/* ─── FINANCIAL SNAPSHOT ─────────────────────────────────── */}
          <div className="flex gap-4" style={{ marginBottom: 20 }}>
            <SnapCard
              label="Premium Revenue" value={`AED ${(financialSnapshot.premiumRevenue / 1000000).toFixed(2)}M`}
              sub="April 2026 to date" icon={<DollarSign size={16} color="#1E3A5F" />}
              trend="up" trendLabel="+4.2% MoM" highlight
            />
            <SnapCard
              label="Claims Paid" value={`AED ${(financialSnapshot.claimsPaid / 1000000).toFixed(2)}M`}
              sub={`${(financialSnapshot.budgetUtilization * 100).toFixed(1)}% of monthly budget used`}
              icon={<Activity size={16} color="#1E3A5F" />} trend="down" trendLabel="−8.1% MoM"
            />
            <SnapCard
              label="Loss Ratio" value={pct(financialSnapshot.lossRatio)}
              sub={`Target: ${pct(financialSnapshot.lossRatioTarget)} · Well below threshold`}
              icon={<Shield size={16} color="#16A34A" />} trend="down" trendLabel="−2.1pp"
            />
            <SnapCard
              label="Active Members" value={financialSnapshot.memberCount.toLocaleString()}
              sub={`${financialSnapshot.activePolicies.toLocaleString()} active policies`}
              icon={<Users size={16} color="#1E3A5F" />} trend="up" trendLabel="+0.5%"
            />
            <SnapCard
              label="SLA Compliance" value={pct(financialSnapshot.slaCompliance)}
              sub="6 of 7 categories on target"
              icon={<CheckCircle size={16} color="#D97706" />} trend="neutral" trendLabel="Stable"
            />
          </div>

          {/* ─── MAIN 2-COLUMN LAYOUT ───────────────────────────────── */}
          <div className="flex gap-5" style={{ marginBottom: 20 }}>

            {/* LEFT COLUMN — 65% */}
            <div className="flex flex-col gap-5" style={{ flex: '0 0 calc(65% - 10px)', minWidth: 0 }}>

              {/* Chart 1: Claims Trend & Budget */}
              <ChartCard title="Claims Trend vs Budget" subtitle="Monthly submitted, paid, and budget line (Jan–Apr 2026)">
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={claimsTrendData} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
                    <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
                    <Tooltip formatter={(v: number, name: string) => [fmt(v), name]} contentStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
                    <Bar dataKey="submitted" name="Submitted" fill="#1E40AF" fillOpacity={0.25} radius={[2, 2, 0, 0]} animationDuration={800} />
                    <Bar dataKey="paid" name="Paid" fill="#1E40AF" radius={[2, 2, 0, 0]} animationDuration={800} />
                    <Line dataKey="budget" name="Budget" stroke="#EF4444" strokeWidth={2} strokeDasharray="6 3" dot={false} animationDuration={800} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Chart 2: Specialty Spend */}
              <ChartCard title="Specialty Spend — Budget vs Actual" subtitle="Year-to-date by clinical specialty (AED)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={specialtyData} layout="vertical" margin={{ left: 16, right: 40, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tickFormatter={fmtShort} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} />
                    <YAxis type="category" dataKey="specialty" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} width={100} />
                    <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
                    <Bar dataKey="budget" name="Budget" fill="#CBD5E1" radius={[0, 2, 2, 0]} animationDuration={800} />
                    <Bar dataKey="actual" name="Actual" fill="#1E3A5F" radius={[0, 2, 2, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Chart 3: Provider Performance Mini-Table */}
              <ChartCard title="Top Provider Performance">
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #F1F5F9' }}>
                  <table className="w-full" style={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        {['Provider', 'Claims', 'Total Paid', 'Score', 'SLA'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5" style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {providerPerformance.slice(0, 5).map((p, i) => {
                        const scoreColor = p.overallScore >= 90 ? '#16A34A' : p.overallScore >= 80 ? '#2563EB' : '#D97706';
                        return (
                          <tr key={p.id} style={{ borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                            <td className="px-3 py-2.5" style={{ fontWeight: 500, color: '#1E293B', maxWidth: 180 }}>
                              <p style={{ fontSize: 12 }}>{p.name}</p>
                              <p style={{ fontSize: 10, color: '#94A3B8' }}>{p.city}</p>
                            </td>
                            <td className="px-3 py-2.5" style={{ fontFamily: MONO, color: '#475569' }}>{p.claimsSubmitted.toLocaleString()}</td>
                            <td className="px-3 py-2.5" style={{ fontFamily: MONO, fontWeight: 600, color: '#1E293B' }}>{fmtShort(p.totalPaid)}</td>
                            <td className="px-3 py-2.5">
                              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: scoreColor }}>{p.overallScore}</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ fontFamily: MONO, background: p.slaScore >= 90 ? '#DCFCE7' : p.slaScore >= 80 ? '#EFF6FF' : '#FEF3C7', color: p.slaScore >= 90 ? '#15803D' : p.slaScore >= 80 ? '#1D4ED8' : '#92400E' }}>{p.slaScore}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ChartCard>

              {/* Chart 4: SLA Tracker */}
              <ChartCard title="SLA Performance Tracker" subtitle="Hours: actual vs target by category">
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={slaChartData} layout="vertical" margin={{ left: 16, right: 40, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: MONO }} unit="h" />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} width={100} />
                    <Tooltip formatter={(v: number) => `${v}h`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Bar dataKey="target" name="Target" fill="#CBD5E1" radius={[0, 2, 2, 0]} animationDuration={800} />
                    <Bar dataKey="actual" name="Actual" radius={[0, 2, 2, 0]} animationDuration={800}>
                      {slaData.map(s => <Cell key={s.category} fill={s.met ? '#22C55E' : '#EF4444'} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-3" style={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#22C55E' }} /><span style={{ color: '#64748B' }}>SLA Met</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#EF4444' }} /><span style={{ color: '#64748B' }}>SLA Breached</span></div>
                  <span style={{ color: '#94A3B8', marginLeft: 'auto' }}>1 breach: Provider Appeal (89.4h vs 72h target)</span>
                </div>
              </ChartCard>
            </div>

            {/* RIGHT COLUMN — 35% */}
            <div className="flex flex-col gap-5" style={{ flex: '0 0 calc(35% - 10px)', minWidth: 0 }}>

              {/* Chart 5: Plan Distribution Donut */}
              <ChartCard title="Plan Distribution" subtitle="Members by plan tier">
                <div className="flex items-center gap-3">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={planDonutData} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" animationDuration={800}>
                        {planDonutData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {planBreakdown.map(p => (
                      <div key={p.plan} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{p.shortName}</span>
                        </div>
                        <div className="text-right">
                          <span style={{ fontFamily: MONO, fontSize: 11, color: '#1E293B', fontWeight: 600 }}>{p.members.toLocaleString()}</span>
                          <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginLeft: 4 }}>({((p.members / financialSnapshot.memberCount) * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Per-member cost */}
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Avg Cost / Member / Month</p>
                  <div className="flex flex-col gap-1.5">
                    {planBreakdown.map(p => (
                      <div key={p.plan} className="flex items-center justify-between">
                        <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{p.shortName}</span>
                        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#1E293B' }}>AED {p.avgCostPerMember.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>

              {/* Chart 6: Risk Stratification Bar */}
              <ChartCard title="Risk Stratification" subtitle="Members & spend by risk tier">
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={riskBarData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="tier" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: MONO }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Bar dataKey="members" name="Members" radius={[3, 3, 0, 0]} animationDuration={800}>
                      {riskStratification.map(r => <Cell key={r.tier} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#92400E', fontFamily: 'Inter, sans-serif' }}>Concentration Alert</p>
                  <p style={{ fontSize: 11, color: '#78350F', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>2.7% Critical members → 32% of total spend</p>
                </div>
              </ChartCard>

              {/* Chart 7: Denial Rate Trend */}
              <ChartCard title="Denial Rate Trend" subtitle="Oct 2025 – Apr 2026 (%)">
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={denialRateTrend} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
                    <YAxis unit="%" tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: MONO }} />
                    <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Line dataKey="overall" name="Overall" stroke="#1E40AF" strokeWidth={2.5} dot={false} animationDuration={800} />
                    <Line dataKey="medical" name="Medical" stroke="#EA580C" strokeWidth={1.5} dot={false} strokeDasharray="4 2" animationDuration={800} />
                    <Line dataKey="pharmacy" name="Pharmacy" stroke="#16A34A" strokeWidth={1.5} dot={false} strokeDasharray="4 2" animationDuration={800} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[{ label: 'Overall', val: '7.9%', delta: '−5.3pp', good: true }, { label: 'Medical', val: '9.1%', delta: '−5.7pp', good: true }, { label: 'Pharmacy', val: '4.8%', delta: '−3.6pp', good: true }].map(p => (
                    <div key={p.label} className="px-2.5 py-1.5 rounded-lg" style={{ background: p.good ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${p.good ? '#BBF7D0' : '#FDE68A'}` }}>
                      <p style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{p.label}</p>
                      <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: p.good ? '#15803D' : '#92400E' }}>{p.val} <span style={{ fontSize: 10 }}>{p.delta}</span></p>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* AI Predictive Insights */}
              <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)', borderBottom: '1px solid #2D4A6F' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.25)' }}>
                      <Activity size={12} color="#C4B5FD" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Predictive Insights</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(167,139,250,0.2)', color: '#C4B5FD', fontFamily: 'Inter, sans-serif' }}>3 Active</span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {aiInsights.map(insight => {
                    const ic = insightIconConfig[insight.type];
                    return (
                      <div key={insight.id} className="rounded-xl p-3.5" style={{ background: ic.bg, border: `1px solid ${ic.border}` }}>
                        <div className="flex items-start gap-2.5 mb-2">
                          {ic.icon}
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 12, fontWeight: 700, color: ic.titleColor, fontFamily: 'Inter, sans-serif' }}>{insight.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.06)', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{insight.category}</span>
                              <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: MONO }}>{insight.confidence}% confidence</span>
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 11, color: '#475569', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>{insight.detail}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Financial impact</span>
                          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: ic.titleColor }}>{fmt(insight.impactAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── BOTTOM TABS SECTION ────────────────────────────────── */}
          <AnalyticsSections onToast={addToast} />
        </main>
      </div>

      {/* Export Modal */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} onToast={addToast} />}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 380 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', fontFamily: 'Inter, sans-serif' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskAnalyticsPage;
