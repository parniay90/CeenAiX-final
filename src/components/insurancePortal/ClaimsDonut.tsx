import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText } from 'lucide-react';

const SEGMENTS = [
  { name: 'Auto-approved', value: 244, amount: 934200, color: '#0D9488', label: '✅ Auto-approved', navTarget: 'claims' },
  { name: 'Pending', value: 42, amount: 201640, color: '#D97706', label: '⏳ Pending', navTarget: 'claims' },
  { name: 'Denied', value: 18, amount: 72800, color: '#DC2626', label: '❌ Denied', navTarget: 'claims' },
  { name: 'Appealed', value: 8, amount: 39200, color: '#7C3AED', label: '⚖ Appealed', navTarget: 'claims' },
];

interface Props {
  onNavigate: (page: string) => void;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    const seg = SEGMENTS.find(s => s.name === payload[0].name);
    return (
      <div className="rounded-xl p-3 shadow-xl" style={{ background: '#1E293B', border: '1px solid #334155' }}>
        <p className="font-bold text-white" style={{ fontSize: 13 }}>{payload[0].name}</p>
        <p className="text-slate-300" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
          {payload[0].value} claims
        </p>
        {seg && (
          <p className="text-emerald-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
            AED {seg.amount.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ClaimsDonut: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div
      className="bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
      onClick={() => onNavigate('claims')}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,95,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'; }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: '#0F2D4A' }} />
          <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
            Claims Today
          </h3>
        </div>
        <span className="font-bold text-teal-600 hover:text-teal-700 transition-colors" style={{ fontSize: 11 }}>
          View All →
        </span>
      </div>

      <div className="relative" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SEGMENTS}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
            >
              {SEGMENTS.map((seg, i) => (
                <Cell key={i} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold leading-none" style={{ fontFamily: 'DM Mono, monospace', fontSize: 24, color: '#1E293B' }}>
            312
          </span>
          <span className="text-slate-400" style={{ fontSize: 11 }}>claims</span>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        {SEGMENTS.map(seg => (
          <div key={seg.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-slate-600" style={{ fontSize: 12 }}>{seg.label}: {seg.value}</span>
            </div>
            <span className="font-medium" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>
              AED {seg.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 space-y-1.5" style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="flex justify-between items-center">
          <span className="text-slate-500" style={{ fontSize: 12 }}>Total claim value</span>
          <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: '#1E293B' }}>
            AED 1,247,840
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500" style={{ fontSize: 12 }}>Daman exposure today</span>
          <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#059669' }}>
            AED 934,200
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500" style={{ fontSize: 12 }}>Pending decision</span>
          <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#D97706' }}>
            AED 201,640
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClaimsDonut;
