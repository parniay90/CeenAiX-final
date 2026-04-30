import { useState, useEffect, useRef } from 'react';
import { ChevronUp, HeartPulse, Scissors, Building2, Users } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import HealthRecordHeader from '../components/health/HealthRecordHeader';
import TabNavigation from '../components/health/TabNavigation';
import OverviewTab from '../components/health/OverviewTab';
import MedicationsTab from '../components/health/MedicationsTab';
import AllergiesTab from '../components/health/AllergiesTab';
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

  // Scroll-to-top listener
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  // Patient info from MOCK_PATIENT — consistent with Dashboard
  const patientInfo = {
    name: MOCK_PATIENT.name,
    dateOfBirth: 'March 15, 1985',
    emiratesIdLast4: MOCK_PATIENT.emiratesId.slice(-4),
    bloodType: MOCK_PATIENT.bloodType,
  };

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
              {activeTab === 'overview' && (
                <OverviewTab
                  timelineEvents={MOCK_TIMELINE_EVENTS}
                  activeConditions={MOCK_ACTIVE_CONDITIONS}
                />
              )}
              {activeTab === 'medical-history' && (() => {
                const pastConditions = [
                  { condition: 'Pneumonia', diagnosed: '2019', resolved: '2019', doctor: 'Dr. Fatima Hassan', notes: 'Treated with antibiotics, full recovery' },
                  { condition: 'Acute Gastroenteritis', diagnosed: '2021', resolved: '2021', doctor: 'Dr. Ahmed Al Rashidi', notes: 'Recovered after 5 days of treatment' },
                  { condition: 'Iron Deficiency Anemia', diagnosed: '2020', resolved: '2021', doctor: 'Dr. Noor Al Farsi', notes: 'Resolved after 6 months of iron supplementation' },
                ];
                const surgeries = [
                  { procedure: 'Appendectomy', date: 'March 2015', hospital: 'American Hospital Dubai', surgeon: 'Dr. Rajesh Kumar', notes: 'Laparoscopic procedure, no complications' },
                  { procedure: 'Wisdom Tooth Extraction', date: 'June 2018', hospital: 'Dubai Healthcare City', surgeon: 'Dr. Hana Al Blooshi', notes: 'All 4 wisdom teeth removed under local anesthesia' },
                ];
                const hospitalizations = [
                  { reason: 'Severe Pneumonia', hospital: 'Mediclinic Dubai Mall', admitted: 'Jan 12, 2019', discharged: 'Jan 18, 2019', days: 6 },
                  { reason: 'Appendectomy Recovery', hospital: 'American Hospital Dubai', admitted: 'Mar 5, 2015', discharged: 'Mar 7, 2015', days: 2 },
                ];
                const socialHistory = [
                  { label: 'Smoking Status', value: 'Non-smoker' },
                  { label: 'Alcohol Use', value: 'Non-drinker' },
                  { label: 'Exercise', value: '3–4 times per week (moderate intensity)' },
                  { label: 'Diet', value: 'Balanced diet, low sugar due to pre-diabetic condition' },
                  { label: 'Occupation', value: 'Software Engineer' },
                  { label: 'Marital Status', value: 'Married' },
                  { label: 'Living Situation', value: 'Lives with family' },
                  { label: 'Stress Level', value: 'Moderate' },
                ];
                return (
                  <div className="space-y-6">

                    {/* Section 1 — Past Medical Conditions */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <HeartPulse className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Past Medical Conditions</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Illnesses fully resolved — no longer active</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {pastConditions.map((item, i) => (
                          <div key={i} className="px-6 py-4 flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <span className="font-semibold text-gray-900 text-sm">{item.condition}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5 flex-wrap">
                                <span>Diagnosed: <span className="text-gray-700 font-medium">{item.diagnosed}</span></span>
                                <span className="text-gray-300">•</span>
                                <span>Resolved: <span className="text-gray-700 font-medium">{item.resolved}</span></span>
                                <span className="text-gray-300">•</span>
                                <span className="text-teal-700 font-medium">{item.doctor}</span>
                              </div>
                              <p className="text-xs text-gray-500 italic">{item.notes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2 — Surgical History */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Scissors className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Surgical History</h3>
                          <p className="text-xs text-gray-500 mt-0.5">All past surgical procedures</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {surgeries.map((item, i) => (
                          <div key={i} className="px-6 py-4 flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <span className="font-semibold text-gray-900 text-sm">{item.procedure}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Successful</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-1.5 flex-wrap">
                                <span>{item.date}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-700 font-medium">{item.hospital}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-teal-700 font-medium">{item.surgeon}</span>
                              </div>
                              <p className="text-xs text-gray-500 italic">{item.notes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3 — Hospitalization History */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Hospitalization History</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Past inpatient hospital stays</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {hospitalizations.map((item, i) => (
                          <div key={i} className="px-6 py-4 flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <span className="font-semibold text-gray-900 text-sm">{item.reason}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Discharged — Recovered</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                <span className="text-gray-700 font-medium">{item.hospital}</span>
                                <span className="text-gray-300">•</span>
                                <span>Admitted: <span className="text-gray-700 font-medium">{item.admitted}</span></span>
                                <span className="text-gray-300">•</span>
                                <span>Discharged: <span className="text-gray-700 font-medium">{item.discharged}</span></span>
                                <span className="text-gray-300">•</span>
                                <span className="text-teal-700 font-medium">{item.days} days</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4 — Social History */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Social History</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Lifestyle and social factors</p>
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                          {socialHistory.map((item, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                              <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}
              {activeTab === 'medications' && (
                <MedicationsTab medications={MOCK_PATIENT_MEDICATIONS} />
              )}
              {activeTab === 'allergies' && (
                <AllergiesTab allergies={MOCK_PATIENT_ALLERGIES} />
              )}
              {activeTab === 'vaccinations' && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900">Vaccinations</h2>
                  <p className="text-gray-600 mt-2">
                    Vaccination records view coming soon.
                  </p>
                </div>
              )}
              {activeTab === 'lab-results' && (
                <LabResultsTab labResults={MOCK_LAB_RESULTS} />
              )}
              {activeTab === 'imaging' && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900">Imaging Studies</h2>
                  <p className="text-gray-600 mt-2">
                    Imaging records view coming soon.
                  </p>
                </div>
              )}
              {activeTab === 'family-history' && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900">Family History</h2>
                  <p className="text-gray-600 mt-2">
                    Family medical history view coming soon.
                  </p>
                </div>
              )}
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