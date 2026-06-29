import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Bell, ChevronDown, Download, Send,
  LayoutGrid, List, AlertTriangle, TrendingUp, Users,
  BarChart2, Activity, CheckCircle, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import InsuranceSidebar from './InsuranceSidebar';
import MemberDetailDrawer from './MemberDetailDrawer';
import WellnessCampaignModal from './WellnessCampaignModal';
import { membersData, membersSummary, populationConditions, benefitUtilizationBuckets } from '../../data/membersData';
import type { Member, RiskLevel, PlanType } from '../../types/insurancePortal';

// ── helpers ──────────────────────────────────────────────────────────────────

const usagePct = (m: Member) => Math.round((m.annualUsed / m.annualLimit) * 100);

const barColorClass = (pct: number) =>
  pct >= 100 ? '#DC2626' : pct >= 86 ? '#F97316' : pct >= 61 ? '#F59E0B' : pct >= 26 ? '#0D9488' : '#10B981';

const riskColors: Record<RiskLevel, { badge: string; badgeText: string; dot: string; rowBg: string; border: string }> = {
  CRITICAL: { badge: '#FEE2E2', badgeText: '#991B1B', dot: '#DC2626', rowBg: 'rgba(220,38,38,0.04)', border: '#FCA5A5' },
  HIGH:     { badge: '#FED7AA', badgeText: '#9A3412', dot: '#F97316', rowBg: 'rgba(249,115,22,0.04)', border: '#FDBA74' },
  MEDIUM:   { badge: '#FEF3C7', badgeText: '#92400E', dot: '#F59E0B', rowBg: 'rgba(245,158,11,0.04)', border: '#FCD34D' },
  LOW:      { badge: '#D1FAE5', badgeText: '#065F46', dot: '#10B981', rowBg: 'rgba(16,185,129,0.04)', border: '#6EE7B7' },
};

const planBadge: Record<PlanType, { bg: string; text: string }> = {
  Gold:   { bg: '#FEF3C7', text: '#92400E' },
  Silver: { bg: '#F1F5F9', text: '#475569' },
  Basic:  { bg: '#EFF6FF', text: '#1E40AF' },
  Thiqa:  { bg: '#F3E8FF', text: '#6B21A8' },
};

