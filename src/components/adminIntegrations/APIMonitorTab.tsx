import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from 'recharts';
import { INTEGRATIONS, CATEGORY_META } from './types';
import type { Integration } from './types';

interface Props { onSelectIntegration: (i: Integration) => void }

// Generate 24h chart data for each integration
function makeLineData() {
  const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  return hours.map(h => {
    const obj: Record<string, string | number> = { h };
    INTEGRATIONS.filter(i => i.status !== 'planned').forEach(integ => {
      const base = parseFloat(integ.responseTime) || 0.3;
      let v = base + (Math.random() - 0.5) * 0.15;
      // Shafafiya spikes at 1:20 PM
      if (integ.id === 'shafafiya' && h >= '13:00') v = 3.1 + Math.random() * 0.3;
      obj[integ.id] = Math.max(0.05, Number(v.toFixed(2)));
    });
    return obj;
  });
}

const LINE_DATA = makeLineData();

const TOP_LINES = [
  { id: 'nabidh',      name: 'Nabidh HIE',    color: '#2DD4BF' },
  { id: 'anthropic',   name: 'Anthropic',      color: '#A78BFA' },
  { id: 'dha-rx',      name: 'DHA ePrescription', color: '#60A5FA' },
  { id: 'shafafiya',   name: 'Shafafiya',      color: '#F59E0B' },
  { id: 'uae-pass',    name: 'UAE PASS',        color: '#818CF8' },
  { id: 'network-intl',name: 'Network Int.',   color: '#34D399' },
];

const ACTIVE = INTEGRATIONS.filter(i => i.status !== 'planned');

function responseColor(ms: string) {
  const v = parseFloat(ms);
  if (!ms || ms === '—') return '#64748B';
  if (ms.includes('ms') || v <= 1.0) return '#34D399';
  if (v <= 3.0) return '#FCD34D';
  return '#F87171';
}
function uptimeColor(u: string) {
  const v = parseFloat(u);
  if (!u || u === '—') return '#64748B';
  if (v >= 99.9) return '#34D399';
  if (v >= 99.0) return '#FCD34D';
  return '#F87171';
}

export default function APIMonitorTab({ onSelectIntegration }: Props) {
  const [timeRange, setTimeRange] = useState<'1h' | 'today' | '7d' | '30d'>('today');
  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-slate-100 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>API Performance Dashboard</div>
          <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Real-time monitoring for all {ACTIVE.length} active integrations</div>
        </div>
        <div className="flex items-center gap-2">
          {(['1h', 'today', '7d', '30d'] as const).map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: timeRange === r ? 'rgba(13,148,136,0.2)' : 'rgba(30,41,59,0.5)',
                color: timeRange === r ? '#2DD4BF' : '#64748B',
                border: timeRange === r ? '1px solid rgba(13,148,136,0.4)' : '1px solid transparent',
                fontFamily: 'DM Mono, monospace',
              }}>
              {r.toUpperCase()}
            </button>
          ))}
          <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
            <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Response time chart */}
      <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid #334155' }}>
        <div className="text-xs font-semibold text-slate-400 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          API Response Times — All Integrations (Today)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={LINE_DATA}>
            <XAxis dataKey="h" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[0, 4]} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}s`} />
            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94A3B8', fontFamily: 'DM Mono, monospace' }} itemStyle={{ fontFamily: 'DM Mono, monospace' }} />
            <ReferenceLine y={3} stroke="#F87171" strokeDasharray="4 4" opacity={0.5} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: 'Inter, sans-serif', paddingTop: 8 }} />
            {TOP_LINES.map(l => (
              <Line key={l.id} type="monotone" dataKey={l.id} name={l.name} stroke={l.color} strokeWidth={1.5} dot={false} animationDuration={800} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Health table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="text-xs font-bold text-slate-300" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Integration Health Summary</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                {['Integration', 'Status', 'Response', 'Uptime', 'Calls Today', 'Errors', 'Last Check'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVE.map(integ => {
                const cat = CATEGORY_META[integ.category];
                return (
                  <tr
                    key={integ.id}
                    onClick={() => onSelectIntegration(integ)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(51,65,85,0.3)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${integ.logoColor}22`, color: integ.logoColor, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 8 }}>
                          {integ.logoLetter.slice(0, 3)}
                        </div>
                        <span className="text-xs text-slate-200 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{integ.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                        background: integ.status === 'healthy' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: integ.status === 'healthy' ? '#34D399' : '#FCD34D',
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                      }}>
                        {integ.status === 'healthy' ? '✅ Healthy' : '⚠️ Degraded'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: responseColor(integ.responseTime) }}>{integ.responseTime}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: uptimeColor(integ.uptime) }}>{integ.uptime}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: cat.hex }}>{integ.callsToday}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: integ.errorsToday === 0 ? '#34D399' : '#F87171' }}>{integ.errorsToday}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>{integ.lastCheck}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary strip */}
        <div className="px-5 py-3 flex items-center gap-6" style={{ borderTop: '1px solid rgba(51,65,85,0.5)', background: 'rgba(15,23,42,0.4)' }}>
          {[
            { label: '99.8% avg uptime (20 integrations · 30 days)', color: '#34D399' },
            { label: 'Total API calls today: 1.2M', color: '#2DD4BF' },
            { label: '0 integration-caused incidents this month', color: '#34D399' },
          ].map(s => (
            <span key={s.label} className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: s.color }}>{s.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
