import React, { useState, useEffect } from 'react';
import { AlertOctagon, ClipboardList, Phone } from 'lucide-react';

interface Props {
  onReview: (paId: string) => void;
}

const SlaOverdueBanner: React.FC<Props> = ({ onReview }) => {
  const [overdueMins, setOverdueMins] = useState(17);

  useEffect(() => {
    const interval = setInterval(() => {
      setOverdueMins(m => m + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-5 py-4 mb-5"
      style={{ background: '#FFF5F5', border: '2px solid #FCA5A5' }}
    >
      <AlertOctagon style={{ width: 32, height: 32, color: '#DC2626', flexShrink: 0 }} className="animate-pulse" />

      <div className="flex-shrink-0">
        <div style={{ fontSize: 14, fontWeight: 700, color: '#991B1B', marginBottom: 2 }}>
          PRE-AUTH SLA BREACHED
        </div>
        <div style={{ fontSize: 12, color: '#DC2626' }}>
          DHA requires response within 4 hours for urgent pre-authorizations
        </div>
      </div>

      <div className="flex-1 px-5" style={{ borderLeft: '1px solid #FECACA', borderRight: '1px solid #FECACA' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700, color: '#991B1B', marginBottom: 2 }}>
          PA-20260407-00912
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: '#7F1D1D', marginBottom: 2 }}>
          Coronary Angioplasty (PCI) — Mohammed Ibrahim
        </div>
        <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 4 }}>
          Dr. Omar Al Hassan · City Medical Center · Urgent pre-auth
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700, color: '#DC2626' }}>
          OVERDUE: {overdueMins} minute{overdueMins !== 1 ? 's' : ''} past 4h DHA limit
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={() => onReview('PA-20260407-00912')}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors"
          style={{ background: '#DC2626', color: '#fff', fontSize: 13, fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
        >
          <ClipboardList style={{ width: 14, height: 14 }} />
          Review Now
        </button>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 transition-colors"
          style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 13, border: '1px solid #FECACA' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FECACA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E2'; }}
        >
          <Phone style={{ width: 14, height: 14 }} />
          Call Doctor
        </button>
      </div>
    </div>
  );
};

export default SlaOverdueBanner;
