import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { MonthlyClaimData } from '../../types/insurancePortal';

interface Props {
  data: MonthlyClaimData[];
}

type ViewMode = 'volume' | 'value' | 'both';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload || !payload.length) return null;
  const isPartial = label === 'Apr';
  return (
    <div className="rounded-xl p-3 shadow-xl" style={{ background: '#1E293B', border: '1px solid #334155', minWidth: 180 }}>
      <p className="font-bold text-white mb-2" style={{ fontSize: 13 }}>
        {label} 2026 {isPartial && <span className="text-slate-400 font-normal" style={{ fontSize: 10 }}>(in progress)</span>}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span className="text-slate-300" style={{ fontSize: 11 }}>{p.name}</span>
          <span className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: p.color }}>
            {p.name === 'Value (AED)' ? `AED ${(p.value / 1000000).toFixed(1)}M` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const ClaimsTrendChart: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<ViewMode>('both');

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: '#0F2D4A' }} />
          <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
            Claims Volume & Value — 2026
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: '#F1F5F9' }}>
          {(['volume', 'value', 'both'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all capitalize ${
                view === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              style={{ fontSize: 11 }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            hide={view === 'value'}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
            axisLine={false}
            tickLine={false}
            hide={view === 'volume'}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            yAxisId="right"
            y={4000000}
            stroke="#1E3A5F"
            strokeDasharray="6 3"
            strokeWidth={1.5}
          >
            <Label value="Budget AED 4M" position="insideTopRight" style={{ fontSize: 9, fill: '#1E3A5F' }} />
          </ReferenceLine>
          {view !== 'value' && (
            <Bar
              yAxisId="left"
              dataKey="claims"
              name="Claims"
              fill="#DBEAFE"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          )}
          {view !== 'volume' && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="value"
              name="Value (AED)"
              stroke="#059669"
              strokeWidth={2.5}
              dot={{ fill: '#059669', r: 4 }}
              animationDuration={800}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <p className="text-slate-500" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
          <span className="text-emerald-600 font-bold">April on-track:</span> AED 848K / AED 4M budget (21.2%)
        </p>
        <p className="text-amber-600 font-medium" style={{ fontSize: 11 }}>
          ↑ March was 5.1% over previous month
        </p>
      </div>
    </div>
  );
};

export default ClaimsTrendChart;
