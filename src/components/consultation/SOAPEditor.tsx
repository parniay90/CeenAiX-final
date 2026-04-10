import { useState } from 'react';
import { Mic, Sparkles, Plus, Search } from 'lucide-react';

type SOAPSection = 'subjective' | 'objective' | 'assessment' | 'plan';

interface SOAPEditorProps {
  onDictate?: (section: SOAPSection) => void;
  onAIAssist?: (section: SOAPSection) => void;
}

export default function SOAPEditor({ onDictate, onAIAssist }: SOAPEditorProps) {
  const [activeTab, setActiveTab] = useState<SOAPSection>('subjective');
  const [subjectiveText, setSubjectiveText] = useState('');
  const [objectiveText, setObjectiveText] = useState('');
  const [assessmentDiagnoses, setAssessmentDiagnoses] = useState<Array<{ diagnosis: string; code: string; isPrimary: boolean }>>([]);
  const [icd10Search, setIcd10Search] = useState('');
  const [planText, setPlanText] = useState('');

  const tabs: Array<{ id: SOAPSection; label: string }> = [
    { id: 'subjective', label: 'Subjective' },
    { id: 'objective', label: 'Objective' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'plan', label: 'Plan' },
  ];

  const icd10Results = [
    { code: 'I10', name: 'Essential (primary) hypertension' },
    { code: 'I16.9', name: 'Hypertensive crisis, unspecified' },
    { code: 'I11.9', name: 'Hypertensive heart disease without heart failure' },
  ];

  const addDiagnosis = (code: string, name: string) => {
    setAssessmentDiagnoses([
      ...assessmentDiagnoses,
      { diagnosis: name, code, isPrimary: assessmentDiagnoses.length === 0 },
    ]);
    setIcd10Search('');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-300">
      <div className="bg-teal-700 text-white px-4 py-3">
        <h3 className="font-bold text-sm">SOAP Notes</h3>
      </div>

      <div className="flex border-b border-gray-300 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'subjective' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => onDictate?.('subjective')}
                className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1.5"
              >
                <Mic className="w-3 h-3" />
                Dictate
              </button>
              <button
                onClick={() => onAIAssist?.('subjective')}
                className="px-3 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                AI Assist
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Chief Complaint
              </label>
              <input
                type="text"
                placeholder="Primary reason for visit..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                History of Present Illness
              </label>
              <textarea
                value={subjectiveText}
                onChange={(e) => setSubjectiveText(e.target.value)}
                placeholder="Patient reports..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Add Symptom
              </button>
            </div>
          </div>
        )}

        {activeTab === 'objective' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => onDictate?.('objective')}
                className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1.5"
              >
                <Mic className="w-3 h-3" />
                Dictate
              </button>
              <button
                onClick={() => onAIAssist?.('objective')}
                className="px-3 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                AI Assist
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Physical Examination
              </label>
              <textarea
                value={objectiveText}
                onChange={(e) => setObjectiveText(e.target.value)}
                placeholder="General: Alert and oriented x3. Well-nourished, well-developed..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Add Vital Signs
              </button>
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Add Finding
              </button>
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => onAIAssist?.('assessment')}
                className="px-3 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                AI Assist
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Diagnoses (ICD-10)
              </label>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={icd10Search}
                  onChange={(e) => setIcd10Search(e.target.value)}
                  placeholder="Search diagnosis or ICD-10 code..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {icd10Search && (
                <div className="mb-3 border border-gray-300 rounded max-h-40 overflow-y-auto">
                  {icd10Results.map((result) => (
                    <button
                      key={result.code}
                      onClick={() => addDiagnosis(result.code, result.name)}
                      className="w-full px-3 py-2 hover:bg-teal-50 text-left border-b border-gray-200 last:border-0"
                    >
                      <div className="text-xs">
                        <span className="font-mono font-bold text-teal-700">{result.code}</span>
                        <span className="text-gray-700 ml-2">{result.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {assessmentDiagnoses.map((dx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded"
                  >
                    <div className="text-xs">
                      <span className="font-mono font-bold text-blue-700">{dx.code}</span>
                      <span className="text-gray-900 ml-2">{dx.diagnosis}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dx.isPrimary && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">
                          PRIMARY
                        </span>
                      )}
                      <button className="text-red-600 hover:text-red-700 text-xs font-semibold">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => onDictate?.('plan')}
                className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1.5"
              >
                <Mic className="w-3 h-3" />
                Dictate
              </button>
              <button
                onClick={() => onAIAssist?.('plan')}
                className="px-3 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                AI Assist
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <h4 className="text-xs font-bold text-purple-900 mb-2">Prescriptions (0)</h4>
                <button className="w-full py-2 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 transition-colors">
                  + Add Prescription
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <h4 className="text-xs font-bold text-amber-900 mb-2">Lab Orders (0)</h4>
                <button className="w-full py-2 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700 transition-colors">
                  + Order Lab Tests
                </button>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded p-3">
                <h4 className="text-xs font-bold text-teal-900 mb-2">Imaging Orders (0)</h4>
                <button className="w-full py-2 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors">
                  + Order Imaging
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="text-xs font-bold text-blue-900 mb-2">Referrals (0)</h4>
                <button className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors">
                  + Create Referral
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Follow-up Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g., Return in 2 weeks for BP check"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Patient Instructions
                </label>
                <textarea
                  value={planText}
                  onChange={(e) => setPlanText(e.target.value)}
                  placeholder="Home care instructions, lifestyle modifications, warning signs..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
