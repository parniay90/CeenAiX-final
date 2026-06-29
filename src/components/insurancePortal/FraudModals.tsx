import React, { useState, useEffect } from 'react';
import { X, Lock, Ban, FileText, Check, ChevronDown } from 'lucide-react';
import type { FraudCase } from '../../data/fraudData';

const MONO = { fontFamily: 'DM Mono, monospace' };

// ── Freeze Claims Modal ────────────────────────────────────────────────────────

export function FreezeClaimsModal({ fraudCase, onClose, onConfirm }: {
  fraudCase: FraudCase; onClose: () => void; onConfirm: () => void;
}) {
  const [reason, setReason] = useState('investigation');
  const [notifyProvider, setNotifyProvider] = useState(true);
  const [logDaman, setLogDaman] = useState(true);
  const [notifyAdmin, setNotifyAdmin] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setDone(true); setTimeout(onConfirm, 1200); }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: 440 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1E3A5F', minHeight: 56 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Lock size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">Freeze Provider Claims</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <X size={14} className="text-white" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check size={28} className="text-emerald-600" />
            </div>
            <p className="text-base font-bold text-emerald-700">Claims Frozen Successfully</p>
            <p className="text-sm text-slate-500">{fraudCase.claimsFrozen} claims · <span style={MONO}>AED {fraudCase.amountAtRisk.toLocaleString()}</span> protected</p>
            <p className="text-xs text-slate-400">Provider notification sent</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 space-y-1">
              <p className="text-sm font-bold text-slate-800">Freezing claims for: {fraudCase.subjectName}</p>
              <p className="text-xs text-slate-500">{fraudCase.subjectFacility} · {fraudCase.dhaLicense ?? 'No DHA license'}</p>
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-700">{fraudCase.claimsFrozen} claims already frozen by AI ✅</p>
                <p className="text-xs text-blue-600" style={MONO}>AED {fraudCase.amountAtRisk.toLocaleString()} blocked from payment</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">What Freezing Does</p>
              {[
                { ok: true, text: 'Blocks all pending payments to provider' },
                { ok: true, text: 'Returns claims to "Under Review" status' },
                { ok: true, text: 'Sends freeze notification to provider' },
                { ok: true, text: 'Creates DHA compliance record' },
                { ok: true, text: 'Allows unfreezing when investigation complete' },
                { ok: false, text: 'Does NOT affect previously paid claims' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={item.ok ? 'text-emerald-500' : 'text-slate-400'}>{item.ok ? '✅' : '❌'}</span>
                  <span className={item.ok ? 'text-slate-700' : 'text-slate-400'}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Reason</p>
              {[
                { id: 'investigation', label: 'Active fraud investigation' },
                { id: 'audit', label: 'Audit review' },
                { id: 'docs', label: 'Documentation required' },
                { id: 'other', label: 'Other' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="freeze-reason" value={opt.id} checked={reason === opt.id} onChange={() => setReason(opt.id)} className="text-blue-600" />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { state: notifyProvider, setter: setNotifyProvider, label: 'Send freeze notification to provider' },
                { state: logDaman, setter: setLogDaman, label: 'Log freeze in Daman compliance system' },
                { state: notifyAdmin, setter: setNotifyAdmin, label: 'Notify CeenAiX admin team' },
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.state} onChange={e => item.setter(e.target.checked)} className="rounded text-blue-600" />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {!done && (
          <div className="px-6 pb-5 space-y-2">
            <button onClick={handleConfirm} disabled={confirming} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 bg-blue-600">
              {confirming ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg> Confirming...</>
              ) : (
                <><Lock size={15} /> Confirm Freeze</>
              )}
            </button>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Suspend Provider Modal ─────────────────────────────────────────────────────

export function SuspendProviderModal({ fraudCase, onClose, onConfirm }: {
  fraudCase: FraudCase; onClose: () => void; onConfirm: () => void;
}) {
  const [duration, setDuration] = useState('pending');
  const [reason, setReason] = useState('investigation');
  const [confirmed, setConfirmed] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setSuspending(true);
    setTimeout(() => { setSuspending(false); setDone(true); setTimeout(onConfirm, 1200); }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: 480 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#7F1D1D', minHeight: 56 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Ban size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">Suspend Provider Access</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <X size={14} className="text-white" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Ban size={24} className="text-red-600" />
            </div>
            <p className="text-base font-bold text-red-700">Provider Account Suspended</p>
            <p className="text-sm text-slate-500">{fraudCase.subjectName} — pending investigation</p>
            <p className="text-xs text-slate-400">DHA notification sent · CeenAiX admin notified</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div className="p-4 rounded-xl border border-red-200 bg-red-50">
              <p className="text-sm font-bold text-red-800 mb-2">⚠️ This is a significant action. Suspending {fraudCase.subjectName} will:</p>
              <ul className="space-y-1 text-xs text-red-700">
                <li>• Block access to CeenAiX platform immediately</li>
                <li>• Prevent new claims submission</li>
                <li>• Notify the provider of suspension</li>
                <li>• Create a formal DHA record</li>
                <li className="text-slate-500 mt-2">This does NOT revoke their DHA license. License revocation requires a separate DHA process.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Suspension Duration</p>
              {[
                { id: 'pending', label: 'Pending investigation (indefinite, lift manually)' },
                { id: '30', label: '30 days' },
                { id: '90', label: '90 days' },
                { id: 'permanent', label: 'Permanent removal from network' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="duration" value={opt.id} checked={duration === opt.id} onChange={() => setDuration(opt.id)} className="text-red-600" />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Reason</p>
              <div className="relative">
                <select value={reason} onChange={e => setReason(e.target.value)} className="w-full appearance-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="investigation">Active fraud investigation</option>
                  <option value="pattern">Pattern anomaly under review</option>
                  <option value="dha">DHA compliance violation</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 border-red-200 bg-red-50">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="rounded mt-0.5 text-red-600" />
              <span className="text-sm font-semibold text-red-800">I confirm this action and understand it will immediately restrict provider access</span>
            </label>
          </div>
        )}

        {!done && (
          <div className="px-6 pb-5 space-y-2">
            <button onClick={handleConfirm} disabled={!confirmed || suspending} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 bg-red-600">
              {suspending ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg> Suspending...</>
              ) : (
                <><Ban size={15} /> Confirm Suspension</>
              )}
            </button>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DHA Report Modal ───────────────────────────────────────────────────────────

export function DhaReportModal({ fraudCase, onClose, onConfirm }: {
  fraudCase: FraudCase; onClose: () => void; onConfirm: () => void;
}) {
  const [reportType, setReportType] = useState('single');
  const [format, setFormat] = useState('xml');
  const [method, setMethod] = useState('download');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: 560 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#0F2D4A', minHeight: 56 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">Generate DHA Fraud Report</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <X size={14} className="text-white" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
              <FileText size={24} className="text-teal-600" />
            </div>
            <p className="text-base font-bold text-teal-700">DHA Report Ready</p>
            <p className="text-sm font-semibold text-slate-700" style={MONO}>FRAUD-2026-04-001.xml</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={onConfirm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#0D9488' }}>
                Download File
              </button>
              <button onClick={onConfirm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#0F2D4A' }}>
                Submit to DHA Sheryan
              </button>
            </div>
            <p className="text-xs text-amber-600 font-semibold">⏰ DHA submission deadline: 9 April 2026 (48 hours)</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Report Type</p>
              {[
                { id: 'single', label: `Single case report (${fraudCase.caseRef})` },
                { id: 'all', label: 'All active cases (5 cases)' },
                { id: 'monthly', label: 'Monthly summary (April 2026)' },
                { id: 'quarterly', label: 'Quarterly report (Q1 2026 — DHA required)' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="report-type" value={opt.id} checked={reportType === opt.id} onChange={() => setReportType(opt.id)} className="text-teal-600" />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl border border-teal-200" style={{ backgroundColor: '#F0FDFA' }}>
              <p className="text-xs font-bold text-teal-700 mb-2">DHA FORMAT PREVIEW</p>
              <div className="text-xs text-teal-800 space-y-0.5" style={MONO}>
                <p>DAMAN NATIONAL HEALTH INSURANCE</p>
                <p>FRAUD DETECTION REPORT — DHA FORMAT</p>
                <p>Reference: DHA-FRAUD-2026-04-001</p>
                <p>Reporting period: 7 April 2026</p>
                <p>Cases included: 1 ({fraudCase.caseRef})</p>
                <p>AI confidence: {fraudCase.confidence}% ({fraudCase.riskLevel})</p>
                <p>Amount at risk: AED {fraudCase.amountAtRisk.toLocaleString()}</p>
                <p>Claims frozen: {fraudCase.claimsFrozen}</p>
                <p>Status: Active investigation</p>
                <p>Nabidh verification: {fraudCase.nabidhMatch}/{fraudCase.nabidhTotal} ({Math.round(fraudCase.nabidhMatch / fraudCase.nabidhTotal * 100) || 0}%)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Format</p>
                {['xml', 'pdf', 'both'].map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} className="text-teal-600" />
                    <span className="text-sm text-slate-700 uppercase">{f}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Submission</p>
                {[
                  { id: 'download', label: 'Download (manual)' },
                  { id: 'api', label: 'DHA Sheryan API (auto)' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="method" value={opt.id} checked={method === opt.id} onChange={() => setMethod(opt.id)} className="text-teal-600" />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50">
              <p className="text-xs text-blue-700 leading-relaxed">Fraud reports must be submitted to DHA within 48 hours of case opening per UAE Insurance Law Article 47. Quarterly summary due first week of each quarter.</p>
            </div>
          </div>
        )}

        {!done && (
          <div className="px-6 pb-5">
            <button onClick={handleGenerate} disabled={generating} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 hover:opacity-90" style={{ backgroundColor: '#0D9488' }}>
              {generating ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg> Compiling case data...</>
              ) : (
                <><FileText size={15} /> Generate DHA Report</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── False Positive Modal ───────────────────────────────────────────────────────

export function FalsePositiveModal({ fraudCase, onClose, onConfirm }: {
  fraudCase: FraudCase; onClose: () => void; onConfirm: () => void;
}) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!reason || !notes.trim()) return;
    setConfirming(true);
    setTimeout(() => { setConfirming(false); onConfirm(); }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: 420 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#0F2D4A', minHeight: 56 }}>
          <span className="text-white font-semibold text-base">Clear Fraud Case — False Positive?</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <X size={14} className="text-white" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-slate-600">Clearing <span className="font-bold text-slate-800">{fraudCase.caseRef}</span> as a false positive. This cannot be undone without creating a new case.</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Why Cleared (Required)</p>
            {[
              { id: 'high_volume', label: 'High-volume specialty clinic (legitimate)' },
              { id: 'docs', label: 'Provider documentation verified' },
              { id: 'nabidh', label: 'Nabidh records found on manual check' },
              { id: 'patient', label: 'Patient confirmed visits' },
              { id: 'other', label: 'Other' },
            ].map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="fp-reason" value={opt.id} checked={reason === opt.id} onChange={() => setReason(opt.id)} className="text-emerald-600" />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Notes (Required)</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Explain why this case is a false positive..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Impact on Provider</p>
            {[
              'Provider account unfrozen',
              'Claims released for processing',
              'Provider notified — apology included',
              'AI model improvement feedback sent',
              'Case logged as false positive (for AI training)',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                <span className="text-emerald-500">✅</span> {s}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-5 space-y-2">
          <button onClick={handleConfirm} disabled={!reason || !notes.trim() || confirming} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 bg-emerald-600">
            {confirming ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" /></svg> Clearing case...</>
            ) : (
              '✅ Confirm — Mark as False Positive'
            )}
          </button>
          <button onClick={onClose} className="w-full py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── AI Scan Overlay ────────────────────────────────────────────────────────────

const SCAN_STEPS = [
  { delay: 400, text: '✅ Al Noor Medical Center — Normal patterns', ok: true },
  { delay: 900, text: '✅ Dubai Specialist Hospital — Normal', ok: true },
  { delay: 1400, text: '✅ Emirates Medical Center — Under review (existing case)', ok: true },
  { delay: 1900, text: '✅ All pharmacy claims — Validated', ok: true },
  { delay: 2500, text: '✅ 308 claims — No anomalies detected', ok: true },
  { delay: 3200, text: '⚠️ 4 claims — Minor pattern alerts (auto-resolved)', ok: false },
];

export function AIScanOverlay({ onClose }: { onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [visibleResults, setVisibleResults] = useState<typeof SCAN_STEPS>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    SCAN_STEPS.forEach((s, i) => {
      setTimeout(() => setVisibleResults(r => [...r, s]), s.delay);
    });
    setTimeout(() => setDone(true), 4000);
  }, []);

  const scanMessages = [
    'Scanning 312 claims today...',
    'Checking 8,247 member records...',
    'Cross-referencing 1,247 provider patterns...',
    'Comparing against fraud typology database...',
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15,45,74,0.85)' }}>
      <div className="flex flex-col items-center" style={{ width: 480 }}>
        {/* Pulse ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#7C3AED' }} />
          <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{ backgroundColor: 'rgba(124,58,237,0.2)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-violet-400">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12h2l2-4 2 8 2-4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>AI Fraud Detection Scan</p>
        <p className="text-violet-300 text-sm mb-6">Analyzing all claims · Cross-referencing Nabidh</p>

        {/* Progress bar */}
        <div className="w-full mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 8 }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#0D9488' }} />
        </div>

        {/* Step messages */}
        <div className="w-full space-y-1.5 mb-6">
          {scanMessages.map((msg, i) => (
            <p key={i} className="text-sm animate-pulse" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace' }}>{msg}</p>
          ))}
        </div>

        {/* Live results */}
        <div className="w-full space-y-2 min-h-[120px]">
          {visibleResults.map((r, i) => (
            <p key={i} className={`text-sm font-medium transition-all ${r.ok ? 'text-emerald-400' : 'text-amber-400'}`}
              style={{ fontFamily: 'DM Mono, monospace' }}>
              {r.text}
            </p>
          ))}
        </div>

        {done && (
          <div className="w-full mt-6 text-center space-y-3">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <p className="text-emerald-400 font-bold">✅ Full scan complete</p>
              <p className="text-emerald-300 text-sm mt-1">312 claims analyzed · 0 new fraud cases</p>
              <p className="text-emerald-300 text-sm">5 existing cases unchanged</p>
            </div>
            <button onClick={onClose} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#0D9488' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
