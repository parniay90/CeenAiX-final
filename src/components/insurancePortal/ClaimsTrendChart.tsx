import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { MonthlyClaimData } from '../../types/insurancePortal';

interface Props {
  data: MonthlyClaimData[];
}

type ViewMode = 'volume' | 'value' | 'both';

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const isPartial = label === 'Apr';
  return (
    <div className="rounded-lg shadow-xl" style={{ background: '#1E293B', border: '1px solid #334155', padding: '10px 14px', minWidth: 180 }}>
      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: '#fff', fontSize: 12, marginBottom: 8 }}>
        {label} 2026
        {isPartial && <span style={{ color: '#64748B', fontWeight: 400, fontSize: 10, marginLeft: 4 }}>(in progress)</span>}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4" style={{ marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{p.name}</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: p.color }}>
            {p.name === 'Value (AED)' ? `AED ${(p.value / 1000000).toFixed(2)}M` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const ClaimsTrendChart: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<ViewMode>('both');

  return (
    <div
      className="rounded-xl"
      style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #059669', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <BarChart3 style={{ width: 14, height: 14, color: '#059669' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
            Claims Volume &amp; Value — 2026
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          {(['volume', 'value', 'both'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="rounded-md px-2.5 py-1 transition-all capitalize"
              style={{
                fontSize: 11,
                fontWeight: view === v ? 700 : 500,
                background: view === v ? '#ffffff' : 'transparent',
                color: view === v ? '#0F172A' : '#64748B',
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={190}>
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
            <ReferenceLine yAxisId="right" y={4000000} stroke="#1E3A5F" strokeDasharray="5 3" strokeWidth={1.5}>
              <Label value="Budget AED 4M" position="insideTopRight" style={{ fontSize: 9, fill: '#1E3A5F' }} />
            </ReferenceLine>
            {view !== 'value' && (
              <Bar yAxisId="left" dataKey="claims" name="Claims" fill="#BFDBFE" radius={[3, 3, 0, 0]} animationDuration={600} />
            )}
            {view !== 'volume' && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                name="Value (AED)"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: '#059669', r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={600}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#475569' }}>
            <span style={{ color: '#059669', fontWeight: 700 }}>April on-track:</span> AED 848K / AED 4M budget (21.2%)
          </span>
          <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>
            March was 5.1% over prior month
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClaimsTrendChart;
