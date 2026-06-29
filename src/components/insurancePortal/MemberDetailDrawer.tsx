import React, { useState } from 'react';
import {
  X, User, FileText, Activity, DollarSign, ChevronLeft, ChevronRight,
  Copy, AlertTriangle, CheckCircle2, Clock, Download, Send, ClipboardList,
  Shield, Brain,
} from 'lucide-react';
import type { Member } from '../../types/insurancePortal';

interface Props {
  member: Member;
  allMembers: Member[];
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
  onNavigate: (m: Member) => void;
}

type DrawerTab = 'overview' | 'claims' | 'health' | 'benefits';

const riskColors = {
  CRITICAL: { bg: '#FEF2F2', border: '#DC2626', badge: '#DC2626', badgeText: '#fff', text: '🔴 CRITICAL' },
  HIGH:     { bg: '#FFF7ED', border: '#F97316', badge: '#FFF7ED', badgeText: '#9A3412', text: '🟠 HIGH' },
  MEDIUM:   { bg: '#FFFBEB', border: '#F59E0B', badge: '#FFFBEB', badgeText: '#92400E', text: '🟡 MEDIUM' },
  LOW:      { bg: '#F0FDF4', border: '#10B981', badge: '#F0FDF4', badgeText: '#065F46', text: '🟢 LOW' },
};

const planColors: Record<string, { bg: string; color: string }> = {
  Gold:   { bg: '#EFF6FF', color: '#1D4ED8' },
  Silver: { bg: '#EEF2FF', color: '#4338CA' },
  Basic:  { bg: '#F1F5F9', color: '#475569' },
  Thiqa:  { bg: '#F0FDF4', color: '#065F46' },
};

const scoreColor = (s: number) =>
  s >= 80 ? '#10B981' : s >= 60 ? '#0D9488' : s >= 40 ? '#F59E0B' : s >= 20 ? '#F97316' : '#DC2626';

const ScoreRing = ({ score, size = 64 }: { score: number; size?: number }) => {
  const color = scoreColor(score);
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: size * 0.25, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.12, color: '#94A3B8', lineHeight: 1 }}>/100</span>
      </div>
    </div>
  );
};

const usagePct = (m: Member) => Math.round((m.annualUsed / m.annualLimit) * 100);

const barColor = (pct: number) =>
  pct >= 100 ? '#DC2626' : pct >= 86 ? '#F97316' : pct >= 61 ? '#F59E0B' : pct >= 26 ? '#0D9488' : '#10B981';

