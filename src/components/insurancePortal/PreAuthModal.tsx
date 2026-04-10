import React, { useState } from 'react';
import { X, Check, AlertTriangle, FileText, ChevronDown } from 'lucide-react';
import type { PreAuthRequest } from '../../types/insurancePortal';

interface Props {
  request: PreAuthRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

type Decision = 'none' | 'approve' | 'deny';

const DENIAL_REASONS = [
  'Not covered by plan',
  'Clinical justification insufficient',
  'Duplicate request',
  'Provider not in network',
  'Benefit limit reached',
  'Pre-existing condition exclusion',
  'Other',
];

const PreAuthModal: React.FC<Props> = ({ request: req, onClose, onApprove, onDeny }) => {
  const [decision, setDecision] = useState<Decision>('none');
  const [approvedDays, setApprovedDays] = useState(30);
  const [denialReason, setDenialReason] = useState('');
  const [denialNotes, setDenialNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const slaLabel = () => {
    const mins = req.slaRemainingMinutes;
    if (mins < 0) return `OVERDUE +${Math.abs(mins)}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`;
  };

  const slaColor = () => {
    if (req.slaRemainingMinutes < 0) return '#DC2626';
    if (req.slaRemainingMinutes < 60) return '#DC2626';
    if (req.slaRemainingMinutes < 300) return '#D97706';
    return '#059669';
  };

  const aiConfig = {
    APPROVE: { bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46', icon: '✅', label: 'AI RECOMMENDS: APPROVE' },
    REVIEW: { bg: '#FFFBEB', border: '#FCD34D', color: '#92400E', icon: '⚠', label: 'AI RECOMMENDS: REVIEW' },
    DENY: { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B', icon: '❌', label: 'AI RECOMMENDS: DENY' },
  }[req.aiRecommendation];

  const patientPays = Math.round(req.estimatedCost * (1 - req.coveragePercent / 100));
  const insurancePays = req.estimatedCost - patientPays;

  const handleApproveSubmit = () => {
    setSubmitted(true);
    onApprove(req.id);
    setTimeout(onClose, 1200);
  };

  const handleDenySubmit = () => {
    if (!denialReason) return;
    setSubmitted(true);
    onDeny(req.id);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in"
        style={{ background: '#fff', animationDuration: '250ms' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: '#0F2D4A' }}>
          <div>
            <p className="text-white font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
              Pre-Authorization Review
            </p>
            <p className="text-blue-300" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
              {req.paRef}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 font-bold"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: slaColor() }}
            >
              {slaLabel()}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-300 hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Section 1 — Patient & Policy */}
          <div>
            <p className="uppercase text-slate-400 font-bold mb-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
              Patient & Policy
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: '#F8FAFC' }}>
                <p className="text-slate-400 mb-1" style={{ fontSize: 10 }}>Patient</p>
                <p className="font-bold text-slate-800" style={{ fontSize: 14 }}>{req.patientName}</p>
                <p className="text-slate-500" style={{ fontSize: 12 }}>{req.patientAge} years · {req.patientGender === 'M' ? 'Male' : 'Female'}</p>
                <p className="text-slate-400 mt-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{req.policyNumber}</p>
                <p className="font-medium mt-0.5" style={{ fontSize: 11, color: '#1E3A5F' }}>Daman {req.planType}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: '#F8FAFC' }}>
                <p className="text-slate-400 mb-1" style={{ fontSize: 10 }}>Coverage</p>
                <p className="font-bold text-slate-700" style={{ fontSize: 13 }}>Policy valid: 1 Jan – 31 Dec 2026</p>
                <p className="text-slate-500 mt-0.5" style={{ fontSize: 12 }}>Co-pay: {100 - req.coveragePercent}%</p>
                <p className="text-slate-500" style={{ fontSize: 12 }}>Annual limit: AED 150,000</p>
                <p className="text-slate-500" style={{ fontSize: 12 }}>Used: AED 8,400</p>
                <p className="font-bold mt-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#059669' }}>
                  Remaining: AED 141,600
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 — Clinical Details */}
          <div>
            <p className="uppercase text-slate-400 font-bold mb-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
              Clinical Details
            </p>
            <div className="rounded-xl p-4" style={{ background: '#F8FAFC' }}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>Doctor</p>
                  <p className="font-semibold text-slate-700" style={{ fontSize: 13 }}>{req.doctorName}</p>
                  <p className="text-teal-600" style={{ fontSize: 10 }}>DHA Licensed ✅</p>
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>Clinic</p>
                  <p className="font-semibold text-slate-700" style={{ fontSize: 13 }}>{req.clinicName}</p>
                  <p className="text-teal-600" style={{ fontSize: 10 }}>DHA Facility ✅ · In Network</p>
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>Procedure</p>
                  <p className="font-semibold text-slate-700" style={{ fontSize: 13 }}>{req.procedure}</p>
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>ICD-10</p>
                  <p className="font-mono font-semibold text-slate-700" style={{ fontSize: 13 }}>{req.icd10}</p>
                  <p className="text-slate-500" style={{ fontSize: 10 }}>{req.icd10Description}</p>
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>Estimated Cost</p>
                  <p className="font-bold text-slate-800" style={{ fontFamily: 'DM Mono, monospace', fontSize: 16 }}>
                    AED {req.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: 10 }}>Coverage</p>
                  <p className="font-bold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>
                    {req.coveragePercent}%
                  </p>
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <p className="text-blue-500 font-semibold mb-1" style={{ fontSize: 10 }}>Clinical Justification</p>
                <p className="text-blue-800 leading-relaxed" style={{ fontSize: 12 }}>
                  "Patient with known {req.icd10Description.toLowerCase()}. Procedure required to assess
                  clinical status and guide treatment decision. Evidence supports clinical necessity."
                </p>
                <p className="text-blue-500 mt-1.5" style={{ fontSize: 10 }}>— {req.doctorName}, 7 April 2026</p>
              </div>
            </div>
          </div>

          {/* Section 3 — Documents */}
          <div>
            <p className="uppercase text-slate-400 font-bold mb-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
              Supporting Documents
            </p>
            <div className="space-y-1.5">
              {[
                { label: 'Clinical history summary', present: true },
                { label: 'Referring letter from specialist', present: true },
                { label: 'Previous diagnostic report', present: true },
                { label: 'Additional imaging (if applicable)', present: false },
              ].map(doc => (
                <div key={doc.label} className="flex items-center gap-2">
                  <span className={doc.present ? 'text-emerald-500' : 'text-slate-300'} style={{ fontSize: 14 }}>
                    {doc.present ? '✅' : '○'}
                  </span>
                  <span className={`${doc.present ? 'text-slate-700' : 'text-slate-400'}`} style={{ fontSize: 12 }}>
                    {doc.label}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-2 text-[#1E3A5F] font-semibold hover:underline" style={{ fontSize: 12 }}>
              📄 View Documents
            </button>
          </div>

          {/* Section 4 — AI Recommendation */}
          <div>
            <p className="uppercase text-slate-400 font-bold mb-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
              AI Recommendation
            </p>
            <div className="rounded-xl p-4" style={{ background: aiConfig.bg, border: `1px solid ${aiConfig.border}` }}>
              <div className="flex items-start justify-between mb-3">
                <p className="font-bold" style={{ color: aiConfig.color, fontSize: 14 }}>
                  {aiConfig.icon} {aiConfig.label}
                </p>
                <div className="text-right">
                  <p className="font-bold leading-none" style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, color: aiConfig.color }}>
                    {req.aiConfidence}%
                  </p>
                  <p style={{ fontSize: 9, color: aiConfig.color }}>confidence</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'ICD-10 aligns with requested procedure', ok: req.aiRecommendation !== 'DENY' },
                  { label: 'Supporting documents present', ok: req.aiRecommendation === 'APPROVE' },
                  { label: `Plan covers this procedure (Daman ${req.planType})`, ok: req.coveragePercent > 0 },
                  { label: 'Annual limit not exceeded', ok: true },
                  { label: 'Doctor DHA licensed and verified', ok: true },
                  { label: 'Clinic in Daman network', ok: true },
                  { label: 'No duplicate request in last 12 months', ok: req.aiRecommendation !== 'DENY' },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ fontSize: 12 }}>{check.ok ? '✅' : '⚠'}</span>
                    <span style={{ fontSize: 11, color: aiConfig.color }}>{check.label}</span>
                  </div>
                ))}
                {req.coveragePercent > 0 && req.coveragePercent < 100 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: 12 }}>⚠</span>
                    <span style={{ fontSize: 11, color: aiConfig.color }}>
                      {req.planType} plan covers {req.coveragePercent}% → patient pays AED {patientPays.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decision Section */}
          {!submitted && (
            <div>
              <p className="uppercase text-slate-400 font-bold mb-3" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
                Your Decision
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setDecision('approve')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    decision === 'approve' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  style={{ fontSize: 13 }}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => setDecision('deny')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    decision === 'deny' ? 'bg-red-600 text-white shadow-md' : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                  style={{ fontSize: 13 }}
                >
                  ❌ Deny
                </button>
              </div>

              {decision === 'approve' && (
                <div className="rounded-xl p-4 space-y-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-slate-400 mb-1" style={{ fontSize: 10 }}>Pre-auth reference</p>
                      <p className="font-mono font-bold text-emerald-700" style={{ fontSize: 11 }}>Auto-generated</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1" style={{ fontSize: 10 }}>Valid for</p>
                      <div className="flex gap-1">
                        {[30, 60, 90].map(d => (
                          <button
                            key={d}
                            onClick={() => setApprovedDays(d)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                              approvedDays === d ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {d}d
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1" style={{ fontSize: 10 }}>Approved amount</p>
                      <p className="font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>
                        AED {req.estimatedCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: '1px solid #BBF7D0' }}>
                    <div>
                      <p className="text-slate-400" style={{ fontSize: 10 }}>Patient pays</p>
                      <p className="font-bold text-amber-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
                        AED {patientPays.toLocaleString()} ({100 - req.coveragePercent}% co-pay)
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400" style={{ fontSize: 10 }}>Insurance pays</p>
                      <p className="font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
                        AED {insurancePays.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleApproveSubmit}
                    className="w-full py-3 rounded-xl text-white font-bold transition-colors hover:bg-emerald-700"
                    style={{ background: '#059669', fontSize: 14 }}
                  >
                    ✅ Approve Pre-Authorization
                  </button>
                </div>
              )}

              {decision === 'deny' && (
                <div className="rounded-xl p-4 space-y-3" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1.5" style={{ fontSize: 12 }}>Denial reason (required)</p>
                    <div className="relative">
                      <select
                        value={denialReason}
                        onChange={e => setDenialReason(e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 appearance-none bg-white border text-slate-700 pr-8"
                        style={{ fontSize: 13, border: '1px solid #FCA5A5' }}
                      >
                        <option value="">Select reason...</option>
                        {DENIAL_REASONS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1.5" style={{ fontSize: 12 }}>Additional notes (required)</p>
                    <textarea
                      value={denialNotes}
                      onChange={e => setDenialNotes(e.target.value)}
                      placeholder="Provide clinical or administrative basis for denial..."
                      className="w-full rounded-xl px-3 py-2.5 bg-white border text-slate-700 resize-none"
                      style={{ fontSize: 13, border: '1px solid #FCA5A5', minHeight: 80 }}
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                    <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />
                    <p className="text-amber-700" style={{ fontSize: 11 }}>
                      Appeal rights notice will be automatically included per DHA regulations
                    </p>
                  </div>
                  <button
                    onClick={handleDenySubmit}
                    disabled={!denialReason || !denialNotes}
                    className="w-full py-3 rounded-xl text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                    style={{ background: '#DC2626', fontSize: 14 }}
                  >
                    ❌ Deny with Reason
                  </button>
                </div>
              )}
            </div>
          )}

          {submitted && (
            <div className="rounded-xl p-6 text-center" style={{ background: decision === 'approve' ? '#ECFDF5' : '#FEF2F2' }}>
              <p className="text-4xl mb-2">{decision === 'approve' ? '✅' : '❌'}</p>
              <p className="font-bold text-lg" style={{ color: decision === 'approve' ? '#065F46' : '#991B1B' }}>
                {decision === 'approve' ? 'Pre-authorization approved!' : 'Pre-authorization denied'}
              </p>
              <p className="text-slate-500 mt-1" style={{ fontSize: 12 }}>
                Doctor and patient will be notified via CeenAiX
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreAuthModal;
