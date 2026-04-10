import { useState } from 'react';
import { Brain, X, Search, BookOpen, AlertCircle, Pill } from 'lucide-react';

export default function ClinicalAIButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const quickActions = [
    {
      icon: Search,
      label: 'Drug Interaction Check',
      description: 'Check for potential drug interactions',
      color: 'bg-amber-100 text-amber-700 border-amber-300',
    },
    {
      icon: BookOpen,
      label: 'Clinical Guidelines',
      description: 'Access evidence-based treatment protocols',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    {
      icon: AlertCircle,
      label: 'Differential Diagnosis',
      description: 'AI-assisted diagnostic suggestions',
      color: 'bg-purple-100 text-purple-700 border-purple-300',
    },
    {
      icon: Pill,
      label: 'Prescription Assistant',
      description: 'Get dosing recommendations',
      color: 'bg-teal-100 text-teal-700 border-teal-300',
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 bg-violet-600 text-white rounded-full shadow-2xl hover:bg-violet-700 transition-all hover:scale-105 animate-float"
      >
        <Brain className="w-6 h-6" />
        <span className="font-bold text-lg">CeenAiX Clinical AI</span>
      </button>

      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-violet-700 to-violet-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">CeenAiX Clinical AI</h2>
                  <p className="text-sm text-violet-200">Your intelligent clinical assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ask a clinical question
                </label>
                <textarea
                  placeholder="E.g., What are the contraindications for prescribing metformin to a patient with eGFR of 35?"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <button className="mt-3 w-full py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
                  Get AI Recommendation
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${action.color} hover:scale-105 transition-all text-left`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm mb-0.5">{action.label}</p>
                            <p className="text-xs opacity-80">{action.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">
                      Clinical Decision Support
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      AI recommendations are based on current clinical guidelines and evidence-based
                      medicine. Always use your clinical judgment and verify critical decisions.
                      This tool is compliant with DHA regulations for AI-assisted healthcare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
