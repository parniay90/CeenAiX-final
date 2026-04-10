import React, { useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import SettingsCard from '../SettingsCard';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const helpCategories = [
  { icon: '📅', label: 'Appointments Help' },
  { icon: '💊', label: 'Prescription Guide' },
  { icon: '🔬', label: 'Lab Referrals Help' },
  { icon: '🛡️', label: 'Insurance Help' },
  { icon: '💬', label: 'Messages Help' },
  { icon: '📋', label: 'DHA Compliance Guide' },
];

const HelpSection: React.FC<Props> = ({ showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SettingsCard id="help" title="Help & Support" icon={HelpCircle} iconBg="bg-green-100" iconColor="text-green-600">
      <div className="p-6 space-y-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {searchQuery && (
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            {['How to use AI SOAP drafting', 'DHA compliance requirements', 'Writing ePrescriptions'].map((result) => (
              <button
                key={result}
                onClick={() => showToast(`✅ Opening: ${result}`)}
                className="w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
              >
                {result}
              </button>
            ))}
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            HELP CATEGORIES
          </p>
          <div className="grid grid-cols-2 gap-2">
            {helpCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => showToast(`✅ Opening ${cat.label}`)}
                className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-[12px] font-medium text-slate-700" style={{ fontFamily: 'Inter, sans-serif' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-[13px] font-semibold text-slate-800 mb-3">Can't find what you need?</p>
          <div className="space-y-2">
            <button
              onClick={() => showToast('✅ Opening live chat')}
              className="w-full flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left"
            >
              <span className="text-xl">💬</span>
              <div>
                <p className="text-[13px] font-medium text-slate-800">Live Chat</p>
                <p className="text-[11px] text-slate-400">Sun–Thu 9AM–6PM · &lt;2 min response</p>
              </div>
            </button>
            <button
              onClick={() => showToast('✅ Opening email support')}
              className="w-full flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left"
            >
              <span className="text-xl">📧</span>
              <div>
                <p className="text-[13px] font-medium text-slate-800">Email Support</p>
                <p className="text-[11px] text-slate-400">support@ceenaix.com · 24h response</p>
              </div>
            </button>
            <button
              onClick={() => showToast('✅ Opening call support')}
              className="w-full flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left"
            >
              <span className="text-xl">📞</span>
              <div>
                <p className="text-[13px] font-medium text-slate-800">Call Support</p>
                <p className="text-[11px] text-slate-400">+971 4 XXX XXXX · Sun–Thu 9–5</p>
              </div>
            </button>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">📋</span>
                <p className="text-[13px] font-semibold text-blue-800">DHA Practitioner Support</p>
              </div>
              <p className="text-[12px] text-blue-700">DHA helpline: <span className="font-mono font-semibold">800-DHA (342)</span></p>
              <p className="text-[11px] text-blue-600 mt-0.5">License and compliance queries</p>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default HelpSection;
