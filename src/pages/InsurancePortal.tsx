import { useState } from 'react';
import { Shield, Bell } from 'lucide-react';
import InsuranceSidebar from '../components/insurance/InsuranceSidebar';
import KPIStatsRow from '../components/insurance/KPIStatsRow';
import PreAuthQueue from '../components/insurance/PreAuthQueue';
import AIRiskInsights from '../components/insurance/AIRiskInsights';
import ClaimsStatusBreakdown from '../components/insurance/ClaimsStatusBreakdown';
import NetworkProviderPerformance from '../components/insurance/NetworkProviderPerformance';
import UserMenu from '../components/common/UserMenu';

export default function InsurancePortal() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <InsuranceSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-900 to-teal-900 border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Insurance Partner Portal</h1>
                <div className="text-sm text-blue-200">Daman Insurance - Claims & Authorization Management</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></div>
              </button>
              <UserMenu
                userName="Sarah Al-Mansoori"
                userRole="Claims Manager"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="space-y-6">
            <KPIStatsRow />

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <PreAuthQueue />
              </div>

              <div className="space-y-6">
                <AIRiskInsights />
                <ClaimsStatusBreakdown />
                <NetworkProviderPerformance />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
