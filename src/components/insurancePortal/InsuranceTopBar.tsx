import React from 'react';
import { AlertTriangle, Shield, Download, Bell, ChevronDown } from 'lucide-react';

interface Props {
  onReviewOverdue: () => void;
}

const InsuranceTopBar: React.FC<Props> = ({ onReviewOverdue }) => {
  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-6"
      style={{
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 40,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ background: '#0F2D4A', fontSize: 14 }}
        >
          D
        </div>
        <div>
          <p className="font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17 }}>
            Insurance Dashboard
          </p>
          <p className="text-slate-400" style={{ fontSize: 12 }}>
            Daman National Health Insurance · 7 April 2026
          </p>
        </div>
      </div>

      {/* Center — SLA Alert */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl animate-pulse"
          style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
        >
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <div className="hidden xl:block">
            <p className="font-bold text-red-700 leading-none" style={{ fontSize: 11 }}>
              ⚠ 1 pre-auth SLA OVERDUE — PA-20260407-00912
            </p>
            <p className="text-red-500 mt-0.5" style={{ fontSize: 10 }}>
              PCI approval for Mohammed Ibrahim · 17 min overdue
            </p>
          </div>
          <button
            onClick={onReviewOverdue}
            className="flex-shrink-0 text-white font-bold rounded-lg px-3 py-1.5 transition-colors hover:bg-red-700"
            style={{ background: '#DC2626', fontSize: 11 }}
          >
            Review Now
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-red-600 transition-all hover:bg-red-50 animate-pulse"
          style={{ background: '#FEF2F2', fontSize: 12, border: '1px solid #FCA5A5' }}
        >
          <Shield size={14} className="text-red-600" />
          <span>2 Fraud Alerts</span>
        </button>

        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 transition-all hover:bg-slate-100"
          style={{ background: '#F1F5F9', fontSize: 12 }}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ background: '#1E3A5F', fontSize: 12 }}
          >
            MK
          </div>
          <div className="hidden md:block text-left">
            <p className="font-semibold text-slate-700 leading-tight" style={{ fontSize: 12 }}>Mariam Al Khateeb</p>
            <p className="text-slate-400 leading-tight" style={{ fontSize: 10 }}>Senior Claims Officer</p>
          </div>
          <ChevronDown size={12} className="text-slate-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
};

export default InsuranceTopBar;
