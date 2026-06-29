import React, { useState } from 'react';
import {
  X, User, Building2, FileText, Brain, CheckCircle2, XCircle,
  Shield, Clock, DollarSign, Copy, ChevronLeft, ChevronRight,
  AlertTriangle, Stethoscope, Flag,
} from 'lucide-react';
import type { PortalClaim } from '../../types/insurancePortal';

interface Props {
  claim: PortalClaim;
  allClaims: PortalClaim[];
  onClose: () => void;
  onNavigate: (claim: PortalClaim) => void;
  onDecision: (claimId: string, decision: 'APPROVED' | 'DENIED', note: string) => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

const statusColors: Record<string, { border: string; bg: string; text: string; chip: string; chipText: string }> = {
  AUTO_APPROVED: { border: '#0D9488', bg: '#F0FDFA', text: '#0D9488', chip: '#CCFBF1', chipText: '#0F766E' },
  APPROVED:      { border: '#059669', bg: '#F0FDF4', text: '#059669', chip: '#D1FAE5', chipText: '#065F46' },
  PENDING:       { border: '#D97706', bg: '#FFFBEB', text: '#D97706', chip: '#FEF3C7', chipText: '#92400E' },
  DENIED:        { border: '#EF4444', bg: '#FFF5F5', text: '#EF4444', chip: '#FEE2E2', chipText: '#991B1B' },
  APPEALED:      { border: '#7C3AED', bg: '#F5F3FF', text: '#7C3AED', chip: '#EDE9FE', chipText: '#5B21B6' },
  FRAUD_FLAGGED: { border: '#EA580C', bg: '#FFF7ED', text: '#EA580C', chip: '#FED7AA', chipText: '#C2410C' },
  ON_HOLD:       { border: '#64748B', bg: '#F8FAFC', text: '#64748B', chip: '#F1F5F9', chipText: '#475569' },
};

const statusLabel: Record<string, string> = {
  AUTO_APPROVED: 'Auto-Approved',
  APPROVED: 'Approved',
  PENDING: 'Pending Review',
  DENIED: 'Denied',
  APPEALED: 'Appealed',
  FRAUD_FLAGGED: 'Fraud Flagged',
  ON_HOLD: 'On Hold',
};

const planColors: Record<string, { bg: string; color: string }> = {
  Gold:   { bg: '#FEF9C3', color: '#713F12' },
  Silver: { bg: '#F1F5F9', color: '#334155' },
  Basic:  { bg: '#EFF6FF', color: '#1E40AF' },
  Thiqa:  { bg: '#F3E8FF', color: '#581C87' },
};

const ClaimDetailDrawer: React.FC<Props> = ({ claim, allClaims, onClose, onNavigate, onDecision, onToast }) => {
  const [decideNote, setDecideNote] = useState('');
  const [denyReason, setDenyReason] = useState('Not covered by plan');
  const [submitting, setSubmitting] = useState(false);

  const sc = statusColors[claim.status] ?? statusColors.ON_HOLD;
  const plan = planColors[claim.planType] ?? { bg: '#F8FAFC', color: '#475569' };
  const currentIdx = allClaims.findIndex(c => c.id === claim.id);
  const prevClaim = currentIdx > 0 ? allClaims[currentIdx - 1] : null;
  const nextClaim = currentIdx < allClaims.length - 1 ? allClaims[currentIdx + 1] : null;
  const usagePct = Math.round((claim.annualUsed / claim.annualLimit) * 100 * 10) / 10;

  const handleApprove = () => {
    setSubmitting(true);
    setTimeout(() => {
      onDecision(claim.id, 'APPROVED', decideNote || 'Approved by claims officer');
      setSubmitting(false);
    }, 600);
  };

  const handleDeny = () => {
    setSubmitting(true);
    setTimeout(() => {
      onDecision(claim.id, 'DENIED', denyReason);
      setSubmitting(false);
    }, 600);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    onToast(`Copied ${label}`, 'info');
  };

  return (
    <div className="flex flex-col h-full" style={{ width: 640, background: '#fff', borderLeft: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '14px 20px', background: '#0F2D4A', borderBottom: '1px solid #1E3A5F' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#93C5FD' }}>{claim.claimRef}</span>
            <span className="rounded px-2 py-0.5" style={{ background: sc.chip, color: sc.chipText, fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
              {statusLabel[claim.status]}
            </span>
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
            {claim.serviceName}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{claim.icd10} — {claim.icd10Description}</div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 transition-colors" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}>
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px 20px', gap: 14, display: 'flex', flexDirection: 'column' }}>

        {/* Section 1: Claim Summary */}
        <div className="rounded-xl p-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Claim Summary</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {[
              ['Claim ID', claim.claimRef, true],
              ['Submitted', `${claim.submittedDate}, ${claim.submittedAt}`, false],
              ['Processed', claim.processedAt ? `${claim.submittedDate}, ${claim.processedAt}` : '—', false],
              ['Turnaround', claim.turnaroundMins ? `${claim.turnaroundMins} minutes` : 'Pending', false],
              ['Method', claim.status === 'AUTO_APPROVED' ? 'AI Auto-Approved' : 'Manual Review', false],
              ['AI Confidence', claim.aiConfidence ? `${claim.aiConfidence}%` : '—', false],
            ].map(([label, value, copyable]) => (
              <div key={label as string}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{label as string}</div>
                <div className="flex items-center gap-1">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#1E40AF' }}>{value as string}</span>
                  {copyable && (
                    <button onClick={() => copyToClipboard(value as string, 'Claim ID')} style={{ color: '#94A3B8' }}>
                      <Copy style={{ width: 10, height: 10 }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Patient & Policy */}
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <User style={{ width: 12, height: 12, color: '#2563EB' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Patient &amp; Policy</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #0D9488)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{claim.patientInitials}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{claim.patientName}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{claim.patientAge} years · {claim.patientGender === 'M' ? 'Male' : 'Female'}{claim.patientNationality ? ` · ${claim.patientNationality}` : ''}</div>
              <span className="rounded px-2 py-0.5 inline-block mt-1" style={{ background: plan.bg, color: plan.color, fontSize: 10, fontWeight: 700 }}>
                Daman {claim.planType}
              </span>
            </div>
          </div>
          {claim.allergies && claim.allergies.length > 0 && (
            <div className="rounded-lg px-3 py-2 mb-3 flex items-start gap-2" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
              <AlertTriangle style={{ width: 11, height: 11, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: '#991B1B', fontWeight: 600 }}>
                Allergies: {claim.allergies.join(' · ')}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-y-2.5">
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Policy Number</div>
              <div className="flex items-center gap-1">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>{claim.policyNumber}</span>
                <button onClick={() => copyToClipboard(claim.policyNumber, 'Policy #')} style={{ color: '#94A3B8' }}>
                  <Copy style={{ width: 9, height: 9 }} />
                </button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Co-pay Rate</div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>{claim.copayPercent}%</span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Annual Limit</div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>AED {claim.annualLimit.toLocaleString()}</span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Remaining</div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#059669' }}>
                AED {(claim.annualLimit - claim.annualUsed).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: 10, color: '#94A3B8' }}>Annual usage</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>
                AED {claim.annualUsed.toLocaleString()} / {claim.annualLimit.toLocaleString()} ({usagePct}%)
              </span>
            </div>
            <div className="rounded-full" style={{ height: 4, background: '#F1F5F9' }}>
              <div className="rounded-full" style={{ height: 4, width: `${Math.min(100, usagePct)}%`, background: '#0D9488' }} />
            </div>
          </div>
        </div>

        {/* Section 3: Provider & Service */}
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Stethoscope style={{ width: 12, height: 12, color: '#0D9488' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Provider &amp; Service</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{claim.doctorName}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{claim.doctorSpecialty}</div>
              {claim.doctorDha && (
                <div className="flex items-center gap-1 mb-1">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#0D9488' }}>{claim.doctorDha}</span>
                  <span style={{ fontSize: 9, color: '#059669' }}>✅ DHA</span>
                </div>
              )}
              {claim.inNetwork && <span style={{ fontSize: 9, color: '#059669', fontWeight: 600 }}>✅ In-Network</span>}
              {claim.providerFraudFlag && (
                <div className="flex items-center gap-1 mt-1">
                  <Flag style={{ width: 9, height: 9, color: '#EA580C' }} />
                  <span style={{ fontSize: 9, color: '#EA580C', fontWeight: 700 }}>Fraud investigation active</span>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 2 }}>{claim.facilityName}</div>
              {claim.facilityDha && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>{claim.facilityDha} ✅</span>
              )}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{claim.serviceName}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>ICD-10</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2563EB' }}>{claim.icd10} — {claim.icd10Description}</span>
              </div>
              {claim.cpt && (
                <div>
                  <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>CPT</div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#475569' }}>{claim.cpt}</span>
                </div>
              )}
              {claim.visitDate && (
                <div>
                  <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>Visit Date</div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>{claim.visitDate}</span>
                </div>
              )}
              {claim.paRef && (
                <div>
                  <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>Pre-Auth</div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#0D9488', fontWeight: 700 }}>{claim.paRef.slice(-5)} ✅</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Financial Breakdown */}
        <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <DollarSign style={{ width: 12, height: 12, color: '#059669' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Financial Breakdown</span>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between">
              <span style={{ fontSize: 12, color: '#64748B' }}>Consultation fee (gross)</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>AED {claim.grossAmount.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 6 }} className="flex justify-between">
              <span style={{ fontSize: 12, color: '#64748B' }}>Daman {claim.planType} coverage ({100 - claim.copayPercent}%)</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#059669' }}>−AED {claim.damanPays.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 12, color: '#64748B' }}>Patient co-pay ({claim.copayPercent}%)</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#D97706' }}>AED {claim.copayAmount.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: 8, marginTop: 4 }}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>DAMAN LIABILITY</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 800, color: '#059669' }}>AED {claim.damanPays.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>PATIENT LIABILITY</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700, color: '#D97706' }}>AED {claim.copayAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: claim.copayCollected ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${claim.copayCollected ? '#86EFAC' : '#FDE68A'}` }}>
            <span style={{ fontSize: 11, color: claim.copayCollected ? '#065F46' : '#92400E', fontWeight: 600 }}>
              {claim.copayCollected
                ? `Co-pay of AED ${claim.copayAmount} collected ✅`
                : `Co-pay of AED ${claim.copayAmount} — pending collection at visit`}
            </span>
          </div>
          {claim.paymentStatus !== 'Denied' && claim.damanPays > 0 && (
            <div className="mt-2 rounded-lg px-3 py-2" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: 11, color: '#065F46' }}>
                {claim.paymentStatus === 'Batch tonight'
                  ? `Daman payment of AED ${claim.damanPays} to ${claim.facilityName} — batch tonight at 11 PM`
                  : claim.paymentStatus === 'Paid'
                    ? `Paid ✅ to ${claim.facilityName}`
                    : `Payment status: ${claim.paymentStatus}`}
              </span>
            </div>
          )}
        </div>

        {/* Section 5: AI Audit Trail */}
        {claim.aiAuditLog && claim.aiAuditLog.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: '#F5F3FF', borderLeft: '4px solid #7C3AED', border: '1px solid #DDD6FE' }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain style={{ width: 14, height: 14, color: '#7C3AED' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>AI Decision Audit Trail</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#8B5CF6' }}>claude-sonnet · {claim.aiConfidence}% confidence</span>
            </div>
            <div className="space-y-1.5">
              {claim.aiAuditLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#8B5CF6', flexShrink: 0, minWidth: 90 }}>{entry.time}</span>
                  <span style={{ fontSize: 11, color: '#4C1D95' }}>{entry.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Denial/Fraud info */}
        {(claim.denialReason || claim.fraudReason || claim.reviewReason) && (
          <div className="rounded-xl p-4" style={{ background: claim.status === 'FRAUD_FLAGGED' ? '#FFF7ED' : claim.status === 'DENIED' ? '#FFF5F5' : '#FFFBEB', border: `1px solid ${claim.status === 'FRAUD_FLAGGED' ? '#FED7AA' : claim.status === 'DENIED' ? '#FCA5A5' : '#FDE68A'}` }}>
            <div className="flex items-center gap-1.5 mb-2">
              {claim.status === 'FRAUD_FLAGGED' ? <Flag style={{ width: 12, height: 12, color: '#EA580C' }} /> : <AlertTriangle style={{ width: 12, height: 12, color: claim.status === 'DENIED' ? '#DC2626' : '#D97706' }} />}
              <span style={{ fontSize: 11, fontWeight: 700, color: claim.status === 'FRAUD_FLAGGED' ? '#C2410C' : claim.status === 'DENIED' ? '#991B1B' : '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {claim.status === 'FRAUD_FLAGGED' ? 'Fraud Flag' : claim.status === 'DENIED' ? 'Denial Reason' : 'Review Reason'}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              {claim.fraudReason || claim.denialReason || claim.reviewReason}
            </p>
          </div>
        )}

        {/* Section 6: EOB */}
        <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <FileText style={{ width: 12, height: 12, color: '#2563EB' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Explanation of Benefits</span>
          </div>
          {claim.eobGenerated ? (
            <>
              <div className="rounded-lg p-3 mb-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1E40AF', textAlign: 'center', marginBottom: 6 }}>DAMAN NATIONAL HEALTH INSURANCE</div>
                <div style={{ fontSize: 10, color: '#64748B', textAlign: 'center', marginBottom: 8 }}>Explanation of Benefits</div>
                <div className="grid grid-cols-2 gap-1" style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#475569' }}>
                  <span>Patient:</span><span>{claim.patientName}</span>
                  <span>Member:</span><span>{claim.policyNumber}</span>
                  <span>Date of service:</span><span>{claim.submittedDate}</span>
                  <span>Provider:</span><span>{claim.doctorName}</span>
                  <span>Service:</span><span>{claim.serviceName.slice(0, 28)}</span>
                  <span>Billed:</span><span style={{ color: '#0F172A', fontWeight: 700 }}>AED {claim.grossAmount}</span>
                  <span>Daman pays:</span><span style={{ color: '#059669', fontWeight: 700 }}>AED {claim.damanPays}</span>
                  <span>Patient owes:</span><span style={{ color: '#D97706', fontWeight: 700 }}>AED {claim.copayAmount}</span>
                </div>
                <div className="mt-3 text-center" style={{ fontSize: 11, color: claim.status === 'DENIED' ? '#DC2626' : '#059669', fontWeight: 700 }}>
                  {claim.status === 'DENIED' ? 'Claim denied ❌' : 'Claim approved ✅'}
                </div>
              </div>
              <button
                onClick={() => onToast(`EOB downloading — ${claim.shortRef}`, 'info')}
                className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 mb-2 transition-colors"
                style={{ background: '#1E3A5F', color: '#fff', fontSize: 13, fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0F2D4A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1E3A5F'; }}
              >
                Download EOB PDF
              </button>
              <button
                onClick={() => onToast(`EOB emailed to patient · ${claim.shortRef}`, 'success')}
                className="w-full rounded-lg py-2 flex items-center justify-center gap-2 mb-1.5 transition-colors"
                style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 12 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
              >
                Email EOB to Patient
              </button>
              <button
                onClick={() => onToast(`EOB emailed to ${claim.facilityName}`, 'success')}
                className="w-full rounded-lg py-2 flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 12 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
              >
                Email EOB to Provider
              </button>
            </>
          ) : (
            <div className="rounded-lg p-3 text-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>EOB not yet generated — claim pending decision</span>
            </div>
          )}
        </div>

        {/* Section 7: Decision (pending only) */}
        {claim.status === 'PENDING' && (
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle2 style={{ width: 12, height: 12, color: '#059669' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Make Decision</span>
            </div>
            <textarea
              value={decideNote}
              onChange={e => setDecideNote(e.target.value)}
              rows={2}
              placeholder="Optional approval note..."
              className="w-full rounded-lg px-3 py-2 resize-none outline-none mb-2"
              style={{ fontSize: 12, background: '#fff', border: '1px solid #86EFAC', color: '#0F172A' }}
            />
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 mb-2 transition-colors"
              style={{ background: submitting ? '#94A3B8' : '#059669', color: '#fff', fontSize: 13, fontWeight: 700 }}
            >
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              {submitting ? 'Processing...' : `Approve — AED ${claim.damanPays} to ${claim.facilityName}`}
            </button>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select value={denyReason} onChange={e => setDenyReason(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 outline-none appearance-none"
                  style={{ fontSize: 12, background: '#FFF5F5', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                  {['Not covered by plan','No pre-authorization','Duplicate claim','Incomplete documentation','Provider not in network','Limit exceeded'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDeny}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 transition-colors"
                style={{ background: submitting ? '#94A3B8' : '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: 12, fontWeight: 700, flexShrink: 0 }}
              >
                <XCircle style={{ width: 12, height: 12 }} />
                Deny
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '10px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast(`EOB downloading — ${claim.shortRef}`, 'info')}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{ background: '#F1F5F9', color: '#475569', fontSize: 11, border: '1px solid #E2E8F0' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
          >
            <FileText style={{ width: 11, height: 11 }} /> EOB
          </button>
          <button
            onClick={() => onToast(`${claim.shortRef} flagged for investigation`, 'warning')}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{ background: '#FFF7ED', color: '#EA580C', fontSize: 11, border: '1px solid #FED7AA' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEE7C7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFF7ED'; }}
          >
            <Flag style={{ width: 11, height: 11 }} /> Flag
          </button>
          <div className="flex items-center gap-1" style={{ fontSize: 10, color: '#94A3B8' }}>
            <Shield style={{ width: 10, height: 10 }} />
            DHA auditable
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevClaim && onNavigate(prevClaim)}
            disabled={!prevClaim}
            className="flex items-center gap-0.5 px-2 py-1 rounded transition-colors"
            style={{ fontSize: 11, color: prevClaim ? '#2563EB' : '#CBD5E1' }}
          >
            <ChevronLeft style={{ width: 12, height: 12 }} /> Prev
          </button>
          <span style={{ fontSize: 10, color: '#CBD5E1' }}>|</span>
          <button
            onClick={() => nextClaim && onNavigate(nextClaim)}
            disabled={!nextClaim}
            className="flex items-center gap-0.5 px-2 py-1 rounded transition-colors"
            style={{ fontSize: 11, color: nextClaim ? '#2563EB' : '#CBD5E1' }}
          >
            Next <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailDrawer;
