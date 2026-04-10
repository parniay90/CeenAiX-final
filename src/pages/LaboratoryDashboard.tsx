import { useState } from 'react';
import LabSidebar from '../components/laboratory/LabSidebar';
import KPIRow from '../components/laboratory/KPIRow';
import SampleQueue from '../components/laboratory/SampleQueue';
import CriticalValuesPanel from '../components/laboratory/CriticalValuesPanel';
import EquipmentStatus from '../components/laboratory/EquipmentStatus';
import TATMonitor from '../components/laboratory/TATMonitor';
import UserMenu from '../components/common/UserMenu';
import {
  MOCK_SAMPLES,
  MOCK_CRITICAL_VALUES,
  MOCK_EQUIPMENT,
  MOCK_TAT_METRICS,
  MOCK_STATS,
  Sample,
} from '../types/laboratory';

export default function LaboratoryDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [criticalValues, setCriticalValues] = useState(MOCK_CRITICAL_VALUES);

  const handleSampleClick = (sample: Sample) => {
    console.log('Sample clicked:', sample);
  };

  const handleMarkNotified = (id: string) => {
    setCriticalValues((prev) => prev.filter((cv) => cv.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <LabSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-6 border-b border-teal-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Laboratory Dashboard</h1>
              <p className="text-teal-100 text-sm font-semibold">
                DHA-Licensed Laboratory • Real-time Monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div className="text-xs text-teal-100 uppercase font-bold">Today's Date</div>
                <div className="text-white font-bold">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <UserMenu
                userName="Dr. Fatima Al Zaabi"
                userRole="Laboratory Director"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <KPIRow stats={MOCK_STATS} />

          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <SampleQueue samples={MOCK_SAMPLES} onSampleClick={handleSampleClick} />
            </div>

            <div className="col-span-5 space-y-6">
              <CriticalValuesPanel
                criticalValues={criticalValues}
                onMarkNotified={handleMarkNotified}
              />

              <EquipmentStatus equipment={MOCK_EQUIPMENT} />

              <TATMonitor metrics={MOCK_TAT_METRICS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
