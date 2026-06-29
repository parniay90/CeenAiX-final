import React, { useState } from 'react';
import { X, Search, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Upload, User, FileText, Stethoscope } from 'lucide-react';

interface Props {
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

const PLANS = ['Gold', 'Silver', 'Basic', 'Thiqa', 'Enhanced'];
const CLAIM_TYPES = ['Consultation', 'Lab', 'Radiology', 'Pharmacy', 'Surgery', 'Emergency', 'Physiotherapy', 'Specialist'];
const DOCTORS = [
  'Dr. Ahmed Al Rashidi — Cardiology — Al Noor Medical Center',
  'Dr. Fatima Al Zaabi — General Practice — Mediclinic City Hospital',
  'Dr. Mohammed Hasan — Orthopedics — Cleveland Clinic Abu Dhabi',
  'Dr. Layla Al Muhairi — Dermatology — Burjeel Hospital',
  'Dr. Khalid Ibrahim — Ophthalmology — Al Zahra Hospital',
  'Dr. Sara Ahmed — Oncology — American Hospital Dubai',
];
const ICD10_SUGGESTIONS = [
  { code: 'I10', desc: 'Essential (primary) hypertension' },
  { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
  { code: 'M54.5', desc: 'Low back pain' },
  { code: 'J06.9', desc: 'Acute upper respiratory infection' },
  { code: 'K21.0', desc: 'Gastro-esophageal reflux disease with oesophagitis' },
  { code: 'Z00.00', desc: 'Encounter for general adult medical examination' },
];

const DENY_REASONS = ['Not covered', 'No PA', 'Duplicate', 'Out of network', 'Limit exceeded'];

const stepLabels = ['Patient & Policy', 'Service Details', 'Review & Submit'];

const ManualClaimModal: React.FC<Props> = ({ onClose, onToast }) => {
  const [step, setStep] = useState(0);

  // Step 1 state
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [serviceDate, setServiceDate] = useState('2026-06-23');
  const [claimType, setClaimType] = useState('Consultation');
  const [policyNum, setPolicyNum] = useState('');

  // Step 2 state
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [icd10Search, setIcd10Search] = useState('');
  const [selectedIcd10, setSelectedIcd10] = useState<{ code: string; desc: string } | null>(null);
  const [cpt, setCpt] = useState('');
  const [grossAmount, setGrossAmount] = useState('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  // Step 3 state
  const [aiChecking, setAiChecking] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [aiResult, setAiResult] = useState<'eligible' | 'flag' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const gross = parseFloat(grossAmount) || 0;
  const copay = Math.round(gross * 0.1);
  const damanPays = gross - copay;

  const step1Valid = !!selectedPatient && !!serviceDate && !!claimType;
  const step2Valid = !!selectedDoctor && !!selectedIcd10 && gross > 0;

  const runAiCheck = () => {
    setAiChecking(true);
    setTimeout(() => {
      setAiChecking(false);
      setAiDone(true);
      setAiResult(gross > 5000 ? 'flag' : 'eligible');
    }, 1800);
  };

  const handleNext = () => {
    if (step === 1) runAiCheck();
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onToast('Manual claim CLM-00999 submitted for review', 'success');
      setSubmitting(false);
      onClose();
    }, 900);
  };

  const mockPatients = [
    'Parnia Yazdkhasti — DAM-2024-IND-047821 — Gold',
    'Mohammed Al Shamsi — DAM-2024-GRP-112344 — Basic',
    'Hassan Al Mansoori — DAM-2024-IND-098234 — Gold',
    'Noura Al Ketbi — DAM-2024-IND-023451 — Silver',
    'Omar Al Hassan — DAM-2024-IND-071199 — Basic',
  ].filter(p => !patientSearch || p.toLowerCase().includes(patientSearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center" style={{ background: 'rgba(15,45,74,0.55)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ width: 600, maxHeight: '90vh', background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '16px 20px', background: '#1E3A5F', borderBottom: '1px solid #2D4A6F' }}>
          <div className="flex items-center gap-2">
            <FileText style={{ width: 16, height: 16, color: '#93C5FD' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Submit Manual Claim</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>New claim entry — CeenAiX AI eligibility check</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex-shrink-0 flex items-center" style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full" style={{
                  width: 24, height: 24,
                  background: i < step ? '#059669' : i === step ? '#1E3A5F' : '#E2E8F0',
                  color: i <= step ? '#fff' : '#94A3B8',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {i < step ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 400, color: i === step ? '#1E3A5F' : i < step ? '#059669' : '#94A3B8' }}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? '#059669' : '#E2E8F0', margin: '0 8px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* STEP 1 */}
          {step === 0 && (
            <>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>PATIENT SEARCH</label>
                <div className="relative">
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#94A3B8' }} />
                  <input
                    value={patientSearch}
                    onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }}
                    placeholder="Search by name or policy number..."
                    className="w-full rounded-lg outline-none"
                    style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
                  />
                </div>
                {patientSearch && !selectedPatient && (
                  <div className="rounded-lg overflow-hidden mt-1" style={{ border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    {mockPatients.length === 0 ? (
                      <div style={{ padding: '10px 12px', fontSize: 12, color: '#94A3B8' }}>No patients found</div>
                    ) : mockPatients.map(p => (
                      <button key={p} onClick={() => { setSelectedPatient(p); setPatientSearch(p.split(' — ')[0]); }}
                        className="w-full text-left transition-colors"
                        style={{ padding: '9px 12px', fontSize: 12, color: '#0F172A', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'block' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                        <div style={{ fontWeight: 600 }}>{p.split(' — ')[0]}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{p.split(' — ').slice(1).join(' · ')}</div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedPatient && (
                  <div className="rounded-lg p-3 mt-2 flex items-center gap-2" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                    <CheckCircle2 style={{ width: 13, height: 13, color: '#059669', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{selectedPatient.split(' — ')[0]}</div>
                      <div style={{ fontSize: 11, color: '#6EE7B7' }}>{selectedPatient.split(' — ').slice(1).join(' · ')}</div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>POLICY NUMBER (optional override)</label>
                <input value={policyNum} onChange={e => setPolicyNum(e.target.value)} placeholder="DAM-2024-IND-XXXXXX"
                  className="w-full rounded-lg outline-none"
                  style={{ padding: '8px 12px', fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>SERVICE DATE</label>
                  <input type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)}
                    className="w-full rounded-lg outline-none"
                    style={{ padding: '8px 12px', fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>CLAIM TYPE</label>
                  <select value={claimType} onChange={e => setClaimType(e.target.value)}
                    className="w-full rounded-lg outline-none appearance-none"
                    style={{ padding: '8px 12px', fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}>
                    {CLAIM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <>
              <div className="relative">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>PROVIDER / DOCTOR</label>
                <div className="relative">
                  <Stethoscope style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#94A3B8' }} />
                  <input value={doctorSearch}
                    onChange={e => { setDoctorSearch(e.target.value); setSelectedDoctor(null); setShowDoctorDropdown(true); }}
                    onFocus={() => setShowDoctorDropdown(true)}
                    placeholder="Search CeenAiX doctors..."
                    className="w-full rounded-lg outline-none"
                    style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
                {showDoctorDropdown && !selectedDoctor && (
                  <div className="rounded-lg overflow-hidden mt-1" style={{ border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'absolute', width: '100%', zIndex: 10, background: '#fff' }}>
                    {DOCTORS.filter(d => !doctorSearch || d.toLowerCase().includes(doctorSearch.toLowerCase())).map(d => (
                      <button key={d} onClick={() => { setSelectedDoctor(d); setDoctorSearch(d.split(' — ')[0]); setShowDoctorDropdown(false); }}
                        className="w-full text-left"
                        style={{ padding: '8px 12px', fontSize: 12, color: '#0F172A', borderBottom: '1px solid #F1F5F9', display: 'block', background: '#fff' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                        <div style={{ fontWeight: 600 }}>{d.split(' — ')[0]}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{d.split(' — ').slice(1).join(' · ')}</div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedDoctor && (
                  <div className="rounded-lg p-2.5 mt-2 flex items-center gap-2" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <CheckCircle2 style={{ width: 12, height: 12, color: '#2563EB', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>{selectedDoctor}</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>ICD-10 DIAGNOSIS CODE</label>
                <div className="relative">
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#94A3B8' }} />
                  <input value={icd10Search}
                    onChange={e => { setIcd10Search(e.target.value); setSelectedIcd10(null); setShowIcdDropdown(true); }}
                    onFocus={() => setShowIcdDropdown(true)}
                    placeholder="Search ICD-10 codes..."
                    className="w-full rounded-lg outline-none"
                    style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
                {showIcdDropdown && !selectedIcd10 && (
                  <div className="rounded-lg overflow-hidden mt-1" style={{ border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'absolute', width: '100%', zIndex: 10, background: '#fff' }}>
                    {ICD10_SUGGESTIONS.filter(s => !icd10Search || s.code.toLowerCase().includes(icd10Search.toLowerCase()) || s.desc.toLowerCase().includes(icd10Search.toLowerCase())).map(s => (
                      <button key={s.code} onClick={() => { setSelectedIcd10(s); setIcd10Search(`${s.code} — ${s.desc}`); setShowIcdDropdown(false); }}
                        className="w-full text-left"
                        style={{ padding: '8px 12px', fontSize: 12, color: '#0F172A', borderBottom: '1px solid #F1F5F9', display: 'block', background: '#fff' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#2563EB', marginRight: 8 }}>{s.code}</span>
                        <span style={{ color: '#475569' }}>{s.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>CPT CODE (optional)</label>
                  <input value={cpt} onChange={e => setCpt(e.target.value)} placeholder="e.g. 99213"
                    className="w-full rounded-lg outline-none"
                    style={{ padding: '8px 12px', fontSize: 13, fontFamily: 'DM Mono, monospace', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>GROSS AMOUNT (AED)</label>
                  <input type="number" value={grossAmount} onChange={e => setGrossAmount(e.target.value)} placeholder="0.00" min="0"
                    className="w-full rounded-lg outline-none"
                    style={{ padding: '8px 12px', fontSize: 13, fontFamily: 'DM Mono, monospace', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
              </div>

              {gross > 0 && (
                <div className="rounded-lg p-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>CALCULATED SPLIT (10% co-pay)</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['Gross', gross], ['Co-pay (patient)', copay], ['Daman pays', damanPays]].map(([label, val]) => (
                      <div key={String(label)}>
                        <div style={{ fontSize: 9, color: '#6EE7B7', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700, color: '#065F46' }}>AED {Number(val).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>SUPPORTING DOCUMENTS</label>
                <div
                  onClick={() => setFileUploaded(true)}
                  className="rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors"
                  style={{ padding: '20px', border: `2px dashed ${fileUploaded ? '#059669' : '#CBD5E1'}`, background: fileUploaded ? '#F0FDF4' : '#F8FAFC' }}>
                  {fileUploaded ? (
                    <>
                      <CheckCircle2 style={{ width: 18, height: 18, color: '#059669' }} />
                      <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>3 files attached</span>
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: 18, height: 18, color: '#94A3B8' }} />
                      <span style={{ fontSize: 12, color: '#64748B' }}>Click to upload referral, SOAP notes, lab results</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <>
              {/* Summary card */}
              <div className="rounded-xl p-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1E40AF', marginBottom: 10 }}>CLAIM SUMMARY</div>
                <div className="grid grid-cols-2 gap-y-3">
                  {[
                    ['Patient', selectedPatient?.split(' — ')[0] ?? '—'],
                    ['Service Date', serviceDate],
                    ['Claim Type', claimType],
                    ['Doctor', selectedDoctor?.split(' — ')[0] ?? '—'],
                    ['Diagnosis', selectedIcd10 ? `${selectedIcd10.code} — ${selectedIcd10.desc}` : '—'],
                    ['CPT', cpt || '—'],
                    ['Gross Amount', `AED ${gross.toLocaleString()}`],
                    ['Co-pay (10%)', `AED ${copay.toLocaleString()}`],
                    ['Daman Pays', `AED ${damanPays.toLocaleString()}`],
                    ['Documents', fileUploaded ? '3 files attached' : 'None'],
                  ].map(([k, v]) => (
                    <div key={String(k)}>
                      <div style={{ fontSize: 10, color: '#93C5FD', marginBottom: 1 }}>{k}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', fontFamily: ['Gross Amount', 'Co-pay (10%)', 'Daman Pays'].includes(String(k)) ? 'DM Mono, monospace' : 'inherit' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI check */}
              {aiChecking && (
                <div className="rounded-lg p-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: 12, color: '#1E40AF', marginBottom: 6 }}>CeenAiX eligibility check running...</div>
                  <div className="rounded-full overflow-hidden" style={{ height: 4, background: '#DBEAFE' }}>
                    <div className="rounded-full" style={{ height: 4, width: '60%', background: '#2563EB', animation: 'pulse 1s infinite' }} />
                  </div>
                </div>
              )}

              {aiDone && aiResult === 'eligible' && (
                <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#059669', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>AI Check: Eligible</div>
                    <p style={{ fontSize: 11, color: '#6EE7B7', marginTop: 2 }}>Policy active · Service covered · No duplicate detected · PA not required for this service type</p>
                  </div>
                </div>
              )}

              {aiDone && aiResult === 'flag' && (
                <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: '#D97706', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>AI Check: Pre-Authorization Required</div>
                    <p style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>Amount exceeds AED 5,000 threshold — PA may be required. Claim will be routed for manual review.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex gap-2" style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 transition-colors"
              style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', fontSize: 12 }}>
              <ChevronLeft style={{ width: 13, height: 13 }} /> Back
            </button>
          )}

          {step < 2 && (
            <button onClick={handleNext}
              disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
              className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors"
              style={{
                background: (step === 0 && !step1Valid) || (step === 1 && !step2Valid) ? '#E2E8F0' : '#1E3A5F',
                color: (step === 0 && !step1Valid) || (step === 1 && !step2Valid) ? '#94A3B8' : '#fff',
                fontSize: 13, fontWeight: 700,
              }}>
              Next <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          )}

          {step === 2 && (
            <button onClick={handleSubmit} disabled={submitting || aiChecking}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
              style={{
                background: submitting || aiChecking ? '#94A3B8' : '#1E3A5F',
                color: '#fff', fontSize: 14, fontWeight: 700, minHeight: 48,
              }}>
              <FileText style={{ width: 15, height: 15 }} />
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualClaimModal;
