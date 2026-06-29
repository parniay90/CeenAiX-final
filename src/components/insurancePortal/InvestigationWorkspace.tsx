import React, { useState } from 'react';
import {
  X, FileText, BarChart2, Globe, Clock, MessageSquare,
  Lock, Ban, ChevronDown, Bot, Check,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, ReferenceLine,
} from 'recharts';
import type { FraudCase } from '../../data/fraudData';

const MONO = { fontFamily: 'DM Mono, monospace' };

interface Props {
  fraudCase: FraudCase;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
  onFreeze: () => void;
  onSuspend: () => void;
  onDhaReport: () => void;
}

type WorkspaceTab = 'summary' | 'claims' | 'patterns' | 'nabidh' | 'timeline' | 'notes';

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'REPORTED', label: 'Reported to DHA' },
  { value: 'AWAITING_LEGAL', label: 'Awaiting Legal' },
  { value: 'CONFIRMED', label: 'Confirmed + Closed' },
  { value: 'FALSE_POSITIVE', label: 'False Positive + Cleared' },
];

const TEAM = ['Mariam Al Khateeb', 'Ahmad Al Mansouri', 'Sara Al Hashimi', 'Khalid Al Balushi'];

// CPT distribution data for pattern analysis
const networkCptData = [
  { code: '99211', pct: 15, fill: '#10B981' },
  { code: '99212', pct: 25, fill: '#0D9488' },
  { code: '99213', pct: 35, fill: '#2563EB' },
  { code: '99214', pct: 20, fill: '#7C3AED' },
  { code: '99215', pct: 5, fill: '#64748B' },
];

const hourlyData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  count: h === 2 ? 147 : h === 3 ? 82 : h >= 9 && h <= 17 ? Math.floor(Math.random() * 4 + 1) : 0,
}));

