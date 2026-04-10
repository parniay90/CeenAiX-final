import { useState } from 'react';
import { Bell, Search, Grid3x3, Home, ArrowLeft, Sparkles } from 'lucide-react';
import { Doctor } from '../../types/doctor';
import UserMenu from '../common/UserMenu';

interface DoctorTopNavProps {
  doctor: Doctor;
  notificationCount?: number;
}

export default function DoctorTopNav({ doctor, notificationCount = 0 }: DoctorTopNavProps) {
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const portals = [
    { name: 'Patient Dashboard', path: '/dashboard' },
    { name: 'Doctor Dashboard', path: '/doctor/dashboard' },
    { name: 'Pharmacy Dashboard', path: '/pharmacy/dashboard' },
    { name: 'Lab Dashboard', path: '/lab/dashboard' },
    { name: 'Insurance Portal', path: '/insurance' },
    { name: 'Admin Dashboard', path: '/admin/dashboard' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-900/30 px-6 py-3 sticky top-0 z-30 shadow-xl shadow-cyan-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group"
            title="Home"
          >
            <Home className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
          </button>
          <div className="border-l border-slate-700 pl-6">
            <div className="flex items-center gap-6">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <h2 className="text-base font-bold text-white">{doctor.clinicName}</h2>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-6 ml-8">
              <Sparkles className="w-3 h-3" />
              <span>DHA License: {doctor.dhaLicense}</span>
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search patients by name, MRN, or Emirates ID..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-cyan-900/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-slate-800/70"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center gap-6 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-cyan-900/30 transition-all duration-300 group"
              title="Switch Portal"
            >
              <Grid3x3 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-200 group-hover:text-white">Portals</span>
            </button>

            {showPortalMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPortalMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-cyan-900/50 py-2 z-50 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-cyan-900/30">
                    <h3 className="font-semibold text-white flex items-center gap-6">
                      <Grid3x3 className="w-4 h-4 text-cyan-400" />
                      <span>Switch Portal</span>
                    </h3>
                  </div>
                  {portals.map((portal) => (
                    <button
                      key={portal.path}
                      onClick={() => {
                        window.location.href = portal.path;
                        setShowPortalMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700/50 text-sm text-slate-300 hover:text-white font-medium transition-all duration-200 hover:translate-x-1"
                    >
                      {portal.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="relative p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <div className="pl-6 border-l border-slate-700">
            <UserMenu
              userName={doctor.name}
              userRole={doctor.specialty}
              avatarUrl={doctor.avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
