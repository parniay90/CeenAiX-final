import { useState } from 'react';
import { Lock, ChevronRight } from 'lucide-react';

const navSections = [
  'General', 'Appearance', 'Lab Settings', 'Radiology Settings',
  'Notifications', 'Privacy & Data', 'Security', 'Integrations', 'About',
];

function Toggle({ defaultOn = false, locked = false }: { defaultOn?: boolean; locked?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => !locked && setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-indigo-600' : 'bg-slate-200'} ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      {locked && <Lock size={8} className="absolute top-1.5 right-1 text-slate-400" />}
    </button>
  );
}

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function LabSettings() {
  const [active, setActive] = useState('General');

  return (
    <div className="flex h-full bg-slate-50">
      <aside className="w-52 bg-white border-r border-slate-200 p-3 shrink-0">
        <div className="text-xs text-slate-500 mb-3 px-2">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Settings</span>
        </div>
        {navSections.map(s => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-colors ${
              active === s ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        {active === 'General' && (
          <div className="max-w-lg space-y-2">
            <div className="font-bold text-slate-800 text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>General Settings</div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <SettingRow label="Default landing page" sub="Where to go after login">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>Dashboard</option>
                  <option>Lab Queue</option>
                  <option>Imaging Queue</option>
                </select>
              </SettingRow>
              <SettingRow label="Auto-logout timer" sub="Inactivity timeout">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>60 minutes</option>
                </select>
              </SettingRow>
              <SettingRow label="Compact mode" sub="Denser table layout">
                <Toggle />
              </SettingRow>
              <SettingRow label="Barcode scanner input" sub="How barcode data is received">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>USB HID (keyboard)</option>
                  <option>Serial port</option>
                  <option>Camera</option>
                </select>
              </SettingRow>
              <SettingRow label="Result units" sub="Display preference">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>mmol/L (SI units)</option>
                  <option>mg/dL (conventional)</option>
                </select>
              </SettingRow>
            </div>
          </div>
        )}

        {active === 'Lab Settings' && (
          <div className="max-w-lg space-y-4">
            <div className="font-bold text-slate-800 text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Lab Settings</div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-3" style={{ fontSize: 9 }}>CRITICAL VALUE THRESHOLDS</div>
              {[
                { test: 'K+ (Potassium)', low: '< 2.5 mEq/L', high: '> 6.0 mEq/L' },
                { test: 'Na+ (Sodium)', low: '< 120 mmol/L', high: '> 160 mmol/L' },
                { test: 'Troponin I', low: '—', high: '> 52 ng/L' },
                { test: 'Hemoglobin', low: '< 60 g/L', high: '> 200 g/L' },
                { test: 'Platelet Count', low: '< 20 × 10⁹/L', high: '> 1000 × 10⁹/L' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0 text-xs">
                  <span className="w-36 font-medium text-slate-700">{t.test}</span>
                  <span className="text-blue-600 font-mono">{t.low}</span>
                  <span className="text-red-600 font-mono">{t.high}</span>
                  <button className="text-indigo-600 hover:underline ml-auto">Edit</button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <SettingRow label="Auto-NABIDH submit on release" sub="Automatically submit results to NABIDH HIE when released">
                <Toggle defaultOn locked />
              </SettingRow>
              <SettingRow label="Reference range source" sub="Which reference ranges to apply">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>DHA Standard ●</option>
                  <option>Custom</option>
                </select>
              </SettingRow>
              <SettingRow
                label="Critical value notification"
                sub="Push + SMS — cannot disable (DHA requirement)"
              >
                <Toggle defaultOn locked />
              </SettingRow>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-xs">
              <Lock size={14} className="text-red-500 shrink-0" />
              <div className="text-red-700">
                Critical value notifications cannot be disabled per DHA clinical safety requirements.
              </div>
            </div>
          </div>
        )}

        {active === 'Radiology Settings' && (
          <div className="max-w-lg space-y-4">
            <div className="font-bold text-slate-800 text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Radiology Settings</div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <SettingRow label="Default report template" sub="Per modality">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>MRI Brain ●</option>
                  <option>CT Chest</option>
                  <option>CT Abdomen</option>
                  <option>X-Ray</option>
                  <option>Custom</option>
                </select>
              </SettingRow>
              <SettingRow label="Radiologist PIN timeout" sub="Auto-lock signing session">
                <select className="border border-slate-200 rounded text-xs px-2 py-1">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                </select>
              </SettingRow>
              <SettingRow label="ICD-10 AI suggestions" sub="AI suggests coding from report text">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Dose tracking alerts" sub="Alert when cumulative dose exceeds DHA threshold">
                <Toggle defaultOn locked />
              </SettingRow>
              <SettingRow label="Contrast consent required" sub="For all contrast-enhanced studies">
                <Toggle defaultOn locked />
              </SettingRow>
              <SettingRow label="FDG injection timing reminder (PET-CT)" sub="Alert 30 min before injection time">
                <Toggle defaultOn />
              </SettingRow>
            </div>
          </div>
        )}

        {active === 'Notifications' && (
          <div className="max-w-lg space-y-3">
            <div className="font-bold text-slate-800 text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Notification Settings</div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              {[
                { label: 'New lab order received', locked: false },
                { label: 'New imaging order received', locked: false },
                { label: 'STAT sample arrived', locked: false },
                { label: 'Critical value resulted', locked: true },
                { label: 'Equipment alert', locked: false },
                { label: 'QC failure', locked: false },
                { label: 'NABIDH sync failure', locked: false },
                { label: 'Shift start reminder', locked: false },
                { label: 'Report TAT approaching target', locked: false },
              ].map((n, i) => (
                <SettingRow key={i} label={n.label} sub={n.locked ? 'Cannot disable — DHA requirement' : undefined}>
                  <Toggle defaultOn locked={n.locked} />
                </SettingRow>
              ))}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-xs">
              <Lock size={14} className="text-red-500 shrink-0" />
              <div className="text-red-700">
                Critical value notifications cannot be disabled per DHA clinical safety requirements.
              </div>
            </div>
          </div>
        )}

        {active === 'Integrations' && (
          <div className="max-w-lg">
            <div className="font-bold text-slate-800 text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Integrations</div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {[
                { name: 'NABIDH HIE', status: 'Connected', detail: 'NABIDH-VENDOR-2024-00847' },
                { name: 'DHA Lab Reporting API', status: 'Active', detail: 'v3.2.1' },
                { name: 'DHA Radiology Reporting API', status: 'Active', detail: 'v2.8.0' },
                { name: 'CeenAiX ePrescription (Lab)', status: 'Connected', detail: 'Real-time sync' },
                { name: 'CeenAiX Imaging Orders', status: 'Connected', detail: 'Real-time sync' },
                { name: 'PACS System', status: 'Connected', detail: 'Agfa Enterprise Imaging' },
                { name: 'LIS (Lab Information System)', status: 'Connected', detail: 'Cerner PathNet v8.1' },
                { name: 'RIS (Radiology Information System)', status: 'Connected', detail: 'Sectra RIS v24.2' },
              ].map((int, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{int.name}</div>
                    <div className="font-mono text-slate-400 text-xs">{int.detail}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">✅ {int.status}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
              + Add Integration
            </button>
          </div>
        )}

        {!['General', 'Lab Settings', 'Radiology Settings', 'Notifications', 'Integrations'].includes(active) && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">⚙️</div>
            <div className="font-semibold text-slate-600 mb-1">{active}</div>
            <div className="text-sm">Settings for this section are available here.</div>
          </div>
        )}
      </div>
    </div>
  );
}
