import React, { useState, useCallback } from 'react';
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
import PreAuthPage from '../components/insurancePortal/PreAuthPage';
import ClaimsPage from '../components/insurancePortal/ClaimsPage';
import MembersPage from '../components/insurancePortal/MembersPage';
import FraudDetectionPage from '../components/insurancePortal/FraudDetectionPage';
import RiskAnalyticsPage from '../components/insurancePortal/RiskAnalyticsPage';
import NetworkProvidersPage from '../components/insurancePortal/NetworkProvidersPage';
import ReportsPage from '../components/insurancePortal/ReportsPage';
import InsuranceSettingsPage from '../components/insurancePortal/InsuranceSettingsPage';
import { preAuthRequests, fraudAlerts, networkProviders, riskInsights, monthlyClaimsData } from '../data/insurancePortalData';

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

const InsuranceDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [overdueId] = useState<string | null>(
    preAuthRequests.find(r => r.priority === 'OVERDUE')?.id ?? null
  );
  const [openPaId, setOpenPaId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const openOverdue = () => {
    setOpenPaId(overdueId);
    toast('Opening overdue pre-authorization: PA-20260407-00912', 'warning');
  };

  const navigate = (page: string) => {
    setActivePage(page);
    const labels: Record<string, string> = {
      claims: 'Claims', members: 'Members',
      fraud: 'Fraud Detection', analytics: 'Risk Analytics', network: 'Network Providers',
      reports: 'Reports', settings: 'Settings',
    };
    if (labels[page]) toast(`Navigating to ${labels[page]}`, 'info');
    const paths: Record<string, string> = {
      dashboard: '/insurance/dashboard', preauth: '/insurance/preauth',
      claims: '/insurance/claims', members: '/insurance/members',
      fraud: '/insurance/fraud', analytics: '/insurance/analytics',
      network: '/insurance/network', reports: '/insurance/reports',
      settings: '/insurance/settings',
    };
    if (paths[page]) window.history.pushState({}, '', paths[page]);
  };

  const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
    success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
    warning: { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
    info:    { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
  };

  if (activePage === 'preauth') {
    return <PreAuthPage onNavigate={navigate} />;
  }

  if (activePage === 'claims') {
    return <ClaimsPage onNavigate={navigate} />;
  }

  if (activePage === 'members') {
    return <MembersPage onNavigate={navigate} />;
  }

  if (activePage === 'fraud') {
    return <FraudDetectionPage onNavigate={navigate} />;
  }

  if (activePage === 'analytics') {
    return <RiskAnalyticsPage onNavigate={navigate} />;
  }

  if (activePage === 'network') {
    return <NetworkProvidersPage onNavigate={navigate} />;
  }

  if (activePage === 'reports') {
    return <ReportsPage onNavigate={navigate} />;
  }

  if (activePage === 'settings') {
    return <InsuranceSettingsPage onNavigate={navigate} />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <InsuranceSidebar activePage={activePage} onNavigate={navigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InsuranceTopBar onReviewOverdue={openOverdue} />

        <main className="flex-1 overflow-y-auto" style={{ padding: '20px 24px 32px' }}>
          <SlaOverdueBanner onReview={openOverdue} />

          <div style={{ marginTop: 20 }}>
            <KpiStrip onNavigate={navigate} />
          </div>

          <div className="grid gap-5" style={{ marginTop: 20, gridTemplateColumns: '1fr 380px' }}>
            <div className="flex flex-col gap-5 min-w-0">
              <PreAuthQueue initialOpenPaId={openPaId} />
              <ClaimsTrendChart data={monthlyClaimsData} />
              <NetworkProvidersPanel providers={networkProviders} onNavigate={navigate} />
            </div>

            <div className="flex flex-col gap-5" style={{ width: 380 }}>
              <ClaimsDonut onNavigate={navigate} />
              <FraudAlertsPanel alerts={fraudAlerts} onNavigate={navigate} />
              <RiskIntelligencePanel insights={riskInsights} />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <QuickActionsStrip onNavigate={navigate} />
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.color,
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                pointerEvents: 'auto',
                fontFamily: 'Inter, sans-serif',
              }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsuranceDashboard;
