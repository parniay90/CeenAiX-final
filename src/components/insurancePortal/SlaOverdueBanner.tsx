import React, { useState, useEffect } from 'react';
import { X, Phone, ClipboardList } from 'lucide-react';

interface Props {
  onReview: (paId: string) => void;
}

const SlaOverdueBanner: React.FC<Props> = ({ onReview }) => {
  const [overdueMins, setOverdueMins] = useState(17);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setOverdueMins(m => m + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="rounded-xl flex items-center gap-4"
      style={{
        background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
        border: '1px solid #FCA5A5',
        padding: '14px 18px',
        boxShadow: '0 1px 4px rgba(220,38,38,0.08)',
      }}
    >
      {/* Left indicator */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#DC2626' }} />
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          SLA BREACH
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: 4 }}>
            PA-20260407-00912
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#B91C1C' }}>
            +{overdueMins} min past DHA 4h limit
          </span>
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#7F1D1D', marginBottom: 2 }}>
          Coronary Angioplasty (PCI) — Mohammed Ibrahim
        </div>
        <div style={{ fontSize: 12, color: '#991B1B' }}>
          Dr. Omar Al Hassan · City Medical Center · Urgent pre-authorization
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onReview('PA-20260407-00912')}
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
          style={{ background: '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
        >
          <ClipboardList style={{ width: 14, height: 14 }} />
          Review Now
        </button>
        <button
          className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
          style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 13, fontWeight: 600, border: '1px solid #FCA5A5' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FECACA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E2'; }}
        >
          <Phone style={{ width: 13, height: 13 }} />
          Call
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
        >
          <X style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
};

export default SlaOverdueBanner;
