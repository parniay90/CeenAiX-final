import React, { useState } from 'react';
import { Info, RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const AboutSection: React.FC<Props> = ({ showToast }) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);
  const [whatsNewModal, setWhatsNewModal] = useState(false);

  const checkUpdate = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateChecked(true);
      showToast('✅ CeenAiX is up to date');
    }, 2000);
  };

  return (
    <>
      <SettingsCard id="about" title="About CeenAiX" icon={Info} iconBg="bg-slate-100" iconColor="text-slate-500">
        <div className="p-6">
          <div className="text-center mb-6 py-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
              C
            </div>
            <h2 className="text-[20px] font-bold text-teal-700 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              CeenAiX
            </h2>
            <p className="text-[13px] text-slate-500 mb-1">Intelligent Healthcare — Doctor Portal</p>
            <p className="text-[12px] font-mono text-slate-400">Doctor Portal v2.4.1 · Released 2 April 2026</p>
            <p className="text-[12px] text-slate-400 mt-1">© 2026 AryAiX LLC (Intelligent Ventures)</p>
            <p className="text-[12px] text-slate-400">Dilan Tower, Al Jadaf, Dubai, UAE</p>
            <div className="flex items-center justify-center space-x-2 mt-4 flex-wrap gap-2">
              {[
                { label: 'DHA ✅', bg: 'bg-blue-50', text: 'text-blue-700' },
                { label: 'Nabidh ✅', bg: 'bg-teal-50', text: 'text-teal-700' },
                { label: 'FHIR R4 ✅', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                { label: 'AES-256 ✅', bg: 'bg-slate-50', text: 'text-slate-700' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`px-2.5 py-1 ${badge.bg} ${badge.text} text-[11px] font-semibold rounded-full border border-current/20`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SettingsRow
          label="App Version"
          type="info"
          value="Doctor Portal v2.4.1 (build 241)"
        />
        <SettingsRow
          label="What's New in v2.4.1"
          description="Released 2 April 2026"
          type="link"
          onLinkClick={() => setWhatsNewModal(true)}
        />
        <SettingsRow
          label="DHA Platform License"
          type="info"
          value="DHA-PLAT-2025-001847"
        />
        <SettingsRow
          label="Security Standards"
          type="info"
          value="AES-256 · TLS 1.3 · ISO 27001"
        />
        <div
          className={`flex items-center px-6 py-4 min-h-[56px] cursor-pointer hover:bg-[#F9FFFE] transition-colors border-b border-slate-50 ${
            updateChecked ? 'text-emerald-600' : 'text-teal-600'
          }`}
          onClick={!checkingUpdate && !updateChecked ? checkUpdate : undefined}
        >
          <div className="flex-1">
            <p className="text-[14px] font-medium text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Check for Updates
            </p>
          </div>
          {checkingUpdate ? (
            <RefreshCw className="w-4 h-4 text-teal-500 animate-spin" />
          ) : updateChecked ? (
            <div className="flex items-center space-x-1 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[12px] font-medium">Up to date</span>
            </div>
          ) : (
            <RefreshCw className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <SettingsRow
          label="Terms of Service"
          type="link"
          onLinkClick={() => showToast('✅ Opening Terms of Service')}
        />
        <SettingsRow
          label="Privacy Policy"
          type="link"
          onLinkClick={() => showToast('✅ Opening Privacy Policy')}
        />
        <SettingsRow
          label="Open Source Licenses"
          type="link"
          onLinkClick={() => showToast('✅ Opening Licenses')}
          last
        />
      </SettingsCard>

      {whatsNewModal && (
        <SimpleModal title="What's New in v2.4.1" onClose={() => setWhatsNewModal(false)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-medium">v2.4.1</span>
              <span className="text-[11px] text-slate-400">2 April 2026</span>
            </div>
            {[
              { type: 'NEW', text: 'AI-powered SOAP note drafting', color: 'text-emerald-600 bg-emerald-50' },
              { type: 'NEW', text: 'Holter monitor integration', color: 'text-emerald-600 bg-emerald-50' },
              { type: 'NEW', text: 'Pharmacy substitution quick-approve', color: 'text-emerald-600 bg-emerald-50' },
              { type: 'IMPROVED', text: 'Faster patient record loading', color: 'text-blue-600 bg-blue-50' },
              { type: 'FIXED', text: 'BP chart reset issue', color: 'text-amber-600 bg-amber-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold flex-shrink-0 mt-0.5 ${item.color}`}>
                  {item.type}
                </span>
                <p className="text-[13px] text-slate-700" style={{ fontFamily: 'Inter, sans-serif' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default AboutSection;
