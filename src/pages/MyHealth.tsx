import { useState, useEffect, useRef } from 'react';
import { ChevronUp, HeartPulse, Scissors, Building2, Users, Syringe, CheckCircle2, Clock, ShieldCheck, CalendarClock, Info } from 'lucide-react';
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
              {activeTab === 'vaccinations' && (() => {
                const receivedVaccines = [
                  { name: 'COVID-19 (Pfizer-BioNTech)', protects: 'COVID-19', dose: 'Dose 2 of 2', date: 'Jan 15, 2021', clinic: 'Dubai Healthcare City', admin: 'Dr. Ahmed Al Rashidi', lot: 'EW0553' },
                  { name: 'COVID-19 Booster (Pfizer-BioNTech)', protects: 'COVID-19', dose: 'Booster', date: 'Sep 10, 2021', clinic: 'Mediclinic Dubai Mall', admin: 'Dr. Fatima Hassan', lot: 'FK3456' },
                  { name: 'Influenza', protects: 'Seasonal Flu', dose: 'Annual', date: 'Oct 5, 2025', clinic: 'Cleveland Clinic Abu Dhabi', admin: 'Dr. Mohammed Al Zarooni', lot: 'FL2025X' },
                  { name: 'Hepatitis B', protects: 'Hepatitis B', dose: 'Dose 3 of 3', date: 'Mar 20, 2019', clinic: 'American Hospital Dubai', admin: 'Dr. Rajesh Kumar', lot: 'HB9821' },
                  { name: 'Hepatitis A', protects: 'Hepatitis A', dose: 'Dose 2 of 2', date: 'Jun 8, 2018', clinic: 'Dubai Healthcare City', admin: 'Dr. Ahmed Al Rashidi', lot: 'HA7734' },
                  { name: 'MMR (Measles, Mumps, Rubella)', protects: 'Measles, Mumps, Rubella', dose: 'Dose 2 of 2', date: 'Childhood', clinic: 'Dubai Healthcare City', admin: 'Dr. Fatima Hassan', lot: 'MMR2234' },
                  { name: 'Varicella (Chickenpox)', protects: 'Chickenpox', dose: 'Dose 2 of 2', date: 'Childhood', clinic: 'Mediclinic Dubai Mall', admin: 'Dr. Noor Al Farsi', lot: 'VAR5512' },
                  { name: 'Tetanus (Td Booster)', protects: 'Tetanus and Diphtheria', dose: 'Booster', date: 'Aug 14, 2020', clinic: 'American Hospital Dubai', admin: 'Dr. Rajesh Kumar', lot: 'TD4421' },
                ];
                const upcomingVaccines = [
                  { name: 'Influenza (Annual)', reason: 'Recommended annually for adults', due: 'Oct 2026', priority: 'recommended' as const },
                  { name: 'COVID-19 Booster', reason: 'Updated booster recommended every 12 months', due: 'Sep 2026', priority: 'due-soon' as const },
                  { name: 'HPV Vaccine', reason: 'Recommended for adults up to age 45', due: 'Overdue since 2023', priority: 'overdue' as const },
                  { name: 'Pneumococcal (PPSV23)', reason: 'Recommended for adults with diabetes', due: '2027', priority: 'recommended' as const },
                ];
                const priorityConfig = {
                  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-700 border-red-200' },
                  'due-soon': { label: 'Due Soon', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
                  recommended: { label: 'Recommended', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
                };
                return (
                  <div className="space-y-6">

                    {/* Section 1 — Summary Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Vaccines</p>
                        <p className="text-3xl font-bold text-gray-900">8</p>
                        <p className="text-xs text-gray-500 mt-1">Vaccines received</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Up to Date
                        </span>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Vaccine</p>
                        <p className="text-sm font-bold text-gray-900">Influenza</p>
                        <p className="text-xs text-gray-500 mt-0.5">Oct 2025</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Next Due</p>
                        <p className="text-sm font-bold text-gray-900">Influenza</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Oct 2026</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">Due in 5 months</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2 — Received Vaccines */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Syringe className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Received Vaccines</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Complete vaccination history</p>
                        </div>
                        <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{receivedVaccines.length} vaccines</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {receivedVaccines.map((v, i) => (
                          <div key={i} className="px-6 py-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">{v.name}</span>
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{v.dose}</span>
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Completed</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1.5">Protects against: <span className="text-gray-700 font-medium">{v.protects}</span></p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.date}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-700 font-medium">{v.clinic}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-teal-700 font-medium">{v.admin}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-400">Lot: {v.lot}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3 — Upcoming / Due Vaccines */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <CalendarClock className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Upcoming & Due Vaccines</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Vaccines recommended or due for this patient</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {upcomingVaccines.map((v, i) => {
                          const cfg = priorityConfig[v.priority];
                          return (
                            <div key={i} className="px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">{v.name}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{v.reason}</p>
                                <p className="text-xs text-gray-600 font-medium">Due: {v.due}</p>
                              </div>
                              <button disabled className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed border border-gray-200">
                                Schedule Now — Coming Soon
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 4 — Vaccine Certificate */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">UAE Vaccine Certificate</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Official vaccination compliance status</p>
                        </div>
                      </div>
                      <div className="px-6 py-6">
                        <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-semibold text-emerald-800">Vaccinations up to date — Compliant with UAE health requirements</p>
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Compliant</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
                          <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p>To download your official UAE vaccine certificate, please visit the <span className="font-semibold text-teal-700">Al Hosn app</span> or the <span className="font-semibold text-teal-700">MOHAP patient portal</span>.</p>
                        </div>
                        <p className="text-xs text-gray-400">Last verified: October 5, 2025</p>
                      </div>
                    </div>

                  </div>
                );
              })()}
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