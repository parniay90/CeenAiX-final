import React, { useState } from 'react';
import { X, Download, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  totalClaims: number;
  totalValue: number;
  approvedClaims: number;
  selectedClaims: number;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

const EOBExportModal: React.FC<Props> = ({ totalClaims, totalValue, approvedClaims, selectedClaims, onClose, onToast }) => {
  const [scope, setScope] = useState<'all' | 'approved' | 'selected'>('all');
  const [recipient, setRecipient] = useState<'providers' | 'patients' | 'both' | 'download'>('providers');
  const [format, setFormat] = useState<'pdf_individual' | 'pdf_batch' | 'csv' | 'dha_xml'>('pdf_individual');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const scopeCount = scope === 'all' ? totalClaims : scope === 'approved' ? approvedClaims : selectedClaims;
  const scopeValue = scope === 'all' ? totalValue : scope === 'approved' ? Math.round(totalValue * 0.75) : Math.round(totalValue * 0.05);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setDone(true);
          onToast(`EOB batch ready — ${scopeCount} claims · 47.2 MB ZIP`, 'info');
          return 100;
        }
        return p + 8;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center" style={{ background: 'rgba(15,45,74,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ width: 480, maxHeight: '85vh', background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '16px 20px', background: '#1E3A5F', borderBottom: '1px solid #2D4A6F' }}>
          <div className="flex items-center gap-2">
            <FileText style={{ width: 16, height: 16, color: '#93C5FD' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Export Explanation of Benefits</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Generate EOBs for claims in selected range</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Scope */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scope</div>
            <div className="space-y-2">
              {([
                ['all', `All claims today (${totalClaims}) — AED ${totalValue.toLocaleString()}`],
                ['approved', `Approved claims only (${approvedClaims})`],
                ['selected', `Selected claims only (${selectedClaims})`],
              ] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" checked={scope === val} onChange={() => setScope(val)} style={{ accentColor: '#1E3A5F' }} />
                  <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient</div>
            <div className="space-y-2">
              {([
                ['patients', 'Patients only (send to patient emails)'],
                ['providers', 'Providers only (send to clinic billing emails)'],
                ['both', 'Both patients and providers'],
                ['download', 'Download ZIP only (no email)'],
              ] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" checked={recipient === val} onChange={() => setRecipient(val)} style={{ accentColor: '#1E3A5F' }} />
                  <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Format</div>
            <div className="space-y-2">
              {([
                ['pdf_individual', 'PDF (individual EOBs)'],
                ['pdf_batch', 'PDF (batch single file)'],
                ['csv', 'CSV (raw claims data)'],
                ['dha_xml', 'DHA eClaims format (XML)'],
              ] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" checked={format === val} onChange={() => setFormat(val)} style={{ accentColor: '#1E3A5F' }} />
                  <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DHA compliance note */}
          <div className="rounded-lg p-3" style={{ background: '#F0FDFA', border: '1px solid #99F6E4' }}>
            <div className="flex items-start gap-2">
              <CheckCircle2 style={{ width: 13, height: 13, color: '#0D9488', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: '#065F46', lineHeight: 1.5 }}>
                EOBs are in DHA eClaims v3.2 format ✅ Retained for 10 years per UAE Medical Records Law.
              </p>
            </div>
          </div>

          {/* Progress */}
          {generating && (
            <div className="rounded-lg p-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: 12, color: '#1E40AF', marginBottom: 6 }}>
                Generating {scopeCount} EOBs... (estimated 45 seconds)
              </div>
              <div className="rounded-full" style={{ height: 6, background: '#DBEAFE' }}>
                <div className="rounded-full transition-all" style={{ height: 6, width: `${progress}%`, background: '#0D9488' }} />
              </div>
            </div>
          )}

          {done && (
            <div className="rounded-lg p-3" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 style={{ width: 14, height: 14, color: '#059669' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>Download ready — 47.2 MB ZIP</span>
              </div>
              <button
                onClick={() => { onToast('EOB ZIP downloaded', 'success'); onClose(); }}
                className="w-full rounded-lg py-2 flex items-center justify-center gap-2"
                style={{ background: '#059669', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                <Download style={{ width: 13, height: 13 }} /> Download ZIP Now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex gap-2" style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
          {!done && (
            <>
              <button onClick={handleGenerate} disabled={generating}
                className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors"
                style={{ background: generating ? '#94A3B8' : '#1E3A5F', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                <Download style={{ width: 14, height: 14 }} />
                {generating ? 'Generating...' : 'Download ZIP Now'}
              </button>
              <button
                onClick={() => { onToast('EOB batch scheduled for 8 PM tonight', 'info'); onClose(); }}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 transition-colors"
                style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 12 }}>
                <Mail style={{ width: 13, height: 13 }} />
                Schedule email
              </button>
            </>
          )}
          {done && (
            <button onClick={onClose} className="flex-1 rounded-xl py-2.5"
              style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 13 }}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EOBExportModal;
