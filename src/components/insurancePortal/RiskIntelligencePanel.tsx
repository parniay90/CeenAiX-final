import React from 'react';
import { Bot, Mail, User, FileText } from 'lucide-react';
import type { RiskInsight } from '../../types/insurancePortal';

interface Props {
  insights: RiskInsight[];
}

const InsightCard: React.FC<{ insight: RiskInsight }> = ({ insight }) => {
  const config = {
    PREVENTIVE: {
      bg: '#F0FDF4',
      border: '#BBF7D0',
      titleColor: '#065F46',
      icon: '💡',
      costColor: '#059669',
      actionBg: '#EDE9FE',
      actionColor: '#5B21B6',
    },
    CLUSTER: {
      bg: '#FFFBEB',
      border: '#FDE68A',
      titleColor: '#92400E',
      icon: '⚠',
      costColor: '#D97706',
      actionBg: '#FFFBEB',
      actionColor: '#92400E',
    },
    PROVIDER: {
      bg: '#EFF6FF',
      border: '#BFDBFE',
      titleColor: '#1E40AF',
      icon: '✅',
      costColor: '#2563EB',
      actionBg: '#EFF6FF',
      actionColor: '#1D4ED8',
    },
  }[insight.type];

  return (
    <div
      className="rounded-xl p-3.5"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <p className="font-bold mb-1" style={{ color: config.titleColor, fontSize: 11 }}>
        {config.icon} {insight.title}
      </p>
      <p className="text-slate-600 leading-relaxed mb-2.5" style={{ fontSize: 12 }}>
        {insight.body}
      </p>
      {insight.costImpact && (
        <p className="font-bold mb-2.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: config.costColor }}>
          {insight.costImpact}
        </p>
      )}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors hover:opacity-80"
          style={{ background: config.actionBg, color: config.actionColor, fontSize: 11 }}
        >
          <Mail size={11} />
          {insight.actionLabel}
        </button>
        {insight.actionSecondary && (
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors hover:bg-slate-200"
            style={{ background: '#F1F5F9', color: '#475569', fontSize: 11 }}
          >
            <User size={11} />
            {insight.actionSecondary}
          </button>
        )}
        {insight.type === 'PROVIDER' && (
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors hover:opacity-80"
            style={{ background: config.actionBg, color: config.actionColor, fontSize: 11 }}
          >
            <FileText size={11} />
            View Provider Profile
          </button>
        )}
      </div>
    </div>
  );
};

const RiskIntelligencePanel: React.FC<Props> = ({ insights }) => {
  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: '4px solid #7C3AED' }}
    >
      <div className="flex items-start gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDE9FE' }}>
          <Bot size={15} style={{ color: '#7C3AED' }} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>
            AI Risk Intelligence
          </h3>
          <p className="text-slate-400" style={{ fontSize: 11 }}>
            Powered by CeenAiX AI · Risk management insights
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default RiskIntelligencePanel;
