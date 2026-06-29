import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const SEGMENTS = [
  { name: 'Auto-approved', value: 244, amount: 934200, color: '#059669' },
  { name: 'Pending',       value: 42,  amount: 201640, color: '#D97706' },
  { name: 'Denied',        value: 18,  amount: 72800,  color: '#DC2626' },
  { name: 'Appealed',      value: 8,   amount: 39200,  color: '#7C3AED' },
];

interface Props {
  onNavigate: (page: string) => void;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  const seg = SEGMENTS.find(s => s.name === payload[0].name);
  return (
    <div className="rounded-lg px-3 py-2.5 shadow-xl" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <p className="font-bold text-white mb-1" style={{ fontSize: 12 }}>{payload[0].name}</p>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#CBD5E1' }}>
        {payload[0].value} claims
      </p>
      {seg && (
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#34D399', marginTop: 2 }}>
          AED {seg.amount.toLocaleString()}
        </p>
      )}
    </div>
  );
};

const ClaimsDonut: React.FC<Props> = ({ onNavigate }) => (
  <div
    className="rounded-xl cursor-pointer"
    style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    onClick={() => onNavigate('claims')}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div className="flex items-center gap-2">
        <TrendingUp style={{ width: 14, height: 14, color: '#2563EB' }} />
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
          Claims Today
        </span>
      </div>
      <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>View all →</span>
    </div>

    <div className="px-4 pb-4 pt-3">
      {/* Donut */}
      <div className="relative" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SEGMENTS}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              animationDuration={700}
            >
              {SEGMENTS.map((seg, i) => (
                <Cell key={i} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 26, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
            312
          </span>
          <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>claims today</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {SEGMENTS.map(seg => (
          <div key={seg.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{seg.name}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                {seg.value}
              </span>
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#94A3B8' }}>
              AED {seg.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="flex justify-between">
          <span style={{ fontSize: 12, color: '#64748B' }}>Total value</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
            AED 1,247,840
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: 12, color: '#64748B' }}>Daman exposure</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#059669' }}>
            AED 934,200
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: 12, color: '#64748B' }}>Pending decision</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#D97706' }}>
            AED 201,640
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default ClaimsDonut;
