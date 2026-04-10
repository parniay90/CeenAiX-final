import React, { useState } from 'react';
import {
  Phone, AlertTriangle, Clock, FlaskConical, ScanLine, Upload,
  FileText, RefreshCw, Activity, CheckCircle2, X, ChevronDown,
  ChevronRight, Printer, TrendingUp, Zap, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, Cell
} from 'recharts';
import { DeptFilter } from '../DiagnosticsTopBar';
import { labSamples, imagingStudies, equipmentItems, tatData, volumeData, ImagingStudy } from '../../../data/diagnosticsData';

const modalityAccent: Record<string, { bg: string; text: string; border: string; label: string }> = {
  MRI:   { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE', label: 'MRI' },
  CT:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'CT' },
  USS:   { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4', label: 'USS' },
  XR:    { bg: '#F8FAFC', text: '#475569', border: '#CBD5E1', label: 'XR' },
  PET:   { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'PET' },
  MAMMO: { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3', label: 'MAM' },
  FLUORO:{ bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'FLU' },
};

const modalityBorder: Record<string, string> = {
  MRI: '#6366F1', CT: '#1D4ED8', USS: '#0D9488', XR: '#64748B',
  PET: '#D97706', MAMMO: '#E11D48', FLUORO: '#EA580C',
};

const deptAccent: Record<string, string> = {
  Chemistry: '#4F46E5', Haematology: '#DC2626', Immunology: '#7C3AED',
  Coagulation: '#D97706', Microbiology: '#0D9488',
};

// ─── CRITICAL BANNER ─────────────────────────────────────────────────────────
const CriticalBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [notified, setNotified]   = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="mx-5 mt-4 rounded-2xl overflow-hidden flex items-center gap-4 px-5 py-3.5"
      style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
    >
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="font-bold text-red-600 uppercase tracking-wide" style={{ fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
          Critical — Unnotified
        </span>
      </div>
      <div className="flex-1 min-w-0 text-slate-700" style={{ fontSize: 13 }}>
        <span className="font-semibold text-slate-900">Ibrahim Al Marzouqi (PT-003)</span>
        {'  ·  '}
        <span style={{ fontFamily: 'DM Mono, monospace', color: '#DC2626', fontWeight: 700 }}>K⁺ = 6.8 mEq/L ↑↑</span>
        {'  ·  Sample '}
        <span style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>002847</span>
        {'  ·  '}
        <span style={{ color: '#D97706', fontWeight: 600 }}>44 min elapsed</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => { setNotified(true); setTimeout(() => setDismissed(true), 2000); }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all"
          style={{
            background: notified ? '#F0FDF4' : '#DC2626',
            color: notified ? '#16A34A' : '#fff',
            fontSize: 12,
            border: notified ? '1px solid #BBF7D0' : 'none',
          }}
        >
          {notified ? <><CheckCircle2 className="w-3.5 h-3.5" /> Notified</> : <><Phone className="w-3.5 h-3.5" /> Notify Now</>}
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 rounded-lg transition-colors text-red-400 hover:text-red-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── DUAL KPI STRIP ───────────────────────────────────────────────────────────
interface KpiDef {
  v: string; label: string; sub: string;
  iconEl: React.ReactNode;
  accent: string; bg: string; border: string;
  warning?: boolean; pulse?: boolean;
}

const KpiCard: React.FC<{ k: KpiDef }> = ({ k }) => (
  <div
    className="flex-1 min-w-0 rounded-xl p-3.5 bg-white transition-transform hover:scale-[1.02] hover:shadow-md"
    style={{ border: `1.5px solid ${k.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-start justify-between mb-2.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: k.bg }}
      >
        {k.iconEl}
      </div>
      {k.warning && <span className="w-2 h-2 rounded-full mt-1 bg-amber-400" />}
      {k.pulse && <span className="w-2 h-2 rounded-full animate-pulse mt-1" style={{ background: k.accent }} />}
    </div>
    <div
      className="font-bold leading-none mb-1"
      style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, color: k.accent }}
    >
      {k.v}
    </div>
    <div className="font-semibold text-slate-700 leading-tight" style={{ fontSize: 11 }}>{k.label}</div>
    <div className="mt-0.5 text-slate-400" style={{ fontSize: 10 }}>{k.sub}</div>
  </div>
);

const KpiStrip: React.FC<{ deptFilter: DeptFilter }> = ({ deptFilter }) => {
  const labKpis: KpiDef[] = [
    { v: '234', label: 'Samples Today',  sub: '80.8% complete',      iconEl: <FlaskConical className="w-4 h-4" style={{ color: '#4F46E5' }} />, accent: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
    { v: '7',   label: 'Critical Values',sub: '1 unnotified ⚠',      iconEl: <AlertTriangle className="w-4 h-4 text-red-500" />,              accent: '#DC2626', bg: '#FEF2F2', border: '#FECACA', warning: true },
    { v: '3.2h',label: 'Avg Lab TAT',   sub: 'Within targets ✅',     iconEl: <Clock className="w-4 h-4" style={{ color: '#4F46E5' }} />,       accent: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
    { v: '42/47',label: 'NABIDH Lab',   sub: '5 pending',            iconEl: <Upload className="w-4 h-4" style={{ color: '#7C3AED' }} />,       accent: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    { v: '4/5', label: 'QC Status',     sub: '1 maintenance ⚠',      iconEl: <Activity className="w-4 h-4 text-amber-500" />,                  accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A', warning: true },
  ];
  const radKpis: KpiDef[] = [
    { v: '47',  label: 'Studies Today',  sub: '28 reported (60%)',    iconEl: <ScanLine className="w-4 h-4" style={{ color: '#1D4ED8' }} />,     accent: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    { v: '3',   label: 'Scanning Now',   sub: 'CT · MRI · USS active',iconEl: <RefreshCw className="w-4 h-4" style={{ color: '#7C3AED' }} />,    accent: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', pulse: true },
    { v: '9',   label: 'Reports Pending',sub: 'Radiologist: Dr. Rania',iconEl: <FileText className="w-4 h-4 text-amber-500" />,                  accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { v: '7',   label: 'Scheduled Today',sub: 'Next: MRI 2:30 PM',    iconEl: <Clock className="w-4 h-4" style={{ color: '#1D4ED8' }} />,        accent: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    { v: '2',   label: 'Equip Issues',   sub: 'Coag · X-Ray QA',      iconEl: <Zap className="w-4 h-4 text-amber-500" />,                       accent: '#D97706', bg: '#FFFBEB', border: '#FDE68A', warning: true },
  ];

  return (
    <div className="px-5 mt-4 space-y-3">
      {deptFilter !== 'radiology' && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1 h-3 rounded-full bg-indigo-600" />
            <span className="font-bold uppercase tracking-widest text-indigo-600" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
              🧪 Laboratory
            </span>
          </div>
          <div className="flex gap-2.5">
            {labKpis.map(k => <KpiCard key={k.label} k={k} />)}
          </div>
        </div>
      )}
      {deptFilter !== 'lab' && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1 h-3 rounded-full bg-blue-700" />
            <span className="font-bold uppercase tracking-widest text-blue-700" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
              🩻 Radiology &amp; Imaging
            </span>
          </div>
          <div className="flex gap-2.5">
            {radKpis.map(k => <KpiCard key={k.label} k={k} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── IMAGING STUDY DETAIL PANEL ──────────────────────────────────────────────
const StudyDetailPanel: React.FC<{ study: ImagingStudy; onClose: () => void }> = ({ study, onClose }) => {
  const isScanning = study.status === 'scanning';
  const isReport   = study.status === 'report_pending' || study.status === 'report_overdue';
  const ma         = modalityAccent[study.modality] || modalityAccent.CT;
  const borderColor = modalityBorder[study.modality] || '#1D4ED8';

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white"
      style={{ width: 420, borderLeft: '1px solid #E2E8F0', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid #F1F5F9', background: ma.bg, borderTop: `3px solid ${borderColor}` }}
      >
        <div>
          <div className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
            {study.modality} Study Detail
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: ma.text }}>{study.accession}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="font-bold text-slate-800" style={{ fontSize: 14 }}>{study.patientName}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>
            {study.patientAge}{study.patientGender}{study.patientBloodGroup && ` · ${study.patientBloodGroup}`} · {study.patientId}
          </div>
          {study.insurance && <div className="mt-0.5 text-blue-600" style={{ fontSize: 11 }}>{study.insurance}</div>}
          {study.conditions?.map(c => <div key={c} className="text-teal-600" style={{ fontSize: 11 }}>• {c}</div>)}
        </div>

        <div className="space-y-2">
          {([
            ['Modality',    `${study.modality} — ${study.studyType}`],
            study.scanner         ? ['Scanner',      study.scanner]                                           : null,
            study.protocol        ? ['Protocol',     study.protocol]                                          : null,
            study.contrast        ? ['Contrast',     study.contrast]                                          : null,
            study.technologist    ? ['Technologist', study.technologist]                                      : null,
            ['Doctor',            `${study.doctor}${study.doctorSpecialty ? ' · ' + study.doctorSpecialty : ''}`],
          ] as ([string, string] | null)[]).filter(Boolean).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4" style={{ fontSize: 12 }}>
              <span className="text-slate-400 flex-shrink-0">{k}</span>
              <span className="text-slate-700 text-right">{v}</span>
            </div>
          ))}
        </div>

        {isScanning && study.sequences && (
          <div className="p-4 rounded-xl" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0" style={{ width: 72, height: 72 }}>
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#DDD6FE" strokeWidth="8" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#7C3AED" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - (study.scanProgressPct || 55) / 100)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 15, fontWeight: 700, color: '#7C3AED' }}>
                    {study.scanProgressPct}%
                  </span>
                </div>
              </div>
              <div>
                <div className="font-semibold text-violet-700" style={{ fontSize: 13 }}>Scanning in Progress</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>
                  {study.scanElapsed}m elapsed · {study.scanRemaining}m remaining
                </div>
                {study.scanner && (
                  <div className="mt-1 text-slate-500" style={{ fontSize: 11 }}>{study.scanner}</div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {study.sequences.map(seq => (
                <div
                  key={seq.name}
                  className="flex items-center gap-2"
                  style={{ fontSize: 12, color: seq.status === 'done' ? '#16A34A' : seq.status === 'active' ? '#7C3AED' : '#94A3B8' }}
                >
                  {seq.status === 'done'   ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> :
                   seq.status === 'active' ? <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin flex-shrink-0" /> :
                   <div className="w-3.5 h-3.5 rounded-full border border-slate-200 flex-shrink-0" />}
                  <span className="flex-1">{seq.name}</span>
                  <span className="text-slate-300" style={{ fontSize: 10 }}>{seq.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {study.previousStudy && (
          <div className="p-3 rounded-xl" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div className="font-semibold mb-1 text-blue-600" style={{ fontSize: 11 }}>Previous Study (NABIDH)</div>
            <div className="text-slate-700" style={{ fontSize: 11 }}>{study.previousStudy.date} · {study.previousStudy.facility}</div>
            <div className="text-slate-500" style={{ fontSize: 11 }}>Finding: {study.previousStudy.finding}</div>
          </div>
        )}

        <div>
          <div className="uppercase tracking-wider mb-2 text-slate-400" style={{ fontSize: 10 }}>Pipeline</div>
          <div className="flex flex-wrap gap-1 gap-y-1.5">
            {['Ordered','Scheduled','Arrived','Consent','Scanning','Complete','Report','Released','NABIDH'].map((step, i) => {
              const done   = i < (isScanning ? 4 : isReport ? 5 : 2);
              const active = i === (isScanning ? 4 : isReport ? 5 : 2);
              return (
                <React.Fragment key={step}>
                  <div
                    className="px-1.5 py-0.5 rounded font-semibold"
                    style={{
                      fontSize: 9,
                      background: done ? '#F0FDF4' : active ? '#F5F3FF' : '#F8FAFC',
                      color: done ? '#16A34A' : active ? '#7C3AED' : '#94A3B8',
                      border: `1px solid ${done ? '#BBF7D0' : active ? '#DDD6FE' : '#E2E8F0'}`,
                    }}
                  >
                    {done ? '✓' : active ? '●' : '○'} {step}
                  </div>
                  {i < 8 && <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 text-slate-200" style={{ alignSelf: 'center' }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {study.clinicalNotes && (
          <div className="p-3 rounded-xl" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div className="font-semibold mb-1.5 text-blue-600" style={{ fontSize: 11 }}>Clinical Notes</div>
            <div className="text-slate-700" style={{ fontSize: 12, lineHeight: 1.6 }}>{study.clinicalNotes}</div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex-shrink-0 border-t border-slate-100">
        {isScanning && <>
          <button className="w-full py-2.5 rounded-xl font-semibold transition-colors" style={{ background: ma.bg, color: ma.text, border: `1px solid ${ma.border}`, fontSize: 13 }}>
            View Full Protocol
          </button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors text-slate-500 bg-slate-50 border border-slate-200" style={{ fontSize: 13 }}>
            Message Doctor
          </button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontSize: 13 }}>
            Pause Study
          </button>
          <button className="w-full py-2 rounded-xl font-medium transition-colors" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontSize: 13 }}>
            Emergency Stop
          </button>
        </>}
        {isReport && <>
          <button className="w-full py-2.5 rounded-xl font-bold transition-colors" style={{ background: '#D97706', color: '#fff', fontSize: 13 }}>
            Open for Reporting
          </button>
          <button className="w-full py-2 rounded-xl font-medium" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontSize: 13 }}>
            Alert Radiologist
          </button>
          <button className="w-full py-2 rounded-xl font-medium text-slate-500 bg-slate-50 border border-slate-200" style={{ fontSize: 13 }}>
            Message Doctor
          </button>
        </>}
        {study.status === 'scheduled' && <>
          {study.contrastAlert && (
            <button className="w-full py-2.5 rounded-xl font-bold" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontSize: 13 }}>
              Get Contrast Consent
            </button>
          )}
          <button className="w-full py-2.5 rounded-xl font-semibold" style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', fontSize: 13 }}>
            Confirm Patient Arrival
          </button>
        </>}
      </div>
    </div>
  );
};

// ─── IMAGING STUDY CARD ───────────────────────────────────────────────────────
const ImagingStudyCard: React.FC<{ study: ImagingStudy; onClick: () => void }> = ({ study, onClick }) => {
  const ma         = modalityAccent[study.modality] || modalityAccent.CT;
  const leftBorder = modalityBorder[study.modality] || '#1D4ED8';
  const isScanning = study.status === 'scanning';
  const isOverdue  = study.status === 'report_overdue';

  const statusBadge = isScanning
    ? { bg: '#F5F3FF', color: '#7C3AED', label: '● Scanning' }
    : isOverdue
    ? { bg: '#FEF2F2', color: '#DC2626', label: '! Overdue' }
    : study.status === 'report_pending'
    ? { bg: '#FFFBEB', color: '#D97706', label: '⏳ Report' }
    : study.status === 'scheduled'
    ? { bg: '#EFF6FF', color: '#1D4ED8', label: '⏰ Sched.' }
    : { bg: '#F0FDF4', color: '#16A34A', label: '✓ Done' };

  const rowBg = isScanning ? '#F5F3FF' : study.status === 'report_overdue' ? '#FEF2F2' : study.status === 'scheduled' ? '#F8FAFC' : '#fff';

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
      style={{ borderBottom: '1px solid #F1F5F9', borderLeft: `3px solid ${leftBorder}`, background: rowBg }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = `${ma.bg}`)}
      onMouseLeave={e => (e.currentTarget.style.background = rowBg)}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
        style={{ background: ma.bg, color: ma.text, border: `1px solid ${ma.border}`, fontFamily: 'DM Mono, monospace', fontSize: 9 }}
      >
        {ma.label}
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>{study.accession}</div>
        <div className="font-semibold text-slate-800 truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
          {study.patientName}
        </div>
        <div className="truncate text-slate-500" style={{ fontSize: 11 }}>{study.studyType}</div>
        {study.doctor && <div className="text-slate-400 truncate" style={{ fontSize: 10 }}>{study.doctor}</div>}

        {isScanning && (
          <div className="mt-1.5">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#EDE9FE' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${study.scanProgressPct}%`, background: '#7C3AED', transition: 'width 0.6s ease' }}
              />
            </div>
            <div className="mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#7C3AED' }}>
              {study.scanElapsed}m elapsed · ~{study.scanRemaining}m remaining
            </div>
          </div>
        )}
        {(study.status === 'report_pending' || isOverdue) && (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: isOverdue ? '#DC2626' : '#D97706' }}>
            {study.reportPendingHours}h ago{isOverdue ? ' — OVERDUE' : ''} · queue {study.queuePosition}/9
          </div>
        )}
        {study.status === 'scheduled' && (
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#1D4ED8' }}>
              {study.scheduledTime} · {study.scheduledTimeRelative}
            </span>
            {study.contrastAlert && <span className="text-amber-500" style={{ fontSize: 9 }}>⚠ Contrast</span>}
            {study.fdgAlert      && <span className="text-amber-500" style={{ fontSize: 9 }}>⚠ FDG</span>}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="px-2 py-0.5 rounded-full font-bold" style={{ fontSize: 9, background: statusBadge.bg, color: statusBadge.color }}>
          {statusBadge.label}
        </span>
        {isScanning && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#7C3AED' }}>{study.scanRemaining}m</span>}
      </div>
    </div>
  );
};

// ─── LAB SAMPLE ROW ───────────────────────────────────────────────────────────
const LabSampleRow: React.FC<{ sample: typeof labSamples[0] }> = ({ sample }) => {
  const isCritical = sample.status === 'critical';
  const isOverdue  = sample.tatOverdue;
  const isRunning  = sample.status === 'running';
  const leftAccent = isCritical ? '#DC2626'
    : isOverdue   ? '#D97706'
    : sample.priority === 'stat'   ? '#DC2626'
    : sample.priority === 'urgent' ? '#D97706'
    : deptAccent[sample.department || ''] || '#4F46E5';
  const bgBase = isCritical ? '#FEF2F2' : '#fff';

  const statusLabel = isCritical ? '⚠ CRITICAL'
    : isRunning               ? '◎ Running'
    : sample.status === 'resulted' ? 'Resulted'
    : sample.status === 'verified' ? '✓ Verified'
    : sample.status === 'received' ? 'Received'
    : 'Pending';

  const statusStyle = isCritical
    ? { bg: '#FEE2E2', color: '#DC2626' }
    : isRunning
    ? { bg: '#EEF2FF', color: '#4F46E5' }
    : sample.status === 'resulted'
    ? { bg: '#FFFBEB', color: '#D97706' }
    : sample.status === 'verified'
    ? { bg: '#F0FDF4', color: '#16A34A' }
    : sample.status === 'received'
    ? { bg: '#EFF6FF', color: '#1D4ED8' }
    : { bg: '#F8FAFC', color: '#64748B' };

  const completedPct = sample.totalTests && sample.completedTests !== undefined
    ? Math.round((sample.completedTests / sample.totalTests) * 100)
    : null;

  return (
    <div
      className="cursor-pointer transition-all"
      style={{ borderBottom: '1px solid #F1F5F9', borderLeft: `3px solid ${leftAccent}66`, background: bgBase }}
      onMouseEnter={e => (e.currentTarget.style.background = isCritical ? '#FEE2E2' : '#F8FAFC')}
      onMouseLeave={e => (e.currentTarget.style.background = bgBase)}
    >
      <div className="flex items-start gap-3 px-3 pt-2.5 pb-1.5">
        <div className="flex-shrink-0" style={{ width: 62 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: isCritical ? '#DC2626' : '#64748B', fontWeight: 600 }}>
            {sample.sampleNum}
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>{sample.receivedTime}</div>
          {sample.tat && (
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: isOverdue ? '#D97706' : '#94A3B8', marginTop: 1 }}>
              {sample.tat} TAT
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <div className="font-semibold text-slate-800" style={{ fontSize: 12 }}>{sample.patientName}</div>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400" style={{ fontSize: 9 }}>{sample.patientAge}{sample.patientGender}</span>
            {sample.priority === 'stat' && (
              <span className="px-1.5 py-0 rounded font-black" style={{ fontSize: 8, background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}>STAT</span>
            )}
            {sample.priority === 'urgent' && (
              <span className="px-1.5 py-0 rounded font-black" style={{ fontSize: 8, background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>URGENT</span>
            )}
          </div>

          {isCritical && sample.criticalValues ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {sample.criticalValues.map(cv => (
                <span key={cv.test} style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
                  {cv.test}: {cv.value} {cv.unit} {cv.flag}
                  {cv.refRange && <span style={{ fontSize: 9, color: '#FCA5A5', fontWeight: 400 }}> (ref {cv.refRange})</span>}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {sample.tests.map(t => (
                <span key={t} className="px-1.5 py-0 rounded" style={{ fontSize: 9, background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-1.5">
            {sample.department && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: deptAccent[sample.department] || '#4F46E5' }} />
                <span className="text-slate-400" style={{ fontSize: 9 }}>{sample.department}</span>
              </div>
            )}
            {sample.sampleType && (
              <span style={{ fontSize: 9, color: '#CBD5E1', fontFamily: 'DM Mono, monospace' }}>{sample.sampleType}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="px-2 py-0.5 rounded-full font-bold" style={{ fontSize: 9, background: statusStyle.bg, color: statusStyle.color }}>
            {statusLabel}
          </span>
          {isCritical && (
            <button
              className="px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
              style={{ background: '#DC2626', color: '#fff', fontSize: 9 }}
              onClick={e => e.stopPropagation()}
            >
              <Phone className="w-2.5 h-2.5" /> Notify
            </button>
          )}
          {isOverdue && !isCritical && (
            <span style={{ fontSize: 8, color: '#D97706', fontFamily: 'DM Mono, monospace' }}>TAT OVERDUE</span>
          )}
        </div>
      </div>

      {(isRunning || sample.status === 'received') && completedPct !== null && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-indigo-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${completedPct}%`, background: 'linear-gradient(90deg, #4F46E5, #818CF8)', transition: 'width 0.6s ease' }}
              />
            </div>
            <span style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>
              {sample.completedTests}/{sample.totalTests} tests
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ label: string; count: number; color: string; bg: string }> = ({ label, count, color, bg }) => (
  <div
    className="flex items-center gap-2 px-4 py-2"
    style={{ background: bg, borderBottom: `1px solid ${color}22` }}
  >
    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
    <span className="font-bold uppercase tracking-wider" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color }}>
      {label} ({count})
    </span>
  </div>
);

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
const DiagnosticsDashboard: React.FC<{ deptFilter: DeptFilter; onNavigate?: (page: string) => void }> = ({ deptFilter, onNavigate }) => {
  const [selectedStudy,  setSelectedStudy]  = useState<ImagingStudy | null>(null);
  const [modalityFilter, setModalityFilter] = useState<'all' | 'MRI' | 'CT' | 'USS' | 'XR' | 'PET'>('all');
  const [labDeptFilter,  setLabDeptFilter]  = useState<'all' | 'Chemistry' | 'Haematology' | 'Immunology' | 'Coagulation' | 'Microbiology'>('all');
  const [showMoreLab,    setShowMoreLab]    = useState(false);
  const [volumeTab,      setVolumeTab]      = useState<'both' | 'lab' | 'rad'>('both');

  const showLab = deptFilter !== 'radiology';
  const showRad = deptFilter !== 'lab';

  const scanning  = imagingStudies.filter(s => s.status === 'scanning');
  const pending   = imagingStudies.filter(s => s.status === 'report_pending' || s.status === 'report_overdue');
  const scheduled = imagingStudies.filter(s => s.status === 'scheduled');
  const applyMod  = (arr: ImagingStudy[]) => modalityFilter === 'all' ? arr : arr.filter(s => s.modality === modalityFilter);

  const filteredLab  = labDeptFilter === 'all' ? labSamples : labSamples.filter(s => s.department === labDeptFilter);
  const criticalSamp = filteredLab.filter(s => s.status === 'critical');
  const runningSamp  = filteredLab.filter(s => s.status === 'running');
  const pendingSamp  = filteredLab.filter(s => s.status === 'pending' || s.status === 'received');
  const resultedSamp = filteredLab.filter(s => s.status === 'resulted' || s.status === 'verified');

  const colHeight = 'calc(100vh - 310px)';

  return (
    <div className="flex-1 overflow-auto" style={{ background: '#F8FAFC' }}>
      <CriticalBanner />
      <KpiStrip deptFilter={deptFilter} />

      <div className="px-5 py-4 flex gap-4 min-w-0">

        {/* ── LAB COLUMN ── */}
        {showLab && (
          <div
            className="flex flex-col rounded-2xl overflow-hidden bg-white"
            style={{
              flex: showRad ? '0 0 38%' : '0 0 60%',
              minWidth: 0,
              height: colHeight,
              border: '1px solid #E2E8F0',
              borderTop: '3px solid #4F46E5',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div className="px-4 pt-3 pb-2 flex-shrink-0 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
                    <FlaskConical className="w-4 h-4 text-indigo-600" /> Lab Queue
                  </div>
                  <div className="text-slate-500" style={{ fontSize: 11 }}>
                    <span className="font-semibold text-red-500">{criticalSamp.length} critical</span>
                    {' · '}
                    <span className="text-indigo-600">{runningSamp.length} running</span>
                    {' · '}
                    <span>{pendingSamp.length} pending</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.('lab')}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  style={{ fontSize: 10 }}
                >
                  Lab Portal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {(['all', 'Chemistry', 'Haematology', 'Immunology', 'Coagulation', 'Microbiology'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setLabDeptFilter(f)}
                    className="px-2 py-0.5 rounded-lg font-semibold transition-all"
                    style={{
                      fontSize: 9,
                      background: labDeptFilter === f ? (deptAccent[f] || '#4F46E5') + '15' : '#F8FAFC',
                      color: labDeptFilter === f ? (deptAccent[f] || '#4F46E5') : '#94A3B8',
                      border: labDeptFilter === f ? `1px solid ${(deptAccent[f] || '#4F46E5')}30` : '1px solid #E2E8F0',
                    }}
                  >
                    {f === 'all' ? 'All Depts' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {criticalSamp.length > 0 && (
                <div>
                  <SectionHeader label="Critical — Unnotified" count={criticalSamp.length} color="#DC2626" bg="#FEF2F2" />
                  {criticalSamp.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}
              {runningSamp.length > 0 && (
                <div>
                  <SectionHeader label="Running" count={runningSamp.length} color="#4F46E5" bg="#EEF2FF" />
                  {runningSamp.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}
              {pendingSamp.length > 0 && (
                <div>
                  <SectionHeader label="Pending" count={pendingSamp.length} color="#1D4ED8" bg="#EFF6FF" />
                  {pendingSamp.map(s => <LabSampleRow key={s.id} sample={s} />)}
                </div>
              )}
              {resultedSamp.length > 0 && (
                <div>
                  <SectionHeader label="Resulted" count={resultedSamp.length} color="#16A34A" bg="#F0FDF4" />
                  {resultedSamp.slice(0, showMoreLab ? undefined : 3).map(s => <LabSampleRow key={s.id} sample={s} />)}
                  {!showMoreLab && resultedSamp.length > 3 && (
                    <button
                      onClick={() => setShowMoreLab(true)}
                      className="w-full py-2.5 flex items-center justify-center gap-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      style={{ fontSize: 11 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" /> {resultedSamp.length - 3} more resulted
                    </button>
                  )}
                </div>
              )}
              {filteredLab.length === 0 && (
                <div className="px-5 py-10 text-center text-slate-400" style={{ fontSize: 12 }}>
                  No samples for this department
                </div>
              )}
            </div>

            <div
              className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between"
              style={{ background: '#FEF2F2', borderTop: '1px solid #FECACA' }}
            >
              <div>
                <div className="font-bold text-red-600" style={{ fontSize: 11 }}>1 critical unnotified</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#FCA5A5' }}>
                  Ibrahim K⁺ 6.8 · 44 min elapsed
                </div>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                style={{ fontSize: 11 }}
              >
                <Phone className="w-3 h-3" /> Notify Now
              </button>
            </div>
          </div>
        )}

        {/* ── RADIOLOGY COLUMN ── */}
        {showRad && (
          <div
            className="flex flex-col rounded-2xl overflow-hidden bg-white"
            style={{
              flex: showLab ? '0 0 38%' : '0 0 60%',
              minWidth: 0,
              height: colHeight,
              border: '1px solid #E2E8F0',
              borderTop: '3px solid #1D4ED8',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div className="px-4 py-3 flex-shrink-0 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
                    <ScanLine className="w-4 h-4 text-blue-700" /> Imaging Queue
                  </div>
                  <div className="text-slate-500" style={{ fontSize: 11 }}>47 studies · 3 scanning now</div>
                </div>
                <button
                  className="px-2.5 py-1 rounded-lg font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  style={{ fontSize: 10 }}
                >
                  + New Study
                </button>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'MRI', 'CT', 'USS', 'XR', 'PET'] as const).map(m => {
                  const ma = m !== 'all' ? modalityAccent[m] : null;
                  return (
                    <button
                      key={m}
                      onClick={() => setModalityFilter(m)}
                      className="px-2 py-0.5 rounded-lg font-bold transition-all"
                      style={{
                        fontSize: 9,
                        background: modalityFilter === m ? (ma ? ma.bg : '#F1F5F9') : '#F8FAFC',
                        color: modalityFilter === m ? (ma ? ma.text : '#334155') : '#94A3B8',
                        border: modalityFilter === m ? `1px solid ${ma ? ma.border : '#CBD5E1'}` : '1px solid #E2E8F0',
                      }}
                    >
                      {m === 'all' ? 'All' : m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {applyMod(scanning).length > 0 && (
                <>
                  <SectionHeader label="Active Now" count={applyMod(scanning).length} color="#7C3AED" bg="#F5F3FF" />
                  {applyMod(scanning).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}
                </>
              )}
              {applyMod(pending).length > 0 && (
                <>
                  <SectionHeader label="Report Pending" count={applyMod(pending).length} color="#D97706" bg="#FFFBEB" />
                  {applyMod(pending).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}
                </>
              )}
              {applyMod(scheduled).length > 0 && (
                <>
                  <SectionHeader label="Scheduled Today" count={applyMod(scheduled).length} color="#1D4ED8" bg="#EFF6FF" />
                  {applyMod(scheduled).map(s => <ImagingStudyCard key={s.id} study={s} onClick={() => setSelectedStudy(s)} />)}
                </>
              )}
            </div>

            <div
              className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between"
              style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}
            >
              <span style={{ fontSize: 10, color: '#64748B' }}>
                <span className="font-semibold text-green-600">28 done</span>
                {' · '}
                <span className="text-amber-600">9 pending</span>
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>
                TAT <span className="font-bold text-blue-700">3.8h</span>
              </span>
              <span className="text-slate-400" style={{ fontSize: 10 }}>Dr. Rania: 9 queued</span>
            </div>
          </div>
        )}

        {/* ── RIGHT COLUMN ── */}
        <div
          className="overflow-y-auto space-y-3"
          style={{ flex: '1 1 0', minWidth: 220, maxWidth: 300, height: colHeight }}
        >
          {/* Equipment */}
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>Equipment</span>
              <button className="text-teal-600 hover:text-teal-800 transition-colors" style={{ fontSize: 10 }}>View All →</button>
            </div>
            <div className="p-3 space-y-0.5">
              <div className="uppercase tracking-widest mb-1.5 text-blue-700" style={{ fontSize: 8, fontFamily: 'DM Mono, monospace' }}>RADIOLOGY</div>
              {equipmentItems.radiology.map(e => {
                const dotColor = e.status === 'online' ? '#16A34A'
                  : e.status === 'scanning' || e.status === 'running' ? '#7C3AED'
                  : e.status === 'maintenance' ? '#DC2626'
                  : e.status === 'partial' ? '#D97706'
                  : '#1D4ED8';
                const infoColor = e.status === 'maintenance' ? '#DC2626'
                  : e.status === 'scanning' || e.status === 'running' ? '#7C3AED'
                  : '#94A3B8';
                return (
                  <div key={e.name} className="flex items-center gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                    <span className="flex-1 truncate text-slate-600" style={{ fontSize: 11 }}>{e.name}</span>
                    <span className="truncate" style={{ fontSize: 9, color: infoColor, maxWidth: 100, textAlign: 'right' }}>{e.info}</span>
                  </div>
                );
              })}
              <div className="my-2 border-t border-slate-100" />
              <div className="uppercase tracking-widest mb-1.5 text-indigo-600" style={{ fontSize: 8, fontFamily: 'DM Mono, monospace' }}>LABORATORY</div>
              {equipmentItems.lab.map(e => {
                const dotColor = e.status === 'online' ? '#16A34A'
                  : e.status === 'running' ? '#7C3AED'
                  : e.status === 'maintenance' ? '#DC2626'
                  : '#D97706';
                const infoColor = e.status === 'maintenance' ? '#DC2626'
                  : e.status === 'running' ? '#7C3AED'
                  : '#94A3B8';
                return (
                  <div key={e.name} className="flex items-center gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                    <span className="flex-1 truncate text-slate-600" style={{ fontSize: 11 }}>{e.name}</span>
                    <span className="truncate" style={{ fontSize: 9, color: infoColor, maxWidth: 100, textAlign: 'right' }}>{e.info}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TAT */}
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Turnaround Times
              </span>
            </div>
            <div className="px-3 pt-2 pb-3">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={tatData} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 6]} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, fontSize: 11, background: '#fff', border: '1px solid #E2E8F0', color: '#334155' }}
                    formatter={(v: number) => [`${v}h`, 'TAT']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={600}>
                    {tatData.map((e, i) => (
                      <Cell key={i} fill={e.value > e.target ? '#DC2626' : e.value > e.target * 0.92 ? '#D97706' : e.type === 'lab' ? '#4F46E5' : '#1D4ED8'} />
                    ))}
                  </Bar>
                  <ReferenceLine y={4} stroke="#C7D2FE" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={3} stroke="#BFDBFE" strokeDasharray="4 4" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 px-2 py-2 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div className="text-amber-600" style={{ fontSize: 10 }}>⚠ MRI TAT 4.8h vs 4h target — 9 in queue</div>
                <button className="mt-0.5 text-amber-500 hover:underline" style={{ fontSize: 10 }}>Escalate →</button>
              </div>
            </div>
          </div>

          {/* NABIDH */}
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
                <Upload className="w-3.5 h-3.5 text-violet-500" /> NABIDH
              </span>
              <span className="text-slate-400" style={{ fontSize: 10 }}>🇦🇪 FHIR R4</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Lab',       count: '42/47', pct: 89, color: '#4F46E5', bg: '#EEF2FF' },
                { label: 'Radiology', count: '25/28', pct: 89, color: '#1D4ED8', bg: '#EFF6FF' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-slate-500" style={{ fontSize: 11 }}>{r.label}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: r.color, fontWeight: 700 }}>{r.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: r.bg }}>
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
              <div style={{ paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                <div className="flex justify-between mb-2" style={{ fontSize: 11, color: '#64748B' }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: '#334155', fontWeight: 700 }}>67/75 · 8 pending</span>
                </div>
                <button
                  className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  style={{ background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', fontSize: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EDE9FE')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F5F3FF')}
                >
                  <Upload className="w-3.5 h-3.5" /> Submit Pending (8)
                </button>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>Volume Today</span>
              <div className="flex gap-0.5">
                {(['both', 'lab', 'rad'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setVolumeTab(k)}
                    className="px-2 py-0.5 rounded font-bold transition-all"
                    style={{ fontSize: 10, background: volumeTab === k ? '#F1F5F9' : 'transparent', color: volumeTab === k ? '#334155' : '#94A3B8' }}
                  >
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 pt-2 pb-1">
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={volumeData} margin={{ top: 2, right: 4, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="lg-lab" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lg-rad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1D4ED8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, fontSize: 11, background: '#fff', border: '1px solid #E2E8F0', color: '#334155' }}
                    animationDuration={100}
                  />
                  {(volumeTab === 'both' || volumeTab === 'lab') && (
                    <Area type="monotone" dataKey="lab" stroke="#4F46E5" strokeWidth={2} fill="url(#lg-lab)" name="Lab" dot={false} animationDuration={600} />
                  )}
                  {(volumeTab === 'both' || volumeTab === 'rad') && (
                    <Area type="monotone" dataKey="rad" stroke="#1D4ED8" strokeWidth={2} fill="url(#lg-rad)" name="Radiology" dot={false} animationDuration={600} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
              <div className="text-center py-1.5 font-bold text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                234 lab + 47 imaging = <span className="text-slate-700">281 total</span>
              </div>
            </div>
          </div>

          {/* Handoff */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="px-4 py-3 flex items-center gap-2 border-b border-amber-100">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-amber-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>
                Handoff in 53 min
              </span>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { icon: '⚠', text: '1 critical unnotified (Ibrahim)',  color: '#DC2626' },
                { icon: '⏳', text: '14 lab samples pending',           color: '#D97706' },
                { icon: '⏳', text: '9 reports pending radiologist',    color: '#D97706' },
                { icon: '⏳', text: 'PET-CT 3:30 PM (after shift)',     color: '#D97706' },
                { icon: '⚠', text: 'MRI TAT overdue — escalate',       color: '#DC2626' },
                { icon: '✓', text: 'QC logs complete',                  color: '#16A34A' },
              ].map(r => (
                <div key={r.text} className="flex items-center gap-2" style={{ fontSize: 11, color: r.color }}>
                  <span>{r.icon}</span>{r.text}
                </div>
              ))}
              <button
                className="w-full mt-2 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
                style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', fontSize: 12 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FDE68A')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FEF3C7')}
              >
                <Printer className="w-3.5 h-3.5" /> Generate Handoff Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedStudy && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(2px)' }}
            onClick={() => setSelectedStudy(null)}
          />
          <StudyDetailPanel study={selectedStudy} onClose={() => setSelectedStudy(null)} />
        </>
      )}
    </div>
  );
};

export default DiagnosticsDashboard;
