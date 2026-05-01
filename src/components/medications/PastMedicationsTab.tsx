import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pill, MessageCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PastMedication } from '../../types/medications';

interface PastMedicationsTabProps {
  medications: PastMedication[];
}

// ── Request Again Modal ───────────────────────────────────────────────────────
function RequestAgainModal({
  med,
  onClose,
}: {
  med: PastMedication;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setSubmitted(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'stopped': return 'bg-gray-100 text-gray-600';
      case 'expired': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={submitted ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Request Medication Again</p>
              <p className="text-xs text-gray-400 mt-0.5">{med.brandName} {med.strength}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {submitted ? (
            // ── Success state ──
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Request Sent!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Your request for <span className="font-semibold text-gray-700">{med.brandName} {med.strength}</span> has been sent to
              </p>
              <p className="text-teal-600 font-semibold text-sm">{med.prescribedBy}</p>
              <p className="text-gray-400 text-xs mt-3">
                Your doctor will review your request and respond shortly. You will be notified once a decision is made.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            // ── Form state ──
            <div className="space-y-5">

              {/* Medication summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{med.brandName} {med.strength}</p>
                    <p className="text-xs text-gray-500">{med.genericName} — {med.category}</p>
                  </div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(med.status)}`}>
                    {med.statusLabel}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Previously prescribed for:</span>
                    <span className="font-medium text-gray-700">{med.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prescribing doctor:</span>
                    <span className="font-medium text-teal-700">{med.prescribedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Previous duration:</span>
                    <span className="font-medium text-gray-700">{med.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last prescribed:</span>
                    <span className="font-medium text-gray-700">{med.prescribedOn}</span>
                  </div>
                </div>
              </div>

              {/* Reason field — required */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Why do you need this medication again?
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Your doctor needs this information to review your request safely.</p>
                <textarea
                  value={reason}
                  onChange={e => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setShowError(false);
                  }}
                  rows={4}
                  placeholder="Describe your current symptoms or reason for needing this medication again..."
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 transition-colors ${
                    showError
                      ? 'border-red-300 focus:ring-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-teal-500 focus:border-teal-500'
                  }`}
                />
                {showError && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-500 font-medium">Please describe your reason before sending the request.</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1 text-right">{reason.length} characters</p>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">
                  ⚠️ This is a request only — your doctor will review and decide whether to prescribe this medication. Do not self-medicate.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PastMedicationsTab({ medications }: PastMedicationsTabProps) {
  const [requestMed, setRequestMed] = useState<PastMedication | null>(null);

  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
            ✅ {label}
          </div>
        );
      case 'stopped':
        return (
          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
            ⏹ {label}
          </div>
        );
      case 'expired':
        return (
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
            ⏰ {label}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Past Medications 🕐</h3>
        <p className="text-sm text-gray-500">Medications you've taken before — for reference</p>
      </div>

      <div className="space-y-4">
        {medications.map((med, idx) => (
          <div
            key={med.id}
            className="bg-white rounded-xl p-5 border-l-4 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:opacity-100 opacity-90"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-bold text-gray-700">{med.brandName} {med.strength}</h4>
                    {getStatusBadge(med.status, med.statusLabel)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <div>{med.prescribedOn} — {med.duration}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div>For: {med.reason}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div>{med.prescribedBy}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setRequestMed(med)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-teal-400 hover:text-teal-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                Request Again
              </button>
            </div>
          </div>
        ))}
      </div>

      {medications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Pill className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No past medications</p>
        </div>
      )}

      {/* Modal */}
      {requestMed && (
        <RequestAgainModal
          med={requestMed}
          onClose={() => setRequestMed(null)}
        />
      )}
    </div>
  );
}