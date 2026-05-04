import { useState } from 'react';
import { Database, Cpu, HardDrive, Globe, Layers, Brain, Shield, ChevronDown, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  content: React.ReactNode;
}

function ProgressBar({ pct, warning = 70, critical = 85 }: { pct: number; warning?: number; critical?: number }) {
  const color = pct >= critical ? '#EF4444' : pct >= warning ? '#F59E0B' : '#10B981';
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(51,65,85,0.5)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MetricRow({ label, value, extra, warning }: { label: string; value: string; extra?: string; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
      <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
      <div className="text-right">
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: warning ? '#F59E0B' : '#CBD5E1' }}>{value}</span>
        {extra && <div style={{ fontSize: 10, color: '#475569' }}>{extra}</div>}
      </div>
    </div>
  );
}

const DatabaseSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { name: 'Primary (PostgreSQL 15.4)', lag: '—', conns: '340/500', slow: 2, disk: 36, backup: '5h ago · 2m 8s' },
      { name: 'Replica 1 (PostgreSQL 15.4)', lag: '12ms', conns: '180/500', slow: 0, disk: 36, backup: '5h ago · 2m 12s' },
      { name: 'Replica 2 (PostgreSQL 15.4)', lag: '18ms', conns: '120/500', slow: 0, disk: 36, backup: '5h ago · 2m 15s' },
    ].map(db => (
      <div key={db.name} className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 600 }}>{db.name}</span>
          <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
        </div>
        <MetricRow label="Replication lag" value={db.lag} />
        <MetricRow label="Connections" value={db.conns} warning={db.conns.startsWith('34')} />
        <MetricRow label="Slow queries (5m)" value={String(db.slow)} />
        <MetricRow label="Last backup" value={db.backup} />
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 10, color: '#64748B' }}>Disk usage</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8' }}>{db.disk}%</span>
          </div>
          <ProgressBar pct={db.disk} />
        </div>
      </div>
    ))}
  </div>
);

const CacheSection = () => (
  <div className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {[
        { label: 'Hit Rate', value: '97.4%', color: '#10B981' },
        { label: 'Memory Used', value: '12.4 / 32 GB', color: '#CBD5E1' },
        { label: 'Evictions (5m)', value: '0', color: '#10B981' },
        { label: 'Avg Latency', value: '2ms', color: '#10B981' },
      ].map(m => (
        <div key={m.label}>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{m.label}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: m.color, fontWeight: 700 }}>{m.value}</div>
        </div>
      ))}
    </div>
    <ProgressBar pct={38} />
    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>38% capacity used</div>
  </div>
);

const QueuesSection = () => (
  <div className="space-y-3">
    {[
      { name: 'NABIDH Submissions', depth: 142, oldest: '4m 12s', throughput: '340 in / 338 out', consumers: 4, dlq: 0 },
      { name: 'Email Notifications', depth: 28, oldest: '0m 45s', throughput: '1.5k in / 1.5k out', consumers: 8, dlq: 2 },
      { name: 'Clinical Record Sync', depth: 0, oldest: '—', throughput: '0 in / 0 out', consumers: 2, dlq: 0 },
      { name: 'Report Generation', depth: 6, oldest: '1m 20s', throughput: '12 in / 12 out', consumers: 1, dlq: 1 },
    ].map(q => {
      const ageMin = parseInt(q.oldest);
      const ageColor = ageMin >= 15 ? '#EF4444' : ageMin >= 5 ? '#F59E0B' : '#10B981';
      return (
        <div key={q.name} className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 600 }}>{q.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>Healthy</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            <div><div style={{ fontSize: 9, color: '#475569' }}>Depth</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#CBD5E1' }}>{q.depth}</div></div>
            <div><div style={{ fontSize: 9, color: '#475569' }}>Oldest</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: ageColor }}>{q.oldest}</div></div>
            <div><div style={{ fontSize: 9, color: '#475569' }}>Throughput</div><div style={{ fontSize: 10, color: '#94A3B8' }}>{q.throughput}</div></div>
            <div><div style={{ fontSize: 9, color: '#475569' }}>Consumers</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#CBD5E1' }}>{q.consumers}</div></div>
            <div><div style={{ fontSize: 9, color: '#475569' }}>DLQ</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: q.dlq > 0 ? '#F59E0B' : '#10B981' }}>{q.dlq}</div></div>
          </div>
        </div>
      );
    })}
  </div>
);

