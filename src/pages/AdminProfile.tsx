import React, { useState } from 'react';
import { User, Briefcase, Phone, Link2, Save, X, Lock, Camera, Check } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import { SUPER_ADMIN_USER } from '../data/superAdminData';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'professional', label: 'Professional Details', icon: Briefcase },
  { id: 'contact', label: 'Contact & Address', icon: Phone },
  { id: 'linked', label: 'Linked Accounts', icon: Link2 },
];

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>{label}</label>
      <div
        className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 group"
        style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}
      >
        <span className="flex-1" style={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{value}</span>
        <Lock className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#475569' }} />
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13, fontFamily: 'Inter, sans-serif' }}
      />
    </div>
  );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
      {title && (
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
          <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>{title}</h2>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  // Personal
  const [firstName, setFirstName] = useState('Parnia');
  const [lastName, setLastName] = useState('Yazdkhasti');
  const [displayName, setDisplayName] = useState('Dr. Parnia Yazdkhasti');
  const [title, setTitle] = useState('Dr.');
  const [language, setLanguage] = useState('English');

  // Professional
  const [jobTitle, setJobTitle] = useState('Chief Executive Officer');
  const [bio, setBio] = useState('Co-founder and CEO of AryAiX LLC, building AI-driven healthcare infrastructure for the UAE and GCC.');

  // Contact
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [mobile, setMobile] = useState('+971 50 123 4567');
  const [officePhone, setOfficePhone] = useState('');
  const [street, setStreet] = useState('Dilan Tower, Al Jadaf');
  const [city, setCity] = useState('Dubai');
  const [emirate, setEmirate] = useState('Dubai');

  // Linked accounts
  const [linkedAccounts, setLinkedAccounts] = useState({ linkedin: false, github: true, microsoft: true, google: false });

  const markDirty = (fn: () => void) => { fn(); setDirty(true); setSaved(false); };

  const handleSave = () => {
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminPageLayout activeSection="profile">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>My Profile</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Manage your personal information and how it appears across CeenAiX.</p>
          </div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#475569' }}>Last updated 2 hours ago</span>
        </div>

        <div className="flex gap-6">
          {/* Tab rail */}
          <div className="flex-shrink-0 w-52">
            <div className="rounded-2xl overflow-hidden sticky top-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
              {/* Avatar */}
              <div className="px-4 py-5 border-b flex flex-col items-center gap-3" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)' }}>
                    {SUPER_ADMIN_USER.initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#0D9488' }}>
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <button style={{ fontSize: 11, color: '#EF4444' }}>Remove photo</button>
              </div>
              {/* Tabs */}
              <div className="py-2">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                      style={{
                        background: isActive ? 'rgba(13,148,136,0.15)' : 'transparent',
                        borderLeft: isActive ? '3px solid #0D9488' : '3px solid transparent',
                        color: isActive ? '#2DD4BF' : '#94A3B8',
                        fontSize: 13,
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span style={{ fontFamily: 'Inter, sans-serif' }}>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'personal' && (
              <>
                <SectionCard title="Personal Information">
                  <div className="grid grid-cols-2 gap-4">
                    <EditableField label="First Name" value={firstName} onChange={v => markDirty(() => setFirstName(v))} />
                    <EditableField label="Last Name" value={lastName} onChange={v => markDirty(() => setLastName(v))} />
                    <EditableField label="Display Name" value={displayName} onChange={v => markDirty(() => setDisplayName(v))} />
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Title Prefix</label>
                      <select value={title} onChange={e => markDirty(() => setTitle(e.target.value))} className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                        {['Dr.', 'Mr.', 'Ms.', 'Mrs.', 'Prof.'].map(t => <option key={t} value={t} style={{ background: '#1E293B' }}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Date of Birth</label>
                      <input type="date" className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Gender</label>
                      <select className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#94A3B8', fontSize: 13 }}>
                        <option value="" style={{ background: '#1E293B' }}>Prefer not to say</option>
                        <option value="female" style={{ background: '#1E293B' }}>Female</option>
                        <option value="male" style={{ background: '#1E293B' }}>Male</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Preferred Language</label>
                      <div className="flex gap-2">
                        {['English', 'العربية', 'فارسی'].map(lang => (
                          <button key={lang} onClick={() => markDirty(() => setLanguage(lang))}
                            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                            style={{ background: language === lang ? '#0D9488' : 'rgba(51,65,85,0.4)', color: language === lang ? '#fff' : '#94A3B8', border: `1px solid ${language === lang ? '#0D9488' : 'rgba(51,65,85,0.6)'}` }}>
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {activeTab === 'professional' && (
              <SectionCard title="Professional Details">
                <div className="grid grid-cols-2 gap-4">
                  <ReadOnlyField label="Role" value="Super Admin" />
                  <ReadOnlyField label="Employee ID" value="EMP-001-ARYAIX" />
                  <ReadOnlyField label="Department" value="Executive Leadership" />
                  <EditableField label="Job Title" value={jobTitle} onChange={v => markDirty(() => setJobTitle(v))} />
                  <ReadOnlyField label="Joined Date" value="12 January 2025" />
                  <ReadOnlyField label="Reporting Manager" value="Board of Directors" />
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Professional Bio <span style={{ color: '#475569' }}>({bio.length}/500)</span></label>
                    <textarea
                      value={bio}
                      onChange={e => { if (e.target.value.length <= 500) markDirty(() => setBio(e.target.value)); }}
                      rows={4}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none"
                      style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13, fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            {activeTab === 'contact' && (
              <SectionCard title="Contact & Address">
                <div className="grid grid-cols-2 gap-4">
                  <ReadOnlyField label="Primary Email" value={SUPER_ADMIN_USER.email} />
                  <EditableField label="Secondary Email" value={secondaryEmail} onChange={v => markDirty(() => setSecondaryEmail(v))} placeholder="optional" />
                  <EditableField label="Mobile Phone" value={mobile} onChange={v => markDirty(() => setMobile(v))} />
                  <EditableField label="Office Phone" value={officePhone} onChange={v => markDirty(() => setOfficePhone(v))} placeholder="optional" />
                  <div className="col-span-2">
                    <div className="h-px mb-4" style={{ background: 'rgba(51,65,85,0.4)' }} />
                    <h3 className="font-semibold text-white mb-3" style={{ fontSize: 13 }}>Address</h3>
                  </div>
                  <div className="col-span-2">
                    <EditableField label="Street" value={street} onChange={v => markDirty(() => setStreet(v))} />
                  </div>
                  <EditableField label="City" value={city} onChange={v => markDirty(() => setCity(v))} />
                  <EditableField label="Emirate / State" value={emirate} onChange={v => markDirty(() => setEmirate(v))} />
                  <ReadOnlyField label="Country" value="United Arab Emirates" />
                  <EditableField label="Postal Code" value="" onChange={() => markDirty(() => {})} placeholder="optional" />
                </div>
              </SectionCard>
            )}

            {activeTab === 'linked' && (
              <SectionCard title="Linked Accounts">
                <div className="space-y-3">
                  {(Object.entries(linkedAccounts) as [keyof typeof linkedAccounts, boolean][]).map(([provider, connected]) => (
                    <div key={provider} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: provider === 'linkedin' ? '#0A66C2' : provider === 'github' ? '#24292E' : provider === 'microsoft' ? '#00A4EF' : '#EA4335' }}>
                          {provider[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500, textTransform: 'capitalize' }}>{provider}</div>
                          <div style={{ fontSize: 11, color: connected ? '#34D399' : '#475569' }}>{connected ? 'Connected' : 'Not connected'}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => markDirty(() => setLinkedAccounts(p => ({ ...p, [provider]: !p[provider] })))}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: connected ? 'rgba(239,68,68,0.1)' : 'rgba(13,148,136,0.2)', color: connected ? '#F87171' : '#5EEAD4', border: `1px solid ${connected ? 'rgba(239,68,68,0.3)' : 'rgba(13,148,136,0.3)'}` }}
                      >
                        {connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      {dirty && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-3 px-8 py-4 z-30" style={{ background: '#0F172A', borderTop: '1px solid rgba(51,65,85,0.6)' }}>
          <button onClick={() => { setDirty(false); }} className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>
            <X className="w-4 h-4" /> Discard
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2" style={{ background: '#0D9488', color: '#fff' }}>
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
      {saved && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl" style={{ background: '#0D9488', color: '#fff' }}>
          <Check className="w-4 h-4" /> Profile saved
        </div>
      )}
    </AdminPageLayout>
  );
}
