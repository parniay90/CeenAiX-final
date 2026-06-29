import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { INTEGRATIONS } from './types';

interface Props {
  onClose: () => void;
}

const ACTIVE = INTEGRATIONS.filter(i => i.status !== 'planned');

export default function TestAllModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step < ACTIVE.length) {
      const t = setTimeout(() => setStep(s => s + 1), 400);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [step]);

  const pct = Math.round((step / ACTIVE.length) * 100);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-2xl overflow-hidden w-[560px] max-h-[80vh] flex flex-col" style={{ background: '#0F172A', border: '1px solid #334155', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #1E293B' }}>
          <div>
            <div className="font-bold text-white text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Testing All Integrations</div>
            <div className="text-sm text-slate-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              CeenAiX is verifying all {ACTIVE.length} active connections…
            </div>
          </div>
          {done && <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>}
        </div>

        {/* Progress */}
        <div className="px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>
              Testing {Math.min(step + 1, ACTIVE.length)} of {ACTIVE.length}…
            </span>
            <span className="text-xs font-bold text-teal-400" style={{ fontFamily: 'DM Mono, monospace' }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1E293B' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0D9488, #2DD4BF)' }}
            />
          </div>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-1">
          {ACTIVE.slice(0, step).map((integ, i) => (
            <div
              key={integ.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg animate-fade-in"
              style={{ background: 'rgba(30,41,59,0.5)', animationDelay: `${i * 50}ms` }}
            >
              {integ.status === 'degraded'
                ? <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
                : <CheckCircle2 size={13} style={{ color: '#34D399', flexShrink: 0 }} />
              }
              <span className="flex-1 text-xs text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>{integ.name}</span>
              <span
                className="text-xs font-bold"
                style={{ fontFamily: 'DM Mono, monospace', color: integ.status === 'degraded' ? '#F59E0B' : '#34D399' }}
              >
                {integ.status === 'degraded' ? `${integ.responseTime} DEGRADED` : integ.responseTime}
              </span>
            </div>
          ))}

          {!done && step < ACTIVE.length && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(30,41,59,0.5)' }}>
              <RefreshCw size={13} className="animate-spin" style={{ color: '#2DD4BF', flexShrink: 0 }} />
              <span className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Testing {ACTIVE[step]?.name}…
              </span>
            </div>
          )}
        </div>

        {/* Summary */}
        {done && (
          <div className="px-6 py-5 shrink-0" style={{ borderTop: '1px solid #1E293B' }}>
            <div className="text-base font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {ACTIVE.filter(i => i.status === 'healthy').length} ✅ healthy · 1 ⚠️ degraded · 0 ❌ errors
            </div>
            <div className="text-sm text-emerald-400 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              All critical government APIs operational ✅
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ background: 'rgba(51,65,85,0.5)', color: '#94A3B8' }}>
                Close
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ background: '#0D9488', color: '#fff' }}>
                View Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
