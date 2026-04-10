import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SectionDivider from '../SectionDivider';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const ConsultationWorkspaceSection: React.FC<Props> = ({ showToast }) => {
  const [defaultTab, setDefaultTab] = useState('Vitals');
  const [aiSoap, setAiSoap] = useState(true);
  const [soapTemplate, setSoapTemplate] = useState('Cardiology (standard)');
  const [autoSave, setAutoSave] = useState(true);
  const [icdSuggestions, setIcdSuggestions] = useState(true);
  const [vitalUnits, setVitalUnits] = useState('Metric (°C, kg, mmHg)');
  const [bpAlert, setBpAlert] = useState('>140/90 mmHg = alert');
  const [vitalsQuick, setVitalsQuick] = useState(true);
  const [postVisit, setPostVisit] = useState('By ICD-10 (auto-select)');
  const [instrLang, setInstrLang] = useState('English');
  const [tabModal, setTabModal] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);

  const tabOptions = ['Vitals', 'SOAP Notes', 'Health Summary', 'Prescriptions'];
  const templates = ['Cardiology (standard)', 'Post-procedure follow-up', 'New patient history', 'Emergency consultation', 'No template (blank)'];

  return (
    <>
      <SettingsCard
        id="consultation-workspace"
        title="Consultation Workspace"
        icon={ClipboardList}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        description="Configure the consultation experience"
      >
        <SectionDivider label="SOAP NOTES" />

        <SettingsRow
          label="Default Workspace Tab"
          description="Which tab opens first in consultation workspace"
          type="value"
          value={defaultTab}
          onValueClick={() => setTabModal(true)}
        />
        <SettingsRow
          label="AI SOAP Draft Button"
          description="Show 'AI Draft SOAP' button in workspace"
          type="toggle"
          toggleValue={aiSoap}
          onToggle={(v) => { setAiSoap(v); showToast(`✅ AI SOAP draft ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Default SOAP Template"
          description="Pre-fill SOAP with specialty-specific structure"
          type="value"
          value={soapTemplate}
          onValueClick={() => setTemplateModal(true)}
        />
        <SettingsRow
          label="Auto-Save SOAP Notes"
          description="Save notes every 60 seconds during consultation"
          type="toggle"
          toggleValue={autoSave}
          onToggle={(v) => { setAutoSave(v); showToast(`✅ Auto-save ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="ICD-10 Auto-Suggestions"
          description="Suggest ICD-10 codes based on consultation content (AI-powered)"
          type="toggle"
          toggleValue={icdSuggestions}
          onToggle={(v) => { setIcdSuggestions(v); showToast(`✅ ICD-10 suggestions ${v ? 'on' : 'off'}`); }}
        />

        <SectionDivider label="VITALS" />

        <SettingsRow
          label="Default Vital Units"
          description="Measurement units for vital signs"
          type="value"
          value={vitalUnits}
          onValueClick={() => showToast('✅ Unit preferences saved')}
        />
        <SettingsRow
          label="BP Alert Thresholds"
          description="Flag elevated vitals during consultation"
          type="value"
          value={bpAlert}
          onValueClick={() => showToast('✅ BP thresholds updated')}
        />
        <SettingsRow
          label="Inline Vitals Entry on Active Card"
          description="Show vitals input on consultation workspace hero card"
          type="toggle"
          toggleValue={vitalsQuick}
          onToggle={(v) => { setVitalsQuick(v); showToast(`✅ Vitals quick entry ${v ? 'shown' : 'hidden'}`); }}
        />

        <SectionDivider label="PATIENT COMMUNICATION" />

        <SettingsRow
          label="Default Post-Visit Instructions"
          description="Pre-fill patient instructions by condition"
          type="value"
          value={postVisit}
          onValueClick={() => showToast('✅ Post-visit instructions updated')}
        />
        <SettingsRow
          label="Patient Instructions Language"
          description="Default language sent to patient app"
          type="pills"
          pills={[{ label: 'English', value: 'English' }, { label: 'Arabic', value: 'Arabic' }, { label: 'Both', value: 'Both' }]}
          activePill={instrLang}
          onPillChange={(v) => { setInstrLang(v); showToast(`✅ Patient instructions language: ${v}`); }}
        />
        <SettingsRow
          label="Post-Teleconsult Summary Required"
          description="Mandatory SOAP note after every video call"
          type="toggle"
          toggleValue={true}
          toggleDisabled={true}
          toggleBadge="DHA Required"
          onToggle={() => {}}
          last
        />
      </SettingsCard>

      {tabModal && (
        <SimpleModal title="Default Workspace Tab" onClose={() => setTabModal(false)}>
          <div className="space-y-2">
            {tabOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setDefaultTab(opt); setTabModal(false); showToast(`✅ Default tab set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  defaultTab === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${defaultTab === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}

      {templateModal && (
        <SimpleModal title="SOAP Template" onClose={() => setTemplateModal(false)}>
          <div className="space-y-2">
            {templates.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSoapTemplate(opt); setTemplateModal(false); showToast(`✅ SOAP template changed to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  soapTemplate === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${soapTemplate === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default ConsultationWorkspaceSection;
