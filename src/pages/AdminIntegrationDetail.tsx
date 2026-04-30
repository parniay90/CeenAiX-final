import React, { useState } from 'react';
import {
  ArrowLeft, Settings, Activity, RotateCcw, Pause, Play,
  ExternalLink, CheckCircle, XCircle, AlertTriangle, Clock,
  ChevronRight, Eye, EyeOff, Plus, Upload, Download, RefreshCw,
  Shield, Lock, Trash2, AlertCircle, Copy, Check, FileText,
  Zap, Globe, Webhook, Database, BarChart3, TestTube,
  Server, Key, Map,
} from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import {
  INTEGRATIONS,
  MOCK_LOG_EVENTS,
  MOCK_TEST_RESULTS,
  MOCK_CREDENTIALS,
} from '../data/integrationsData';

type DetailTab =
  | 'overview'
  | 'configuration'
  | 'credentials'
  | 'endpoints'
  | 'mappings'
  | 'logs'
  | 'tests'
  | 'compliance'
  | 'permissions'
  | 'danger';

const TABS: { id: DetailTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',       label: 'Overview',            icon: BarChart3   },
  { id: 'configuration',  label: 'Configuration',       icon: Settings    },
  { id: 'credentials',    label: 'Credentials & Secrets', icon: Key       },
  { id: 'endpoints',      label: 'Endpoints & Webhooks',icon: Webhook     },
  { id: 'mappings',       label: 'Mappings & Schemas',  icon: Map         },
  { id: 'logs',           label: 'Logs & Events',       icon: FileText    },
  { id: 'tests',          label: 'Tests',               icon: TestTube    },
  { id: 'compliance',     label: 'Compliance',          icon: Shield      },
  { id: 'permissions',    label: 'Permissions',         icon: Lock        },
  { id: 'danger',         label: 'Danger zone',         icon: AlertCircle },
];

// ─── Health pill ───────────────────────────────────────────────────────────────
function HealthPill({ health }: { health: string }) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    Healthy:  { bg: 'rgba(16,185,129,0.1)',  color: '#34D399', dot: '#34D399' },
    Degraded: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', dot: '#FCD34D' },
    Down:     { bg: 'rgba(239,68,68,0.1)',   color: '#F87171', dot: '#F87171' },
    Unknown:  { bg: 'rgba(100,116,139,0.15)',color: '#94A3B8', dot: '#64748B' },
  };
  const s = map[health] ?? map.Unknown;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: s.bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      <span style={{ fontSize: 11, color: s.color, fontFamily: 'DM Mono, monospace' }}>{health}</span>
    </span>
  );
}

