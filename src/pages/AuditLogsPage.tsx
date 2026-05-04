import { useState, useRef, useEffect } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, Download, ChevronDown,
  Search, Filter, X, RefreshCw, TableProperties, GitBranch, BarChart2,
  Lock, Eye, Zap, Users, Activity, AlertCircle, MoreHorizontal,
} from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import {
  AUDIT_ENTRIES, AUDIT_KPIS, INTEGRITY_STRIP, SAVED_VIEWS, AuditCategory, AuditSeverity, AuditOutcome,
} from '../data/auditLogsData';
import { A, SeverityChip, Card, Sparkline } from '../components/auditLogs/AuditPrimitives';
import { AuditTableView } from '../components/auditLogs/AuditTableView';
import { AuditTimelineView } from '../components/auditLogs/AuditTimelineView';
import { AuditStatsView } from '../components/auditLogs/AuditStatsView';
import { AnomalyPanel } from '../components/auditLogs/AnomalyPanel';

type ViewMode = 'table' | 'timeline' | 'stats';

const DATE_PRESETS = ['Last 1h', 'Today', 'Last 24h', 'Last 7d', 'Last 30d', 'Last 90d', 'Last 12m', 'Custom'];
const CATEGORIES: AuditCategory[] = ['Authentication', 'Authorization', 'Data Access', 'Data Modification', 'Configuration', 'Integration', 'Security', 'Compliance', 'Billing', 'Impersonation', 'System', 'AI', 'Communication'];
const SEVERITIES: AuditSeverity[] = ['Info', 'Notice', 'Warning', 'Error', 'Critical'];
const OUTCOMES: AuditOutcome[] = ['Success', 'Failure', 'Blocked', 'Anomaly'];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return { open, setOpen, ref };
}

function DropdownBtn({ label, children, className = '' }: { label: React.ReactNode; children: React.ReactNode; className?: string }) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
        style={{ background: A.bg2, color: A.text2, border: `1px solid ${A.border}` }}>
        {label} <ChevronDown size={11} style={{ opacity: 0.6 }} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-xl shadow-xl min-w-[160px]" style={{ background: A.bg2, border: `1px solid ${A.border}`, right: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2 text-xs transition-colors"
      style={{ color: A.text2 }}
      onMouseEnter={e => (e.currentTarget.style.background = A.tealBg)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      {children}
    </button>
  );
}

