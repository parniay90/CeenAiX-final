import { useState, useEffect } from 'react';
import { Bell, Globe, Menu, ArrowLeft, Home, User, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PatientTopNavProps {
  patientName?: string;
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PatientTopNav({ patientName = 'Ahmed Al Maktoum' }: PatientTopNavProps) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, title: t('notif.medication'), body: t('notif.medicationBody'), time: '5 min ago', unread: true },
    { id: 2, title: t('notif.labs'), body: t('notif.labsBody'), time: '2 hrs ago', unread: true },
    { id: 3, title: t('notif.appointment'), body: t('notif.appointmentBody'), time: '1 day ago', unread: true },
  ]);

  const portals = [
    { name: t('portal.patient'), path: '/dashboard' },
    { name: t('portal.doctor'), path: '/doctor/dashboard' },
    { name: t('portal.pharmacy'), path: '/pharmacy/dashboard' },
    { name: t('portal.lab'), path: '/lab/dashboard' },
    { name: t('portal.insurance'), path: '/insurance' },
    { name: t('portal.admin'), path: '/admin/dashboard' },
  ];

  const unreadCount = notifs.filter(n => n.unread).length;
  const initials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2);

  useEffect(() => {
    const close = () => { setShowPortalMenu(false); setShowNotifications(false); setShowAvatar(false); };
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  return (
    <div className="bg-white border-b border-cyan-100 px-6 py-4 z-50 shadow-sm shadow-cyan-500/5 flex-shrink-0">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg transition-all duration-300 group"
            title="Go back"
          >
            <ArrowLeft className={`w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg transition-all duration-300 group"
            title="Home"
          >
            <Home className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
          </button>
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
            alt="CeenAiX Logo"
            className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">CeenAiX</h1>
        </div>

        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative">
            <button
              onClick={() => { setShowPortalMenu(!showPortalMenu); setShowNotifications(false); setShowAvatar(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
              title="Switch Portal"
            >
              <Menu className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 transition-colors duration-300">{t('nav.portals')}</span>
            </button>

            {showPortalMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPortalMenu(false)} />
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-white rounded-lg shadow-xl shadow-cyan-500/10 border border-cyan-100 py-2 z-50`}>
                  <div className="px-4 py-2 border-b border-cyan-100">
                    <h3 className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{t('nav.switchPortal')}</h3>
                  </div>
                  {portals.map((portal) => (
                    <button
                      key={portal.path}
                      onClick={() => { navigate(portal.path); setShowPortalMenu(false); }}
                      className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 text-sm text-slate-700 font-medium transition-all duration-300`}
                    >
                      {portal.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
          >
            <Globe className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 transition-colors duration-300">
              {language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowPortalMenu(false); setShowAvatar(false); }}
              className="relative p-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-lg shadow-xl shadow-cyan-500/10 border border-cyan-100 py-2 z-50`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-100">
                    <h3 className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{t('nav.notifications')}</h3>
                    <button
                      onClick={() => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      {t('nav.markAllRead')}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                        className={`px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 cursor-pointer border-b border-gray-100 transition-all duration-300 ${n.unread ? 'bg-cyan-50/30' : ''}`}
                      >
                        <p className={`text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : ''}`}>{n.title}</p>
                        <p className={`text-xs text-slate-600 mt-1 ${isRTL ? 'text-right' : ''}`}>{n.body}</p>
                        <p className={`text-xs text-slate-400 mt-1 ${isRTL ? 'text-right' : ''}`}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-cyan-100">
                    <button
                      onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium w-full text-center"
                    >
                      {t('nav.viewAll')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`${isRTL ? 'pr-4 border-r' : 'pl-4 border-l'} border-gray-200 relative`}>
            <button
              onClick={() => { setShowAvatar(!showAvatar); setShowPortalMenu(false); setShowNotifications(false); }}
              className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'} hidden md:block`}>
                <p className="text-sm font-semibold text-slate-800 leading-none">{patientName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('nav.patient')}</p>
              </div>
            </button>

            {showAvatar && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAvatar(false)} />
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 bg-white rounded-xl shadow-xl border border-cyan-100 py-2 z-50`}>
                  <div className={`px-4 py-2 border-b border-cyan-100 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm font-semibold text-slate-800">{patientName}</p>
                    <p className="text-xs text-slate-500">{t('nav.patientPortal')}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setShowAvatar(false); }}
                    className={`w-full ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} px-4 py-2.5 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors flex items-center gap-2`}
                  >
                    <User className="w-4 h-4" /> {t('nav.myProfile')}
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowAvatar(false); }}
                    className={`w-full ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} px-4 py-2.5 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors flex items-center gap-2`}
                  >
                    <Settings className="w-4 h-4" /> {t('nav.settings')}
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { navigate('/'); setShowAvatar(false); }}
                      className={`w-full ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2`}
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.signOut')}
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
