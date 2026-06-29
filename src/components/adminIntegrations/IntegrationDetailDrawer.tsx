import { useState } from 'react';
import { X, RefreshCw, FileText, Settings, PauseCircle, ArrowLeftRight, ArrowRight, ArrowLeft, AlertTriangle, Check, Shield, Copy } from 'lucide-react';
import { Integration, CATEGORY_META } from './types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  integration: Integration | null;
  onClose: () => void;
}

const RESPONSE_CHART = Array.from({ length: 15 }, (_, i) => ({
  h: `${String(i).padStart(2, '0')}:00`,
  v: 0.24 + Math.random() * 0.12,
}));

const SYNC_CHART = [
  { d: 'Apr 1', v: 9400 }, { d: 'Apr 2', v: 11200 }, { d: 'Apr 3', v: 10800 },
  { d: 'Apr 4', v: 12100 }, { d: 'Apr 5', v: 11600 }, { d: 'Apr 6', v: 13000 },
  { d: 'Apr 7', v: 12847 },
];

const LOGS = [
  { ok: true,  time: '14:07:03', method: 'POST', path: '/Patient',           code: 201, ms: '0.28s' },
  { ok: true,  time: '14:07:01', method: 'GET',  path: '/Observation/12847', code: 200, ms: '0.31s' },
  { ok: true,  time: '14:06:58', method: 'POST', path: '/MedicationRequest', code: 201, ms: '0.29s' },
  { ok: true,  time: '14:06:55', method: 'PUT',  path: '/Patient/PT001',     code: 200, ms: '0.24s' },
  { ok: false, time: '14:01:12', method: 'POST', path: '/DiagnosticReport',  code: 429, ms: '2.1s', note: 'Rate limit hit — auto-retry succeeded' },
  { ok: true,  time: '14:01:14', method: 'POST', path: '/DiagnosticReport',  code: 201, ms: '0.31s' },
  { ok: true,  time: '14:00:47', method: 'GET',  path: '/Patient',           code: 200, ms: '0.27s' },
];

const AVAILABILITY = Array.from({ length: 30 }, (_, i) => i === 14 ? 'amber' : 'green');

const TOGGLES = [
  { label: 'Auto-sync on patient record change', on: true,  canDisable: true  },
  { label: 'Bidirectional patient data',          on: true,  canDisable: true  },
  { label: 'Allergy sync',                        on: true,  canDisable: false },
  { label: 'Condition sync',                      on: true,  canDisable: true  },
  { label: 'Medication sync',                     on: true,  canDisable: true  },
  { label: 'Lab results sync',                    on: true,  canDisable: true  },
  { label: 'Imaging sync',                        on: true,  canDisable: true  },
  { label: 'Background bulk sync (daily 8AM)',     on: true,  canDisable: true  },
];

const FHIR_RESOURCES = [
  'Patient', 'Encounter', 'Observation', 'Condition',
  'MedicationRequest', 'DiagnosticReport', 'AllergyIntolerance', 'ImagingStudy',
];

const ACTIVITY_BREAKDOWN = [
  { name: 'Patient', count: '189' },
  { name: 'Encounter', count: '847' },
  { name: 'Observation', count: '3,241' },
  { name: 'MedicationRequest', count: '534' },
  { name: 'DiagnosticReport', count: '421' },
  { name: 'AllergyIntolerance', count: '234' },
  { name: 'Other', count: '7,381' },
];

function DTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 text-xs font-semibold transition-all"
      style={{
        color: active ? '#2DD4BF' : '#64748B',
        borderBottom: active ? '2px solid #0D9488' : '2px solid transparent',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {label}
    </button>
  );
}

