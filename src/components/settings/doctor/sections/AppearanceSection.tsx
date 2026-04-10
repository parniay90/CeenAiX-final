import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';

interface AppearanceSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ showToast }) => {
  const [theme, setTheme] = useState('Light');
  const [accentColor, setAccentColor] = useState('#0D9488');
  const [fontSize, setFontSize] = useState('Medium');
  const [sidebarStyle, setSidebarStyle] = useState('Expanded');
  const [cardShadows, setCardShadows] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [chartStyle, setChartStyle] = useState('Line + Area');

  const accentColors = [
    { color: '#0D9488', label: 'Teal' },
    { color: '#10B981', label: 'Emerald' },
    { color: '#3B82F6', label: 'Blue' },
    { color: '#6366F1', label: 'Indigo' },
    { color: '#8B5CF6', label: 'Purple' },
    { color: '#64748B', label: 'Slate' },
  ];

  const fontSizes = ['Small', 'Medium', 'Large', 'X-Large'];

  const previewText: Record<string, string> = {
    Small: 'text-xs',
    Medium: 'text-sm',
    Large: 'text-base',
    'X-Large': 'text-lg',
  };

  return (
    <SettingsCard id="appearance" title="Appearance" icon={Palette} iconBg="bg-purple-100" iconColor="text-purple-600">
      <div className="px-6 py-4 border-b border-slate-50">
        <div className="h-20 rounded-xl overflow-hidden flex border border-slate-100 bg-slate-50">
          <div className="w-16 bg-[#0A1628] flex flex-col items-center py-2 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-1.5 bg-teal-500/40 rounded" />
            ))}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-8 bg-white border-b border-slate-100 flex items-center px-3 space-x-2">
              <div className="w-16 h-2 bg-slate-200 rounded" />
              <div className="ml-auto w-6 h-6 rounded-lg bg-gradient-to-br from-[#0A1628] to-teal-500" />
            </div>
            <div className="flex-1 p-2 flex items-center space-x-2">
              <div className="flex-1 h-8 bg-white rounded-lg border border-slate-100 shadow-sm" />
              <div className="w-12 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: accentColor }}>
                Rx
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-50">
        <p className="text-[14px] font-medium text-slate-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Color Theme</p>
        <div className="flex items-center space-x-3">
          {[
            { id: 'Light', label: '☀️ Light', desc: 'Default' },
            { id: 'Dark', label: '🌙 Dark', desc: 'Coming soon', disabled: true },
            { id: 'System', label: '💻 System', desc: 'Device setting' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (!t.disabled) {
                  setTheme(t.id);
                  showToast(`✅ Theme changed to ${t.id}`);
                }
              }}
              className={`flex-1 border-2 rounded-xl p-3 text-left transition-all ${
                t.disabled
                  ? 'border-slate-100 opacity-50 cursor-not-allowed'
                  : theme === t.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="text-[13px] font-medium text-slate-800">{t.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              {t.disabled && (
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] rounded font-medium">Q3 2026</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-50">
        <p className="text-[14px] font-medium text-slate-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Accent Color</p>
        <p className="text-[12px] text-slate-400 mb-3">Primary action color across the portal</p>
        <div className="flex items-center space-x-3">
          {accentColors.map((c) => (
            <button
              key={c.color}
              onClick={() => { setAccentColor(c.color); showToast(`✅ Accent color changed to ${c.label}`); }}
              className="relative flex-shrink-0 transition-transform hover:scale-110"
              title={c.label}
            >
              <div
                className="w-8 h-8 rounded-full shadow-md"
                style={{ backgroundColor: c.color }}
              />
              {accentColor === c.color && (
                <div className="absolute inset-0 rounded-full border-2 border-white ring-2 ring-teal-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-50">
        <p className="text-[14px] font-medium text-slate-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Text Size</p>
        <p className="text-[12px] text-slate-400 mb-3">Affects clinical labels, patient data, notes</p>
        <div className="flex items-center space-x-1 mb-3">
          <span className="text-xs text-slate-400 mr-2">A</span>
          <div className="flex-1 flex items-center rounded-lg border border-slate-200 overflow-hidden">
            {fontSizes.map((s) => (
              <button
                key={s}
                onClick={() => { setFontSize(s); showToast(`✅ Text size set to ${s}`); }}
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
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className={`text-slate-600 ${previewText[fontSize]}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            Patient: Parnia Yazdkhasti · BP 128/82 · HbA1c 6.8%
          </p>
        </div>
      </div>

      <SettingsRow
        label="Sidebar Display"
        description="How the main navigation sidebar appears"
        type="pills"
        pills={[{ label: 'Expanded', value: 'Expanded' }, { label: 'Collapsed', value: 'Collapsed' }, { label: 'Auto-hide', value: 'Auto-hide' }]}
        activePill={sidebarStyle}
        onPillChange={(v) => { setSidebarStyle(v); showToast(`✅ Sidebar set to ${v}`); }}
      />
      <SettingsRow
        label="Card Shadows"
        description="Subtle depth on content cards"
        type="toggle"
        toggleValue={cardShadows}
        onToggle={(v) => { setCardShadows(v); showToast(`✅ Card shadows ${v ? 'enabled' : 'disabled'}`); }}
      />
      <SettingsRow
        label="Enable Animations"
        description="Page transitions, chart animations, hover effects"
        type="toggle"
        toggleValue={animations}
        onToggle={(v) => { setAnimations(v); showToast(`✅ Animations ${v ? 'enabled' : 'disabled'}`); }}
      />
      <SettingsRow
        label="Lab Trend Charts"
        description="How lab result trends are displayed"
        type="pills"
        pills={[{ label: 'Line + Area', value: 'Line + Area' }, { label: 'Line Only', value: 'Line Only' }, { label: 'Bar Charts', value: 'Bar Charts' }]}
        activePill={chartStyle}
        onPillChange={(v) => { setChartStyle(v); showToast(`✅ Chart style set to ${v}`); }}
        last
      />
    </SettingsCard>
  );
};

export default AppearanceSection;
