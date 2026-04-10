import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { PatientConsultation } from '../../types/consultation';
import { formatDistanceToNow } from 'date-fns';

interface PatientIntelligenceProps {
  patient: PatientConsultation;
}

export default function PatientIntelligence({ patient }: PatientIntelligenceProps) {
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getChangeIndicator = (change?: number) => {
    if (!change || change === 0) return null;
    return change > 0 ? (
      <span className="text-red-600 flex items-center gap-0.5 text-xs font-semibold">
        <ArrowUp className="w-3 h-3" />
        {Math.abs(change)}
      </span>
    ) : (
      <span className="text-green-600 flex items-center gap-0.5 text-xs font-semibold">
        <ArrowDown className="w-3 h-3" />
        {Math.abs(change)}
      </span>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 border-r border-gray-300">
      <div className="sticky top-0 bg-teal-700 text-white px-4 py-3 z-10">
        <h3 className="font-bold text-sm">Patient Intelligence</h3>
      </div>

      <div className="p-4 space-y-4">
        {patient.allergyCount > 0 && (
          <div className="bg-rose-50 border-2 border-rose-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <h4 className="text-xs font-bold text-rose-900">ALLERGIES</h4>
            </div>
            <div className="space-y-1">
              {patient.allergies.map((allergy) => (
                <div key={allergy.id} className="text-xs">
                  <span className="font-bold text-rose-800">{allergy.allergen}</span>
                  <span className="text-rose-700"> - {allergy.reaction}</span>
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      allergy.severity === 'severe'
                        ? 'bg-red-600 text-white'
                        : allergy.severity === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {allergy.severity.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-700">AI Health Score</h4>
            {getTrendIcon(patient.healthScoreTrend)}
          </div>

          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={patient.aiHealthScore >= 70 ? '#14B8A6' : patient.aiHealthScore >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(patient.aiHealthScore / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{patient.aiHealthScore}</span>
              <span className="text-xs text-gray-600">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
            <h4 className="text-xs font-bold text-gray-700">Active Conditions</h4>
          </div>
          <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
            {patient.activeConditions.map((condition) => (
              <div key={condition.id} className="text-xs pb-2 border-b border-gray-100 last:border-0">
                <div className="font-semibold text-gray-900 mb-0.5">{condition.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-mono">{condition.icd10Code}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      condition.status === 'controlled'
                        ? 'bg-green-100 text-green-700'
                        : condition.status === 'active'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {condition.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
            <h4 className="text-xs font-bold text-gray-700">Current Medications</h4>
          </div>
          <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
            {patient.currentMedications.map((med) => (
              <div key={med.id} className="text-xs pb-2 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between mb-0.5">
                  <span className="font-semibold text-gray-900">{med.drugName}</span>
                  {med.hasInteraction && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        med.interactionSeverity === 'high'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}
                    >
                      ⚠
                    </span>
                  )}
                </div>
                <div className="text-gray-700">
                  {med.dose} - {med.frequency}
                </div>
                <div className="text-gray-500 mt-0.5">Rx: {med.prescriber}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
            <Activity className="w-3 h-3 text-gray-700" />
            <h4 className="text-xs font-bold text-gray-700">Today's Vitals</h4>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Blood Pressure</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {patient.vitals.bp.systolic}/{patient.vitals.bp.diastolic}
                </span>
                {getChangeIndicator(patient.vitals.bp.change)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Heart Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{patient.vitals.hr.value} bpm</span>
                {getChangeIndicator(patient.vitals.hr.change)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Weight</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {patient.vitals.weight.value} {patient.vitals.weight.unit}
                </span>
                {getChangeIndicator(patient.vitals.weight.change)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Temperature</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {patient.vitals.temp.value} {patient.vitals.temp.unit}
                </span>
                {getChangeIndicator(patient.vitals.temp.change)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">SpO2</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{patient.vitals.spo2.value}%</span>
                {getChangeIndicator(patient.vitals.spo2.change)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
            <h4 className="text-xs font-bold text-gray-700">Last 3 Visits</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {patient.previousVisits.map((visit) => {
              const isExpanded = expandedVisit === visit.id;
              return (
                <div key={visit.id}>
                  <button
                    onClick={() => setExpandedVisit(isExpanded ? null : visit.id)}
                    className="w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-900 mb-0.5">
                          {formatDistanceToNow(visit.date, { addSuffix: true })}
                        </div>
                        <div className="text-gray-600">{visit.chiefComplaint}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 text-xs space-y-1 bg-gray-50">
                      <div>
                        <span className="font-semibold text-gray-700">Diagnosis: </span>
                        <span className="text-gray-900">{visit.diagnosis}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Treatment: </span>
                        <span className="text-gray-900">{visit.treatment}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
