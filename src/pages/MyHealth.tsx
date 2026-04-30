import { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
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
              {activeTab === 'medical-history' && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
                  <p className="text-gray-600 mt-2">
                    Complete medical history view coming soon. View active conditions in the Overview tab.
                  </p>
                </div>
              )}
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