import React, { useState } from 'react';
import InsuranceSidebar from '../components/insurancePortal/InsuranceSidebar';
import InsuranceTopBar from '../components/insurancePortal/InsuranceTopBar';
import SlaOverdueBanner from '../components/insurancePortal/SlaOverdueBanner';
import KpiStrip from '../components/insurancePortal/KpiStrip';
import PreAuthQueue from '../components/insurancePortal/PreAuthQueue';
import ClaimsDonut from '../components/insurancePortal/ClaimsDonut';
import RiskIntelligencePanel from '../components/insurancePortal/RiskIntelligencePanel';
import FraudAlertsPanel from '../components/insurancePortal/FraudAlertsPanel';
import NetworkProvidersPanel from '../components/insurancePortal/NetworkProvidersPanel';
import ClaimsTrendChart from '../components/insurancePortal/ClaimsTrendChart';
import QuickActionsStrip from '../components/insurancePortal/QuickActionsStrip';
import { preAuthRequests, fraudAlerts, networkProviders, riskInsights, monthlyClaimsData } from '../data/insurancePortalData';

const InsuranceDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [overdueId] = useState<string | null>(
    preAuthRequests.find(r => r.priority === 'OVERDUE')?.id ?? null
  );
  const [openPaId, setOpenPaId] = useState<string | null>(null);

  const openOverdue = () => {
    setOpenPaId(overdueId);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4F8' }}>
      <InsuranceSidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InsuranceTopBar onReviewOverdue={openOverdue} />

        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <SlaOverdueBanner onReview={openOverdue} />

          <KpiStrip />

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <div className="xl:col-span-3">
              <PreAuthQueue initialOpenPaId={openPaId} />
            </div>

            <div className="xl:col-span-2 space-y-5">
              <ClaimsDonut />
              <RiskIntelligencePanel insights={riskInsights} />
              <FraudAlertsPanel alerts={fraudAlerts} />
              <NetworkProvidersPanel providers={networkProviders} />
            </div>
          </div>

          <ClaimsTrendChart data={monthlyClaimsData} />

          <QuickActionsStrip />
        </main>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
