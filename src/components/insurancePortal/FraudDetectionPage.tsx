import React, { useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle, Bot, Search, ChevronDown, Lock, Bell,
  FileText, RotateCcw, ShieldCheck, TrendingDown, X,
  AlertOctagon, BarChart2, Building2, User, Users,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie,
} from 'recharts';
import InsuranceSidebar from './InsuranceSidebar';
import InvestigationWorkspace from './InvestigationWorkspace';
import {
  FreezeClaimsModal,
  SuspendProviderModal,
  DhaReportModal,
  FalsePositiveModal,
  AIScanOverlay,
} from './FraudModals';
import {
  fraudCases, resolvedCases,
  monthlyFraudData, fraudByType, aiAccuracyData, fraudByPlan,
} from '../../data/fraudData';
import type { FraudCase, FraudRiskLevel } from '../../data/fraudData';

// ── Constants ──────────────────────────────────────────────────────────────────

const MONO = { fontFamily: 'DM Mono, monospace' };

const riskConfig: Record<FraudRiskLevel, { badge: string; badgeText: string; border: string; bg: string; dot: string }> = {
  CRITICAL: { badge: '#DC2626', badgeText: '#fff', border: '#DC2626', bg: 'rgba(220,38,38,0.04)', dot: '#DC2626' },
  HIGH:     { badge: '#FED7AA', badgeText: '#9A3412', border: '#EA580C', bg: 'rgba(234,88,12,0.04)', dot: '#EA580C' },
  MEDIUM:   { badge: '#FEF3C7', badgeText: '#92400E', border: '#D97706', bg: 'rgba(217,119,6,0.04)', dot: '#D97706' },
  LOW:      { badge: '#FEF9C3', badgeText: '#854D0E', border: '#CA8A04', bg: 'rgba(202,138,4,0.04)', dot: '#CA8A04' },
};

const statusChip: Record<string, { bg: string; text: string; label: string }> = {
  NEW:          { bg: '#FEF2F2', text: '#B91C1C', label: '🆕 NEW' },
  UNDER_REVIEW: { bg: '#EFF6FF', text: '#1D4ED8', label: '🔍 UNDER REVIEW' },
  MONITORING:   { bg: '#FFFBEB', text: '#92400E', label: '👁 MONITORING' },
  REPORTED:     { bg: '#F0FDFA', text: '#0D9488', label: '📤 REPORTED' },
  CONFIRMED:    { bg: '#F0FDF4', text: '#15803D', label: '✅ CONFIRMED' },
  FALSE_POSITIVE: { bg: '#F8FAFC', text: '#64748B', label: '❌ FALSE POSITIVE' },
};

const typeColors: Record<string, string> = {
  'Ghost Consultations': '#DC2626',
  'Duplicate Billing': '#DC2626',
  'Upcoding': '#EA580C',
  'Phantom Pharmacy': '#D97706',
  'Out-of-Hours Pattern': '#CA8A04',
  'Identity Fraud': '#B91C1C',
  'Kickback Pattern': '#C2410C',
};

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' | 'error' }
const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
  success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
  warning: { border: '#FCD34D', color: '#92400E', bg: '#FFFBEB' },
  info:    { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
  error:   { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
};

// ── KPI Card ───────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, sub2, icon: Icon, iconBg, iconColor, valuColor, pulse }: {
  label: string; value: string; sub?: string; sub2?: string;
  icon: React.ElementType; iconBg: string; iconColor: string; valuColor: string; pulse?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 ${pulse ? 'border-red-200 animate-pulse' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-2xl font-black" style={{ ...MONO, color: valuColor }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: valuColor === '#DC2626' ? '#EA580C' : '#64748B' }}>{sub}</p>}
      {sub2 && <p className="text-[10px] text-slate-400" style={MONO}>{sub2}</p>}
    </div>
  );
}

// ── Fraud Case Card ────────────────────────────────────────────────────────────

