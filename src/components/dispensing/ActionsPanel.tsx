import { useState } from 'react';
import {
  CheckCircle,
  Printer,
  Pause,
  ArrowLeft,
  Package,
  CreditCard,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { PaymentMethod, CounselingPoint } from '../../types/dispensing';

interface ActionsPanelProps {
  totalAmount: number;
  insuranceCoverage: number;
  patientPayment: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  counselingPoints: CounselingPoint[];
  onToggleCounselingPoint: (id: string) => void;
  onDispense: (pin: string) => void;
  onHold: (reason: string) => void;
  onReferBack: (message: string) => void;
  hasControlledSubstance: boolean;
}

export default function ActionsPanel({
  totalAmount,
  insuranceCoverage,
  patientPayment,
  paymentMethod,
  onPaymentMethodChange,
  counselingPoints,
  onToggleCounselingPoint,
  onDispense,
  onHold,
  onReferBack,
  hasControlledSubstance,
}: ActionsPanelProps) {
  const [pharmacistPin, setPharmacistPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [holdReason, setHoldReason] = useState('');
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [referMessage, setReferMessage] = useState('');
  const [showReferDialog, setShowReferDialog] = useState(false);

  const allCounselingComplete = counselingPoints.every((p) => p.checked);

  const handleDispense = () => {
    if (!showPinInput) {
      setShowPinInput(true);
      return;
    }
    if (pharmacistPin.length >= 4) {
      onDispense(pharmacistPin);
    }
  };

  return (
    <div className="h-full bg-slate-50 border-l border-slate-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">Payment Summary</h3>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-bold text-slate-900">AED {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Insurance Coverage:</span>
              <span className="font-semibold text-green-700">
                -AED {insuranceCoverage.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between">
              <span className="font-bold text-slate-900">Patient Payment:</span>
              <span className="text-2xl font-bold text-teal-700">
                AED {patientPayment.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
              Payment Method
            </label>
            <div className="space-y-2">
              {[
                { value: 'insurance_direct', label: 'Insurance Direct Billing' },
                { value: 'card', label: 'Credit/Debit Card' },
                { value: 'cash', label: 'Cash' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === option.value
                      ? 'bg-teal-50 border-teal-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-slate-600 text-white rounded text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              Print Labels
            </button>
            <button className="flex-1 px-3 py-2 bg-slate-600 text-white rounded text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">
            Patient Counseling Checklist
          </h3>
          <div className="space-y-2">
            {counselingPoints.map((point) => (
              <label
                key={point.id}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={point.checked}
                  onChange={() => onToggleCounselingPoint(point.id)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-900">{point.label}</span>
              </label>
            ))}
          </div>
          {allCounselingComplete && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-sm font-semibold text-green-900">
                All counseling points completed
              </span>
            </div>
          )}
        </div>

        {hasControlledSubstance && (
          <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-violet-700" />
              <h4 className="text-sm font-bold text-violet-900 uppercase">
                Controlled Substance Log
              </h4>
            </div>
            <p className="text-xs text-violet-800 mb-3">
              Additional verification completed. Ready for DHA reporting.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-violet-100 rounded">
              <Shield className="w-4 h-4 text-violet-700" />
              <span className="text-xs font-bold text-violet-900">
                Emirates ID verified • Batch logged
              </span>
            </div>
          </div>
        )}

        {!showPinInput ? (
          <button
            onClick={handleDispense}
            disabled={!allCounselingComplete}
            className="w-full px-4 py-4 bg-teal-600 text-white rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
          >
            <CheckCircle className="w-6 h-6" />
            Dispense & Complete
          </button>
        ) : (
          <div className="bg-teal-50 border-2 border-teal-300 rounded-lg p-4">
            <label className="block text-sm font-bold text-teal-900 mb-2">
              Enter Pharmacist PIN to Confirm
            </label>
            <input
              type="password"
              value={pharmacistPin}
              onChange={(e) => setPharmacistPin(e.target.value)}
              placeholder="Enter 4-6 digit PIN"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleDispense}
                disabled={pharmacistPin.length < 4}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Dispense
              </button>
              <button
                onClick={() => {
                  setShowPinInput(false);
                  setPharmacistPin('');
                }}
                className="px-4 py-3 bg-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowHoldDialog(true)}
            className="px-3 py-2 bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-lg font-semibold hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Put On Hold
          </button>
          <button
            onClick={() => setShowReferDialog(true)}
            className="px-3 py-2 bg-blue-100 text-blue-900 border-2 border-blue-300 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Refer to Doctor
          </button>
        </div>

        <button className="w-full px-3 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
          <Package className="w-4 h-4" />
          Partial Dispense
        </button>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">DHA Compliance</h4>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Dispensing Record:</span>
              <span className="font-semibold text-amber-700">Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span>DHA Submission:</span>
              <span className="font-semibold text-amber-700">Will auto-submit</span>
            </div>
          </div>
        </div>
      </div>

      {showHoldDialog && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowHoldDialog(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 w-96 z-50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Put Prescription On Hold</h3>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason for hold:
            </label>
            <select
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select reason...</option>
              <option value="awaiting_insurance">Awaiting Insurance Authorization</option>
              <option value="out_of_stock">Medication Out of Stock</option>
              <option value="patient_request">Patient Request</option>
              <option value="drug_interaction">Drug Interaction Review</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (holdReason) {
                    onHold(holdReason);
                    setShowHoldDialog(false);
                    setHoldReason('');
                  }
                }}
                disabled={!holdReason}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                Confirm Hold
              </button>
              <button
                onClick={() => setShowHoldDialog(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {showReferDialog && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowReferDialog(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 w-96 z-50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Refer Back to Doctor</h3>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Message to doctor:
            </label>
            <textarea
              value={referMessage}
              onChange={(e) => setReferMessage(e.target.value)}
              placeholder="Describe the issue or concern..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (referMessage) {
                    onReferBack(referMessage);
                    setShowReferDialog(false);
                    setReferMessage('');
                  }
                }}
                disabled={!referMessage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Send to Doctor
              </button>
              <button
                onClick={() => setShowReferDialog(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
