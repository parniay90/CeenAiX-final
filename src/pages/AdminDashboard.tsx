import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import HeroMetrics from '../components/admin/HeroMetrics';
import UAEMap from '../components/admin/UAEMap';
import ActivityFeed from '../components/admin/ActivityFeed';
import AIMetricsPanel from '../components/admin/AIMetricsPanel';
import SystemHealthPanel from '../components/admin/SystemHealthPanel';
import CompliancePanel from '../components/admin/CompliancePanel';
import PortalStatus from '../components/admin/PortalStatus';
import RevenueChart from '../components/admin/RevenueChart';
import QuickActions from '../components/admin/QuickActions';
import { AlertTriangle, X, AlertCircle } from 'lucide-react';
import { alerts } from '../data/superAdminData';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#0F172A' }}>
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <AdminTopBar />

        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>

          {visibleAlerts.length > 0 && (
            <div className="flex flex-col gap-2 mb-5">
              {visibleAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                  style={{
                    background: alert.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                    border: `1px solid ${alert.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                  }}
                >
                  {alert.type === 'error' ? (
                    <AlertCircle style={{ width: 14, height: 14, color: '#F87171', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle style={{ width: 14, height: 14, color: '#FCD34D', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 12, color: alert.type === 'error' ? '#F87171' : '#FCD34D', flex: 1 }}>
                    {alert.message}
                  </span>
                  <button
                    className="rounded-lg px-2.5 py-1 transition-colors"
                    style={{
                      fontSize: 11,
                      color: alert.type === 'error' ? '#F87171' : '#FCD34D',
                      background: alert.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${alert.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}
                  >
                    {alert.action}
                  </button>
                  <button
                    onClick={() => setDismissedAlerts(prev => new Set([...prev, alert.id]))}
                    className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                  >
                    <X style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <HeroMetrics />

          {/* Quick actions bar — compact single row */}
          <div className="mb-5">
            <QuickActions />
          </div>

          {/* Main grid — 12 cols, auto rows */}
          <div className="grid grid-cols-12 gap-5">

            {/* Row 1: UAEMap | ActivityFeed | PortalStatus */}
            <div className="col-span-5 row-start-1"><UAEMap /></div>
            <div className="col-span-4 row-start-1"><ActivityFeed /></div>
            <div className="col-span-3 row-start-1 row-span-2 flex flex-col gap-5">
              <PortalStatus />
              <CompliancePanel />
            </div>

            {/* Row 2: RevenueChart | SystemHealthPanel (col C spans both rows) */}
            <div className="col-span-5 row-start-2 flex"><RevenueChart /></div>
            <div className="col-span-4 row-start-2 flex"><SystemHealthPanel /></div>

            {/* Row 3: AI Analytics under col A+B only (9 cols) */}
            <div className="col-span-9 row-start-3">
              <AIMetricsPanel />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
