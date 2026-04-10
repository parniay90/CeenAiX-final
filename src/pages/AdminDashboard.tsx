import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import HeroMetrics from '../components/admin/HeroMetrics';
import UAEMap from '../components/admin/UAEMap';
import ActivityFeed from '../components/admin/ActivityFeed';
import AIMetricsPanel from '../components/admin/AIMetricsPanel';
import SystemHealthPanel from '../components/admin/SystemHealthPanel';
import CompliancePanel from '../components/admin/CompliancePanel';
import { MOCK_ADMIN_DASHBOARD } from '../types/admin';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const data = MOCK_ADMIN_DASHBOARD;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <AdminTopBar />

        <div className="flex-1 overflow-y-auto p-6">
          <HeroMetrics metrics={data.heroMetrics} />

          <UAEMap organizations={data.organizations} />

          <div className="grid grid-cols-3 gap-6 mb-6">
            <ActivityFeed events={data.recentActivity} />
            <AIMetricsPanel metrics={data.aiMetrics} />
            <SystemHealthPanel
              services={data.systemHealth.services}
              apiResponseTime={data.systemHealth.apiResponseTime}
              errorRate={data.systemHealth.errorRate}
              activeSessions={data.systemHealth.activeSessions}
            />
          </div>

          <CompliancePanel metrics={data.compliance} />
        </div>
      </div>
    </div>
  );
}
