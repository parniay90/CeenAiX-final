import React, { useState } from 'react';
import {
  Phone, AlertTriangle, Clock, FlaskConical, ScanLine, Upload,
  FileText, RefreshCw, Activity, CheckCircle2, X, ChevronDown,
  ChevronRight, Printer, TrendingUp, Layers, Cpu, Zap, Beaker, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, Cell
} from 'recharts';
import { DeptFilter } from '../DiagnosticsTopBar';
import { labSamples, imagingStudies, equipmentItems, tatData, volumeData, ImagingStudy } from '../../../data/diagnosticsData';

const C = {
  bg: '#0F1117',
  surface: '#161822',
  surface2: '#1C1E2A',
  border: 'rgba(255,255,255,0.06)',
  border2: 'rgba(255,255,255,0.04)',
  text: '#F1F5F9',
  muted: 'rgba(255,255,255,0.35)',
  faint: 'rgba(255,255,255,0.12)',
  indigo: '#6366F1',
  blue: '#3B82F6',
  violet: '#8B5CF6',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  teal: '#14B8A6',
};

const modalityAccent: Record<string, string> = {
  MRI: '#8B5CF6', CT: '#3B82F6', USS: '#14B8A6',
  XR: '#64748B', PET: '#F59E0B', MAMMO: '#F43F5E', FLUORO: '#F97316',
};

// ─── CRITICAL BANNER ────────────────────────────────────────────────────────
const CriticalBanner: React.FC = () => {
  const [elapsed] = useState(44);
  const [dismissed, setDismissed] = useState(false);
  const [notified, setNotified] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-5 mt-4 rounded-xl overflow-hidden flex items-center gap-4 px-5 py-3.5" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="font-bold text-red-400 uppercase tracking-wide" style={{ fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Critical — Unnotified</span>
      </div>
      <div className="flex-1 min-w-0 text-slate-300" style={{ fontSize: 13 }}>
        <span className="font-semibold text-white">Ibrahim Al Marzouqi (PT-003)</span>
        {'  ·  '}
        <span style={{ fontFamily: 'DM Mono, monospace', color: '#FCA5A5' }}>K⁺ = 6.8 mEq/L ↑↑</span>
        {'  ·  Sample '}
        <span style={{ fontFamily: 'DM Mono, monospace' }}>002847</span>
        {'  ·  '}
        <span style={{ color: C.amber }}>{elapsed} min elapsed</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => { setNotified(true); setTimeout(() => setDismissed(true), 2000); }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all"
          style={{ background: notified ? 'rgba(16,185,129,0.2)' : '#EF4444', color: notified ? '#10B981' : '#fff', fontSize: 12, border: notified ? '1px solid rgba(16,185,129,0.4)' : 'none' }}
        >
          {notified ? <><CheckCircle2 className="w-3.5 h-3.5" /> Notified</> : <><Phone className="w-3.5 h-3.5" /> Notify Now</>}
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
};

