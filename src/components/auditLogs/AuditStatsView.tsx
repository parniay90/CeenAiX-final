import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend,
} from 'recharts';
import { EVENTS_OVER_TIME, TOP_ACTORS, FAILURE_REASONS } from '../../data/auditLogsData';
import { A, Card, SectionHeader } from './AuditPrimitives';

const CATEGORY_COLORS: Record<string, string> = {
  Authentication: '#38BDF8',
  'Data Access': A.tealLight,
  'Data Modification': '#FB923C',
  Integration: A.cyanLight,
  Security: '#F87171',
  AI: '#A78BFA',
  Other: A.text3,
};

const ACTOR_TYPE_COLORS: Record<string, string> = {
  'Human Admin': A.teal,
  'Human User': '#38BDF8',
  System: A.text3,
  Integration: A.cyanLight,
  'AI Service': '#A78BFA',
};

// Simple PHI access heatmap: hours × day-of-week
const PHI_HEATMAP: number[][] = [
  [0,0,0,1,0,0,2,5,8,12,14,18,16,15,14,12,10,8,6,4,2,1,0,0],
  [0,0,0,0,1,0,1,4,7,10,12,15,14,12,11,10,8,6,4,3,2,1,0,0],
  [0,0,0,0,0,1,2,5,9,14,18,22,20,19,16,14,12,9,7,5,3,2,1,0],
  [0,0,0,0,1,0,2,6,10,15,19,24,22,20,18,15,13,10,8,5,3,2,1,0],
  [0,0,0,0,0,1,2,5,8,12,16,20,18,17,15,12,10,8,5,4,2,1,0,0],
  [0,0,0,0,0,0,1,2,4,6,8,10,9,8,6,5,4,3,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,4,5,6,5,4,4,3,2,1,1,0,0,0,0,0],
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_PHI = Math.max(...PHI_HEATMAP.flat());

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0A1628', border: `1px solid ${A.border}` }}>
      <div className="mb-1 font-semibold" style={{ color: A.text2, fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{label}</div>
      {payload.slice().reverse().map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
          <span style={{ color: A.text2, fontSize: 10 }}>{p.name}:</span>
          <span style={{ color: A.text1, fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function AuditStatsView() {
  return (
    <div className="flex flex-col gap-4 p-5 overflow-y-auto">
      {/* Events over time stacked */}
      <Card className="p-5">
        <SectionHeader title="Events Over Time (7d)" />
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={EVENTS_OVER_TIME} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <linearGradient key={cat} id={`grad-${cat.replace(/ /g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: A.text3, fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: A.text3, fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} width={50}
              tickFormatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`} />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <Area key={cat} type="monotone" dataKey={cat} name={cat} stroke={color}
                fill={`url(#grad-${cat.replace(/ /g, '-')})`} strokeWidth={1.5} dot={false} stackId="a" />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px]" style={{ color: A.text3 }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
              {cat}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top actors */}
        <Card className="p-5">
          <SectionHeader title="Top Actors" />
          <div className="space-y-3">
            {TOP_ACTORS.map((a, i) => {
              const max = TOP_ACTORS[0].count;
              const color = ACTOR_TYPE_COLORS[a.type] || A.text3;
              return (
                <div key={a.name}>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: `${color}20`, color }}>{i + 1}</span>
                      <span style={{ color: A.text2 }}>{a.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: A.bg1, color: A.text3 }}>{a.role}</span>
                    </div>
                    <span style={{ color: A.text1, fontFamily: 'DM Mono, monospace' }}>{a.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: A.bg1 }}>
                    <div className="h-full rounded-full" style={{ width: `${(a.count / max) * 100}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Failure reasons */}
        <Card className="p-5">
          <SectionHeader title="Failure Reasons" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FAILURE_REASONS} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fill: A.text3, fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="reason" tick={{ fill: A.text2, fontSize: 10, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} width={120} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}
                label={{ position: 'right', fill: A.text3, fontSize: 9, fontFamily: 'DM Mono, monospace', formatter: (v: number) => v.toLocaleString() }}>
                {FAILURE_REASONS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? A.errorLight : i === 1 ? '#FB923C' : A.warningLight} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* PHI access heatmap */}
      <Card className="p-5">
        <SectionHeader title="PHI Access Heatmap (Actor × Hour-of-Day, Last 7 Days)" />
        <div className="overflow-x-auto">
          <div className="flex gap-1 mb-1">
            <div className="w-10 flex-shrink-0" />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 text-center text-[8px]" style={{ color: A.text3, fontFamily: 'DM Mono, monospace', minWidth: 20 }}>{h}</div>
            ))}
          </div>
          {PHI_HEATMAP.map((row, di) => (
            <div key={di} className="flex gap-1 mb-0.5">
              <div className="w-10 flex-shrink-0 text-[9px] flex items-center" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{DAY_LABELS[di]}</div>
              {row.map((val, h) => {
                const intensity = val / MAX_PHI;
                return (
                  <div key={h} className="flex-1 rounded-sm" style={{ minWidth: 20, height: 18, background: intensity > 0 ? `rgba(13,148,136,${0.1 + intensity * 0.85})` : 'rgba(30,41,59,0.4)' }}
                    title={`${DAY_LABELS[di]} ${h}:00 — ${val} PHI accesses`} />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[9px]" style={{ color: A.text3 }}>Low</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(i => (
                <div key={i} className="w-6 h-3 rounded-sm" style={{ background: `rgba(13,148,136,${i})` }} />
              ))}
            </div>
            <span className="text-[9px]" style={{ color: A.text3 }}>High</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
