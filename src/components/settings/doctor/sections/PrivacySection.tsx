import React, { useState } from 'react';
import { Lock, ExternalLink } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const auditLog = [
  { date: 'Today 11:34 AM', patient: 'Aisha Mohammed', section: 'SOAP Notes', action: 'Viewed' },
  { date: 'Today 10:21 AM', patient: 'Khalid Hassan', section: 'Lab Results', action: 'Viewed' },
  { date: 'Today 9:15 AM', patient: 'Parnia Yazdkhasti', section: 'Prescriptions', action: 'Created' },
  { date: 'Yesterday 4:02 PM', patient: 'Abdullah Hassan', section: 'Vitals', action: 'Updated' },
  { date: 'Yesterday 2:40 PM', patient: 'Sara Al Mansoori', section: 'Health Summary', action: 'Viewed' },
];

const PrivacySection: React.FC<Props> = ({ showToast }) => {
  const [analytics, setAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [auditModal, setAuditModal] = useState(false);

  return (
    <>
      <SettingsCard id="privacy" title="Privacy & Data" icon={Lock} iconBg="bg-slate-100" iconColor="text-slate-700">
        <div className="mx-6 mt-4 mb-3 p-4 bg-blue-50 border border-teal-200 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[14px] font-semibold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              🇦🇪 DHA Data Compliance
            </p>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              ✅ Compliant
            </span>
          </div>
          <p className="text-[12px] text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            All patient data handled per UAE PDPL (Federal Law No. 45 of 2021) and DHA standards.
            10-year clinical record retention mandatory.
          </p>
        </div>

        <SettingsRow
          label="Platform Usage Analytics"
          description="Share anonymous usage data to improve CeenAiX"
          type="toggle"
          toggleValue={analytics}
          onToggle={(v) => { setAnalytics(v); showToast(`✅ Usage analytics ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Send Crash Reports"
          description="Auto-report app errors (no patient data included)"
          type="toggle"
          toggleValue={crashReports}
          onToggle={(v) => { setCrashReports(v); showToast(`✅ Crash reports ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Patient Record Retention"
          description="Cannot be modified — UAE legal requirement"
          type="info"
          value="10 years (DHA mandatory)"
        />
        <SettingsRow
          label="View My Access Audit Log"
          description="Every patient record you accessed, when"
          type="link"
          onLinkClick={() => setAuditModal(true)}
        />
        <SettingsRow
          label="CeenAiX Privacy Policy"
          description="Platform privacy and data handling policy"
          type="link"
          onLinkClick={() => showToast('✅ Opening privacy policy')}
        />
        <SettingsRow
          label="UAE Personal Data Protection Law"
          description="Federal Law No. 45 of 2021"
          type="link"
          onLinkClick={() => showToast('✅ Opening PDPL reference')}
          last
        />
      </SettingsCard>

      {auditModal && (
        <SimpleModal title="My Access Audit Log" onClose={() => setAuditModal(false)}>
          <div className="space-y-2 mb-4">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>{entry.patient}</p>
                  <p className="text-[11px] text-slate-400">{entry.section} · {entry.date}</p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  entry.action === 'Viewed' ? 'bg-blue-50 text-blue-600' :
                  entry.action === 'Created' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {entry.action}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast('✅ Audit log exported as PDF')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors text-[13px] flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Export Audit Log as PDF</span>
          </button>
        </SimpleModal>
      )}
    </>
  );
};

export default PrivacySection;