export default function InvestigationWorkspace({ fraudCase, onClose, onToast, onFreeze, onSuspend, onDhaReport }: Props) {
  const [tab, setTab] = useState<WorkspaceTab>('summary');
  const [status, setStatus] = useState(fraudCase.status);
  const [assigned, setAssigned] = useState(fraudCase.assignedTo);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showAssignDrop, setShowAssignDrop] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<{ time: string; author: string; text: string; isAi?: boolean }[]>([
    {
      time: '7 Apr 2026, 12:30 PM',
      author: 'CeenAiX AI',
      text: 'Automated fraud detection. Case created by CeenAiX AI on anomaly threshold breach. All evidence documented above. Nabidh cross-check negative (0/340). Case ready for investigator review and DHA reporting.',
      isAi: true,
    },
  ]);

  const nabidhPct = fraudCase.nabidhTotal > 0
    ? Math.round((fraudCase.nabidhMatch / fraudCase.nabidhTotal) * 100)
    : 0;

  const riskHex = fraudCase.riskLevel === 'CRITICAL' ? '#DC2626' : fraudCase.riskLevel === 'HIGH' ? '#EA580C' : fraudCase.riskLevel === 'MEDIUM' ? '#D97706' : '#CA8A04';

  const tabs: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'claims', label: 'All Claims', icon: Lock },
    { id: 'patterns', label: 'Pattern Analysis', icon: BarChart2 },
    { id: 'nabidh', label: 'Nabidh Check', icon: Globe },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [...n, { time: '7 Apr 2026, 2:07 PM', author: 'Mariam Al Khateeb', text: note }]);
    setNote('');
    onToast('Investigation note added', 'success');
  };

  const samplePatients = Array.from({ length: 10 }, (_, i) => ({
    id: `PT-ANON-${(i + 1).toString().padStart(3, '0')}`,
    service: 'Cardiology Consultation · CPT 99213',
    nabidh: 'NOT_FOUND',
  }));

  const timelineEvents = [
    { date: '24 Mar 2026', events: [
      { type: 'info', text: 'Provider Dr. Khalid Ibrahim joined CeenAiX', actor: 'System | Auto-registered' },
      { type: 'danger', text: 'First 23 fraudulent claims submitted', actor: 'System | Auto-logged' },
    ]},
    { date: '25 Mar – 6 Apr 2026', events: [
      { type: 'warning', text: '310 additional fraudulent claims submitted', actor: 'AI Engine | Auto-monitoring' },
      { type: 'info', text: '2 daily AI monitoring alerts (threshold not triggered)', actor: 'AI Engine | Auto-monitoring' },
    ]},
    { date: '7 Apr 2026 — 9:00 AM', events: [
      { type: 'danger', text: 'AI daily analysis triggered fraud threshold — 340 claims in 15 days exceeded 20-claim/day rule', actor: 'AI Engine | Automatic' },
    ]},
    { date: '7 Apr 2026 — 10:01 AM', events: [
      { type: 'info', text: 'Nabidh cross-reference initiated', actor: 'AI Engine | Automatic' },
    ]},
    { date: '7 Apr 2026 — 10:02 AM', events: [
      { type: 'danger', text: 'Nabidh check complete: 0/340 records — Confidence escalated from 71% → 94%', actor: 'AI Engine | Automatic' },
    ]},
    { date: '7 Apr 2026 — 12:30 PM', events: [
      { type: 'blue', text: '47 pending claims frozen automatically — AED 136,000 in pending payment blocked', actor: 'AI Engine | Auto-freeze' },
      { type: 'danger', text: `Case ${fraudCase.caseRef} created — Escalated to Insurance Portal fraud queue`, actor: 'AI Engine | Automatic' },
    ]},
    { date: '7 Apr 2026 — 2:07 PM', events: [
      { type: 'success', text: 'Case viewed by Mariam Al Khateeb', actor: 'Current user | This session' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15,45,74,0.6)' }}>
      <div className="flex flex-col overflow-hidden rounded-2xl shadow-2xl w-full" style={{ maxWidth: 1000, height: '90vh', backgroundColor: 'white' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 flex-shrink-0" style={{ backgroundColor: '#7F1D1D', minHeight: 64 }}>
          <div>
            <p className="text-white font-bold text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Investigation Workspace</p>
            <p className="text-xs" style={{ ...MONO, color: '#FCA5A5' }}>{fraudCase.caseRef} · {fraudCase.subjectName}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status selector */}
            <div className="relative">
              <button onClick={() => setShowStatusDrop(s => !s)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-red-400/50 hover:border-red-300 transition-colors">
                {STATUS_OPTIONS.find(s => s.value === status)?.label ?? status}
                <ChevronDown size={12} />
              </button>
              {showStatusDrop && (
                <div className="absolute right-0 top-9 bg-white rounded-xl shadow-xl border border-slate-200 z-10 overflow-hidden w-52">
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setStatus(opt.value as any); setShowStatusDrop(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                      {opt.label}
                      {status === opt.value && <Check size={13} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assign */}
            <div className="relative">
              <button onClick={() => setShowAssignDrop(s => !s)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-400/50 hover:border-red-300 transition-colors" style={{ color: '#FCA5A5' }}>
                {assigned ? assigned.split(' ')[0] : 'Unassigned'}
                <ChevronDown size={12} />
              </button>
              {showAssignDrop && (
                <div className="absolute right-0 top-9 bg-white rounded-xl shadow-xl border border-slate-200 z-10 overflow-hidden w-52">
                  <button onClick={() => { setAssigned(null); setShowAssignDrop(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 italic">Unassigned</button>
                  {TEAM.map(m => (
                    <button key={m} onClick={() => { setAssigned(m); setShowAssignDrop(false); onToast(`Case assigned to ${m.split(' ')[0]} ${m.split(' ')[1]}`, 'success'); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                      {m}
                      {assigned === m && <Check size={13} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-slate-100 px-4 flex-shrink-0 overflow-x-auto" style={{ backgroundColor: '#450A0A' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap"
              style={{ borderColor: tab === t.id ? '#FCA5A5' : 'transparent', color: tab === t.id ? '#FCA5A5' : 'rgba(252,165,165,0.5)' }}>
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* SUMMARY */}
          {tab === 'summary' && (
            <div className="p-6 grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>
              {/* Left */}
              <div className="space-y-4">
                {/* Case overview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Provider Details</p>
                  <div className="space-y-2">
                    <p className="text-base font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{fraudCase.subjectName}</p>
                    <p className="text-sm text-slate-500">{fraudCase.subjectFacility} · {fraudCase.subjectCity}</p>
                    {fraudCase.dhaLicense && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{fraudCase.dhaLicense} {fraudCase.dhaLicenseValid ? '✅' : '❌'}</span>
                        {fraudCase.dhaLicenseValid && <span className="text-xs text-emerald-600 font-semibold">License Valid</span>}
                        <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded animate-pulse">Under fraud investigation</span>
                      </div>
                    )}
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700 font-medium mt-2">
                      ⚠️ Provider joined CeenAiX on 24 Mar 2026 — same day as first fraudulent claims
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                <div className="border border-slate-200 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Evidence Summary</p>
                  <ol className="space-y-2">
                    {fraudCase.evidencePills.map((e, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: riskHex }}>{i + 1}</span>
                        {e}
                      </li>
                    ))}
                    {fraudCase.id === 'fraud-001' && (
                      <>
                        <li className="flex items-start gap-3 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: riskHex }}>6</span>
                          Provider started on CeenAiX same day as first claims (24 Mar 2026)
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: riskHex }}>7</span>
                          Clinic address: residential building (verified via UAE address lookup)
                        </li>
                      </>
                    )}
                  </ol>
                </div>

                {/* AI analysis */}
                <div className="rounded-2xl p-5 border border-violet-200" style={{ backgroundColor: '#F5F3FF' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot size={18} className="text-violet-600" />
                      <p className="text-sm font-bold text-violet-700">CeenAiX AI Analysis</p>
                    </div>
                    <span className="text-sm font-bold" style={{ ...MONO, color: riskHex }}>{fraudCase.confidence}% confidence</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">{fraudCase.aiReasoning}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fraudCase.aiRecommendations.map(r => (
                      <span key={r} className="px-2 py-1 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700">{r}</span>
                    ))}
                  </div>
                  <p className="text-xs mt-2 italic" style={{ ...MONO, color: '#A78BFA' }}>AI model: claude-sonnet-4 · Flagged: Auto-detection</p>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Financial */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Financial Summary</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Total billed</span>
                      <span className="text-xl font-black" style={{ ...MONO, color: '#DC2626' }}>AED {fraudCase.amountAtRisk.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Claims submitted</span>
                      <span className="text-base font-bold" style={MONO}>{fraudCase.claimsTotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Claims frozen</span>
                      <span className="text-base font-bold text-blue-600" style={MONO}>{fraudCase.claimsFrozen}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Claims paid</span>
                      <span className="text-base font-bold" style={{ ...MONO, color: fraudCase.claimsPaid > 0 ? '#DC2626' : '#10B981' }}>{fraudCase.claimsPaid}</span>
                    </div>
                    {fraudCase.amountPaid > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Amount paid out</span>
                        <span className="text-base font-bold text-red-600" style={MONO}>AED {fraudCase.amountPaid.toLocaleString()}</span>
                      </div>
                    )}
                    {fraudCase.amountPaid === 0 && (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
                        ✅ AI froze claims before payment — AED {fraudCase.amountAtRisk.toLocaleString()} fully protected
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
                  <button onClick={onFreeze} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#1D4ED8' }}>
                    <Lock size={15} /> Freeze Remaining Claims
                  </button>
                  <button onClick={onSuspend} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 bg-red-600">
                    <Ban size={15} /> Suspend Provider Account
                  </button>
                  <button onClick={onDhaReport} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0D9488' }}>
                    <FileText size={15} /> Generate DHA Report
                  </button>
                  <button onClick={() => { onToast('Provider inquiry email sent', 'info'); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">
                    <MessageSquare size={14} /> Request Provider Explanation
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                    ✓ Mark as False Positive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CLAIMS */}
          {tab === 'claims' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">{fraudCase.claimsTotal} claims from {fraudCase.subjectName}</p>
                  <p className="text-xs text-slate-500">Flagged: {fraudCase.startDate} – {fraudCase.flaggedAtDisplay}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onFreeze} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600">
                    <Lock size={13} /> Freeze All
                  </button>
                </div>
              </div>
              {fraudCase.id === 'fraud-001' && (
                <div className="mb-3 p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-700">
                  ⚠️ All claims identical — statistical anomaly: same CPT, same amount, same clinic
                </div>
              )}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F8FAFC' }}>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(fraudCase.claimsHistory.length > 0 ? fraudCase.claimsHistory : []).slice(0, 25).map((c, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-xs" style={MONO}>{c.date}</td>
                        <td className="px-4 py-2.5 text-xs font-semibold text-blue-600 uppercase" style={MONO}>{c.claimId}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500" style={MONO}>{c.patientId}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-600">{c.service} · <span className="font-semibold" style={MONO}>{c.cpt}</span></td>
                        <td className="px-4 py-2.5 text-xs font-bold text-red-600" style={MONO}>AED {c.amount.toLocaleString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.status === 'FROZEN' ? 'bg-blue-50 text-blue-700' : c.status === 'PAID' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                            {c.status === 'FROZEN' ? '🔒 Frozen' : c.status === 'PAID' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {fraudCase.claimsHistory.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Claim details under compilation</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {fraudCase.claimsHistory.length > 25 && (
                <p className="text-xs text-slate-400 text-center mt-3" style={MONO}>Showing 25 of {fraudCase.claimsTotal} claims</p>
              )}
            </div>
          )}

          {/* PATTERNS */}
          {tab === 'patterns' && (
            <div className="p-6 space-y-6">
              {/* Volume timeline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-slate-800 mb-4">Daily Claim Volume — {fraudCase.subjectName}</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={fraudCase.dailyPattern}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v} claims`, 'Daily count']} labelStyle={{ fontSize: 12 }} />
                    <ReferenceLine y={6} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Network avg: 6/day', fill: '#10B981', fontSize: 10 }} />
                    <Area type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} fill="rgba(239,68,68,0.15)" animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-semibold">
                  ⚠️ {fraudCase.claimsTotal} claims in {fraudCase.daysActive ?? 15} days = {fraudCase.claimsPerDay ?? (fraudCase.claimsTotal / (fraudCase.daysActive ?? 15)).toFixed(1)}/day (Network avg: 6/day · Physical max: ~12/day)
                </div>
              </div>

              {/* CPT distribution */}
              {fraudCase.id === 'fraud-001' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="text-sm font-bold text-slate-800 mb-4">Procedure Code Distribution</p>
                  <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-3">Dr. Khalid Ibrahim — 340 claims</p>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={[{ name: '99213', value: 100, fill: '#DC2626' }]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" />
                        </PieChart>
                      </ResponsiveContainer>
                      <p className="text-center text-xs text-red-600 font-bold mt-1">100% CPT 99213 — zero variance</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-3">Network Average — 847 providers</p>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={networkCptData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="pct">
                            {networkCptData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap gap-1 mt-1 justify-center">
                        {networkCptData.map(d => (
                          <span key={d.code} className="text-xs" style={{ color: d.fill }}>●{d.code} {d.pct}%</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-red-700 italic text-center mt-3">Uniform CPT 99213 across all 340 claims is a definitive ghost billing indicator.</p>
                </div>
              )}

              {/* Hourly pattern */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-slate-800 mb-4">When Were Claims Submitted?</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={hourlyData} barSize={10}>
                    <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v} claims`]} />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {hourlyData.map((d, i) => <Cell key={i} fill={d.hour.startsWith('2') || d.hour.startsWith('3') ? '#DC2626' : '#CBD5E1'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold">
                  89% of claims submitted 2–3 AM (outside all clinic hours)
                </div>
              </div>
            </div>
          )}

          {/* NABIDH */}
          {tab === 'nabidh' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🇦🇪</span>
                <div>
                  <p className="text-base font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>NABIDH HIE Cross-Reference Verification</p>
                  <p className="text-xs text-slate-500">Verification against UAE national health records</p>
                </div>
              </div>

              {/* Overall result */}
              <div className={`rounded-2xl p-6 border-2 ${nabidhPct === 0 ? 'bg-red-50 border-red-300' : nabidhPct < 75 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
                <p className={`text-lg font-bold mb-4 ${nabidhPct === 0 ? 'text-red-700' : nabidhPct < 75 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {nabidhPct === 0 ? '❌ NABIDH VERIFICATION FAILED' : nabidhPct < 75 ? '⚠️ NABIDH MATCH: PARTIAL' : '✅ NABIDH MATCH: VERIFIED'}
                </p>
                <div className="flex items-center gap-8 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Patients in claims</p>
                    <p className="text-2xl font-black" style={MONO}>{fraudCase.nabidhTotal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Nabidh records found</p>
                    <p className={`text-2xl font-black ${nabidhPct === 0 ? 'text-red-600' : 'text-emerald-600'}`} style={MONO}>{fraudCase.nabidhMatch}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Match rate</p>
                    <p className={`text-3xl font-black ${nabidhPct === 0 ? 'text-red-600' : nabidhPct < 75 ? 'text-amber-600' : 'text-emerald-600'}`} style={MONO}>{nabidhPct}%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">This provider: {nabidhPct}% match</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${nabidhPct}%`, backgroundColor: nabidhPct === 0 ? '#DC2626' : '#0D9488' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">Network average: 91.4% match</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-400" style={{ width: '91.4%' }} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-emerald-700 italic mt-3">✅ Legitimate providers typically show 85–100% Nabidh record match rate</p>
              </div>

              {/* Sample table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Patient Record Verification Sample (10 of {fraudCase.nabidhTotal})</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claimed Service</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nabidh Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samplePatients.map((p, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-4 py-2.5 text-xs font-semibold text-slate-600" style={MONO}>{p.id}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-600">{p.service}</td>
                        <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700">❌ NOT FOUND</span></td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-center text-xs text-red-600 font-bold bg-red-50">All {fraudCase.nabidhTotal} patients: ❌ NOT FOUND in Nabidh</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                <p className="text-xs font-bold text-blue-800 mb-1">Legal Admissibility Notice</p>
                <p className="text-xs text-blue-700 leading-relaxed">Nabidh cross-check is admissible as evidence in UAE Insurance Authority fraud proceedings. This report has been logged with timestamp and investigator identity for DHA submission.</p>
              </div>
            </div>
          )}

          {/* TIMELINE */}
          {tab === 'timeline' && (
            <div className="p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">Fraud Detection Timeline</p>
              <div className="space-y-6">
                {timelineEvents.map((group, gi) => (
                  <div key={gi}>
                    <p className="text-xs font-bold text-slate-700 mb-3" style={MONO}>{group.date}</p>
                    <div className="space-y-3 pl-4">
                      {group.events.map((ev, ei) => (
                        <div key={ei} className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                            style={{ backgroundColor: ev.type === 'danger' ? '#DC2626' : ev.type === 'warning' ? '#F59E0B' : ev.type === 'success' ? '#10B981' : ev.type === 'blue' ? '#2563EB' : '#94A3B8' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700">{ev.text}</p>
                            <p className="text-xs text-slate-400 mt-0.5" style={MONO}>{ev.actor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Future */}
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-3" style={MONO}>Upcoming Steps</p>
                  <div className="space-y-3 pl-4">
                    {['Investigation assigned to officer', 'Provider contacted for explanation', 'DHA report submitted', 'Case resolved'].map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5 border-2 border-slate-300" />
                        <p className="text-sm text-slate-400">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTES */}
          {tab === 'notes' && (
            <div className="p-6 space-y-5">
              {/* Existing notes */}
              <div className="space-y-3">
                {notes.map((n, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${n.isAi ? 'bg-violet-50 border-violet-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {n.isAi && <Bot size={14} className="text-violet-600" />}
                      <span className="text-xs font-bold text-slate-700">{n.author}</span>
                      <span className="text-xs text-slate-400" style={MONO}>{n.time}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add note */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Add Investigation Note (Internal Only)</p>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Add investigation notes..." className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <button onClick={addNote} disabled={!note.trim()} className="px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 hover:opacity-90 transition-all" style={{ backgroundColor: '#0F2D4A' }}>
                  + Add Note
                </button>
              </div>

              {/* Provider comms */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider Communications</p>
                <p className="text-xs text-slate-400 italic">No communications yet</p>
                <button onClick={() => onToast('Provider inquiry email sent to Dr. Khalid Ibrahim', 'info')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">
                  <MessageSquare size={13} /> Send Inquiry to Provider
                </button>
              </div>

              {/* DHA log */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DHA Reports</p>
                <p className="text-xs text-slate-400 italic">Not yet submitted</p>
                <div className="flex gap-2">
                  <button onClick={onDhaReport} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#0D9488' }}>
                    <FileText size={13} /> Preview DHA Report
                  </button>
                  <button onClick={() => { onDhaReport(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#0F2D4A' }}>
                    Submit to DHA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
