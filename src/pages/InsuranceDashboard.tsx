import React, { useState } from 'react';
import InsuranceSidebar from '../components/insurancePortal/InsuranceSidebar';
import InsuranceTopBar from '../components/insurancePortal/InsuranceTopBar';
import SlaOverdueBanner from '../components/insurancePortal/SlaOverdueBanner';
import KpiStrip from '../components/insurancePortal/KpiStrip';
import PreAuthQueue from '../components/insurancePortal/PreAuthQueue';
import PreAuthModal from '../components/insurancePortal/PreAuthModal';
import ClaimsDonut from '../components/insurancePortal/ClaimsDonut';
import RiskIntelligencePanel from '../components/insurancePortal/RiskIntelligencePanel';
import FraudAlertsPanel from '../components/insurancePortal/FraudAlertsPanel';
import NetworkProvidersPanel from '../components/insurancePortal/NetworkProvidersPanel';
import ClaimsTrendChart from '../components/insurancePortal/ClaimsTrendChart';
import QuickActionsStrip from '../components/insurancePortal/QuickActionsStrip';
import { preAuthRequests, fraudAlerts, networkProviders, riskInsights, monthlyClaimsData } from '../data/insurancePortalData';
import type { PreAuthRequest } from '../types/insurancePortal';

const InsuranceDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requests, setRequests] = useState(preAuthRequests);
  const [selectedRequest, setSelectedRequest] = useState<PreAuthRequest | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => {
    setApprovedIds(prev => new Set([...prev, id]));
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r));
  };

  const handleDeny = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'DENIED' as const } : r));
  };

  const openOverdue = () => {
    const overdue = requests.find(r => r.priority === 'OVERDUE');
    if (overdue) setSelectedRequest(overdue);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4F8' }}>
      <InsuranceSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InsuranceTopBar onReviewOverdue={openOverdue} />

        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* SLA Overdue Banner */}
          <SlaOverdueBanner onReview={openOverdue} />

          {/* KPI Strip */}
          <KpiStrip />

          {/* Main two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            {/* Left column — 60% (3/5) */}
            <div className="xl:col-span-3">
              <PreAuthQueue
                requests={requests.filter(r => r.status === 'PENDING')}
                onReview={setSelectedRequest}
                onApprove={handleApprove}
                onDeny={handleDeny}
              />
            </div>

            {/* Right column — 40% (2/5) */}
            <div className="xl:col-span-2 space-y-5">
              <ClaimsDonut />
              <RiskIntelligencePanel insights={riskInsights} />
              <FraudAlertsPanel alerts={fraudAlerts} />
              <NetworkProvidersPanel providers={networkProviders} />
            </div>
          </div>

          {/* Full-width trend chart */}
          <ClaimsTrendChart data={monthlyClaimsData} />

          {/* Quick Actions */}
          <QuickActionsStrip />
        </main>
      </div>

      {/* Pre-Auth Modal */}
      {selectedRequest && (
        <PreAuthModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      )}
    </div>
  );
};

export default InsuranceDashboard;
