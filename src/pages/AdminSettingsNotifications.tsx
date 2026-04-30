import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Save, X, Check } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

type Channel = 'inapp' | 'email' | 'sms' | 'push';

interface NotifRow {
  id: string;
  label: string;
  desc?: string;
}

interface NotifSection {
  title: string;
  rows: NotifRow[];
}

const SECTIONS: NotifSection[] = [
  {
    title: 'System & Platform',
    rows: [
      { id: 'sys.status', label: 'System status changes', desc: 'Green / amber / red transitions' },
      { id: 'sys.maintenance', label: 'Scheduled maintenance announcements' },
      { id: 'sys.release', label: 'New release / changelog published' },
      { id: 'sys.ratelimit', label: 'API rate limit warnings' },
    ],
  },
  {
    title: 'Security',
    rows: [
      { id: 'sec.newdevice', label: 'Sign-in from new device' },
      { id: 'sec.newcountry', label: 'Sign-in from new country' },
      { id: 'sec.changes', label: 'Password / 2FA / biometric changes' },
      { id: 'sec.impersonation', label: 'Impersonation session started by another admin' },
      { id: 'sec.suspicious', label: 'Suspicious activity flagged' },
    ],
  },
  {
    title: 'User & Workspace Management',
    rows: [
      { id: 'usr.invited', label: 'New user invited / activated' },
      { id: 'usr.rolechange', label: 'User role changed' },
      { id: 'usr.suspended', label: 'User suspended / deleted' },
      { id: 'ws.settings', label: 'Workspace settings changed' },
    ],
  },
  {
    title: 'Compliance & Audit',
    rows: [
      { id: 'comp.dha', label: 'DHA / NABIDH submission status updates' },
      { id: 'comp.fhir', label: 'FHIR integration health alerts' },
      { id: 'comp.hl7', label: 'HL7 message failures' },
      { id: 'comp.audit', label: 'Audit log anomalies' },
    ],
  },
  {
    title: 'Operations',
    rows: [
      { id: 'ops.onboard', label: 'Doctor / clinic onboarding milestones' },
      { id: 'ops.integration', label: 'Pharmacy / Lab / Insurance integration status' },
      { id: 'ops.billing', label: 'Billing or subscription changes' },
    ],
  },
];

type Prefs = Record<string, Record<Channel, boolean>>;

function buildDefaultPrefs(): Prefs {
  const prefs: Prefs = {};
  SECTIONS.forEach(s => s.rows.forEach(r => {
    prefs[r.id] = { inapp: true, email: r.id.startsWith('sec'), sms: false, push: false };
  }));
  return prefs;
}

