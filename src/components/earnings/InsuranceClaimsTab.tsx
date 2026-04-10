import { useState } from 'react';
import { Phone, FileText, MessageSquare } from 'lucide-react';

type ClaimFilter = 'all' | 'approved' | 'pending' | 'rejected';

const claims = [
  { id: 'CLM-20260407-00481', patient: 'Parnia Yazdkhasti', pid: 'PT-001', initials: 'PY', insurer: 'Daman National Health Insurance', policy: 'Daman Gold · DAM-2024-IND-047821', amount: 360, submitted: '7 Apr 9:59 AM', resolved: '7 Apr 11:15 AM', turnaround: '1h 16min', status: 'approved' },
  { id: 'CLM-20260407-00482', patient: 'Fatima Bint Rashid', pid: 'PT-003', initials: 'FB', insurer: 'Thiqa (Abu Dhabi Gov.)', policy: 'Thiqa — 100% covered', amount: 400, submitted: '7 Apr 11:02 AM', resolved: '7 Apr 11:45 AM', turnaround: '43min', status: 'approved' },
  { id: 'CLM-20260407-00479', patient: 'Omar Hassan', pid: 'PT-009', initials: 'OH', insurer: 'ADNIC', policy: 'ADNIC Standard', amount: 360, submitted: '6 Apr 2:15 PM', resolved: '7 Apr 9:00 AM', turnaround: 'Next day', status: 'approved' },
  { id: 'CLM-20260407-00480', patient: 'Ahmed Bin Zayed', pid: 'PT-010', initials: 'AZ', insurer: 'Daman National', policy: 'Daman Gold', amount: 360, submitted: '6 Apr 3:00 PM', resolved: '6 Apr 4:30 PM', turnaround: '1h 30min', status: 'approved' },
  { id: 'CLM-20260405-00475', patient: 'Nadia Al Rashidi', pid: 'PT-011', initials: 'NR', insurer: 'AXA Gulf', policy: 'AXA Gulf Standard', amount: 360, submitted: '5 Apr 10:00 AM', resolved: '5 Apr 2:00 PM', turnaround: '4h', status: 'approved' },
  { id: 'CLM-20260407-00483', patient: 'Khalid Hassan', pid: 'PT-002', initials: 'KH', insurer: 'ADNIC Standard', policy: 'ADNIC', amount: 360, submitted: '7 Apr 9:22 AM', resolved: null, pending_time: '4h 45min', status: 'pending', note: 'Expected approval: 24–48 hours' },
  { id: 'CLM-20260407-00484', patient: 'Mohammed Al Shamsi', pid: 'PT-004', initials: 'MS', insurer: 'Daman Basic', policy: 'Daman Basic — New patient', amount: 320, submitted: '7 Apr 10:22 AM', resolved: null, pending_time: '3h 45min', status: 'pending', note: 'New patient claim may require additional documentation' },
  { id: 'CLM-20260407-00485', patient: 'Abdullah Hassan', pid: 'PT-005', initials: 'AH', insurer: 'Daman Gold', policy: 'Daman Gold (Emergency)', amount: 405, submitted: '7 Apr 11:52 AM', resolved: null, pending_time: '2h 15min', status: 'pending', note: 'Emergency claim — usually processed within 4 hours' },
  { id: 'CLM-20260407-00486', patient: 'Aisha Mohammed', pid: 'PT-006', initials: 'AM', insurer: 'AXA Gulf Standard', policy: 'AXA Gulf', amount: 360, submitted: null, resolved: null, pending_time: null, status: 'pending', note: 'Consultation in progress — not yet submitted' },
  { id: 'CLM-20260407-00487', patient: 'Rashida Yousuf', pid: 'PT-012', initials: 'RY', insurer: 'Daman Basic', policy: 'Daman Basic', amount: 320, submitted: '6 Apr 4:00 PM', resolved: null, pending_time: '22h+', status: 'pending', note: 'Extended review — may need follow-up' },
  { id: 'CLM-20260228-00847', patient: 'Mohammed Ibrahim', pid: 'PT-013', initials: 'MI', insurer: 'Daman Basic', policy: 'Daman Basic', amount: 320, submitted: '28 Feb 2026', resolved: '3 Mar 2026', rejection_reason: 'Pre-authorization not obtained for Specialist consultation. Daman Basic requires GP referral and pre-auth for Cardiology visits.', rejection_code: 'R-204', appeal_ref: 'APP-20260302-00214', status: 'rejected' },
];

