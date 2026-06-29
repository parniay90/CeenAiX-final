import { INTEGRATIONS, CATEGORY_META, CATEGORY_ORDER } from './types';

const ACTIVE = INTEGRATIONS.filter(i => i.status !== 'planned');
const HEALTHY = ACTIVE.filter(i => i.status === 'healthy').length;
const DEGRADED = ACTIVE.filter(i => i.status === 'degraded').length;
const PLANNED = INTEGRATIONS.filter(i => i.status === 'planned').length;
const SCORE = 95.2;

// SVG ring
function HealthRing() {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (SCORE / 100) * circ;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#334155" strokeWidth={8} />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke="#0D9488"
        strokeWidth={8}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="50" y="46" textAnchor="middle" fill="#2DD4BF" fontSize="14" fontWeight="bold" fontFamily="DM Mono, monospace">{SCORE}%</text>
      <text x="50" y="60" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="Inter, sans-serif">Health Score</text>
    </svg>
  );
}

export default function IntegrationHealthOverview() {
  const catStats = CATEGORY_ORDER.filter(c => c !== 'planned').map(c => {
    const items = INTEGRATIONS.filter(i => i.category === c);
    const healthy = items.filter(i => i.status === 'healthy').length;
    const meta = CATEGORY_META[c];
    return { c, label: meta.label.split(' / ')[0], healthy, total: items.length, color: meta.hex };
  });

  return (
    <div className="rounded-2xl px-7 py-5 flex flex-wrap items-stretch gap-8"
      style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>

      {/* Health ring */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <HealthRing />
        <div className="space-y-0.5 text-center">
          <div className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: '#34D399' }}>
            {HEALTHY} healthy ✅
          </div>
          <div className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#F59E0B' }}>
            {DEGRADED} degraded ⚠️
          </div>
          <div className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#60A5FA' }}>
            {PLANNED} planned 🔵
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div className="flex-1 min-w-48">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
          Health by Category
        </div>
        <div className="space-y-2.5">
          {catStats.map(s => (
            <div key={s.c} className="flex items-center gap-3">
              <div className="w-28 text-xs text-slate-400 shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#0F172A', maxWidth: 80 }}>
                <div className="h-full rounded-full" style={{ width: `${(s.healthy / s.total) * 100}%`, background: s.healthy === s.total ? '#34D399' : '#F59E0B' }} />
              </div>
              <div className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: s.healthy === s.total ? '#34D399' : '#F59E0B' }}>
                {s.healthy}/{s.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {[
          { label: 'API CALLS TODAY', value: '1.2M',          color: '#A78BFA' },
          { label: 'TOTAL UPTIME',    value: '99.8%',         color: '#34D399' },
          { label: 'AVG RESPONSE',    value: '0.61s',         color: '#2DD4BF' },
          { label: 'ACTIVE NOW',      value: '247 sessions',  color: '#E2E8F0' },
        ].map(m => (
          <div key={m.label} className="rounded-xl px-4 py-3 text-center" style={{ background: '#0F172A', border: '1px solid #334155' }}>
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider" style={{ fontFamily: 'DM Mono, monospace', fontSize: 8 }}>{m.label}</div>
            <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: m.label === 'ACTIVE NOW' ? 14 : 18, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
