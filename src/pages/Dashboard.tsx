import { useState } from 'react';
import TopNav from '../components/dashboard/TopNav';
import Sidebar from '../components/dashboard/Sidebar';
import AIHealthCard from '../components/dashboard/AIHealthCard';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import TodaysMedications from '../components/dashboard/TodaysMedications';
import HealthTrends from '../components/dashboard/HealthTrends';
import PreventiveCareChecklist from '../components/dashboard/PreventiveCareChecklist';
import RecentDocuments from '../components/dashboard/RecentDocuments';
import AIAssistant from '../components/dashboard/AIAssistant';
import MyHealth from './MyHealth';
import Appointments from './Appointments';
import AIAssistantPage from './AIAssistant';
import {
  MOCK_PATIENT,
  MOCK_APPOINTMENTS,
  MOCK_MEDICATIONS,
  MOCK_AI_INSIGHTS,
  MOCK_PREVENTIVE_CARE,
  MOCK_DOCUMENTS,
} from '../types/dashboard';

export default function Dashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  if (activeMenuItem === 'health') {
    return <MyHealth />;
  }

  if (activeMenuItem === 'appointments') {
    return <Appointments />;
  }

  if (activeMenuItem === 'ai-assistant') {
    return <AIAssistantPage />;
  }

  const healthScore = {
    score: 78,
    riskLevel: 'Low Risk' as const,
    color: '#10B981',
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <TopNav patientName={MOCK_PATIENT.name} patientAvatar={MOCK_PATIENT.avatar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <AIHealthCard
              patientName={MOCK_PATIENT.name}
              healthScore={healthScore}
              insights={MOCK_AI_INSIGHTS}
            />

            <QuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UpcomingAppointments appointments={MOCK_APPOINTMENTS} />
              </div>
              <div>
                <TodaysMedications medications={MOCK_MEDICATIONS} />
              </div>
            </div>

            <HealthTrends />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PreventiveCareChecklist items={MOCK_PREVENTIVE_CARE} />
              <RecentDocuments documents={MOCK_DOCUMENTS} />
            </div>
          </div>
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
