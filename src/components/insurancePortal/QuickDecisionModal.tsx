import React, { useState } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import type { PortalClaim } from '../../types/insurancePortal';

interface Props {
  claim: PortalClaim;
  type: 'approve' | 'deny';
  onClose: () => void;
  onConfirm: (claimId: string, decision: 'APPROVED' | 'DENIED', note: string) => void;
}

const DENY_REASONS = [
  'Not covered by plan',
  'No pre-authorization',
  'Duplicate claim',
  'Incomplete documentation',
  'Provider not in network',
  'Limit exceeded',
  'Other',
];

const planColors: Record<string, { bg: string; color: string }> = {
  Gold:   { bg: '#FEF9C3', color: '#713F12' },
  Silver: { bg: '#F1F5F9', color: '#334155' },
  Basic:  { bg: '#EFF6FF', color: '#1E40AF' },
  Thiqa:  { bg: '#F3E8FF', color: '#581C87' },
};

const QuickDecisionModal: React.FC<Props> = ({ claim, type, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  const [reason, setReason] = useState(DENY_REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const plan = planColors[claim.planType] ?? { bg: '#F8FAFC', color: '#475569' };

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      onConfirm(claim.id, type === 'approve' ? 'APPROVED' : 'DENIED', type === 'approve' ? (note || 'Approved') : reason);
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center" style={{ background: 'rgba(15,45,74,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl overflow-hidden" style={{ width: 400, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '14px 18px', background: type === 'approve' ? '#F0FDF4' : '#FFF5F5', borderBottom: `1px solid ${type === 'approve' ? '#86EFAC' : '#FCA5A5'}` }}>
          <div className="flex items-center gap-2">
            {type === 'approve'
              ? <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} />
              : <XCircle style={{ width: 16, height: 16, color: '#DC2626' }} />}
            <span style={{ fontSize: 14, fontWeight: 700, color: type === 'approve' ? '#065F46' : '#991B1B' }}>
              {type === 'approve' ? 'Approve Claim?' : 'Deny Claim?'}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 transition-colors" style={{ color: '#94A3B8' }}>
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>

        <div style={{ padding: '14px 18px' }}>
          {/* Claim summary */}
          <div className="rounded-lg p-3 mb-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2563EB' }}>{claim.shortRef}</span>
              <span className="rounded px-2 py-0.5" style={{ background: plan.bg, color: plan.color, fontSize: 10, fontWeight: 700 }}>
                Daman {claim.planType}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{claim.patientName}</div>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>{claim.serviceName}</div>
            <div className="grid grid-cols-3 gap-3" style={{ borderTop: '1px solid #BFDBFE', paddingTop: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>Gross</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>AED {claim.grossAmount}</span>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>Daman pays</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#059669' }}>AED {claim.damanPays}</span>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 1 }}>Co-pay</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#D97706' }}>AED {claim.copayAmount}</span>
              </div>
            </div>
          </div>

          {type === 'approve' ? (
            <div className="mb-4">
              <label style={{ fontSize: 11, color: '#065F46', fontWeight: 600, display: 'block', marginBottom: 4 }}>Approval Note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add note..."
                className="w-full rounded-lg px-3 py-2 resize-none outline-none"
                style={{ fontSize: 12, background: '#F0FDF4', border: '1px solid #86EFAC', color: '#0F172A' }} />
            </div>
          ) : (
            <div className="mb-4">
              <label style={{ fontSize: 11, color: '#991B1B', fontWeight: 600, display: 'block', marginBottom: 4 }}>Denial Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)}
                className="w-full rounded-lg px-3 py-2 outline-none appearance-none mb-2"
                style={{ fontSize: 12, background: '#FFF5F5', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                {DENY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {reason === 'Other' && (
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Specify reason..." required
                  className="w-full rounded-lg px-3 py-2 resize-none outline-none"
                  style={{ fontSize: 12, background: '#FFF5F5', border: '1px solid #FCA5A5', color: '#0F172A' }} />
              )}
            </div>
          )}

          <button onClick={handleConfirm} disabled={submitting || (type === 'deny' && reason === 'Other' && !note.trim())}
            className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 mb-2 transition-colors"
            style={{
              background: submitting ? '#94A3B8' : type === 'approve' ? '#059669' : '#DC2626',
              color: '#fff', fontSize: 13, fontWeight: 700,
            }}>
            {type === 'approve' ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <XCircle style={{ width: 14, height: 14 }} />}
            {submitting ? 'Processing...' : type === 'approve' ? 'Confirm Approval' : 'Confirm Denial'}
          </button>
          <button onClick={onClose} className="w-full rounded-xl py-2 transition-colors"
            style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', fontSize: 13 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickDecisionModal;
