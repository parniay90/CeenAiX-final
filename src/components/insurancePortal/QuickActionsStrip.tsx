import React from 'react';
import { ClipboardList, Check, Shield, BarChart3, Users, Building2 } from 'lucide-react';

const ACTIONS = [
  { label: 'Review Pre-Auths',  sub: '16 pending',   icon: ClipboardList, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', navTarget: 'preauth' },
  { label: 'Bulk Approve',      sub: '244 eligible',  icon: Check,         color: '#059669', bg: '#DCFCE7', border: '#BBF7D0', navTarget: 'claims' },
  { label: 'Review Fraud',      sub: '5 alerts',      icon: Shield,        color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', navTarget: 'fraud' },
  { label: 'Generate Report',   sub: 'Daily summary', icon: BarChart3,     color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', navTarget: 'reports' },
  { label: 'Member Search',     sub: '8,247 active',  icon: Users,         color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE', navTarget: 'members' },
  { label: 'Provider Query',    sub: 'Network lookup', icon: Building2,    color: '#0D9488', bg: '#CCFBF1', border: '#99F6E4', navTarget: 'network' },
];

interface Props {
  onNavigate: (page: string) => void;
}

const QuickActionsStrip: React.FC<Props> = ({ onNavigate }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
      Quick Actions
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {ACTIONS.map(action => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onNavigate(action.navTarget)}
            className="rounded-xl flex items-center gap-3 transition-all"
            style={{
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              padding: '12px 14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = action.bg;
              e.currentTarget.style.borderColor = action.border;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: action.bg, color: action.color }}
            >
              <Icon style={{ width: 16, height: 16 }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {action.label}
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                {action.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default QuickActionsStrip;
