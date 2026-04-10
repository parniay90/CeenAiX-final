import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const ClinicalAISection: React.FC<Props> = ({ showToast }) => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [aiSoap, setAiSoap] = useState(true);
  const [aiIcd, setAiIcd] = useState(true);
  const [aiDrug, setAiDrug] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [aiLang, setAiLang] = useState('English');
  const [aiBadges, setAiBadges] = useState(true);

  const grayed = !aiEnabled ? 'opacity-50 pointer-events-none' : '';

  return (
    <SettingsCard
      id="clinical-ai"
      title="Clinical AI"
      icon={Bot}
      iconBg="bg-teal-100"
      iconColor="text-teal-600"
      description="CeenAiX AI clinical assistance preferences"
    >
      <div className="mx-6 mt-4 mb-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-[13px] text-amber-800" style={{ fontFamily: 'Inter, sans-serif' }}>
          AI features are for clinical support only. All diagnoses and treatment decisions remain the
          physician's sole responsibility per DHA regulations.
        </p>
      </div>

      <SettingsRow
        label="Enable Clinical AI Features"
        description="AI insights, SOAP drafts, ICD-10 suggestions"
        type="toggle"
        toggleValue={aiEnabled}
        onToggle={(v) => { setAiEnabled(v); showToast(`✅ Clinical AI ${v ? 'enabled' : 'disabled'}`); }}
      />

      <div className={grayed}>
        <SettingsRow
          label="AI Clinical Insights on Dashboard"
          description="Pattern detection and clinical recommendations"
          type="toggle"
          toggleValue={aiInsights}
          onToggle={(v) => { setAiInsights(v); showToast(`✅ AI insights ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="AI SOAP Note Drafting"
          description="AI drafts SOAP notes from consultation context"
          type="toggle"
          toggleValue={aiSoap}
          onToggle={(v) => { setAiSoap(v); showToast(`✅ AI SOAP drafting ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="AI ICD-10 Suggestions"
          description="Suggest relevant diagnosis codes during consultation"
          type="toggle"
          toggleValue={aiIcd}
          onToggle={(v) => { setAiIcd(v); showToast(`✅ ICD-10 suggestions ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="AI Drug Interaction Checker"
          description="Real-time interaction checks when prescribing"
          type="toggle"
          toggleValue={aiDrug}
          onToggle={(v) => { setAiDrug(v); showToast(`✅ Drug checker ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Proactive Clinical Alerts"
          description="AI flags clinical patterns across patient records (e.g. HbA1c trend, BNP rising)"
          type="toggle"
          toggleValue={aiAlerts}
          onToggle={(v) => { setAiAlerts(v); showToast(`✅ Proactive alerts ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="AI Clinical Notes Language"
          description="Language for AI-drafted clinical content"
          type="pills"
          pills={[{ label: 'English', value: 'English' }, { label: 'Arabic', value: 'Arabic' }, { label: 'Both', value: 'Both' }]}
          activePill={aiLang}
          onPillChange={(v) => { setAiLang(v); showToast(`✅ AI language set to ${v}`); }}
        />
        <SettingsRow
          label="Show AI-Generated Badges"
          description="Mark AI-generated content with amber badge for review before finalizing"
          type="toggle"
          toggleValue={aiBadges}
          onToggle={(v) => { setAiBadges(v); showToast(`✅ AI badges ${v ? 'on' : 'off'}`); }}
          last
        />
      </div>
    </SettingsCard>
  );
};

export default ClinicalAISection;
