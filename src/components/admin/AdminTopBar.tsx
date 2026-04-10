import { useState } from 'react';
import { Menu, Home, ArrowLeft } from 'lucide-react';
import UserMenu from '../common/UserMenu';

export default function AdminTopBar() {
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
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Home"
          >
            <Home className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <h1 className="text-lg font-bold text-white">Platform Control Center</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-400">All Systems Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Switch Portal"
          >
            <Menu className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Portals</span>
          </button>

          {showPortalMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPortalMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-700">
                  <h3 className="font-semibold text-white">Switch Portal</h3>
                </div>
                {portals.map((portal) => (
                  <button
                    key={portal.path}
                    onClick={() => {
                      window.location.href = portal.path;
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-gray-300 font-medium"
                  >
                    {portal.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-3 py-1 bg-violet-600 bg-opacity-20 border border-violet-500 rounded text-xs font-bold text-violet-400">
          PRODUCTION
        </div>
        <UserMenu
          userName="Sarah Al Amiri"
          userRole="Super Admin"
        />
      </div>
    </div>
  );
}
