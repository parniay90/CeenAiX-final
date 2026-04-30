import React, { useState } from 'react';
import { Sun, Moon, Monitor, Save, X, Check, Download } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

function SettingCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
        <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
      <div>
        <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative flex-shrink-0 rounded-full transition-colors"
        style={{ width: 40, height: 22, background: value ? '#0D9488' : 'rgba(51,65,85,0.6)' }}
      >
        <div className="absolute top-1 rounded-full bg-white transition-all" style={{ width: 14, height: 14, left: value ? 22 : 4 }} />
      </button>
    </div>
  );
}

export default function AdminSettingsAccount() {
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Dubai');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24-hour');
  const [firstDay, setFirstDay] = useState('Saturday');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState('100%');
  const [kbHints, setKbHints] = useState(false);
  const [defaultLanding, setDefaultLanding] = useState('Dashboard');
  const [pageSize, setPageSize] = useState('50');

  const mark = () => { setDirty(true); setSaved(false); };

  const handleSave = () => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const ACCENT_COLORS = ['#0D9488', '#0891B2', '#2563EB', '#059669', '#D97706', '#DC2626'];

  return (
    <AdminPageLayout activeSection="platform-settings">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Account Settings</h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>Customize your CeenAiX experience.</p>
        </div>

        {/* Appearance */}
        <SettingCard title="Appearance">
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Theme</label>
            <div className="flex gap-3">
              {[
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'system', label: 'System', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setTheme(id as typeof theme); mark(); }}
                  className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={{ background: theme === id ? 'rgba(13,148,136,0.15)' : 'rgba(15,23,42,0.5)', border: `2px solid ${theme === id ? '#0D9488' : 'rgba(51,65,85,0.5)'}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme === id ? '#2DD4BF' : '#64748B' }} />
                  <span style={{ fontSize: 12, color: theme === id ? '#2DD4BF' : '#94A3B8', fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Accent Color</label>
            <div className="flex gap-2">
              {ACCENT_COLORS.map(color => (
                <button key={color} className="w-8 h-8 rounded-full transition-all" style={{ background: color, border: '3px solid transparent', outline: color === '#0D9488' ? '2px solid #0D9488' : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Density</label>
            <div className="flex gap-3">
              {['comfortable', 'compact'].map(d => (
                <button key={d} onClick={() => { setDensity(d as typeof density); mark(); }}
                  className="flex-1 py-2 rounded-xl capitalize text-sm font-semibold transition-all"
                  style={{ background: density === d ? '#0D9488' : 'rgba(51,65,85,0.4)', color: density === d ? '#fff' : '#94A3B8', border: `1px solid ${density === d ? '#0D9488' : 'rgba(51,65,85,0.5)'}` }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </SettingCard>

        {/* Language & Region */}
        <SettingCard title="Language & Region">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Display Language</label>
              <select value={language} onChange={e => { setLanguage(e.target.value); mark(); }} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                {['English', 'العربية', 'فارسی'].map(l => <option key={l} style={{ background: '#1E293B' }}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Time Zone</label>
              <select value={timezone} onChange={e => { setTimezone(e.target.value); mark(); }} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                {['Asia/Dubai', 'Asia/Riyadh', 'Europe/London', 'America/New_York', 'UTC'].map(tz => <option key={tz} style={{ background: '#1E293B' }}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Date Format</label>
              <select value={dateFormat} onChange={e => { setDateFormat(e.target.value); mark(); }} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f} style={{ background: '#1E293B' }}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Time Format</label>
              <div className="flex gap-2">
                {['12-hour', '24-hour'].map(f => (
                  <button key={f} onClick={() => { setTimeFormat(f); mark(); }} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: timeFormat === f ? '#0D9488' : 'rgba(51,65,85,0.4)', color: timeFormat === f ? '#fff' : '#94A3B8' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>First Day of Week</label>
              <div className="flex gap-2">
                {['Saturday', 'Sunday', 'Monday'].map(d => (
                  <button key={d} onClick={() => { setFirstDay(d); mark(); }} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: firstDay === d ? '#0D9488' : 'rgba(51,65,85,0.4)', color: firstDay === d ? '#fff' : '#94A3B8' }}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>
              Preview: {dateFormat === 'DD/MM/YYYY' ? '30/04/2026' : dateFormat === 'MM/DD/YYYY' ? '04/30/2026' : '2026-04-30'} · {timeFormat === '24-hour' ? '14:07' : '2:07 PM'} ({timezone})
            </span>
          </div>
        </SettingCard>

        {/* Accessibility */}
        <SettingCard title="Accessibility">
          <ToggleRow label="Reduce Motion" desc="Disables animations and transitions" value={reduceMotion} onChange={v => { setReduceMotion(v); mark(); }} />
          <ToggleRow label="High Contrast Mode" desc="Increases color contrast for better visibility" value={highContrast} onChange={v => { setHighContrast(v); mark(); }} />
          <ToggleRow label="Keyboard Navigation Hints" desc="Shows shortcut hints on focusable elements" value={kbHints} onChange={v => { setKbHints(v); mark(); }} />
          <div className="pt-4">
            <label className="block text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Font Scale</label>
            <div className="flex gap-2">
              {['90%', '100%', '110%', '125%'].map(s => (
                <button key={s} onClick={() => { setFontScale(s); mark(); }} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: fontScale === s ? '#0D9488' : 'rgba(51,65,85,0.4)', color: fontScale === s ? '#fff' : '#94A3B8' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </SettingCard>

        {/* Defaults */}
        <SettingCard title="Defaults">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Default Landing Page</label>
              <select value={defaultLanding} onChange={e => { setDefaultLanding(e.target.value); mark(); }} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                {['Dashboard', 'Users', 'System Status', 'Audit Log', 'Last visited'].map(p => <option key={p} style={{ background: '#1E293B' }}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Default Table Page Size</label>
              <div className="flex gap-2">
                {['25', '50', '100'].map(s => (
                  <button key={s} onClick={() => { setPageSize(s); mark(); }} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: pageSize === s ? '#0D9488' : 'rgba(51,65,85,0.4)', color: pageSize === s ? '#fff' : '#94A3B8' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Data Export */}
        <SettingCard title="Data Export" subtitle="Download a copy of your account data and recent audit entries.">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors" style={{ background: 'rgba(13,148,136,0.2)', color: '#5EEAD4', border: '1px solid rgba(13,148,136,0.3)' }}>
            <Download className="w-4 h-4" />
            Download My Account Data
          </button>
        </SettingCard>
      </div>

      {dirty && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-3 px-8 py-4 z-30" style={{ background: '#0F172A', borderTop: '1px solid rgba(51,65,85,0.6)' }}>
          <button onClick={() => setDirty(false)} className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>
            <X className="w-4 h-4" /> Discard
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ background: '#0D9488', color: '#fff' }}>
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
      {saved && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl" style={{ background: '#0D9488', color: '#fff' }}>
          <Check className="w-4 h-4" /> Settings saved
        </div>
      )}
    </AdminPageLayout>
  );
}