const MemberDetailDrawer: React.FC<Props> = ({ member, allMembers, onClose, onToast, onNavigate }) => {
  const [tab, setTab] = useState<DrawerTab>('overview');
  const idx = allMembers.findIndex(m => m.id === member.id);
  const prev = idx > 0 ? allMembers[idx - 1] : null;
  const next = idx < allMembers.length - 1 ? allMembers[idx + 1] : null;

  const rc = riskColors[member.riskLevel];
  const pc = planColors[member.planType] ?? { bg: '#F8FAFC', color: '#475569' };
  const pct = usagePct(member);
  const bc = barColor(pct);
  const totalDamanPaid = member.claimsHistory?.reduce((s, c) => s + c.damanPays, 0) ?? 0;
  const totalPatientPaid = (member.claimsHistory?.reduce((s, c) => s + c.gross, 0) ?? 0) - totalDamanPaid;

  const TABS: { key: DrawerTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User style={{ width: 12, height: 12 }} /> },
    { key: 'claims', label: 'Claims', icon: <DollarSign style={{ width: 12, height: 12 }} /> },
    { key: 'health', label: 'Health Profile', icon: <Activity style={{ width: 12, height: 12 }} /> },
    { key: 'benefits', label: 'Benefits', icon: <FileText style={{ width: 12, height: 12 }} /> },
  ];

  return (
    <div className="fixed inset-0 z-[500]" style={{ pointerEvents: 'none' }}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(15,45,74,0.25)', backdropFilter: 'blur(2px)', pointerEvents: 'auto' }}
        onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col" style={{ width: 660, background: '#fff', borderLeft: '1px solid #E2E8F0', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', pointerEvents: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '16px 20px', background: '#0F2D4A', borderBottom: '1px solid #1E3A5F' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Member Profile</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#93C5FD' }}>
              {member.fullName} · {member.memberId}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-2.5 py-1" style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.12)', color: '#FDE68A' }}>
              {rc.text} RISK
            </span>
            <button onClick={onClose} className="rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-shrink-0" style={{ background: '#1E3A5F', padding: '0 20px', borderBottom: '1px solid #2D4A6F' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 py-3 px-3"
              style={{
                fontSize: 12, fontWeight: tab === t.key ? 700 : 400,
                color: tab === t.key ? '#93C5FD' : '#64748B',
                borderBottom: tab === t.key ? '2px solid #93C5FD' : '2px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              {/* Identity card */}
              <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #1E3A5F, #0D9488)', color: '#fff', fontSize: 18, fontWeight: 800 }}>
                      {member.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white" style={{ width: 14, height: 14, background: rc.border }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{member.fullName}</div>
                    {member.arabicName && <div style={{ fontSize: 13, color: '#94A3B8', direction: 'rtl', textAlign: 'right' }}>{member.arabicName}</div>}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="rounded-full px-2 py-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, background: pc.bg, color: pc.color, fontWeight: 700 }}>{member.memberId}</span>
                      <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: '#F1F5F9', color: '#475569' }}>{member.age}{member.gender} · {member.nationality}</span>
                      <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: pc.bg, color: pc.color, fontWeight: 700 }}>Daman {member.planType}</span>
                      <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: rc.badge, color: rc.badgeText, fontWeight: 700, border: `1px solid ${rc.border}30` }}>{rc.text} RISK</span>
                    </div>
                    {member.allergies && member.allergies.length > 0 && (
                      <div className="rounded px-2 py-1 mt-2 flex items-center gap-1.5" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', display: 'inline-flex' }}>
                        <AlertTriangle style={{ width: 10, height: 10, color: '#DC2626', flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: '#991B1B', fontWeight: 700 }}>
                          {member.allergies.map(a => `${a.name} ${a.severity}`).join(' · ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Identity grid */}
              <div className="grid gap-y-2 rounded-xl p-4" style={{ gridTemplateColumns: '1fr 1fr', background: '#F8FAFC', border: '1px solid #E2E8F0', gap: '8px 16px' }}>
                {[
                  ['Policy #', member.policyNumber],
                  ['Plan', `Daman ${member.planType} — Individual`],
                  ['Member since', member.memberSince],
                  ['DOB', `${member.dobDisplay} (${member.age} years)`],
                  ['Emirates ID', member.emiratesId],
                  ['Mobile', member.mobile],
                  ['Email', member.email],
                  ['Last login', member.lastPlatformLogin],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{k}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#0F172A', fontWeight: 600 }}>{v}
                      {k === 'Policy #' && (
                        <button onClick={() => { navigator.clipboard.writeText(member.policyNumber); onToast('Policy number copied', 'info'); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 4px', color: '#94A3B8' }}>
                          <Copy style={{ width: 9, height: 9 }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Platform stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: member.claimsCount, label: 'Claims 2026' },
                  { value: member.activePrescriptions, label: 'Active Rx' },
                  { value: member.labResults, label: 'Lab Results' },
                  { value: member.appointments, label: 'Appointments' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl text-center" style={{ padding: '12px 8px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 800, color: '#1E3A5F' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Care team */}
              <div className="rounded-xl p-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 10, color: '#0D9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>PRIMARY CARE TEAM</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{member.primaryDoctor}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{member.primarySpecialty} · {member.primaryFacility}</div>
                {member.nextAppointment && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#0D9488', marginTop: 4 }}>Next: {member.nextAppointment}</div>}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Wellness Outreach', bg: '#EFF6FF', color: '#1E3A5F', action: () => onToast(`Wellness outreach sent to ${member.fullName}`, 'success') },
                  { label: 'View Pre-Auths', bg: '#EEF2FF', color: '#4338CA', action: () => onToast('Navigating to pre-auth for this member', 'info') },
                  { label: 'Flag for Review', bg: '#FFFBEB', color: '#92400E', action: () => onToast(`${member.fullName} flagged for care review`, 'warning') },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 flex-1"
                    style={{ fontSize: 12, fontWeight: 600, background: a.bg, color: a.color, border: `1px solid ${a.color}20` }}>
                    <Send style={{ width: 12, height: 12 }} />{a.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── CLAIMS ── */}
          {tab === 'claims' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Claims 2026', value: String(member.claimsCount), color: '#1E3A5F' },
                  { label: 'Total Value', value: `AED ${member.claimsTotal.toLocaleString()}`, color: '#1E3A5F' },
                  { label: 'Daman Paid', value: `AED ${totalDamanPaid.toLocaleString()}`, color: '#059669' },
                  { label: 'Patient Paid', value: `AED ${totalPatientPaid.toLocaleString()}`, color: '#D97706' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {member.claimsHistory && member.claimsHistory.length > 0 ? (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                  <div style={{ background: '#F8FAFC', padding: '8px 14px', borderBottom: '1px solid #F1F5F9' }}>
                    <div className="grid" style={{ gridTemplateColumns: '80px 1fr 90px 70px 80px', gap: 8 }}>
                      {['Date', 'Service', 'Gross', 'Daman', 'Status'].map(h => (
                        <div key={h} style={{ fontSize: 9, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                      ))}
                    </div>
                  </div>
                  {member.claimsHistory.map(c => (
                    <div key={c.ref} style={{ padding: '10px 14px', borderBottom: '1px solid #F8FAFC' }}>
                      <div className="grid items-center" style={{ gridTemplateColumns: '80px 1fr 90px 70px 80px', gap: 8 }}>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>{c.date}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{c.service}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>{c.ref}</div>
                          {c.paRef && <div style={{ fontSize: 9, color: '#059669' }}>{c.paRef}</div>}
                        </div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{c.gross.toLocaleString()}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#059669' }}>{c.damanPays.toLocaleString()}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: c.status === 'APPROVED' || c.status === 'AUTO_APPROVED' ? '#059669' : c.status === 'PENDING' ? '#D97706' : '#DC2626' }}>
                          {c.status === 'AUTO_APPROVED' ? '✅ Auto' : c.status === 'APPROVED' ? '✅' : c.status === 'PENDING' ? '⏳' : '❌'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="grid items-center" style={{ gridTemplateColumns: '80px 1fr 90px 70px 80px', gap: 8, padding: '10px 14px', background: '#F0FDF4', borderTop: '1px solid #BBF7D0' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: '#065F46', gridColumn: '1/3' }}>TOTALS</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 800, color: '#065F46' }}>{member.claimsTotal.toLocaleString()}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 800, color: '#059669' }}>{totalDamanPaid.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-6 text-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>No claims history available</div>
                </div>
              )}
              <button onClick={() => onToast(`Claims history downloaded for ${member.fullName}`, 'success')}
                className="w-full rounded-xl py-2 flex items-center justify-center gap-2"
                style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 12 }}>
                <Download style={{ width: 13, height: 13 }} /> Download Claims History
              </button>
            </>
          )}

          {/* ── HEALTH PROFILE ── */}
          {tab === 'health' && (
            <>
              {/* Privacy notice */}
              <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <Shield style={{ width: 12, height: 12, color: '#2563EB', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: '#1E40AF', lineHeight: 1.5 }}>
                  Health data accessed from CeenAiX via Nabidh HIE for claims processing only. Access logged per UAE PDPL (Federal Law No. 45/2021).
                </p>
              </div>

              {/* AI Health Score */}
              <div className="rounded-xl p-4" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain style={{ width: 16, height: 16, color: '#7C3AED' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4C1D95' }}>CeenAiX AI Health Score</span>
                </div>
                <div className="flex items-center gap-6">
                  <ScoreRing score={member.aiHealthScore} size={80} />
                  <div className="flex-1">
                    <p style={{ fontSize: 11, color: '#6D28D9', fontStyle: 'italic', marginBottom: 8 }}>
                      Based on: vitals, labs, medications, lifestyle, appointment adherence, AI consultations
                    </p>
                    {[
                      { label: 'Vitals', pct: 85 },
                      { label: 'Lab values', pct: 72 },
                      { label: 'Medication adherence', pct: 94 },
                      { label: 'Lifestyle factors', pct: 61 },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-2 mb-1.5">
                        <div style={{ fontSize: 10, color: '#7C3AED', width: 120, flexShrink: 0 }}>{b.label}</div>
                        <div className="flex-1 rounded-full" style={{ height: 4, background: '#E9D5FF' }}>
                          <div className="rounded-full" style={{ height: 4, width: `${b.pct}%`, background: scoreColor(b.pct) }} />
                        </div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#7C3AED', width: 28 }}>{b.pct}</div>
                      </div>
                    ))}
                    {member.aiHealthTrend !== undefined && (
                      <div style={{ fontSize: 10, color: member.aiHealthTrend >= 0 ? '#059669' : '#DC2626', marginTop: 4, fontWeight: 600 }}>
                        {member.aiHealthTrend >= 0 ? '↑' : '↓'} {Math.abs(member.aiHealthTrend)} points vs last month
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conditions */}
              {member.conditions.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                  <div style={{ padding: '8px 14px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE CONDITIONS</div>
                  </div>
                  {member.conditions.map(cond => {
                    const dotColor = cond.statusColor === 'emerald' ? '#10B981' : cond.statusColor === 'teal' ? '#0D9488' : cond.statusColor === 'amber' ? '#F59E0B' : '#DC2626';
                    const badgeColor = cond.statusColor === 'emerald' ? { bg: '#F0FDF4', color: '#065F46' } : cond.statusColor === 'teal' ? { bg: '#F0FDFA', color: '#0F766E' } : cond.statusColor === 'amber' ? { bg: '#FFFBEB', color: '#92400E' } : { bg: '#FEF2F2', color: '#991B1B' };
                    return (
                      <div key={cond.code} className="flex items-center gap-3" style={{ padding: '10px 14px', borderBottom: '1px solid #F8FAFC' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                        <div className="flex-1">
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{cond.name}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8' }}>{cond.code} {cond.doctor && `· ${cond.doctor}`}</div>
                        </div>
                        {cond.status && (
                          <span className="rounded px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: badgeColor.bg, color: badgeColor.color }}>{cond.status}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vitals */}
              {member.vitals && (
                <div className="rounded-xl p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>LATEST VITALS — 7 April 2026</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: 'Blood Pressure', v: member.vitals.bp, ok: member.vitals.bpOk },
                      { k: 'Heart Rate', v: member.vitals.hr, ok: true },
                      { k: 'Weight / BMI', v: `${member.vitals.weight} · BMI ${member.vitals.bmi}`, ok: true },
                      { k: 'SpO2', v: member.vitals.spo2, ok: true },
                      { k: 'Temperature', v: member.vitals.temp, ok: true },
                    ].map(v => (
                      <div key={v.k}>
                        <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>{v.k}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: v.ok ? '#059669' : '#D97706' }}>{v.v} {v.ok ? '✅' : '⚠️'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labs */}
              {member.keyLabs && member.keyLabs.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                  <div style={{ padding: '8px 14px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>KEY LABS — March 2026</div>
                  </div>
                  {member.keyLabs.map(l => (
                    <div key={l.name} className="flex items-center gap-3" style={{ padding: '9px 14px', borderBottom: '1px solid #F8FAFC' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.status === 'ok' ? '#10B981' : '#F59E0B', flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: '#334155', flex: 1 }}>{l.name}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: l.status === 'ok' ? '#059669' : '#D97706' }}>{l.value}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>ref {l.ref}</div>
                      {l.note && <div style={{ fontSize: 9, color: l.status === 'ok' ? '#059669' : '#D97706' }}>{l.note}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Medications */}
              {member.medications.length > 0 && (
                <div className="rounded-xl p-3" style={{ background: '#F0FDFA', border: '1px solid #99F6E4' }}>
                  <div style={{ fontSize: 10, color: '#0D9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>ACTIVE MEDICATIONS ({member.medications.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.medications.map(med => (
                      <span key={med.name} className="rounded-lg px-2 py-1" style={{ fontSize: 11, background: '#fff', border: '1px solid #99F6E4', color: '#0F172A' }}>
                        {med.name} <span style={{ color: '#94A3B8' }}>{med.dose}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Wellness flag */}
              {member.wellnessFlag && (
                <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                  <AlertTriangle style={{ width: 12, height: 12, color: '#D97706', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12, color: '#92400E' }}>{member.wellnessFlag}</div>
                </div>
              )}
            </>
          )}

          {/* ── BENEFITS ── */}
          {tab === 'benefits' && (
            <>
              {/* Annual status */}
              <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>ANNUAL BENEFIT STATUS — 2026</div>
                <div className="flex items-center gap-6">
                  <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                    <svg width={100} height={100} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                      <circle cx={50} cy={50} r={42} fill="none" stroke="#F1F5F9" strokeWidth={8} />
                      <circle cx={50} cy={50} r={42} fill="none" stroke={bc} strokeWidth={8}
                        strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - pct / 100)} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 800, color: bc }}>{pct}%</span>
                      <span style={{ fontSize: 9, color: '#94A3B8' }}>used</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#334155', marginBottom: 2 }}>AED {member.annualUsed.toLocaleString()} used</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 800, color: bc, marginBottom: 2 }}>
                      AED {(member.annualLimit - member.annualUsed).toLocaleString()} remaining
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>of AED {member.annualLimit.toLocaleString()} annual limit</div>
                    {member.copayPercent === 0
                      ? <div style={{ fontSize: 10, color: '#059669', marginTop: 4 }}>0% co-pay (Thiqa government)</div>
                      : <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>{member.copayPercent}% co-pay applies</div>
                    }
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Policy valid: 1 Jan – 31 Dec 2026</div>
                  </div>
                </div>
              </div>

              {/* Usage by category */}
              {member.usageByCategory && member.usageByCategory.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>USAGE BY CATEGORY</div>
                  {member.usageByCategory.map(cat => {
                    const catPct = Math.round((cat.amount / member.annualUsed) * 100);
                    return (
                      <div key={cat.category} className="flex items-center gap-3 mb-2">
                        <div style={{ fontSize: 11, color: '#334155', width: 120, flexShrink: 0 }}>{cat.category}</div>
                        <div className="flex-1 rounded-full" style={{ height: 8, background: '#F1F5F9' }}>
                          <div className="rounded-full" style={{ height: 8, width: `${catPct}%`, background: cat.color }} />
                        </div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155', width: 80, textAlign: 'right' }}>AED {cat.amount.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Coverage checklist */}
              <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  DAMAN {member.planType.toUpperCase()} COVERAGE
                </div>
                {[
                  { item: 'Specialist consultations', covered: true },
                  { item: 'Cardiology & internal medicine', covered: true },
                  { item: 'Radiology & Imaging (PA for MRI/CT)', covered: true },
                  { item: 'Laboratory tests', covered: true },
                  { item: 'Pharmacy — generic medicines', covered: true },
                  { item: 'Emergency care (100%)', covered: true },
                  { item: 'Teleconsultation', covered: true },
                  { item: 'Cosmetic procedures', covered: false },
                  { item: 'Fertility treatment', covered: false },
                  { item: 'Dental (emergency only)', covered: false },
                ].map(c => (
                  <div key={c.item} className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontSize: 13 }}>{c.covered ? '✅' : '❌'}</span>
                    <span style={{ fontSize: 11, color: c.covered ? '#334155' : '#94A3B8' }}>{c.item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between" style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
          <div className="flex gap-2">
            <button onClick={() => onToast(`Wellness outreach sent to ${member.fullName}`, 'success')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2"
              style={{ fontSize: 11, background: '#EFF6FF', color: '#1E3A5F', border: '1px solid #BFDBFE' }}>
              <Send style={{ width: 11, height: 11 }} /> Wellness
            </button>
            <button onClick={() => onToast(`Member report downloaded — ${member.fullName}`, 'success')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2"
              style={{ fontSize: 11, background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }}>
              <Download style={{ width: 11, height: 11 }} /> Report
            </button>
            <button onClick={() => onToast('Navigating to pre-authorizations', 'info')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2"
              style={{ fontSize: 11, background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}>
              <ClipboardList style={{ width: 11, height: 11 }} /> Pre-Auths
            </button>
          </div>
          <div className="flex gap-1">
            <button onClick={() => prev && onNavigate(prev)} disabled={!prev}
              className="rounded-lg px-2 py-1.5 flex items-center gap-1"
              style={{ fontSize: 11, color: prev ? '#475569' : '#CBD5E1', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <ChevronLeft style={{ width: 12, height: 12 }} /> Prev
            </button>
            <button onClick={() => next && onNavigate(next)} disabled={!next}
              className="rounded-lg px-2 py-1.5 flex items-center gap-1"
              style={{ fontSize: 11, color: next ? '#475569' : '#CBD5E1', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              Next <ChevronRight style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailDrawer;
