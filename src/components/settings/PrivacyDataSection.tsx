import { useState } from 'react';
import { Download, Trash2, AlertTriangle, Info, Shield } from 'lucide-react';

export default function PrivacyDataSection() {
  const [nabidheConsent, setNabidheConsent] = useState(true);
  const [aiHealthAssistant, setAiHealthAssistant] = useState(true);
  const [researchParticipation, setResearchParticipation] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const insuranceProviders = [
    { id: 'daman', name: 'Daman Insurance', enabled: true },
    { id: 'nhi', name: 'National Health Insurance', enabled: true },
    { id: 'cigna', name: 'Cigna UAE', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-white">NABIDH Consent</h3>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">
              Allow your health data to be shared across UAE healthcare providers through the National Backbone for Integrated Dubai Health (NABIDH) system. This improves care coordination and patient safety.
            </p>
          </div>
          <button
            onClick={() => setNabidheConsent(!nabidheConsent)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              nabidheConsent ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                nabidheConsent ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {!nabidheConsent && (
          <div className="flex items-start gap-2 p-3 bg-amber-900 bg-opacity-20 border border-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200">
              Disabling NABIDH consent may prevent healthcare providers from accessing your complete medical history, which could impact the quality of care you receive.
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">AI Health Assistant</h3>
            <p className="text-sm text-slate-400">
              Enable personalized AI-powered health insights, medication reminders, and preventive care recommendations based on your health data.
            </p>
          </div>
          <button
            onClick={() => setAiHealthAssistant(!aiHealthAssistant)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              aiHealthAssistant ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiHealthAssistant ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Research Participation</h3>
            <p className="text-sm text-slate-400">
              Allow your anonymized health data to be used for UAE health research and public health initiatives. Your identity will never be disclosed.
            </p>
          </div>
          <button
            onClick={() => setResearchParticipation(!researchParticipation)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              researchParticipation ? 'bg-teal-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                researchParticipation ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Insurance Data Sharing</h3>
        <p className="text-sm text-slate-400 mb-4">
          Control which insurance providers can access your health data for claims processing.
        </p>
        <div className="space-y-3">
          {insuranceProviders.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-white">{provider.name}</span>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  provider.enabled ? 'bg-teal-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    provider.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Data Export</h3>
        <p className="text-sm text-slate-400 mb-4">
          Download all your health records in FHIR R4 format (international healthcare data standard). The export includes medical history, lab results, prescriptions, and appointments.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Download My Health Data
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Export typically takes 2-5 minutes. You'll receive a ZIP file via email.
        </p>
      </div>

      <div className="bg-rose-900 bg-opacity-20 border border-rose-600 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Account</h3>
            <p className="text-sm text-rose-200 mb-3">
              Permanently delete your CeenAiX account and remove access to all your data. This action cannot be undone.
            </p>
            <div className="bg-rose-950 bg-opacity-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-rose-300 font-bold mb-1">Important Notice:</p>
              <p className="text-xs text-rose-200">
                Under DHA regulations, healthcare providers must retain medical records for 7 years. While your account will be deleted, your medical records will be archived and retained for compliance purposes. You can request a data export before deletion.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Account Deletion</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Are you absolutely sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="bg-slate-900 rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-300">
                    Type <span className="font-bold text-white">DELETE</span> to confirm:
                  </p>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="w-full mt-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
