import { useState } from 'react';
import { AlertTriangle, ChevronRight, CheckCircle, Search, X } from 'lucide-react';
import { ANOMALY_FEED } from '../../data/auditLogsData';
import { A, SeverityChip } from './AuditPrimitives';

export function AnomalyPanel({ onClose }: { onClose: () => void }) {
  const [anomalies, setAnomalies] = useState(ANOMALY_FEED);

  const acknowledge = (id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' as const } : a));
  };

  return (
    <div className="w-72 flex-shrink-0 flex flex-col" style={{ background: A.bg2, borderLeft: `1px solid ${A.border}` }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${A.border}` }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} style={{ color: '#F87171' }} />
          <span className="text-sm font-semibold" style={{ color: A.text1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Anomalies</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: A.errorBg, color: A.errorLight }}>
            {anomalies.filter(a => a.status === 'Open').length}
          </span>
        </div>
        <button onClick={onClose} style={{ color: A.text3 }}>
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {anomalies.map(a => (
          <div key={a.id} className="p-3 transition-colors" style={{ borderBottom: `1px solid ${A.border}` }}>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <SeverityChip severity={a.severity} />
              <span className="text-[9px]" style={{ color: A.text3 }}>{a.time}</span>
            </div>
            <div className="text-[10px] mb-2 leading-snug" style={{ color: A.text1 }}>{a.summary}</div>
            <div className="flex items-center gap-1.5">
              {a.status === 'Open' ? (
                <>
                  <button onClick={() => acknowledge(a.id)} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-lg flex-1 justify-center"
                    style={{ background: A.successBg, color: A.successLight, border: `1px solid rgba(5,150,105,0.2)` }}>
                    <CheckCircle size={8} /> Ack
                  </button>
                  <button className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-lg flex-1 justify-center"
                    style={{ background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }}>
                    <Search size={8} /> Investigate
                  </button>
                  <button className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-lg"
                    style={{ background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>
                    <X size={8} /> FP
                  </button>
                </>
              ) : (
                <span className="text-[9px] flex items-center gap-1" style={{ color: a.status === 'Acknowledged' ? A.successLight : A.warningLight }}>
                  {a.status === 'Acknowledged' ? <CheckCircle size={9} /> : <Search size={9} />}
                  {a.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${A.border}` }}>
        <button className="w-full flex items-center justify-center gap-1.5 text-[10px] py-2 rounded-lg"
          style={{ background: A.bg1, color: A.text2, border: `1px solid ${A.border}` }}>
          View all anomalies <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}
