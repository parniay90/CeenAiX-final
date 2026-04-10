import { Shield, Lock } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-6">
        <div className="relative mb-6 inline-block">
          <div className="w-32 h-32 relative">
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M60 10 L95 30 L95 70 L60 90 L25 70 L25 30 Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-teal-500"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="60"
                cy="50"
                r="15"
                className="text-teal-500"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M60 55 L60 65"
                stroke="currentColor"
                strokeWidth="3"
                className="text-teal-500"
                strokeLinecap="round"
              />
              <path
                d="M60 40 L60 35"
                stroke="currentColor"
                strokeWidth="3"
                className="text-teal-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Secure Clinical Messaging</h2>
        <p className="text-sm text-slate-600 mb-4">
          Select a conversation to begin. All messages are encrypted and logged for compliance.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
          <Shield className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-teal-900">End-to-End Encrypted · DHA Compliant</span>
        </div>
      </div>
    </div>
  );
}
