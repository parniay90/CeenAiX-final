import { useState, useEffect, useRef } from 'react';
import { Search, Download, Pause, Play } from 'lucide-react';

interface LogEntry {
  level: 'success' | 'warning' | 'info' | 'error';
  time: string;
  integration: string;
  intColor: string;
  message: string;
  detail?: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { level: 'success', time: '14:07:03', integration: 'Nabidh',         intColor: '#2DD4BF', message: 'POST /Patient/PT001 → 201', detail: '0.28s' },
  { level: 'success', time: '14:07:02', integration: 'Anthropic',      intColor: '#A78BFA', message: 'Chat session started · 247 active', detail: '' },
  { level: 'success', time: '14:07:01', integration: 'DHA ePrescription', intColor: '#2DD4BF', message: 'RX-20260407-003124 signed', detail: '' },
  { level: 'warning', time: '14:06:58', integration: 'Shafafiya',      intColor: '#F59E0B', message: 'High response time: 3.2s (normal <0.8s)', detail: '' },
  { level: 'success', time: '14:06:55', integration: 'Twilio',         intColor: '#F87171', message: 'SMS delivered: PT-001 appointment reminder', detail: '' },
  { level: 'success', time: '14:06:54', integration: 'Firebase',       intColor: '#FB923C', message: 'Push sent: 12 devices', detail: '' },
  { level: 'success', time: '14:06:52', integration: 'UAE PASS',       intColor: '#34D399', message: 'Identity verified: PT-048231', detail: '' },
  { level: 'warning', time: '14:06:50', integration: 'Shafafiya',      intColor: '#F59E0B', message: 'Claim CLM-00912 SLA breach flagged', detail: '' },
  { level: 'success', time: '14:06:48', integration: 'Nabidh',         intColor: '#2DD4BF', message: 'Batch sync: 47 FHIR resources', detail: '0.29s' },
  { level: 'success', time: '14:06:45', integration: 'MOHAP',          intColor: '#60A5FA', message: 'Drug lookup: Atorvastatin 20mg', detail: '' },
  { level: 'success', time: '14:06:44', integration: 'Network Int.',   intColor: '#34D399', message: 'Payment AED 400 · PT-001 ✅', detail: '' },
  { level: 'success', time: '14:06:42', integration: 'ICD-10',         intColor: '#A78BFA', message: 'Lookup: I10 Hypertension', detail: '' },
  { level: 'warning', time: '14:06:40', integration: 'Shafafiya',      intColor: '#F59E0B', message: 'Degraded performance continuing', detail: '' },
  { level: 'success', time: '14:06:38', integration: 'SendGrid',       intColor: '#60A5FA', message: 'Welcome email delivered: new patient', detail: '' },
  { level: 'success', time: '14:06:35', integration: 'Anthropic',      intColor: '#A78BFA', message: 'Session ended · 8.4 min · 4.7★', detail: '' },
  { level: 'info',    time: '14:06:30', integration: 'Datadog',        intColor: '#C084FC', message: 'Alert: Shafafiya response >3s', detail: '' },
  { level: 'success', time: '14:06:28', integration: 'Nabidh',         intColor: '#2DD4BF', message: 'AllergyIntolerance synced: PT-047821', detail: '' },
  { level: 'success', time: '14:06:25', integration: 'WhatsApp',       intColor: '#34D399', message: 'Prescription ready notification sent', detail: '' },
  { level: 'success', time: '14:06:22', integration: 'Redis',          intColor: '#F87171', message: 'Cache hit ratio: 94.7%', detail: '' },
  { level: 'success', time: '14:06:20', integration: 'AWS',            intColor: '#FB923C', message: 'Auto-scaling triggered: +2 EC2 instances', detail: '' },
];

const LEVEL_DOT: Record<LogEntry['level'], string> = {
  success: '#34D399',
  warning: '#F59E0B',
  info:    '#60A5FA',
  error:   '#F87171',
};

export default function LogsEventsTab() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [paused, setPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState('all');
  const [integFilter, setIntegFilter] = useState('all');
  const [search, setSearch] = useState('');
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const t = setInterval(() => {
      if (pausedRef.current) return;
      const newLog: LogEntry = {
        level: Math.random() > 0.85 ? 'warning' : 'success',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        integration: ['Nabidh', 'Anthropic', 'DHA ePrescription', 'Twilio', 'Firebase'][Math.floor(Math.random() * 5)],
        intColor: ['#2DD4BF', '#A78BFA', '#2DD4BF', '#F87171', '#FB923C'][Math.floor(Math.random() * 5)],
        message: ['POST /Patient → 201', 'Chat session active', 'SMS delivered', 'Push sent: 3 devices', 'Drug lookup complete'][Math.floor(Math.random() * 5)],
        detail: `${(Math.random() * 0.5 + 0.2).toFixed(2)}s`,
      };
      setLogs(p => [newLog, ...p.slice(0, 49)]);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = logs.filter(l => {
    if (levelFilter !== 'all' && l.level !== levelFilter) return false;
    if (integFilter !== 'all' && !l.integration.toLowerCase().includes(integFilter.toLowerCase())) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.integration.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const integrations = [...new Set(logs.map(l => l.integration))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: '#1E293B', border: '1px solid #334155', minWidth: 220 }}>
          <Search size={12} style={{ color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search logs by endpoint, status, org…"
            className="bg-transparent outline-none flex-1 text-xs text-slate-300"
            style={{ fontFamily: 'Inter, sans-serif' }} />
        </div>

        <select value={integFilter} onChange={e => setIntegFilter(e.target.value)}
          className="h-9 px-3 rounded-xl text-xs outline-none cursor-pointer"
          style={{ background: '#1E293B', border: '1px solid #334155', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>
          <option value="all">All Integrations</option>
          {integrations.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        <div className="flex items-center gap-1.5">
          {['all', 'error', 'warning', 'info', 'success'].map(f => (
            <button key={f} onClick={() => setLevelFilter(f)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: levelFilter === f ? 'rgba(13,148,136,0.2)' : 'rgba(30,41,59,0.5)',
                color: levelFilter === f ? '#2DD4BF' : '#64748B',
                fontFamily: 'DM Mono, monospace',
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
          <Download size={11} /> Export Logs
        </button>
      </div>

      {/* Log stream */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155' }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)', background: 'rgba(15,23,42,0.4)' }}>
          <span className="text-xs font-bold text-slate-400" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Live Log Stream</span>
          <button onClick={() => setPaused(p => !p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
            {paused ? <><Play size={10} /> Resume</> : <><Pause size={10} /> Pause stream</>}
          </button>
        </div>

        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          {filtered.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors"
              style={{ borderBottom: '1px solid rgba(51,65,85,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVEL_DOT[log.level] }} />
              <span className="text-xs shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: '#475569', width: 64 }}>{log.time}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: `${log.intColor}20`, color: log.intColor, fontFamily: 'DM Mono, monospace', fontSize: 9, minWidth: 60, textAlign: 'center' }}>
                {log.integration}
              </span>
              <span className="flex-1 text-xs text-slate-300 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{log.message}</span>
              {log.detail && (
                <span className="text-xs shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>{log.detail}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
        <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#64748B' }}>
          Today: 1.2M total events · 0 errors · 3 warnings
        </span>
        <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#64748B' }}>
          Retention: 90 days · Stored in AWS UAE ✅
        </span>
      </div>
    </div>
  );
}