function IntegrityStrip() {
  const s = INTEGRITY_STRIP;
  const ok = s.chainStatus === 'Verified';
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-2.5" style={{ background: '#070F1E', borderBottom: `1px solid ${A.border}` }}>
      {/* Chain integrity */}
      <div className="flex items-center gap-2 text-[10px]">
        {ok
          ? <CheckCircle size={11} style={{ color: A.successLight }} />
          : <AlertTriangle size={11} style={{ color: A.errorLight }} />}
        <span style={{ color: A.text3 }}>Chain integrity:</span>
        <span className="font-semibold" style={{ color: ok ? A.successLight : A.errorLight }}>{s.chainStatus}</span>
        <span style={{ color: A.text3 }}>· verified</span>
        <span style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{new Date(s.lastVerified).toLocaleTimeString('en-AE', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="w-px h-3.5" style={{ background: A.border }} />

      {/* Total entries */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <span style={{ color: A.text3 }}>Entries (range):</span>
        <span style={{ color: A.text1, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{s.totalEntries.toLocaleString()}</span>
      </div>

      <div className="w-px h-3.5" style={{ background: A.border }} />

      {/* Retention */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <Lock size={9} style={{ color: A.text3 }} />
        <span style={{ color: A.text3 }}>Retention:</span>
        <span style={{ color: A.text2 }}>{s.retentionYears} years per DHA / HIPAA</span>
      </div>

      <div className="w-px h-3.5" style={{ background: A.border }} />

      {/* Last entry */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <span style={{ color: A.text3 }}>Last entry:</span>
        <span style={{ color: A.text2, fontFamily: 'DM Mono, monospace' }}>{new Date(s.lastEntry).toLocaleTimeString('en-AE', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>

      <div className="w-px h-3.5" style={{ background: A.border }} />

      {/* Storage */}
      <div className="flex items-center gap-2">
        {[`${s.storageRegion} region`, 'Encrypted at rest', 'WORM-locked'].map(chip => (
          <span key={chip} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: A.successBg, color: A.successLight, border: `1px solid rgba(5,150,105,0.2)` }}>
            {chip}
          </span>
        ))}
      </div>

      {/* Verify button */}
      <button className="ml-auto flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg"
        style={{ background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }}>
        <Shield size={9} /> Verify chain now
      </button>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, sub, delta, color, sparkline, onClick, active,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; delta: number; color: string;
  sparkline: number[]; onClick?: () => void; active?: boolean;
}) {
  return (
    <div onClick={onClick} className="p-4 rounded-xl flex flex-col gap-1 cursor-pointer transition-all"
      style={{
        background: active ? `${color}15` : A.bg2,
        border: `1px solid ${active ? `${color}40` : A.border}`,
        minWidth: 0,
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = A.bg2; }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
            <Icon size={12} style={{ color }} />
          </div>
          <span className="text-[10px]" style={{ color: A.text3 }}>{label}</span>
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>
      <div className="text-xl font-bold" style={{ color: A.text1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
      {sub && <div className="text-[10px]" style={{ color: A.text3 }}>{sub}</div>}
      <div className="flex items-center gap-1 text-[10px]" style={{ color: delta >= 0 ? A.successLight : A.errorLight }}>
        <span>{delta >= 0 ? '▲' : '▼'}</span>
        <span style={{ fontFamily: 'DM Mono, monospace' }}>{Math.abs(delta)}%</span>
        <span style={{ color: A.text3 }}>vs prior period</span>
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  const [view, setView] = useState<ViewMode>('table');
  const [liveTail, setLiveTail] = useState(false);
  const [showAnomaly, setShowAnomaly] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<AuditCategory[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<AuditSeverity[]>([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState<AuditOutcome[]>([]);
  const [phiOnly, setPhiOnly] = useState(false);
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [datePreset, setDatePreset] = useState('Last 7d');
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const kpis = AUDIT_KPIS;

  // Apply filters
  const filtered = AUDIT_ENTRIES.filter(e => {
    if (phiOnly && !e.phiAccessed) return false;
    if (anomalyOnly && !e.anomaly) return false;
    if (selectedCategories.length && !selectedCategories.includes(e.category)) return false;
    if (selectedSeverities.length && !selectedSeverities.includes(e.severity)) return false;
    if (selectedOutcomes.length && !selectedOutcomes.includes(e.outcome)) return false;
    if (activeKpi === 'phi' && !e.phiAccessed) return false;
    if (activeKpi === 'failures' && e.outcome !== 'Failure') return false;
    if (activeKpi === 'anomalies' && !e.anomaly) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.event.toLowerCase().includes(q) || e.actorName.toLowerCase().includes(q)
        || e.resourceId.toLowerCase().includes(q) || e.ip.includes(q)
        || e.correlationId.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleCategory = (c: AuditCategory) => setSelectedCategories(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleSeverity = (s: AuditSeverity) => setSelectedSeverities(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleOutcome = (o: AuditOutcome) => setSelectedOutcomes(prev =>
    prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const clearFilters = () => {
    setSearch(''); setSelectedCategories([]); setSelectedSeverities([]);
    setSelectedOutcomes([]); setPhiOnly(false); setAnomalyOnly(false); setActiveKpi(null);
  };

  const hasFilters = search || selectedCategories.length || selectedSeverities.length
    || selectedOutcomes.length || phiOnly || anomalyOnly || activeKpi;

  return (
    <AdminPageLayout activeSection="audit">
      <div className="flex flex-col" style={{ minHeight: '100%', background: A.bg1 }}>
        {/* Integrity strip */}
        <IntegrityStrip />

        {/* Page header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${A.border}` }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: A.tealBg, border: `1px solid ${A.tealBorder}` }}>
                <Shield size={16} style={{ color: A.tealLight }} />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: A.text1, fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.2 }}>Audit Logs</h1>
                <div className="text-[10px]" style={{ color: A.text3 }}>Immutable record of every action across CeenAiX · Asia/Dubai time · Hash-chained · WORM-locked</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Workspace */}
            <DropdownBtn label="All workspaces">
              <div className="py-1">
                {['All workspaces', 'Aster DM Healthcare', 'Cleveland Clinic Abu Dhabi', 'Mediclinic City Hospital', 'NMC Royal Hospital', 'Emirates Hospital', 'Al Zahra Hospital'].map(w => (
                  <DropdownItem key={w}>{w}</DropdownItem>
                ))}
              </div>
            </DropdownBtn>

            {/* Date range */}
            <DropdownBtn label={datePreset}>
              <div className="py-1">
                {DATE_PRESETS.map(p => (
                  <DropdownItem key={p} onClick={() => setDatePreset(p)}>{p}</DropdownItem>
                ))}
              </div>
            </DropdownBtn>

            {/* Export */}
            <DropdownBtn label={<><Download size={11} /> Export</>}>
              <div className="py-1">
                {['CSV (PHI-redacted)', 'JSON (PHI-redacted)', 'PDF report', 'DHA compliance bundle', 'NABIDH-formatted bundle', 'HIPAA disclosures (per patient)'].map(f => (
                  <DropdownItem key={f}>{f}</DropdownItem>
                ))}
              </div>
            </DropdownBtn>

            {/* Saved views */}
            <DropdownBtn label="Saved views">
              <div className="py-1">
                <div className="px-4 py-1 text-[9px] uppercase tracking-wider" style={{ color: A.text3 }}>Pre-built</div>
                {SAVED_VIEWS.map(v => (
                  <DropdownItem key={v.id}>{v.name}</DropdownItem>
                ))}
                <div style={{ borderTop: `1px solid ${A.border}`, margin: '4px 0' }} />
                <DropdownItem>Save current view…</DropdownItem>
              </div>
            </DropdownBtn>

            {/* Kebab */}
            <DropdownBtn label={<MoreHorizontal size={14} />} className="">
              <div className="py-1">
                {['Configure retention', 'Configure alerts', 'View tamper-evident chain', 'Open compliance reports', 'Manage legal holds', 'Open incidents'].map(o => (
                  <DropdownItem key={o}>{o}</DropdownItem>
                ))}
              </div>
            </DropdownBtn>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 px-6 py-4">
          <KpiCard icon={Activity} label="Total Events" value={kpis.totalEvents.value.toLocaleString()} delta={kpis.totalEvents.delta} color={A.teal} sparkline={kpis.totalEvents.sparkline} active={activeKpi === 'total'} onClick={() => setActiveKpi(activeKpi === 'total' ? null : 'total')} />
          <KpiCard icon={Eye} label="PHI Access" value={kpis.phiAccess.value.toLocaleString()} sub={`${kpis.phiAccess.pct}% of total`} delta={kpis.phiAccess.delta} color="#F97316" sparkline={kpis.phiAccess.sparkline} active={activeKpi === 'phi'} onClick={() => setActiveKpi(activeKpi === 'phi' ? null : 'phi')} />
          <KpiCard icon={X} label="Failed Actions" value={kpis.failures.value.toLocaleString()} delta={kpis.failures.delta} color={A.error} sparkline={kpis.failures.sparkline} active={activeKpi === 'failures'} onClick={() => setActiveKpi(activeKpi === 'failures' ? null : 'failures')} />
          <KpiCard icon={AlertCircle} label="High-Risk Events" value={kpis.highRisk.value.toLocaleString()} delta={kpis.highRisk.delta} color={A.warningLight} sparkline={kpis.highRisk.sparkline} active={activeKpi === 'highrisk'} onClick={() => setActiveKpi(activeKpi === 'highrisk' ? null : 'highrisk')} />
          <KpiCard icon={Users} label="Unique Actors" value={kpis.uniqueActors.value.toLocaleString()} delta={kpis.uniqueActors.delta} color={A.blueLight} sparkline={kpis.uniqueActors.sparkline} active={activeKpi === 'actors'} onClick={() => setActiveKpi(activeKpi === 'actors' ? null : 'actors')} />
          <KpiCard icon={Zap} label="Anomalies" value={kpis.anomalies.value.toString()} sub={`${kpis.anomalies.breakdown.critical} critical`} delta={kpis.anomalies.delta} color="#F87171" sparkline={kpis.anomalies.sparkline} active={activeKpi === 'anomalies'} onClick={() => setActiveKpi(activeKpi === 'anomalies' ? null : 'anomalies')} />
        </div>

        {/* Filter bar */}
        <div className="px-6 pb-3">
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${A.border}` }}>
            <div className="flex flex-wrap items-center gap-2 px-4 py-3" style={{ background: A.bg2 }}>
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-56 px-3 py-2 rounded-lg" style={{ background: A.bg1, border: `1px solid ${A.border}` }}>
                <Search size={12} style={{ color: A.text3 }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search event, actor, resource, IP, correlation ID…"
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: A.text1, fontFamily: 'DM Mono, monospace' }} />
                {search && <button onClick={() => setSearch('')}><X size={10} style={{ color: A.text3 }} /></button>}
              </div>

              {/* Category multi-select */}
              <DropdownBtn label={selectedCategories.length ? `Category (${selectedCategories.length})` : 'Category'}>
                <div className="py-1 max-h-64 overflow-y-auto">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => toggleCategory(c)}
                      className="w-full flex items-center gap-2 px-4 py-1.5 text-[10px] transition-colors"
                      style={{ color: selectedCategories.includes(c) ? A.tealLight : A.text2 }}
                      onMouseEnter={e => (e.currentTarget.style.background = A.tealBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center text-[8px] ${selectedCategories.includes(c) ? 'font-bold' : ''}`}
                        style={{ borderColor: selectedCategories.includes(c) ? A.teal : A.text3, background: selectedCategories.includes(c) ? A.teal : 'transparent', color: 'white' }}>
                        {selectedCategories.includes(c) ? '✓' : ''}
                      </span>
                      {c}
                    </button>
                  ))}
                </div>
              </DropdownBtn>

              {/* Severity */}
              <div className="flex gap-1">
                {SEVERITIES.map(s => (
                  <button key={s} onClick={() => toggleSeverity(s)} className="text-[10px] px-2 py-1 rounded-lg transition-all"
                    style={selectedSeverities.includes(s)
                      ? { background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }
                      : { background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Outcome */}
              <div className="flex gap-1">
                {OUTCOMES.map(o => (
                  <button key={o} onClick={() => toggleOutcome(o)} className="text-[10px] px-2 py-1 rounded-lg transition-all"
                    style={selectedOutcomes.includes(o)
                      ? { background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }
                      : { background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>
                    {o}
                  </button>
                ))}
              </div>

              {/* Quick toggles */}
              <button onClick={() => setPhiOnly(!phiOnly)} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg"
                style={phiOnly ? { background: 'rgba(249,115,22,0.15)', color: '#FB923C', border: '1px solid rgba(249,115,22,0.3)' } : { background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>
                <Eye size={10} /> PHI only
              </button>
              <button onClick={() => setAnomalyOnly(!anomalyOnly)} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg"
                style={anomalyOnly ? { background: A.errorBg, color: A.errorLight, border: `1px solid rgba(220,38,38,0.3)` } : { background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>
                <Zap size={10} /> Anomalies only
              </button>

              <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg"
                style={{ background: showAdvanced ? A.tealBg : A.bg1, color: showAdvanced ? A.tealLight : A.text3, border: `1px solid ${showAdvanced ? A.tealBorder : A.border}` }}>
                <Filter size={10} /> Advanced
              </button>

              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg"
                  style={{ color: A.errorLight }}>
                  <X size={10} /> Clear
                </button>
              )}
            </div>

            {/* Advanced filters */}
            {showAdvanced && (
              <div className="px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ background: A.bg1, borderTop: `1px solid ${A.border}` }}>
                {[
                  { label: 'Actor type', placeholder: 'Human Admin, System, AI…' },
                  { label: 'Specific actor', placeholder: 'Name, email, or ID' },
                  { label: 'Resource type', placeholder: 'Patient, Prescription…' },
                  { label: 'Patient ID', placeholder: 'PAT-****-XXXX (DM Mono)' },
                  { label: 'Source portal', placeholder: 'Admin, Doctor, Pharmacy…' },
                  { label: 'IP / CIDR', placeholder: '10.0.0.0/8' },
                  { label: 'Correlation ID', placeholder: 'CORR-XXXXX' },
                  { label: 'Session ID', placeholder: 'SES-XXXXX' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-2.5 py-1.5 rounded-lg text-[10px] outline-none"
                      style={{ background: A.bg2, border: `1px solid ${A.border}`, color: A.text2, fontFamily: 'DM Mono, monospace' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View controls + results count */}
        <div className="flex items-center justify-between px-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: A.bg2, border: `1px solid ${A.border}` }}>
              {([
                { id: 'table', icon: TableProperties, label: 'Table' },
                { id: 'timeline', icon: GitBranch, label: 'Timeline' },
                { id: 'stats', icon: BarChart2, label: 'Stats' },
              ] as const).map(v => (
                <button key={v.id} onClick={() => setView(v.id)}
                  className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                  style={view === v.id
                    ? { background: A.tealBg, color: A.tealLight }
                    : { background: 'transparent', color: A.text3 }}>
                  <v.icon size={11} /> {v.label}
                </button>
              ))}
            </div>

            <span className="text-[10px]" style={{ color: A.text3 }}>
              {filtered.length.toLocaleString()} of {AUDIT_ENTRIES.length.toLocaleString()} entries shown
              {hasFilters && <span style={{ color: A.warningLight }}> (filtered)</span>}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live tail */}
            {view === 'table' && (
              <button onClick={() => setLiveTail(!liveTail)} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg"
                style={liveTail ? { background: A.successBg, color: A.successLight, border: `1px solid rgba(5,150,105,0.3)` } : { background: A.bg2, color: A.text3, border: `1px solid ${A.border}` }}>
                {liveTail && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                Live tail
              </button>
            )}

            {/* Anomaly panel toggle */}
            <button onClick={() => setShowAnomaly(!showAnomaly)} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg"
              style={showAnomaly ? { background: A.errorBg, color: A.errorLight, border: `1px solid rgba(220,38,38,0.2)` } : { background: A.bg2, color: A.text3, border: `1px solid ${A.border}` }}>
              <Zap size={10} />
              {kpis.anomalies.breakdown.critical > 0 && <span className="font-semibold" style={{ color: A.errorLight }}>{kpis.anomalies.breakdown.critical}</span>}
              Anomalies
            </button>

            <button className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg"
              style={{ background: A.bg2, color: A.text2, border: `1px solid ${A.border}` }}>
              <RefreshCw size={10} /> Refresh
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 min-h-0 overflow-hidden" style={{ borderTop: `1px solid ${A.border}` }}>
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
            {view === 'table' && <AuditTableView entries={filtered} liveTail={liveTail} />}
            {view === 'timeline' && <AuditTimelineView entries={filtered} />}
            {view === 'stats' && <AuditStatsView />}
          </div>

          {/* Anomaly panel */}
          {showAnomaly && view === 'table' && (
            <AnomalyPanel onClose={() => setShowAnomaly(false)} />
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
