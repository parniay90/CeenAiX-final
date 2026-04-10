import React, { useState } from 'react';
import { Check, X, FileText, Info, ChevronRight } from 'lucide-react';
import type { PreAuthRequest, AiRecommendation } from '../../types/insurancePortal';

interface Props {
  requests: PreAuthRequest[];
  onReview: (req: PreAuthRequest) => void;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

type FilterTab = 'all' | 'urgent' | 'ai-review' | 'ai-deny' | 'overdue';

const AiBadge: React.FC<{ rec: AiRecommendation; confidence: number; reason: string }> = ({ rec, confidence, reason }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const config = {
    APPROVE: { bg: '#ECFDF5', color: '#065F46', label: '✅ AI: APPROVE' },
    REVIEW: { bg: '#FFFBEB', color: '#92400E', label: '⚠ AI: REVIEW' },
    DENY: { bg: '#FEF2F2', color: '#991B1B', label: '❌ AI: DENY' },
  }[rec];

  return (
    <div className="relative">
      <div
        className="flex flex-col gap-0.5 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold uppercase"
          style={{ background: config.bg, color: config.color, fontSize: 9 }}
        >
          {config.label}
          <Info size={8} />
        </span>
        <span className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
          {confidence}% confidence
        </span>
      </div>
      {showTooltip && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 rounded-xl p-3 shadow-2xl pointer-events-none"
          style={{ background: '#1E293B', color: '#E2E8F0', fontSize: 11, lineHeight: 1.6, width: 220, border: '1px solid #334155' }}
        >
          <p className="font-bold mb-1" style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase' }}>
            AI Reasoning
          </p>
          {reason}
        </div>
      )}
    </div>
  );
};

