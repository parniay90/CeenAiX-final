import { useState, useEffect, useRef } from 'react';
import { ChevronUp, GitBranch, AlertTriangle, ClipboardList, Dna, Users, Info } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import HealthRecordHeader from '../components/health/HealthRecordHeader';
import TabNavigation from '../components/health/TabNavigation';
import OverviewTab from '../components/health/OverviewTab';
import MedicalHistoryTab from '../components/health/MedicalHistoryTab';
import MedicationsTab from '../components/health/MedicationsTab';
import AllergiesTab from '../components/health/AllergiesTab';
import VaccinationsTab from '../components/health/VaccinationsTab';
import LabResultsTab from '../components/health/LabResultsTab';
import VitalsLogTab from '../components/health/VitalsLogTab';
import {
  MOCK_TIMELINE_EVENTS,
  MOCK_ACTIVE_CONDITIONS,
  MOCK_PATIENT_MEDICATIONS,
  MOCK_PATIENT_ALLERGIES,
  MOCK_LAB_RESULTS,
  MOCK_VITALS_LOG,
} from '../types/healthRecords';
import { MOCK_PATIENT } from '../types/patientDashboard';

export default function MyHealth() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const patientInfo = {
    name: MOCK_PATIENT.name,
    dateOfBirth: 'March 15, 1985',
    emiratesIdLast4: MOCK_PATIENT.emiratesId.slice(-4),
    bloodType: MOCK_PATIENT.bloodType,
  };

  // ── Family History inline data ────────────────────────────────────────────
  const familyMembers = [
    { relation: 'Father', age: '68', status: 'living' as const, conditions: [{ name: 'Type 2 Diabetes', detail: 'diagnosed age 45' }, { name: 'Hypertension', detail: 'diagnosed age 50' }, { name: 'Coronary Artery Disease', detail: 'diagnosed age 60' }] },
    { relation: 'Mother', age: '64', status: 'living' as const, conditions: [{ name: 'Hypertension', detail: 'diagnosed age 52' }, { name: 'Osteoporosis', detail: 'diagnosed age 58' }, { name: 'Hypothyroidism', detail: 'diagnosed age 48' }] },
    { relation: 'Paternal Grandfather', age: 'Deceased at age 72', status: 'deceased' as const, conditions: [{ name: 'Type 2 Diabetes', detail: '' }, { name: 'Heart Attack', detail: 'cause of death at 72' }, { name: 'Hypertension', detail: '' }] },
    { relation: 'Paternal Grandmother', age: 'Deceased at age 78', status: 'deceased' as const, conditions: [{ name: 'Breast Cancer', detail: 'diagnosed age 65' }, { name: 'Type 2 Diabetes', detail: '' }] },
    { relation: 'Maternal Grandfather', age: 'Deceased at age 80', status: 'deceased' as const, conditions: [{ name: 'Hypertension', detail: '' }, { name: 'Stroke', detail: 'age 75' }] },
    { relation: 'Maternal Grandmother', age: '82', status: 'living' as const, conditions: [{ name: 'Osteoporosis', detail: '' }, { name: 'Type 2 Diabetes', detail: 'diagnosed age 60' }, { name: "Alzheimer's Disease", detail: 'diagnosed age 78' }] },
  ];
  const riskAssessments = [
    { condition: 'Type 2 Diabetes', risk: 'high' as const, members: ['Father', 'Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandmother'], recommendation: 'Annual HbA1c screening, fasting glucose test, maintain healthy weight and diet' },
    { condition: 'Cardiovascular Disease', risk: 'high' as const, members: ['Father', 'Paternal Grandfather', 'Maternal Grandfather'], recommendation: 'Annual lipid panel, blood pressure monitoring, ECG every 2 years after age 40' },
    { condition: 'Hypertension', risk: 'high' as const, members: ['Father', 'Mother', 'Paternal Grandfather', 'Maternal Grandfather'], recommendation: 'Regular blood pressure monitoring at home and during checkups' },
    { condition: 'Osteoporosis', risk: 'moderate' as const, members: ['Mother', 'Maternal Grandmother'], recommendation: 'DEXA scan after age 50, adequate calcium and vitamin D intake' },
    { condition: 'Breast Cancer', risk: 'moderate' as const, members: ['Paternal Grandmother'], recommendation: 'Annual mammogram after age 40, consider BRCA genetic testing' },
    { condition: "Alzheimer's Disease", risk: 'moderate' as const, members: ['Maternal Grandmother'], recommendation: 'Cognitive health monitoring, mental stimulation, regular physical activity' },
    { condition: 'Hypothyroidism', risk: 'low' as const, members: ['Mother'], recommendation: 'Thyroid function test every 3–5 years' },
    { condition: 'Stroke', risk: 'low' as const, members: ['Maternal Grandfather'], recommendation: 'Blood pressure control, healthy lifestyle' },
  ];
  const riskConfig = {
    high: { label: 'High Risk', cls: 'bg-red-100 text-red-700 border-red-200' },
    moderate: { label: 'Moderate Risk', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    low: { label: 'Low Risk', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  };
  const conditionColors = [
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-teal-50 text-teal-700 border-teal-200',
    'bg-orange-50 text-orange-700 border-orange-200',
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="health" />

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="flex-1">
            <HealthRecordHeader
              patientName={patientInfo.name}
              dateOfBirth={patientInfo.dateOfBirth}
              emiratesIdLast4={patientInfo.emiratesIdLast4}
              bloodType={patientInfo.bloodType}
            />

            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="max-w-7xl mx-auto p-6">

              {/* ── Overview ── */}
              {activeTab === 'overview' && (
                <OverviewTab
                  timelineEvents={MOCK_TIMELINE_EVENTS}
                  activeConditions={MOCK_ACTIVE_CONDITIONS}
                />
              )}

              {/* ── Medical History ── */}
              {activeTab === 'medical-history' && <MedicalHistoryTab />}

              {/* ── Medications ── */}
              {activeTab === 'medications' && (
                <MedicationsTab medications={MOCK_PATIENT_MEDICATIONS} />
              )}

              {/* ── Allergies ── */}
              {activeTab === 'allergies' && (
                <AllergiesTab allergies={MOCK_PATIENT_ALLERGIES} />
              )}

              {/* ── Vaccinations ── */}
              {activeTab === 'vaccinations' && <VaccinationsTab />}

              {/* ── Lab Results ── */}
              {activeTab === 'lab-results' && (
                <LabResultsTab labResults={MOCK_LAB_RESULTS} />
              )}

              {/* ── Imaging ── */}
              {activeTab === 'imaging' && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900">Imaging Studies</h2>
                  <p className="text-gray-600 mt-2">Imaging records view coming soon.</p>
                </div>
              )}

              {/* ── Family History ── */}
              {activeTab === 'family-history' && (
                <div className="space-y-6">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Overall Risk Level</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" />Moderate Risk
                      </span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Conditions Tracked</p>
                      <p className="text-3xl font-bold text-gray-900">8</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Family Members Recorded</p>
                      <p className="text-3xl font-bold text-gray-900">6</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recommendation</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        <Info className="w-3.5 h-3.5" />Genetic counseling recommended
                      </span>
                    </div>
                  </div>

                  {/* Family Members */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Family Members & Their Conditions</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Known medical history by family member</p>
                      </div>
                      <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{familyMembers.length} members</span>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {familyMembers.map((member, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900 text-sm">{member.relation}</span>
                            {member.status === 'living' ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Living</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 border border-gray-300">Deceased</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{member.status === 'living' ? `Age: ${member.age}` : member.age}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {member.conditions.map((c, j) => (
                              <span key={j} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${conditionColors[j % conditionColors.length]}`}>
                                {c.name}{c.detail ? ` (${c.detail})` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hereditary Risk Assessment */}
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
                      {riskAssessments.map((item, i) => {
                        const cfg = riskConfig[item.risk];
                        return (
                          <div key={i} className="px-6 py-4">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="font-semibold text-gray-900 text-sm">{item.condition}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.members.map((m, j) => (
                                <span key={j} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{m}</span>
                              ))}
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-gray-500">
                              <ClipboardList className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                              <span><span className="font-semibold text-gray-700">Recommended:</span> {item.recommendation}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Genetic Conditions & Notes */}
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
                          "Based on your family history, you have a significant hereditary risk for Type 2 Diabetes and Cardiovascular Disease. Your current pre-diabetic condition aligns with your family pattern. Regular screening and lifestyle modifications are strongly recommended."
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Known Genetic Flags</p>
                        <ul className="space-y-2">
                          {[
                            'No known chromosomal disorders reported in family',
                            'BRCA genetic testing not yet performed — recommended given paternal grandmother history',
                            'No known hereditary cancer syndromes confirmed',
                          ].map((flag, i) => (
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
                        <p className="text-xs text-amber-800">This information is based on self-reported family history. Consider genetic counseling for a comprehensive assessment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Vitals Log ── */}
              {activeTab === 'vitals' && (
                <VitalsLogTab vitalsLog={MOCK_VITALS_LOG} />
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}