import { useState } from 'react';
import { FlaskConical, Scan, Search, AlertCircle, Bell, ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  showDeptToggle?: boolean;
}

type Dept = 'all' | 'lab' | 'radiology';

export default function LabRadTopBar({ title, showDeptToggle = false }: Props) {
  const [dept, setDept] = useState<Dept>('all');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center px-5 gap-4 shadow-sm">
      <div className="flex items-center gap-2 mr-2">
        <FlaskConical size={20} className="text-indigo-500" />
        <Scan size={20} className="text-blue-600" />
      </div>
      <div>
        <div className="font-bold text-slate-800" style={{ fontSize: 17, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {title}
        </div>
        <div className="text-slate-400" style={{ fontSize: 11 }}>
          Dubai Medical & Imaging Centre · 7 Apr 2026 · 2:07 PM
        </div>
      </div>

      {showDeptToggle && (
        <div className="flex items-center gap-1 ml-4 bg-slate-100 rounded-lg p-1">
          {([
            { key: 'all', label: '🔬 All', icon: null },
            { key: 'lab', label: '🧪 Lab Only', icon: null },
            { key: 'radiology', label: '🩻 Radiology Only', icon: null },
          ] as { key: Dept; label: string; icon: null }[]).map((d) => (
            <button
              key={d.key}
              onClick={() => setDept(d.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dept === d.key
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {d.label}
              {dept === d.key && ' ●'}
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
          <Search size={14} />
          Scan Sample / Study
        </button>

        <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors animate-pulse">
          <AlertCircle size={14} />
          1 Critical
        </button>

        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="font-semibold text-slate-700 text-sm mb-2">Notifications</div>
              <div className="text-xs text-slate-500 py-2">3 new notifications</div>
              <div className="space-y-2">
                {['STAT sample 003891 received', 'QC reminder: Cobas 8000 due', 'Shift ends in 53 minutes'].map((n, i) => (
                  <div key={i} className="text-xs text-slate-600 bg-slate-50 rounded p-2">{n}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              FA
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-700">Fatima Al Rashidi</div>
              <div className="text-xs text-slate-400">Day Shift</div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="text-xs text-slate-600 px-2 py-1 font-semibold">Fatima Al Rashidi</div>
              <div className="text-xs text-slate-400 px-2 pb-2">Senior Diagnostics Coordinator</div>
              <hr className="border-slate-100 mb-1" />
              <button className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 rounded px-2 py-1.5">Profile</button>
              <button className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 rounded px-2 py-1.5">Settings</button>
              <button className="w-full text-left text-xs text-red-500 hover:bg-red-50 rounded px-2 py-1.5">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
