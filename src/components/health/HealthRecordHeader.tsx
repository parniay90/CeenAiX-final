import { useState } from 'react';
import { Printer, ArrowLeft, Home, Menu } from 'lucide-react';

interface HealthRecordHeaderProps {
  patientName: string;
  dateOfBirth: string;
  emiratesIdLast4: string;
  bloodType: string;
}

export default function HealthRecordHeader({
  patientName,
  dateOfBirth,
  emiratesIdLast4,
  bloodType,
}: HealthRecordHeaderProps) {
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const getBloodTypeColor = (bloodType: string) => {
    return 'bg-rose-600';
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
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Home"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patientName}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>DOB: {dateOfBirth}</span>
              <span className="text-gray-300">|</span>
              <span>Emirates ID: ****{emiratesIdLast4}</span>
            </div>
          </div>
          <div
            className={`${getBloodTypeColor(bloodType)} text-white px-4 py-2 rounded-lg font-bold text-sm`}
          >
            {bloodType}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Switch Portal"
            >
              <Menu className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Portals</span>
            </button>

            {showPortalMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPortalMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Switch Portal</h3>
                  </div>
                  {portals.map((portal) => (
                    <button
                      key={portal.path}
                      onClick={() => {
                        window.location.href = portal.path;
                        setShowPortalMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                    >
                      {portal.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Printer className="w-5 h-5" />
            <span className="font-medium">Print Health Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
}
