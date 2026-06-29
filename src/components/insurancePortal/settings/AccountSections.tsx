import React, { useState } from 'react';
import { Building2, User, ShieldCheck, Monitor, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { SectionCard, SettingRow, SectionLabel, Toggle, InfoCard, SettingsInput, SettingsSelect, RadioGroup, SmallBtn } from './SettingsPrimitives';

interface Props {
  dirty: Record<string, boolean>;
  markDirty: (id: string) => void;
  onSave: (id: string, msg: string) => void;
  saving: string | null;
}

/* ── COMPANY PROFILE ─────────────────────────────────────────── */
export function CompanyProfileSection({ dirty, markDirty, onSave, saving }: Props) {
  const [arabicName, setArabicName] = useState('شركة ضمان للتأمين الوطني للصحة');
  const [email, setEmail] = useState('mariam.khateeb@daman.ae');
  const [phone, setPhone] = useState('+971 4 209 4000');
  const [language, setLanguage] = useState('english');

  function handleChange(field: string, fn: () => void) {
    fn();
    markDirty('company-profile');
  }

  return (
    <SectionCard
      id="company-profile"
      icon={<Building2 size={20} color="#1E3A5F" />}
      title="Company Profile"
      desc="Daman's identity on the CeenAiX platform"
      hasChanges={dirty['company-profile']}
      onSave={() => onSave('company-profile', 'Company profile saved')}
      saving={saving === 'company-profile'}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid #F9FAFB', marginBottom: 4 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 26, color: '#1E3A5F' }}>D</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Daman National Health Insurance</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 2 }}>Logo shown in sidebar, emails, and patient portal</div>
        </div>
        <SmallBtn>📷 Upload Logo</SmallBtn>
      </div>

      <SettingRow label="Company Name (EN)" desc="Contact CeenAiX admin to change company name" locked>
        <SettingsInput value="Daman National Health Insurance" onChange={() => {}} readOnly width={220} />
      </SettingRow>

      <SettingRow label="Company Name (AR)" desc="Displayed in Arabic language interface">
        <SettingsInput
          value={arabicName} onChange={v => handleChange('company-profile', () => setArabicName(v))}
          width={220} changed={dirty['company-profile']}
        />
      </SettingRow>

      <SettingRow label="License Number" desc="Insurance Authority license number" locked>
        <SettingsInput value="CBUAE-INS-2006-001847" onChange={() => {}} readOnly mono width={200} />
      </SettingRow>

      <SettingRow label="Primary Contact Email" desc="Used for system notifications and DHA communications">
        <SettingsInput
          value={email} onChange={v => handleChange('company-profile', () => setEmail(v))}
          width={220} type="email"
        />
      </SettingRow>

      <SettingRow label="Support Phone" desc="Displayed to members on CeenAiX patient portal">
        <SettingsInput
          value={phone} onChange={v => handleChange('company-profile', () => setPhone(v))}
          width={160}
        />
      </SettingRow>

      <SettingRow label="Contact Person" desc="Primary technical contact for CeenAiX platform issues">
        <div style={{ display: 'flex', gap: 8 }}>
          <SettingsInput value="Mariam Al Khateeb" onChange={() => markDirty('company-profile')} width={150} />
          <SettingsInput value="Senior Claims Officer" onChange={() => markDirty('company-profile')} width={160} />
        </div>
      </SettingRow>

      <SettingRow label="Portal Language" desc="Default language for portal interface" last>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['english', 'arabic', 'both'] as const).map(l => (
            <button
              key={l}
              onClick={() => { setLanguage(l); markDirty('company-profile'); }}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: language === l ? '#1E3A5F' : '#F8FAFC',
                color: language === l ? '#fff' : '#475569',
                border: language === l ? '1px solid #1E3A5F' : '1px solid #E2E8F0',
              }}
            >{l === 'both' ? 'Both' : l.charAt(0).toUpperCase() + l.slice(1)}</button>
          ))}
        </div>
      </SettingRow>
    </SectionCard>
  );
}

