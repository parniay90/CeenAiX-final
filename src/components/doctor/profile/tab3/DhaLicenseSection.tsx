import React, { useEffect, useState } from 'react';
import { ShieldCheck, Copy, Download, Bell, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DhaLicenseSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const DAYS_REMAINING = 269;
const TOTAL_DAYS = 365;

const DhaLicenseSection: React.FC<DhaLicenseSectionProps> = ({ showToast }) => {
  const [ringProgress, setRingProgress] = useState(0);
  const pct = Math.round((DAYS_REMAINING / TOTAL_DAYS) * 100);

  useEffect(() => {
    setTimeout(() => setRingProgress(pct), 300);
  }, [pct]);

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (ringProgress / 100) * circumference;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                DHA Practitioner License
              </h2>
              <p className="text-[12px] text-slate-500">Department of Health · Dubai, UAE</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-emerald-600 text-white text-[13px] font-bold rounded-full">✅ ACTIVE</span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            {[
              { label: 'License Number', value: 'DHA-PRAC-2018-047821', mono: true, teal: true, copy: true },
              { label: 'Category', value: 'Specialist — Cardiology', mono: false },
              { label: 'Specialty', value: 'Cardiology (Interventional)', mono: false },
              { label: 'Issue Date', value: '15 January 2018', mono: true },
              { label: 'Expiry Date', value: '31 December 2026', mono: true },
              { label: 'Last Renewed', value: '12 January 2025', mono: true },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">{field.label}</p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[14px] ${field.teal ? 'font-bold text-teal-600' : 'text-slate-800'}`}
                    style={field.mono ? { fontFamily: 'DM Mono, monospace' } : {}}
                  >
                    {field.value}
                  </span>
                  {field.copy && (
                    <button
                      onClick={() => showToast('✅ License number copied')}
                      className="text-slate-300 hover:text-teal-500 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-8 py-6 bg-slate-50 rounded-2xl mb-5">
            <div className="relative flex-shrink-0">
              <svg width="120" height="120" className="-rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="#10B981" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[18px] font-bold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace' }}>{ringProgress}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[48px] font-bold text-emerald-600 leading-none" style={{ fontFamily: 'DM Mono, monospace' }}>
                {DAYS_REMAINING}
              </p>
              <p className="text-[14px] text-slate-500 mt-1">days until expiry</p>
              <p className="text-[13px] text-slate-400 mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                Valid until 31 December 2026
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <StatusRow icon="check" label="License valid and active" />
            <StatusRow icon="check" label="No DHA compliance violations" />
            <StatusRow icon="warn" label="CME: 3 categories with 0 hours — action needed" />
          </div>

          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-3">License Renewal Roadmap</p>
            <div className="flex items-center">
              {[
                { label: 'Valid', sub: 'Now', done: true },
                { label: 'CME Complete', sub: 'Dec 2026', warn: true },
                { label: 'Apply', sub: 'Oct 2026', todo: true },
                { label: 'Renewed', sub: '2027', todo: true },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      step.done ? 'bg-emerald-500 text-white' :
                      step.warn ? 'bg-amber-500 text-white' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {step.done ? '✅' : step.warn ? '⚠️' : i + 1}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 text-center font-medium">{step.label}</p>
                    <p className="text-[9px] text-slate-400">{step.sub}</p>
                  </div>
                  {i < 3 && <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-4" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Recommended: start renewal process October 2026</p>
            <button onClick={() => showToast('✅ Renewal reminder set for October 2026')} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium mt-1 transition-colors flex items-center space-x-1">
              <Bell className="w-3.5 h-3.5" /><span>Set Renewal Reminder</span>
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            {['License document: On file', 'Insurance indemnity: Valid', 'Good Standing Certificate: Valid'].map((doc) => (
              <p key={doc} className="text-[12px] text-emerald-600 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /><span>{doc}</span>
              </p>
            ))}
            <div className="flex items-center space-x-3 mt-2">
              <button onClick={() => showToast('✅ Opening DHA license document')} className="flex items-center space-x-1.5 text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
                <FileText className="w-3.5 h-3.5" /><span>View License Document</span>
              </button>
              <button onClick={() => showToast('✅ License document downloading')} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
                <Download className="w-3.5 h-3.5" /><span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusRow: React.FC<{ icon: 'check' | 'warn'; label: string }> = ({ icon, label }) => (
  <div className={`flex items-center space-x-2 text-[12px] ${icon === 'check' ? 'text-emerald-600' : 'text-amber-600'}`}>
    {icon === 'check' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
    <span>{label}</span>
  </div>
);

export default DhaLicenseSection;
