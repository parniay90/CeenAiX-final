import { Shield, Database, Sparkles, Info, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Step5Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Step5Consent({ data, updateData, onSubmit, onBack }: Step5Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit();
  };

  const canSubmit = data.dhaConsent && data.termsAccepted;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">DHA Data Sharing Consent (Required)</h3>
              <p className="text-sm text-gray-600 mb-3">
                The Dubai Health Authority (DHA) requires your consent to share your health data with authorized healthcare providers in Dubai.
              </p>
              <a
                href="https://www.dha.gov.ae/en/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:text-teal-700 underline"
              >
                Read DHA Privacy Policy
              </a>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.dhaConsent}
                onChange={(e) => updateData({ dhaConsent: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Database className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">NABIDH HIE Enrollment</h3>
                <button
                  type="button"
                  className="group relative"
                  title="Learn more about NABIDH"
                >
                  <Info className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg">
                    NABIDH (National Backbone for Integrated Dubai Health) allows all your UAE healthcare providers to access your medical records securely.
                  </div>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Allows all your UAE healthcare providers to see your records for better coordinated care.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.nabidhEnrolled}
                onChange={(e) => updateData({ nabidhEnrolled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
                <button
                  type="button"
                  className="group relative"
                  title="Learn more about AI Health Assistant"
                >
                  <Info className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg">
                    CeenAiX AI analyzes your health data to provide predictive alerts, medication interaction checks, and personalized wellness guidance.
                  </div>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Enables predictive health alerts and personalized guidance powered by CeenAiX AI.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.aiAssistantConsent}
                onChange={(e) => updateData({ aiAssistantConsent: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        <div className="border-2 border-teal-200 rounded-lg p-6 bg-teal-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) => updateData({ termsAccepted: e.target.checked })}
              className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <div className="text-sm text-gray-700">
              I accept the{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 underline font-medium">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 underline font-medium">
                Privacy Policy
              </a>{' '}
              of CeenAiX (Required)
            </div>
          </label>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' font-weight='bold' fill='%230F172A' text-anchor='middle'%3EDHA%3C/text%3E%3C/svg%3E"
                alt="DHA"
                className="h-8"
              />
              <span className="text-xs text-gray-500 mt-1">Approved</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Ctext x='50' y='25' font-family='Arial' font-size='12' font-weight='bold' fill='%230F172A' text-anchor='middle'%3ENABIDH%3C/text%3E%3C/svg%3E"
                alt="NABIDH"
                className="h-8"
              />
              <span className="text-xs text-gray-500 mt-1">Certified</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>UAE-Hosted & Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex-1 bg-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Creating Your Health Profile...
            </>
          ) : (
            'Create My Health Profile'
          )}
        </button>
      </div>
    </form>
  );
}
