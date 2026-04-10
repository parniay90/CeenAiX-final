import { AlertTriangle, Phone, CheckCircle, Clock } from 'lucide-react';
import { CriticalValue } from '../../types/laboratory';
import { format } from 'date-fns';

interface CriticalValuesPanelProps {
  criticalValues: CriticalValue[];
  onMarkNotified: (id: string) => void;
}

export default function CriticalValuesPanel({
  criticalValues,
  onMarkNotified,
}: CriticalValuesPanelProps) {
  const getUrgencyColor = (minutes: number) => {
    if (minutes >= 50) return 'border-rose-500 bg-rose-50';
    if (minutes >= 30) return 'border-orange-500 bg-orange-50';
    return 'border-amber-500 bg-amber-50';
  };

  const getTimerColor = (minutes: number) => {
    if (minutes >= 50) return 'text-rose-700';
    if (minutes >= 30) return 'text-orange-700';
    return 'text-amber-700';
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border-2 border-rose-300 p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-rose-700" />
        <h3 className="text-sm font-bold text-rose-900 uppercase">
          Critical Values Requiring Notification
        </h3>
      </div>

      {criticalValues.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No critical values pending</p>
          <p className="text-xs text-slate-600">All critical results have been notified</p>
        </div>
      ) : (
        <div className="space-y-3">
          {criticalValues.map((cv) => (
            <div
              key={cv.id}
              className={`bg-white rounded-lg border-2 p-3 ${getUrgencyColor(
                cv.minutesSinceResult
              )}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 mb-1">{cv.patientName}</div>
                  <div className="text-xs text-slate-600 mb-2">{cv.sampleId}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">{cv.testName}:</span>
                    <span className="text-sm font-bold text-rose-700">
                      {cv.value} {cv.unit}
                    </span>
                    <span className="text-xs text-slate-600">
                      (Ref: {cv.referenceRange} {cv.unit})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className={`w-4 h-4 ${getTimerColor(cv.minutesSinceResult)}`} />
                  <span className={`text-xs font-bold ${getTimerColor(cv.minutesSinceResult)}`}>
                    {cv.minutesSinceResult} min
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 mb-3">
                <div className="text-xs text-slate-700 mb-1">
                  <span className="font-semibold">Doctor:</span> {cv.orderingDoctor}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Phone className="w-3 h-3" />
                  <span className="font-mono">{cv.orderingDoctorContact}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Resulted at {format(cv.resultedAt, 'HH:mm')}
                </div>
              </div>

              <button
                onClick={() => onMarkNotified(cv.id)}
                className="w-full px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Notified
              </button>

              {cv.minutesSinceResult >= 50 && (
                <div className="mt-2 bg-rose-100 border border-rose-300 rounded px-2 py-1 text-xs text-rose-900 font-semibold text-center">
                  URGENT: DHA requires notification within 60 minutes
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
