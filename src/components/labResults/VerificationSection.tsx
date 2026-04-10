import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Save, Send, Bell } from 'lucide-react';
import { VerificationData, ResultStatus } from '../../types/labResults';

interface VerificationSectionProps {
  hasAbnormalResults: boolean;
  hasCriticalResults: boolean;
  isStatPriority: boolean;
  onSaveDraft: () => void;
  onVerifyAndRelease: (verification: VerificationData) => void;
  onReleaseAndSubmit: (verification: VerificationData) => void;
  onNotifyDoctor: () => void;
  currentStatus: ResultStatus;
}

export default function VerificationSection({
  hasAbnormalResults,
  hasCriticalResults,
  isStatPriority,
  onSaveDraft,
  onVerifyAndRelease,
  onReleaseAndSubmit,
  onNotifyDoctor,
  currentStatus,
}: VerificationSectionProps) {
  const [technicianName, setTechnicianName] = useState('');
  const [technicianPin, setTechnicianPin] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');
  const [supervisorAcknowledged, setSupervisorAcknowledged] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const requiresSupervisor = hasCriticalResults || isStatPriority || hasAbnormalResults;

  const canVerify =
    technicianName &&
    technicianPin &&
    (!requiresSupervisor || (supervisorName && supervisorPin && supervisorAcknowledged));

  const handleVerifyAndRelease = () => {
    if (!canVerify) return;

    const verification: VerificationData = {
      technicianName,
      technicianPin,
      supervisorName: requiresSupervisor ? supervisorName : undefined,
      supervisorPin: requiresSupervisor ? supervisorPin : undefined,
      supervisorAcknowledged,
      overrideReason: hasAbnormalResults ? overrideReason : undefined,
    };

    onVerifyAndRelease(verification);
  };

  const handleReleaseAndSubmit = () => {
    if (!canVerify) return;

    const verification: VerificationData = {
      technicianName,
      technicianPin,
      supervisorName: requiresSupervisor ? supervisorName : undefined,
      supervisorPin: requiresSupervisor ? supervisorPin : undefined,
      supervisorAcknowledged,
      overrideReason: hasAbnormalResults ? overrideReason : undefined,
    };

    onReleaseAndSubmit(verification);
  };

  if (currentStatus !== 'draft') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border-2 border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-teal-600" />
        <h3 className="text-base font-bold text-slate-900 uppercase">
          Verification & Sign-Off
        </h3>
      </div>

      {(hasCriticalResults || hasAbnormalResults || isStatPriority) && (
        <div className="mb-4 space-y-2">
          {hasCriticalResults && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              <div>
                <div className="text-sm font-bold text-rose-900">Critical Results Detected</div>
                <div className="text-xs text-rose-800">
                  Supervisor verification is REQUIRED before release
                </div>
              </div>
            </div>
          )}
          {isStatPriority && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <div>
                <div className="text-sm font-bold text-amber-900">STAT Priority</div>
                <div className="text-xs text-amber-800">
                  Supervisor verification is REQUIRED for STAT results
                </div>
              </div>
            </div>
          )}
          {hasAbnormalResults && !hasCriticalResults && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <div>
                <div className="text-sm font-bold text-amber-900">Abnormal Results Detected</div>
                <div className="text-xs text-amber-800">
                  Supervisor must acknowledge before release
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Technician Sign-Off</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Technician Name
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Full name..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PIN</label>
              <input
                type="password"
                value={technicianPin}
                onChange={(e) => setTechnicianPin(e.target.value)}
                placeholder="Enter PIN..."
                maxLength={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {requiresSupervisor && (
          <div className="bg-amber-50 rounded-lg border-2 border-amber-300 p-4">
            <h4 className="text-sm font-bold text-amber-900 mb-3">
              Lab Supervisor Verification (Required)
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supervisor Name
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder="Full name..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN</label>
                <input
                  type="password"
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  placeholder="Enter PIN..."
                  maxLength={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={supervisorAcknowledged}
                onChange={(e) => setSupervisorAcknowledged(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-sm font-bold text-slate-900">
                I acknowledge and approve these results for release
              </span>
            </label>
          </div>
        )}

        {hasAbnormalResults && (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Override Acknowledgment (Optional)
            </h4>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Explain clinical context for abnormal results (optional)..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onSaveDraft}
          className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Draft
        </button>
        <button
          onClick={handleVerifyAndRelease}
          disabled={!canVerify}
          className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Verify & Release
        </button>
        <button
          onClick={handleReleaseAndSubmit}
          disabled={!canVerify}
          className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Release & Submit to NABIDH
        </button>
      </div>

      <div className="mt-3">
        <button
          onClick={onNotifyDoctor}
          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Bell className="w-5 h-5" />
          Notify Doctor (Send Alert to CeenAiX Account)
        </button>
      </div>
    </div>
  );
}
