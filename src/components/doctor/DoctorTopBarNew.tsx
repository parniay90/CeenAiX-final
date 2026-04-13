import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, AlertOctagon, LogOut, Settings, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DoctorTopBarProps {
  hasCriticalAlert?: boolean;
  onAcknowledgeCritical?: () => void;
}

const DoctorTopBarNew: React.FC<DoctorTopBarProps> = ({
  hasCriticalAlert = true,
  onAcknowledgeCritical
}) => {
  const [currentTime, setCurrentTime] = useState('2:04 PM');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await supabase.auth.signOut();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    window.history.pushState({}, '', '/doctor/settings');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    window.history.pushState({}, '', '/doctor/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="text-right">
              <p className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Dr. Ahmed Al Rashidi
              </p>
              <p className="text-[11px] text-emerald-600">Online</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A1628] to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              AA
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A1628] to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    AA
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">Dr. Ahmed Al Rashidi</p>
                    <p className="text-[11px] text-slate-500">Cardiologist</p>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <User className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span className="text-[13px] font-medium text-slate-700">My Profile</span>
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span className="text-[13px] font-medium text-slate-700">Settings</span>
                </button>
              </div>
              <div className="p-1.5 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                  <span className="text-[13px] font-medium text-slate-700 group-hover:text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DoctorTopBarNew;
