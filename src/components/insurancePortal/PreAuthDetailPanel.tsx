import React, { useState } from 'react';
import {
  X, User, Building2, FileText, Brain, CheckCircle2,
  XCircle, MessageSquare, ChevronDown, Clock, Shield,
  AlertTriangle, Stethoscope, DollarSign,
} from 'lucide-react';
import type { PreAuthRequest } from '../../types/insurancePortal';

interface Props {
  pa: PreAuthRequest;
  onClose: () => void;
  onDecision: (paId: string, decision: 'APPROVED' | 'DENIED', note: string) => void;
}

type DecisionMode = 'none' | 'approve' | 'deny' | 'info';

const DENY_REASONS = [
  'Not clinically indicated',
  'Excluded benefit under plan',
  'Step-therapy not completed',
  'Missing required documentation',
  'Experimental / investigational procedure',
  'Duplicate request',
  'Other',
];

const INFO_ITEMS = [
  'Echocardiography report',
  'Stress test / nuclear imaging',
  'Previous imaging (CT/MRI)',
  'Specialist referral letter',
  'Tumor board / MDT report',
  'STS risk score',
  'DLQI / PASI score',
  'Conservative care documentation',
  'Lab results (HbA1c, CBC, LFT)',
  'Surgical risk assessment',
];

