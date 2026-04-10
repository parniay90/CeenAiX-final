import { useState } from 'react';
import { RefreshCw, ChevronRight, Download, Upload, CheckCircle } from 'lucide-react';

const labPending = [
  { id: 'LAB-003891', patient: 'Aisha Mohammed', tests: 'BNP, Electrolytes, Renal Function', reason: 'Results pending — awaiting analyzer', status: 'In Progress' },
  { id: 'LAB-002847', patient: 'Ibrahim Al Marzouqi', tests: 'K+ Panel', reason: 'Critical value — held pending notification', status: 'Awaiting notification' },
  { id: 'LAB-003450', patient: 'Mariam Al Suwaidi', tests: 'PT, aPTT, INR, Fibrinogen', reason: 'BCS XP maintenance — rerouted to backup', status: 'In Progress' },
  { id: 'LAB-003567', patient: 'Hassan Al Mansoori', tests: 'Culture & Sensitivity', reason: 'Culture in progress — 48–72h cycle', status: 'In Progress' },
  { id: 'LAB-003612', patient: 'Fatima Ibrahim', tests: 'Urinalysis, Urine Culture', reason: 'Awaiting supervisor verification', status: 'Pending Verify' },
];

const radiologyPending = [
  { id: 'CT-20260407-004', patient: 'Mohammed Al Khalidi', study: 'CT Chest w/ contrast', reason: 'Report pending radiologist sign-off' },
  { id: 'MRI-20260407-001', patient: 'Sarah Al Hamdan', study: 'Brain MRI w/wo contrast', reason: 'Study still in progress' },
  { id: 'USS-20260407-003', patient: 'Fatima Ibrahim', study: 'Obstetric USS', reason: 'Study still in progress' },
];

const history = [
  { date: '7 Apr · 2:05 PM', patient: 'Aisha Mohammed', resource: 'Observation', status: '✅', ref: 'NABIDH-OBS-20260407-00841' },
  { date: '7 Apr · 1:52 PM', patient: 'Ibrahim Al Marzouqi', resource: 'DiagnosticReport', status: '✅', ref: 'NABIDH-DR-20260407-00839' },
  { date: '7 Apr · 12:30 PM', patient: 'Yousuf Al Zaabi', resource: 'DiagnosticReport', status: '✅', ref: 'NABIDH-DR-20260407-00821' },
  { date: '7 Apr · 11:15 AM', patient: 'Sara Al Khalili', resource: 'Observation', status: '✅', ref: 'NABIDH-OBS-20260407-00804' },
  { date: '7 Apr · 10:45 AM', patient: 'Salem Al Mazrouei', resource: 'ImagingStudy', status: '✅', ref: 'NABIDH-IS-20260407-00797' },
];

