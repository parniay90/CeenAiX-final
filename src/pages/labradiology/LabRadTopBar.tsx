import { useState } from 'react';
import { FlaskConical, Scan, Search, AlertCircle, Bell, ChevronDown, User, Settings, LogOut, Check, X } from 'lucide-react';
import SignOutModal from '../../components/common/SignOutModal';
import { ToastContainer, useToast } from '../../components/common/Toast';

interface Props {
  title: string;
  showDeptToggle?: boolean;
}

type Dept = 'all' | 'lab' | 'radiology';

const initialNotifs = [
  { id: 1, title: 'STAT sample LAB-003891 received', sub: 'Priority: CRITICAL · Chemistry dept', time: '4 min ago', unread: true },
  { id: 2, title: 'QC reminder: Cobas 8000 due', sub: 'Immunoassay QC overdue by 15 min', time: '19 min ago', unread: true },
  { id: 3, title: 'NABIDH sync completed', sub: '67/75 results submitted successfully', time: '32 min ago', unread: false },
];

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function LabRadTopBar({ title, showDeptToggle = false }: Props) {
  const [dept, setDept] = useState<Dept>('all');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifs);
  const { toasts, dismiss, addToast } = useToast();

  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  }

  function handleSignOut() {
    setShowSignOut(false);
    addToast('success', 'Signed out successfully', 'You have been signed out of the Lab & Radiology Portal');
    setTimeout(() => navigate('/'), 1200);
  }

  return (
    <>
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
              { key: 'all', label: 'All' },
              { key: 'lab', label: 'Lab Only' },
              { key: 'radiology', label: 'Radiology Only' },
            ] as { key: Dept; label: string }[]).map((d) => (
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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div className="font-semibold text-slate-700 text-sm">Notifications</div>
                    <div className="flex items-center gap-2">
                      <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <Check size={11} /> Mark all read
                      </button>
                      <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifs.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-indigo-50/40' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${n.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-700">{n.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{n.sub}</div>
                            <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4F46E5, #1D4ED8)' }}>
                FA
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-700">Fatima Al Rashidi</div>
                <div className="text-xs text-slate-400">Day Shift</div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {userOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-2 py-1.5">
                    <div className="text-xs font-semibold text-slate-700">Fatima Al Rashidi</div>
                    <div className="text-xs text-slate-400">Senior Diagnostics Coordinator</div>
                  </div>
                  <hr className="border-slate-100 my-1" />
                  <button onClick={() => { setUserOpen(false); navigate('/lab/profile'); }} className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 rounded-lg px-2 py-1.5 flex items-center gap-2">
                    <User size={13} /> Profile
                  </button>
                  <button onClick={() => { setUserOpen(false); navigate('/lab/settings'); }} className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 rounded-lg px-2 py-1.5 flex items-center gap-2">
                    <Settings size={13} /> Settings
                  </button>
                  <hr className="border-slate-100 my-1" />
                  <button onClick={() => { setUserOpen(false); setShowSignOut(true); }} className="w-full text-left text-xs text-red-500 hover:bg-red-50 rounded-lg px-2 py-1.5 flex items-center gap-2">
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {showSignOut && (
        <SignOutModal
          portalName="Lab & Radiology Portal"
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
