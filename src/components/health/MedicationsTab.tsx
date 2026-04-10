import { AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PatientMedication } from '../../types/healthRecords';

interface MedicationsTabProps {
  medications: PatientMedication[];
}

export default function MedicationsTab({ medications }: MedicationsTabProps) {
  const getStatusBorder = (status: string) => {
    const borders = {
      Active: 'border-teal-600',
      Stopped: 'border-slate-400',
      NeedsRefill: 'border-amber-500 animate-pulse',
    };
    return borders[status as keyof typeof borders] || 'border-gray-300';
  };

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return 'bg-teal-600';
    if (percentage > 20) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Current Medications</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Medication</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => {
          const progressPercentage = (med.quantityRemaining / med.totalQuantity) * 100;

          return (
            <div
              key={med.id}
              className={`bg-white rounded-lg p-6 border-l-4 ${getStatusBorder(
                med.status
              )} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{med.drugName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{med.genericName}</p>
                </div>
                {med.status === 'NeedsRefill' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    Refill Due
                  </span>
                )}
                {med.status === 'Stopped' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                    Stopped
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dosage:</span>
                  <span className="font-semibold text-gray-900">{med.dosage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium text-gray-900">{med.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Prescribing Doctor:</span>
                  <span className="font-medium text-gray-900">{med.prescribingDoctor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Prescribed:</span>
                  <span className="text-gray-700">
                    {format(med.prescribedDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Refill Date:</span>
                  <span className="text-gray-700">{format(med.refillDate, 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Remaining Quantity</span>
                  <span className="font-semibold text-gray-900">
                    {med.quantityRemaining} / {med.totalQuantity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getProgressColor(
                      med.quantityRemaining,
                      med.totalQuantity
                    )}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                {med.interactionWarnings.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">No interactions detected</span>
                  </div>
                ) : (
                  <button className="flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{med.interactionWarnings.length} interaction flagged</span>
                  </button>
                )}
              </div>

              {med.status === 'NeedsRefill' && (
                <button className="mt-4 w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                  Request Refill
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
