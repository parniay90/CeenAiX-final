import React, { useState, useEffect } from 'react';
import { Check, X, FileText, CheckCircle, MessageSquare, ClipboardList } from 'lucide-react';
import { preAuthRequests } from '../../data/insurancePortalData';

type Filter = 'all' | 'urgent' | 'review' | 'deny' | 'overdue';
type Decision = 'approve' | 'deny' | 'info' | null;

interface ModalState {
  open: boolean;
  paId: string | null;
  decision: Decision;
  approvalDays: number;
  denyReason: string;
  denyNote: string;
  infoRequest: string;
  confirmed: boolean;
}

const aiBadge = (rec: string) => {
  if (rec === 'APPROVE') return { bg: '#DCFCE7', text: '#065F46', border: '#BBF7D0', label: '✓ Approve' };
  if (rec === 'DENY')    return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: '✗ Deny' };
  return                        { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: '⚠ Review' };
};

const slaDisplay = (mins: number) => {
  if (mins < 0)   return { text: 'OVERDUE', color: '#DC2626', bg: '#FEE2E2' };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const text = h > 0 ? `${h}h ${m}m` : `${m}m`;
  if (mins < 60)  return { text, color: '#DC2626', bg: 'transparent' };
  if (mins < 300) return { text, color: '#D97706', bg: 'transparent' };
  return                  { text, color: '#059669', bg: 'transparent' };
};

const priorityAccent: Record<string, string> = {
  OVERDUE:  '#DC2626',
  URGENT:   '#D97706',
  HIGH:     '#3B82F6',
  STANDARD: '#E2E8F0',
};

const planBadge: Record<string, { bg: string; text: string }> = {
  Gold:   { bg: '#FEF3C7', text: '#92400E' },
  Silver: { bg: '#F1F5F9', text: '#475569' },
  Basic:  { bg: '#DCFCE7', text: '#166534' },
  Thiqa:  { bg: '#EDE9FE', text: '#5B21B6' },
};

interface Props {
  initialOpenPaId?: string | null;
}

