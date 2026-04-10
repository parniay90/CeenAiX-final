import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import SettingsCard from '../SettingsCard';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const DevicesSection: React.FC<Props> = ({ showToast }) => {
  return (
    <SettingsCard id="devices" title="Devices & Sessions" icon={Monitor} iconBg="bg-orange-100" iconColor="text-orange-600">
      <div className="p-6 space-y-3">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          ACTIVE SESSIONS
        </p>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Monitor className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>MacBook Pro — Chrome 123</p>
              <p className="text-[12px] text-slate-500">Dubai, UAE · 178.XX.XX.XX</p>
              <p className="text-[12px] text-emerald-600 font-medium mt-0.5">Logged in: Today 11:34 AM · CURRENTLY ACTIVE</p>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0">Cannot revoke</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>iPhone 14 — CeenAiX iOS App v2.4.1</p>
              <p className="text-[12px] text-slate-500">Dubai, UAE · Last active: 2 days ago</p>
            </div>
            <button
              onClick={() => showToast('✅ iPhone session terminated')}
              className="flex-shrink-0 px-3 py-1.5 border border-red-300 text-red-500 text-[12px] rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Log Out
            </button>
          </div>
        </div>

        <button
          onClick={() => showToast('⚠️ Please change your password and contact support immediately', 'warning')}
          className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-[13px] font-medium hover:bg-red-50 transition-colors"
        >
          🚨 Session I don't recognize
        </button>

        <div className="border-t border-slate-100 pt-4 mt-4">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            PUSH NOTIFICATIONS
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[13px] font-medium text-slate-800">MacBook Pro — Push</p>
                <p className="text-[11px] text-emerald-600">✅ Notifications enabled</p>
              </div>
              <button
                onClick={() => showToast('✅ MacBook notifications disabled')}
                className="text-[11px] text-slate-500 hover:text-slate-700 underline transition-colors"
              >
                Disable for this device
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-50">
              <div>
                <p className="text-[13px] font-medium text-slate-800">CeenAiX iOS App</p>
                <p className="text-[11px] text-emerald-600">✅ Notifications enabled</p>
              </div>
              <button
                onClick={() => showToast('✅ iPhone notifications disabled')}
                className="text-[11px] text-slate-500 hover:text-slate-700 underline transition-colors"
              >
                Disable for iPhone
              </button>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default DevicesSection;
