import React, { useState, useEffect } from 'react';
import { X, FileText, FileSpreadsheet, Download, Mail, Send, CheckCircle, AlertTriangle, Shield, Loader } from 'lucide-react';
import { ReportCatalogItem, ReportFormat, categoryMeta } from '../../data/reportsData';

interface Props {
  report: ReportCatalogItem | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

type Step = 'config' | 'progress' | 'done';

const FORMAT_ICONS: Record<ReportFormat, React.ReactNode> = {
  'PDF': <FileText size={16} />,
  'Excel': <FileSpreadsheet size={16} />,
  'CSV': <Download size={16} />,
  'DHA XML': <Shield size={16} />,
  'ZIP': <Download size={16} />,
};

const PRESETS = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3' },
  { label: 'Q2 2026', value: 'q2_2026' },
  { label: 'YTD 2026', value: 'ytd' },
  { label: 'Custom', value: 'custom' },
];

const PROGRESS_STEPS = [
  'Validating parameters...',
  'Querying claims database...',
  'Applying filters and aggregations...',
  'Building report structure...',
  'Rendering output format...',
  'Applying PHI masking...',
  'Finalizing report...',
];

export default function GenerateReportModal({ report, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('config');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('last_month');
  const [customFrom, setCustomFrom] = useState('2026-05-01');
  const [customTo, setCustomTo] = useState('2026-05-31');
  const [delivery, setDelivery] = useState<'download' | 'email' | 'dha'>('download');
  const [emailTo, setEmailTo] = useState('');
  const [phiConfirmed, setPhiConfirmed] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [generatedSize] = useState('4.2 MB');

  useEffect(() => {
    if (report) {
      setSelectedFormat(report.formats[0]);
      setStep('config');
      setProgressStep(0);
      setProgressPct(0);
      setPhiConfirmed(false);
      setDelivery('download');
      setEmailTo('');
    }
  }, [report]);

  useEffect(() => {
    if (step !== 'progress') return;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      const pct = Math.min(Math.round((current / (PROGRESS_STEPS.length * 6)) * 100), 98);
      setProgressPct(pct);
      if (current % 6 === 0) {
        setProgressStep(prev => Math.min(prev + 1, PROGRESS_STEPS.length - 1));
      }
      if (current >= PROGRESS_STEPS.length * 6) {
        clearInterval(interval);
        setProgressPct(100);
        setTimeout(() => setStep('done'), 400);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [step]);

  if (!report) return null;

  const meta = categoryMeta[report.category];
  const canGenerate = selectedFormat !== null && (report.isConfidential ? phiConfirmed : true);

  function handleGenerate() {
    setStep('progress');
    setProgressStep(0);
    setProgressPct(0);
  }

  function handleDone() {
    const label = delivery === 'dha' ? 'submitted to DHA' : delivery === 'email' ? 'sent via email' : 'ready to download';
    onSuccess(`${report.title} ${label} successfully`);
    onClose();
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: 580, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={18} color={meta.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 4, padding: '2px 7px', fontFamily: 'DM Mono, monospace' }}>{report.id}</span>
              {report.isDhaRequired && <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 4, padding: '2px 7px' }}>DHA Required</span>}
              {report.isConfidential && <span style={{ fontSize: 11, fontWeight: 600, color: '#7F1D1D', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 4, padding: '2px 7px' }}>Confidential</span>}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{report.title}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{report.description}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 6, display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {step === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Date Range */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Reporting Period</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPreset(p.value)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        background: selectedPreset === p.value ? '#1E3A5F' : '#F8FAFC',
                        color: selectedPreset === p.value ? '#fff' : '#475569',
                        border: selectedPreset === p.value ? '1px solid #1E3A5F' : '1px solid #E2E8F0',
                        transition: 'all 0.15s',
                      }}
                    >{p.label}</button>
                  ))}
                </div>
                {selectedPreset === 'custom' && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>FROM</label>
                      <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>TO</label>
                      <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Format */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Output Format</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {report.formats.map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFormat(f)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                        borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        background: selectedFormat === f ? '#EFF6FF' : '#F8FAFC',
                        color: selectedFormat === f ? '#1E3A5F' : '#475569',
                        border: selectedFormat === f ? '2px solid #1E3A5F' : '1px solid #E2E8F0',
                        transition: 'all 0.15s',
                      }}
                    >
                      {FORMAT_ICONS[f]}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Delivery Method</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([['download', 'Download', Download], ['email', 'Email', Mail], ...(report.isDhaRequired ? [['dha', 'Submit to DHA', Send]] : [])] as [string, string, React.ComponentType<{size: number}>][]).map(([val, label, Icon]) => (
                    <button
                      key={val}
                      onClick={() => setDelivery(val as typeof delivery)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                        borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', flex: 1,
                        background: delivery === val ? '#EFF6FF' : '#F8FAFC',
                        color: delivery === val ? '#1E3A5F' : '#475569',
                        border: delivery === val ? '2px solid #1E3A5F' : '1px solid #E2E8F0',
                        transition: 'all 0.15s', justifyContent: 'center',
                      }}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
                {delivery === 'email' && (
                  <input
                    type="email"
                    placeholder="recipient@daman.ae"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    style={{ marginTop: 10, width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                  />
                )}
                {delivery === 'dha' && (
                  <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: 12, color: '#065F46' }}>
                    Report will be submitted electronically to DHA Health Financing System. A submission ID will be generated upon acceptance.
                  </div>
                )}
              </div>

              {/* PHI confirmation */}
              {report.isConfidential && (
                <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={phiConfirmed}
                      onChange={e => setPhiConfirmed(e.target.checked)}
                      style={{ marginTop: 2, accentColor: '#DC2626', width: 16, height: 16, flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#7F1D1D' }}>Confidential Data Acknowledgement</div>
                      <div style={{ fontSize: 12, color: '#B91C1C', marginTop: 2 }}>
                        This report contains Protected Health Information (PHI). I confirm I am authorized to generate and access this report in accordance with Daman data governance policy and UAE Federal Law No. 2 of 2019 on Personal Data.
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {step === 'progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
              <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24 }}>
                <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={40} cy={40} r={34} fill="none" stroke="#E2E8F0" strokeWidth={5} />
                  <circle cx={40} cy={40} r={34} fill="none" stroke="#1E3A5F" strokeWidth={5}
                    strokeDasharray={`${(progressPct / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.2s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#1E3A5F', fontFamily: 'DM Mono, monospace' }}>
                  {progressPct}%
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Generating Report</div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} />
                {PROGRESS_STEPS[progressStep]}
              </div>
              <div style={{ width: '100%', background: '#F1F5F9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #1E3A5F, #2563EB)', borderRadius: 4, width: `${progressPct}%`, transition: 'width 0.2s ease' }} />
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: '#94A3B8' }}>
                Step {Math.min(progressStep + 1, PROGRESS_STEPS.length)} of {PROGRESS_STEPS.length}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', border: '2px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={30} color="#059669" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Report Ready</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{report.title} has been generated successfully.</div>
              </div>
              <div style={{ display: 'flex', gap: 16, padding: '14px 20px', background: '#F8FAFC', borderRadius: 12, width: '100%' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>FORMAT</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selectedFormat}</div>
                </div>
                <div style={{ width: 1, background: '#E2E8F0' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>SIZE</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'DM Mono, monospace' }}>{generatedSize}</div>
                </div>
                <div style={{ width: 1, background: '#E2E8F0' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>GENERATED</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Just now</div>
                </div>
              </div>
              {delivery === 'dha' && (
                <div style={{ padding: '12px 16px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, width: '100%' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#065F46', marginBottom: 2 }}>DHA Submission ID</div>
                  <div style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: '#0F172A' }}>DHA-2026-06-DN-0042</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                {delivery === 'download' && (
                  <button onClick={handleDone} style={{ flex: 1, padding: '10px 0', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Download size={16} /> Download Report
                  </button>
                )}
                {delivery === 'email' && (
                  <button onClick={handleDone} style={{ flex: 1, padding: '10px 0', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Mail size={16} /> Email Sent
                  </button>
                )}
                {delivery === 'dha' && (
                  <button onClick={handleDone} style={{ flex: 1, padding: '10px 0', background: '#059669', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <CheckCircle size={16} /> Submitted to DHA
                  </button>
                )}
                <button onClick={onClose} style={{ padding: '10px 20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'config' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                padding: '10px 24px', background: canGenerate ? '#1E3A5F' : '#CBD5E1', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: canGenerate ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <FileText size={15} />
              Generate Report
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
