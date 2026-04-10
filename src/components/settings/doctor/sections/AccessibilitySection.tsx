import React, { useState } from 'react';
import { Accessibility } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const AccessibilitySection: React.FC<Props> = ({ showToast }) => {
  const [fontSize, setFontSize] = useState('Normal');
  const [lineSpacing, setLineSpacing] = useState('Normal');
  const [highContrast, setHighContrast] = useState(false);
  const [largeTaps, setLargeTaps] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [colorBlind, setColorBlind] = useState('Standard');
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [colorModal, setColorModal] = useState(false);

  const fontSizes = ['Small', 'Normal', 'Large', 'X-Large'];
  const colorModes = ['Standard', 'Deuteranopia', 'Protanopia', 'Tritanopia', 'Grayscale'];

  const previewSize: Record<string, string> = {
    Small: 'text-xs',
    Normal: 'text-sm',
    Large: 'text-base',
    'X-Large': 'text-lg',
  };

  return (
    <>
      <SettingsCard id="accessibility" title="Accessibility" icon={Accessibility} iconBg="bg-amber-100" iconColor="text-amber-600">
        <div className="px-6 py-3 border-b border-slate-50">
          <div className={`p-3 bg-slate-50 rounded-xl ${highContrast ? 'bg-black' : ''}`}>
            <p className={`${previewSize[fontSize]} ${highContrast ? 'text-white' : 'text-slate-600'} ${dyslexiaFont ? 'font-serif' : ''}`}>
              Preview: Patient: Khalid Hassan · BP 138/86 ✅ · Today 9:22 AM
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-slate-50">
          <p className="text-[14px] font-medium text-slate-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Font Size</p>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-400 mr-2">A</span>
            <div className="flex-1 flex items-center rounded-lg border border-slate-200 overflow-hidden">
              {fontSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setFontSize(s); showToast(`✅ Font size set to ${s}`); }}
                  className={`flex-1 py-1.5 text-[12px] font-medium transition-colors ${
                    fontSize === s ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="text-lg text-slate-400 ml-2">A</span>
          </div>
        </div>

        <SettingsRow
          label="Line Spacing"
          description="Space between lines of clinical text"
          type="pills"
          pills={[{ label: 'Compact', value: 'Compact' }, { label: 'Normal', value: 'Normal' }, { label: 'Relaxed', value: 'Relaxed' }]}
          activePill={lineSpacing}
          onPillChange={(v) => { setLineSpacing(v); showToast(`✅ Line spacing set to ${v}`); }}
        />
        <SettingsRow
          label="High Contrast"
          description="Stronger color contrast for text and UI elements"
          type="toggle"
          toggleValue={highContrast}
          onToggle={(v) => { setHighContrast(v); showToast(`✅ High contrast ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Large Tap Targets (Mobile)"
          description="Bigger touch areas for easier interaction"
          type="toggle"
          toggleValue={largeTaps}
          onToggle={(v) => { setLargeTaps(v); showToast(`✅ Large targets ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Reduce Motion"
          description="Minimize animations and transitions"
          type="toggle"
          toggleValue={reduceMotion}
          onToggle={(v) => { setReduceMotion(v); showToast(`✅ Reduce motion ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Screen Reader Optimization"
          description="Enhance compatibility with screen readers"
          type="toggle"
          toggleValue={screenReader}
          onToggle={(v) => { setScreenReader(v); showToast(`✅ Screen reader mode ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Color Blind Mode"
          description="Adjust colors for color vision deficiencies"
          type="value"
          value={colorBlind}
          onValueClick={() => setColorModal(true)}
        />
        <SettingsRow
          label="Dyslexia-Friendly Font"
          description="Use OpenDyslexic font for improved readability"
          type="toggle"
          toggleValue={dyslexiaFont}
          onToggle={(v) => { setDyslexiaFont(v); showToast(`✅ Dyslexia font ${v ? 'enabled' : 'disabled'}`); }}
          last
        />
      </SettingsCard>

      {colorModal && (
        <SimpleModal title="Color Blind Mode" onClose={() => setColorModal(false)}>
          <div className="space-y-2">
            {colorModes.map((opt) => (
              <button
                key={opt}
                onClick={() => { setColorBlind(opt); setColorModal(false); showToast(`✅ Color mode set to ${opt}`); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors ${
                  colorBlind === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${colorBlind === opt ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`} />
                <span className="text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{opt}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-xl">
            <p className="text-[12px] text-slate-500">Lab result status colors will adjust to remain distinguishable in all modes</p>
          </div>
        </SimpleModal>
      )}
    </>
  );
};

export default AccessibilitySection;