/* ── MY ACCOUNT ──────────────────────────────────────────────── */
export function MyAccountSection({ dirty, markDirty, onSave, saving }: Props) {
  const [name, setName] = useState('Mariam Al Khateeb');
  const [title, setTitle] = useState('Senior Claims Officer');
  const [mobile, setMobile] = useState('+971 50 XXX XXXX');
  const [defaultView, setDefaultView] = useState('preauth');

  return (
    <SectionCard
      id="my-account"
      icon={<User size={20} color="#1E3A5F" />}
      title="My Account"
      desc="Your personal portal account settings"
      hasChanges={dirty['my-account']}
      onSave={() => onSave('my-account', 'Account settings saved')}
      saving={saving === 'my-account'}
    >
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid #F9FAFB', marginBottom: 4 }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>MK</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Mariam Al Khateeb</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Senior Claims Officer</div>
        </div>
        <SmallBtn>📷 Change Photo</SmallBtn>
      </div>

      <SettingRow label="Full Name">
        <SettingsInput value={name} onChange={v => { setName(v); markDirty('my-account'); }} width={200} />
      </SettingRow>

      <SettingRow label="Job Title">
        <SettingsInput value={title} onChange={v => { setTitle(v); markDirty('my-account'); }} width={200} />
      </SettingRow>

      <SettingRow label="Department">
        <SettingsSelect
          value="claims"
          onChange={() => markDirty('my-account')}
          options={[
            { value: 'claims', label: 'Claims & Pre-Authorization' },
            { value: 'fraud', label: 'Fraud & SIU' },
            { value: 'compliance', label: 'Compliance' },
            { value: 'finance', label: 'Finance' },
            { value: 'it', label: 'IT' },
          ]}
          width={200}
        />
      </SettingRow>

      <SettingRow label="Employee ID" desc="Assigned by HR — read only" locked>
        <SettingsInput value="DAM-EMP-2019-00847" onChange={() => {}} readOnly mono width={180} />
      </SettingRow>

      <SettingRow label="Work Email" desc="Managed by IT" locked>
        <SettingsInput value="mariam.khateeb@daman.ae" onChange={() => {}} readOnly width={220} />
      </SettingRow>

      <SettingRow label="Mobile" desc="Used for SMS alerts and 2FA">
        <SettingsInput value={mobile} onChange={v => { setMobile(v); markDirty('my-account'); }} width={160} />
      </SettingRow>

      <SettingRow label="Preferred Language">
        <div style={{ display: 'flex', gap: 8 }}>
          {(['English', 'Arabic'] as const).map(l => (
            <button key={l} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: l === 'English' ? '#1E3A5F' : '#F8FAFC', color: l === 'English' ? '#fff' : '#475569', border: l === 'English' ? '1px solid #1E3A5F' : '1px solid #E2E8F0' }}>
              {l}
            </button>
          ))}
        </div>
      </SettingRow>

      <SettingRow label="Default Dashboard View" desc="What you see when you first log in" last>
        <RadioGroup
          name="default-view"
          value={defaultView}
          onChange={v => { setDefaultView(v); markDirty('my-account'); }}
          options={[
            { value: 'preauth', label: 'Pre-Authorization Queue' },
            { value: 'claims', label: 'Claims Dashboard' },
            { value: 'dashboard', label: 'Full Dashboard' },
          ]}
        />
      </SettingRow>
    </SectionCard>
  );
}

/* ── SECURITY & ACCESS ───────────────────────────────────────── */
export function SecuritySection({ dirty, markDirty, onSave, saving }: Props) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [timeout, setTimeout_] = useState('30');
  const [pwValid] = useState({ length: true, case: true, number: true, special: true });

  return (
    <SectionCard
      id="security"
      icon={<ShieldCheck size={20} color="#1E3A5F" />}
      title="Security & Access"
      desc="Account security and access controls"
      hasChanges={dirty['security']}
      onSave={() => onSave('security', 'Password changed successfully')}
      saving={saving === 'security'}
    >
      <SectionLabel>Change Password</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Current password"
            value={currentPw}
            onChange={e => { setCurrentPw(e.target.value); markDirty('security'); }}
            style={{ width: '100%', height: 36, padding: '0 36px 0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
          />
          <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
            {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="password" placeholder="New password" value={newPw} onChange={e => { setNewPw(e.target.value); markDirty('security'); }}
            style={{ flex: 1, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#F8FAFC' }} />
          <input type="password" placeholder="Confirm password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); markDirty('security'); }}
            style={{ flex: 1, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#F8FAFC' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #F1F5F9' }}>
          {[
            { ok: pwValid.length,  label: '12+ characters' },
            { ok: pwValid.case,    label: 'Upper + lower' },
            { ok: pwValid.number,  label: 'Number' },
            { ok: pwValid.special, label: 'Special char' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: r.ok ? '#059669' : '#CBD5E1' }}>
              <span>{r.ok ? '✅' : '○'}</span> {r.label}
            </div>
          ))}
        </div>
      </div>

      <SettingRow label="Two-Factor Authentication" desc="Required for all insurance portal staff" locked lockedNote="Required by DHA regulations">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 6, padding: '4px 8px' }}>✅ SMS · +971 50 ●●● ●●●●</span>
          <SmallBtn>Manage 2FA</SmallBtn>
        </div>
      </SettingRow>

      <SettingRow label="Auto Logout After Inactivity" desc="Recommended: 30 minutes for security compliance">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingsSelect
            value={timeout}
            onChange={v => { setTimeout_(v); markDirty('security'); }}
            options={[
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour' },
              { value: '120', label: '2 hours' },
            ]}
            width={140}
          />
        </div>
      </SettingRow>

      <SectionLabel>Current Active Sessions</SectionLabel>
      {[
        { device: 'Chrome · Windows 11', location: 'Dubai, UAE', icon: Monitor, time: 'This session', current: true },
        { device: 'Safari · iPhone 14', location: 'Dubai, UAE', icon: Smartphone, time: 'Yesterday 6:30 PM', current: false },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i === 0 ? '1px solid #F9FAFB' : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <s.icon size={15} color="#64748B" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.device} · {s.location}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.time}</div>
          </div>
          {s.current
            ? <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#ECFDF5', borderRadius: 6, padding: '3px 8px' }}>🟢 This session</span>
            : <SmallBtn variant="red"><Lock size={11} /> Log Out</SmallBtn>
          }
        </div>
      ))}
      <div style={{ marginTop: 12 }}>
        <SmallBtn variant="red">Log Out All Other Sessions</SmallBtn>
      </div>
    </SectionCard>
  );
}
