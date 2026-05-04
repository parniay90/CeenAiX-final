import { useState } from 'react';
import { Search, ChevronRight, Circle, Triangle, Square, Activity, BarChart2, AlertCircle, GitBranch, Terminal, Layers, Bell, Settings } from 'lucide-react';
import { SERVICES } from '../mockData';
import type { Service, ServiceStatus } from '../types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_CONFIG: Record<ServiceStatus, { color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  'Operational': { color: '#10B981', icon: Circle },
  'Degraded': { color: '#F59E0B', icon: Triangle },
  'Partial outage': { color: '#F97316', icon: Triangle },
  'Major outage': { color: '#EF4444', icon: Square },
};

const CAT_LABELS = { portal: 'Portal', api: 'Core API', integration: 'Integration', infrastructure: 'Infrastructure' };

type SubTab = 'health' | 'performance' | 'errors' | 'dependencies' | 'deploys' | 'alerts';
const SUB_TABS: { id: SubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'performance', label: 'Performance', icon: BarChart2 },
  { id: 'errors', label: 'Errors', icon: AlertCircle },
  { id: 'dependencies', label: 'Dependencies', icon: GitBranch },
  { id: 'deploys', label: 'Deploys', icon: Layers },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

function perfData() {
  return Array.from({ length: 24 }, (_, i) => ({
    h: `${String(i).padStart(2, '0')}:00`,
    p50: Math.round(100 + Math.sin(i / 4) * 30 + Math.random() * 20),
    p95: Math.round(160 + Math.sin(i / 4) * 50 + Math.random() * 30),
  }));
}

function ServiceDetailPanel({ svc }: { svc: Service }) {
  const [subTab, setSubTab] = useState<SubTab>('health');
  const cfg = STATUS_CONFIG[svc.status];
  const data = perfData();

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white" style={{ fontSize: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{svc.name}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#0D9488', background: 'rgba(13,148,136,0.1)', padding: '2px 6px', borderRadius: 4 }}>{svc.version}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>Production</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>{svc.status}</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748B' }}>Owner: {svc.owner}</span>
              <span style={{ fontSize: 11, color: '#64748B' }}>Uptime 24h: <span style={{ fontFamily: 'DM Mono, monospace', color: '#10B981' }}>{svc.uptime24h}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {['Runbook', 'Health check', 'Page on-call'].map(action => (
              <button key={action} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-slate-700/50" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8', border: '1px solid rgba(51,65,85,0.6)' }}>{action}</button>
            ))}
            {svc.status !== 'Operational' && (
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>Restart</button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b px-5 overflow-x-auto" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
        {SUB_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)} className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px flex-shrink-0" style={{ color: subTab === t.id ? '#0D9488' : '#64748B', borderBottomColor: subTab === t.id ? '#0D9488' : 'transparent' }}>
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      <div className="p-5">
        {subTab === 'health' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Uptime (24h)', value: svc.uptime24h, color: '#10B981' },
                { label: 'p95 Latency', value: svc.latencyP95, color: '#0D9488' },
                { label: 'Error Rate', value: svc.errorRate, color: parseFloat(svc.errorRate) > 0.1 ? '#F59E0B' : '#10B981' },
                { label: 'p50 Latency', value: svc.latencyP50, color: '#0D9488' },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, color: m.color, fontWeight: 700 }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12, fontWeight: 600 }}>Status Timeline (24h)</div>
              <div className="flex gap-0.5 h-6">
                {Array.from({ length: 96 }, (_, i) => {
                  const isIssue = svc.id === 'insurance-portal' && i >= 52 && i <= 58;
                  return <div key={i} className="flex-1 rounded-sm" style={{ background: isIssue ? '#F59E0B' : '#10B981' }} title={isIssue ? 'Degraded' : 'Operational'} />;
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#374151' }}>24h ago</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#374151' }}>Now</span>
              </div>
            </div>
          </div>
        )}
        {subTab === 'performance' && (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12, fontWeight: 600 }}>Latency p50 / p95 (24h)</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={data}>
                  <XAxis dataKey="h" tick={{ fontSize: 9, fill: '#475569', fontFamily: 'DM Mono, monospace' }} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} unit="ms" />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="p50" stroke="#10B981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 600 }}>Slowest Endpoints</div>
              <div className="divide-y" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
                {[
                  { path: 'POST /api/claims/submit', p95: '4800ms', vol: '2.1k/h' },
                  { path: 'GET /api/insurance/coverage', p95: '3200ms', vol: '8.4k/h' },
                  { path: 'POST /api/preauth/request', p95: '2900ms', vol: '1.3k/h' },
                  { path: 'GET /api/patient/summary', p95: '890ms', vol: '12k/h' },
                  { path: 'GET /api/appointments/list', p95: '420ms', vol: '18k/h' },
                ].map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-2 gap-3">
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#CBD5E1' }}>{e.path}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#F59E0B' }}>{e.p95}</span>
                      <span style={{ fontSize: 10, color: '#475569' }}>{e.vol}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(subTab === 'errors' || subTab === 'dependencies' || subTab === 'deploys' || subTab === 'alerts') && (
          <div className="flex items-center justify-center py-16" style={{ color: '#475569', fontSize: 13 }}>
            <div className="text-center">
              <Terminal className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <div>Detailed {subTab} view — connected to monitoring pipeline</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesTab() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Service>(SERVICES[0]);

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="flex" style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}>
      {/* Left rail */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
        {/* Filters */}
        <div className="p-3 border-b flex flex-col gap-2" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…" className="w-full pl-8 pr-3 py-2 rounded-lg outline-none text-xs" style={{ background: 'rgba(51,65,85,0.4)', color: '#CBD5E1', border: '1px solid rgba(51,65,85,0.6)' }} />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'portal', 'api', 'integration', 'infrastructure'] as const).map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className="px-2 py-1 rounded-md text-[9px] font-semibold capitalize" style={{ background: categoryFilter === c ? 'rgba(13,148,136,0.2)' : 'rgba(51,65,85,0.4)', color: categoryFilter === c ? '#0D9488' : '#64748B' }}>{c === 'all' ? 'All' : CAT_LABELS[c]}</button>
            ))}
          </div>
        </div>
        {/* Service list */}
        <div className="flex-1 overflow-auto">
          {filtered.map(svc => {
            const cfg = STATUS_CONFIG[svc.status];
            const StatusIcon = cfg.icon;
            return (
              <button key={svc.id} onClick={() => setSelected(svc)} className="w-full px-3 py-2.5 text-left border-b transition-colors flex items-center gap-2.5" style={{ borderColor: 'rgba(51,65,85,0.3)', background: selected.id === svc.id ? 'rgba(13,148,136,0.08)' : 'transparent' }}>
                <StatusIcon className="w-3 h-3 flex-shrink-0" style={{ color: cfg.color, fill: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 12, color: '#CBD5E1', fontWeight: selected.id === svc.id ? 600 : 400 }}>{svc.name}</div>
                  <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{svc.latencyP95} p95 · {svc.errorRate} err</div>
                </div>
                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: selected.id === svc.id ? '#0D9488' : '#374151' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <ServiceDetailPanel svc={selected} />
    </div>
  );
}
