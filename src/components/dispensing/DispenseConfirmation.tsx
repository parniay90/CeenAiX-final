import { CheckCircle, Shield, Send } from 'lucide-react';
import { format } from 'date-fns';

interface DispenseConfirmationProps {
  isOpen: boolean;
  rxNumber: string;
  dispensedAt: Date;
  dhaSubmitted: boolean;
  sendToPatientApp: boolean;
  onToggleSendToApp: () => void;
  onClose: () => void;
}

export default function DispenseConfirmation({
  isOpen,
  rxNumber,
  dispensedAt,
  dhaSubmitted,
  sendToPatientApp,
  onToggleSendToApp,
  onClose,
}: DispenseConfirmationProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-8 w-[500px] z-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Dispensed Successfully!</h2>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-slate-600 mb-1">Prescription Number</div>
            <div className="text-xl font-mono font-bold text-slate-900">{rxNumber}</div>
            <div className="text-sm text-slate-600 mt-2">
              {format(dispensedAt, 'dd MMM yyyy, h:mm a')}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {dhaSubmitted && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 border border-teal-200 rounded-lg">
                <Shield className="w-5 h-5 text-teal-700" />
                <span className="text-sm font-bold text-teal-900">Submitted to DHA</span>
              </div>
            )}

            <label className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">
                  Send Summary to Patient App
                </span>
              </div>
              <input
                type="checkbox"
                checked={sendToPatientApp}
                onChange={onToggleSendToApp}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-900">
              The dispensing record has been saved and will be included in the pharmacy's daily DHA submission report.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors"
            >
              Back to Queue
            </button>
            <button className="px-4 py-3 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
