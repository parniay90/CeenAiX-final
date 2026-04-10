import React, { useState, useEffect, useRef } from 'react';
import { Check, X, FileText, ExternalLink, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';
import { preAuthRequests } from '../../data/insurancePortalData';

type Filter = 'all' | 'urgent' | 'review' | 'deny' | 'overdue';
type Decision = 'approve' | 'deny' | null;

interface ModalState {
  open: boolean;
  paId: string | null;
  decision: Decision;
  approvalDays: number;
  denyReason: string;
  denyNote: string;
  confirmed: boolean;
}

const aiBadge = (rec: string) => {
  if (rec === 'APPROVE') return { bg: '#F0FDF4', text: '#15803D', label: '✓ AI: APPROVE' };
  if (rec === 'DENY') return { bg: '#FFF5F5', text: '#DC2626', label: '✗ AI: DENY' };
  return { bg: '#FFFBEB', text: '#B45309', label: '⚠ AI: REVIEW' };
};

const slaDisplay = (mins: number) => {
  if (mins < 0) return { text: 'OVERDUE', color: '#DC2626', bg: '#FEE2E2' };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const text = h > 0 ? `${h}h ${m}m` : `${m}m`;
  if (mins < 60) return { text, color: '#DC2626', bg: 'transparent' };
  if (mins < 300) return { text, color: '#D97706', bg: 'transparent' };
  return { text, color: '#059669', bg: 'transparent' };
};

const planBadge: Record<string, { bg: string; text: string }> = {
  Gold: { bg: '#FEF3C7', text: '#92400E' },
  Silver: { bg: '#F1F5F9', text: '#475569' },
  Basic: { bg: '#F0FDF4', text: '#166534' },
};

const rowStyle = (priority: string, rec: string) => {
  if (priority === 'OVERDUE') return { bg: '#FFF5F5', border: '#DC2626' };
  if (priority === 'URGENT') return { bg: '#FFFBEB', border: '#D97706' };
  if (priority === 'HIGH') return { bg: '#EFF6FF', border: '#3B82F6' };
  if (rec === 'DENY') return { bg: '#FFF5F5', border: '#E2E8F0' };
  return { bg: '#fff', border: '#E2E8F0' };
};

interface Props {
  initialOpenPaId?: string | null;
}

const PreAuthQueue: React.FC<Props> = ({ initialOpenPaId }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [deniedIds, setDeniedIds] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<{ id: string; x: number; y: number } | null>(null);
  const [modal, setModal] = useState<ModalState>({
    open: !!initialOpenPaId, paId: initialOpenPaId ?? null, decision: null,
    approvalDays: 30, denyReason: '', denyNote: '', confirmed: false,
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
    if (activeFilter === 'urgent') return r.priority === 'URGENT' || r.priority === 'OVERDUE';
    if (activeFilter === 'review') return r.aiRecommendation === 'REVIEW';
    if (activeFilter === 'deny') return r.aiRecommendation === 'DENY';
    if (activeFilter === 'overdue') return r.priority === 'OVERDUE';
    return true;
  }).filter(r => !approvedIds.has(r.id) && !deniedIds.has(r.id));

  const aiApproveCount = preAuthRequests.filter(r => r.aiRecommendation === 'APPROVE' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length;

  const handleBulkApprove = () => {
    if (!bulkConfirm) { setBulkConfirm(true); return; }
    const ids = preAuthRequests.filter(r => r.aiRecommendation === 'APPROVE').map(r => r.id);
    setApprovedIds(prev => new Set([...prev, ...ids]));
    setBulkConfirm(false);
    setBulkDone(true);
    setTimeout(() => setBulkDone(false), 3000);
  };

  const openModal = (paId: string) => {
    setModal({ open: true, paId, decision: null, approvalDays: 30, denyReason: '', denyNote: '', confirmed: false });
  };

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const handleDecision = (id: string, decision: 'approve' | 'deny') => {
    if (decision === 'approve') setApprovedIds(prev => new Set([...prev, id]));
    else setDeniedIds(prev => new Set([...prev, id]));
  };

  const modalRequest = modal.paId ? preAuthRequests.find(r => r.paRef === modal.paId || r.id === modal.paId) : null;
  const rec = modalRequest ? aiBadge(modalRequest.aiRecommendation) : null;

  const tabs: { id: Filter; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All', count: preAuthRequests.filter(r => !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'urgent', label: 'Urgent', count: preAuthRequests.filter(r => (r.priority === 'URGENT' || r.priority === 'OVERDUE') && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'review', label: 'AI: Review', count: preAuthRequests.filter(r => r.aiRecommendation === 'REVIEW' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'deny', label: 'AI: Deny', count: preAuthRequests.filter(r => r.aiRecommendation === 'DENY' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length },
    { id: 'overdue', label: 'Overdue', count: preAuthRequests.filter(r => r.priority === 'OVERDUE' && !approvedIds.has(r.id) && !deniedIds.has(r.id)).length, color: '#DC2626' },
  ];

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: '#1E293B' }}>Pre-Authorization Queue</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>16 pending · DHA response required</div>
          </div>
          <div className="flex items-center gap-2">
            {bulkDone ? (
              <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                <CheckCircle style={{ width: 14, height: 14, color: '#059669' }} />
                <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>AI recommendations approved!</span>
              </div>
            ) : bulkConfirm ? (
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: '#475569' }}>Approve {aiApproveCount} AI-recommended?</span>
                <button onClick={handleBulkApprove}
                  className="rounded-xl px-3 py-1.5 transition-colors"
                  style={{ background: '#059669', color: '#fff', fontSize: 12, fontWeight: 600 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}>
                  Confirm
                </button>
                <button onClick={() => setBulkConfirm(false)}
                  className="rounded-xl px-3 py-1.5 transition-colors"
                  style={{ background: '#F1F5F9', color: '#64748B', fontSize: 12 }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors"
                style={{ background: '#F0FDF4', border: '1px solid #6EE7B7', fontSize: 12, color: '#15803D', fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#DCFCE7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F0FDF4'; }}>
                <Check style={{ width: 13, height: 13 }} />
                Bulk Approve AI Recommended ({aiApproveCount})
              </button>
            )}
            <a href="/insurance/preauth" style={{ fontSize: 12, color: '#0D9488', fontWeight: 600, textDecoration: 'none' }}>
              View All →
            </a>
          </div>
        </div>

        <div className="flex gap-0 px-5" style={{ borderBottom: '1px solid #F1F5F9' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="flex items-center gap-1.5 py-3 px-3 transition-all"
              style={{
                fontSize: 12, fontWeight: activeFilter === tab.id ? 600 : 400,
                color: activeFilter === tab.id ? (tab.color ?? '#1E3A5F') : '#94A3B8',
                borderBottom: activeFilter === tab.id ? `2px solid ${tab.color ?? '#1E3A5F'}` : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab.label}
              <span
                className="rounded-full px-1.5"
                style={{
                  fontSize: 10, fontWeight: 700,
                  background: activeFilter === tab.id ? (tab.color ? '#FEE2E2' : '#EFF6FF') : '#F1F5F9',
                  color: activeFilter === tab.id ? (tab.color ?? '#1E3A5F') : '#94A3B8',
                  minWidth: 18, textAlign: 'center',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 860 }}>
            <div
              className="grid px-4 py-2"
              style={{ gridTemplateColumns: '80px 150px 150px 130px 90px 120px 90px 100px', gap: 8, background: '#F8FAFC' }}
            >
              {['PA REF', 'PATIENT', 'DOCTOR / CLINIC', 'PROCEDURE', 'EST. COST', 'AI REC', 'SLA', 'ACTIONS'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {filtered.map(req => {
                const rs = rowStyle(req.priority, req.aiRecommendation);
                const ai = aiBadge(req.aiRecommendation);
                const sla = slaDisplay(slaCountdown[req.id] ?? req.slaRemainingMinutes);
                const plan = planBadge[req.planType] ?? planBadge.Basic;
                const slaTotal = req.slaHours * 60;
                const slaRemain = slaCountdown[req.id] ?? req.slaRemainingMinutes;
                const slaPct = Math.max(0, Math.min(100, (slaRemain / slaTotal) * 100));

                return (
                  <div
                    key={req.id}
                    className="grid px-4 py-3"
                    style={{
                      gridTemplateColumns: '80px 150px 150px 130px 90px 120px 90px 100px',
                      gap: 8,
                      background: rs.bg,
                      borderLeft: `4px solid ${rs.border}`,
                      borderBottom: '1px solid #F1F5F9',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2563EB', fontWeight: 600 }}>
                        {req.paRef.replace('PA-20260407-', 'PA-')}
                      </div>
                      {req.priority === 'OVERDUE' && (
                        <div className="animate-pulse" style={{ fontSize: 8, color: '#DC2626', fontWeight: 700, marginTop: 2 }}>OVERDUE</div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>{req.patientName}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 9, background: plan.bg, color: plan.text, fontWeight: 600 }}>
                          Daman {req.planType}
                        </span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>
                          {req.patientAge}{req.patientGender}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: '#334155' }}>{req.doctorName}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{req.clinicName}</div>
                      <div style={{ fontSize: 9, color: '#0D9488', marginTop: 1 }}>CeenAiX ✅</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>{req.procedure}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{req.icd10}</div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700, color: '#334155' }}>
                        AED {req.estimatedCost.toLocaleString()}
                      </div>
                      {req.coveragePercent > 0 ? (
                        <div style={{ fontSize: 10, color: '#059669', marginTop: 2 }}>Covers {req.coveragePercent}%</div>
                      ) : (
                        <div style={{ fontSize: 10, color: '#DC2626', marginTop: 2 }}>Not covered</div>
                      )}
                    </div>

                    <div
                      className="relative"
                      onMouseEnter={e => setTooltip({ id: req.id, x: 0, y: 0 })}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div
                        className="rounded-lg px-2 py-1 inline-block"
                        style={{ background: ai.bg, fontSize: 10, fontWeight: 700, color: ai.text, cursor: 'pointer' }}
                      >
                        {ai.label}
                      </div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8', marginTop: 3 }}>
                        {req.aiConfidence}% confidence
                      </div>
                      {tooltip?.id === req.id && (
                        <div
                          className="absolute z-50 rounded-xl shadow-xl p-3"
                          style={{
                            bottom: '100%', left: 0, width: 220, marginBottom: 4,
                            background: '#1E293B', border: '1px solid #334155',
                          }}
                        >
                          <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4, fontWeight: 600 }}>AI REASONING</div>
                          <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.5 }}>{req.aiReason}</div>
                        </div>
                      )}
                    </div>

                    <div>
                      {sla.bg ? (
                        <div className="rounded-lg px-2 py-1 inline-block animate-pulse"
                          style={{ background: sla.bg, fontSize: 11, fontWeight: 700, color: sla.color, fontFamily: 'DM Mono, monospace' }}>
                          {sla.text}
                        </div>
                      ) : (
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: sla.color }}>{sla.text}</div>
                      )}
                      <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: 3, background: '#E2E8F0' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${slaPct}%`, background: sla.color }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDecision(req.id, 'approve')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ border: '1px solid #6EE7B7', color: '#059669' }}
                        title="Approve"
                        onMouseEnter={e => { e.currentTarget.style.background = '#D1FAE5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Check style={{ width: 13, height: 13 }} />
                      </button>
                      <button
                        onClick={() => handleDecision(req.id, 'deny')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ border: '1px solid #FCA5A5', color: '#DC2626' }}
                        title="Deny"
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <X style={{ width: 13, height: 13 }} />
                      </button>
                      <button
                        onClick={() => openModal(req.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ border: '1px solid #BFDBFE', color: '#2563EB' }}
                        title="Review"
                        onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <FileText style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-5 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button style={{ fontSize: 12, color: '#1E3A5F', fontWeight: 600 }}>
            Show 11 more pre-auths →
          </button>
        </div>
      </div>

      {modal.open && modalRequest && rec && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ width: 600, maxHeight: '90vh', background: '#fff', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ background: '#0F2D4A' }}
            >
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                  Pre-Authorization Review
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#7BAFD4', marginTop: 2 }}>
                  {modalRequest.paRef}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const s = slaDisplay(slaCountdown[modalRequest.id] ?? modalRequest.slaRemainingMinutes);
                  return (
                    <div className="rounded-xl px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${s.color}44` }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: s.color }}>
                        {s.text} remaining
                      </span>
                    </div>
                  );
                })()}
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4 rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>PATIENT & POLICY</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>
                    {modalRequest.patientName} · {modalRequest.patientAge}{modalRequest.patientGender}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B', marginBottom: 2 }}>
                    {modalRequest.policyNumber}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Daman {modalRequest.planType}</div>
                  <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontFamily: 'DM Mono, monospace' }}>
                    AED 141,600 remaining benefit
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>COVERAGE</div>
                  <div style={{ fontSize: 13, color: '#1E293B', marginBottom: 2 }}>Annual limit: AED 150,000</div>
                  <div style={{ fontSize: 13, color: '#1E293B', marginBottom: 2 }}>Used: AED 8,400</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#059669', fontWeight: 700, marginBottom: 2 }}>
                    AED 141,600 remaining
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Co-pay: {100 - modalRequest.coveragePercent}%
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>CLINICAL DETAILS</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Doctor</div>
                    <div style={{ fontSize: 13, color: '#1E293B' }}>{modalRequest.doctorName}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#059669' }}>DHA-PRAC ✅ Verified</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Clinic</div>
                    <div style={{ fontSize: 13, color: '#1E293B' }}>{modalRequest.clinicName}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#059669' }}>DHA-FAC ✅ In network</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Procedure</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{modalRequest.procedure}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>{modalRequest.icd10} — {modalRequest.icd10Description}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Estimated Cost</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
                      AED {modalRequest.estimatedCost.toLocaleString()}
                    </div>
                    {modalRequest.coveragePercent > 0 && (
                      <div style={{ fontSize: 12, color: '#059669' }}>
                        Insurance pays: AED {Math.round(modalRequest.estimatedCost * modalRequest.coveragePercent / 100).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl p-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: 10, color: '#1E40AF', fontWeight: 600, marginBottom: 4 }}>CLINICAL JUSTIFICATION FROM DOCTOR</div>
                  <div style={{ fontSize: 12, color: '#1E3A5F', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "Patient requires this procedure based on clinical presentation and diagnostic workup. All relevant documentation has been submitted per DHA requirements."
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>— {modalRequest.doctorName} · 7 April 2026</div>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: modalRequest.aiRecommendation === 'APPROVE' ? '#F0FDF4' : modalRequest.aiRecommendation === 'DENY' ? '#FFF5F5' : '#FFFBEB', border: `1px solid ${modalRequest.aiRecommendation === 'APPROVE' ? '#6EE7B7' : modalRequest.aiRecommendation === 'DENY' ? '#FCA5A5' : '#FCD34D'}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div style={{ fontSize: 14, fontWeight: 700, color: rec.text }}>{rec.label}</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 24, fontWeight: 700, color: rec.text }}>
                    {modalRequest.aiConfidence}%
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{modalRequest.aiReason}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>YOUR DECISION</div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setModal(m => ({ ...m, decision: 'approve' }))}
                    className="flex-1 py-2.5 rounded-xl transition-colors"
                    style={{
                      border: `2px solid ${modal.decision === 'approve' ? '#059669' : '#E2E8F0'}`,
                      background: modal.decision === 'approve' ? '#D1FAE5' : '#F8FAFC',
                      color: modal.decision === 'approve' ? '#059669' : '#64748B',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => setModal(m => ({ ...m, decision: 'deny' }))}
                    className="flex-1 py-2.5 rounded-xl transition-colors"
                    style={{
                      border: `2px solid ${modal.decision === 'deny' ? '#DC2626' : '#E2E8F0'}`,
                      background: modal.decision === 'deny' ? '#FEE2E2' : '#F8FAFC',
                      color: modal.decision === 'deny' ? '#DC2626' : '#64748B',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    ✗ Deny
                  </button>
                </div>

                {modal.decision === 'approve' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div style={{ fontSize: 13, color: '#475569' }}>Valid for:</div>
                      {[30, 60, 90].map(d => (
                        <button
                          key={d}
                          onClick={() => setModal(m => ({ ...m, approvalDays: d }))}
                          className="rounded-xl px-3 py-1.5 transition-colors"
                          style={{
                            fontSize: 12, fontWeight: 600,
                            background: modal.approvalDays === d ? '#1E3A5F' : '#F1F5F9',
                            color: modal.approvalDays === d ? '#fff' : '#64748B',
                          }}
                        >
                          {d} days
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm" style={{ padding: '8px 12px', background: '#F0FDF4', borderRadius: 10 }}>
                      <span style={{ color: '#64748B' }}>Patient pays:</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#059669' }}>
                        AED {Math.round(modalRequest.estimatedCost * (100 - modalRequest.coveragePercent) / 100).toLocaleString()} ({100 - modalRequest.coveragePercent}%)
                      </span>
                    </div>
                    {!modal.confirmed ? (
                      <button
                        onClick={() => setModal(m => ({ ...m, confirmed: true }))}
                        className="w-full py-3 rounded-xl transition-colors"
                        style={{ background: '#059669', color: '#fff', fontSize: 14, fontWeight: 600 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                      >
                        ✓ Approve Pre-Authorization
                      </button>
                    ) : (
                      <div className="rounded-xl p-4 text-center" style={{ background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                        <CheckCircle style={{ width: 24, height: 24, color: '#059669', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>Pre-Authorization Approved</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#15803D', marginTop: 4 }}>
                          {modalRequest.paRef}-APRV · Doctor notified via CeenAiX
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                    <div className="rounded-xl px-3 py-2" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                      <span style={{ fontSize: 11, color: '#92400E' }}>✅ Appeal rights notice will be included per DHA regulation</span>
                    </div>
                    <button
                      className="w-full py-3 rounded-xl transition-colors"
                      style={{ background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 600 }}
                      disabled={!modal.denyReason}
                      onClick={() => { handleDecision(modalRequest.id, 'deny'); closeModal(); }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
                    >
                      ✗ Deny with Reason
                    </button>
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