const PreAuthQueue: React.FC<Props> = ({ initialOpenPaId }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [deniedIds, setDeniedIds] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    open: !!initialOpenPaId, paId: initialOpenPaId ?? null, decision: null,
    approvalDays: 30, denyReason: '', denyNote: '', infoRequest: '', confirmed: false,
  });
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);
  const [slaCountdown, setSlaCountdown] = useState<Record<string, number>>(
    Object.fromEntries(preAuthRequests.map(r => [r.id, r.slaRemainingMinutes]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSlaCountdown(prev => Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v - 1])));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = preAuthRequests.filter(r => {
    if (activeFilter === 'urgent')  return r.priority === 'URGENT' || r.priority === 'OVERDUE';
    if (activeFilter === 'review')  return r.aiRecommendation === 'REVIEW';
    if (activeFilter === 'deny')    return r.aiRecommendation === 'DENY';
    if (activeFilter === 'overdue') return r.priority === 'OVERDUE';
    return true;
  }).filter(r => !approvedIds.has(r.id) && !deniedIds.has(r.id));

  const aiApproveCount = preAuthRequests.filter(
    r => r.aiRecommendation === 'APPROVE' && !approvedIds.has(r.id) && !deniedIds.has(r.id)
  ).length;

  const handleBulkApprove = () => {
    if (!bulkConfirm) { setBulkConfirm(true); return; }
    const ids = preAuthRequests.filter(r => r.aiRecommendation === 'APPROVE').map(r => r.id);
    setApprovedIds(prev => new Set([...prev, ...ids]));
    setBulkConfirm(false);
    setBulkDone(true);
    setTimeout(() => setBulkDone(false), 3000);
  };

  const openModal = (paId: string) => {
    setModal({ open: true, paId, decision: null, approvalDays: 30, denyReason: '', denyNote: '', infoRequest: '', confirmed: false });
  };

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const handleDecision = (id: string, decision: 'approve' | 'deny') => {
    if (decision === 'approve') setApprovedIds(prev => new Set([...prev, id]));
    else setDeniedIds(prev => new Set([...prev, id]));
  };

  const modalRequest = modal.paId ? preAuthRequests.find(r => r.paRef === modal.paId || r.id === modal.paId) : null;
  const rec = modalRequest ? aiBadge(modalRequest.aiRecommendation) : null;

  const tabs: { id: Filter; label: string; count: number; danger?: boolean }[] = [
    { id: 'all',     label: 'All',        count: preAuthRequests.filter(r => !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'urgent',  label: 'Urgent',     count: preAuthRequests.filter(r => (r.priority === 'URGENT' || r.priority === 'OVERDUE') && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'review',  label: 'AI: Review', count: preAuthRequests.filter(r => r.aiRecommendation === 'REVIEW' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'deny',    label: 'AI: Deny',   count: preAuthRequests.filter(r => r.aiRecommendation === 'DENY' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'overdue', label: 'Overdue',    count: preAuthRequests.filter(r => r.priority === 'OVERDUE' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length, danger: true },
  ];

  return (
    <>
      <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #D97706', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <ClipboardList style={{ width: 14, height: 14, color: '#D97706' }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
              Pre-Authorization Queue
            </span>
            <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FEF3C7', fontFamily: 'DM Mono, monospace' }}>
              16
            </span>
          </div>

          <div className="flex items-center gap-2 pb-0.5">
            {bulkDone ? (
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: '#DCFCE7', border: '1px solid #BBF7D0' }}>
                <CheckCircle style={{ width: 12, height: 12, color: '#059669' }} />
                <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>AI recommendations approved!</span>
              </div>
            ) : bulkConfirm ? (
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: '#475569' }}>Approve {aiApproveCount} AI-recommended?</span>
                <button
                  onClick={handleBulkApprove}
                  className="rounded-lg px-3 py-1.5 transition-colors"
                  style={{ background: '#059669', color: '#fff', fontSize: 12, fontWeight: 700 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setBulkConfirm(false)}
                  className="rounded-lg px-3 py-1.5"
                  style={{ background: '#F1F5F9', color: '#64748B', fontSize: 12 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', fontSize: 12, color: '#059669', fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#BBF7D0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#DCFCE7'; }}
              >
                <Check style={{ width: 12, height: 12 }} />
                Bulk Approve AI ({aiApproveCount})
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-4 mt-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="flex items-center gap-1.5 py-2.5 px-3 transition-all"
              style={{
                fontSize: 12,
                fontWeight: activeFilter === tab.id ? 700 : 500,
                color: activeFilter === tab.id ? (tab.danger ? '#DC2626' : '#0F172A') : '#94A3B8',
                borderBottom: activeFilter === tab.id ? `2px solid ${tab.danger ? '#DC2626' : '#D97706'}` : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab.label}
              <span
                className="rounded-full px-1.5"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: tab.count > 0 && tab.danger ? '#FEE2E2' : '#F1F5F9',
                  color: tab.count > 0 && tab.danger ? '#DC2626' : '#94A3B8',
                  minWidth: 18,
                  textAlign: 'center',
                  fontFamily: 'DM Mono, monospace',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 860 }}>
            {/* Col headers */}
            <div
              className="grid px-4 py-2"
              style={{ gridTemplateColumns: '90px 155px 155px 130px 100px 115px 85px 100px', gap: 8, background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}
            >
              {['PA REF', 'PATIENT', 'DOCTOR / CLINIC', 'PROCEDURE', 'EST. COST', 'AI REC', 'SLA', 'ACTIONS'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((req, idx) => {
              const ai   = aiBadge(req.aiRecommendation);
              const sla  = slaDisplay(slaCountdown[req.id] ?? req.slaRemainingMinutes);
              const plan = planBadge[req.planType] ?? planBadge.Basic;
              const accent = priorityAccent[req.priority] ?? '#E2E8F0';
              const slaRemain = slaCountdown[req.id] ?? req.slaRemainingMinutes;
              const slaPct = Math.max(0, Math.min(100, (slaRemain / (req.slaHours * 60)) * 100));

              return (
                <div
                  key={req.id}
                  className="grid px-4 py-3 group transition-colors"
                  style={{
                    gridTemplateColumns: '90px 155px 155px 130px 100px 115px 85px 100px',
                    gap: 8,
                    borderLeft: `3px solid ${accent}`,
                    borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : 'none',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FAFAFA'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* PA REF */}
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2563EB', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => openModal(req.id)}>
                      {req.paRef.replace('PA-20260407-', '#')}
                    </div>
                    {req.priority === 'OVERDUE' && (
                      <div className="animate-pulse rounded px-1 mt-1" style={{ fontSize: 9, color: '#DC2626', fontWeight: 800, background: '#FEE2E2', display: 'inline-block' }}>
                        OVERDUE
                      </div>
                    )}
                    {req.priority === 'URGENT' && (
                      <div className="rounded px-1 mt-1" style={{ fontSize: 9, color: '#D97706', fontWeight: 700, background: '#FEF3C7', display: 'inline-block' }}>
                        URGENT
                      </div>
                    )}
                  </div>

                  {/* Patient */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{req.patientName}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: plan.bg, color: plan.text }}>
                        {req.planType}
                      </span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>
                        {req.patientAge}{req.patientGender}
                      </span>
                    </div>
                  </div>

                  {/* Doctor / Clinic */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>{req.doctorName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{req.clinicName}</div>
                  </div>

                  {/* Procedure */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{req.procedure}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{req.icd10}</div>
                  </div>

                  {/* Est cost */}
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                      {req.estimatedCost.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: '#64748B', marginTop: 1 }}>AED</div>
                    {req.coveragePercent > 0 ? (
                      <div style={{ fontSize: 9, color: '#059669', marginTop: 2, fontWeight: 600 }}>{req.coveragePercent}% covered</div>
                    ) : (
                      <div style={{ fontSize: 9, color: '#DC2626', marginTop: 2, fontWeight: 600 }}>Not covered</div>
                    )}
                  </div>

                  {/* AI recommendation */}
                  <div className="relative">
                    <div
                      className="rounded-lg px-2 py-1 inline-block cursor-default"
                      style={{ background: ai.bg, border: `1px solid ${ai.border}`, fontSize: 10, fontWeight: 700, color: ai.text }}
                      onMouseEnter={() => setTooltip(req.id)}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {ai.label}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8', marginTop: 3 }}>
                      {req.aiConfidence}% conf.
                    </div>
                    {tooltip === req.id && (
                      <div
                        className="absolute z-50 rounded-lg shadow-2xl p-3"
                        style={{ bottom: '100%', left: 0, width: 220, marginBottom: 4, background: '#1E293B', border: '1px solid #334155' }}
                      >
                        <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                          AI Reasoning
                        </div>
                        <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.6 }}>{req.aiReason}</div>
                      </div>
                    )}
                  </div>

                  {/* SLA */}
                  <div>
                    {sla.bg !== 'transparent' && sla.bg ? (
                      <div
                        className="rounded-md px-1.5 py-0.5 inline-block animate-pulse"
                        style={{ background: sla.bg, fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 800, color: sla.color }}
                      >
                        {sla.text}
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: sla.color }}>{sla.text}</div>
                    )}
                    <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: 3, background: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${slaPct}%`, background: sla.color, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDecision(req.id, 'approve')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '1px solid #BBF7D0', color: '#059669' }}
                      title="Quick approve"
                      onMouseEnter={e => { e.currentTarget.style.background = '#DCFCE7'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Check style={{ width: 12, height: 12 }} />
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, 'deny')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '1px solid #FECACA', color: '#DC2626' }}
                      title="Quick deny"
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <X style={{ width: 12, height: 12 }} />
                    </button>
                    <button
                      onClick={() => openModal(req.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '1px solid #BFDBFE', color: '#2563EB' }}
                      title="Full review"
                      onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <FileText style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button style={{ fontSize: 12, color: '#2563EB', fontWeight: 600 }}>
            Show all pre-authorizations →
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {modal.open && modalRequest && rec && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ width: 600, maxHeight: '90vh', background: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ background: '#0F172A' }}
            >
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 800, color: '#fff' }}>
                  Pre-Authorization Review
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#475569', marginTop: 2 }}>
                  {modalRequest.paRef}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const s = slaDisplay(slaCountdown[modalRequest.id] ?? modalRequest.slaRemainingMinutes);
                  return (
                    <div className="rounded-lg px-3 py-1.5" style={{ background: `${s.color}18`, border: `1px solid ${s.color}40` }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: s.color }}>
                        {s.text}
                      </span>
                    </div>
                  );
                })()}
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4" style={{ background: '#F8FAFC' }}>
              {/* Patient & Coverage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>
                    Patient & Policy
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                    {modalRequest.patientName}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>
                    {modalRequest.patientAge} yrs · {modalRequest.patientGender === 'M' ? 'Male' : 'Female'} · Daman {modalRequest.planType}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#94A3B8' }}>
                    {modalRequest.policyNumber}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>
                    Coverage
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: '#64748B' }}>Annual limit</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#0F172A', fontWeight: 600 }}>AED 150,000</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: '#64748B' }}>Remaining</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#059669', fontWeight: 700 }}>AED 141,600</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#64748B' }}>Co-pay</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#0F172A', fontWeight: 600 }}>
                      {100 - modalRequest.coveragePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical */}
              <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>
                  Clinical Details
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Doctor</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{modalRequest.doctorName}</div>
                    <div style={{ fontSize: 10, color: '#059669', marginTop: 1 }}>DHA-PRAC ✓ Verified</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Facility</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{modalRequest.clinicName}</div>
                    <div style={{ fontSize: 10, color: '#059669', marginTop: 1 }}>DHA-FAC ✓ In network</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Procedure</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{modalRequest.procedure}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
                      {modalRequest.icd10} — {modalRequest.icd10Description}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Estimated Cost</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                      AED {modalRequest.estimatedCost.toLocaleString()}
                    </div>
                    {modalRequest.coveragePercent > 0 && (
                      <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>
                        Insurance: AED {Math.round(modalRequest.estimatedCost * modalRequest.coveragePercent / 100).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="rounded-xl p-4" style={{ background: '#fff', border: `1px solid ${rec.border}`, borderLeft: `3px solid ${rec.text}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-lg px-2.5 py-1" style={{ background: rec.bg, color: rec.text, fontSize: 12, fontWeight: 700 }}>
                    CeenAiX: {rec.label}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 800, color: rec.text }}>
                    {modalRequest.aiConfidence}%
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{modalRequest.aiReason}</div>
              </div>

              {/* Decision */}
              <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>
                  Your Decision
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { id: 'approve', label: '✓ Approve', active: '#059669', activeBg: '#DCFCE7', activeBorder: '#BBF7D0' },
                    { id: 'deny',    label: '✗ Deny',    active: '#DC2626', activeBg: '#FEE2E2', activeBorder: '#FECACA' },
                    { id: 'info',    label: '? Request Info', active: '#2563EB', activeBg: '#DBEAFE', activeBorder: '#BFDBFE' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setModal(m => ({ ...m, decision: opt.id as Decision, confirmed: false }))}
                      className="py-2.5 rounded-xl transition-colors"
                      style={{
                        border: `2px solid ${modal.decision === opt.id ? opt.activeBorder : '#E2E8F0'}`,
                        background: modal.decision === opt.id ? opt.activeBg : '#F8FAFC',
                        color: modal.decision === opt.id ? opt.active : '#64748B',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Approve form */}
                {modal.decision === 'approve' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12, color: '#475569' }}>Valid for:</span>
                      {[30, 60, 90].map(d => (
                        <button
                          key={d}
                          onClick={() => setModal(m => ({ ...m, approvalDays: d }))}
                          className="rounded-lg px-3 py-1 transition-colors"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            background: modal.approvalDays === d ? '#0F172A' : '#F1F5F9',
                            color: modal.approvalDays === d ? '#fff' : '#64748B',
                          }}
                        >
                          {d} days
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center rounded-lg px-3 py-2" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <span style={{ fontSize: 12, color: '#475569' }}>Patient co-payment</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 13, color: '#059669' }}>
                        AED {Math.round(modalRequest.estimatedCost * (100 - modalRequest.coveragePercent) / 100).toLocaleString()} ({100 - modalRequest.coveragePercent}%)
                      </span>
                    </div>
                    {!modal.confirmed ? (
                      <button
                        onClick={() => setModal(m => ({ ...m, confirmed: true }))}
                        className="w-full py-3 rounded-xl transition-colors"
                        style={{ background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                      >
                        Approve Pre-Authorization
                      </button>
                    ) : (
                      <div className="rounded-xl p-4 text-center" style={{ background: '#DCFCE7', border: '1px solid #BBF7D0' }}>
                        <CheckCircle style={{ width: 22, height: 22, color: '#059669', margin: '0 auto 6px' }} />
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>Pre-Authorization Approved</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#15803D', marginTop: 4 }}>
                          {modalRequest.paRef}-APRV · Doctor notified via CeenAiX
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Deny form */}
                {modal.decision === 'deny' && (
                  <div className="flex flex-col gap-3">
                    <select
                      value={modal.denyReason}
                      onChange={e => setModal(m => ({ ...m, denyReason: e.target.value }))}
                      className="w-full rounded-xl px-3 py-2.5"
                      style={{ border: '1px solid #E2E8F0', fontSize: 13, color: '#334155', background: '#fff' }}
                    >
                      <option value="">Select denial reason...</option>
                      <option>Not covered by plan</option>
                      <option>Clinical justification insufficient</option>
                      <option>Duplicate request</option>
                      <option>Provider not in network</option>
                      <option>Benefit limit reached</option>
                      <option>Pre-existing condition exclusion</option>
                      <option>Other</option>
                    </select>
                    <textarea
                      placeholder="Additional notes (required)..."
                      value={modal.denyNote}
                      onChange={e => setModal(m => ({ ...m, denyNote: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl px-3 py-2.5"
                      style={{ border: '1px solid #E2E8F0', fontSize: 13, color: '#334155', resize: 'none' }}
                    />
                    <div className="rounded-lg px-3 py-2" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                      <span style={{ fontSize: 11, color: '#92400E' }}>Appeal rights notice will be included per DHA regulation</span>
                    </div>
                    <button
                      className="w-full py-3 rounded-xl transition-colors"
                      style={{ background: modal.denyReason ? '#DC2626' : '#E2E8F0', color: modal.denyReason ? '#fff' : '#94A3B8', fontSize: 13, fontWeight: 700 }}
                      disabled={!modal.denyReason}
                      onClick={() => { handleDecision(modalRequest.id, 'deny'); closeModal(); }}
                      onMouseEnter={e => { if (modal.denyReason) e.currentTarget.style.background = '#B91C1C'; }}
                      onMouseLeave={e => { if (modal.denyReason) e.currentTarget.style.background = '#DC2626'; }}
                    >
                      Deny Pre-Authorization
                    </button>
                  </div>
                )}

                {/* Info request form */}
                {modal.decision === 'info' && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg px-3 py-2.5" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <div style={{ fontSize: 11, color: '#1E40AF', fontWeight: 700, marginBottom: 2 }}>Request Additional Information</div>
                      <div style={{ fontSize: 11, color: '#3B82F6' }}>Doctor will be notified via CeenAiX to provide the requested documents</div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {['Echocardiography report', 'Pre-procedure stress test', 'Previous imaging results', 'Lab results (CBC, BMP)', 'Specialist consultation note', 'Second opinion required'].map(item => (
                        <label
                          key={item}
                          className="flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 transition-colors"
                          style={{ border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                        >
                          <input
                            type="checkbox"
                            style={{ accentColor: '#2563EB', width: 13, height: 13 }}
                            onChange={e => {
                              setModal(m => ({
                                ...m,
                                infoRequest: e.target.checked
                                  ? m.infoRequest ? `${m.infoRequest}, ${item}` : item
                                  : m.infoRequest.replace(`, ${item}`, '').replace(item, '').replace(/^, /, ''),
                              }));
                            }}
                          />
                          <span style={{ fontSize: 12, color: '#334155' }}>{item}</span>
                        </label>
                      ))}
                    </div>
                    <textarea
                      placeholder="Additional specific request (optional)..."
                      rows={2}
                      className="w-full rounded-xl px-3 py-2.5"
                      style={{ border: '1px solid #E2E8F0', fontSize: 13, color: '#334155', resize: 'none' }}
                    />
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                      <span style={{ fontSize: 11, color: '#92400E' }}>SLA clock paused while awaiting information per DHA protocol</span>
                    </div>
                    {!modal.confirmed ? (
                      <button
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        style={{ background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 700 }}
                        onClick={() => setModal(m => ({ ...m, confirmed: true }))}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
                      >
                        <MessageSquare style={{ width: 14, height: 14 }} />
                        Send Information Request to Doctor
                      </button>
                    ) : (
                      <div className="rounded-xl p-4 text-center" style={{ background: '#DBEAFE', border: '1px solid #93C5FD' }}>
                        <MessageSquare style={{ width: 22, height: 22, color: '#2563EB', margin: '0 auto 6px' }} />
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF' }}>Information Request Sent</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#3B82F6', marginTop: 4 }}>
                          {modalRequest.doctorName} notified via CeenAiX · SLA paused
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreAuthQueue;
