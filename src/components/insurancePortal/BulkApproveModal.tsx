import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Brain } from 'lucide-react';
import type { PreAuthRequest } from '../../types/insurancePortal';

interface Props {
  candidates: PreAuthRequest[];
  onClose: () => void;
  onConfirm: (ids: string[], note: string) => void;
}

const BulkApproveModal: React.FC<Props> = ({ candidates, onClose, onConfirm }) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(candidates.filter(c => c.aiRecommendation === 'APPROVE').map(c => c.id))
  );
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(prev => prev.size === candidates.length ? new Set() : new Set(candidates.map(c => c.id)));

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      onConfirm(Array.from(selected), note);
      setSubmitting(false);
    }, 800);
  };

  const totalCost = candidates
    .filter(c => selected.has(c.id))
    .reduce((sum, c) => sum + Math.round(c.estimatedCost * c.coveragePercent / 100), 0);

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 620, maxHeight: '85vh', background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ padding: '18px 22px', background: '#0F172A', borderBottom: '1px solid #1E293B' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#059669' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 800, color: '#fff' }}>
                Bulk Approve Pre-Authorizations
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>
                {candidates.length} AI-recommended approvals pending
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Warning */}
        <div className="flex-shrink-0 flex items-start gap-2.5 mx-5 mt-4 rounded-lg p-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertTriangle style={{ width: 14, height: 14, color: '#D97706', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.5 }}>
            Bulk approval applies your authorization to all selected pre-auth requests simultaneously.
            Review each case before confirming. All decisions are final and audited.
          </p>
        </div>

        {/* Select all bar */}
        <div
          className="flex items-center justify-between flex-shrink-0 mx-5 mt-3 rounded-lg px-3 py-2"
          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.size === candidates.length}
              onChange={toggleAll}
              style={{ accentColor: '#059669' }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
              Select all ({candidates.length})
            </span>
          </label>
          <div className="flex items-center gap-1.5">
            <Brain style={{ width: 11, height: 11, color: '#059669' }} />
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
              {candidates.filter(c => c.aiRecommendation === 'APPROVE').length} AI-recommended
            </span>
          </div>
        </div>

        {/* Candidate list */}
        <div className="flex-1 overflow-y-auto mx-5 mt-2 space-y-1.5">
          {candidates.map(pa => {
            const isSelected = selected.has(pa.id);
            const isAiApprove = pa.aiRecommendation === 'APPROVE';
            return (
              <label
                key={pa.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                style={{
                  background: isSelected ? '#F0FDF4' : '#F8FAFC',
                  border: `1px solid ${isSelected ? '#86EFAC' : '#E2E8F0'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(pa.id)}
                  style={{ accentColor: '#059669', flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>{pa.paRef}</span>
                    {isAiApprove && (
                      <span className="rounded px-1.5 py-0.5" style={{ background: '#DCFCE7', color: '#065F46', fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                        AI {pa.aiConfidence}%
                      </span>
                    )}
                    {!isAiApprove && (
                      <span className="rounded px-1.5 py-0.5" style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                        AI REVIEW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>
                    {pa.patientName} · {pa.procedure}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#059669' }}>
                    AED {Math.round(pa.estimatedCost * pa.coveragePercent / 100).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{pa.coveragePercent}% covered</div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Note + summary */}
        <div className="flex-shrink-0 mx-5 mt-3">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            placeholder="Optional bulk approval note..."
            className="w-full rounded-lg px-3 py-2 resize-none outline-none"
            style={{ fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ padding: '14px 22px', borderTop: '1px solid #F1F5F9', marginTop: 12 }}
        >
          <div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              {selected.size} selected · Daman liability:
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              AED {totalCost.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 transition-colors"
              style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0 || submitting}
              className="flex items-center gap-2 rounded-lg px-5 py-2 transition-colors"
              style={{
                background: selected.size === 0 || submitting ? '#94A3B8' : '#059669',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}
            >
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              {submitting ? 'Approving...' : `Approve ${selected.size}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkApproveModal;
