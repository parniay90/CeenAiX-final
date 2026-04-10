import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import SettingsToggle from './SettingsToggle';

export type RowType = 'toggle' | 'value' | 'pills' | 'danger' | 'info' | 'link';

interface Pill {
  label: string;
  value: string;
}

interface SettingsRowProps {
  label: string;
  description?: string;
  type: RowType;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  toggleDisabled?: boolean;
  toggleBadge?: string;
  value?: string;
  onValueClick?: () => void;
  pills?: Pill[];
  activePill?: string;
  onPillChange?: (val: string) => void;
  onLinkClick?: () => void;
  dangerous?: boolean;
  last?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  type,
  toggleValue,
  onToggle,
  toggleDisabled,
  toggleBadge,
  value,
  onValueClick,
  pills,
  activePill,
  onPillChange,
  onLinkClick,
  dangerous,
  last,
}) => {
  return (
    <div
      className={`flex items-center px-6 py-4 min-h-[56px] transition-colors duration-100 hover:bg-[#F9FFFE] group ${
        !last ? 'border-b border-slate-50' : ''
      } ${(type === 'value' || type === 'link' || type === 'danger') ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (type === 'value' && onValueClick) onValueClick();
        if (type === 'link' && onLinkClick) onLinkClick();
        if (type === 'danger' && onValueClick) onValueClick();
      }}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={`text-[14px] font-medium ${dangerous ? 'text-red-600' : 'text-slate-900'}`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </p>
        {description && (
          <p className="text-[12px] text-slate-400 mt-0.5 leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {type === 'toggle' && (
          <>
            {toggleBadge && (
              <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100 font-medium">
                {toggleBadge}
              </span>
            )}
            <SettingsToggle
              enabled={toggleValue ?? false}
              onChange={onToggle ?? (() => {})}
              disabled={toggleDisabled}
            />
          </>
        )}

        {type === 'value' && (
          <>
            <span
              className="text-[13px] text-slate-500 font-mono"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {value}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
          </>
        )}

        {type === 'pills' && pills && (
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
            {pills.map((pill) => (
              <button
                key={pill.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onPillChange?.(pill.value);
                }}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  activePill === pill.value
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {type === 'info' && (
          <span
            className="text-[13px] text-slate-500"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {value}
          </span>
        )}

        {type === 'link' && (
          <ExternalLink className="w-4 h-4 text-teal-500" />
        )}

        {type === 'danger' && (
          <ChevronRight className="w-4 h-4 text-red-400" />
        )}
      </div>
    </div>
  );
};

export default SettingsRow;
