import React, { useState } from 'react';
import DiagnosticsSidebar from '../components/diagnostics/DiagnosticsSidebar';
import DiagnosticsTopBar, { DeptFilter } from '../components/diagnostics/DiagnosticsTopBar';
import DiagnosticsDashboard from '../components/diagnostics/dashboard/DiagnosticsDashboard';
import MRIPage from '../components/diagnostics/mri/MRIPage';
import CTScanPage from '../components/diagnostics/ct/CTScanPage';
import LabPortalPage from '../components/diagnostics/lab/LabPortalPage';

const DiagnosticsPortal: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deptFilter, setDeptFilter] = useState<DeptFilter>('all');

  const renderPage = () => {
    switch (activePage) {
      case 'mri': return <MRIPage />;
      case 'ct':  return <CTScanPage />;
      case 'lab': return <LabPortalPage />;
      default:    return <DiagnosticsDashboard deptFilter={deptFilter} onNavigate={setActivePage} />;
    }
  };

  if (activePage === 'lab') {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: '#080B12' }}>
        <LabPortalPage onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0F1117' }}>
      <DiagnosticsSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DiagnosticsTopBar deptFilter={deptFilter} onDeptChange={setDeptFilter} activePage={activePage} />
        {renderPage()}
      </div>
    </div>
  );
};

export default DiagnosticsPortal;
