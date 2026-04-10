import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Activity, X, ChevronDown, User, LogOut } from 'lucide-react';
import { SUPER_ADMIN_USER, PLATFORM_INFO, alerts } from '../../data/superAdminData';

const searchResults = {
  patients: [
    { name: 'Parnia Yazdkhasti', sub: 'PT-001 · Daman Gold · Al Noor', id: 'PT-001' },
    { name: 'Aisha Mohammed Al Reem', sub: 'PT-006 · AXA Gulf · Al Noor', id: 'PT-006' },
  ],
  doctors: [
    { name: 'Dr. Ahmed Al Rashidi', sub: 'DHA-PRAC-2018-047821 · Cardiologist', id: 'DHA-PRAC-2018-047821' },
    { name: 'Dr. Reem Al Suwaidi', sub: 'DHA-PRAC-2019-055128 · Psychiatrist', id: 'DHA-PRAC-2019-055128' },
  ],
  organizations: [
    { name: 'Al Noor Medical Center', sub: '18 doctors · Active ✅', id: 'ORG-001' },
    { name: 'Al Shifa Pharmacy', sub: 'DHA-PHARM-2019-003481 · Active', id: 'ORG-002' },
  ],
};

type SearchCategory = 'all' | 'patients' | 'doctors' | 'organizations' | 'transactions' | 'audit';

const AdminTopBar: React.FC = () => {
  const [sessionCount, setSessionCount] = useState(1247);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState<SearchCategory>('all');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionCount(n => n + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showSearch) setTimeout(() => searchRef.current?.focus(), 50);
  }, [showSearch]);

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));
  const hasIssue = activeAlerts.some(a => a.type === 'warning' || a.type === 'error');

  return (
    <>
      <div
        className="sticky top-0 z-40 flex items-center gap-4 px-6 flex-shrink-0"
        style={{ height: 64, background: '#1E293B', borderBottom: '1px solid rgba(51,65,85,0.8)' }}
      >
        {/* Left */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div>
            <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
              Platform Dashboard
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>
              {PLATFORM_INFO.timestamp}
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#34D399' }}>
              {sessionCount.toLocaleString()} active sessions
            </span>
          </div>
        </div>

        {/* Center — status pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: hasIssue ? 'rgba(245,158,11,0.1)' : 'rgba(30,41,59,0.5)', border: `1px solid ${hasIssue ? 'rgba(245,158,11,0.3)' : 'rgba(51,65,85,0.5)'}` }}
        >
          <div className={`w-2 h-2 rounded-full ${hasIssue ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
          <span style={{ fontSize: 12, color: hasIssue ? '#FCD34D' : '#6EE7B7', fontFamily: 'Inter, sans-serif' }}>
            {hasIssue ? `${activeAlerts.length} issue${activeAlerts.length > 1 ? 's' : ''} detected` : 'All Systems Operational'}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Alerts */}
          <div className="relative">
            <button
              onClick={() => { setShowAlerts(!showAlerts); setShowSearch(false); setShowUserMenu(false); }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: activeAlerts.length > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.8)', color: activeAlerts.length > 0 ? '#FCD34D' : '#94A3B8' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = activeAlerts.length > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.8)'; }}
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {showAlerts && (
              <div
                className="absolute right-0 top-11 w-80 rounded-xl shadow-2xl overflow-hidden z-50"
                style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }}
              >
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="font-bold text-white" style={{ fontSize: 13 }}>Alerts</span>
                  <button onClick={() => setShowAlerts(false)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse"
                      style={{ background: alert.type === 'error' ? '#EF4444' : '#F59E0B' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 12, color: alert.type === 'error' ? '#FCA5A5' : '#FCD34D' }}>{alert.message}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button style={{ fontSize: 10, color: alert.type === 'error' ? '#FCA5A5' : '#FCD34D' }}>{alert.action}</button>
                      <button onClick={() => setDismissedAlerts(p => [...p, alert.id])} className="text-slate-600 hover:text-slate-400">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                  <div className="px-4 py-6 text-center text-slate-500 text-sm">No active alerts</div>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <button
            onClick={() => { setShowSearch(true); setShowAlerts(false); setShowUserMenu(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(30,41,59,0.8)', color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.8)'; e.currentTarget.style.color = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.8)'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* System health */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(5,150,105,0.15)', color: '#34D399' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.15)'; }}
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowAlerts(false); setShowSearch(false); }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
              style={{ background: 'rgba(30,41,59,0.8)', color: '#CBD5E1' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.8)'; }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)' }}
              >
                {SUPER_ADMIN_USER.initials}
              </div>
              <ChevronDown className="w-3 h-3" style={{ color: '#64748B' }} />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-11 w-56 rounded-xl shadow-2xl overflow-hidden z-50"
                style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }}
              >
                <div className="px-4 py-3 border-b border-slate-700">
                  <div className="font-bold text-white text-sm">{SUPER_ADMIN_USER.name}</div>
                  <div style={{ fontSize: 11, color: '#5EEAD4' }}>{SUPER_ADMIN_USER.role}</div>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-900/20 transition-colors text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center pt-24"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowSearch(false); }}
        >
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across all CeenAiX data..."
                className="w-full bg-slate-800 text-white rounded-2xl px-5 py-4 pl-12 text-lg focus:outline-none"
                style={{ fontFamily: 'DM Mono, monospace', border: '1px solid rgba(13,148,136,0.4)', caretColor: '#0D9488' }}
                onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
              />
              <button onClick={() => setShowSearch(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['all', 'patients', 'doctors', 'organizations', 'transactions', 'audit'] as SearchCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchCat(cat)}
                  className="rounded-full px-3 py-1 font-medium capitalize"
                  style={{
                    fontSize: 12,
                    background: searchCat === cat ? '#0D9488' : 'rgba(30,41,59,0.8)',
                    color: searchCat === cat ? '#fff' : '#94A3B8',
                    border: '1px solid rgba(51,65,85,0.6)',
                  }}
                >
                  {cat === 'all' ? 'All ●' : cat}
                </button>
              ))}
            </div>

            {/* Results */}
            {searchQuery && (
              <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }}>
                {(searchCat === 'all' || searchCat === 'patients') && (
                  <div>
                    <div className="px-4 py-2 border-b border-slate-700" style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
                      PATIENTS
                    </div>
                    {searchResults.patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50">
                        <div>
                          <div className="text-white text-sm font-medium">{r.name}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>{r.sub}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#0D9488' }}>View Profile →</span>
                      </div>
                    ))}
                  </div>
                )}
                {(searchCat === 'all' || searchCat === 'doctors') && (
                  <div>
                    <div className="px-4 py-2 border-b border-slate-700" style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
                      DOCTORS
                    </div>
                    {searchResults.doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50">
                        <div>
                          <div className="text-white text-sm font-medium">{r.name}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>{r.sub}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#0D9488' }}>View Profile →</span>
                      </div>
                    ))}
                  </div>
                )}
                {(searchCat === 'all' || searchCat === 'organizations') && (
                  <div>
                    <div className="px-4 py-2 border-b border-slate-700" style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
                      ORGANIZATIONS
                    </div>
                    {searchResults.organizations.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 cursor-pointer">
                        <div>
                          <div className="text-white text-sm font-medium">{r.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{r.sub}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#0D9488' }}>View →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!searchQuery && (
              <div className="text-center" style={{ color: '#475569', fontSize: 13 }}>
                Start typing to search across patients, doctors, organizations, and more
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTopBar;
