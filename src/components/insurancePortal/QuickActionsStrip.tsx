import React from 'react';
import {
  ClipboardList, Check, Shield, BarChart3, Users, Building2,
} from 'lucide-react';

interface Action {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  navTarget: string;
}

const ACTIONS: Action[] = [
  { label: 'Review Pre-Auths', icon: <ClipboardList size={20} />, color: '#D97706', bg: '#FEF3C7', navTarget: 'preauth' },
  { label: 'Bulk Approve', icon: <Check size={20} />, color: '#059669', bg: '#D1FAE5', navTarget: 'claims' },
  { label: 'Review Fraud', icon: <Shield size={20} />, color: '#DC2626', bg: '#FEE2E2', navTarget: 'fraud' },
  { label: 'Generate Report', icon: <BarChart3 size={20} />, color: '#0F2D4A', bg: '#E0E7FF', navTarget: 'reports' },
  { label: 'Member Search', icon: <Users size={20} />, color: '#2563EB', bg: '#DBEAFE', navTarget: 'members' },
  { label: 'Provider Query', icon: <Building2 size={20} />, color: '#0D9488', bg: '#CCFBF1', navTarget: 'network' },
];

interface Props {
  onNavigate: (page: string) => void;
}

const QuickActionsStrip: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {ACTIONS.map(action => (
        <button
          key={action.label}
          onClick={() => onNavigate(action.navTarget)}
          className="bg-white rounded-xl flex items-center gap-3 px-4 py-3.5 transition-all hover:shadow-md group"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#BFDBFE';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fff';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#F1F5F9';
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ background: action.bg, color: action.color }}
          >
            {action.icon}
          </div>
          <span className="font-bold text-slate-700 text-left leading-tight" style={{ fontSize: 12 }}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsStrip;