export default function AdminSettingsNotifications() {
  const [prefs, setPrefs] = useState<Prefs>(buildDefaultPrefs);
  const [channelEnabled, setChannelEnabled] = useState<Record<Channel, boolean>>({ inapp: true, email: true, sms: false, push: false });
  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (rowId: string, ch: Channel) => {
    setPrefs(p => ({ ...p, [rowId]: { ...p[rowId], [ch]: !p[rowId][ch] } }));
    setDirty(true); setSaved(false);
  };

  const CHANNELS: { id: Channel; label: string; icon: React.ElementType }[] = [
    { id: 'inapp', label: 'In-app', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'push', label: 'Push', icon: Smartphone },
  ];

  return (
    <AdminPageLayout activeSection="platform-settings">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Notification Preferences</h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>Choose what you want to be notified about and how.</p>
        </div>

        {/* Matrix table */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          {/* Header row */}
          <div className="grid border-b" style={{ gridTemplateColumns: '1fr 90px 90px 90px 90px', borderColor: 'rgba(51,65,85,0.5)' }}>
            <div className="px-6 py-3" />
            {CHANNELS.map(ch => (
              <div key={ch.id} className="flex flex-col items-center gap-1 py-3">
                <ch.icon className="w-4 h-4" style={{ color: channelEnabled[ch.id] ? '#5EEAD4' : '#475569' }} />
                <span style={{ fontSize: 10, color: channelEnabled[ch.id] ? '#94A3B8' : '#475569', fontWeight: 600 }}>{ch.label}</span>
                <button
                  onClick={() => setChannelEnabled(p => ({ ...p, [ch.id]: !p[ch.id] }))}
                  className="relative rounded-full transition-colors mt-1"
                  style={{ width: 28, height: 16, background: channelEnabled[ch.id] ? '#0D9488' : 'rgba(51,65,85,0.6)' }}
                >
                  <div className="absolute top-0.5 rounded-full bg-white transition-all" style={{ width: 12, height: 12, left: channelEnabled[ch.id] ? 14 : 2 }} />
                </button>
              </div>
            ))}
          </div>

          {SECTIONS.map(section => (
            <div key={section.title}>
              <div className="px-6 py-2 border-b" style={{ borderColor: 'rgba(51,65,85,0.3)', background: 'rgba(15,23,42,0.4)' }}>
                <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{section.title}</span>
              </div>
              {section.rows.map(row => (
                <div key={row.id} className="grid border-b hover:bg-slate-800/30 transition-colors" style={{ gridTemplateColumns: '1fr 90px 90px 90px 90px', borderColor: 'rgba(51,65,85,0.2)' }}>
                  <div className="px-6 py-3">
                    <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{row.label}</div>
                    {row.desc && <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{row.desc}</div>}
                  </div>
                  {CHANNELS.map(ch => (
                    <div key={ch.id} className="flex items-center justify-center">
                      <button
                        disabled={!channelEnabled[ch.id]}
                        onClick={() => toggle(row.id, ch.id)}
                        className="w-5 h-5 rounded flex items-center justify-center transition-all"
                        style={{
                          background: prefs[row.id]?.[ch.id] && channelEnabled[ch.id] ? '#0D9488' : 'transparent',
                          border: `2px solid ${prefs[row.id]?.[ch.id] && channelEnabled[ch.id] ? '#0D9488' : channelEnabled[ch.id] ? 'rgba(51,65,85,0.6)' : 'rgba(51,65,85,0.3)'}`,
                          opacity: channelEnabled[ch.id] ? 1 : 0.4,
                          cursor: channelEnabled[ch.id] ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {prefs[row.id]?.[ch.id] && channelEnabled[ch.id] && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Quiet hours */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
            <div>
              <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>Quiet Hours</h2>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Mute non-critical notifications during set hours. Critical events always override.</p>
            </div>
            <button onClick={() => { setQuietHours(p => !p); setDirty(true); }} className="relative rounded-full transition-colors" style={{ width: 40, height: 22, background: quietHours ? '#0D9488' : 'rgba(51,65,85,0.6)' }}>
              <div className="absolute top-1 rounded-full bg-white transition-all" style={{ width: 14, height: 14, left: quietHours ? 22 : 4 }} />
            </button>
          </div>
          {quietHours && (
            <div className="px-6 py-4 flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#94A3B8' }}>From</label>
                <input type="time" value={quietStart} onChange={e => { setQuietStart(e.target.value); setDirty(true); }} className="rounded-xl px-3 py-2 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#94A3B8' }}>To</label>
                <input type="time" value={quietEnd} onChange={e => { setQuietEnd(e.target.value); setDirty(true); }} className="rounded-xl px-3 py-2 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
              </div>
              <p className="mt-5" style={{ fontSize: 11, color: '#F59E0B' }}>Critical events (security, outages) always notify regardless of quiet hours.</p>
            </div>
          )}
        </div>
      </div>

      {dirty && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-3 px-8 py-4 z-30" style={{ background: '#0F172A', borderTop: '1px solid rgba(51,65,85,0.6)' }}>
          <button className="text-sm" style={{ color: '#475569' }}>Reset to defaults</button>
          <div className="flex gap-3">
            <button onClick={() => setDirty(false)} className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>
              <X className="w-4 h-4" /> Discard
            </button>
            <button onClick={() => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ background: '#0D9488', color: '#fff' }}>
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}
      {saved && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl" style={{ background: '#0D9488', color: '#fff' }}>
          <Check className="w-4 h-4" /> Preferences saved
        </div>
      )}
    </AdminPageLayout>
  );
}
