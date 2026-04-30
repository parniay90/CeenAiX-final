import { useState } from 'react';
import { AlertTriangle, CheckCircle, Plus, X, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { PatientMedication } from '../../types/healthRecords';

interface MedicationsTabProps {
  medications: PatientMedication[];
}

// ── Add Medication — Coming Soon Modal ────────────────────────────────────────
function AddMedicationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Add Medication</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">In Progress</h3>
          <p className="text-gray-500 text-sm">Adding medications is managed by your doctor. This feature will allow your care team to update your medication list directly. Coming soon.</p>
          <button onClick={onClose} className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Request Refill Modal ──────────────────────────────────────────────────────
function RequestRefillModal({
  medication,
  onClose,
}: {
  medication: PatientMedication;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={confirmed ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Request Refill</p>
              <p className="text-xs text-gray-400 mt-0.5">{medication.drugName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6">
          {confirmed ? (
            // ── Success state ──
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Refill Requested!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Your refill request for <span className="font-semibold text-gray-700">{medication.drugName}</span> has been sent to
              </p>
              <p className="text-teal-600 font-semibold text-sm mb-1">{medication.prescribingDoctor}</p>
              <p className="text-gray-400 text-xs mt-3">Your doctor will review and approve the refill shortly.</p>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            // ── Confirmation state ──
            <>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to request a refill for:
              </p>

              {/* Medication summary card */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                <p className="font-bold text-gray-900">{medication.drugName}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">{medication.genericName}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dosage:</span>
                    <span className="font-medium text-gray-700">{medication.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="font-medium text-gray-700">{medication.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prescribing Doctor:</span>
                    <span className="font-medium text-teal-700">{medication.prescribingDoctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Remaining:</span>
                    <span className="font-medium text-amber-600">{medication.quantityRemaining} / {medication.totalQuantity} units</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setConfirmed(true)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Confirm Refill
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MedicationsTab({ medications }: MedicationsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refillMedication, setRefillMedication] = useState<PatientMedication | null>(null);

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
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
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
              className={`bg-white rounded-lg p-6 border-l-4 ${getStatusBorder(med.status)} shadow-sm hover:shadow-md transition-all`}
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
                  <span className="text-gray-700">{format(med.prescribedDate, 'MMM dd, yyyy')}</span>
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
                    className={`h-full rounded-full transition-all ${getProgressColor(med.quantityRemaining, med.totalQuantity)}`}
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
                <button
                  onClick={() => setRefillMedication(med)}
                  className="mt-4 w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                >
                  Request Refill
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <AddMedicationModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Request Refill Modal */}
      {refillMedication && (
        <RequestRefillModal
          medication={refillMedication}
          onClose={() => setRefillMedication(null)}
        />
      )}
    </div>
  );
}