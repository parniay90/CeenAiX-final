import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SectionDivider from '../SectionDivider';
import SimpleModal from '../SimpleModal';

interface ClinicalToolsSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const ClinicalToolsSection: React.FC<ClinicalToolsSectionProps> = ({ showToast }) => {
  const [defaultPharmacy, setDefaultPharmacy] = useState("Patient's preferred");
  const [interactionLevel, setInteractionLevel] = useState('Moderate+');
  const [genericSub, setGenericSub] = useState('Ask me');
  const [rxValidity, setRxValidity] = useState('30 days');
  const [pinTimeout, setPinTimeout] = useState('Per session');
  const [defaultLab, setDefaultLab] = useState('Dubai Medical Laboratory');
  const [statNotifs, setStatNotifs] = useState(true);
  const [autoReview, setAutoReview] = useState(false);
  const [criticalReminder, setCriticalReminder] = useState('Every 15 minutes');
  const [nabidh, setNabidh] = useState(true);
  const [nabidPull, setNabidPull] = useState(true);
  const [pharmModal, setPharmModal] = useState(false);
  const [rxModal, setRxModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);

  const pharmacyOptions = ["Patient's preferred", 'Al Shifa Pharmacy — Al Barsha', 'Dubai Central Pharmacy — DIFC', 'Always ask me'];
  const rxOptions = ['14 days', '30 days', '60 days', '90 days'];
  const pinOptions = ['Per session', 'Per prescription', 'Every 4 hours'];
  const reminderOptions = ['Every 5 min', 'Every 15 min', 'Every 30 min', 'Off'];

  return (
    <>
      <SettingsCard
        id="clinical-tools"
        title="Clinical Tools"
        icon={Stethoscope}
        iconBg="bg-teal-100"
        iconColor="text-teal-600"
        description="Configure how clinical tools behave"
      >
        <SectionDivider label="PRESCRIBING" />

        <SettingsRow
          label="Default Prescription Pharmacy"
          description="Pre-selected pharmacy for new prescriptions"
          type="value"
          value={defaultPharmacy}
          onValueClick={() => setPharmModal(true)}
        />
        <SettingsRow
          label="Drug Interaction Alert Level"
          description="Minimum interaction severity to show alerts"
          type="pills"
          pills={[{ label: 'All', value: 'All' }, { label: 'Moderate+', value: 'Moderate+' }, { label: 'Major only', value: 'Major only' }]}
          activePill={interactionLevel}
          onPillChange={(v) => { setInteractionLevel(v); showToast(`✅ Interaction alerts set to ${v}`); }}
        />
        <SettingsRow
          label="Generic Substitution Default"
          description="Pre-set response to pharmacy generic queries"
          type="pills"
          pills={[{ label: 'Always allow', value: 'Always allow' }, { label: 'Ask me', value: 'Ask me' }, { label: 'Never allow', value: 'Never allow' }]}
          activePill={genericSub}
          onPillChange={(v) => { setGenericSub(v); showToast(`✅ Generic substitution set to ${v}`); }}
        />
        <SettingsRow
          label="Default Prescription Validity"
          description="How long prescriptions remain valid"
          type="value"
          value={rxValidity}
          onValueClick={() => setRxModal(true)}
        />
        <SettingsRow
          label="Prescribing PIN Timeout"
          description="How long before PIN must be re-entered to sign"
          type="value"
          value={pinTimeout}
          onValueClick={() => setPinModal(true)}
        />

        <SectionDivider label="LAB REFERRALS" />

        <SettingsRow
          label="Default Lab for Orders"
          description="Pre-selected lab when ordering tests"
          type="value"
          value={defaultLab}
          onValueClick={() => showToast('✅ Lab selection modal would open')}
        />
        <SettingsRow
          label="STAT Order Phone Alerts"
          description="Receive a call from lab for STAT critical results"
          type="toggle"
          toggleValue={statNotifs}
          onToggle={(v) => { setStatNotifs(v); showToast(`✅ STAT alerts ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Mark Normal Results Read Automatically"
          description="Auto-mark results as reviewed if all values normal"
          type="toggle"
          toggleValue={autoReview}
          onToggle={(v) => {
            setAutoReview(v);
            if (v) showToast('⚠️ Even normal results may contain clinically relevant trends', 'warning');
            else showToast('✅ Auto-review disabled');
          }}
        />
        <SettingsRow
          label="Critical Result Reminder"
          description="Re-alert if critical result unacknowledged"
          type="value"
          value={criticalReminder}
          onValueClick={() => setReminderModal(true)}
        />

        <SectionDivider label="NABIDH HIE" />

        <SettingsRow
          label="Auto-Sync to Nabidh HIE"
          description="Automatically submit clinical data to national record"
          type="toggle"
          toggleValue={nabidh}
          onToggle={(v) => {
            setNabidh(v);
            if (!v) showToast('⚠️ Disabling Nabidh sync may affect DHA compliance', 'warning');
            else showToast('✅ Nabidh auto-sync enabled');
          }}
        />
        <SettingsRow
          label="What to Sync to Nabidh"
          description="Clinical data shared to national record"
          type="value"
          value="All clinical data (recommended)"
          onValueClick={() => showToast('✅ Nabidh sync scope saved')}
        />
        <SettingsRow
          label="Fetch Nabidh Data on Patient Open"
          description="Auto-refresh patient's national record when opening their chart"
          type="toggle"
          toggleValue={nabidPull}
          onToggle={(v) => { setNabidPull(v); showToast(`✅ Nabidh pull on patient open ${v ? 'enabled' : 'disabled'}`); }}
          last
        />
      </SettingsCard>

      {pharmModal && (
        <SimpleModal title="Default Pharmacy" onClose={() => setPharmModal(false)}>
          <div className="space-y-2">
            {pharmacyOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setDefaultPharmacy(opt); setPharmModal(false); showToast(`✅ Default pharmacy: ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  defaultPharmacy === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${defaultPharmacy === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {rxModal && (
        <SimpleModal title="Prescription Validity" onClose={() => setRxModal(false)}>
          <div className="space-y-2">
            {rxOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setRxValidity(opt); setRxModal(false); showToast(`✅ Prescription validity set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  rxValidity === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${rxValidity === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {pinModal && (
        <SimpleModal title="Prescribing PIN Timeout" onClose={() => setPinModal(false)}>
          <p className="text-[13px] text-slate-500 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            This PIN digitally signs DHA ePrescriptions with your license DHA-PRAC-2018-047821
          </p>
          <div className="space-y-2">
            {pinOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setPinTimeout(opt); setPinModal(false); showToast(`✅ PIN timeout set to ${opt}`); }}
                className={`w-full flex items-start space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  pinTimeout === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${pinTimeout === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-[12px] text-slate-500">More frequent PIN entry = higher security</p>
          </div>
        </SimpleModal>
      )}

      {reminderModal && (
        <SimpleModal title="Critical Result Reminder" onClose={() => setReminderModal(false)}>
          <div className="space-y-2">
            {reminderOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setCriticalReminder(opt); setReminderModal(false); showToast(`✅ Reminder set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  criticalReminder === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${criticalReminder === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-xl">
            <p className="text-[12px] text-blue-700">DHA requires acknowledgment within 1 hour</p>
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default ClinicalToolsSection;
