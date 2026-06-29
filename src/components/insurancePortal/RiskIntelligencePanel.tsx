import React from 'react';
import { Bot, Mail, User, FileText } from 'lucide-react';
import type { RiskInsight } from '../../types/insurancePortal';

interface Props {
  insights: RiskInsight[];
}

const typeConfig = {
  PREVENTIVE: {
    accent: '#059669',
    iconBg: '#DCFCE7',
    iconColor: '#059669',
    tagBg: '#DCFCE7',
    tagColor: '#065F46',
    tag: 'Preventive',
    cardBg: '#F0FDF4',
    border: '#BBF7D0',
  },
  CLUSTER: {
    accent: '#D97706',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    tagBg: '#FEF3C7',
    tagColor: '#92400E',
    tag: 'Cluster',
    cardBg: '#FFFBEB',
    border: '#FDE68A',
  },
  PROVIDER: {
    accent: '#2563EB',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
    tag: 'Provider',
    cardBg: '#EFF6FF',
    border: '#BFDBFE',
  },
};

const InsightCard: React.FC<{ insight: RiskInsight }> = ({ insight }) => {
  const cfg = typeConfig[insight.type];
  return (
    <div
      className="rounded-lg p-3"
      style={{ background: cfg.cardBg, border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.accent}` }}
    >
      <div className="flex items-start gap-2 mb-2">
        <span
          className="rounded px-1.5 py-0.5 flex-shrink-0"
          style={{ fontSize: 10, fontWeight: 700, color: cfg.tagColor, background: cfg.tagBg, fontFamily: 'DM Mono, monospace' }}
        >
          {cfg.tag.toUpperCase()}
        </span>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{insight.title}</p>
      </div>
      <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, marginBottom: insight.costImpact ? 6 : 8 }}>
        {insight.body}
      </p>
      {insight.costImpact && (
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: cfg.accent, marginBottom: 8 }}>
          {insight.costImpact}
        </p>
      )}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 transition-opacity hover:opacity-80"
          style={{ background: cfg.iconBg, color: cfg.iconColor, fontSize: 11, fontWeight: 600 }}
        >
          <Mail style={{ width: 10, height: 10 }} />
          {insight.actionLabel}
        </button>
        {insight.actionSecondary && (
          <button
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors hover:bg-slate-200"
            style={{ background: '#F1F5F9', color: '#475569', fontSize: 11, fontWeight: 600 }}
          >
            <User style={{ width: 10, height: 10 }} />
            {insight.actionSecondary}
          </button>
        )}
        {insight.type === 'PROVIDER' && (
          <button
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 transition-opacity hover:opacity-80"
            style={{ background: cfg.iconBg, color: cfg.iconColor, fontSize: 11, fontWeight: 600 }}
          >
            <FileText style={{ width: 10, height: 10 }} />
            Provider Profile
          </button>
        )}
      </div>
    </div>
  );
};

const RiskIntelligencePanel: React.FC<Props> = ({ insights }) => (
  <div
    className="rounded-xl"
    style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '3px solid #7C3AED', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-center gap-2.5 px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EDE9FE' }}>
        <Bot style={{ width: 13, height: 13, color: '#7C3AED' }} />
      </div>
      <div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.2 }}>
          AI Risk Intelligence
        </div>
        <div style={{ fontSize: 10, color: '#94A3B8' }}>Powered by CeenAiX</div>
      </div>
    </div>
    <div className="p-4 space-y-3">
      {insights.map(insight => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  </div>
);

export default RiskIntelligencePanel;
