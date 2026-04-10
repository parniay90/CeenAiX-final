import React, { useState } from 'react';
import { FlaskConical, ScanLine, Search, Bell, ChevronDown, X, Layers, Cpu } from 'lucide-react';

export type DeptFilter = 'all' | 'lab' | 'radiology';

interface DiagnosticsTopBarProps {
  deptFilter: DeptFilter;
  onDeptChange: (f: DeptFilter) => void;
  activePage?: string;
}

const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Operations Dashboard', sub: '7 Apr 2026 · 2:07 PM · Day Shift (53 min remaining)' },
  mri: { title: 'MRI — Magnetic Resonance Imaging', sub: 'Siemens Vida 3T · MAGNETOM Sola 1.5T · 2 scanners online' },
  ct: { title: 'CT Scan — Computed Tomography', sub: 'Philips Brilliance 256-slice · Siemens SOMATOM 64-slice · 2 scanners' },
  lab: { title: 'Clinical Laboratory Portal', sub: '234 samples today · 1 critical unnotified · DHA-LAB-2015-002841' },
  'lab-queue': { title: 'Laboratory Queue', sub: '234 samples today · 45 active' },
  'lab-results': { title: 'Lab Results', sub: '189 resulted · 5 pending verification' },
  'imaging-queue': { title: 'Imaging Queue', sub: '47 studies today · 3 scanning now' },
  reports: { title: 'Radiology Reports', sub: '9 pending sign-off · Dr. Rania on duty' },
  equipment: { title: 'Equipment Status', sub: '2 issues · Coag maintenance · X-Ray QA' },
  nabidh: { title: 'NABIDH Submissions', sub: '67/75 submitted · 8 pending' },
};

const DiagnosticsTopBar: React.FC<DiagnosticsTopBarProps> = ({ deptFilter, onDeptChange, activePage = 'dashboard' }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pageInfo = pageTitles[activePage] || pageTitles.dashboard;
  const showDeptToggle = activePage === 'dashboard';

  return (
    <div className="flex-shrink-0 border-b" style={{ background: '#161822', borderColor: 'rgba(255,255,255,0.06)', height: 60 }}>
      <div className="flex items-center h-full px-5 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1">
            {activePage === 'mri' ? (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
            ) : activePage === 'ct' ? (
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FlaskConical className="w-4 h-4 text-indigo-400" />
                <ScanLine className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-white leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
              {pageInfo.title}
            </div>
            <div className="text-slate-400 leading-tight" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
              {pageInfo.sub}
            </div>
          </div>
        </div>

        {/* Center — only shown on dashboard */}
        {showDeptToggle && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center rounded-xl p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {([
                ['all', 'All Departments'],
                ['lab', 'Lab Only'],
                ['radiology', 'Radiology Only'],
              ] as [DeptFilter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onDeptChange(key)}
                  className="px-4 py-1.5 rounded-lg font-semibold transition-all"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    background: deptFilter === key
                      ? key === 'lab' ? '#4F46E5' : key === 'radiology' ? '#1D4ED8' : 'rgba(255,255,255,0.12)'
                      : 'transparent',
                    color: deptFilter === key ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        {!showDeptToggle && <div className="flex-1" />}

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showSearch ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Sample ID, accession, patient..."
                className="bg-transparent text-white text-sm focus:outline-none w-48"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}
              />
              <button onClick={() => { setShowSearch(false); setSearchVal(''); }}>
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, height: 34, color: 'rgba(255,255,255,0.5)' }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          )}

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-red-400 animate-pulse"
            style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', fontSize: 11, height: 34 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            1 Critical
          </button>

          <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4F46E5, #1D4ED8)' }}>
                FA
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-11 w-52 rounded-xl shadow-2xl py-1 z-50" style={{ background: '#1E2130', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 py-3 border-b mb-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="font-semibold text-white text-sm">Fatima Al Rashidi</div>
                  <div className="text-slate-400 text-xs">Senior Diagnostics Coordinator</div>
                  <div className="text-indigo-400 text-xs mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Lab + Radiology Access</div>
                </div>
                <button onClick={() => window.location.href = '/'} className="w-full text-left px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsTopBar;
