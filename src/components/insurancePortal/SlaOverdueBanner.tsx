import React from 'react';
import { AlarmClock, Phone } from 'lucide-react';

interface Props {
  onReview: () => void;
}

const SlaOverdueBanner: React.FC<Props> = ({ onReview }) => {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-5 py-4 animate-pulse"
      style={{
        background: '#FEF2F2',
        border: '2px solid #FCA5A5',
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <AlarmClock size={32} className="text-red-600" />
      </div>

      {/* Left text */}
      <div className="flex-shrink-0">
        <p className="font-bold text-red-700" style={{ fontSize: 14 }}>
          ⚠ PRE-AUTH SLA BREACHED
        </p>
        <p className="text-red-500" style={{ fontSize: 11 }}>
          DHA requires response within 4 hours for urgent pre-authorizations
        </p>
      </div>

      {/* Center */}
      <div className="flex-1">
        <p className="font-bold text-red-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>
          PA-20260407-00912
        </p>
        <p className="font-bold text-red-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>
          Coronary Angioplasty (PCI) — Mohammed Ibrahim
        </p>
        <p className="text-red-600" style={{ fontSize: 12 }}>Dr. Omar Al Hassan · Urgent pre-auth</p>
        <p className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#DC2626' }}>
          OVERDUE: 17 minutes past 4h DHA limit
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onReview}
          className="flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-xl transition-colors hover:bg-red-700"
          style={{ background: '#DC2626', fontSize: 13 }}
        >
          📋 Review Now
        </button>
        <button
          className="flex items-center gap-2 font-bold px-3 py-2.5 rounded-xl transition-colors hover:bg-red-100"
          style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 13 }}
        >
          <Phone size={14} />
          Call Doctor
        </button>
      </div>
    </div>
  );
};

export default SlaOverdueBanner;