const SlaCell: React.FC<{ req: PreAuthRequest }> = ({ req }) => {
  const mins = req.slaRemainingMinutes;
  const isOverdue = mins < 0;
  const isRed = mins < 60 && !isOverdue;
  const isAmber = mins >= 60 && mins < 300;

  if (isOverdue) {
    return (
      <div className="flex flex-col gap-1">
        <span
          className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-bold animate-pulse"
          style={{ background: '#DC2626', color: '#fff', fontFamily: 'DM Mono, monospace', fontSize: 10 }}
        >
          OVERDUE +{Math.abs(mins)}m
        </span>
        <div className="h-1 rounded-full bg-red-200 w-full">
          <div className="h-1 rounded-full bg-red-600 w-0" />
        </div>
      </div>
    );
  }

  const totalMins = req.slaHours * 60;
  const pct = Math.min(100, (mins / totalMins) * 100);
  const color = isRed ? '#DC2626' : isAmber ? '#D97706' : '#059669';
  const barColor = isRed ? '#FCA5A5' : isAmber ? '#FCD34D' : '#6EE7B7';

  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const label = h > 0 ? `${h}h ${m}m` : `${m}m`;

  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-bold"
        style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color, display: isRed ? 'block' : undefined }}
      >
        {isRed && <span className="animate-pulse">{label}</span>}
        {!isRed && label}
      </span>
      <div className="h-1 rounded-full w-full" style={{ background: '#E2E8F0' }}>
        <div
          className="h-1 rounded-full transition-all"
          style={{ background: barColor, width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const rowBg = (req: PreAuthRequest): string => {
  if (req.priority === 'OVERDUE') return 'bg-red-50';
  if (req.priority === 'URGENT') return 'bg-amber-50/60';
  if (req.priority === 'HIGH') return 'bg-blue-50/30';
  if (req.aiRecommendation === 'DENY') return 'bg-red-50/20';
  return 'bg-white';
};

const rowBorder = (req: PreAuthRequest): string => {
  if (req.priority === 'OVERDUE') return 'border-l-4 border-l-red-600';
  if (req.priority === 'URGENT') return 'border-l-4 border-l-amber-500';
  if (req.priority === 'HIGH') return 'border-l-4 border-l-blue-500';
  return 'border-l-4 border-l-slate-200';
};

const PreAuthQueue: React.FC<Props> = ({ requests, onReview, onApprove, onDeny }) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const aiApproveCount = requests.filter(r => r.aiRecommendation === 'APPROVE').length;

  const filtered = requests.filter(r => {
    if (activeFilter === 'urgent') return r.priority === 'URGENT';
    if (activeFilter === 'ai-review') return r.aiRecommendation === 'REVIEW';
    if (activeFilter === 'ai-deny') return r.aiRecommendation === 'DENY';
    if (activeFilter === 'overdue') return r.priority === 'OVERDUE';
    return true;
  });

  const tabs: { id: FilterTab; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All', count: requests.length },
    { id: 'urgent', label: 'Urgent', count: requests.filter(r => r.priority === 'URGENT').length },
    { id: 'ai-review', label: 'AI: Review', count: requests.filter(r => r.aiRecommendation === 'REVIEW').length },
    { id: 'ai-deny', label: 'AI: Deny', count: requests.filter(r => r.aiRecommendation === 'DENY').length },
    { id: 'overdue', label: 'Overdue', count: requests.filter(r => r.priority === 'OVERDUE').length, color: 'text-red-600 border-red-600' },
  ];

  const handleBulkApprove = () => {
    const ids = requests
      .filter(r => r.aiRecommendation === 'APPROVE')
      .map(r => r.id);
    ids.forEach((id, i) => {
      setTimeout(() => {
        setApprovedIds(prev => new Set([...prev, id]));
        onApprove(id);
      }, i * 50);
    });
    setShowBulkConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl flex flex-col" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div>
          <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
            Pre-Authorization Queue
          </h2>
          <p className="text-slate-400 mt-0.5" style={{ fontSize: 12 }}>
            16 pending · DHA response required
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!showBulkConfirm ? (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold transition-colors hover:bg-emerald-100"
              style={{ background: '#ECFDF5', color: '#065F46', fontSize: 12 }}
            >
              <Check size={13} />
              Bulk Approve AI ({aiApproveCount})
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}>
              <span className="text-emerald-700 font-medium" style={{ fontSize: 12 }}>
                Approve {aiApproveCount} AI-recommended?
              </span>
              <button
                onClick={handleBulkApprove}
                className="text-white rounded-lg px-2 py-1 font-bold transition-colors hover:bg-emerald-700"
                style={{ background: '#059669', fontSize: 11 }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="text-slate-500 rounded-lg px-2 py-1 hover:bg-slate-100 transition-colors"
                style={{ fontSize: 11 }}
              >
                Cancel
              </button>
            </div>
          )}
          <button className="flex items-center gap-1 text-teal-600 font-semibold hover:text-teal-700 transition-colors" style={{ fontSize: 12 }}>
            View All <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-5 py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-[#1E3A5F] text-white'
                : `text-slate-500 hover:bg-slate-50 ${tab.color ?? ''}`
            }`}
            style={{ fontSize: 12 }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 ${
                  activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
                style={{ fontSize: 10 }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              {['PA Ref', 'Patient', 'Doctor / Clinic', 'Procedure', 'Est. Cost', 'AI Rec', 'SLA', 'Actions'].map(col => (
                <th
                  key={col}
                  className="text-left text-slate-400 font-semibold uppercase px-4 py-2.5"
                  style={{ fontSize: 10, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => {
              const isApproved = approvedIds.has(req.id);
              return (
                <tr
                  key={req.id}
                  className={`${rowBg(req)} ${rowBorder(req)} transition-all duration-300 hover:brightness-95 ${
                    isApproved ? 'opacity-40' : ''
                  }`}
                  style={{ borderBottom: '1px solid #F1F5F9' }}
                >
                  {/* PA Ref */}
                  <td className="px-4 py-3">
                    <span
                      className="font-medium cursor-help"
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2563EB' }}
                      title={req.paRef}
                    >
                      {req.paRef.replace('PA-20260407-', 'PA-')}
                    </span>
                    {req.priority === 'OVERDUE' && (
                      <div>
                        <span
                          className="inline-block text-white font-bold rounded-full px-1.5 py-0.5 animate-pulse mt-0.5"
                          style={{ background: '#DC2626', fontSize: 8 }}
                        >
                          OVERDUE
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Patient */}
                  <td className="px-4 py-3" style={{ minWidth: 130 }}>
                    <p className="font-bold text-slate-800 leading-tight" style={{ fontSize: 13 }}>{req.patientName}</p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>
                      Daman {req.planType}
                    </p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>
                      {req.patientAge}{req.patientGender}
                    </p>
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-3" style={{ minWidth: 130 }}>
                    <p className="text-slate-700 font-medium leading-tight" style={{ fontSize: 12 }}>{req.doctorName}</p>
                    <p className="text-slate-400 leading-tight" style={{ fontSize: 10 }}>{req.clinicName}</p>
                    <p className="font-medium" style={{ fontSize: 9, color: '#0D9488' }}>CeenAiX ✅</p>
                  </td>

                  {/* Procedure */}
                  <td className="px-4 py-3" style={{ minWidth: 130 }}>
                    <p className="font-bold text-slate-800 leading-tight" style={{ fontSize: 12 }}>{req.procedure.split('(')[0].trim()}</p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#94A3B8' }}>{req.icd10}</p>
                  </td>

                  {/* Cost */}
                  <td className="px-4 py-3" style={{ minWidth: 80 }}>
                    <p className="font-bold text-slate-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
                      AED {req.estimatedCost.toLocaleString()}
                    </p>
                    {req.coveragePercent > 0 ? (
                      <p className="text-emerald-600 leading-tight" style={{ fontSize: 10 }}>
                        Covers {req.coveragePercent}%
                      </p>
                    ) : (
                      <p className="text-red-500 leading-tight" style={{ fontSize: 10 }}>
                        NOT covered
                      </p>
                    )}
                  </td>

                  {/* AI */}
                  <td className="px-4 py-3" style={{ minWidth: 110 }}>
                    <AiBadge rec={req.aiRecommendation} confidence={req.aiConfidence} reason={req.aiReason} />
                  </td>

                  {/* SLA */}
                  <td className="px-4 py-3" style={{ minWidth: 90 }}>
                    <SlaCell req={req} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onApprove(req.id)}
                        title="Approve"
                        className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors hover:bg-emerald-50 hover:border-emerald-500"
                        style={{ border: '1px solid #D1FAE5', color: '#059669' }}
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => onDeny(req.id)}
                        title="Deny"
                        className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors hover:bg-red-50 hover:border-red-400"
                        style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                      >
                        <X size={12} />
                      </button>
                      <button
                        onClick={() => onReview(req)}
                        title="Review"
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors hover:bg-blue-50 hover:border-blue-400 ${
                          req.priority === 'OVERDUE' ? 'animate-pulse ring-1 ring-red-400' : ''
                        }`}
                        style={{ border: '1px solid #DBEAFE', color: '#2563EB' }}
                      >
                        <FileText size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <button className="text-[#1E3A5F] font-semibold hover:text-blue-800 transition-colors" style={{ fontSize: 12 }}>
          Show 11 more pre-auths →
        </button>
      </div>
    </div>
  );
};

export default PreAuthQueue;
