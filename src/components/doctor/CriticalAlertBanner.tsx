import React, { useState } from 'react';
import { AlertOctagon, X } from 'lucide-react';

interface CriticalAlertBannerProps {
  onAcknowledge?: () => void;
}

const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ onAcknowledge }) => {
  const [showModal, setShowModal] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAcknowledge = () => {
    if (!confirmed) return;
    setAcknowledged(true);
    setShowModal(false);
    if (onAcknowledge) onAcknowledge();
  };

  if (acknowledged) return null;

  return (
    <>
      <div className="w-full bg-red-50 border-2 border-red-600 rounded-xl p-4 mb-6 animate-pulse-ring">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="text-red-700 font-bold text-sm mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  🔴 CRITICAL RESULT
                </h3>
                <p className="text-red-500 text-xs font-mono">
                  Unacknowledged: 1 hour 12 minutes
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-red-900 font-bold text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Abdullah Hassan Al Zaabi — Troponin I
                </h4>

                <div className="flex items-baseline space-x-3">
                  <span className="text-red-700 font-bold text-3xl font-mono">2.8 ng/mL</span>
                  <span className="text-slate-600 text-xs">Reference: &lt; 0.04 ng/mL</span>
                  <span className="px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded">
                    CRITICAL HIGH ↑↑
                  </span>
                </div>

                <p className="text-slate-500 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Dubai Medical Lab — Resulted 11:47 AM
                </p>
                <p className="text-slate-600 text-xs italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Patient presented with chest pain — referred to emergency at 11:45 AM
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 flex-shrink-0">
            <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
              🏥 Patient is in Emergency — View Status
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              ✅ Acknowledge This Result
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-red-500 text-[11px] italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            ⚠️ UAE DHA requires acknowledgment of critical lab values within 1 hour. This result is overdue.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Confirm Acknowledgment
                </h3>
                <p className="text-sm text-slate-500 mt-1">Critical lab result verification</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-900 font-bold text-sm mb-2">
                Abdullah Hassan Al Zaabi
              </p>
              <p className="text-red-700 font-mono text-lg font-bold">
                Troponin I: 2.8 ng/mL CRITICAL
              </p>
              <p className="text-red-600 text-xs mt-1">Reference: &lt; 0.04 ng/mL</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
              <p className="text-slate-700 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                I confirm I have reviewed this critical result and the patient is under emergency care.
              </p>
            </div>

            <label className="flex items-start space-x-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-slate-700">
                ✅ Patient referred to emergency — confirmed
              </span>
            </label>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledge}
                disabled={!confirmed}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                  confirmed
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Acknowledge & Close Alert
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(220, 38, 38, 0);
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default CriticalAlertBanner;