export default function InsuranceClaimsTab() {
  const [filter, setFilter] = useState<ClaimFilter>('all');

  const filtered = claims.filter(c => filter === 'all' ? true : c.status === filter);
  const approved = claims.filter(c => c.status === 'approved');
  const pending = claims.filter(c => c.status === 'pending');
  const rejected = claims.filter(c => c.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Claims Pipeline — April 2026</h3>

        <div className="flex items-center justify-between">
          {[
            { label: 'Submitted', count: 11, amount: 'AED 6,165', bg: 'bg-slate-700', amtColor: 'text-slate-600' },
            { label: 'Approved', count: 5, amount: 'AED 3,200 ✅', bg: 'bg-emerald-500', amtColor: 'text-emerald-600' },
            { label: 'Pending', count: 5, amount: 'AED 2,645 ⏳', bg: 'bg-amber-500', amtColor: 'text-amber-600' },
            { label: 'Rejected', count: 1, amount: 'AED 320 ❌', bg: 'bg-red-500', amtColor: 'text-red-500' },
          ].map((stage, idx, arr) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="text-center">
                <div className={`w-12 h-12 ${stage.bg} rounded-full flex items-center justify-center text-white font-mono font-bold text-lg mx-auto mb-1.5`}>{stage.count}</div>
                <div className="text-xs text-slate-500 mb-0.5">{stage.label}</div>
                <div className={`font-mono text-xs font-semibold ${stage.amtColor}`}>{stage.amount}</div>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex items-center gap-1 mb-5">
                  <div className="h-px w-8 bg-slate-200" />
                  <div className="text-slate-400 text-sm">→</div>
                  <div className="h-px w-8 bg-slate-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          ['all', `All Claims (${claims.length})`],
          ['approved', `Approved (${approved.length})`],
          ['pending', `Pending (${pending.length})`],
          ['rejected', `Rejected (${rejected.length})`],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id as ClaimFilter)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${filter === id ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filtered.map(claim => (
          <div key={claim.id} className={`rounded-2xl border-l-4 p-5 ${
            claim.status === 'approved' ? 'bg-emerald-50/50 border-emerald-400' :
            claim.status === 'pending' ? 'bg-white border-amber-400 border border-slate-100' :
            'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {claim.initials}
                </div>

                <div>
                  <div className="font-semibold text-slate-900 text-sm">{claim.patient} — {claim.pid}</div>
                  <div className="text-xs text-slate-500">{claim.policy}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">{claim.id}</div>

                  {claim.status === 'approved' && (
                    <div className="mt-2 space-y-0.5">
                      <div className="text-xs text-slate-500">Submitted: {claim.submitted} → Approved: {claim.resolved}</div>
                      <div className="font-mono text-xs text-emerald-600 font-semibold">Turnaround: {claim.turnaround}</div>
                    </div>
                  )}

                  {claim.status === 'pending' && (
                    <div className="mt-2">
                      {claim.submitted ? (
                        <div className="text-xs text-amber-600">Pending: {claim.pending_time}</div>
                      ) : (
                        <div className="text-xs text-slate-400">Not yet submitted</div>
                      )}
                      {claim.note && <div className="text-xs text-slate-500 italic mt-0.5">{claim.note}</div>}
                    </div>
                  )}

                  {claim.status === 'rejected' && (
                    <div className="mt-3 space-y-2">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <div className="text-xs font-bold text-red-700 mb-1">❌ CLAIM REJECTED</div>
                        <div className="text-[10px] text-slate-500 mb-1">Reason code: {claim.rejection_code}</div>
                        <div className="text-xs text-red-700">{claim.rejection_reason}</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="text-xs font-semibold text-amber-700">⏳ Under appeal — submitted 2 March 2026</div>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">Ref: {claim.appeal_ref}</div>
                        <div className="text-xs text-slate-500">Expected: Response within 30 business days</div>
                        <div className="font-mono text-[10px] text-amber-600 font-semibold">27 days elapsed · 3 remaining</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors">
                          <FileText className="w-3 h-3" />View Appeal Details
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors">
                          <Phone className="w-3 h-3" />Call Daman Claims
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                          <MessageSquare className="w-3 h-3" />CeenAiX Billing Support
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`font-mono text-lg font-bold ${
                  claim.status === 'approved' ? 'text-emerald-600' :
                  claim.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                }`}>AED {claim.amount}</div>
                {claim.status === 'approved' && <div className="mt-1"><span className="px-2 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold">✅ APPROVED</span></div>}
                {claim.status === 'pending' && (
                  <div className="mt-1 space-y-1">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">⏳ PENDING</span>
                    {claim.submitted && (
                      <div>
                        <button className="block text-[10px] text-amber-700 hover:text-amber-800 font-medium mt-1">
                          Follow Up with {claim.insurer.split(' ')[0]}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {claim.status === 'rejected' && <div className="mt-1"><span className="px-2 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold">❌ REJECTED</span></div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="text-xs font-semibold text-emerald-700 mb-2">💡 Insurance Approval Benchmarks</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
          <div>Daman Gold: <span className="font-semibold text-emerald-700">1–2 hours</span></div>
          <div>ADNIC: <span className="font-semibold text-amber-700">24 hours</span></div>
          <div>Thiqa: <span className="font-semibold text-emerald-700">Same day</span></div>
          <div>AXA Gulf: <span className="font-semibold text-amber-700">4–8 hours</span></div>
        </div>
        <div className="mt-2 text-xs text-slate-500 italic">To minimize rejections: ensure pre-authorization for Daman Basic specialist visits.</div>
      </div>
    </div>
  );
}
