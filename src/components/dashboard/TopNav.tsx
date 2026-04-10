import { Bell, Globe, Menu, Home, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import UserMenu from '../common/UserMenu';

interface TopNavProps {
  patientName: string;
  patientAvatar: string;
}

export default function TopNav({ patientName, patientAvatar }: TopNavProps) {
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  };

  const portals = [
    { name: 'Patient Dashboard', path: '/dashboard' },
    { name: 'Doctor Dashboard', path: '/doctor/dashboard' },
    { name: 'Pharmacy Dashboard', path: '/pharmacy/dashboard' },
    { name: 'Lab Dashboard', path: '/lab/dashboard' },
    { name: 'Insurance Portal', path: '/insurance' },
    { name: 'Admin Dashboard', path: '/admin/dashboard' },
  ];

  return (
    <div className="bg-white border-b border-cyan-100 px-6 py-4 sticky top-0 z-50 shadow-sm shadow-cyan-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg transition-all duration-300 group"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg transition-all duration-300 group"
            title="Home"
          >
            <Home className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
          </button>
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
            alt="CeenAiX Logo"
            className="w-10 h-10 object-contain animate-fadeIn hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">CeenAiX</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
              title="Switch Portal"
            >
              <Menu className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 transition-colors duration-300">Portals</span>
            </button>

            {showPortalMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPortalMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl shadow-cyan-500/10 border border-cyan-100 py-2 z-50 animate-slideUp">
                  <div className="px-4 py-2 border-b border-cyan-100">
                    <h3 className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Switch Portal</h3>
                  </div>
                  {portals.map((portal) => (
                    <button
                      key={portal.path}
                      onClick={() => {
                        window.location.href = portal.path;
                        setShowPortalMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 text-sm text-slate-700 font-medium transition-all duration-300"
                    >
                      {portal.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
          >
            <Globe className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 transition-colors duration-300">{language}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl shadow-cyan-500/10 border border-cyan-100 py-2 z-50 animate-slideUp">
                <div className="px-4 py-2 border-b border-cyan-100">
                  <h3 className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 cursor-pointer border-b border-gray-100 transition-all duration-300">
                    <p className="text-sm font-medium text-slate-900">Medication Reminder</p>
                    <p className="text-xs text-slate-600 mt-1">Time to take Metformin 500mg</p>
                    <p className="text-xs text-slate-400 mt-1">5 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 cursor-pointer border-b border-gray-100 transition-all duration-300">
                    <p className="text-sm font-medium text-slate-900">Lab Results Available</p>
                    <p className="text-xs text-slate-600 mt-1">Your blood test results are ready</p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 cursor-pointer transition-all duration-300">
                    <p className="text-sm font-medium text-slate-900">Appointment Confirmed</p>
                    <p className="text-xs text-slate-600 mt-1">Dr. Sarah Johnson - Tomorrow 3:00 PM</p>
                    <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pl-4 border-l border-gray-200">
            <UserMenu
              userName={patientName}
              userRole="Patient"
              avatarUrl={patientAvatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
