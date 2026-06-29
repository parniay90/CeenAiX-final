import React, { useState } from 'react';
import { X, Scale, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { PortalClaim } from '../../types/insurancePortal';

interface Props {
  claim: PortalClaim;
  onClose: () => void;
  onUphold: (claimId: string) => void;
  onDismiss: (claimId: string, reason: string) => void;
}

const AppealReviewModal: React.FC<Props> = ({ claim, onClose, onUphold, onDismiss }) => {
  const [notes, setNotes] = useState('Reviewing both SOAP notes — different presenting complaints confirmed in documentation.');
  const [dismissReason, setDismissReason] = useState('');
  const [showDismiss, setShowDismiss] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dayColor = (days?: number) => {
    if (!days) return '#64748B';
    if (days <= 7) return '#DC2626';
    if (days <= 14) return '#D97706';
    return '#059669';
  };

  const handleUphold = () => {
    setSubmitting(true);
    setTimeout(() => { onUphold(claim.id); setSubmitting(false); }, 700);
  };

  const handleDismiss = () => {
    if (!dismissReason.trim()) return;
    setSubmitting(true);
    setTimeout(() => { onDismiss(claim.id, dismissReason); setSubmitting(false); }, 700);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center" style={{ background: 'rgba(15,45,74,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ width: 600, maxHeight: '88vh', background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '16px 20px', background: '#5B21B6', borderBottom: '1px solid #6D28D9' }}>
          <div className="flex items-center gap-2">
            <Scale style={{ width: 16, height: 16, color: '#DDD6FE' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Appeal Review</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#C4B5FD' }}>{claim.claimRef}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors" style={{ background: 'rgba(255,255,255,0.1)', color: '#DDD6FE' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Appeal summary */}
          <div className="rounded-xl p-4" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div style={{ fontSize: 10, color: '#8B5CF6', marginBottom: 1 }}>Filed</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#4C1D95' }}>{claim.appealFiledAt}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#8B5CF6', marginBottom: 1 }}>Filed by</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4C1D95' }}>{claim.appealFiledBy}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#8B5CF6', marginBottom: 1 }}>Deadline</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#4C1D95' }}>{claim.appealDeadline}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#8B5CF6', marginBottom: 1 }}>Days Remaining</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 800, color: dayColor(claim.appealDaysRemaining) }}>
                  {claim.appealDaysRemaining} days
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#8B5CF6', marginBottom: 4 }}>Appeal Reason</div>
              <p style={{ fontSize: 12, color: '#4C1D95', lineHeight: 1.6, fontStyle: 'italic' }}>"{claim.appealReason}"</p>
            </div>
          </div>

          {/* Original denial */}
          <div className="rounded-xl p-4" style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', marginBottom: 6 }}>ORIGINAL DENIAL</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Claim</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#DC2626' }}>{claim.claimRef}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 1 }}>Amount denied</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 800, color: '#DC2626' }}>AED {claim.damanPays}</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#991B1B' }}>{claim.denialReason}</p>
          </div>

          {/* Docs */}
          <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 8 }}>SUPPORTING DOCUMENTS</div>
            {["Doctor's letter confirming different clinical episode", 'April 7 SOAP notes (distinct from April 1)', "Patient's written appeal"].map(doc => (
              <div key={doc} className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 style={{ width: 11, height: 11, color: '#059669', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>{doc}</span>
              </div>
            ))}
          </div>

          {/* Medical director notes */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Medical Director Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg px-3 py-2 resize-none outline-none"
              style={{ fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
            />
          </div>

          {/* Dismiss section */}
          {showDismiss && (
            <div className="rounded-xl p-4" style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#991B1B', display: 'block', marginBottom: 4 }}>Dismissal Reason (required)</label>
              <textarea
                value={dismissReason}
                onChange={e => setDismissReason(e.target.value)}
                rows={2}
                placeholder="Explain why the appeal is dismissed..."
                className="w-full rounded-lg px-3 py-2 resize-none outline-none mb-2"
                style={{ fontSize: 12, background: '#fff', border: '1px solid #FCA5A5', color: '#0F172A' }}
              />
              <div className="rounded-lg p-2 flex items-start gap-2" style={{ background: '#FEE2E2' }}>
                <AlertTriangle style={{ width: 11, height: 11, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: '#991B1B' }}>Patient has right to external review under UAE Insurance Law.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0" style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
          <button
            onClick={handleUphold}
            disabled={submitting}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mb-2 transition-colors"
            style={{ background: submitting ? '#94A3B8' : '#059669', color: '#fff', fontSize: 14, fontWeight: 700 }}
          >
            <CheckCircle2 style={{ width: 15, height: 15 }} />
            {submitting ? 'Processing...' : `Uphold Appeal — Approve AED ${claim.damanPays}`}
          </button>
          {!showDismiss ? (
            <button onClick={() => setShowDismiss(true)} className="w-full rounded-xl py-2.5 transition-colors"
              style={{ background: 'transparent', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: 13, fontWeight: 600 }}>
              <XCircle style={{ width: 13, height: 13, display: 'inline', marginRight: 6 }} />
              Dismiss Appeal — Maintain Denial
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              disabled={!dismissReason.trim() || submitting}
              className="w-full rounded-xl py-2.5 transition-colors"
              style={{ background: !dismissReason.trim() ? '#F1F5F9' : '#DC2626', color: !dismissReason.trim() ? '#94A3B8' : '#fff', fontSize: 13, fontWeight: 700 }}>
              Confirm Dismissal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppealReviewModal;
