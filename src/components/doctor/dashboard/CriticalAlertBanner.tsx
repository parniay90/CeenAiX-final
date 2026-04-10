import { AlertOctagon, Building2, CheckCircle } from 'lucide-react';
import { LabResult } from '../../../types/doctorDashboard';

interface CriticalAlertBannerProps {
  labResult: LabResult;
  onAcknowledge: () => void;
  onViewPatient: () => void;
}

export default function CriticalAlertBanner({
  labResult,
  onAcknowledge,
  onViewPatient,
}: CriticalAlertBannerProps) {
  return (
    <div className="animate-fadeIn">
      <div className="bg-red-50 border-2 border-red-600 rounded-xl p-5 shadow-xl animate-criticalPulse">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertOctagon className="w-7 h-7 text-red-600 animate-pulse" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  CRITICAL RESULT
                </h3>
                <p className="text-xs font-mono text-red-500">
                  Unacknowledged: {labResult.unacknowledgedMinutes} minutes
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h2 className="text-lg font-bold text-red-900 mb-1">
                {labResult.patientName} — {labResult.testName}
              </h2>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold font-mono text-red-700">
                  {labResult.result} {labResult.unit}
                </span>
                <span className="text-sm text-slate-600">
                  Reference: {labResult.referenceRange}
                </span>
                <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  CRITICAL HIGH ↑↑
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-1">
                {labResult.labName} — Resulted {labResult.resultedTime}
              </p>
              <p className="text-sm text-slate-600 italic">
                Patient presented with chest pain — referred to emergency at 11:45 AM
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onViewPatient}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Patient is in Emergency — View Status
              </button>
              <button
                onClick={onAcknowledge}
                className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Acknowledge This Result
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 px-5">
        <p className="text-xs text-red-500 italic flex items-center gap-2">
          <AlertOctagon className="w-3 h-3" />
          UAE DHA requires acknowledgment of critical lab values within 1 hour. This result is overdue.
        </p>
      </div>
    </div>
  );
}