type Tab = 'all' | 'risk' | 'benefits' | 'wellness' | 'analytics';

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
  success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
  warning: { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
  info:    { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
};

// ── ExportModal ───────────────────────────────────────────────────────────────

function ExportModal({ onClose }: { onClose: () => void }) {
  const [fmt, setFmt] = useState('xlsx');
  const [scope, setScope] = useState('all');
  const [exporting, setExporting] = useState(false);
  const doExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); onClose(); }, 1200);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: 440 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#0F2D4A' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Download size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">Export Members</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <X size={16} className="text-white" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Format</p>
            <div className="flex gap-2">
              {['xlsx', 'csv', 'pdf'].map(f => (
                <button key={f} onClick={() => setFmt(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 uppercase transition-all ${fmt === f ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Scope</p>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Members', desc: `${membersSummary.total.toLocaleString()} members` },
                { id: 'filtered', label: 'Current Filter / View', desc: 'Matches current search & filters' },
                { id: 'selected', label: 'Selected Members Only', desc: 'Based on checkbox selection' },
              ].map(s => (
                <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${scope === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="scope" value={s.id} checked={scope === s.id} onChange={() => setScope(s.id)} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50">Cancel</button>
          <button onClick={doExport} disabled={exporting} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: '#0F2D4A' }}>
            {exporting ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg> Exporting...</>
            ) : (
              <><Download size={15} /> Export {fmt.toUpperCase()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── UsageBar ──────────────────────────────────────────────────────────────────

function UsageBar({ pct }: { pct: number }) {
  const color = barColorClass(pct);
  const pulse = pct >= 86;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden" style={{ minWidth: 60 }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${pulse ? 'animate-pulse' : ''}`} style={{ color, fontFamily: 'DM Mono, monospace', minWidth: 34 }}>{pct}%</span>
    </div>
  );
}

// ── MemberRow ─────────────────────────────────────────────────────────────────

function MemberRow({ member, onSelect, selected, onClick }: {
  member: Member; onSelect: (id: string) => void; selected: boolean; onClick: (m: Member) => void;
}) {
  const rc = riskColors[member.riskLevel];
  const pc = planBadge[member.planType];
  const pct = usagePct(member);
  const isCritical = member.riskLevel === 'CRITICAL';

  return (
    <tr
      className="border-b border-slate-100 cursor-pointer transition-colors"
      style={{ backgroundColor: selected ? 'rgba(37,99,235,0.06)' : isCritical ? rc.rowBg : undefined }}
      onClick={() => onClick(member)}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected ? 'rgba(37,99,235,0.06)' : isCritical ? rc.rowBg : ''; }}
    >
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3 w-8" onClick={e => { e.stopPropagation(); onSelect(member.id); }}>
        <input type="checkbox" checked={selected} onChange={() => onSelect(member.id)} className="rounded border-slate-300 text-blue-600 w-4 h-4" />
      </td>
      {/* Risk indicator */}
      <td className="px-0 py-3 w-1.5">
        <div className="w-1 h-8 rounded-r" style={{ backgroundColor: rc.dot }} />
      </td>
      {/* Member */}
      <td className="px-4 py-3" style={{ minWidth: 220 }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: member.riskLevel === 'CRITICAL' ? '#DC2626' : member.riskLevel === 'HIGH' ? '#F97316' : member.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981' }}>
              {member.initials}
            </div>
            {(isCritical || member.riskLevel === 'HIGH') && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white flex items-center justify-center"
                style={{ backgroundColor: rc.dot }}>
                {isCritical && <span className="text-white text-[6px] font-black">!</span>}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{member.fullName}</p>
            <p className="text-xs text-slate-400 truncate" style={{ fontFamily: 'DM Mono, monospace' }}>{member.memberId}</p>
          </div>
        </div>
      </td>
      {/* Plan */}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: pc.bg, color: pc.text }}>{member.planType}</span>
      </td>
      {/* Risk */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: rc.badge, color: rc.badgeText }}>{member.riskLevel}</span>
          <span className="text-xs font-bold tabular-nums text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{member.riskScore}</span>
        </div>
      </td>
      {/* AI Health */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'DM Mono, monospace', color: member.aiHealthScore < 40 ? '#DC2626' : member.aiHealthScore < 60 ? '#F97316' : member.aiHealthScore < 75 ? '#F59E0B' : '#10B981' }}>
            {member.aiHealthScore}
          </span>
          {member.aiHealthTrend !== undefined && (
            <span className={`text-xs font-semibold ${member.aiHealthTrend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {member.aiHealthTrend >= 0 ? '+' : ''}{member.aiHealthTrend}
            </span>
          )}
        </div>
      </td>
      {/* Benefits */}
      <td className="px-4 py-3" style={{ minWidth: 130 }}>
        <UsageBar pct={pct} />
      </td>
      {/* Claims */}
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-700 tabular-nums" style={{ fontFamily: 'DM Mono, monospace' }}>
            AED {(member.claimsTotal / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-400">{member.claimsCount} claims</p>
        </div>
      </td>
      {/* Last Claim */}
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600">{member.lastClaimDateLabel}</p>
      </td>
      {/* Alerts */}
      <td className="px-4 py-3 pr-6">
        <div className="flex flex-wrap gap-1">
          {member.benefitAlertLevel === 'EXHAUSTED' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 whitespace-nowrap">LIMIT REACHED</span>
          )}
          {member.benefitAlertLevel === 'NEAR_LIMIT' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 whitespace-nowrap">NEAR LIMIT</span>
          )}
          {member.pendingPreAuth && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 whitespace-nowrap">PA PENDING</span>
          )}
          {member.aiInsightChip && isCritical && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 whitespace-nowrap animate-pulse">{member.aiInsightChip}</span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── MemberCard (card view) ────────────────────────────────────────────────────

function MemberCard({ member, onSelect, selected, onClick }: {
  member: Member; onSelect: (id: string) => void; selected: boolean; onClick: (m: Member) => void;
}) {
  const rc = riskColors[member.riskLevel];
  const pc = planBadge[member.planType];
  const pct = usagePct(member);
  return (
    <div
      onClick={() => onClick(member)}
      className="bg-white rounded-2xl border cursor-pointer transition-all hover:shadow-md"
      style={{ borderColor: selected ? '#2563EB' : rc.border, borderWidth: selected ? 2 : 1, padding: 16 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: rc.dot }}>
            {member.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{member.fullName}</p>
            <p className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{member.memberId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: rc.badge, color: rc.badgeText }}>{member.riskLevel}</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: pc.bg, color: pc.text }}>{member.planType}</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Benefit Usage</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: barColorClass(pct), fontFamily: 'DM Mono, monospace' }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColorClass(pct) }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>AI Score: <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', color: member.aiHealthScore < 40 ? '#DC2626' : '#10B981' }}>{member.aiHealthScore}</span></span>
        <span>{member.claimsCount} claims · <span style={{ fontFamily: 'DM Mono, monospace' }}>AED {(member.claimsTotal / 1000).toFixed(0)}K</span></span>
      </div>
      {(member.benefitAlertLevel || member.pendingPreAuth) && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-100">
          {member.benefitAlertLevel === 'EXHAUSTED' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">LIMIT REACHED</span>}
          {member.benefitAlertLevel === 'NEAR_LIMIT' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">NEAR LIMIT</span>}
          {member.pendingPreAuth && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">PA PENDING</span>}
        </div>
      )}
    </div>
  );
}

// ── KPI cards ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub?: string; color: string; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-black text-slate-800" style={{ fontFamily: 'DM Mono, monospace' }}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

// ── Population Analytics ───────────────────────────────────────────────────────

function PopulationAnalytics() {
  const riskPie = [
    { name: 'CRITICAL', value: membersSummary.critical, fill: '#DC2626' },
    { name: 'HIGH', value: membersSummary.high, fill: '#F97316' },
    { name: 'MEDIUM', value: membersSummary.medium, fill: '#F59E0B' },
    { name: 'LOW', value: membersSummary.low, fill: '#10B981' },
  ];
  const planPie = [
    { name: 'Gold', value: membersSummary.gold, fill: '#F59E0B' },
    { name: 'Silver', value: membersSummary.silver, fill: '#64748B' },
    { name: 'Basic', value: membersSummary.basic, fill: '#3B82F6' },
    { name: 'Thiqa', value: membersSummary.thiqa, fill: '#8B5CF6' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Risk distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Risk Distribution</p>
          <div className="flex items-center gap-4">
            <div style={{ width: 140, height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskPie} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {riskPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {riskPie.map(r => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.fill }} />
                    <span className="text-xs font-semibold text-slate-600">{r.name}</span>
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-800" style={{ fontFamily: 'DM Mono, monospace' }}>{r.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Plan mix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Plan Mix</p>
          <div className="flex items-center gap-4">
            <div style={{ width: 140, height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planPie} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {planPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {planPie.map(p => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
                    <span className="text-xs font-semibold text-slate-600">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-800" style={{ fontFamily: 'DM Mono, monospace' }}>{p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Benefit utilisation buckets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Benefit Utilisation</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={benefitUtilizationBuckets} barSize={22}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => [`${v} members`]} labelStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {benefitUtilizationBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top conditions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Top Conditions</p>
          <div className="space-y-3">
            {populationConditions.map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                  <span className="text-xs font-bold text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{c.count.toLocaleString()} <span className="font-normal">({c.pct}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

interface Props { onNavigate: (page: string) => void }

export default function MembersPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanType[]>([]);
  const [riskFilter, setRiskFilter] = useState<RiskLevel[]>([]);
  const [benefitFilter, setBenefitFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMember, setOpenMember] = useState<Member | null>(null);
  const [showWellness, setShowWellness] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const filteredMembers = useMemo(() => {
    let list = [...membersData];

    if (tab === 'risk') list = list.filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL');
    if (tab === 'benefits') list = list.filter(m => m.benefitAlertLevel != null);
    if (tab === 'wellness') list = list.filter(m => m.wellnessFlag != null || m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.fullName.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.policyNumber.toLowerCase().includes(q) ||
        m.conditions.some(c => c.name.toLowerCase().includes(q))
      );
    }
    if (planFilter.length) list = list.filter(m => planFilter.includes(m.planType));
    if (riskFilter.length) list = list.filter(m => riskFilter.includes(m.riskLevel));
    if (benefitFilter === 'exhausted') list = list.filter(m => m.benefitAlertLevel === 'EXHAUSTED');
    if (benefitFilter === 'near') list = list.filter(m => m.benefitAlertLevel === 'NEAR_LIMIT');
    if (activityFilter === 'high') list = list.filter(m => m.engagementLevel === 'HIGH');
    if (activityFilter === 'low') list = list.filter(m => m.engagementLevel === 'LOW');
    if (conditionFilter) list = list.filter(m => m.conditions.some(c => c.name.toLowerCase().includes(conditionFilter.toLowerCase())));

    return list;
  }, [tab, search, planFilter, riskFilter, benefitFilter, activityFilter, conditionFilter]);

  const togglePlan = (p: PlanType) => setPlanFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleRisk = (r: RiskLevel) => setRiskFilter(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const allSelected = filteredMembers.length > 0 && filteredMembers.every(m => selectedIds.has(m.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(prev => { const next = new Set(prev); filteredMembers.forEach(m => next.delete(m.id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); filteredMembers.forEach(m => next.add(m.id)); return next; });
    }
  };

  const exhausted = membersData.filter(m => m.benefitAlertLevel === 'EXHAUSTED');
  const nearLimit = membersData.filter(m => m.benefitAlertLevel === 'NEAR_LIMIT');
  const criticalMembers = membersData.filter(m => m.riskLevel === 'CRITICAL');

  const tabDefs: { id: Tab; label: string; count?: number; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Members', count: membersData.length, icon: Users },
    { id: 'risk', label: 'High & Critical Risk', count: membersData.filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL').length, icon: AlertTriangle },
    { id: 'benefits', label: 'Benefit Alerts', count: exhausted.length + nearLimit.length, icon: Activity },
    { id: 'wellness', label: 'Wellness Outreach', icon: TrendingUp },
    { id: 'analytics', label: 'Population Analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <InsuranceSidebar activePage="members" onNavigate={onNavigate} />

      {/* Top bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: '#0F2D4A' }}>D</div>
            <div>
              <h1 className="text-base font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Members</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-emerald-600">{membersSummary.total.toLocaleString()}</span> total members &middot; <span className="font-semibold text-emerald-600">{membersSummary.active.toLocaleString()}</span> on platform today
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowWellness(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0F2D4A' }}>
              <Send size={14} /> Wellness Campaign
            </button>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
              <Download size={14} /> Export
            </button>
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative transition-colors">
              <Bell size={16} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0F2D4A' }}>AM</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* Priority alerts strip */}
          <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-200 bg-white flex-shrink-0 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Priority Alerts:</span>
            {exhausted.length > 0 && (
              <button onClick={() => setTab('benefits')} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {exhausted.length} benefit limit exhausted
              </button>
            )}
            {nearLimit.length > 0 && (
              <button onClick={() => setTab('benefits')} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {nearLimit.length} near benefit limit
              </button>
            )}
            {criticalMembers.length > 0 && (
              <button onClick={() => setTab('risk')} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors animate-pulse">
                <AlertTriangle size={11} />
                {criticalMembers.length} critical risk members
              </button>
            )}
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* KPI strip */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
              <KpiCard label="Total Members" value={membersSummary.total.toLocaleString()} sub={`${membersSummary.activePct}% active`} color="#0F2D4A" icon={Users} />
              <KpiCard label="Gold Plan" value={membersSummary.gold.toLocaleString()} sub="Premium tier" color="#F59E0B" icon={TrendingUp} />
              <KpiCard label="Benefits Paid" value={`AED ${(membersSummary.benefitsPaidApril / 1e6).toFixed(2)}M`} sub="April 2026" color="#10B981" icon={Activity} />
              <KpiCard label="High + Critical" value={(membersSummary.high + membersSummary.critical).toLocaleString()} sub="Risk intervention" color="#DC2626" icon={AlertTriangle} />
              <KpiCard label="Avg AI Health" value={`${membersSummary.avgHealthScore}`} sub={`Avg age ${membersSummary.avgAge}`} color="#2563EB" icon={BarChart2} />
              <KpiCard label="Near / At Limit" value={`${membersSummary.nearLimit + membersSummary.limitExhausted}`} sub={`${membersSummary.avgUtilizationPct}% avg util.`} color="#F97316" icon={AlertTriangle} />
            </div>

            {/* Main card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Filter row */}
              <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-shrink-0" style={{ width: 260 }}>
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search members, ID, conditions…"
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Plan pills */}
                <div className="flex items-center gap-1">
                  {(['Gold', 'Silver', 'Basic', 'Thiqa'] as PlanType[]).map(p => {
                    const pc = planBadge[p];
                    const active = planFilter.includes(p);
                    return (
                      <button key={p} onClick={() => togglePlan(p)} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                        style={{ borderColor: active ? pc.text : '#E2E8F0', backgroundColor: active ? pc.bg : 'white', color: active ? pc.text : '#64748B' }}>
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Risk pills */}
                <div className="flex items-center gap-1">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map(r => {
                    const rc = riskColors[r];
                    const active = riskFilter.includes(r);
                    return (
                      <button key={r} onClick={() => toggleRisk(r)} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                        style={{ borderColor: active ? rc.badgeText : '#E2E8F0', backgroundColor: active ? rc.badge : 'white', color: active ? rc.badgeText : '#64748B' }}>
                        {r}
                      </button>
                    );
                  })}
                </div>

                {/* Benefit dropdown */}
                <div className="relative">
                  <select value={benefitFilter} onChange={e => setBenefitFilter(e.target.value)} className="appearance-none border border-slate-300 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Benefit Status</option>
                    <option value="exhausted">Exhausted</option>
                    <option value="near">Near Limit</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Activity dropdown */}
                <div className="relative">
                  <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="appearance-none border border-slate-300 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Activity Level</option>
                    <option value="high">High Engagement</option>
                    <option value="low">Low Engagement</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {(planFilter.length || riskFilter.length || benefitFilter || activityFilter || conditionFilter || search) ? (
                  <button onClick={() => { setPlanFilter([]); setRiskFilter([]); setBenefitFilter(''); setActivityFilter(''); setConditionFilter(''); setSearch(''); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 border border-slate-300 hover:bg-slate-50 flex items-center gap-1">
                    <X size={11} /> Clear
                  </button>
                ) : null}

                <div className="ml-auto flex items-center gap-1">
                  <button onClick={() => setViewMode('table')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                    <List size={15} />
                  </button>
                  <button onClick={() => setViewMode('card')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                    <LayoutGrid size={15} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 px-5 overflow-x-auto">
                {tabDefs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    <t.icon size={14} />
                    {t.label}
                    {t.count !== undefined && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${tab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{t.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div>
                {tab === 'analytics' ? (
                  <div className="p-5">
                    <PopulationAnalytics />
                  </div>
                ) : tab === 'wellness' ? (
                  <div className="p-5 space-y-4">
                    <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50 flex items-start gap-3">
                      <TrendingUp size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-blue-800 mb-1">AI Wellness Recommendations</p>
                        <p className="text-xs text-blue-700 leading-relaxed">Based on population health analysis, the following outreach campaigns are recommended to reduce long-term claim costs and improve member health outcomes.</p>
                      </div>
                    </div>
                    {[
                      { title: 'Annual Checkup Reminders', desc: `${membersData.filter(m => m.engagementLevel === 'LOW').length} low-engagement members have not had a checkup in 12+ months. A reminder may prevent costly interventions.`, risk: 'HIGH', count: membersData.filter(m => m.engagementLevel === 'LOW').length, saving: 'AED 240K potential saving', color: '#F97316' },
                      { title: 'Chronic Disease Management', desc: `${membersData.filter(m => m.conditions.some(c => c.name.includes('Diabetes') || c.name.includes('Hypertension'))).length} members with uncontrolled diabetes or hypertension. Proactive coaching can reduce hospitalization.`, risk: 'CRITICAL', count: membersData.filter(m => m.conditions.some(c => c.name.includes('Diabetes') || c.name.includes('Hypertension'))).length, saving: 'AED 680K potential saving', color: '#DC2626' },
                      { title: 'Preventive Screenings', desc: `Members aged 40–60 eligible for preventive cancer screenings and cardiovascular risk assessments under the DHA preventive care framework.`, risk: 'MEDIUM', count: membersData.filter(m => m.age >= 40 && m.age <= 60).length, saving: 'AED 120K potential saving', color: '#F59E0B' },
                    ].map(r => (
                      <div key={r.title} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-sm transition-all">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}18` }}>
                          <TrendingUp size={18} style={{ color: r.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-slate-800">{r.title}</p>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: riskColors[r.risk as RiskLevel]?.badge ?? '#FEE2E2', color: riskColors[r.risk as RiskLevel]?.badgeText ?? '#991B1B' }}>{r.risk}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2 leading-relaxed">{r.desc}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-600">{r.count} members</span>
                            <span className="text-xs font-bold text-emerald-600">{r.saving}</span>
                          </div>
                        </div>
                        <button onClick={() => setShowWellness(true)} className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0F2D4A' }}>
                          Launch Campaign
                        </button>
                      </div>
                    ))}
                  </div>
                ) : tab === 'benefits' ? (
                  <div className="p-5 space-y-5">
                    {exhausted.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <p className="text-sm font-bold text-red-700">Annual Limit Exhausted ({exhausted.length})</p>
                        </div>
                        <div className="space-y-2">
                          {exhausted.map(m => (
                            <div key={m.id} onClick={() => setOpenMember(m)} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors">
                              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">{m.initials}</div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">{m.fullName}</p>
                                <p className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{m.policyNumber} · {m.planType}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-red-700" style={{ fontFamily: 'DM Mono, monospace' }}>AED {m.annualLimit.toLocaleString()}</p>
                                <p className="text-xs text-red-500 font-semibold">100% EXHAUSTED</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {nearLimit.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <p className="text-sm font-bold text-orange-700">Near Annual Limit ({nearLimit.length})</p>
                        </div>
                        <div className="space-y-2">
                          {nearLimit.map(m => {
                            const pct = usagePct(m);
                            return (
                              <div key={m.id} onClick={() => setOpenMember(m)} className="flex items-center gap-4 p-4 rounded-2xl border border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">{m.initials}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-800">{m.fullName}</p>
                                  <p className="text-xs text-slate-500 mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>{m.policyNumber} · {m.planType}</p>
                                  <div className="h-1.5 rounded-full bg-orange-200 overflow-hidden">
                                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-black text-orange-700" style={{ fontFamily: 'DM Mono, monospace' }}>{pct}%</p>
                                  <p className="text-xs text-slate-500">AED {m.annualUsed.toLocaleString()} / {m.annualLimit.toLocaleString()}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* All Members / High+Critical Risk — table or card */
                  viewMode === 'card' ? (
                    <div className="p-5 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {filteredMembers.map(m => (
                        <MemberCard key={m.id} member={m} onSelect={toggleSelect} selected={selectedIds.has(m.id)} onClick={setOpenMember} />
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                          <Users size={32} className="mx-auto text-slate-300 mb-3" />
                          <p className="text-sm text-slate-500">No members match your filters</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100" style={{ backgroundColor: '#F8FAFC' }}>
                            <th className="pl-4 pr-2 py-3 w-8">
                              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300 text-blue-600 w-4 h-4" />
                            </th>
                            <th className="w-1.5" />
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Health</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ minWidth: 130 }}>Benefits</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claims</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Claim</th>
                            <th className="px-4 py-3 pr-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Alerts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map(m => (
                            <MemberRow key={m.id} member={m} onSelect={toggleSelect} selected={selectedIds.has(m.id)} onClick={setOpenMember} />
                          ))}
                        </tbody>
                      </table>
                      {filteredMembers.length === 0 && (
                        <div className="py-16 text-center">
                          <Users size={32} className="mx-auto text-slate-300 mb-3" />
                          <p className="text-sm text-slate-500">No members match your filters</p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 z-40 flex items-center justify-between px-6 py-4 shadow-xl" style={{ left: 264, right: 0, backgroundColor: '#0F2D4A', height: 64 }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-400 text-white text-xs font-black flex items-center justify-center">{selectedIds.size}</div>
            <span className="text-white text-sm font-semibold">{selectedIds.size} member{selectedIds.size > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowWellness(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
              <Send size={14} /> Send Outreach
            </button>
            <button onClick={() => { setShowExport(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
              <Download size={14} /> Export Selected
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <X size={14} /> Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {openMember && (
        <MemberDetailDrawer
          member={openMember}
          allMembers={membersData}
          onClose={() => setOpenMember(null)}
          onToast={addToast}
          onNavigate={setOpenMember}
        />
      )}

      {/* Modals */}
      {showWellness && (
        <WellnessCampaignModal
          members={filteredMembers}
          onClose={() => setShowWellness(false)}
          onSend={count => { setShowWellness(false); addToast(`Wellness campaign sent to ${count} members`, 'success'); }}
        />
      )}
      {showExport && <ExportModal onClose={() => { setShowExport(false); addToast('Export ready for download', 'success'); }} />}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
