import { X, AlertCircle, CheckCircle, FileText, Printer } from 'lucide-react';
import { Prescription } from '../../types/pharmacy';
import { formatDistanceToNow } from 'date-fns';

interface PrescriptionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onDispense: (id: string) => void;
}

export default function PrescriptionDetailDrawer({
  isOpen,
  onClose,
  prescription,
  onDispense,
}: PrescriptionDetailDrawerProps) {
  if (!isOpen || !prescription) return null;

  const hasConflict = prescription.interactionFlags.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Prescription Details</h2>
            <p className="text-sm text-slate-600 font-mono">{prescription.rxNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {prescription.isUrgent && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-rose-900 mb-1">Urgent Prescription</h3>
                <p className="text-sm text-rose-800">
                  This prescription requires immediate attention. Process as priority.
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Patient Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-600 mb-1">Patient Name</div>
                <div className="text-sm font-semibold text-slate-900">
                  {prescription.patientName}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Time Received</div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatDistanceToNow(prescription.timeReceived, { addSuffix: true })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Prescribing Doctor</div>
                <div className="text-sm font-semibold text-slate-900">
                  {prescription.doctorName}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Clinic</div>
                <div className="text-sm font-semibold text-slate-900">
                  {prescription.doctorClinic}
                </div>
              </div>
            </div>

            {prescription.patientAllergies.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900 uppercase">
                    Patient Allergies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prescription.patientAllergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hasConflict && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-rose-700" />
                <h3 className="text-sm font-bold text-rose-900">
                  Drug Interaction Detected
                </h3>
              </div>
              <div className="space-y-3">
                {prescription.interactionFlags.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="p-3 bg-white border border-rose-200 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm text-slate-900">
                        {interaction.drugA} ↔ {interaction.drugB}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          interaction.severity === 'contraindicated'
                            ? 'bg-rose-100 text-rose-900'
                            : interaction.severity === 'major'
                            ? 'bg-orange-100 text-orange-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {interaction.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{interaction.description}</p>
                    <div className="text-xs text-slate-600">
                      Type: {interaction.interactionType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Medications</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {prescription.medications.map((med) => (
                <div key={med.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{med.drugName}</h4>
                      <p className="text-xs text-slate-600">
                        {med.strength} • {med.form}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-teal-700">
                      Qty: {med.quantity}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-slate-600 font-semibold min-w-[80px]">
                        Dosage:
                      </span>
                      <span className="text-slate-900">{med.dosage}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600 font-semibold min-w-[80px]">
                        Duration:
                      </span>
                      <span className="text-slate-900">{med.duration}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600 font-semibold min-w-[80px]">
                        Instructions:
                      </span>
                      <span className="text-slate-900">{med.instructions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Insurance Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Provider:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {prescription.insuranceProvider}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Pre-Authorization:</span>
                <span
                  className={`text-sm font-semibold ${
                    prescription.insuranceAuthStatus === 'approved'
                      ? 'text-green-700'
                      : prescription.insuranceAuthStatus === 'pending'
                      ? 'text-amber-700'
                      : prescription.insuranceAuthStatus === 'denied'
                      ? 'text-rose-700'
                      : 'text-slate-700'
                  }`}
                >
                  {prescription.insuranceAuthStatus === 'approved' && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  )}
                  {prescription.insuranceAuthStatus === 'pending' && 'Pending'}
                  {prescription.insuranceAuthStatus === 'denied' && 'Denied'}
                  {prescription.insuranceAuthStatus === 'not_required' && 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onDispense(prescription.id)}
              disabled={hasConflict && !prescription.interactionFlags[0]?.resolved}
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Dispensed
            </button>
            <button className="px-4 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Print Label
            </button>
          </div>

          {hasConflict && !prescription.interactionFlags[0]?.resolved && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Action Required:</strong> This prescription has unresolved drug
                interactions. Contact the prescribing doctor or document override reason before
                dispensing.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Contact Doctor
                </button>
                <button className="px-3 py-2 bg-amber-600 text-white rounded text-sm font-semibold hover:bg-amber-700 transition-colors">
                  Override & Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
