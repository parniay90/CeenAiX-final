import React, { useState } from 'react';
import { Shield, Lock, Smartphone, Key, Monitor, AlertTriangle, Check, X, Eye, EyeOff, Fingerprint, Activity } from 'lucide-react';
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
      <button onClick={() => onChange(!value)} className="relative flex-shrink-0 rounded-full transition-colors" style={{ width: 40, height: 22, background: value ? '#0D9488' : 'rgba(51,65,85,0.6)' }}>
        <div className="absolute top-1 rounded-full bg-white transition-all" style={{ width: 14, height: 14, left: value ? 22 : 4 }} />
      </button>
    </div>
  );
}

const SESSIONS = [
  { id: '1', device: 'Chrome / macOS', ip: '91.74.232.15', location: 'Dubai, UAE', started: '12m ago', last: 'Now', current: true },
  { id: '2', device: 'Safari / iPhone', ip: '91.74.232.22', location: 'Dubai, UAE', started: '2h ago', last: '45m ago', current: false },
  { id: '3', device: 'Chrome / Windows', ip: '212.48.10.1', location: 'Abu Dhabi, UAE', started: '1d ago', last: '1d ago', current: false },
];

const SECURITY_EVENTS = [
  { id: '1', event: 'Sign-in from new device', ip: '91.74.232.15', time: '12m ago', ok: true },
  { id: '2', event: 'Password changed', ip: '91.74.232.15', time: '3d ago', ok: true },
  { id: '3', event: '2FA TOTP code verified', ip: '212.48.10.1', time: '1d ago', ok: true },
  { id: '4', event: 'Failed sign-in attempt', ip: '182.55.1.10', time: '5d ago', ok: false },
  { id: '5', event: 'Recovery codes generated', ip: '91.74.232.15', time: '7d ago', ok: true },
];