export default function IntegrationDetailDrawer({ integration, onClose }: Props) {
  const [tab, setTab] = useState<'overview' | 'performance' | 'logs' | 'config'>('overview');
  const [copied, setCopied] = useState(false);
  const [logFilter, setLogFilter] = useState('all');
  const [toggles, setToggles] = useState(TOGGLES.map(t => t.on));

  if (!integration) return null;

  const catMeta = CATEGORY_META[integration.category];

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const dirIcon = integration.direction === 'bidirectional'
    ? <ArrowLeftRight size={13} style={{ color: '#A78BFA' }} />
    : integration.direction === 'outbound'
    ? <ArrowRight size={13} style={{ color: '#2DD4BF' }} />
    : <ArrowLeft size={13} style={{ color: '#60A5FA' }} />;

  return (
    <div className="fixed inset-0 z-[300] flex items-stretch">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: 560, background: '#0F172A', borderLeft: '1px solid #334155', boxShadow: '-8px 0 40px rgba(0,0,0,0.6)' }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
          <div>
            <div className="text-sm font-bold text-slate-100" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Integration Detail</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: 'DM Mono, monospace', color: catMeta.hex }}>{integration.name} · {catMeta.label}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0" style={{ borderBottom: '1px solid #1E293B', background: '#0F172A' }}>
          {(['overview', 'performance', 'logs', 'config'] as const).map(t => (
            <DTab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="px-6 py-5 space-y-5">
              {/* Identity */}
              <div className="rounded-2xl p-5 space-y-4" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                    style={{ background: `${catMeta.hex}22`, border: `1px solid ${catMeta.hex}44`, color: catMeta.hex, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
                    {integration.logoLetter}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{integration.name}</div>
                    <div className="text-sm text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>{integration.subtitle}</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: '#0D948822', color: '#2DD4BF' }}>
                    🇦🇪 Dubai Health Authority
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: '#10B98122', color: '#34D399' }}>
                    ✅ Vendor Approved
                  </span>
                  {integration.version !== '—' && (
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: '#3B82F622', color: '#60A5FA', fontFamily: 'DM Mono, monospace' }}>
                      {integration.version}
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: '#F59E0B22', color: '#FCD34D' }}>
                    🔑 Critical
                  </span>
                </div>

                {integration.special && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>Vendor ID:</span>
                    <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: '#2DD4BF' }}>{integration.special}</span>
                    <button onClick={() => copy(integration.special!)} className="text-slate-500 hover:text-teal-400 transition-colors">
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                )}
                <div className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>
                  Connected since: January 2024 · DHA approval: ✅ Active
                </div>
              </div>

              {/* Tech specs */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>Technical Specs</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Protocol', 'HL7 FHIR R4/4.0.1'],
                    ['Base URL', integration.endpoint],
                    ['Auth', 'OAuth 2.0 · Client credentials'],
                    ['Data format', 'JSON+FHIR'],
                    ['Encryption', 'TLS 1.3 · AES-256'],
                    ['Direction', integration.direction],
                    ['Rate limit', '1,000 req/min'],
                    ['SLA uptime', '99.9% guaranteed'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg px-3 py-2" style={{ background: '#0F172A', border: '1px solid #1E293B' }}>
                      <div className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>{k}</div>
                      <div className="text-xs text-slate-300 font-semibold truncate" style={{ fontFamily: 'DM Mono, monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FHIR resources */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>FHIR Resources</div>
                <div className="flex flex-wrap gap-1.5">
                  {FHIR_RESOURCES.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#0D948822', color: '#2DD4BF', fontFamily: 'DM Mono, monospace', border: '1px solid #0D948840' }}>{r}</span>
                  ))}
                </div>
              </div>

              {/* Today's activity */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>Today's Activity</div>
                <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                  <div className="text-base font-bold mb-3" style={{ fontFamily: 'DM Mono, monospace', color: '#2DD4BF' }}>12,847 FHIR records synced today</div>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITY_BREAKDOWN.map(({ name, count }) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{name}</span>
                        <span className="text-xs font-bold text-slate-300" style={{ fontFamily: 'DM Mono, monospace' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ background: '#0D9488', color: '#fff' }}>
                  <RefreshCw size={12} /> Test Connection
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8' }}>
                  <FileText size={12} /> View All Logs
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8' }}>
                  <Settings size={12} /> Reconfigure
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <PauseCircle size={12} /> Disable
                </button>
              </div>
            </div>
          )}

          {/* ── PERFORMANCE ── */}
          {tab === 'performance' && (
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Avg Response', value: integration.responseTime, color: '#34D399' },
                  { label: 'Uptime (30d)', value: integration.uptime, color: '#34D399' },
                  { label: 'Syncs Today', value: integration.callsToday, color: '#2DD4BF' },
                  { label: 'Errors Today', value: String(integration.errorsToday), color: '#34D399' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                    <div className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
                    <div className="text-xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Response time chart */}
              <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-xs font-semibold text-slate-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Response Time — Last 24 Hours</div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={RESPONSE_CHART}>
                    <XAxis dataKey="h" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 2]} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94A3B8' }} itemStyle={{ color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }} />
                    <ReferenceLine y={1.0} stroke="#34D399" strokeDasharray="4 4" opacity={0.5} />
                    <Line type="monotone" dataKey="v" stroke="#2DD4BF" strokeWidth={2} dot={false} animationDuration={600} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sync volume chart */}
              <div className="rounded-xl p-4" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-xs font-semibold text-slate-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Daily Syncs — Last 7 Days</div>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={SYNC_CHART}>
                    <XAxis dataKey="d" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94A3B8' }} itemStyle={{ color: '#2DD4BF', fontFamily: 'DM Mono, monospace' }} />
                    <Bar dataKey="v" fill="#0D9488" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Availability */}
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Availability — Last 30 Days</div>
                <div className="flex gap-1 flex-wrap">
                  {AVAILABILITY.map((color, i) => (
                    <div
                      key={i}
                      title={`Day ${i + 1}: ${color === 'green' ? 'Healthy' : 'Maintenance'}`}
                      className="w-5 h-5 rounded-sm"
                      style={{ background: color === 'green' ? '#10B98133' : '#F59E0B33', border: `1px solid ${color === 'green' ? '#34D39944' : '#FCD34D44'}` }}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2" style={{ fontFamily: 'DM Mono, monospace' }}>30-day uptime: 99.97% · 1 scheduled maintenance</div>
              </div>
            </div>
          )}

          {/* ── LOGS ── */}
          {tab === 'logs' && (
            <div className="px-6 py-5 space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['all', 'errors', 'warnings', 'success'].map(f => (
                  <button key={f} onClick={() => setLogFilter(f)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ background: logFilter === f ? 'rgba(13,148,136,0.2)' : 'rgba(30,41,59,0.5)', color: logFilter === f ? '#2DD4BF' : '#64748B', border: logFilter === f ? '1px solid rgba(13,148,136,0.4)' : '1px solid transparent' }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                {LOGS.map((log, i) => (
                  <div key={i}>
                    <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < LOGS.length - 1 ? '1px solid rgba(51,65,85,0.4)' : 'none' }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: log.ok ? '#34D399' : '#F59E0B' }} />
                      <span className="text-xs shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>{log.time}</span>
                      <span className="text-xs font-bold shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: log.method === 'POST' ? '#2DD4BF' : log.method === 'GET' ? '#60A5FA' : '#A78BFA' }}>{log.method}</span>
                      <span className="text-xs flex-1 truncate" style={{ fontFamily: 'DM Mono, monospace', color: '#CBD5E1' }}>{log.path}</span>
                      <span className="text-xs shrink-0 font-bold" style={{ fontFamily: 'DM Mono, monospace', color: log.code < 300 ? '#34D399' : log.code < 500 ? '#FCD34D' : '#F87171' }}>{log.code}</span>
                      <span className="text-xs shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>{log.ms}</span>
                    </div>
                    {log.note && (
                      <div className="px-10 pb-2 text-xs" style={{ color: '#FCD34D', fontFamily: 'Inter, sans-serif' }}>{log.note}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#34D399' }}>
                  0 errors today · 1 rate limit event (auto-resolved)
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
                  Export Logs (CSV)
                </button>
              </div>
            </div>
          )}

          {/* ── CONFIG ── */}
          {tab === 'config' && (
            <div className="px-6 py-5 space-y-5">
              {/* Warning */}
              <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertTriangle size={14} style={{ color: '#FCD34D', flexShrink: 0, marginTop: 1 }} />
                <div className="text-xs text-amber-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Configuration changes require CTO approval. Incorrect Nabidh config may violate DHA compliance. All changes are audit-logged.
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-2">
                {[
                  ['Base URL', 'https://api.nabidh.dha.gov.ae/fhir/r4'],
                  ['Client ID', 'ceenaix-prod-●●●●●●●●●●●●'],
                  ['Client Secret', '●●●●●●●●●●●●●●●●●●●●●●●'],
                  ['Token URL', 'https://auth.nabidh.dha.gov.ae/token'],
                  ['Webhook URL', 'https://api.ceenaix.com/webhooks/nabidh'],
                  ['Timeout', '30 seconds'],
                  ['Retry', '3 attempts (exponential backoff)'],
                  ['Rate limit', '1,000 req/min'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                    <div className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>{k}</div>
                    <div className="text-xs font-semibold text-slate-300" style={{ fontFamily: 'DM Mono, monospace' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>Feature Toggles</div>
                <div className="space-y-2">
                  {TOGGLES.map((t, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                      <div>
                        <span className="text-xs text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>{t.label}</span>
                        {!t.canDisable && (
                          <span className="ml-2 text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#F87171' }}>critical — cannot disable</span>
                        )}
                      </div>
                      <div
                        className="w-9 h-5 rounded-full flex items-center transition-colors cursor-pointer"
                        style={{ background: toggles[i] ? '#0D9488' : '#334155', padding: 2 }}
                        onClick={() => t.canDisable && setToggles(p => { const n = [...p]; n[i] = !n[i]; return n; })}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-white transition-transform" style={{ transform: toggles[i] ? 'translateX(16px)' : 'translateX(0)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}>
                <Shield size={13} /> Edit Configuration — Requires CTO Approval
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