const SlaBar: React.FC<{ req: PreAuthRequest }> = ({ req }) => {
  const total = req.slaHours * 60;
  const pct = req.slaRemainingMinutes < 0 ? 0 : Math.min(100, (req.slaRemainingMinutes / total) * 100);
  const isOverdue = req.slaRemainingMinutes < 0;
  const color = isOverdue ? '#DC2626' : pct < 20 ? '#D97706' : '#059669';
  const hrs = Math.abs(Math.floor(req.slaRemainingMinutes / 60));
  const mins = Math.abs(req.slaRemainingMinutes % 60);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 11, color: '#94A3B8' }}>SLA remaining</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color }}>
          {isOverdue ? `+${hrs}h ${mins}m overdue` : `${hrs}h ${mins}m left`}
        </span>
      </div>
      <div className="w-full rounded-full" style={{ height: 5, background: '#F1F5F9' }}>
        <div className="rounded-full transition-all" style={{ height: 5, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const AiBadge: React.FC<{ rec: string; confidence: number }> = ({ rec, confidence }) => {
  const cfg = {
    APPROVE: { bg: '#DCFCE7', color: '#065F46', border: '#86EFAC', label: 'AI: APPROVE' },
    DENY:    { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', label: 'AI: DENY' },
    REVIEW:  { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', label: 'AI: REVIEW' },
  }[rec] ?? { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', label: rec };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700 }}
    >
      <Brain style={{ width: 11, height: 11 }} />
      {cfg.label} · {confidence}%
    </span>
  );
};

const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const cfg: Record<string, { bg: string; color: string }> = {
    Gold:   { bg: '#FEF9C3', color: '#713F12' },
    Silver: { bg: '#F1F5F9', color: '#334155' },
    Basic:  { bg: '#EFF6FF', color: '#1E40AF' },
    Thiqa:  { bg: '#F3E8FF', color: '#581C87' },
  };
  const c = cfg[plan] ?? { bg: '#F8FAFC', color: '#475569' };
  return (
    <span className="rounded px-2 py-0.5" style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
      {plan}
    </span>
  );
};

const PreAuthDetailPanel: React.FC<Props> = ({ pa, onClose, onDecision }) => {
  const [mode, setMode] = useState<DecisionMode>('none');
  const [validity, setValidity] = useState('30');
  const [approveNote, setApproveNote] = useState('');
  const [denyReason, setDenyReason] = useState(DENY_REASONS[0]);
  const [denyNote, setDenyNote] = useState('');
  const [infoItems, setInfoItems] = useState<string[]>([]);
  const [infoNote, setInfoNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = () => {
    setSubmitting(true);
    setTimeout(() => {
      onDecision(pa.id, 'APPROVED', approveNote || `Approved. Auth valid ${validity} days.`);
      setSubmitting(false);
    }, 600);
  };

  const handleDeny = () => {
    setSubmitting(true);
    setTimeout(() => {
      onDecision(pa.id, 'DENIED', `${denyReason}. ${denyNote}`);
      setSubmitting(false);
    }, 600);
  };

  const handleInfoRequest = () => {
    setSubmitting(true);
    setTimeout(() => {
      onDecision(pa.id, 'DENIED', `Info requested: ${infoItems.join(', ')}. ${infoNote}`);
      setSubmitting(false);
    }, 600);
  };

  const toggleInfo = (item: string) =>
    setInfoItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const priorityAccent: Record<string, string> = {
    OVERDUE: '#DC2626', URGENT: '#D97706', HIGH: '#3B82F6', STANDARD: '#64748B',
  };
  const accent = priorityAccent[pa.priority] ?? '#64748B';

  return (
    <div
      className="flex flex-col h-full"
      style={{ width: 680, background: '#fff', borderLeft: '1px solid #E2E8F0', overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between flex-shrink-0"
        style={{ padding: '18px 22px 16px', borderBottom: '1px solid #E2E8F0', background: '#0F172A' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>
              {pa.paRef}
            </span>
            <PlanBadge plan={pa.planType} />
            <span
              className="rounded px-2 py-0.5"
              style={{ fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono, monospace', background: accent + '22', color: accent }}
            >
              {pa.priority}
            </span>
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
            {pa.procedure}
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 3 }}>
            {pa.icd10} — {pa.icd10Description}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 flex-shrink-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <X style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '18px 22px' }}>

        {/* SLA + AI row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <SlaBar req={pa} />
          </div>
          <div className="rounded-lg p-3 flex items-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <AiBadge rec={pa.aiRecommendation} confidence={pa.aiConfidence} />
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="rounded-lg p-3 mb-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Brain style={{ width: 12, height: 12, color: '#D97706' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Clinical Reasoning
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>{pa.aiReason}</p>
        </div>

        {/* Patient + Doctor grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <User style={{ width: 12, height: 12, color: '#2563EB' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>{pa.patientName}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{pa.patientGender === 'M' ? 'Male' : 'Female'}, {pa.patientAge} yrs · {pa.patientId}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{pa.policyNumber}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Stethoscope style={{ width: 12, height: 12, color: '#0D9488' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>{pa.doctorName}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{pa.clinicName}</div>
          </div>
        </div>

        {/* Financials */}
        <div className="rounded-lg p-3 mb-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <DollarSign style={{ width: 12, height: 12, color: '#059669' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financials</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Estimated Cost</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                AED {pa.estimatedCost.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Coverage</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 800, color: pa.coveragePercent > 0 ? '#059669' : '#DC2626' }}>
                {pa.coveragePercent}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Daman Liability</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 800, color: '#2563EB' }}>
                AED {Math.round(pa.estimatedCost * pa.coveragePercent / 100).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Timing */}
        <div className="rounded-lg p-3 mb-5" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Clock style={{ width: 12, height: 12, color: '#7C3AED' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Submitted</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#475569' }}>
                {pa.submittedAt} · Today
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Response Due</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: pa.slaRemainingMinutes < 0 ? '#DC2626' : '#475569' }}>
                {pa.responseDueAt}
              </div>
            </div>
          </div>
        </div>

        {/* Decision buttons — only shown when no mode selected */}
        {mode === 'none' && (
          <div className="flex gap-2">
            <button
              onClick={() => setMode('approve')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors"
              style={{ background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
            >
              <CheckCircle2 style={{ width: 15, height: 15 }} />
              Approve
            </button>
            <button
              onClick={() => setMode('deny')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors"
              style={{ background: '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
            >
              <XCircle style={{ width: 15, height: 15 }} />
              Deny
            </button>
            <button
              onClick={() => setMode('info')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors"
              style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            >
              <MessageSquare style={{ width: 15, height: 15 }} />
              Request Info
            </button>
          </div>
        )}

        {/* Approve form */}
        {mode === 'approve' && (
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 style={{ width: 14, height: 14, color: '#059669' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>Approve Pre-Authorization</span>
              </div>
              <button onClick={() => setMode('none')} style={{ fontSize: 11, color: '#94A3B8' }}>Cancel</button>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#065F46', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Authorization Validity (days)
              </label>
              <select
                value={validity}
                onChange={e => setValidity(e.target.value)}
                className="w-full rounded-lg px-3 py-2 outline-none"
                style={{ fontSize: 12, background: '#fff', border: '1px solid #86EFAC', color: '#0F172A', fontFamily: 'DM Mono, monospace' }}
              >
                {['7','14','30','60','90','180'].map(v => (
                  <option key={v} value={v}>{v} days</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#065F46', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Approval Note (optional)
              </label>
              <textarea
                value={approveNote}
                onChange={e => setApproveNote(e.target.value)}
                rows={3}
                placeholder="Add clinical approval notes..."
                className="w-full rounded-lg px-3 py-2 resize-none outline-none"
                style={{ fontSize: 12, background: '#fff', border: '1px solid #86EFAC', color: '#0F172A' }}
              />
            </div>
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              style={{ background: submitting ? '#94A3B8' : '#059669', color: '#fff', fontSize: 13, fontWeight: 700 }}
            >
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              {submitting ? 'Processing...' : 'Confirm Approval'}
            </button>
          </div>
        )}

        {/* Deny form */}
        {mode === 'deny' && (
          <div className="rounded-xl p-4" style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <XCircle style={{ width: 14, height: 14, color: '#DC2626' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>Deny Pre-Authorization</span>
              </div>
              <button onClick={() => setMode('none')} style={{ fontSize: 11, color: '#94A3B8' }}>Cancel</button>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#991B1B', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Denial Reason
              </label>
              <div className="relative">
                <select
                  value={denyReason}
                  onChange={e => setDenyReason(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 outline-none appearance-none pr-8"
                  style={{ fontSize: 12, background: '#fff', border: '1px solid #FCA5A5', color: '#0F172A' }}
                >
                  {DENY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#94A3B8', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#991B1B', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Additional Notes
              </label>
              <textarea
                value={denyNote}
                onChange={e => setDenyNote(e.target.value)}
                rows={3}
                placeholder="Clinical rationale for denial..."
                className="w-full rounded-lg px-3 py-2 resize-none outline-none"
                style={{ fontSize: 12, background: '#fff', border: '1px solid #FCA5A5', color: '#0F172A' }}
              />
            </div>
            <div className="rounded-lg p-2.5 mb-3 flex items-start gap-2" style={{ background: '#FEE2E2' }}>
              <AlertTriangle style={{ width: 12, height: 12, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: '#991B1B' }}>
                A denial letter will be automatically generated and sent to the provider and patient.
              </span>
            </div>
            <button
              onClick={handleDeny}
              disabled={submitting}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              style={{ background: submitting ? '#94A3B8' : '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700 }}
            >
              <XCircle style={{ width: 14, height: 14 }} />
              {submitting ? 'Processing...' : 'Confirm Denial'}
            </button>
          </div>
        )}

        {/* Request Info form */}
        {mode === 'info' && (
          <div className="rounded-xl p-4" style={{ background: '#EFF6FF', border: '1px solid #93C5FD' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare style={{ width: 14, height: 14, color: '#2563EB' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>Request Additional Information</span>
              </div>
              <button onClick={() => setMode('none')} style={{ fontSize: 11, color: '#94A3B8' }}>Cancel</button>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#1E40AF', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Documents required
              </label>
              <div className="space-y-1.5">
                {INFO_ITEMS.map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={infoItems.includes(item)}
                      onChange={() => toggleInfo(item)}
                      className="rounded"
                      style={{ accentColor: '#2563EB' }}
                    />
                    <span style={{ fontSize: 12, color: '#334155' }}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 11, color: '#1E40AF', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Additional Message
              </label>
              <textarea
                value={infoNote}
                onChange={e => setInfoNote(e.target.value)}
                rows={3}
                placeholder="Additional instructions to the provider..."
                className="w-full rounded-lg px-3 py-2 resize-none outline-none"
                style={{ fontSize: 12, background: '#fff', border: '1px solid #93C5FD', color: '#0F172A' }}
              />
            </div>
            <button
              onClick={handleInfoRequest}
              disabled={submitting || infoItems.length === 0}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              style={{ background: submitting || infoItems.length === 0 ? '#94A3B8' : '#2563EB', color: '#fff', fontSize: 13, fontWeight: 700 }}
            >
              <MessageSquare style={{ width: 14, height: 14 }} />
              {submitting ? 'Sending...' : `Send Request (${infoItems.length} items)`}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ padding: '12px 22px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}
      >
        <div className="flex items-center gap-2">
          <Shield style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>All decisions are logged and auditable per DHA guidelines</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{pa.paRef}</span>
        </div>
      </div>
    </div>
  );
};

export default PreAuthDetailPanel;