// ─── Uptime bar ───────────────────────────────────────────────────────────────
function UptimeBar({ value }: { value: number }) {
  const color = value >= 99.9 ? '#34D399' : value >= 99 ? '#FCD34D' : '#F87171';
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>Uptime 30d</span>
        <span style={{ fontSize: 10, color, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.5)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Health timeline (7 days) ─────────────────────────────────────────────────
function HealthTimeline() {
  const days = ['Apr 24', 'Apr 25', 'Apr 26', 'Apr 27', 'Apr 28', 'Apr 29', 'Apr 30'];
  const statuses = ['healthy', 'healthy', 'degraded', 'healthy', 'healthy', 'healthy', 'healthy'] as const;
  const colorMap = { healthy: '#34D399', degraded: '#FCD34D', down: '#F87171' };
  return (
    <div>
      <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>Health — last 7 days</div>
      <div className="flex gap-1">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full h-8 rounded" style={{ background: `${colorMap[statuses[i]]}33`, border: `1px solid ${colorMap[statuses[i]]}55` }} title={`${d}: ${statuses[i]}`} />
            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{d.split(' ')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────
function OverviewTab({ integration }: { integration: typeof INTEGRATIONS[0] }) {
  const kpis = [
    { label: 'Uptime 30d', value: `${integration.uptime30d}%`, color: integration.uptime30d >= 99.9 ? '#34D399' : '#FCD34D' },
    { label: 'Latency p50', value: `${integration.latencyP50}ms`, color: '#60A5FA' },
    { label: 'Latency p95', value: `${integration.latencyP95}ms`, color: '#93C5FD' },
    { label: 'Throughput 24h', value: integration.throughput24h, color: '#2DD4BF' },
    { label: 'Error rate 24h', value: integration.errorRate1h, color: integration.errorRate1h === '100%' ? '#F87171' : '#34D399' },
    { label: 'Last sync', value: integration.lastSync, color: '#94A3B8' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
            <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <HealthTimeline />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Events</span>
          <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>last 20</span>
        </div>
        {MOCK_LOG_EVENTS.map(e => (
          <div key={e.id} className="flex items-center gap-3 px-5 py-2.5 transition-colors cursor-pointer" style={{ borderBottom: '1px solid rgba(51,65,85,0.3)' }}
            onMouseEnter={el => { el.currentTarget.style.background = 'rgba(51,65,85,0.2)'; }}
            onMouseLeave={el => { el.currentTarget.style.background = 'transparent'; }}>
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', flexShrink: 0, width: 56 }}>{e.ts}</span>
            <span className="rounded px-1.5 py-0.5 text-xs font-mono flex-shrink-0" style={{ background: e.dir === 'IN' ? 'rgba(59,130,246,0.15)' : 'rgba(13,148,136,0.15)', color: e.dir === 'IN' ? '#60A5FA' : '#2DD4BF', fontSize: 9 }}>{e.dir}</span>
            <span style={{ fontSize: 12, color: '#CBD5E1', flex: 1 }}>{e.event}</span>
            <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: e.status === 'success' ? 'rgba(16,185,129,0.1)' : e.status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: e.status === 'success' ? '#34D399' : e.status === 'error' ? '#F87171' : '#FCD34D', fontFamily: 'DM Mono, monospace' }}>
              {e.status}
            </span>
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{e.latency > 0 ? `${e.latency}ms` : '—'}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Linked Services</div>
        <div className="flex flex-wrap gap-2">
          {['Patient Portal', 'Doctor Portal', 'Pharmacy Portal', 'Insurance Claims', 'Lab & Radiology'].map(s => (
            <span key={s} className="rounded-full px-3 py-1.5" style={{ fontSize: 11, background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontFamily: 'Inter, sans-serif' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfigurationTab() {
  const [baseUrl, setBaseUrl] = useState('https://api.dha.gov.ae/sheryan/v2');
  const [facilityId, setFacilityId] = useState('DHA-FAC-00421');
  const [realtime, setRealtime] = useState(true);
  const [retry, setRetry] = useState(true);
  const [env, setEnv] = useState('Production');
  const [changed, setChanged] = useState(false);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Connection</div>

        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Environment</label>
          <select value={env} onChange={e => { setEnv(e.target.value); setChanged(true); }} className="rounded-xl px-3 py-2.5 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', color: '#CBD5E1', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            <option>Production</option><option>Staging</option><option>Sandbox</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Base URL</label>
          <input value={baseUrl} onChange={e => { setBaseUrl(e.target.value); setChanged(true); }} className="rounded-xl px-3 py-2.5 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', color: '#CBD5E1', fontSize: 13, fontFamily: 'DM Mono, monospace' }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Facility ID</label>
          <input value={facilityId} onChange={e => { setFacilityId(e.target.value); setChanged(true); }} className="rounded-xl px-3 py-2.5 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', color: '#CBD5E1', fontSize: 13, fontFamily: 'DM Mono, monospace' }} />
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Feature Toggles</div>
        {[
          { label: 'Enable real-time push', value: realtime, set: setRealtime },
          { label: 'Enable retry on failure', value: retry, set: setRetry },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{label}</span>
            <div className="w-10 h-5 rounded-full cursor-pointer transition-colors flex items-center" style={{ background: value ? '#0D9488' : 'rgba(51,65,85,0.6)', padding: 3 }} onClick={() => { set((v: boolean) => !v); setChanged(true); }}>
              <div className="w-3.5 h-3.5 rounded-full bg-white transition-transform" style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Retry Policy</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Max attempts', defaultValue: '3' },
            { label: 'Backoff strategy', defaultValue: 'Exponential' },
            { label: 'Dead-letter queue', defaultValue: 'Enabled' },
            { label: 'Grace window', defaultValue: '24 hours' },
          ].map(f => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{f.label}</label>
              <input defaultValue={f.defaultValue} onChange={() => setChanged(true)} className="rounded-xl px-3 py-2 outline-none" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', color: '#CBD5E1', fontSize: 12, fontFamily: 'DM Mono, monospace' }} />
            </div>
          ))}
        </div>
      </div>

      {changed && (
        <div className="sticky bottom-4 flex justify-end">
          <div className="flex items-center gap-3 rounded-2xl px-5 py-3" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.7)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Unsaved changes</span>
            <button onClick={() => setChanged(false)} className="rounded-lg px-3 py-1.5 transition-colors" style={{ fontSize: 12, color: '#94A3B8', background: 'rgba(51,65,85,0.4)' }}>Discard</button>
            <button onClick={() => setChanged(false)} className="rounded-lg px-4 py-1.5 font-semibold transition-colors" style={{ fontSize: 12, background: '#0D9488', color: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0F766E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0D9488'; }}>
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CredentialsTab() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState('');

  const handleCopy = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl px-4 py-2 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.12)'; }}>
          <Plus style={{ width: 13, height: 13 }} />
          Add credential
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.4)', background: 'rgba(15,23,42,0.5)' }}>
              {['Name', 'Type', 'Prefix', 'Created', 'Rotated', 'Expires', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CREDENTIALS.map(cred => {
              const isRevealed = revealed.has(cred.id);
              return (
                <tr key={cred.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}>
                  <td className="px-4 py-3"><span style={{ fontSize: 13, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{cred.name}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{cred.type}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>
                        {isRevealed ? cred.prefix : '••••••••' + cred.prefix.slice(-4)}
                      </span>
                      <button onClick={() => { const n = new Set(revealed); isRevealed ? n.delete(cred.id) : n.add(cred.id); setRevealed(n); }} className="text-slate-600 hover:text-slate-400 transition-colors">
                        {isRevealed ? <EyeOff style={{ width: 11, height: 11 }} /> : <Eye style={{ width: 11, height: 11 }} />}
                      </button>
                      <button onClick={() => handleCopy(cred.id)} className="text-slate-600 hover:text-teal-400 transition-colors">
                        {copied === cred.id ? <Check style={{ width: 11, height: 11, color: '#34D399' }} /> : <Copy style={{ width: 11, height: 11 }} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{cred.created}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{cred.rotated}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 11, color: '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{cred.expires}</span></td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#34D399', fontFamily: 'DM Mono, monospace' }}>Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors" style={{ fontSize: 11, color: '#94A3B8', background: 'rgba(51,65,85,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#CBD5E1'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; }}>
                      <RotateCcw style={{ width: 10, height: 10 }} />
                      Rotate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogsTab() {
  const [live, setLive] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.5)', minWidth: 200 }}>
          <Search style={{ width: 13, height: 13, color: '#475569' }} />
          <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search logs, correlation IDs…" className="bg-transparent outline-none flex-1" style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button onClick={() => setLive(l => !l)} className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: live ? 'rgba(16,185,129,0.1)' : 'rgba(51,65,85,0.3)', color: live ? '#34D399' : '#64748B', border: `1px solid ${live ? 'rgba(16,185,129,0.25)' : 'transparent'}`, fontSize: 12 }}>
          <div className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          Live tail
        </button>
        <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.3)', color: '#64748B', fontSize: 12 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}>
          <Download style={{ width: 13, height: 13 }} />
          Export
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.4)', background: 'rgba(15,23,42,0.5)' }}>
              {['Time', 'Dir', 'Event', 'Status', 'Latency', 'Size', 'Correlation ID', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_LOG_EVENTS.filter(e => !logSearch || e.event.toLowerCase().includes(logSearch.toLowerCase()) || e.corr.includes(logSearch)).map(e => (
              <tr key={e.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(51,65,85,0.25)' }}
                onMouseEnter={el => { el.currentTarget.style.background = 'rgba(30,41,59,0.5)'; }}
                onMouseLeave={el => { el.currentTarget.style.background = 'transparent'; }}>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{e.ts}</span></td>
                <td className="px-4 py-2.5"><span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, background: e.dir === 'IN' ? 'rgba(59,130,246,0.15)' : 'rgba(13,148,136,0.15)', color: e.dir === 'IN' ? '#60A5FA' : '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>{e.dir}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 12, color: '#CBD5E1' }}>{e.event}</span></td>
                <td className="px-4 py-2.5">
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, background: e.status === 'success' ? 'rgba(16,185,129,0.1)' : e.status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: e.status === 'success' ? '#34D399' : e.status === 'error' ? '#F87171' : '#FCD34D', fontFamily: 'DM Mono, monospace' }}>{e.status}</span>
                </td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{e.latency > 0 ? `${e.latency}ms` : '—'}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{e.size}</span></td>
                <td className="px-4 py-2.5"><span style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{e.corr}</span></td>
                <td className="px-4 py-2.5">
                  {e.status === 'error' && (
                    <button className="rounded-lg px-2 py-0.5 transition-colors" style={{ fontSize: 10, background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>Replay</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestsTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(MOCK_TEST_RESULTS);

  const runAll = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
          Last run: <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace' }}>14:28:06 today</span>
        </span>
        <button onClick={runAll} className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-colors" style={{ background: running ? 'rgba(13,148,136,0.15)' : '#0D9488', color: running ? '#2DD4BF' : '#fff', fontSize: 13 }}
          onMouseEnter={e => { if (!running) e.currentTarget.style.background = '#0F766E'; }}
          onMouseLeave={e => { if (!running) e.currentTarget.style.background = '#0D9488'; }}>
          {running ? <><RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />Running…</> : <><TestTube style={{ width: 13, height: 13 }} />Run all tests</>}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {results.map(t => (
          <div key={t.id} className="rounded-2xl px-5 py-4 flex items-center gap-4" style={{ background: '#1E293B', border: `1px solid ${t.status === 'pass' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {t.status === 'pass'
              ? <CheckCircle style={{ width: 18, height: 18, color: '#34D399', flexShrink: 0 }} />
              : <XCircle style={{ width: 18, height: 18, color: '#F87171', flexShrink: 0 }} />
            }
            <div className="flex-1">
              <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{t.ts} · {t.latency > 0 ? `${t.latency}ms` : 'timed out'}</div>
            </div>
            <span className="rounded-full px-2.5 py-1" style={{ fontSize: 10, background: t.status === 'pass' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: t.status === 'pass' ? '#34D399' : '#F87171', fontFamily: 'DM Mono, monospace' }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceTab() {
  const items = [
    { label: 'HIPAA Business Associate Agreement (BAA)', status: 'on-file', expires: '2027-01-01', uploaded: '2025-01-10' },
    { label: 'UAE PDPL Data Processing Agreement', status: 'on-file', expires: '2026-12-31', uploaded: '2025-06-15' },
    { label: 'Vendor SOC 2 Type II Report', status: 'on-file', expires: '2026-11-01', uploaded: '2025-11-02' },
    { label: 'DHA Connection Approval Letter', status: 'on-file', expires: '2026-06-30', uploaded: '2025-07-01' },
    { label: 'ISO 27001 Certificate', status: 'missing', expires: null, uploaded: null },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.label} className="rounded-2xl px-5 py-4 flex items-center gap-4" style={{ background: '#1E293B', border: `1px solid ${item.status === 'on-file' ? 'rgba(51,65,85,0.4)' : 'rgba(245,158,11,0.3)'}` }}>
            {item.status === 'on-file'
              ? <CheckCircle style={{ width: 16, height: 16, color: '#34D399', flexShrink: 0 }} />
              : <AlertTriangle style={{ width: 16, height: 16, color: '#FCD34D', flexShrink: 0 }} />
            }
            <div className="flex-1">
              <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{item.label}</div>
              {item.uploaded && <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Uploaded {item.uploaded} · Expires {item.expires}</div>}
            </div>
            {item.status === 'on-file' ? (
              <button className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors" style={{ fontSize: 11, background: 'rgba(51,65,85,0.3)', color: '#94A3B8' }}>
                <Download style={{ width: 11, height: 11 }} />View
              </button>
            ) : (
              <button className="rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors" style={{ fontSize: 11, background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Upload style={{ width: 11, height: 11 }} />Upload
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12 }}>Risk Classification</div>
        <div className="flex gap-3">
          {['Low', 'Medium', 'High'].map(level => (
            <button key={level} className="flex-1 rounded-xl py-3 text-center font-semibold transition-all" style={{ fontSize: 12, background: level === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(51,65,85,0.2)', color: level === 'High' ? '#F87171' : '#64748B', border: `1px solid ${level === 'High' ? 'rgba(239,68,68,0.3)' : 'rgba(51,65,85,0.3)'}` }}>
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DangerTab({ integration }: { integration: typeof INTEGRATIONS[0] }) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F87171', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Danger Zone</div>
        <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
          Actions in this section are destructive or irreversible. All actions require password re-entry and write detailed audit entries.
        </div>
      </div>

      {[
        { title: 'Pause Integration', desc: 'Immediately stops all inbound and outbound traffic. Reversible — configuration and credentials are preserved.', action: 'Pause', danger: false },
        { title: 'Disable Integration', desc: 'Disables the integration and prevents reactivation without admin approval. Keeps configuration.', action: 'Disable', danger: false },
        { title: 'Reset Credentials', desc: 'Invalidates all current credentials and generates new ones. Grace window applies.', action: 'Reset credentials', danger: true },
      ].map(item => (
        <div key={item.title} className="rounded-2xl p-5 flex items-center justify-between gap-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
          <button className="flex-shrink-0 rounded-xl px-4 py-2 font-semibold transition-colors" style={{ fontSize: 12, background: item.danger ? 'rgba(239,68,68,0.1)' : 'rgba(51,65,85,0.4)', color: item.danger ? '#F87171' : '#94A3B8', border: `1px solid ${item.danger ? 'rgba(239,68,68,0.3)' : 'rgba(51,65,85,0.3)'}` }}>
            {item.action}
          </button>
        </div>
      ))}

      <div className="rounded-2xl p-5 flex items-center justify-between gap-4" style={{ background: '#1E293B', border: '1px solid rgba(239,68,68,0.3)' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F87171', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Remove Integration</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.5 }}>
            {integration.required
              ? 'This integration is required by UAE regulations and cannot be removed. You may only pause it.'
              : 'Permanently removes all configuration, credentials, and history. This action cannot be undone.'
            }
          </div>
        </div>
        {integration.required ? (
          <span className="flex-shrink-0 rounded-xl px-4 py-2" style={{ fontSize: 12, background: 'rgba(51,65,85,0.2)', color: '#475569' }}>Protected</span>
        ) : (
          <button onClick={() => setConfirmRemove(true)} className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold transition-colors" style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Trash2 style={{ width: 13, height: 13 }} />
            Remove
          </button>
        )}
      </div>

      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-4" style={{ background: '#1E293B', border: '1px solid rgba(239,68,68,0.4)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F87171', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Remove Integration</div>
            <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
              You are about to permanently remove <strong style={{ color: '#CBD5E1' }}>{integration.name}</strong>. Type <strong style={{ color: '#F87171', fontFamily: 'DM Mono, monospace' }}>remove</strong> to confirm.
            </div>
            <input className="rounded-xl px-4 py-2.5 outline-none" placeholder="Type &quot;remove&quot; to confirm" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(239,68,68,0.3)', color: '#CBD5E1', fontSize: 13, fontFamily: 'DM Mono, monospace' }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmRemove(false)} className="rounded-xl px-4 py-2" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', fontSize: 12 }}>Cancel</button>
              <button onClick={() => setConfirmRemove(false)} className="rounded-xl px-4 py-2 font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', fontSize: 12 }}>Remove Integration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main detail page ──────────────────────────────────────────────────────────
export default function AdminIntegrationDetail({ integrationId }: { integrationId: string }) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const integration = INTEGRATIONS.find(i => i.id === integrationId) ?? INTEGRATIONS[0];

  const goBack = () => {
    window.history.pushState({}, '', '/admin/integrations');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':       return <OverviewTab integration={integration} />;
      case 'configuration':  return <ConfigurationTab />;
      case 'credentials':    return <CredentialsTab />;
      case 'logs':           return <LogsTab />;
      case 'tests':          return <TestsTab />;
      case 'compliance':     return <ComplianceTab />;
      case 'danger':         return <DangerTab integration={integration} />;
      default:
        return (
          <div className="py-16 text-center" style={{ color: '#475569', fontSize: 13 }}>
            This section is under construction.
          </div>
        );
    }
  };

  return (
    <AdminPageLayout activeSection="integrations">
      <div className="flex flex-col min-h-full" style={{ background: '#0F172A' }}>

        {/* Back + header strip */}
        <div className="sticky top-0 z-30 px-6 py-4 flex flex-col gap-3" style={{ background: '#0F172A', borderBottom: '1px solid rgba(30,41,59,0.8)' }}>
          <button onClick={goBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit" style={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Integrations
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0" style={{ background: `${integration.logoColor}22`, border: `1px solid ${integration.logoColor}44`, color: integration.logoColor, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
              {integration.logoLetter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>{integration.name}</span>
                {integration.required && <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(13,148,136,0.15)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>Required</span>}
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }}>{integration.environment}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{integration.vendor}</div>
            </div>
            <HealthPill health={integration.health} />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(13,148,136,0.12)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.2)', fontSize: 12 }}>
                <Activity style={{ width: 12, height: 12 }} />
                Test
              </button>
              <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', fontSize: 12 }}>
                <Pause style={{ width: 12, height: 12 }} />
                Pause
              </button>
              <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', fontSize: 12 }}>
                <ExternalLink style={{ width: 12, height: 12 }} />
                Docs
              </button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(13,148,136,0.2)', color: '#2DD4BF', fontSize: 9 }}>{integration.ownerInitials}</div>
                <span style={{ fontSize: 11, color: '#64748B' }}>{integration.owner}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sub-nav */}
          <nav className="flex-shrink-0 py-4 flex flex-col" style={{ width: 200, background: 'rgba(10,22,40,0.5)', borderRight: '1px solid rgba(30,41,59,0.6)' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === 'danger';
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2.5 px-5 py-2.5 transition-all text-left"
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                    color: isDanger ? (isActive ? '#F87171' : '#64748B') : isActive ? '#2DD4BF' : '#64748B',
                    background: isActive ? (isDanger ? 'rgba(239,68,68,0.08)' : 'rgba(13,148,136,0.1)') : 'transparent',
                    borderLeft: `3px solid ${isActive ? (isDanger ? '#EF4444' : '#0D9488') : 'transparent'}`,
                    fontWeight: isActive ? 600 : 400,
                    marginTop: isDanger ? 8 : 0,
                    borderTop: isDanger ? '1px solid rgba(30,41,59,0.6)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderTab()}
          </main>
        </div>
      </div>
    </AdminPageLayout>
  );
}

// Re-export type for Search declaration
function Search({ ...props }: React.SVGProps<SVGSVGElement> & { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
