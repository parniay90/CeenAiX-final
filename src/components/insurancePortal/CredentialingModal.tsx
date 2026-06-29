import React, { useState } from 'react';
import { X, Search, CheckCircle, Upload, ChevronRight, Building2, User, Beaker } from 'lucide-react';

const MONO = "'DM Mono', monospace";

interface Props {
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

type ProviderKind = 'Doctor' | 'Hospital' | 'Clinic' | 'Pharmacy' | 'Diagnostic';
type Step = 1 | 2 | 3;

interface DhaResult { found: boolean; name: string; specialty: string; expiry: string; }

const REQUIRED_DOCS = ['Emirates ID', 'DHA License', 'Medical Degree', 'Board Certificate', 'Passport Copy', 'Profile Photo'];

export default function CredentialingModal({ onClose, onToast }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [kind, setKind] = useState<ProviderKind>('Doctor');
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dhaNumber, setDhaNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [dhaResult, setDhaResult] = useState<DhaResult | null>(null);
  const [dhaError, setDhaError] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [tier, setTier] = useState('Standard');
  const [term, setTerm] = useState('1 year');
  const [submitting, setSubmitting] = useState(false);

  const verifyDha = () => {
    if (!dhaNumber.trim()) return;
    setVerifying(true);
    setDhaResult(null);
    setDhaError(false);
    setTimeout(() => {
      setVerifying(false);
      if (dhaNumber.startsWith('DHA')) {
        setDhaResult({ found: true, name: name || 'Dr. [Verified Name]', specialty: 'Cardiology', expiry: '31 December 2026' });
      } else {
        setDhaError(true);
      }
    }, 1800);
  };

  const toggleDoc = (doc: string) => {
    setUploadedDocs(prev => {
      const next = new Set(prev);
      next.has(doc) ? next.delete(doc) : next.add(doc);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      onToast(`${name || 'New provider'} added to credentialing queue · Documents under review`, 'success');
    }, 1800);
  };

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = dhaResult?.found && uploadedDocs.size >= 4;

  const stepLabels = ['Provider Details', 'DHA Verification', 'Contract Terms'];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ width: 600, maxHeight: '90vh', background: '#fff', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', border: '1px solid #E2E8F0' }}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5" style={{ background: '#1E3A5F' }}>
          <div className="flex items-center gap-3">
            <Building2 size={18} color="#93C5FD" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add Provider to Daman Network</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex-shrink-0 px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          {stepLabels.map((label, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? '#16A34A' : active ? '#1E3A5F' : '#E2E8F0', transition: 'background 0.2s' }}>
                    {done ? <CheckCircle size={14} color="#fff" /> : <span style={{ fontSize: 11, fontWeight: 700, color: active ? '#fff' : '#94A3B8', fontFamily: MONO }}>{n}</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#1E293B' : '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{label}</span>
                </div>
                {i < 2 && <ChevronRight size={14} color="#CBD5E1" className="flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <>
              {/* Provider type */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider Type</p>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { kind: 'Doctor' as ProviderKind, icon: '👨‍⚕️' },
                    { kind: 'Hospital' as ProviderKind, icon: '🏥' },
                    { kind: 'Clinic' as ProviderKind, icon: '🏪' },
                    { kind: 'Pharmacy' as ProviderKind, icon: '💊' },
                    { kind: 'Diagnostic' as ProviderKind, icon: '🔬' },
                  ]).map(opt => (
                    <button key={opt.kind} onClick={() => setKind(opt.kind)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{ border: `2px solid ${kind === opt.kind ? '#1E3A5F' : '#E2E8F0'}`, background: kind === opt.kind ? '#EFF6FF' : '#fff', color: kind === opt.kind ? '#1E3A5F' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                      {opt.icon} {opt.kind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="col-span-2">
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>
                    Full Name (English) *
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={kind === 'Doctor' ? 'Dr. Full Name' : 'Facility Name'} className="w-full px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', border: '1px solid #E2E8F0', outline: 'none', color: '#1E293B' }} />
                </div>
                <div className="col-span-2">
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>Full Name (Arabic)</label>
                  <input value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="الاسم بالعربية" dir="rtl" className="w-full px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', border: '1px solid #E2E8F0', outline: 'none', color: '#1E293B' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@clinic.ae" className="w-full px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', border: '1px solid #E2E8F0', outline: 'none', color: '#1E293B' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>Mobile Number</label>
                  <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+971 50 000 0000" className="w-full px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', border: '1px solid #E2E8F0', outline: 'none', color: '#1E293B' }} />
                </div>
              </div>
            </>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <>
              {/* DHA verification */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DHA License Number *
                </label>
                <div className="flex gap-2">
                  <input value={dhaNumber} onChange={e => { setDhaNumber(e.target.value); setDhaResult(null); setDhaError(false); }}
                    placeholder="DHA-PRAC-2024-XXXXXX" className="flex-1 px-3 py-2.5 rounded-xl"
                    style={{ fontFamily: MONO, fontSize: 13, border: '1px solid #E2E8F0', outline: 'none', color: '#0F766E' }} />
                  <button onClick={verifyDha} disabled={verifying || !dhaNumber.trim()}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    style={{ background: verifying ? '#94A3B8' : '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: verifying ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                    {verifying ? (
                      <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Checking…</>
                    ) : (
                      <><Search size={13} /> Verify DHA</>
                    )}
                  </button>
                </div>

                {dhaResult && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>✅ DHA LICENSE VERIFIED</p>
                    <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Specialty: {dhaResult.specialty} · Valid until {dhaResult.expiry}</p>
                  </div>
                )}
                {dhaError && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>❌ License not found in DHA Sheryan database</p>
                    <p style={{ fontSize: 11, color: '#7F1D1D', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>Enter a valid DHA license number. Ensure it starts with "DHA-"</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Required Documents ({uploadedDocs.size}/{REQUIRED_DOCS.length} uploaded)
                </p>
                <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {REQUIRED_DOCS.map(doc => {
                    const done = uploadedDocs.has(doc);
                    return (
                      <button key={doc} onClick={() => toggleDoc(doc)}
                        className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                        style={{ border: `1px solid ${done ? '#BBF7D0' : '#E2E8F0'}`, background: done ? '#F0FDF4' : '#FAFBFC', cursor: 'pointer' }}>
                        {done ? <CheckCircle size={16} color="#16A34A" /> : <Upload size={16} color="#94A3B8" />}
                        <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: done ? '#15803D' : '#64748B', fontWeight: done ? 600 : 400 }}>{doc}</span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 6 }}>Click to simulate upload. PDF/JPG accepted.</p>
              </div>
            </>
          )}

          {/* ─── STEP 3 ─── */}
          {step === 3 && (
            <>
              <div className="grid gap-4">
                {[
                  {
                    label: 'Network Tier', options: ['Standard', 'Premium', 'Preferred'],
                    value: tier, onChange: setTier,
                  },
                  {
                    label: 'Contract Duration', options: ['6 months', '1 year', '2 years', '3 years'],
                    value: term, onChange: setTerm,
                  },
                ].map(field => (
                  <div key={field.label}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{field.label}</p>
                    <div className="flex gap-2 flex-wrap">
                      {field.options.map(opt => (
                        <button key={opt} onClick={() => field.onChange(opt)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ border: `2px solid ${field.value === opt ? '#1E3A5F' : '#E2E8F0'}`, background: field.value === opt ? '#EFF6FF' : '#fff', color: field.value === opt ? '#1E3A5F' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* What happens */}
              <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#15803D', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>Upon approval:</p>
                {[
                  'Provider added to Daman network directory',
                  'CeenAiX provider account activated',
                  'Welcome email sent to provider',
                  'Facility notified',
                  'DHA audit record created',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 mb-1.5">
                    <CheckCircle size={12} color="#16A34A" />
                    <span style={{ fontSize: 11, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <p style={{ fontSize: 11, color: '#92400E', fontFamily: 'Inter, sans-serif' }}>
                  Provider: <strong>{name || '—'}</strong> · Tier: <strong>{tier}</strong> · Term: <strong>{term}</strong> · Start: <strong>8 April 2026</strong>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <button onClick={step === 1 ? onClose : () => setStep(s => (s - 1) as Step)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 3 ? (
            <button onClick={() => setStep(s => (s + 1) as Step)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: (step === 1 ? !canProceedStep1 : !canProceedStep2) ? '#94A3B8' : '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', cursor: (step === 1 ? !canProceedStep1 : !canProceedStep2) ? 'not-allowed' : 'pointer' }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              style={{ background: submitting ? '#94A3B8' : '#16A34A', color: '#fff', fontFamily: 'Inter, sans-serif', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Adding…</>
              ) : (
                '✅ Add to Network'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
