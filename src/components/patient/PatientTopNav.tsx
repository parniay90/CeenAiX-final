import { useState, useEffect } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

interface PatientTopNavProps {
  patientName?: string;
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const NOTIFS = [
  { id: 1, title: 'Medication Reminder', body: 'Time to take Metformin 500mg', time: '5 min ago', unread: true },
  { id: 2, title: 'Lab Results Available', body: 'Your blood test results are ready', time: '2 hrs ago', unread: true },
  { id: 3, title: 'Appointment Confirmed', body: 'Dr. Sarah Johnson – Tomorrow 3:00 PM', time: '1 day ago', unread: true },
];

export default function PatientTopNav({ patientName = 'Ahmed Al Maktoum' }: PatientTopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifs.filter(n => n.unread).length;
  const initials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 h-16 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-sans">
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} GST</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowAvatar(false); }}
              className="relative p-2 text-slate-500 hover:text-teal-600 hover:scale-110 transition-transform"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                    <button
                      onClick={() => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                        className={`px-4 py-3 cursor-pointer hover:bg-teal-50/50 transition-colors ${n.unread ? 'bg-teal-50/30' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? 'bg-teal-500' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button
                      onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium w-full text-center"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowAvatar(!showAvatar); setShowNotifications(false); }}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-sans font-bold text-sm hover:scale-105 transition-transform"
            >
              {initials}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </button>

            {showAvatar && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAvatar(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-slate-800">{patientName}</p>
                    <p className="text-xs text-slate-500">Patient Portal</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setShowAvatar(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowAvatar(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { navigate('/'); setShowAvatar(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
