import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Eye, Bell } from 'lucide-react';
import SimpleModal from '../../../settings/doctor/SimpleModal';
import SettingsToggle from '../../../settings/doctor/SettingsToggle';

interface BankSecuritySectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const BankSecuritySection: React.FC<BankSecuritySectionProps> = ({ showToast }) => {
  const [showIban, setShowIban] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);

  const notifs = [
    { label: 'New appointment booked', locked: false, initial: true },
    { label: 'Appointment reminder (1h before)', locked: false, initial: true },
    { label: 'New patient message', locked: false, initial: true },
    { label: 'Lab critical result', locked: true, initial: true, note: 'Required by DHA — cannot disable ⚠️' },
    { label: 'New prescription query', locked: false, initial: true },
    { label: 'Revenue deposit', locked: false, initial: true },
    { label: 'DHA compliance alerts', locked: true, initial: true },
    { label: 'Platform updates', locked: false, initial: true },
  ];
  const [notifState, setNotifState] = useState(notifs.map((n) => n.initial));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Payment Details</h2>
            <p className="text-[12px] text-slate-400">For CeenAiX platform earnings disbursement</p>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          <Row label="Bank" value="First Abu Dhabi Bank (FAB)" />
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">IBAN</p>
              <span className="text-[14px] text-slate-900" style={{ fontFamily: 'DM Mono, monospace' }}>
                {showIban ? 'AE07 0331 2345 6789 0123 456' : 'AE07 0331 ●●●● ●●●● ●●●● ●●●'}
              </span>
            </div>
            <button
              onClick={() => { setShowIban(true); setTimeout(() => setShowIban(false), 30000); showToast('👁 IBAN revealed — logged to audit'); }}
              className="flex items-center space-x-1 text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /><span>Reveal</span>
            </button>
          </div>
          <Row label="Account Name" value="Ahmed Khalid Al Rashidi" />
          <Row label="Payment Schedule" value="Monthly — 1st of each month" />
          <Row label="VAT TRN" value="TRN-100●●●●●●●●" mono />
        </div>
        <div className="px-6 py-3 border-t border-slate-50">
          <button onClick={() => setBankModal(true)} className="text-[13px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
            ✏️ Edit Bank Details →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Account Security</h2>
        </div>
        <div className="divide-y divide-slate-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-slate-900">Password</p>
              <p className="text-[12px] text-slate-400">Last changed: 3 months ago</p>
            </div>
            <button onClick={() => setPwdModal(true)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-[12px] text-emerald-600">✅ SMS to +971 50 ●●● ●●●●</p>
            </div>
            <button onClick={() => showToast('✅ 2FA management opened')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
              Manage 2FA
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-slate-900">Biometric Login</p>
              <p className="text-[12px] text-slate-400">Face ID / Touch ID: Not configured</p>
            </div>
            <button onClick={() => showToast('✅ Biometric setup started')} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Set Up →
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-slate-900">Prescribing PIN (DHA)</p>
              <p className="text-[12px] text-emerald-600">✅ Configured</p>
            </div>
            <button onClick={() => setPinModal(true)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
              Change PIN
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-slate-900">Active Sessions</p>
              <p className="text-[12px] text-slate-400">2 sessions (MacBook + iPhone)</p>
            </div>
            <button onClick={() => showToast('✅ Sessions manager opened')} className="text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Manage →
            </button>
          </div>
          <div className="px-6 py-3">
            <p className="text-[11px] text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>
              Last login: Today 11:34 AM · Dubai, UAE · Chrome
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Notification Preferences</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {notifs.map((n, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-[13px] text-slate-800">{n.label}</p>
                {n.note && <p className="text-[11px] text-amber-600 mt-0.5">{n.note}</p>}
              </div>
              <SettingsToggle
                enabled={notifState[i]}
                onChange={(v) => { const updated = [...notifState]; updated[i] = v; setNotifState(updated); }}
                disabled={n.locked}
              />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-3">Channels</p>
          <div className="flex items-center space-x-6">
            {[['In-App', true], ['SMS', true], ['Email', true], ['WhatsApp', false]].map(([label, active]) => (
              <div key={label as string} className="flex items-center space-x-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {active ? '✓' : '✕'}
                </span>
                <span className="text-[12px] text-slate-600">{label as string}</span>
              </div>
            ))}
          </div>
          <button onClick={() => showToast('✅ Notification preferences saved')} className="w-full mt-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-[13px] font-medium transition-colors">
            Save Notification Preferences
          </button>
        </div>
      </div>

      {bankModal && (
        <SimpleModal title="Update Bank Details" onClose={() => setBankModal(false)}>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <p className="text-[13px] text-amber-800">Bank details update requires verification. Takes 3 business days to take effect.</p>
          </div>
          <div className="space-y-3">
            <input placeholder="New IBAN" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" style={{ fontFamily: 'DM Mono, monospace' }} />
            <input placeholder="Emirates ID number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <input placeholder="OTP from +971 50 ●●● ●●●●" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400 tracking-widest" />
          </div>
          <button onClick={() => { setBankModal(false); showToast('✅ Bank details updated — effective in 3 business days', 'warning'); }} className="w-full mt-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors">
            Submit Bank Update
          </button>
        </SimpleModal>
      )}

      {pwdModal && (
        <SimpleModal title="Change Password" onClose={() => setPwdModal(false)}>
          <div className="space-y-3">
            {['Current Password', 'New Password (min 12 chars)', 'Confirm New Password'].map((ph) => (
              <input key={ph} type="password" placeholder={ph} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" />
            ))}
          </div>
          <button onClick={() => { setPwdModal(false); showToast('✅ Password updated'); }} className="w-full mt-4 py-3 bg-teal-500 text-white rounded-xl font-medium">Update Password</button>
        </SimpleModal>
      )}

      {pinModal && (
        <SimpleModal title="Change Prescribing PIN" onClose={() => setPinModal(false)}>
          <div className="p-3 bg-blue-50 rounded-xl mb-3">
            <p className="text-[12px] text-blue-700">Signs DHA ePrescriptions · License DHA-PRAC-2018-047821</p>
          </div>
          <div className="space-y-3">
            {['Current PIN', 'New PIN (4 digits)', 'Confirm New PIN'].map((ph) => (
              <input key={ph} type="password" maxLength={4} placeholder={ph} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400" />
            ))}
          </div>
          <button onClick={() => { setPinModal(false); showToast('✅ Prescribing PIN updated'); }} className="w-full mt-4 py-3 bg-teal-500 text-white rounded-xl font-medium">Update PIN</button>
        </SimpleModal>
      )}
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="px-6 py-4">
    <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <span className="text-[14px] text-slate-900" style={mono ? { fontFamily: 'DM Mono, monospace' } : {}}>{value}</span>
  </div>
);

export default BankSecuritySection;
