import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import { systemServices, integrations } from '../data/superAdminData';

type ServiceStatus = 'Operational' | 'Degraded' | 'Partial outage' | 'Major outage';

interface Service {
  name: string;
  status: ServiceStatus;
  latency: string;
  errorRate: string;
  sparkline: number[];
}

function buildSparkline() {
  return Array.from({ length: 12 }, () => Math.random() * 40 + 60);
}

const CORE_SERVICES: Service[] = [
  { name: 'Authentication & Identity', status: 'Operational', latency: '45ms / 89ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Patient Portal API', status: 'Operational', latency: '124ms / 210ms', errorRate: '0.01%', sparkline: buildSparkline() },
  { name: 'Doctor Portal API', status: 'Operational', latency: '89ms / 145ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Pharmacy Portal API', status: 'Operational', latency: '112ms / 180ms', errorRate: '0.02%', sparkline: buildSparkline() },
  { name: 'Insurance Portal API', status: 'Degraded', latency: '3200ms / 5100ms', errorRate: '2.40%', sparkline: buildSparkline() },
  { name: 'Super Admin API', status: 'Operational', latency: '67ms / 98ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Database (Primary)', status: 'Operational', latency: '24ms / 41ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Database (Replica)', status: 'Operational', latency: '28ms / 48ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'File Storage / CDN', status: 'Operational', latency: '98ms / 160ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Background Jobs (14)', status: 'Operational', latency: 'N/A', errorRate: '0.00%', sparkline: buildSparkline() },
];

const INTEGRATIONS_SVC: Service[] = [
  { name: 'DHA / NABIDH Gateway', status: 'Operational', latency: '340ms / 600ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'FHIR R4 Endpoint', status: 'Operational', latency: '180ms / 320ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'HL7 Message Bus', status: 'Operational', latency: '95ms / 140ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Payment Gateway', status: 'Operational', latency: '210ms / 380ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Email Provider', status: 'Operational', latency: '320ms / 500ms', errorRate: '0.01%', sparkline: buildSparkline() },
  { name: 'SMS Provider', status: 'Operational', latency: '445ms / 700ms', errorRate: '0.00%', sparkline: buildSparkline() },
  { name: 'Push Notification Service', status: 'Operational', latency: '156ms / 220ms', errorRate: '0.00%', sparkline: buildSparkline() },
];

const STATUS_COLORS: Record<ServiceStatus, string> = {
  Operational: '#10B981', Degraded: '#F59E0B', 'Partial outage': '#F97316', 'Major outage': '#EF4444',
};

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 60, H = 20;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min + 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline fill="none" stroke="#0D9488" strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function ServiceRow({ svc }: { svc: Service }) {
  const color = STATUS_COLORS[svc.status];
  return (
    <div className="grid items-center px-5 py-3 border-b transition-colors" style={{ gridTemplateColumns: '1fr 120px 130px 80px 70px', borderColor: 'rgba(51,65,85,0.3)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ fontSize: 13, color: '#CBD5E1' }}>{svc.name}</span>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit" style={{ background: `${color}22`, color }}>{svc.status}</span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>{svc.latency}</span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: svc.errorRate === '0.00%' ? '#475569' : '#F59E0B' }}>{svc.errorRate}</span>
      <Sparkline data={svc.sparkline} />
    </div>
  );
}

function ServiceGroup({ title, services }: { title: string; services: Service[] }) {
  const hasIssue = services.some(s => s.status !== 'Operational');
  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#1E293B', border: `1px solid ${hasIssue ? 'rgba(245,158,11,0.3)' : 'rgba(51,65,85,0.6)'}` }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
        <h3 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>{title}</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: hasIssue ? '#F59E0B' : '#10B981' }} />
          <span style={{ fontSize: 11, color: hasIssue ? '#FCD34D' : '#34D399' }}>{hasIssue ? 'Degraded' : 'Operational'}</span>
        </div>
      </div>
      <div className="grid border-b px-5 py-2" style={{ gridTemplateColumns: '1fr 120px 130px 80px 70px', borderColor: 'rgba(51,65,85,0.4)' }}>
        {['Service', 'Status', 'p50 / p95', 'Error Rate', 'Last 6h'].map(h => (
          <div key={h} style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
        ))}
      </div>
      {services.map(svc => <ServiceRow key={svc.name} svc={svc} />)}
    </div>
  );
}

export default function AdminSystemStatus() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => { setLastUpdated(new Date()); forceUpdate(n => n + 1); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const allServices = [...CORE_SERVICES, ...INTEGRATIONS_SVC];
  const degraded = allServices.filter(s => s.status !== 'Operational').length;
  const overallStatus = degraded === 0 ? 'Operational' : degraded < 3 ? 'Degraded' : 'Partial outage';
  const overallColor = STATUS_COLORS[overallStatus as ServiceStatus];

  return (
    <AdminPageLayout activeSection="system">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>System Status</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Live health of CeenAiX services and external integrations.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5" style={{ background: `${overallColor}22`, color: overallColor, border: `1px solid ${overallColor}44` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: overallColor }} />
              {overallStatus}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>Live · {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <button onClick={() => setLastUpdated(new Date())} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: CheckCircle, label: '90-Day Uptime', value: '99.94%', color: '#10B981' },
            { icon: Zap, label: 'Avg Response Time', value: '124ms', color: '#5EEAD4' },
            { icon: AlertTriangle, label: 'Active Incidents', value: degraded.toString(), color: degraded > 0 ? '#F59E0B' : '#10B981' },
            { icon: Clock, label: 'Maintenance Windows', value: '1 upcoming', color: '#0891B2' },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl px-4 py-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <kpi.icon className="w-5 h-5 mb-2" style={{ color: kpi.color }} />
              <div className="font-bold text-white mb-0.5" style={{ fontSize: 20 }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {degraded > 0 && (
          <div className="rounded-2xl p-4 mb-5 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <div>
              <div className="font-semibold mb-1" style={{ fontSize: 13, color: '#FCD34D' }}>Active Incident: Daman Insurance API</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Insurance Portal API experiencing elevated latency (3.2s). Investigation in progress. Started 45 minutes ago.</div>
            </div>
          </div>
        )}

        <ServiceGroup title="Core Platform" services={CORE_SERVICES} />
        <ServiceGroup title="Integrations" services={INTEGRATIONS_SVC} />

        {/* Scheduled Maintenance */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
            <h3 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}>Scheduled Maintenance</h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)' }}>
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0891B2' }} />
              <div>
                <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>Database Maintenance Window</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>May 5, 2026 · 02:00–04:00 GST · Expected impact: &lt;2min downtime on replica reads</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
