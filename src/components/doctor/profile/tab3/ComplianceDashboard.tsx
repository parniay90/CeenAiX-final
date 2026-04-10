import React, { useEffect, useState } from 'react';
import { ShieldCheck, PenLine, Calendar } from 'lucide-react';

interface ComplianceDashboardProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ showToast }) => {
  const [scoreWidth, setScoreWidth] = useState(0);
  useEffect(() => { setTimeout(() => setScoreWidth(85), 300); }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-emerald-400">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>DHA Compliance Score</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-[40px] font-bold text-emerald-600 leading-none" style={{ fontFamily: 'DM Mono, monospace' }}>85 / 100</p>
            <p className="text-[13px] text-slate-500 mt-1">Compliance Score</p>
            <p className="text-[12px] text-amber-600 mt-0.5 font-medium">Good — 3 action items pending</p>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'License valid', pts: '30/30', color: 'emerald', icon: '✅' },
              { label: 'CME on track (3 categories missing)', pts: '20/30', color: 'amber', icon: '⚠️' },
              { label: 'No violations', pts: '20/20', color: 'emerald', icon: '✅' },
              { label: 'Profile complete (no Arabic bio)', pts: '15/20', color: 'amber', icon: '⚠️' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">{item.icon} {item.label}</span>
                <span className={`text-[12px] font-bold ${item.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`} style={{ fontFamily: 'DM Mono, monospace' }}>
                  +{item.pts} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-[11px] uppercase tracking-widest text-amber-600 font-semibold mb-3">Pending Action Items</p>
          <div className="space-y-3">
            {[
              {
                title: 'Complete 3 CME categories',
                sub: 'Communication · Ethics · Management',
                link: 'Browse Courses →',
              },
              {
                title: 'Add Arabic bio',
                sub: 'Improves patient discovery + profile score',
                link: 'Add Now →',
              },
              {
                title: 'French language — optional',
                sub: '+3% profile completeness',
                soft: true,
                link: null,
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0 ${item.soft ? 'opacity-60' : ''}`}>
                <div>
                  <p className={`text-[13px] font-medium ${item.soft ? 'text-slate-500' : 'text-slate-800'}`}>{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                </div>
                {item.link && (
                  <button onClick={() => showToast(`✅ ${item.title}`)} className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold flex-shrink-0 ml-3 transition-colors">
                    {item.link}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
            <PenLine className="w-4 h-4 text-teal-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Prescribing Compliance</h2>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: 'Prescriptions issued today', value: '7', status: 'ok' },
            { label: 'Critical result acknowledgments', value: '0/1 pending', status: 'warn' },
            { label: 'Controlled substance orders', value: '0 this month', status: 'ok' },
            { label: 'Off-formulary prescriptions', value: '0 this month', status: 'ok' },
            { label: 'Patient allergy overrides', value: '0 (hard stops enforced)', status: 'ok' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-[13px] text-slate-600">{item.label}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-[13px] font-bold ${item.status === 'ok' ? 'text-slate-700' : 'text-red-600'}`} style={{ fontFamily: 'DM Mono, monospace' }}>
                  {item.value}
                </span>
                {item.status === 'warn' && (
                  <button onClick={() => showToast('✅ Opening critical result acknowledgment')} className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[11px] font-bold hover:bg-red-600 transition-colors">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-[12px] text-emerald-600 flex items-center space-x-1.5 pt-2 border-t border-slate-50">
            <span>✅</span><span>Prescribing practices are compliant</span>
          </p>
          <button onClick={() => showToast('✅ Opening prescribing history')} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
            View Prescribing History →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Professional Indemnity</h2>
        </div>
        <div className="p-6 space-y-2">
          {[
            { label: 'Provider', value: 'Medical Defence Union (MDU)' },
            { label: 'Policy', value: 'MED-2026-●●●●●●●●', mono: true },
            { label: 'Valid', value: '1 Jan 2026 — 31 Dec 2026', mono: true },
            { label: 'Status', value: '✅ Active', color: 'text-emerald-600' },
            { label: 'Coverage', value: 'AED 2,000,000 per claim', mono: true },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between py-1">
              <span className="text-[12px] text-slate-400">{field.label}</span>
              <span className={`text-[13px] ${field.color || 'text-slate-800'}`} style={field.mono ? { fontFamily: 'DM Mono, monospace' } : {}}>
                {field.value}
              </span>
            </div>
          ))}
          <button onClick={() => showToast('✅ Opening indemnity certificate')} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium mt-2 transition-colors">
            View Certificate →
          </button>
          <p className="text-[11px] text-amber-600 font-medium">Renewal due: December 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Upcoming DHA Dates</h2>
        </div>
        <div className="p-6 space-y-3">
          {[
            { emoji: '⚠️', month: 'Aug 2026', label: 'CME progress review (recommended)', color: 'text-amber-600' },
            { emoji: '✅', month: 'Oct 2026', label: 'Start license renewal process', color: 'text-emerald-600' },
            { emoji: '🔴', month: 'Dec 2026', label: 'License expiry — renewal deadline', color: 'text-red-600' },
            { emoji: '🔴', month: 'Dec 2026', label: 'CME 30h must be complete', color: 'text-red-600' },
            { emoji: '📋', month: 'Dec 2026', label: 'Professional indemnity renewal', color: 'text-slate-600' },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-base">{item.emoji}</span>
              <span className="text-[11px] font-bold text-slate-400 w-16 flex-shrink-0" style={{ fontFamily: 'DM Mono, monospace' }}>{item.month}</span>
              <span className={`text-[13px] ${item.color}`}>{item.label}</span>
            </div>
          ))}
          <button onClick={() => showToast('✅ DHA dates added to calendar')} className="w-full mt-2 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center space-x-2">
            <span>🔔</span><span>Add All to Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
