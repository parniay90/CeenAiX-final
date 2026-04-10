import React, { useState } from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import SettingsCard from '../SettingsCard';
import SettingsRow from '../SettingsRow';
import SectionDivider from '../SectionDivider';
import SimpleModal from '../SimpleModal';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const loginHistory = [
  { date: 'Today 11:34 AM', device: 'MacBook Pro — Chrome 123', location: 'Dubai, UAE', status: 'Current' },
  { date: 'Yesterday 8:02 AM', device: 'iPhone 14 — CeenAiX App', location: 'Dubai, UAE', status: 'OK' },
  { date: '2 days ago 7:55 PM', device: 'MacBook Pro — Chrome 123', location: 'Dubai, UAE', status: 'OK' },
  { date: '3 days ago 9:10 AM', device: 'iPad — Safari', location: 'Abu Dhabi, UAE', status: 'OK' },
  { date: '5 days ago 6:30 PM', device: 'MacBook Pro — Chrome 123', location: 'Dubai, UAE', status: 'OK' },
];

const SecuritySection: React.FC<Props> = ({ showToast }) => {
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(true);
  const [trustDevice, setTrustDevice] = useState(true);
  const [pwdModal, setPwdModal] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  return (
    <>
      <SettingsCard id="security" title="Security" icon={ShieldCheck} iconBg="bg-red-100" iconColor="text-red-600">
        <div className="mx-6 mt-4 mb-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-slate-800">Account Security: Strong</p>
            <span className="text-[11px] text-teal-600 font-medium">88/100</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: '88%' }} />
          </div>
          <p className="text-[11px] text-slate-500">+12 points: add authenticator app</p>
          <button className="text-[11px] text-teal-600 hover:text-teal-700 font-medium mt-1 transition-colors">
            View Security Tips →
          </button>
        </div>

        <SettingsRow
          label="Password"
          description="Last changed 3 months ago"
          type="value"
          value="●●●●●●●●●●●"
          onValueClick={() => setPwdModal(true)}
        />
        <SettingsRow
          label="Two-Factor Authentication"
          description="Additional login verification"
          type="value"
          value="✅ SMS · +971 50 ●●● ●●●●"
          onValueClick={() => setTwoFaModal(true)}
        />
        <SettingsRow
          label="Prescribing PIN (DHA Digital Signature)"
          description="4-digit PIN to sign ePrescriptions — DHA requirement"
          type="value"
          value="●●●●"
          onValueClick={() => setPinModal(true)}
        />
        <SettingsRow
          label="Face ID / Touch ID"
          description="Biometric login on mobile"
          type="toggle"
          toggleValue={biometric}
          onToggle={(v) => { setBiometric(v); showToast(`✅ Biometric login ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="New Device Login Alerts"
          type="toggle"
          toggleValue={loginAlerts}
          onToggle={(v) => { setLoginAlerts(v); showToast(`✅ Login alerts ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Suspicious Activity Alerts"
          type="toggle"
          toggleValue={suspiciousAlerts}
          onToggle={(v) => { setSuspiciousAlerts(v); showToast(`✅ Suspicious alerts ${v ? 'on' : 'off'}`); }}
        />
        <SettingsRow
          label="Trust This Device (skip 2FA for 30 days)"
          type="toggle"
          toggleValue={trustDevice}
          onToggle={(v) => { setTrustDevice(v); showToast(`✅ Device trust ${v ? 'enabled' : 'disabled'}`); }}
        />
        <SettingsRow
          label="Login Activity"
          description="Last: Today 11:34 AM — Dubai, UAE"
          type="value"
          value="5 sessions"
          onValueClick={() => setLoginModal(true)}
        />

        <SectionDivider label="DANGER ZONE" />

        <SettingsRow
          label="Log Out All Other Devices"
          description="Sign out from all devices except this one"
          type="danger"
          dangerous
          onValueClick={() => setLogoutModal(true)}
          last
        />
      </SettingsCard>

      {pwdModal && (
        <SimpleModal title="Change Password" onClose={() => setPwdModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-slate-500 mb-1 block">Current Password</label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="text-[12px] text-slate-500 mb-1 block">New Password</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Minimum 12 characters"
              />
            </div>
            <div>
              <label className="text-[12px] text-slate-500 mb-1 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Re-enter new password"
              />
            </div>
            <button
              onClick={() => { setPwdModal(false); showToast('✅ Password updated successfully'); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors mt-2"
            >
              Update Password
            </button>
          </div>
        </SimpleModal>
      )}

      {twoFaModal && (
        <SimpleModal title="Two-Factor Authentication" onClose={() => setTwoFaModal(false)}>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-[13px] font-medium text-emerald-700">✅ SMS Authentication Active</p>
              <p className="text-[12px] text-emerald-600 mt-0.5">+971 50 ●●● ●●●●</p>
            </div>
            {['📱 Add Authenticator App', '📋 Generate Backup Codes', '🔄 Change 2FA Phone Number'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setTwoFaModal(false); showToast(`✅ ${opt.slice(3)} initiated`); }}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 text-[14px] text-slate-700 transition-colors"
              >
                {opt}
              </button>
            ))}
            <button
              onClick={() => { setTwoFaModal(false); showToast('⚠️ 2FA disabling requires password verification', 'warning'); }}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-200 hover:border-red-300 text-[14px] text-red-600 transition-colors"
            >
              Disable 2FA
            </button>
          </div>
        </SimpleModal>
      )}

      {pinModal && (
        <SimpleModal title="Change Prescribing PIN" onClose={() => setPinModal(false)}>
          <div className="p-3 bg-blue-50 rounded-xl mb-4">
            <p className="text-[12px] text-blue-700">
              This PIN digitally signs DHA ePrescriptions with your license DHA-PRAC-2018-047821
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-slate-500 mb-1 block">Current PIN</label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="●●●●"
              />
            </div>
            <div>
              <label className="text-[12px] text-slate-500 mb-1 block">New PIN (4 digits)</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="●●●●"
              />
            </div>
            <button
              onClick={() => { setPinModal(false); showToast('✅ Prescribing PIN updated'); setCurrentPin(''); setNewPin(''); }}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
            >
              Update PIN
            </button>
          </div>
        </SimpleModal>
      )}

      {loginModal && (
        <SimpleModal title="Login Activity" onClose={() => setLoginModal(false)}>
          <div className="space-y-2 mb-4">
            {loginHistory.map((entry, i) => (
              <div key={i} className={`p-3 rounded-xl border ${entry.status === 'Current' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-slate-800">{entry.device}</p>
                  {entry.status === 'Current' && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Current</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{entry.location} · {entry.date}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setLoginModal(false); showToast('⚠️ Please contact support to report suspicious activity', 'warning'); }}
            className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl font-medium text-[13px] hover:bg-red-50 transition-colors"
          >
            🚨 Report Suspicious Login
          </button>
        </SimpleModal>
      )}

      {logoutModal && (
        <SimpleModal title="Log Out All Devices" onClose={() => setLogoutModal(false)}>
          <div className="p-4 bg-red-50 rounded-xl mb-4">
            <p className="text-[14px] font-semibold text-red-800 mb-1">Are you sure?</p>
            <p className="text-[13px] text-red-700">This will sign out all other devices. You will remain logged in on this device.</p>
          </div>
          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
            placeholder="Enter password to confirm"
          />
          <button
            onClick={() => { setLogoutModal(false); showToast('✅ All other devices logged out'); }}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out All Devices</span>
          </button>
        </SimpleModal>
      )}
    </>
  );
};

export default SecuritySection;