const AISection = () => (
  <div className="space-y-3">
    {[
      { name: 'Anthropic (Claude)', latency: '1.2s', tokens: '2.4M', errRate: '0.00%', rateLimit: '62%', status: 'Operational' },
      { name: 'Azure OpenAI (GPT-4o)', latency: '1.8s', tokens: '840k', errRate: '0.00%', rateLimit: '28%', status: 'Operational' },
      { name: 'Speech-to-Text', latency: '320ms', tokens: '—', errRate: '0.02%', rateLimit: '15%', status: 'Operational' },
      { name: 'OCR Service', latency: '890ms', tokens: '—', errRate: '0.01%', rateLimit: '8%', status: 'Operational' },
    ].map(ai => (
      <div key={ai.name} className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 600 }}>{ai.name}</span>
          <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div><div style={{ fontSize: 9, color: '#475569' }}>Avg Latency</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#CBD5E1' }}>{ai.latency}</div></div>
          <div><div style={{ fontSize: 9, color: '#475569' }}>Tokens Used</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#0D9488' }}>{ai.tokens}</div></div>
          <div><div style={{ fontSize: 9, color: '#475569' }}>Error Rate</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#10B981' }}>{ai.errRate}</div></div>
          <div>
            <div style={{ fontSize: 9, color: '#475569', marginBottom: 4 }}>Rate Limit {ai.rateLimit}</div>
            <ProgressBar pct={parseInt(ai.rateLimit)} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BackupDRSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
      <div className="font-semibold mb-3" style={{ fontSize: 12, color: '#CBD5E1' }}>Backup Status</div>
      {[
        { store: 'db-primary', last: '2026-05-04 06:00 GST', size: '2.1 GB', duration: '4m 12s', status: 'OK' },
        { store: 'db-replica-1', last: '2026-05-04 06:02 GST', size: '2.1 GB', duration: '4m 15s', status: 'OK' },
        { store: 'object-storage', last: '2026-05-04 02:00 GST', size: '4.2 TB', duration: '38m', status: 'OK' },
      ].map(b => (
        <div key={b.store} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
          <div>
            <div style={{ fontSize: 11, color: '#CBD5E1' }}>{b.store}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#475569' }}>{b.last}</div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: 10, color: '#94A3B8' }}>{b.size} · {b.duration}</div>
            <CheckCircle className="w-3 h-3 mt-0.5 ml-auto" style={{ color: '#10B981' }} />
          </div>
        </div>
      ))}
    </div>
    <div className="rounded-xl p-4" style={{ background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)' }}>
      <div className="font-semibold mb-3" style={{ fontSize: 12, color: '#CBD5E1' }}>DR Readiness</div>
      {[
        { label: 'RTO Target vs Measured', target: '4h', measured: '2h 18m', status: 'Met' },
        { label: 'RPO Target vs Measured', target: '1h', measured: '4m', status: 'Met' },
        { label: 'Last DR Drill', target: '2026-03-15', measured: '—', status: 'OK' },
      ].map(d => (
        <div key={d.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{d.label}</span>
          <div className="text-right">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#CBD5E1' }}>{d.measured}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>{d.status}</span>
          </div>
        </div>
      ))}
      <button className="mt-3 w-full py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', border: '1px solid rgba(51,65,85,0.6)' }}>Trigger backup verification</button>
    </div>
  </div>
);

export default function InfrastructureTab() {
  const [open, setOpen] = useState<string[]>(['databases', 'queues']);

  const sections: Section[] = [
    { id: 'databases', label: 'Databases', icon: Database, content: <DatabaseSection /> },
    { id: 'caches', label: 'Cache (Redis)', icon: Cpu, content: <CacheSection /> },
    { id: 'queues', label: 'Queues & Workers', icon: Layers, content: <QueuesSection /> },
    { id: 'ai', label: 'AI Services', icon: Brain, content: <AISection /> },
    { id: 'backups', label: 'Backups & DR', icon: Shield, content: <BackupDRSection /> },
  ];

  return (
    <div className="p-6 space-y-3">
      {sections.map(sec => {
        const Icon = sec.icon;
        const isOpen = open.includes(sec.id);
        return (
          <div key={sec.id} className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
            <button onClick={() => setOpen(prev => isOpen ? prev.filter(x => x !== sec.id) : [...prev, sec.id])} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" style={{ color: '#64748B' }} />
                <span className="font-bold" style={{ fontSize: 13, color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{sec.label}</span>
              </div>
              {isOpen ? <ChevronDown className="w-4 h-4" style={{ color: '#475569' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#475569' }} />}
            </button>
            {isOpen && <div className="px-5 pb-5">{sec.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
