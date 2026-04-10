import { useState } from 'react';
import { MapPin, Activity, Database, Users } from 'lucide-react';
import { Organization, OrganizationType } from '../../types/admin';

interface UAEMapProps {
  organizations: Organization[];
}

export default function UAEMap({ organizations }: UAEMapProps) {
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'satellite'>('map');

  const getOrgColor = (type: OrganizationType) => {
    switch (type) {
      case 'hospital':
        return 'bg-teal-500 border-teal-400';
      case 'clinic':
        return 'bg-amber-500 border-amber-400';
      case 'pharmacy':
        return 'bg-violet-500 border-violet-400';
      case 'laboratory':
        return 'bg-slate-500 border-slate-400';
    }
  };

  const getOrgTypeLabel = (type: OrganizationType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const calculatePosition = (lat: number, lng: number) => {
    const minLat = 22.5;
    const maxLat = 26.0;
    const minLng = 51.5;
    const maxLng = 56.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x, y };
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white uppercase">UAE Organization Network</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              viewMode === 'map'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('satellite')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              viewMode === 'satellite'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden h-96">
        <div
          className={`absolute inset-0 ${
            viewMode === 'satellite' ? 'opacity-20' : 'opacity-10'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>

        <div className="absolute top-4 left-4 text-xs text-slate-500 font-mono">
          UAE · {organizations.length} Connected Organizations
        </div>

        {organizations.map((org) => {
          const pos = calculatePosition(org.location.lat, org.location.lng);
          const isHovered = hoveredOrg === org.id;

          return (
            <div
              key={org.id}
              className="absolute"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHoveredOrg(org.id)}
              onMouseLeave={() => setHoveredOrg(null)}
            >
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${getOrgColor(
                    org.type
                  )} shadow-lg cursor-pointer transform transition-transform ${
                    isHovered ? 'scale-150' : 'scale-100'
                  }`}
                >
                  {isHovered && (
                    <div className="absolute left-4 top-0 w-64 bg-slate-800 border-2 border-slate-600 rounded-lg p-3 shadow-2xl z-50">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">{org.name}</div>
                          <div className="text-xs text-slate-400">
                            {org.location.city}, {org.location.emirate}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-3 ${getOrgColor(
                          org.type
                        )} bg-opacity-20`}
                      >
                        {getOrgTypeLabel(org.type)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users className="w-3 h-3" />
                            <span>Active Users</span>
                          </div>
                          <span className="font-bold text-white">{org.stats.activeUsers}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Activity className="w-3 h-3" />
                            <span>Daily Transactions</span>
                          </div>
                          <span className="font-bold text-white">
                            {org.stats.dailyTransactions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Database className="w-3 h-3" />
                            <span>NABIDH Syncs</span>
                          </div>
                          <span className="font-bold text-white">{org.stats.nabidhSyncs}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500 border-2 border-teal-400 rounded-full"></div>
          <span className="text-xs font-semibold text-slate-300">Hospital</span>
          <span className="text-xs text-slate-500">
            ({organizations.filter((o) => o.type === 'hospital').length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 border-2 border-amber-400 rounded-full"></div>
          <span className="text-xs font-semibold text-slate-300">Clinic</span>
          <span className="text-xs text-slate-500">
            ({organizations.filter((o) => o.type === 'clinic').length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-500 border-2 border-violet-400 rounded-full"></div>
          <span className="text-xs font-semibold text-slate-300">Pharmacy</span>
          <span className="text-xs text-slate-500">
            ({organizations.filter((o) => o.type === 'pharmacy').length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-500 border-2 border-slate-400 rounded-full"></div>
          <span className="text-xs font-semibold text-slate-300">Laboratory</span>
          <span className="text-xs text-slate-500">
            ({organizations.filter((o) => o.type === 'laboratory').length})
          </span>
        </div>
      </div>
    </div>
  );
}
