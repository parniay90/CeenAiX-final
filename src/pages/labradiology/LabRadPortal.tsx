import { useState, useEffect } from 'react';
import LabRadSidebar from './LabRadSidebar';
import LabRadTopBar from './LabRadTopBar';
import LabRadDashboard from './pages/LabRadDashboard';
import LabQueue from './pages/LabQueue';
import LabOrders from './pages/LabOrders';
import LabResults from './pages/LabResults';
import QualityControl from './pages/QualityControl';
import ImagingQueue from './pages/ImagingQueue';
import ImagingOrders from './pages/ImagingOrders';
import RadiologyReports from './pages/RadiologyReports';
import ImagingEquipment from './pages/ImagingEquipment';
import LabEquipment from './pages/LabEquipment';
import NabidhSync from './pages/NabidhSync';
import LabAnalytics from './pages/LabAnalytics';
import LabProfile from './pages/LabProfile';
import LabSettings from './pages/LabSettings';
import type { LabPage } from './types';

const pageTitles: Record<LabPage, string> = {
  dashboard: 'Dashboard',
  queue: 'Lab Sample Queue',
  orders: 'Lab Orders',
  results: 'Lab Results & Verification',
  qc: 'Quality Control',
  'imaging-queue': 'Imaging Queue',
  'imaging-orders': 'Imaging Orders',
  'imaging-reports': 'Radiology Reports',
  'imaging-equipment': 'Radiology Equipment',
  equipment: 'Lab Equipment & Analyzers',
  nabidh: 'NABIDH Submission Centre',
  analytics: 'Analytics & Reports',
  profile: 'Lab & Radiology Profile',
  settings: 'Settings',
};

function getInitialPage(): LabPage {
  const path = window.location.pathname;
  if (path === '/lab/queue') return 'queue';
  if (path === '/lab/orders') return 'orders';
  if (path === '/lab/results') return 'results';
  if (path === '/lab/qc') return 'qc';
  if (path === '/lab/imaging/queue') return 'imaging-queue';
  if (path === '/lab/imaging/orders') return 'imaging-orders';
  if (path === '/lab/imaging/reports') return 'imaging-reports';
  if (path === '/lab/imaging/equipment') return 'imaging-equipment';
  if (path === '/lab/equipment') return 'equipment';
  if (path === '/lab/nabidh') return 'nabidh';
  if (path === '/lab/analytics') return 'analytics';
  if (path === '/lab/profile') return 'profile';
  if (path === '/lab/settings') return 'settings';
  return 'dashboard';
}

export default function LabRadPortal() {
  const [page, setPage] = useState<LabPage>(getInitialPage);

  function navigate(p: LabPage) {
    setPage(p);
    const pathMap: Record<LabPage, string> = {
      dashboard: '/lab/dashboard',
      queue: '/lab/queue',
      orders: '/lab/orders',
      results: '/lab/results',
      qc: '/lab/qc',
      'imaging-queue': '/lab/imaging/queue',
      'imaging-orders': '/lab/imaging/orders',
      'imaging-reports': '/lab/imaging/reports',
      'imaging-equipment': '/lab/imaging/equipment',
      equipment: '/lab/equipment',
      nabidh: '/lab/nabidh',
      analytics: '/lab/analytics',
      profile: '/lab/profile',
      settings: '/lab/settings',
    };
    window.history.pushState({}, '', pathMap[p]);
  }

  useEffect(() => {
    function onPop() {
      setPage(getInitialPage());
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showDeptToggle = page === 'dashboard' || page === 'queue' || page === 'imaging-queue';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <LabRadSidebar activePage={page} onNavigate={navigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <LabRadTopBar title={pageTitles[page]} showDeptToggle={showDeptToggle} />

        <main className="flex-1 overflow-hidden">
          {page === 'dashboard' && <div className="h-full overflow-y-auto"><LabRadDashboard onNavigate={navigate} /></div>}
          {page === 'queue' && <LabQueue />}
          {page === 'orders' && <LabOrders />}
          {page === 'results' && <LabResults />}
          {page === 'qc' && <QualityControl />}
          {page === 'imaging-queue' && <ImagingQueue />}
          {page === 'imaging-orders' && <ImagingOrders />}
          {page === 'imaging-reports' && <RadiologyReports />}
          {page === 'imaging-equipment' && <ImagingEquipment />}
          {page === 'equipment' && <LabEquipment />}
          {page === 'nabidh' && <NabidhSync />}
          {page === 'analytics' && <LabAnalytics />}
          {page === 'profile' && <LabProfile />}
          {page === 'settings' && <LabSettings />}
        </main>
      </div>
    </div>
  );
}
