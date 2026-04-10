import React from 'react';
import { Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { aiBarData } from '../../data/superAdminData';

const langData = [
  { lang: 'Arabic', pct: 62, color: '#2DD4BF' },
  { lang: 'English', pct: 34, color: '#60A5FA' },
  { lang: 'Other', pct: 4, color: '#475569' },
];

const topicsData = [
  { topic: 'Symptom assessment', pct: 34 },
  { topic: 'Medication query', pct: 22 },
  { topic: 'Appointment booking', pct: 19 },
  { topic: 'Lab result interpretation', pct: 15 },
  { topic: 'Other', pct: 10 },
];

const topicColors = ['#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#475569'];

const darkTooltipStyle = {
  backgroundColor: '#0F172A',
  border: '1px solid rgba(51,65,85,0.8)',
  borderRadius: 8,
  fontSize: 11,
  color: '#CBD5E1',
};

const AIMetricsPanel: React.FC = () => (
  <div
    className="rounded-2xl overflow-hidden flex flex-col"
    style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
          <Bot style={{ width: 16, height: 16, color: '#C4B5FD' }} />
        </div>
        <div>
          <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
            AI Platform Analytics
          </div>
          <div style={{ fontSize: 10, color: '#A78BFA' }}>Powered by Claude Sonnet · CeenAiX AI</div>
        </div>
      </div>
      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(51,65,85,0.8)' }}>
        {['Today', 'Week', 'Month'].map((t, i) => (
          <button key={t} className="px-2.5 py-1 text-xs transition-colors" style={{ background: i === 0 ? '#7C3AED' : 'rgba(30,41,59,0.5)', color: i === 0 ? '#fff' : '#94A3B8' }}>
            {t}
          </button>
        ))}
      </div>
    </div>

    <div className="flex flex-1 p-5 gap-5">
      {/* Left: metrics + chart */}
      <div className="flex-1 min-w-0">
        <div className="mb-1" style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace' }}>
          AI CONSULTATIONS
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 26, fontWeight: 700, color: '#C4B5FD', lineHeight: 1 }}>8,921</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 15, color: '#94A3B8', marginTop: 2 }}>127,450 this month</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#64748B' }}>1,247,891 all time</div>

        <div className="mt-3" style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiBarData} margin={{ top: 4, right: 0, left: -32, bottom: 0 }} barSize={14}>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: 'rgba(51,65,85,0.3)' }} />
              <Bar dataKey="sessions" radius={[3, 3, 0, 0]} animationDuration={600}>
                {aiBarData.map((_, i) => (
                  <Cell key={i} fill={i === aiBarData.length - 1 ? '#C4B5FD' : 'rgba(124,58,237,0.5)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: 'Avg response', value: '2.3s', color: '#34D399' },
            { label: 'Satisfaction', value: '4.6/5.0 ⭐', color: '#FCD34D' },
            { label: 'Booking conv.', value: '34.7%', color: '#2DD4BF' },
            { label: 'Escalation rate', value: '0.03%', color: '#34D399' },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: language + topics */}
      <div className="w-44 flex-shrink-0">
        <div className="mb-3">
          <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>
            AI USAGE BY LANGUAGE
          </div>
          {langData.map(l => (
            <div key={l.lang} className="mb-2">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{l.lang}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: l.color }}>{l.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.8)' }}>
                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${l.pct}%`, background: l.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>
            TOP AI TOPICS TODAY
          </div>
          {topicsData.map((t, i) => (
            <div key={t.topic} className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: topicColors[i] }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span style={{ fontSize: 10, color: '#94A3B8' }} className="truncate">{t.topic}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: topicColors[i], flexShrink: 0, marginLeft: 4 }}>{t.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
            12 safety flags today · All reviewed ✅
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
            3 escalated to human doctor (protocol)
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AIMetricsPanel;
