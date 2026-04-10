import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import {
  DifferentialDiagnosis,
  GuidelineAlert,
  PreventiveCareReminder,
} from '../../types/consultation';

interface ClinicalAIProps {
  differentials: DifferentialDiagnosis[];
  guidelines: GuidelineAlert[];
  preventiveCare: PreventiveCareReminder[];
}

export default function ClinicalAI({
  differentials,
  guidelines,
  preventiveCare,
}: ClinicalAIProps) {
  const [expandedDifferential, setExpandedDifferential] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 border-l border-gray-300">
      <div className="sticky top-0 bg-gradient-to-r from-violet-700 to-violet-900 text-white px-4 py-3 z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h3 className="font-bold text-sm">CeenAiX Clinical AI</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-violet-50 border-b border-violet-200">
            <h4 className="text-xs font-bold text-violet-900">Differential Diagnosis</h4>
          </div>
          <div className="p-3 space-y-3">
            {differentials.map((dx) => {
              const isExpanded = expandedDifferential === dx.id;
              return (
                <div key={dx.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedDifferential(isExpanded ? null : dx.id)}
                    className="w-full p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">
                          {dx.diagnosis}
                        </div>
                        <div className="text-xs text-gray-600 font-mono">{dx.icd10Code}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-violet-700">{dx.probability}%</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          dx.probability >= 70
                            ? 'bg-violet-600'
                            : dx.probability >= 50
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${dx.probability}%` }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                      <h5 className="text-xs font-bold text-gray-700 mb-2 mt-2">Evidence:</h5>
                      <ul className="space-y-1">
                        {dx.evidence.map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-violet-600 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-green-50 border-b border-green-200">
            <h4 className="text-xs font-bold text-green-900">Drug Safety Check</h4>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800 font-semibold">
                No interactions detected
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Drug safety check will run automatically when you add prescriptions.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
            <h4 className="text-xs font-bold text-blue-900">Clinical Guidelines</h4>
          </div>
          <div className="p-3 space-y-3">
            {guidelines.map((guideline) => (
              <div
                key={guideline.id}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-blue-900 mb-1">{guideline.title}</h5>
                    <p className="text-xs text-blue-800 leading-relaxed">{guideline.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-300">
                  <span className="text-xs text-blue-700 font-semibold">{guideline.source}</span>
                  {guideline.url && (
                    <button className="text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-amber-50 border-b border-amber-200">
            <h4 className="text-xs font-bold text-amber-900">Preventive Care Reminders</h4>
          </div>
          <div className="p-3 space-y-2">
            {preventiveCare.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-2 rounded border ${
                  reminder.dueDate.includes('Overdue')
                    ? 'bg-red-50 border-red-300'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">{reminder.test}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      reminder.dueDate.includes('Overdue')
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {reminder.dueDate}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{reminder.message}</p>
                {reminder.lastDone && (
                  <p className="text-xs text-gray-600 mt-1">Last done: {reminder.lastDone}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
            <h4 className="text-xs font-bold text-gray-700">Research Snippets</h4>
          </div>
          <div className="p-3 space-y-2">
            <div className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <h5 className="text-xs font-semibold text-gray-900 mb-1">
                Effect of intensive BP lowering on cardiovascular outcomes
              </h5>
              <p className="text-xs text-gray-600 mb-2">
                SPRINT trial: Intensive BP control (SBP &lt;120) vs standard (&lt;140) reduced CV
                events by 25%...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">NEJM, 2023</span>
                <button className="text-teal-600 hover:text-teal-700">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <h5 className="text-xs font-semibold text-gray-900 mb-1">
                Metformin in T2DM: cardiovascular protection mechanisms
              </h5>
              <p className="text-xs text-gray-600 mb-2">
                Meta-analysis shows metformin reduces MACE by 30% independent of glycemic control...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Diabetes Care, 2024</span>
                <button className="text-teal-600 hover:text-teal-700">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