function FraudCaseCard({ fc, onOpen, onFreeze, onSuspend, onDha, onFalsePositive, onToast }: {
  fc: FraudCase;
  onOpen: (c: FraudCase) => void;
  onFreeze: (c: FraudCase) => void;
  onSuspend: (c: FraudCase) => void;
  onDha: (c: FraudCase) => void;
  onFalsePositive: (c: FraudCase) => void;
  onToast: (msg: string, type: Toast['type']) => void;
}) {
  const rc = riskConfig[fc.riskLevel];
  const sc = statusChip[fc.status] ?? statusChip.UNDER_REVIEW;
  const nabidhPct = fc.nabidhTotal > 0 ? Math.round((fc.nabidhMatch / fc.nabidhTotal) * 100) : 0;
  const nabidhFailed = nabidhPct < 50;

  const SubjectIcon = fc.subjectRole === 'provider' ? Building2 : fc.subjectRole === 'ring' ? Users : User;

  return (
    <div className="bg-white rounded-2xl border-l-6 shadow-sm overflow-hidden mb-4"
      style={{
        borderLeft: `6px solid ${rc.border}`,
        border: `1px solid ${rc.border}30`,
        borderLeftColor: rc.border,
        boxShadow: fc.riskLevel === 'CRITICAL' ? `0 0 0 1px rgba(220,38,38,0.12), 0 2px 8px rgba(0,0,0,0.06)` : '0 1px 6px rgba(15,45,74,0.08)',
      }}>

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100" style={{ backgroundColor: rc.bg }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Risk badge */}
          <span className="px-3 py-1 rounded-lg text-xs font-black" style={{ backgroundColor: rc.badge, color: rc.badgeText }}>
            {fc.riskLevel === 'CRITICAL' ? '🔴' : fc.riskLevel === 'HIGH' ? '🟠' : fc.riskLevel === 'MEDIUM' ? '🟡' : '🟢'} {fc.riskLevel} · {fc.confidence}%
          </span>
          {/* Type */}
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: `${typeColors[fc.type]}18`, color: typeColors[fc.type] }}>{fc.type}</span>
          {/* Case ID */}
          <span className="text-xs font-bold" style={{ ...MONO, color: '#EA580C' }}>{fc.caseRef}</span>
          {/* NEW badge */}
          {fc.isNewToday && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-50 text-teal-700">NEW TODAY</span>}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-black" style={{ ...MONO, color: '#DC2626' }}>AED {fc.amountAtRisk.toLocaleString()} at risk</p>
            <p className="text-[10px] text-slate-400" style={MONO}>Flagged: {fc.flaggedAtDisplay}</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
          <span className="text-[10px] text-slate-400">{fc.assignedTo ? `Assigned: ${fc.assignedTo.split(' ')[0]} ${fc.assignedTo.split(' ')[1]?.charAt(0)}.` : 'Unassigned'}</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Subject row */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${rc.dot}20` }}>
            <SubjectIcon size={18} style={{ color: rc.dot }} />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Fraud Subject</p>
            <p className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{fc.subjectName}</p>
            <p className="text-xs text-slate-500">{fc.subjectFacility} · {fc.subjectCity}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {fc.dhaLicense && (
                <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">{fc.dhaLicense} {fc.dhaLicenseValid ? '✅' : '❌'}</span>
              )}
              <span className="text-[9px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded animate-pulse">🚩 Under fraud investigation</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-right">
            {[
              { label: 'Claims flagged', value: fc.claimsTotal.toString() },
              { label: 'Claims frozen', value: fc.claimsFrozen.toString() },
              ...(fc.daysActive ? [{ label: 'Days active', value: `${fc.daysActive}d` }] : []),
              { label: 'Patients', value: fc.patientsInvolved.toString() },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[9px] text-slate-400 uppercase">{s.label}</p>
                <p className="text-sm font-bold text-slate-800" style={MONO}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence */}
        <div className="rounded-xl p-4" style={{ backgroundColor: `${rc.dot}0D`, border: `1px solid ${rc.dot}30` }}>
          <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: rc.dot }}>Fraud Evidence Summary</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {fc.evidencePills.map(p => (
              <span key={p} className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: rc.dot }}>{p}</span>
            ))}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{fc.evidenceText}</p>
        </div>

        {/* AI analysis */}
        <div className="rounded-xl p-4 border border-violet-200" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-violet-600" />
              <p className="text-xs font-bold text-violet-700">CeenAiX AI Analysis</p>
            </div>
            <span className="text-xs font-bold" style={{ ...MONO, color: fc.riskLevel === 'CRITICAL' ? '#DC2626' : '#EA580C' }}>{fc.confidence}% confidence</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">{fc.aiReasoning}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {fc.aiRecommendations.map(r => (
              <span key={r} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-700">{r}</span>
            ))}
          </div>
          <p className="text-[9px] italic" style={{ ...MONO, color: '#A78BFA' }}>AI model: claude-sonnet-4 · Flagged: Auto-detection</p>
        </div>

        {/* Nabidh */}
        <div className={`rounded-xl p-4 border ${nabidhFailed ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-bold ${nabidhFailed ? 'text-red-700' : 'text-amber-700'}`}>
              🇦🇪 Nabidh HIE Cross-Check — {nabidhFailed ? 'FAILED' : 'PARTIAL MATCH'}
            </p>
            <span className="text-xl font-black" style={{ ...MONO, color: nabidhFailed ? '#DC2626' : '#D97706' }}>{nabidhPct}%</span>
          </div>
          <div className="flex items-center gap-4 text-xs mb-2">
            <span className="text-slate-600">{fc.nabidhTotal} patients in claims</span>
            <span className={`font-bold ${nabidhFailed ? 'text-red-600' : 'text-emerald-600'}`}>{fc.nabidhMatch} Nabidh records</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${nabidhPct}%`, backgroundColor: nabidhFailed ? '#DC2626' : '#F59E0B' }} />
          </div>
          <p className="text-[10px] text-emerald-700 italic mt-1">✅ Legitimate providers: 85–100% Nabidh match rate</p>
        </div>

        {/* Financial grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total at risk', value: `AED ${fc.amountAtRisk.toLocaleString()}`, color: '#DC2626' },
            { label: 'Claims frozen', value: `${fc.claimsFrozen} claims`, color: '#2563EB' },
            { label: 'Recovered', value: 'AED 0', color: '#64748B' },
            { label: 'Per-claim pattern', value: fc.cptCode ?? `${fc.type.slice(0, 12)}…`, color: '#EA580C' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xs font-bold" style={{ ...MONO, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button onClick={() => onOpen(fc)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 bg-red-600">
            🔍 Open Investigation
          </button>
          <button onClick={() => onFreeze(fc)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
            <Lock size={13} /> Freeze Claims
          </button>
          <button onClick={() => onDha(fc)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors">
            <FileText size={13} /> DHA Report
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onToast(`Case ${fc.caseRef} assigned to Mariam Al Khateeb`, 'success')} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">👁 Assign to Me</button>
          <button onClick={() => onSuspend(fc)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors">📤 Suspend</button>
          <button onClick={() => onFalsePositive(fc)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">✅ False Positive</button>
        </div>
      </div>
    </div>
  );
}

// ── Analytics Tab ──────────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <div className="p-5 space-y-5">
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Monthly */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Monthly Fraud Cases Detected — 2026</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyFraudData} barSize={16}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip labelStyle={{ fontSize: 12 }} />
              <Bar dataKey="confirmed" name="Confirmed" fill="#EF4444" radius={[2, 2, 0, 0]} stackId="a" animationDuration={800} />
              <Bar dataKey="review" name="Under Review" fill="#F97316" radius={[0, 0, 0, 0]} stackId="a" animationDuration={800} />
              <Bar dataKey="falsePositive" name="False Positive" fill="#CBD5E1" radius={[2, 2, 0, 0]} stackId="a" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By type */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Fraud by Type (Amount)</p>
          <div className="flex items-center gap-4">
            <div style={{ width: 140, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fraudByType} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" animationDuration={800}>
                    {fraudByType.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {fraudByType.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs font-semibold text-slate-600 truncate" style={{ maxWidth: 120 }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ ...MONO, color: d.fill }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI accuracy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">AI Fraud Detection Performance — 2026</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={aiAccuracyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Line type="monotone" dataKey="truePositive" name="True Positive Rate" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488' }} animationDuration={800} />
              <Line type="monotone" dataKey="falsePositive" name="False Positive Rate" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Improving accuracy month over month ✅</p>
        </div>

        {/* By plan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-4">Cases by Targeted Insurance Plan</p>
          <div className="space-y-3">
            {fraudByPlan.map(p => (
              <div key={p.plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{p.plan}</span>
                  <span className="text-xs font-bold" style={{ ...MONO, color: p.fill }}>{p.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.fill }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 font-semibold italic mt-3">Gold plan most targeted — fraudsters target highest annual limits</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Prevented (30 days)', value: 'AED 847,200' },
              { label: 'AI Accuracy', value: '89.1%' },
              { label: 'Avg Detection', value: '43 sec' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-sm font-black text-slate-800" style={MONO}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

interface Props { onNavigate: (page: string) => void }

export default function FraudDetectionPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'analytics'>('active');
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<FraudRiskLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [openWorkspace, setOpenWorkspace] = useState<FraudCase | null>(null);
  const [freezeCase, setFreezeCase] = useState<FraudCase | null>(null);
  const [suspendCase, setSuspendCase] = useState<FraudCase | null>(null);
  const [dhaCase, setDhaCase] = useState<FraudCase | null>(null);
  const [fpCase, setFpCase] = useState<FraudCase | null>(null);
  const [showScan, setShowScan] = useState(false);
  const [showDhaGlobal, setShowDhaGlobal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const filteredCases = useMemo(() => {
    let list = [...fraudCases];
    if (riskFilter !== 'ALL') list = list.filter(c => c.riskLevel === riskFilter);
    if (typeFilter) list = list.filter(c => c.type === typeFilter);
    if (statusFilter) list = list.filter(c => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.caseRef.toLowerCase().includes(q) ||
        c.subjectName.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.dhaLicense ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, riskFilter, typeFilter, statusFilter]);

  const FRAUD_TYPES = [...new Set(fraudCases.map(c => c.type))];
  const criticalCount = fraudCases.filter(c => c.riskLevel === 'CRITICAL').length;
  const highCount = fraudCases.filter(c => c.riskLevel === 'HIGH').length;
  const mediumCount = fraudCases.filter(c => c.riskLevel === 'MEDIUM').length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4F8' }}>
      <InsuranceSidebar activePage="fraud" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: '#0F2D4A' }}>D</div>
            <div>
              <h1 className="text-base font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Fraud Detection</h1>
              <p className="text-xs text-slate-500">Daman National Health Insurance · 7 April 2026 · 2:07 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            AI monitoring active · 12 flags today · 5 escalated
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowDhaGlobal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
              <FileText size={14} /> DHA Fraud Report
            </button>
            <button onClick={() => setShowScan(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              <RotateCcw size={14} /> Run Full Scan
            </button>
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative transition-colors">
              <Bell size={16} />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 7, fontFamily: 'DM Mono' }}>3</span>
              </div>
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0F2D4A' }}>MK</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* Page header */}
          <div className="flex items-start justify-between px-8 py-5">
            <div className="flex items-center gap-3">
              <AlertOctagon size={28} className="text-red-600" />
              <div>
                <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Fraud Detection</h2>
                <p className="text-sm text-slate-400">AI-powered anomaly detection · Claims integrity · DHA reporting</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowScan(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors">
                <RotateCcw size={14} /> Run AI Scan
              </button>
              <button onClick={() => setShowDhaGlobal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                <FileText size={14} /> Generate DHA Report
              </button>
              <button onClick={() => setActiveTab('analytics')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                <BarChart2 size={14} /> Fraud Analytics
              </button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid gap-4 px-8 pb-5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            <KpiCard label="Active Investigations" value="5" sub={`${criticalCount} critical · ${highCount} high · ${mediumCount} medium`} icon={AlertTriangle} iconBg="#FEE2E2" iconColor="#DC2626" valuColor="#DC2626" pulse />
            <KpiCard label="Total at Risk" value="AED 210.9K" sub="Across 5 active cases" sub2="47 claims frozen" icon={AlertTriangle} iconBg="#FED7AA" iconColor="#EA580C" valuColor="#DC2626" />
            <KpiCard label="AI Flags Today" value="12" sub="5 escalated · 7 auto-resolved" icon={Bot} iconBg="#EDE9FE" iconColor="#7C3AED" valuColor="#7C3AED" />
            <KpiCard label="Recovered (30 days)" value="AED 847.2K" sub="89 cases resolved" sub2="↑ Best month ever" icon={TrendingDown} iconBg="#D1FAE5" iconColor="#059669" valuColor="#059669" />
            <KpiCard label="True Positive Rate" value="89.1%" sub="AI detection accuracy" sub2="4.2% false positive rate" icon={ShieldCheck} iconBg="#D1FAE5" iconColor="#059669" valuColor="#059669" />
            <KpiCard label="Claims Frozen" value="47" sub="Pending investigation" sub2="AED 136,000 held" icon={Lock} iconBg="#DBEAFE" iconColor="#2563EB" valuColor="#2563EB" />
          </div>

          {/* Main card */}
          <div className="mx-8 mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="relative" style={{ width: 280 }}>
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case ID, provider, patient..." className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>

              {/* Risk pills */}
              <div className="flex items-center gap-1">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(r => {
                  const count = r === 'ALL' ? fraudCases.length : fraudCases.filter(c => c.riskLevel === r).length;
                  const cfg = r === 'ALL' ? null : riskConfig[r];
                  const active = riskFilter === r;
                  return (
                    <button key={r} onClick={() => setRiskFilter(r)} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{
                        borderColor: active ? (cfg?.dot ?? '#0F2D4A') : '#E2E8F0',
                        backgroundColor: active ? (cfg?.badge ?? '#0F2D4A') : 'white',
                        color: active ? (cfg?.badgeText ?? 'white') : '#64748B',
                      }}>
                      {r === 'ALL' ? `All ●` : `${r} (${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Type */}
              <div className="relative">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="appearance-none border border-slate-300 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="">All Types</option>
                  {FRAUD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Status */}
              <div className="flex items-center gap-1">
                {[
                  { v: '', l: 'All ●' },
                  { v: 'NEW', l: 'New' },
                  { v: 'UNDER_REVIEW', l: 'Under Review' },
                  { v: 'MONITORING', l: 'Monitoring' },
                ].map(s => (
                  <button key={s.v} onClick={() => setStatusFilter(s.v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${statusFilter === s.v ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    {s.l}
                  </button>
                ))}
              </div>

              {(search || riskFilter !== 'ALL' || typeFilter || statusFilter) && (
                <button onClick={() => { setSearch(''); setRiskFilter('ALL'); setTypeFilter(''); setStatusFilter(''); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 border border-slate-300 hover:bg-slate-50">
                  <X size={11} /> Clear
                </button>
              )}

              <div className="ml-auto">
                <button onClick={() => addToast('Manual case entry form — coming soon', 'info')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                  + New Case
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-5">
              {[
                { id: 'active' as const, label: `🔴 Active Cases (${fraudCases.length})`, color: '#DC2626' },
                { id: 'resolved' as const, label: `✅ Resolved (89)`, color: '#059669' },
                { id: 'analytics' as const, label: `📊 Analytics`, color: '#2563EB' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-5 py-3 text-sm font-semibold border-b-3 transition-all"
                  style={{ borderBottom: activeTab === t.id ? `3px solid ${t.color}` : '3px solid transparent', color: activeTab === t.id ? t.color : '#64748B', fontWeight: activeTab === t.id ? 700 : 600 }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'active' && (
              <div className="p-5">
                {filteredCases.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShieldCheck size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">No active cases match your filters</p>
                  </div>
                ) : (
                  filteredCases.map(fc => (
                    <FraudCaseCard
                      key={fc.id}
                      fc={fc}
                      onOpen={setOpenWorkspace}
                      onFreeze={setFreezeCase}
                      onSuspend={setSuspendCase}
                      onDha={setDhaCase}
                      onFalsePositive={setFpCase}
                      onToast={addToast}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'resolved' && (
              <div className="p-5">
                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Confirmed fraud', value: '71 (79.8%)', color: '#DC2626' },
                    { label: 'False positives', value: '18 (20.2%)', color: '#64748B' },
                    { label: 'Total fraud value', value: 'AED 847,200', color: '#059669' },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                      <p className="text-base font-black" style={{ ...MONO, color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F8FAFC' }}>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Case ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Closed</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">DHA</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resolvedCases.map(rc => (
                        <tr key={rc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-orange-600 uppercase" style={MONO}>{rc.caseRef}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-slate-600" style={{ color: typeColors[rc.type] }}>{rc.type}</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">{rc.subject}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${rc.outcome === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' : rc.outcome === 'FALSE_POSITIVE' ? 'bg-slate-100 text-slate-600' : 'bg-violet-50 text-violet-700'}`}>
                              {rc.outcome === 'CONFIRMED' ? '✅ Confirmed Fraud' : rc.outcome === 'FALSE_POSITIVE' ? '❌ False Positive' : '⚖️ Legal Action'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800" style={MONO}>
                            {rc.amount > 0 ? <span className="text-emerald-600">AED {rc.amount.toLocaleString()}</span> : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500" style={MONO}>{rc.closedDate}</td>
                          <td className="px-4 py-3">
                            {rc.dhaReported ? <span className="text-xs text-teal-600 font-semibold">✅ Filed</span> : <span className="text-xs text-slate-400">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => addToast(`Case ${rc.caseRef} report viewed`, 'info')} className="text-xs text-blue-600 font-semibold hover:text-blue-800">👁 View</button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-center text-xs text-slate-400">
                          Showing 5 of 89 resolved cases · <button className="text-blue-600 font-semibold">Load more</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </main>
      </div>

      {/* Workspace modal */}
      {openWorkspace && (
        <InvestigationWorkspace
          fraudCase={openWorkspace}
          onClose={() => setOpenWorkspace(null)}
          onToast={addToast}
          onFreeze={() => { setOpenWorkspace(null); setFreezeCase(openWorkspace); }}
          onSuspend={() => { setOpenWorkspace(null); setSuspendCase(openWorkspace); }}
          onDhaReport={() => { setOpenWorkspace(null); setDhaCase(openWorkspace); }}
        />
      )}

      {/* Freeze modal */}
      {freezeCase && (
        <FreezeClaimsModal
          fraudCase={freezeCase}
          onClose={() => setFreezeCase(null)}
          onConfirm={() => { setFreezeCase(null); addToast(`47 claims frozen · ${freezeCase.subjectName} · AED ${freezeCase.amountAtRisk.toLocaleString()} protected`, 'info'); }}
        />
      )}

      {/* Suspend modal */}
      {suspendCase && (
        <SuspendProviderModal
          fraudCase={suspendCase}
          onClose={() => setSuspendCase(null)}
          onConfirm={() => { setSuspendCase(null); addToast(`Provider account suspended — ${suspendCase.subjectName} · Pending investigation`, 'error'); }}
        />
      )}

      {/* DHA report modal */}
      {(dhaCase || showDhaGlobal) && (
        <DhaReportModal
          fraudCase={dhaCase ?? fraudCases[0]}
          onClose={() => { setDhaCase(null); setShowDhaGlobal(false); }}
          onConfirm={() => { setDhaCase(null); setShowDhaGlobal(false); addToast('DHA fraud report generated · FRAUD-2026-04-001.xml · Due: 9 Apr 2026', 'success'); }}
        />
      )}

      {/* False positive modal */}
      {fpCase && (
        <FalsePositiveModal
          fraudCase={fpCase}
          onClose={() => setFpCase(null)}
          onConfirm={() => { setFpCase(null); addToast(`Case cleared — false positive · ${fpCase.subjectName} account restored`, 'success'); }}
        />
      )}

      {/* AI scan overlay */}
      {showScan && <AIScanOverlay onClose={() => { setShowScan(false); addToast('Full AI scan complete · 312 claims analyzed · 0 new cases', 'info'); }} />}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 400 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-start gap-3 px-4 py-3 rounded-xl pointer-events-auto"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 12, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', fontFamily: 'Inter, sans-serif' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: c.color }} />
              <span className="leading-relaxed">{t.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
