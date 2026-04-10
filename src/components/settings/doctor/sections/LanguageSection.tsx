import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const LanguageSection: React.FC<Props> = ({ showToast }) => {
  const [portalLang, setPortalLang] = useState('English (UK)');
  const [clinicalLang, setClinicalLang] = useState('English');
  const [timezone, setTimezone] = useState('Gulf Standard Time (GST, UTC+4)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [weekStart, setWeekStart] = useState('Sunday');
  const [decimal, setDecimal] = useState('Period 6.8%');
  const [ramadan, setRamadan] = useState(false);
  const [langModal, setLangModal] = useState(false);

  return (
    <>
      <SettingsCard id="language" title="Language & Region" icon={Globe} iconBg="bg-green-100" iconColor="text-green-600">
        <SettingsRow
          label="Portal Language"
          description="Interface language for the doctor portal"
          type="value"
          value={`🇬🇧 ${portalLang}`}
          onValueClick={() => setLangModal(true)}
        />
        <SettingsRow
          label="Default Clinical Note Language"
          description="Language for SOAP notes and clinical text"
          type="pills"
          pills={[{ label: 'English', value: 'English' }, { label: 'Arabic', value: 'Arabic' }]}
          activePill={clinicalLang}
          onPillChange={(v) => { setClinicalLang(v); showToast(`✅ Clinical notes language: ${v}`); }}
        />
        <SettingsRow
          label="Timezone"
          description="Affects appointment times, lab timestamps, reports"
          type="info"
          value={timezone}
        />
        <SettingsRow
          label="Date Format"
          description={`Preview: 7 April 2026 → ${dateFormat === 'DD/MM/YYYY' ? '07/04/2026' : dateFormat === 'MM/DD/YYYY' ? '04/07/2026' : '2026-04-07'}`}
          type="pills"
          pills={[{ label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' }, { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }, { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }]}
          activePill={dateFormat}
          onPillChange={(v) => { setDateFormat(v); showToast(`✅ Date format set to ${v}`); }}
        />
        <SettingsRow
          label="Time Format"
          type="pills"
          pills={[{ label: '12-hour', value: '12-hour' }, { label: '24-hour', value: '24-hour' }]}
          activePill={timeFormat}
          onPillChange={(v) => { setTimeFormat(v); showToast(`✅ Time format set to ${v}`); }}
        />
        <SettingsRow
          label="First Day of Week"
          description="UAE working week: Sunday–Thursday"
          type="pills"
          pills={[{ label: 'Sunday', value: 'Sunday' }, { label: 'Monday', value: 'Monday' }]}
          activePill={weekStart}
          onPillChange={(v) => { setWeekStart(v); showToast(`✅ Week starts on ${v}`); }}
        />
        <SettingsRow
          label="Decimal Separator"
          description="How lab values and measurements are displayed"
          type="pills"
          pills={[{ label: 'Period 6.8%', value: 'Period 6.8%' }, { label: 'Comma 6,8%', value: 'Comma 6,8%' }]}
          activePill={decimal}
          onPillChange={(v) => { setDecimal(v); showToast(`✅ Decimal separator updated`); }}
        />
        <SettingsRow
          label="Ramadan Clinical Hours"
          description="Adjusted clinic hours during Ramadan (shorter sessions, post-Iftar availability)"
          type="toggle"
          toggleValue={ramadan}
          onToggle={(v) => { setRamadan(v); showToast(`✅ DHA Ramadan hours mode ${v ? 'enabled' : 'disabled'}`); }}
          last
        />
        {ramadan && (
          <div className="px-6 pb-4">
            <button
              onClick={() => showToast('✅ Opening Ramadan schedule config')}
              className="text-[13px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Configure Ramadan clinic hours →
            </button>
          </div>
        )}
      </SettingsCard>

      {langModal && (
        <SimpleModal title="Portal Language" onClose={() => setLangModal(false)}>
          <div className="space-y-2">
            <button
              onClick={() => { setPortalLang('English (UK)'); setLangModal(false); showToast('✅ Language set to English (UK)'); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl border border-teal-500 bg-teal-50 text-teal-700"
            >
              <span className="text-xl">🇬🇧</span>
              <div className="text-left">
                <span className="text-[14px] font-medium block">English (UK)</span>
                <span className="text-[11px] text-teal-500">Available</span>
              </div>
            </button>
            {['🇦🇪 Arabic', '🇮🇳 Hindi', '🇵🇭 Tagalog'].map((lang) => (
              <div key={lang} className="flex items-center space-x-3 px-4 py-3 rounded-xl border border-slate-100 opacity-50">
                <span className="text-xl">{lang.slice(0, 2)}</span>
                <div className="text-left">
                  <span className="text-[14px] text-slate-600 block">{lang.slice(3)}</span>
                  <span className="text-[11px] text-amber-500">Coming soon</span>
                </div>
              </div>
            ))}
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default LanguageSection;
