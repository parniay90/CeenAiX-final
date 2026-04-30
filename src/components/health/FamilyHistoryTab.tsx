import { GitBranch, AlertTriangle, ClipboardList, Dna, Users, Info } from 'lucide-react';
import {
  MOCK_FAMILY_MEMBERS,
  MOCK_RISK_ASSESSMENTS,
  MOCK_GENETIC_FLAGS,
} from '../../types/healthRecords';

const RISK_CONFIG = {
  high: { label: 'High Risk', cls: 'bg-red-100 text-red-700 border-red-200' },
  moderate: { label: 'Moderate Risk', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Low Risk', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const CONDITION_COLORS = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-orange-50 text-orange-700 border-orange-200',
];

export default function FamilyHistoryTab() {
  return (
    <div className="space-y-6">

      {/* Section 1 — Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Overall Risk Level</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />Moderate Risk
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Conditions Tracked</p>
          <p className="text-3xl font-bold text-gray-900">{MOCK_RISK_ASSESSMENTS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Family Members Recorded</p>
          <p className="text-3xl font-bold text-gray-900">{MOCK_FAMILY_MEMBERS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recommendation</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5" />Genetic counseling recommended
          </span>
        </div>
      </div>

      {/* Section 2 — Family Members */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Family Members & Their Conditions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Known medical history by family member</p>
          </div>
          <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {MOCK_FAMILY_MEMBERS.length} members
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_FAMILY_MEMBERS.map((member, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 text-sm">{member.relation}</span>
                {member.status === 'living' ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Living</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 border border-gray-300">Deceased</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {member.status === 'living' ? `Age: ${member.age}` : member.age}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.conditions.map((c, j) => (
                  <span
                    key={j}
                    className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CONDITION_COLORS[j % CONDITION_COLORS.length]}`}
                  >
                    {c.name}{c.detail ? ` (${c.detail})` : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Hereditary Risk Assessment */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Hereditary Risk Assessment</h3>
            <p className="text-xs text-gray-500 mt-0.5">Estimated risk based on family history patterns</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_RISK_ASSESSMENTS.map((item, i) => {
            const cfg = RISK_CONFIG[item.risk];
            return (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{item.condition}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {item.members.map((m, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-1.5 text-xs text-gray-500">
                  <ClipboardList className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold text-gray-700">Recommended:</span> {item.recommendation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4 — Genetic Conditions & Notes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Dna className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Genetic Conditions & Clinical Notes</h3>
            <p className="text-xs text-gray-500 mt-0.5">Physician-recorded notes and genetic flags</p>
          </div>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <p className="text-sm text-teal-900 leading-relaxed">
              "Based on your family history, you have a significant hereditary risk for Type 2 Diabetes
              and Cardiovascular Disease. Your current pre-diabetic condition aligns with your family
              pattern. Regular screening and lifestyle modifications are strongly recommended."
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Known Genetic Flags</p>
            <ul className="space-y-2">
              {MOCK_GENETIC_FLAGS.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-400">Last reviewed: March 10, 2026 — Dr. Fatima Hassan</p>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              This information is based on self-reported family history. Consider genetic counseling
              for a comprehensive assessment.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}