import { Activity, AlertCircle, CheckCircle, Wrench, XCircle, Loader } from 'lucide-react';
import { Equipment, EquipmentStatus as Status } from '../../types/laboratory';
import { format } from 'date-fns';

interface EquipmentStatusProps {
  equipment: Equipment[];
}

export default function EquipmentStatus({ equipment }: EquipmentStatusProps) {
  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <Loader className="w-4 h-4 text-teal-600 animate-spin" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-rose-600" />;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'running':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'offline':
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  const getQCBadge = (result: 'pass' | 'fail' | 'pending') => {
    switch (result) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-rose-100 text-rose-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-teal-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase">Equipment Status</h3>
      </div>

      <div className="space-y-3">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="border border-slate-200 rounded-lg p-3 hover:border-teal-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(eq.status)}
                  <h4 className="text-sm font-bold text-slate-900">{eq.name}</h4>
                </div>
                <div className="text-xs text-slate-600">{eq.model}</div>
                <div className="text-xs text-slate-500 font-mono">SN: {eq.serialNumber}</div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold border ${getStatusBadge(
                  eq.status
                )}`}
              >
                {eq.status === 'running' && <Loader className="w-3 h-3 inline mr-1 animate-spin" />}
                {eq.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-600 mb-1">Last QC Result</div>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-bold ${getQCBadge(
                    eq.lastQCResult
                  )}`}
                >
                  {eq.lastQCResult.toUpperCase()}
                </span>
                <div className="text-xs text-slate-500 mt-1">
                  {format(eq.lastQCDate, 'dd MMM HH:mm')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Next Maintenance</div>
                <div className="text-xs font-semibold text-slate-900">
                  {format(eq.nextMaintenanceDate, 'dd MMM yyyy')}
                </div>
              </div>
            </div>

            {eq.lastQCResult === 'fail' && (
              <div className="mt-2 bg-rose-50 border border-rose-200 rounded px-2 py-1 flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-rose-700" />
                <span className="text-xs text-rose-900 font-semibold">
                  QC failure requires immediate attention
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
