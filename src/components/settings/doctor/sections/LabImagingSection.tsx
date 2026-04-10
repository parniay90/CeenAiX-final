import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const LabImagingSection: React.FC<Props> = ({ showToast }) => {
  const [labDisplay, setLabDisplay] = useState('Latest visit');
  const [trendPeriod, setTrendPeriod] = useState('6 months');
  const [abnormalHighlight, setAbnormalHighlight] = useState(true);
  const [refRanges, setRefRanges] = useState(true);
  const [imgLang, setImgLang] = useState('English');
  const [preauth, setPreauth] = useState(true);
  const [trendModal, setTrendModal] = useState(false);

  const trendOptions = ['3 months', '6 months', '1 year', 'All time'];

  return (
    <>
      <SettingsCard id="lab-imaging" title="Lab & Imaging" icon={FlaskConical} iconBg="bg-blue-100" iconColor="text-blue-600">
        <SettingsRow
          label="Lab Results Display"
          description="How to show lab results by default"
          type="pills"
          pills={[{ label: 'Latest visit', value: 'Latest visit' }, { label: 'Trend view', value: 'Trend view' }, { label: 'All history', value: 'All history' }]}
          activePill={labDisplay}
          onPillChange={(v) => { setLabDisplay(v); showToast(`✅ Lab display set to ${v}`); }}
        />
        <SettingsRow
          label="Default Trend Period"
          description="Date range for lab trend charts"
          type="value"
          value={trendPeriod}
          onValueClick={() => setTrendModal(true)}
        />
        <SettingsRow
          label="Highlight Abnormal Values"
          description="Color-code abnormal lab results in tables"
          type="toggle"
          toggleValue={abnormalHighlight}
          onToggle={(v) => { setAbnormalHighlight(v); showToast(`✅ Abnormal highlighting ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Show Reference Ranges"
          description="Display normal reference range next to lab values"
          type="toggle"
          toggleValue={refRanges}
          onToggle={(v) => { setRefRanges(v); showToast(`✅ Reference ranges ${v ? 'shown' : 'hidden'}`); }}
        />
        <SettingsRow
          label="Default Imaging Report Language"
          type="pills"
          pills={[{ label: 'English', value: 'English' }, { label: 'Arabic', value: 'Arabic' }]}
          activePill={imgLang}
          onPillChange={(v) => { setImgLang(v); showToast(`✅ Imaging language set to ${v}`); }}
        />
        <SettingsRow
          label="Auto-Submit Pre-Authorization"
          description="Automatically submit insurance pre-auth when ordering high-cost imaging"
          type="toggle"
          toggleValue={preauth}
          onToggle={(v) => { setPreauth(v); showToast(`✅ Auto pre-auth ${v ? 'enabled' : 'disabled'}`); }}
          last
        />
      </SettingsCard>

      {trendModal && (
        <SimpleModal title="Default Trend Period" onClose={() => setTrendModal(false)}>
          <div className="space-y-2">
            {trendOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setTrendPeriod(opt); setTrendModal(false); showToast(`✅ Trend period set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  trendPeriod === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${trendPeriod === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default LabImagingSection;
