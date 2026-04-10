import { AlertTriangle, Phone, Mail } from 'lucide-react';
import { CriticalAlert } from '../../types/doctor';

interface CriticalAlertsProps {
  alerts: CriticalAlert[];
}

export default function CriticalAlerts({ alerts }: CriticalAlertsProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'contact':
        return <Phone className="w-4 h-4" />;
      case 'message':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-rose-50 border-2 border-rose-200 rounded-lg shadow-sm">
      <div className="px-5 py-4 border-b border-rose-200 bg-rose-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-700" />
          <h2 className="text-lg font-bold text-rose-900">Critical Alerts</h2>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-2 ${
              alert.severity === 'critical'
                ? 'bg-red-50 border-red-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3
                  className={`font-bold text-sm mb-1 ${
                    alert.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
                  }`}
                >
                  {alert.patientName}
                </h3>
                <p
                  className={`text-sm ${
                    alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
              {alert.severity === 'critical' && (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 animate-pulse" />
              )}
            </div>

            <button
              className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                alert.severity === 'critical'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {getActionIcon(alert.actionType)}
              {alert.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