const IDLE_OPTIONS = [5, 10, 15, 30, 60];

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const strength = next.length === 0 ? 0 : next.length < 8 ? 1 : next.length < 12 ? 2 : /[A-Z]/.test(next) && /[0-9]/.test(next) && /[^A-Za-z0-9]/.test(next) ? 4 : 3;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#0891B2', '#10B981'][strength];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(6px)' }} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-sm mx-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
          <h3 className="font-bold text-white" style={{ fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Change Password</h3>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: '#64748B' }} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} className="w-full rounded-xl px-4 py-2.5 pr-10 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
              <button onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button className="mt-1 text-xs" style={{ color: '#5EEAD4' }}>Forgot current password?</button>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>New Password</label>
            <input type="password" value={next} onChange={e => setNext(e.target.value)} className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
            {next.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1 flex-1">{[1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= strength ? strengthColor : 'rgba(51,65,85,0.5)' }} />)}</div>
                <span style={{ fontSize: 10, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Confirm New Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${confirm && confirm !== next ? 'rgba(239,68,68,0.5)' : 'rgba(51,65,85,0.6)'}`, color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <button disabled={!current || !next || next !== confirm || strength < 2} className="w-full py-2.5 rounded-xl font-semibold text-sm" style={{ background: current && next && next === confirm && strength >= 2 ? '#0D9488' : 'rgba(51,65,85,0.4)', color: current && next && next === confirm && strength >= 2 ? '#fff' : '#475569' }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsSecurity() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [idleMinutes, setIdleMinutes] = useState(15);
  const [lockOnHide, setLockOnHide] = useState(false);
  const [requireBiometric, setRequireBiometric] = useState(false);
  const [emailNewDevice, setEmailNewDevice] = useState(true);
  const [emailNewCountry, setEmailNewCountry] = useState(true);
  const [emailSensitive, setEmailSensitive] = useState(true);
  const [sessions, setSessions] = useState(SESSIONS);

  const securityScore = twoFAEnabled ? (requireBiometric ? 'Strong' : 'Good') : 'Needs attention';
  const scoreColor = securityScore === 'Strong' ? '#10B981' : securityScore === 'Good' ? '#0891B2' : '#F59E0B';

  return (
    <AdminPageLayout activeSection="security">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Security</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Protect your account and manage active sessions.</p>
          </div>
          <span className="px-3 py-1 rounded-full font-bold text-xs" style={{ background: `${scoreColor}22`, color: scoreColor, border: `1px solid ${scoreColor}44` }}>
            {securityScore}
          </span>
        </div>

        {/* Password */}
        <SettingCard title="Password">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: 13, color: '#E2E8F0' }}>Password last changed</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B', marginTop: 2 }}>2026-01-15 · 106 days ago</div>
            </div>
            <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(13,148,136,0.2)', color: '#5EEAD4', border: '1px solid rgba(13,148,136,0.3)' }}>
              Change Password
            </button>
          </div>
        </SettingCard>

        {/* 2FA */}
        <SettingCard title="Two-Factor Authentication">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: twoFAEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)' }}>
                <Shield className="w-4 h-4" style={{ color: twoFAEnabled ? '#10B981' : '#EF4444' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 600 }}>2FA is {twoFAEnabled ? 'enabled' : 'disabled'}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Additional verification required at sign-in</div>
              </div>
            </div>
            <button onClick={() => setTwoFAEnabled(p => !p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: twoFAEnabled ? 'rgba(239,68,68,0.1)' : 'rgba(13,148,136,0.2)', color: twoFAEnabled ? '#F87171' : '#5EEAD4' }}>
              {twoFAEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          {[
            { icon: Smartphone, label: 'Authenticator App (TOTP)', sub: 'Recommended · Google Authenticator / Authy', active: true },
            { icon: Key, label: 'SMS Verification', sub: '+971 50 ··· 4567', active: true },
            { icon: Shield, label: 'Email Backup Codes', sub: '10 codes remaining', active: true },
            { icon: Fingerprint, label: 'Hardware Security Key', sub: 'WebAuthn / FIDO2', active: false },
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
              <div className="flex items-center gap-3">
                <m.icon className="w-4 h-4" style={{ color: m.active ? '#5EEAD4' : '#475569' }} />
                <div>
                  <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>{m.sub}</div>
                </div>
              </div>
              <button className="text-xs px-3 py-1 rounded-lg" style={{ background: m.active ? 'rgba(239,68,68,0.08)' : 'rgba(13,148,136,0.15)', color: m.active ? '#F87171' : '#5EEAD4' }}>
                {m.active ? 'Disable' : 'Add key'}
              </button>
            </div>
          ))}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.4)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Recovery codes: 10 codes available.</span>
            <button className="ml-auto text-xs" style={{ color: '#5EEAD4' }}>Generate new</button>
          </div>
        </SettingCard>

        {/* Screen Lock */}
        <SettingCard title="Screen Lock">
          <ToggleRow label="Auto-lock when idle" desc="Locks the screen after a period of inactivity" value={autoLock} onChange={setAutoLock} />
          {autoLock && (
            <div className="pt-4">
              <label className="block text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Idle Timeout</label>
              <div className="flex gap-2">
                {IDLE_OPTIONS.map(m => (
                  <button key={m} onClick={() => setIdleMinutes(m)} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: idleMinutes === m ? '#0D9488' : 'rgba(51,65,85,0.4)', color: idleMinutes === m ? '#fff' : '#94A3B8' }}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}
          <ToggleRow label="Lock when tab is hidden" desc="Locks after tab is inactive for more than 5 minutes" value={lockOnHide} onChange={setLockOnHide} />
          <ToggleRow label="Require biometric on unlock" value={requireBiometric} onChange={setRequireBiometric} />
          <div className="pt-3">
            <button className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(51,65,85,0.5)', color: '#CBD5E1', border: '1px solid rgba(51,65,85,0.6)' }}>
              Test lock now
            </button>
          </div>
        </SettingCard>

        {/* Active Sessions */}
        <SettingCard title="Active Sessions" subtitle="Sessions currently signed into your account">
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: s.current ? 'rgba(13,148,136,0.08)' : 'rgba(15,23,42,0.4)', border: `1px solid ${s.current ? 'rgba(13,148,136,0.25)' : 'rgba(51,65,85,0.3)'}` }}>
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 flex-shrink-0" style={{ color: s.current ? '#5EEAD4' : '#475569' }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{s.device}</span>
                      {s.current && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(13,148,136,0.2)', color: '#5EEAD4' }}>THIS SESSION</span>}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569' }}>{s.ip} · {s.location} · {s.last}</div>
                  </div>
                </div>
                {!s.current && (
                  <button onClick={() => setSessions(p => p.filter(x => x.id !== s.id))} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171' }}>
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs font-semibold" style={{ color: '#F87171' }}>
            Sign out everywhere except this device
          </button>
        </SettingCard>

        {/* Login Alerts */}
        <SettingCard title="Login Alerts">
          <ToggleRow label="Email on new device sign-in" value={emailNewDevice} onChange={setEmailNewDevice} />
          <ToggleRow label="Email on sign-in from new country" value={emailNewCountry} onChange={setEmailNewCountry} />
          <ToggleRow label="Email on sensitive actions" desc="Password change, 2FA disabled, impersonation start" value={emailSensitive} onChange={setEmailSensitive} />
        </SettingCard>

        {/* Account Activity */}
        <SettingCard title="Recent Account Activity">
          <div className="space-y-1">
            {SECURITY_EVENTS.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ev.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
                  {ev.ok ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />}
                </div>
                <div className="flex-1">
                  <span style={{ fontSize: 12, color: '#CBD5E1' }}>{ev.event}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569', marginLeft: 8 }}>{ev.ip}</span>
                </div>
                <span style={{ fontSize: 11, color: '#475569' }}>{ev.time}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs font-semibold" style={{ color: '#5EEAD4' }}>View full audit log →</button>
        </SettingCard>
      </div>

      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
    </AdminPageLayout>
  );
}
