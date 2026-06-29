import { useState, useMemo } from 'react';
import {
  Search, X, MoreVertical, ArrowLeftRight, ArrowRight, ArrowLeft,
  RefreshCw, FileText, Settings, ChevronDown, ChevronUp, AlertTriangle, Phone,
} from 'lucide-react';
import { Integration, IntegCategory, CATEGORY_META, CATEGORY_ORDER, INTEGRATIONS } from './types';

interface Props {
  onSelectIntegration: (integ: Integration) => void;
}

function LogoBadge({ integ, size = 36 }: { integ: Integration; size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size,
        background: `${integ.logoColor}22`,
        border: `1px solid ${integ.logoColor}44`,
        color: integ.logoColor,
        fontSize: size * 0.33,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {integ.logoLetter}
    </div>
  );
}

function StatusDot({ status, responseAlert }: { status: Integration['status']; responseAlert?: boolean }) {
  const color = status === 'healthy' ? '#34D399' : status === 'degraded' ? '#F59E0B' : '#60A5FA';
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {(status === 'healthy' || responseAlert) && (
        <div className="absolute w-4 h-4 rounded-full animate-ping opacity-30" style={{ background: color }} />
      )}
    </div>
  );
}

function DirIcon({ dir }: { dir: Integration['direction'] }) {
  if (dir === 'bidirectional') return <ArrowLeftRight size={13} style={{ color: '#A78BFA' }} />;
  if (dir === 'outbound') return <ArrowRight size={13} style={{ color: '#2DD4BF' }} />;
  return <ArrowLeft size={13} style={{ color: '#60A5FA' }} />;
}