// ─── KPI CARDS ──────────────────────────────────────────────────────────────
const KpiRow: React.FC<{ deptFilter: DeptFilter }> = ({ deptFilter }) => {
  const labKpis = [
    { v: '234', label: 'Samples Today', sub: '80.8% complete', icon: FlaskConical, accent: C.indigo, bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
    { v: '7', label: 'Critical Values', sub: '1 unnotified', icon: AlertTriangle, accent: C.red, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', warning: true },
    { v: '3.2h', label: 'Avg Lab TAT', sub: 'Within targets', icon: Clock, accent: C.indigo, bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
    { v: '42/47', label: 'NABIDH Lab', sub: '5 pending', icon: Upload, accent: C.violet, bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)' },
    { v: '4/5', label: 'QC Status', sub: '1 in maintenance', icon: Activity, accent: C.amber, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  ];
  const radKpis = [
    { v: '47', label: 'Studies Today', sub: '28 reported (60%)', icon: ScanLine, accent: C.blue, bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { v: '3', label: 'Scanning Now', sub: 'CT · MRI · USS', icon: RefreshCw, accent: C.violet, bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', pulse: true },
    { v: '9', label: 'Reports Pending', sub: 'Dr. Rania — 9 queued', icon: FileText, accent: C.amber, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    { v: '7', label: 'Scheduled', sub: 'Next: MRI at 2:30 PM', icon: Clock, accent: C.blue, bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
    { v: '2', label: 'Equip Issues', sub: 'Coag · X-Ray QA', icon: Zap, accent: C.amber, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', warning: true },
  ];

  const KpiCard: React.FC<{ k: typeof labKpis[0] }> = ({ k }) => {
    const Icon = k.icon;
    return (
      <div className="flex-1 min-w-0 rounded-xl p-3.5 transition-transform hover:scale-[1.015]" style={{ background: k.bg, border: `1px solid ${k.border}` }}>
        <div className="flex items-start justify-between mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${k.accent}22` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: k.accent }} />
          </div>
          {(k as any).warning && <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: C.amber }} />}
          {(k as any).pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse mt-1" style={{ background: k.accent }} />}
        </div>
        <div className="font-bold text-white leading-none mb-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 20 }}>{k.v}</div>
        <div className="font-medium text-white/80 leading-tight" style={{ fontSize: 11 }}>{k.label}</div>
        <div className="mt-0.5" style={{ fontSize: 10, color: C.muted }}>{k.sub}</div>
      </div>
    );
  };

  return (
    <div className="px-5 mt-4 space-y-3">
      {deptFilter !== 'radiology' && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1 h-3 rounded-full" style={{ background: C.indigo }} />
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: 'rgba(99,102,241,0.8)' }}>Laboratory</span>
          </div>
          <div className="flex gap-2.5">
            {labKpis.map(k => <KpiCard key={k.label} k={k} />)}
          </div>
        </div>
      )}
      {deptFilter !== 'lab' && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1 h-3 rounded-full" style={{ background: C.blue }} />
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: 'rgba(59,130,246,0.8)' }}>Radiology & Imaging</span>
          </div>
          <div className="flex gap-2.5">
            {radKpis.map(k => <KpiCard key={k.label} k={k} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STUDY DETAIL PANEL ──────────────────────────────────────────────────────
const StudyDetailPanel: React.FC<{ study: ImagingStudy; onClose: () => void }> = ({ study, onClose }) => {
  const isScanning = study.status === 'scanning';
  const isReport   = study.status === 'report_pending' || study.status === 'report_overdue';
  const accent     = modalityAccent[study.modality] || C.blue;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex flex-col" style={{ width: 400, background: '#161822', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: `${accent}14` }}>
        <div>
          <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>{study.modality} Study Detail</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: accent }}>{study.accession}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="p-4 rounded-xl" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-white" style={{ fontSize: 14 }}>{study.patientName}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.muted }}>
            {study.patientAge}{study.patientGender}{study.patientBloodGroup && ` · ${study.patientBloodGroup}`} · {study.patientId}
          </div>
          {study.insurance && <div className="mt-1" style={{ fontSize: 11, color: C.blue }}>{study.insurance}</div>}
          {study.conditions?.map(c => <div key={c} style={{ fontSize: 11, color: C.teal }}>• {c}</div>)}
        </div>

        <div className="space-y-2">
          {([
            ['Modality', `${study.modality} — ${study.studyType}`],
            study.scanner ? ['Scanner', study.scanner] : null,
            study.protocol ? ['Protocol', study.protocol] : null,
            study.contrast ? ['Contrast', study.contrast] : null,
            study.technologist ? ['Technologist', study.technologist] : null,
            ['Doctor', `${study.doctor}${study.doctorSpecialty ? ' · ' + study.doctorSpecialty : ''}`],
          ] as ([string, string] | null)[]).filter(Boolean).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4" style={{ fontSize: 12 }}>
              <span style={{ color: C.muted, flexShrink: 0 }}>{k}</span>
              <span style={{ color: C.text, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {isScanning && study.sequences && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative" style={{ width: 64, height: 64, flexShrink: 0 }}>
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#8B5CF6" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - (study.scanProgressPct || 55) / 100)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700, color: '#A78BFA' }}>{study.scanProgressPct}%</span>
                </div>
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#A78BFA', fontSize: 13 }}>Scanning in Progress</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.muted }}>{study.scanElapsed}m elapsed · {study.scanRemaining}m remaining</div>
              </div>
            </div>
            <div className="space-y-2">
              {study.sequences.map(seq => (
                <div key={seq.name} className="flex items-center gap-2" style={{ fontSize: 12, color: seq.status === 'done' ? C.emerald : seq.status === 'active' ? '#A78BFA' : C.muted }}>
                  {seq.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> :
                   seq.status === 'active' ? <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin flex-shrink-0" /> :
                   <div className="w-3.5 h-3.5 rounded-full border flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
                  <span className="flex-1">{seq.name}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{seq.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {study.previousStudy && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="font-semibold mb-1" style={{ fontSize: 11, color: C.blue }}>Previous Study (NABIDH)</div>
            <div style={{ fontSize: 11, color: C.text }}>{study.previousStudy.date} · {study.previousStudy.facility}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Finding: {study.previousStudy.finding}</div>
          </div>
        )}

        <div>
          <div className="uppercase tracking-wider mb-2" style={{ fontSize: 10, color: C.muted }}>Pipeline</div>
          <div className="flex flex-wrap gap-1 gap-y-1.5">
            {['Ordered', 'Scheduled', 'Arrived', 'Consent', 'Scanning', 'Complete', 'Report', 'Released', 'NABIDH'].map((step, i) => {
              const done  = i < (isScanning ? 4 : isReport ? 5 : 2);
              const active = i === (isScanning ? 4 : isReport ? 5 : 2);
              return (
                <React.Fragment key={step}>
                  <div className="px-1.5 py-0.5 rounded font-semibold" style={{ fontSize: 9, background: done ? 'rgba(16,185,129,0.15)' : active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', color: done ? C.emerald : active ? '#A78BFA' : C.muted, border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : active ? 'rgba(139,92,246,0.3)' : 'transparent'}` }}>
                    {done ? '✓' : active ? '●' : '○'} {step}
                  </div>
                  {i < 8 && <ChevronRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {study.clinicalNotes && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="font-semibold mb-1.5" style={{ fontSize: 11, color: C.blue }}>Clinical Notes</div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{study.clinicalNotes}</div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {isScanning && <>
          <button className="w-full py-2.5 rounded-xl font-semibold transition-colors hover:opacity-90" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}33`, fontSize: 13 }}>View Full Protocol</button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: C.muted, fontSize: 13, border: '1px solid rgba(255,255,255,0.07)' }}>Message Doctor</button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors" style={{ background: 'rgba(245,158,11,0.1)', color: C.amber, fontSize: 13, border: '1px solid rgba(245,158,11,0.2)' }}>Pause Study</button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors" style={{ background: 'rgba(239,68,68,0.06)', color: C.red, fontSize: 13, border: '1px solid rgba(239,68,68,0.15)' }}>Emergency Stop</button>
        </>}
        {isReport && <>
          <button className="w-full py-2.5 rounded-xl font-bold transition-colors" style={{ background: C.amber, color: '#0F1117', fontSize: 13 }}>Open for Reporting</button>
          <button className="w-full py-2 rounded-xl font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: C.amber, fontSize: 13, border: '1px solid rgba(245,158,11,0.2)' }}>Alert Radiologist</button>
          <button className="w-full py-2 rounded-xl font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: C.muted, fontSize: 13, border: '1px solid rgba(255,255,255,0.07)' }}>Message Doctor</button>
        </>}
        {study.status === 'scheduled' && <>
          {study.contrastAlert && <button className="w-full py-2.5 rounded-xl font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: C.amber, fontSize: 13, border: '1px solid rgba(245,158,11,0.3)' }}>Get Contrast Consent</button>}
          <button className="w-full py-2.5 rounded-xl font-semibold" style={{ background: `${C.blue}22`, color: C.blue, fontSize: 13, border: `1px solid ${C.blue}33` }}>Confirm Patient Arrival</button>
        </>}
      </div>
    </div>
  );
};

// ─── IMAGING QUEUE CARD ──────────────────────────────────────────────────────
const ImagingStudyCard: React.FC<{ study: ImagingStudy; onClick: () => void }> = ({ study, onClick }) => {
  const accent = modalityAccent[study.modality] || C.blue;
  const isScanning = study.status === 'scanning';
  const isOverdue  = study.status === 'report_overdue';

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
      style={{ borderBottom: `1px solid ${C.border2}`, background: isScanning ? `${accent}08` : 'transparent' }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = `${accent}12`)}
      onMouseLeave={e => (e.currentTarget.style.background = isScanning ? `${accent}08` : 'transparent')}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 border" style={{ background: `${accent}18`, color: accent, borderColor: `${accent}30`, fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
        {study.modality}
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{study.accession}</div>
        <div className="font-semibold text-white truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>{study.patientName}</div>
        <div className="truncate" style={{ fontSize: 11, color: C.muted }}>{study.studyType}</div>
        {isScanning && (
          <div className="mt-1.5">
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: `${accent}20` }}>
              <div className="h-full rounded-full" style={{ width: `${study.scanProgressPct}%`, background: accent, transition: 'width 0.6s ease' }} />
            </div>
            <div className="mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: `${accent}cc` }}>
              {study.scanElapsed}m elapsed · ~{study.scanRemaining}m remaining
            </div>
          </div>
        )}
        {(study.status === 'report_pending' || isOverdue) && (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: isOverdue ? C.red : C.amber }}>
            {study.reportPendingHours}h ago{isOverdue ? ' — OVERDUE' : ''} · queue {study.queuePosition}/9
          </div>
        )}
        {study.status === 'scheduled' && (
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: C.blue }}>{study.scheduledTime} · {study.scheduledTimeRelative}</span>
            {study.contrastAlert && <span style={{ fontSize: 9, color: C.amber }}>⚠ Contrast</span>}
            {study.fdgAlert      && <span style={{ fontSize: 9, color: C.amber }}>⚠ FDG</span>}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="px-2 py-0.5 rounded-full font-bold" style={{
          fontSize: 9,
          background: isScanning ? `${accent}20` : isOverdue ? 'rgba(239,68,68,0.15)' : study.status === 'report_pending' ? 'rgba(245,158,11,0.15)' : study.status === 'scheduled' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.12)',
          color: isScanning ? accent : isOverdue ? C.red : study.status === 'report_pending' ? C.amber : study.status === 'scheduled' ? C.blue : C.emerald,
        }}>
          {isScanning ? '● Scanning' : isOverdue ? '! Overdue' : study.status === 'report_pending' ? '⏳ Pending' : study.status === 'scheduled' ? '⏰ Sched.' : '✓ Done'}
        </span>
        {isScanning && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: `${accent}99` }}>{study.scanRemaining}m</span>}
      </div>
    </div>
  );
};

// ─── LAB SAMPLE ROW ─────────────────────────────────────────────────────────
const deptAccent: Record<string, string> = {
  Chemistry: '#6366F1', Haematology: '#EF4444', Immunology: '#8B5CF6',
  Coagulation: '#F59E0B', Microbiology: '#14B8A6',
};

const LabSampleRow: React.FC<{ sample: typeof labSamples[0]; onClick?: () => void }> = ({ sample, onClick }) => {
  const isCritical = sample.status === 'critical';
  const isOverdue  = sample.tatOverdue;
  const isRunning  = sample.status === 'running';
  const leftAccent = isCritical ? C.red : isOverdue ? C.amber : sample.priority === 'stat' ? C.red : sample.priority === 'urgent' ? C.amber : deptAccent[sample.department || ''] || C.indigo;
  const bgBase     = isCritical ? 'rgba(239,68,68,0.06)' : 'transparent';

  const statusLabel = isCritical ? '⚠ CRITICAL' : isRunning ? '◎ Running' : sample.status === 'resulted' ? 'Resulted' : sample.status === 'verified' ? '✓ Verified' : sample.status === 'received' ? 'Received' : 'Pending';
  const statusBg    = isCritical ? 'rgba(239,68,68,0.2)' : isRunning ? 'rgba(99,102,241,0.18)' : sample.status === 'resulted' ? 'rgba(245,158,11,0.15)' : sample.status === 'verified' ? 'rgba(16,185,129,0.15)' : sample.status === 'received' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)';
  const statusColor = isCritical ? C.red : isRunning ? C.indigo : sample.status === 'resulted' ? C.amber : sample.status === 'verified' ? C.emerald : sample.status === 'received' ? C.blue : C.muted;

  const completedPct = sample.totalTests && sample.completedTests !== undefined ? Math.round((sample.completedTests / sample.totalTests) * 100) : null;

  return (
    <div
      className="cursor-pointer transition-all"
      style={{ borderBottom: `1px solid ${C.border2}`, borderLeft: `3px solid ${leftAccent}55`, background: bgBase }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = `${leftAccent}0a`)}
      onMouseLeave={e => (e.currentTarget.style.background = bgBase)}
    >
      <div className="flex items-start gap-3 px-3 pt-2.5 pb-1.5">
        {/* Left: sample number + time */}
        <div className="flex-shrink-0" style={{ width: 58 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: isCritical ? '#FCA5A5' : 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{sample.sampleNum}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{sample.receivedTime}</div>
          {sample.tat && (
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: isOverdue ? C.amber : C.muted, marginTop: 1 }}>{sample.tat} TAT</div>
          )}
        </div>

        {/* Middle: patient + tests */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <div className="font-semibold text-white" style={{ fontSize: 12 }}>{sample.patientName}</div>
            <span style={{ fontSize: 9, color: C.muted }}>·</span>
            <span style={{ fontSize: 9, color: C.muted }}>{sample.patientAge}{sample.patientGender}</span>
            {sample.priority === 'stat' && (
              <span className="px-1.5 py-0 rounded font-black" style={{ fontSize: 8, background: 'rgba(239,68,68,0.2)', color: C.red, border: '1px solid rgba(239,68,68,0.3)' }}>STAT</span>
            )}
            {sample.priority === 'urgent' && (
              <span className="px-1.5 py-0 rounded font-black" style={{ fontSize: 8, background: 'rgba(245,158,11,0.15)', color: C.amber, border: '1px solid rgba(245,158,11,0.25)' }}>URGENT</span>
            )}
          </div>

          {isCritical && sample.criticalValues ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {sample.criticalValues.map(cv => (
                <span key={cv.test} style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#FCA5A5' }}>
                  {cv.test}: {cv.value} {cv.unit} {cv.flag}
                  {cv.refRange && <span style={{ fontSize: 9, color: 'rgba(252,165,165,0.5)', fontWeight: 400 }}> (ref {cv.refRange})</span>}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {sample.tests.map(t => (
                <span key={t} className="px-1.5 py-0 rounded" style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: `1px solid ${C.border}` }}>{t}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-1.5">
            {sample.department && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: deptAccent[sample.department] || C.indigo }} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{sample.department}</span>
              </div>
            )}
            {sample.sampleType && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Mono, monospace' }}>{sample.sampleType}</span>}
            {sample.location && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{sample.location}</span>}
          </div>
        </div>

        {/* Right: status + actions */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="px-2 py-0.5 rounded-full font-bold" style={{ fontSize: 9, background: statusBg, color: statusColor }}>{statusLabel}</span>
          {isCritical && (
            <button className="px-2 py-1 rounded-lg font-bold flex items-center gap-1 hover:opacity-80" style={{ background: C.red, color: '#fff', fontSize: 9 }} onClick={e => e.stopPropagation()}>
              <Phone className="w-2.5 h-2.5" /> Notify
            </button>
          )}
          {isOverdue && !isCritical && (
            <span style={{ fontSize: 8, color: C.amber, fontFamily: 'DM Mono, monospace' }}>TAT OVERDUE</span>
          )}
        </div>
      </div>

      {/* Progress bar for running/received */}
      {(isRunning || sample.status === 'received') && completedPct !== null && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.12)' }}>
              <div className="h-full rounded-full" style={{ width: `${completedPct}%`, background: `linear-gradient(90deg, ${C.indigo}, #818CF8)`, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 9, color: C.muted, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{sample.completedTests}/{sample.totalTests} tests</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
const DiagnosticsDashboard: React.FC<{ deptFilter: DeptFilter; onNavigate?: (page: string) => void }> = ({ deptFilter, onNavigate }) => {
  const [selectedStudy, setSelectedStudy] = useState<ImagingStudy | null>(null);
  const [modalityFilter, setModalityFilter] = useState<'all' | 'MRI' | 'CT' | 'USS' | 'XR' | 'PET'>('all');
  const [labDeptFilter, setLabDeptFilter] = useState<'all' | 'Chemistry' | 'Haematology' | 'Immunology' | 'Coagulation' | 'Microbiology'>('all');
  const [showMoreLab, setShowMoreLab] = useState(false);
  const [volumeTab, setVolumeTab] = useState<'both' | 'lab' | 'rad'>('both');

  const showLab = deptFilter !== 'radiology';
  const showRad = deptFilter !== 'lab';

  const scanning  = imagingStudies.filter(s => s.status === 'scanning');
  const pending   = imagingStudies.filter(s => s.status === 'report_pending' || s.status === 'report_overdue');
  const scheduled = imagingStudies.filter(s => s.status === 'scheduled');
  const applyMod  = (arr: ImagingStudy[]) => modalityFilter === 'all' ? arr : arr.filter(s => s.modality === modalityFilter);

  const filteredLabSamples = labDeptFilter === 'all' ? labSamples : labSamples.filter(s => s.department === labDeptFilter);
  const criticalSamples    = filteredLabSamples.filter(s => s.status === 'critical');
  const runningSamples     = filteredLabSamples.filter(s => s.status === 'running');
  const pendingSamples     = filteredLabSamples.filter(s => s.status === 'pending' || s.status === 'received');
  const resultedSamples    = filteredLabSamples.filter(s => s.status === 'resulted' || s.status === 'verified');

  const sectionHeader = (label: string, count: number, color: string) => (
    <div className="flex items-center gap-2 px-4 py-2" style={{ background: `${color}0a`, borderBottom: `1px solid ${color}18` }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
      <span className="font-bold uppercase tracking-wider" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color }}>{label} ({count})</span>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto" style={{ background: C.bg }}>
      <CriticalBanner />
      <KpiRow deptFilter={deptFilter} />

      <div className="px-5 py-4 flex gap-4 min-w-0" style={{ height: 'auto', minHeight: 0 }}>
        {/* Lab Column */}
        {showLab && (
          <div className="flex flex-col rounded-2xl overflow-hidden" style={{ flex: showRad ? '0 0 38%' : '0 0 60%', minWidth: 0, height: 'calc(100vh - 320px)', background: C.surface, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.indigo}` }}>
            {/* Header */}
            <div className="px-4 pt-3 pb-2 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
                    <FlaskConical className="w-4 h-4" style={{ color: C.indigo }} /> Lab Queue
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    <span style={{ color: C.red, fontWeight: 600 }}>{criticalSamples.length} critical</span>
                    {' · '}
                    <span style={{ color: C.indigo }}>{runningSamples.length} running</span>
                    {' · '}
                    <span>{pendingSamples.length} pending</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.('lab')}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ fontSize: 10, color: C.indigo }}
                >
                  Lab Portal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {/* Dept filter chips */}
              <div className="flex items-center gap-1 flex-wrap">
                {(['all', 'Chemistry', 'Haematology', 'Immunology', 'Coagulation', 'Microbiology'] as const).map(f => (
                  <button key={f} onClick={() => setLabDeptFilter(f)}
                    className="px-2 py-0.5 rounded-lg font-bold transition-all"
                    style={{ fontSize: 9, background: labDeptFilter === f ? `${deptAccent[f] || C.indigo}25` : 'rgba(255,255,255,0.04)', color: labDeptFilter === f ? (deptAccent[f] || C.indigo) : C.muted, border: labDeptFilter === f ? `1px solid ${(deptAccent[f] || C.indigo)}35` : '1px solid transparent' }}
                  >{f === 'all' ? 'All Depts' : f}</button>
                ))}
              </div>
            </div>

            {/* Scrollable sample list */}
            <div className="flex-1 overflow-y-auto">
              {/* Critical section */}
              {criticalSamples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-1.5" style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-red-500" />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em' }}>CRITICAL — UNNOTIFIED ({criticalSamples.length})</span>
                  </div>
                  {criticalSamples.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}

              {/* Running section */}
              {runningSamples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-1.5" style={{ background: 'rgba(99,102,241,0.07)', borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.indigo }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, color: C.indigo, textTransform: 'uppercase', letterSpacing: '0.1em' }}>RUNNING ({runningSamples.length})</span>
                  </div>
                  {runningSamples.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}

              {/* Pending / Received section */}
              {pendingSamples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-1.5" style={{ background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.blue }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.1em' }}>PENDING ({pendingSamples.length})</span>
                  </div>
                  {pendingSamples.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}

              {/* Resulted / Verified section */}
              {resultedSamples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-1.5" style={{ background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 700, color: C.emerald, textTransform: 'uppercase', letterSpacing: '0.1em' }}>RESULTED ({resultedSamples.length})</span>
                  </div>
                  {resultedSamples.slice(0, showMoreLab ? undefined : 3).map(s => <LabSampleRow key={s.id} sample={s} />)}
                  {!showMoreLab && resultedSamples.length > 3 && (
                    <button onClick={() => setShowMoreLab(true)} className="w-full py-2.5 flex items-center justify-center gap-1.5 transition-colors hover:bg-white/5" style={{ fontSize: 11, color: C.indigo }}>
                      <ChevronDown className="w-3.5 h-3.5" /> {resultedSamples.length - 3} more
                    </button>
                  )}
                </div>
              )}

              {filteredLabSamples.length === 0 && (
                <div className="px-5 py-10 text-center" style={{ color: C.muted, fontSize: 12 }}>No samples for this department</div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.08)', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
              <div>
                <div className="font-bold" style={{ fontSize: 11, color: C.red }}>1 critical unnotified</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(239,68,68,0.6)' }}>Ibrahim K⁺ 6.8 · 44 min elapsed</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ background: C.red, color: '#fff', fontSize: 11 }}>
                <Phone className="w-3 h-3" /> Notify Now
              </button>
            </div>
          </div>
        )}

        {/* Radiology Column */}
        {showRad && (
          <div className="flex flex-col rounded-2xl overflow-hidden" style={{ flex: showLab ? '0 0 38%' : '0 0 60%', minWidth: 0, height: 'calc(100vh - 320px)', background: C.surface, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.blue}` }}>
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
                    <ScanLine className="w-4 h-4" style={{ color: C.blue }} /> Imaging Queue
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>47 studies · 3 scanning now</div>
                </div>
                <button className="px-2.5 py-1 rounded-lg font-bold transition-colors hover:opacity-80" style={{ fontSize: 10, background: `${C.blue}22`, color: C.blue, border: `1px solid ${C.blue}33` }}>+ New Study</button>
              </div>
              <div className="flex items-center gap-1.5">
                {(['all', 'MRI', 'CT', 'USS', 'XR', 'PET'] as const).map(m => (
                  <button key={m} onClick={() => setModalityFilter(m)}
                    className="px-2 py-0.5 rounded-lg font-bold transition-all"
                    style={{ fontSize: 9, background: modalityFilter === m ? (m === 'MRI' ? `${C.violet}25` : m === 'CT' ? `${C.blue}25` : `${C.blue}20`) : 'rgba(255,255,255,0.04)', color: modalityFilter === m ? (m === 'MRI' ? C.violet : m === 'CT' ? C.blue : C.blue) : C.muted }}
                  >
                    {m === 'all' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {applyMod(scanning).length > 0 && (
                <>{sectionHeader('Active Now', applyMod(scanning).length, C.violet)}{applyMod(scanning).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}</>
              )}
              {applyMod(pending).length > 0 && (
                <>{sectionHeader('Report Pending', applyMod(pending).length, C.amber)}{applyMod(pending).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}</>
              )}
              {applyMod(scheduled).length > 0 && (
                <>{sectionHeader('Scheduled Today', applyMod(scheduled).length, C.blue)}{applyMod(scheduled).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}</>
              )}
            </div>
            <div className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)', borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10, color: C.muted }}><span style={{ color: C.emerald, fontWeight: 700 }}>28 done</span> · <span style={{ color: C.amber }}>9 pending</span></span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: C.muted }}>TAT <span style={{ color: C.blue, fontWeight: 700 }}>3.8h</span></span>
              <span style={{ fontSize: 10, color: C.muted }}>Dr. Rania: 9 queued</span>
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="overflow-y-auto space-y-3" style={{ flex: '1 1 0', minWidth: 220, maxWidth: 300, height: 'calc(100vh - 320px)' }}>
          {/* Equipment */}
          <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>Equipment</span>
              <button style={{ fontSize: 10, color: C.teal }}>View All →</button>
            </div>
            <div className="p-3 space-y-0.5">
              <div className="uppercase tracking-widest mb-1.5" style={{ fontSize: 8, fontFamily: 'DM Mono, monospace', color: `${C.blue}80` }}>RADIOLOGY</div>
              {equipmentItems.radiology.map(e => (
                <div key={e.name} className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.status === 'online' ? C.emerald : e.status === 'scanning' || e.status === 'running' ? C.violet : e.status === 'maintenance' ? C.red : e.status === 'partial' ? C.amber : C.blue }} />
                  <span className="flex-1 truncate" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{e.name}</span>
                  <span className="truncate" style={{ fontSize: 9, color: e.status === 'maintenance' ? C.red : e.status === 'scanning' || e.status === 'running' ? C.violet : C.muted, maxWidth: 100, textAlign: 'right' }}>{e.info}</span>
                </div>
              ))}
              <div className="my-2" style={{ height: 1, background: C.border }} />
              <div className="uppercase tracking-widest mb-1.5" style={{ fontSize: 8, fontFamily: 'DM Mono, monospace', color: `${C.indigo}80` }}>LABORATORY</div>
              {equipmentItems.lab.map(e => (
                <div key={e.name} className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.status === 'online' ? C.emerald : e.status === 'running' ? C.violet : e.status === 'maintenance' ? C.red : C.amber }} />
                  <span className="flex-1 truncate" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{e.name}</span>
                  <span className="truncate" style={{ fontSize: 9, color: e.status === 'maintenance' ? C.red : e.status === 'running' ? C.violet : C.muted, maxWidth: 100, textAlign: 'right' }}>{e.info}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TAT */}
          <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-bold text-white flex items-center gap-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: C.muted }} /> Turnaround Times
              </span>
            </div>
            <div className="px-3 pt-2 pb-3">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={tatData} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} domain={[0, 6]} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, background: '#1C1E2A', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }} formatter={(v: number) => [`${v}h`, 'TAT']} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={600}>
                    {tatData.map((e, i) => (
                      <Cell key={i} fill={e.value > e.target ? C.red : e.value > e.target * 0.92 ? C.amber : e.color} />
                    ))}
                  </Bar>
                  <ReferenceLine y={4} stroke={`${C.indigo}70`} strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={3} stroke={`${C.blue}50`} strokeDasharray="4 4" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 px-2 py-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div style={{ fontSize: 10, color: C.amber }}>⚠ MRI TAT 4.8h vs 4h target — 9 in queue</div>
                <button className="mt-0.5 hover:underline" style={{ fontSize: 10, color: 'rgba(245,158,11,0.7)' }}>Escalate →</button>
              </div>
            </div>
          </div>

          {/* NABIDH */}
          <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-bold text-white flex items-center gap-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
                <Upload className="w-3.5 h-3.5" style={{ color: C.violet }} /> NABIDH
              </span>
              <span style={{ fontSize: 10, color: C.muted }}>🇦🇪 FHIR R4</span>
            </div>
            <div className="p-4 space-y-3">
              {[{ label: 'Lab', count: '42/47', pct: 89, color: C.indigo }, { label: 'Radiology', count: '25/28', pct: 89, color: C.blue }].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: r.color }}>{r.count}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
              <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                <div className="flex justify-between mb-2" style={{ fontSize: 11, color: C.muted }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: C.text, fontWeight: 700 }}>67/75 · 8 pending</span>
                </div>
                <button className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity" style={{ background: `${C.violet}22`, color: C.violet, border: `1px solid ${C.violet}33`, fontSize: 12 }}>
                  <Upload className="w-3.5 h-3.5" /> Submit Pending (8)
                </button>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>Volume Today</span>
              <div className="flex gap-0.5">
                {(['both', 'lab', 'rad'] as const).map(k => (
                  <button key={k} onClick={() => setVolumeTab(k)} className="px-2 py-0.5 rounded font-bold transition-all" style={{ fontSize: 10, background: volumeTab === k ? 'rgba(255,255,255,0.1)' : 'transparent', color: volumeTab === k ? C.text : C.muted }}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 pt-2 pb-1">
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={volumeData} margin={{ top: 2, right: 4, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.indigo} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.indigo} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, background: '#1C1E2A', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }} animationDuration={100} />
                  {(volumeTab === 'both' || volumeTab === 'lab') && <Area type="monotone" dataKey="lab" stroke={C.indigo} strokeWidth={2} fill="url(#lg1)" name="Lab" dot={false} animationDuration={600} />}
                  {(volumeTab === 'both' || volumeTab === 'rad') && <Area type="monotone" dataKey="rad" stroke={C.blue} strokeWidth={2} fill="url(#lg2)" name="Radiology" dot={false} animationDuration={600} />}
                </AreaChart>
              </ResponsiveContainer>
              <div className="text-center py-1.5 font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                234 lab + 47 imaging = <span style={{ color: C.text }}>281 total</span>
              </div>
            </div>
          </div>

          {/* Handoff */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
              <Clock className="w-4 h-4" style={{ color: C.amber }} />
              <span className="font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: C.amber }}>Handoff in 53 min</span>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { icon: '⚠', text: '1 critical unnotified (Ibrahim)', c: C.red },
                { icon: '⏳', text: '14 lab samples pending', c: C.amber },
                { icon: '⏳', text: '9 reports pending radiologist', c: C.amber },
                { icon: '⏳', text: 'PET-CT 3:30 PM (after shift)', c: C.amber },
                { icon: '⚠', text: 'MRI TAT overdue — escalate', c: C.red },
                { icon: '✓', text: 'QC logs complete', c: C.emerald },
              ].map(r => (
                <div key={r.text} className="flex items-center gap-2" style={{ fontSize: 11, color: r.c }}>
                  <span style={{ fontSize: 12 }}>{r.icon}</span>{r.text}
                </div>
              ))}
              <button className="w-full mt-2 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity" style={{ background: 'rgba(245,158,11,0.15)', color: C.amber, border: '1px solid rgba(245,158,11,0.2)', fontSize: 12 }}>
                <Printer className="w-3.5 h-3.5" /> Generate Handoff Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedStudy && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={() => setSelectedStudy(null)} />
          <StudyDetailPanel study={selectedStudy} onClose={() => setSelectedStudy(null)} />
        </>
      )}
    </div>
  );
};

export default DiagnosticsDashboard;
