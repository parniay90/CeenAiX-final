import { useState } from 'react';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorTopNav from '../components/doctor/DoctorTopNav';
import MRICTAnalysis from './MRICTAnalysis';
import DoctorDashboardNew from './DoctorDashboardNew';
import { MOCK_DOCTOR } from '../types/doctor';

export default function DoctorDashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'mri-ct-analysis':
        return <MRICTAnalysis />;
      case 'dashboard':
      default:
        return <DoctorDashboardNew />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <DoctorTopNav doctor={MOCK_DOCTOR} notificationCount={5} />

      <div className="flex flex-1 overflow-hidden">
        <DoctorSidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