function IntegCard({ integ, onClick }: { integ: Integration; onClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_META[integ.category];
  const isDegraded = integ.status === 'degraded';
  const isPlanned = integ.status === 'planned';

  const borderColor = isDegraded ? '#F59E0B' : isPlanned ? '#3B82F680' : '#33415588';
  const bgStyle = isPlanned
    ? { background: 'rgba(15,23,42,0.7)', opacity: 0.8 }
    : isDegraded
    ? { background: 'rgba(245,158,11,0.04)' }
    : { background: '#1E293B' };

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 group relative h-full"
      style={{
        ...bgStyle,
        border: `1px solid ${borderColor}`,
        borderLeft: `4px solid ${isDegraded ? '#F59E0B' : isPlanned ? '#3B82F6' : cat.hex + '80'}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isDegraded ? 'rgba(245,158,11,0.07)' : isPlanned ? 'rgba(30,41,59,0.7)' : '#243447'; }}
      onMouseLeave={e => {
        e.currentTarget.style.background = bgStyle.background ?? '#1E293B';
      }}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <LogoBadge integ={integ} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-100 text-sm truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{integ.name}</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: `${cat.hex}22`, color: cat.hex, fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
              {cat.label.split(' / ')[0]}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{integ.subtitle}</div>
        </div>

        {/* Status & menu */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusDot status={integ.status} responseAlert={integ.responseAlert} />
          <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: integ.status === 'healthy' ? '#34D399' : integ.status === 'degraded' ? '#F59E0B' : '#60A5FA', fontSize: 10 }}>
            {integ.status === 'healthy' ? '✅ Connected' : integ.status === 'degraded' ? '⚠️ Degraded' : '🔵 Planned'}
          </span>
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(m => !m); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(51,65,85,0.4)' }}
            >
              <MoreVertical size={12} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-7 rounded-xl overflow-hidden z-20 min-w-40"
                style={{ background: '#0F172A', border: '1px solid #334155', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                onClick={e => e.stopPropagation()}
              >
                {['Test Connection', 'View Logs', 'Edit Config', 'View Docs', 'Disable'].map(item => (
                  <button key={item} onClick={() => setMenuOpen(false)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Degraded note */}
      {integ.degradedNote && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={11} style={{ color: '#FCD34D', flexShrink: 0 }} />
          <span className="text-xs" style={{ color: '#FCD34D', fontFamily: 'Inter, sans-serif' }}>{integ.degradedNote}</span>
        </div>
      )}

      {/* Planned description */}
      {isPlanned && integ.plannedDesc && (
        <div className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{integ.plannedDesc}</div>
      )}

      {/* Metrics row — non-planned */}
      {!isPlanned && (
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Response</div>
            <div className="text-xs font-bold" style={{
              fontFamily: 'DM Mono, monospace',
              color: integ.responseAlert ? '#F59E0B' : integ.responseOk ? '#34D399' : '#FCD34D',
            }}>
              {integ.responseTime} {integ.responseAlert && '⚠'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Uptime</div>
            <div className="text-xs font-bold text-emerald-400" style={{ fontFamily: 'DM Mono, monospace' }}>{integ.uptime}</div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <DirIcon dir={integ.direction} />
            <span className="text-xs text-slate-500 capitalize" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }}>{integ.direction}</span>
          </div>
        </div>
      )}

      {/* Details row */}
      <div className="flex items-center gap-3 flex-wrap">
        {integ.version !== '—' && (
          <span className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{integ.version}</span>
        )}
        {integ.endpoint !== '—' && (
          <span className="text-xs text-slate-600 truncate" style={{ fontFamily: 'DM Mono, monospace', maxWidth: 160 }}>{integ.endpoint}</span>
        )}
        <span className="text-xs ml-auto" style={{ fontFamily: 'Inter, sans-serif', color: cat.hex }}>{integ.todayStat}</span>
      </div>

      {/* Nabidh special badges */}
      {integ.special2 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
            Vendor ID: {integ.special}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
            🔑 {integ.special2}
          </span>
        </div>
      )}

      {/* Anthropic privacy note */}
      {integ.id === 'anthropic' && integ.special && (
        <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', color: '#C4B5FD', fontFamily: 'Inter, sans-serif' }}>
          {integ.special}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-1">
        {isPlanned ? (
          <button onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}>
            <FileText size={10} /> View Roadmap
          </button>
        ) : (
          <>
            <button onClick={e => { e.stopPropagation(); }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
              <RefreshCw size={10} /> Test
            </button>
            <button onClick={e => { e.stopPropagation(); }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
              <FileText size={10} /> Logs
            </button>
            <button onClick={e => { e.stopPropagation(); }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
              <Settings size={10} /> Config
            </button>
            {integ.status === 'degraded' && (
              <button onClick={e => { e.stopPropagation(); }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ml-auto" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Phone size={10} /> Alert Daman IT
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AllIntegrationsTab({ onSelectIntegration }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCat, setFilterCat] = useState<IntegCategory | 'all'>('all');
  const [collapsed, setCollapsed] = useState<Set<IntegCategory>>(new Set());

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter(i => {
      if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.endpoint.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus === 'healthy' && i.status !== 'healthy') return false;
      if (filterStatus === 'degraded' && i.status !== 'degraded') return false;
      if (filterStatus === 'planned' && i.status !== 'planned') return false;
      if (filterCat !== 'all' && i.category !== filterCat) return false;
      return true;
    });
  }, [search, filterStatus, filterCat]);

  const grouped = useMemo(() => {
    const m = new Map<IntegCategory, Integration[]>();
    CATEGORY_ORDER.forEach(c => m.set(c, []));
    filtered.forEach(i => m.get(i.category)?.push(i));
    return m;
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: '#1E293B', border: '1px solid #334155', minWidth: 220 }}>
          <Search size={13} style={{ color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search integration name or endpoint…"
            className="bg-transparent outline-none flex-1 text-sm text-slate-300"
            style={{ fontFamily: 'Inter, sans-serif' }} />
          {search && <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300"><X size={11} /></button>}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All (${INTEGRATIONS.length})` },
            { id: 'healthy', label: `Healthy (${INTEGRATIONS.filter(i => i.status === 'healthy').length})` },
            { id: 'degraded', label: 'Degraded (1)' },
            { id: 'planned', label: 'Planned (3)' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterStatus(f.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: filterStatus === f.id ? 'rgba(13,148,136,0.2)' : 'rgba(30,41,59,0.5)',
                color: filterStatus === f.id ? '#2DD4BF' : '#64748B',
                border: filterStatus === f.id ? '1px solid rgba(13,148,136,0.4)' : '1px solid transparent',
                fontFamily: 'DM Mono, monospace',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap ml-auto">
          {CATEGORY_ORDER.map(c => {
            const meta = CATEGORY_META[c];
            return (
              <button key={c} onClick={() => setFilterCat(filterCat === c ? 'all' : c)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: filterCat === c ? `${meta.hex}22` : 'rgba(30,41,59,0.5)',
                  color: filterCat === c ? meta.hex : '#64748B',
                  border: filterCat === c ? `1px solid ${meta.hex}44` : '1px solid transparent',
                  fontFamily: 'DM Mono, monospace', fontSize: 10,
                }}>
                {meta.label.split(' / ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category sections */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped.get(cat) ?? [];
        if (!items.length) return null;
        const meta = CATEGORY_META[cat];
        const isCollapsed = collapsed.has(cat);
        const healthyCount = items.filter(i => i.status === 'healthy').length;

        return (
          <div key={cat}>
            <button
              onClick={() => setCollapsed(p => { const n = new Set(p); n.has(cat) ? n.delete(cat) : n.add(cat); return n; })}
              className="flex items-center gap-3 w-full mb-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.hex }} />
              <span className="font-bold uppercase tracking-wider text-slate-300 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{meta.label}</span>
              <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>
                {items.length} integration{items.length > 1 ? 's' : ''} · {healthyCount} healthy
              </span>
              <div className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors">
                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </div>
            </button>

            {!isCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(integ => (
                  <IntegCard key={integ.id} integ={integ} onClick={() => onSelectIntegration(integ)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
