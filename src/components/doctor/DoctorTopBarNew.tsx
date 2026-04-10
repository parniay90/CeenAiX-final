import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, AlertOctagon } from 'lucide-react';

interface DoctorTopBarProps {
  hasCriticalAlert?: boolean;
  onAcknowledgeCritical?: () => void;
}

const DoctorTopBarNew: React.FC<DoctorTopBarProps> = ({
  hasCriticalAlert = true,
  onAcknowledgeCritical
}) => {
  const [currentTime, setCurrentTime] = useState('2:04 PM');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-slate-800 font-bold text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Dashboard
          </h1>
          <div className="flex items-center space-x-2 text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span>Wednesday, 7 April 2026</span>
            <span>·</span>
            <span className="font-mono">{currentTime} GST</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-700 text-[13px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Consulting: Aisha Mohammed
          </span>
          <span className="text-slate-400 text-[11px] font-mono">Started: 2:00 PM — 4 min</span>
        </div>

        {hasCriticalAlert && (
          <>
            <div className="w-px h-6 bg-slate-200"></div>
            <button
              onClick={onAcknowledgeCritical}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[13px] font-medium transition-colors shadow-lg animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>CRITICAL: Abdullah Hassan — Troponin 2.8</span>
              <span className="px-2 py-0.5 bg-white/20 rounded text-[11px]">Acknowledge</span>
            </button>
          </>
        )}

        <div className="w-px h-6 bg-slate-200"></div>

        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
          <div className="text-right">
            <p className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Dr. Ahmed Al Rashidi
            </p>
            <p className="text-[11px] text-emerald-600">Online</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A1628] to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            AA
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default DoctorTopBarNew;