export default function NabidhSync() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmitAll() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2500));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-teal-700 font-medium">NABIDH Submission Centre</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="bg-teal-50 border border-teal-300 rounded-xl p-4 flex items-center gap-4">
          <div className="text-3xl">🇦🇪</div>
          <div className="flex-1">
            <div className="font-bold text-teal-800 text-base">NABIDH Health Information Exchange</div>
            <div className="text-teal-600 text-xs">National Unified Health Record · FHIR R4 · Real-time submission</div>
            <div className="flex items-center gap-2 mt-1">
              <RefreshCw size={10} className="text-emerald-500 animate-spin" />
              <span className="text-emerald-600 text-xs">✅ Connected · Last sync: 12 seconds ago</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-teal-700 text-xs">NABIDH-VENDOR-2024-00847</div>
            <div className="text-teal-500 text-xs">Vendor ID</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '67/75 submitted', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: '8 pending', icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
            { label: '0 failed', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Last bulk: 8:00 AM', icon: '📤', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map((k, i) => (
            <div key={i} className={`${k.bg} border ${k.border} rounded-xl p-3 text-center`}>
              <div className="text-xl mb-1">{k.icon}</div>
              <div className={`font-bold text-sm ${k.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-bold text-indigo-700 text-sm mb-3 flex items-center gap-2">
              🧪 Lab Results
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-slate-600">Submitted: 42/47</span>
                <span className="font-mono text-indigo-600">89%</span>
              </div>
              <div className="bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '89%' }} />
              </div>
              <div className="flex gap-4 text-xs">
                <span className="text-amber-600">5 pending</span>
                <span className="text-emerald-600">0 failed</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {labPending.map((p, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-mono text-indigo-600 font-bold">{p.id}</div>
                      <div className="font-medium text-slate-700">{p.patient}</div>
                      <div className="text-slate-500">{p.tests}</div>
                      <div className="text-slate-400 mt-0.5">{p.reason}</div>
                    </div>
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                        p.status === 'Awaiting notification' ? 'bg-amber-100 text-amber-700' :
                        'bg-violet-100 text-violet-700'
                      }`} style={{ fontSize: 9 }}>
                        {p.status}
                      </span>
                      {p.status === 'Awaiting notification' && (
                        <button className="mt-1 block w-full bg-amber-100 text-amber-700 py-0.5 rounded text-xs hover:bg-amber-200 transition-colors">
                          📞 Notify First
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="font-semibold text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>FHIR RESOURCES SUBMITTED</div>
              {[['Observation', '3,241'], ['DiagnosticReport', '189'], ['ServiceRequest', '47']].map(([r, c]) => (
                <div key={r} className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-600">{r}</span>
                  <span className="font-mono text-emerald-600 font-bold">{c} ✅</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="font-bold text-blue-700 text-sm mb-3 flex items-center gap-2">
              🩻 Radiology Reports
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-slate-600">Submitted: 25/28</span>
                <span className="font-mono text-blue-600">89%</span>
              </div>
              <div className="bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }} />
              </div>
              <div className="flex gap-4 text-xs">
                <span className="text-amber-600">3 pending</span>
                <span className="text-emerald-600">0 failed</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {radiologyPending.map((p, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-2.5 text-xs">
                  <div className="font-mono text-blue-600 font-bold">{p.id}</div>
                  <div className="font-medium text-slate-700">{p.patient}</div>
                  <div className="text-slate-500">{p.study}</div>
                  <div className="text-slate-400 mt-0.5">{p.reason}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="font-semibold text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>FHIR RESOURCES SUBMITTED</div>
              {[['ImagingStudy', '28'], ['DiagnosticReport (radiology)', '25']].map(([r, c]) => (
                <div key={r} className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-600">{r}</span>
                  <span className="font-mono text-emerald-600 font-bold">{c} ✅</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          {submitted ? (
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle size={20} />
              <div>
                <div className="font-bold text-sm">8/8 submitted successfully ✅</div>
                <div className="text-xs text-emerald-500">All pending records submitted to NABIDH HIE · 2:08 PM</div>
              </div>
            </div>
          ) : (
            <div>
              {submitting && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-violet-700 font-medium">Submitting all 8 pending records...</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2">
                    <div className="bg-violet-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              )}
              <button
                onClick={handleSubmitAll}
                disabled={submitting}
                className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {submitting ? 'Submitting...' : '📤 Submit All 8 Pending'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="font-semibold text-slate-700 text-sm">Submission History — Today</div>
            <button className="flex items-center gap-1.5 text-slate-600 text-xs hover:text-slate-800 transition-colors">
              <Download size={12} /> Export Log
            </button>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Date / Time', 'Patient', 'Resource Type', 'Status', 'NABIDH Reference'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-slate-400 font-semibold" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-slate-500">{h.date}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-700">{h.patient}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      h.resource === 'Observation' ? 'bg-indigo-100 text-indigo-700' :
                      h.resource === 'ImagingStudy' ? 'bg-blue-100 text-blue-700' :
                      'bg-teal-100 text-teal-700'
                    }`}>
                      {h.resource}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-emerald-600 font-medium">{h.status}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500" style={{ fontSize: 9 }}>{h.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
