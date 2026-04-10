import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Pill, ShieldCheck, AlertTriangle, Printer,
  MessageSquare, Copy, Check, Lock, X, CheckCircle2
} from 'lucide-react';
import { prescriptions, Prescription, DrugItem } from '../../data/pharmacyData';

interface Props {
  rxId?: string;
  onNavigate: (page: string) => void;
}

const defaultRxId = 'rx2';

const CHECKLIST_ITEMS = [
  'Patient identity verified',
  'Prescription validity checked',
  'Allergy check: No conflicts',
  'Drug interaction: Noted, doctor acknowledged',
  'Batch selected (FEFO)',
  'Quantities confirmed',
  'Labels prepared',
  'Patient counseling notes ready',
  'Insurance coverage verified',
  'Payment processed',
];

const PROCESSING_STEPS = [
  'Recording dispensing log...',
  'Submitting to DHA...',
  'Syncing to Nabidh HIE...',
  'Sending to patient app...',
  'Submitting insurance claim...',
];

const PharmacyDispensingWorkspace: React.FC<Props> = ({ rxId, onNavigate }) => {
  const rx = prescriptions.find(p => p.id === (rxId || defaultRxId)) || prescriptions[1];

  const [checklist, setChecklist] = useState<boolean[]>(
    CHECKLIST_ITEMS.map((_, i) => i < 4)
  );
  const [pin, setPin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'insurance' | 'wallet'>('card');
  const [paymentDone, setPaymentDone] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensingStep, setDispensingStep] = useState(0);
  const [dispensingDone, setDispensed] = useState(false);
  const [dhaRecord] = useState('DIS-20260407-01247');
  const [copied, setCopied] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [holdReason, setHoldReason] = useState('stock');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [counselingNotes, setCounselingNotes] = useState<Record<string, string>>({});
  const [showNotesForDoc, setShowNotesForDoc] = useState(false);
  const [showLabelFor, setShowLabelFor] = useState<string | null>(null);

  useEffect(() => {
    if (rx) {
      const initQty: Record<string, number> = {};
      const initBatch: Record<string, string> = {};
      const initNotes: Record<string, string> = {};
      rx.drugs.forEach(d => {
        initQty[d.id] = d.quantity;
        if (d.batchNumber) initBatch[d.id] = d.batchNumber;
        initNotes[d.id] = d.instructions || '';
      });
      setQuantities(initQty);
      setSelectedBatches(initBatch);
      setCounselingNotes(initNotes);
    }
  }, [rx?.id]);

  const allChecked = checklist.every(Boolean);
  const pinValid = pin.length === 4;
  const canDispense = allChecked && pinValid;

  const handleDispense = async () => {
    setIsDispensing(true);
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setDispensingStep(i);
      await new Promise(r => setTimeout(r, 600));
    }
    await new Promise(r => setTimeout(r, 400));
    setIsDispensing(false);
    setDispensed(true);
  };

  const handleCopyRef = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePayment = () => {
    setPaymentDone(true);
    setChecklist(prev => {
      const next = [...prev];
      next[8] = true;
      next[9] = true;
      return next;
    });
  };

  const totalCost = rx.drugs.reduce((sum, d) => {
    const price = d.genericName === 'Furosemide' ? 65 : d.genericName === 'Spironolactone' ? 54 : 45;
    return sum + price;
  }, 0);
  const insurancePays = Math.round(totalCost * rx.insuranceCoverage / 100);
  const patientPays = totalCost - insurancePays;

  if (dispensingDone) {
    return (
      <div className="fixed inset-0 bg-emerald-50 z-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" style={{ animation: 'scale-in 0.3s ease-out' }} />
            </div>
          </div>
          <h2 className="font-bold text-emerald-800 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24 }}>
            Dispensed Successfully ✅
          </h2>
          <div
            className="flex items-center justify-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCopyRef}
          >
            <span className="text-teal-600 font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 20 }}>
              {dhaRecord}
            </span>
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </div>
          <div className="bg-white rounded-2xl p-5 text-left mb-5 border border-emerald-200">
            <div className="space-y-2">
              {[
                ['Patient', rx.patientName],
                ['Medications', `${rx.drugs.length} dispensed`],
                ['Co-pay', `AED ${rx.copay} collected ✅`],
                ['Insurance', `AED ${insurancePays} → ${rx.insurance} (claim submitted ✅)`],
                ['DHA Record', 'Submitted ✅'],
                ['Nabidh HIE', 'Synced ✅'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-teal-50 rounded-xl p-3 mb-5 text-sm text-teal-700">
            ✅ {rx.patientName.split(' ')[0]}'s patient app updated: "Your medication is ready — collect from Al Shifa Pharmacy, Al Barsha"
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button className="bg-emerald-600 text-white rounded-xl px-5 py-2.5 font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-colors">
              <Printer className="w-4 h-4" /> Print All Labels ({rx.drugs.length})
            </button>
            <button className="bg-slate-100 text-slate-700 rounded-xl px-5 py-2.5 font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors">
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={() => onNavigate('prescriptions')}
              className="bg-emerald-600 text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-emerald-700 transition-colors"
            >
              + Next Prescription
            </button>
          </div>
          <button
            onClick={() => onNavigate('prescriptions')}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            ← Back to Queue
          </button>
        </div>
      </div>
    );
  }

  if (isDispensing) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h3 className="font-bold text-slate-800 mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>
            Processing Dispensing...
          </h3>
          <div className="space-y-3">
            {PROCESSING_STEPS.map((step, i) => (
              <div key={step} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i < dispensingStep ? 'text-emerald-600' : i === dispensingStep ? 'text-slate-800 font-medium' : 'text-slate-300'}`}>
                {i < dispensingStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : i === dispensingStep ? (
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2">
        <button
          onClick={() => onNavigate('prescriptions')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Prescriptions
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium text-sm">
          Dispensing: <span style={{ fontFamily: 'DM Mono, monospace' }}>{rx.rxRef}</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          {rx.status === 'new' && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
              NEW PRESCRIPTION
            </span>
          )}
          {rx.status === 'on_hold' && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              ON HOLD
            </span>
          )}
          {rx.status === 'dispensed' && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              DISPENSED
            </span>
          )}
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">

            {/* Patient Card */}
            <div className="rounded-xl p-4 border border-emerald-200" style={{ background: '#F0FDF4' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${rx.patientAvatarColor}`}>
                  {rx.patientInitials}
                </div>
                <div>
                  <div className="font-bold text-slate-900" style={{ fontSize: 14 }}>{rx.patientName}</div>
                  <div className="text-slate-500" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                    {rx.patientAge}{rx.patientGender} · {rx.patientId}
                  </div>
                </div>
              </div>
              {rx.arrivingETA && (
                <div className="text-emerald-700 text-xs mb-2">
                  Arriving: {rx.arrivingETA}
                </div>
              )}
              <div className="border-t border-emerald-200 pt-2 mt-2">
                <div className="text-teal-700 text-xs font-semibold mb-1">🔵 Nabidh HIE: Synced</div>
                {rx.conditions.map(c => (
                  <div key={c} className="text-slate-600 text-xs">• {c}</div>
                ))}
              </div>
            </div>

            {/* Allergy Panel */}
            {rx.allergies.length === 0 ? (
              <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-xs font-semibold">No known allergies ✅</span>
              </div>
            ) : (
              <div className="rounded-xl p-3 bg-red-50 border border-red-200">
                <div className="font-semibold text-red-700 text-xs mb-1">⚠️ ALLERGIES</div>
                {rx.allergies.map(a => (
                  <div key={a} className="text-red-700 font-bold text-xs">• {a}</div>
                ))}
              </div>
            )}

            {/* Prescriber Card */}
            <div className="rounded-xl p-4 bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 text-sm mb-0.5">{rx.doctorName}</div>
              <div className="text-slate-500 text-xs mb-1">{rx.doctorSpecialty}</div>
              <div className="text-emerald-700 font-mono text-xs mb-2">{rx.doctorDHA} ✅</div>
              <div className="border-t border-slate-200 pt-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Rx Ref</span>
                  <span className="text-teal-600 font-mono text-xs font-semibold">{rx.rxRef}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-xs">Prescribed</span>
                  <span className="text-slate-700 text-xs">{rx.receivedTime} · 7 Apr 2026</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-xs">Valid until</span>
                  <span className="text-slate-700 text-xs">7 May 2026</span>
                </div>
              </div>
              {rx.notes && (
                <div className="bg-white rounded-lg p-2 border border-slate-200 text-xs text-slate-600 mb-2">
                  {rx.notes}
                </div>
              )}
              <button
                onClick={() => onNavigate('messages')}
                className="w-full bg-slate-100 text-slate-700 text-xs font-medium py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message {rx.doctorName.split(' ')[1]}
              </button>
            </div>

            {/* Insurance Panel */}
            <div className="rounded-xl p-4 bg-blue-50 border border-blue-200">
              <div className="font-bold text-blue-800 text-sm mb-1">{rx.insurance}</div>
              {rx.policyNumber && (
                <div className="text-blue-700 font-mono text-xs mb-2">{rx.policyNumber}</div>
              )}
              <div className="space-y-1 text-xs">
                <div className="text-slate-600">Coverage: <span className="font-bold text-emerald-700">{rx.insuranceCoverage}%</span></div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient co-pay</span>
                  <span className="font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}>AED {rx.copay}</span>
                </div>
                <div className="text-emerald-600 text-xs">Pre-auth: Not required ✅</div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
              Prescription Items ({rx.drugs.length})
            </h2>
          </div>

          {/* Drug interaction alert */}
          {rx.drugs.some(d => d.interactions && d.interactions.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-800 text-sm">Drug Interaction: Monitor</span>
              </div>
              <div className="text-amber-700 text-xs mb-1">
                {rx.drugs.flatMap(d => d.interactions || []).filter((v, i, a) => a.indexOf(v) === i).join(' · ')}
              </div>
              <div className="text-emerald-600 text-xs font-medium">✅ Doctor acknowledged — proceed with dispensing</div>
            </div>
          )}

          {/* Drug cards */}
          {rx.drugs.map(drug => (
            <DrugCard
              key={drug.id}
              drug={drug}
              rxRef={rx.rxRef}
              patientName={rx.patientName}
              doctorName={rx.doctorName}
              qty={quantities[drug.id] || drug.quantity}
              onQtyChange={q => setQuantities(prev => ({ ...prev, [drug.id]: q }))}
              selectedBatch={selectedBatches[drug.id] || ''}
              onBatchChange={b => setSelectedBatches(prev => ({ ...prev, [drug.id]: b }))}
              counselingNote={counselingNotes[drug.id] || ''}
              onNoteChange={n => setCounselingNotes(prev => ({ ...prev, [drug.id]: n }))}
              showLabel={showLabelFor === drug.id}
              onToggleLabel={() => setShowLabelFor(showLabelFor === drug.id ? null : drug.id)}
              onChecklistItem={(idx) => {
                if (idx === 4) setChecklist(prev => { const n = [...prev]; n[4] = true; return n; });
                if (idx === 5) setChecklist(prev => { const n = [...prev]; n[5] = true; n[6] = true; n[7] = true; return n; });
              }}
            />
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">

            {/* Payment Summary */}
            <div className="rounded-xl border border-emerald-200 overflow-hidden" style={{ background: '#F0FDF4' }}>
              <div className="px-4 py-2 border-b border-emerald-200">
                <div className="text-slate-500 uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
                  PAYMENT SUMMARY
                </div>
              </div>
              <div className="p-4 space-y-2 text-xs">
                {rx.drugs.map(d => {
                  const price = d.genericName === 'Furosemide' ? 65 : d.genericName === 'Spironolactone' ? 54 : 45;
                  return (
                    <div key={d.id} className="flex justify-between text-slate-600">
                      <span>{d.genericName} {d.strength} × {d.quantity}</span>
                      <span className="font-mono">AED {price}.00</span>
                    </div>
                  );
                })}
                <div className="border-t border-emerald-200 pt-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono">AED {totalCost}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Insurance ({rx.insuranceCoverage}%)</span>
                    <span className="font-mono text-blue-600">- AED {insurancePays}.00</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-emerald-300">
                  <span className="font-bold text-slate-700">Patient pays</span>
                  <span className="font-bold text-emerald-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 18 }}>
                    AED {rx.copay}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 space-y-2">
                {(['cash', 'card', 'insurance', 'wallet'] as const).map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                      className="accent-emerald-600"
                    />
                    <span className="text-slate-700 capitalize text-xs">{m === 'card' ? 'Card (tap/insert)' : m === 'insurance' ? 'Insurance Direct' : m === 'wallet' ? 'CeenAiX Wallet' : 'Cash'}</span>
                  </label>
                ))}
                {!paymentDone ? (
                  <button
                    onClick={handlePayment}
                    className="w-full bg-emerald-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-2"
                    style={{ height: 44 }}
                  >
                    💳 Process AED {rx.copay} Payment
                  </button>
                ) : (
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-bold py-2 rounded-lg text-center">
                    ✅ AED {rx.copay} collected
                  </div>
                )}
              </div>
            </div>

            {/* Dispensing Checklist */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                <div className="text-slate-500 uppercase tracking-widest" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
                  DHA DISPENSING CHECKLIST
                </div>
              </div>
              <div className="p-3 space-y-2">
                {CHECKLIST_ITEMS.map((item, i) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist[i]}
                      onChange={() => {
                        const next = [...checklist];
                        next[i] = !next[i];
                        setChecklist(next);
                      }}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span className={`text-xs ${checklist[i] ? 'text-emerald-700 line-through' : 'text-slate-600'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* PIN */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-500 text-xs mb-2">Enter your dispensing PIN to confirm:</div>
              <div className="flex justify-center gap-3 mb-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all ${i < pin.length ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-300'}`}
                  >
                    {i < pin.length ? '●' : '·'}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (k === '⌫') setPin(p => p.slice(0, -1));
                      else if (k !== '' && pin.length < 4) setPin(p => p + k);
                    }}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${k === '' ? '' : k === '⌫' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    disabled={k === ''}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="text-slate-400 text-[10px] mt-2 text-center">Required by DHA for dispensing confirmation</div>
            </div>

            {/* Dispense button */}
            {rx.status !== 'dispensed' && (
              <button
                onClick={handleDispense}
                disabled={!canDispense}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${canDispense ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, height: 52 }}
              >
                {canDispense ? '✅ Dispense & Complete' : `Complete checklist (${checklist.filter(Boolean).length}/${CHECKLIST_ITEMS.length})`}
              </button>
            )}

            {/* Secondary actions */}
            {rx.status !== 'dispensed' && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowHoldModal(true)}
                  className="w-full bg-amber-100 text-amber-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-amber-200 transition-colors"
                  style={{ height: 40 }}
                >
                  ⏸ Put on Hold
                </button>
                <button
                  onClick={() => onNavigate('messages')}
                  className="w-full bg-slate-100 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                  style={{ height: 40 }}
                >
                  ↩ Refer Back to Doctor
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full border border-red-200 text-red-500 text-sm font-medium py-2 rounded-xl hover:bg-red-50 transition-colors"
                  style={{ height: 36 }}
                >
                  ❌ Reject Prescription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hold Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900" style={{ fontSize: 16 }}>Put Prescription on Hold</h3>
              <button onClick={() => setShowHoldModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {[
                ['doctor', 'Awaiting doctor clarification'],
                ['patient', 'Patient not yet arrived'],
                ['stock', 'Stock shortage (specific drug)'],
                ['insurance', 'Insurance pre-auth pending'],
                ['other', 'Other'],
              ].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={val} checked={holdReason === val} onChange={() => setHoldReason(val)} className="accent-amber-500" />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Optional note to patient/doctor..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-amber-400 resize-none"
              rows={2}
            />
            <button
              onClick={() => { setShowHoldModal(false); onNavigate('prescriptions'); }}
              className="w-full bg-amber-500 text-white font-bold py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
            >
              Put on Hold
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900" style={{ fontSize: 16 }}>Reject Prescription</h3>
              <button onClick={() => setShowRejectModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-red-400"
            >
              <option value="">Select reason...</option>
              <option value="invalid">Invalid/expired prescription</option>
              <option value="identity">Patient identity mismatch</option>
              <option value="doctor">Doctor not licensed</option>
              <option value="formulary">Drug not on DHA formulary</option>
              <option value="other">Other</option>
            </select>
            <button
              disabled={!rejectReason}
              onClick={() => { setShowRejectModal(false); onNavigate('prescriptions'); }}
              className="w-full bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface DrugCardProps {
  drug: DrugItem;
  rxRef: string;
  patientName: string;
  doctorName: string;
  qty: number;
  onQtyChange: (q: number) => void;
  selectedBatch: string;
  onBatchChange: (b: string) => void;
  counselingNote: string;
  onNoteChange: (n: string) => void;
  showLabel: boolean;
  onToggleLabel: () => void;
  onChecklistItem: (idx: number) => void;
}

const drugCounselingTemplates: Record<string, string> = {
  Furosemide: 'Take in the morning to avoid nighttime urination. Weigh yourself daily at the same time. Report to Dr. Ahmed if weight increases by more than 2kg. Avoid potassium supplements unless prescribed.',
  Spironolactone: 'Take with food. May cause dizziness on standing — rise slowly. Avoid high-potassium foods (bananas, oranges, potatoes). Report muscle weakness or irregular heartbeat immediately.',
};

const batchOptions: Record<string, Array<{ batch: string; qty: number; expiry: string; note?: string }>> = {
  'd3': [
    { batch: 'BT-2025-FUR60-019', qty: 124, expiry: 'Sep 2027' },
    { batch: 'BT-2025-FUR60-012', qty: 23, expiry: 'Jun 2026', note: 'Older — use first (FEFO)' },
  ],
  'd4': [
    { batch: 'BT-2025-SPI25-031', qty: 83, expiry: 'Dec 2026' },
  ],
};

const DrugCard: React.FC<DrugCardProps> = ({
  drug, rxRef, patientName, doctorName,
  qty, onQtyChange, selectedBatch, onBatchChange,
  counselingNote, onNoteChange, showLabel, onToggleLabel, onChecklistItem
}) => {
  const batches = batchOptions[drug.id] || [];

  return (
    <div className={`bg-white rounded-xl border-l-4 shadow-sm mb-4 overflow-hidden ${drug.isControlled ? 'border-l-purple-600' : 'border-l-emerald-500'}`}>
      {drug.isControlled && (
        <div className="bg-purple-600 px-4 py-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-white animate-pulse" />
          <span className="text-white font-bold text-xs">CONTROLLED SUBSTANCE — Schedule III</span>
          <span className="text-purple-200 text-xs ml-auto">DHA Controlled Drug Regulations apply</span>
        </div>
      )}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Pill className={`w-5 h-5 flex-shrink-0 ${drug.isControlled ? 'text-purple-600' : 'text-emerald-600'}`} />
            <div>
              <div className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
                {drug.genericName} {drug.strength}
              </div>
              {drug.brandName && (
                <div className="text-slate-400 italic" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
                  ({drug.brandName})
                </div>
              )}
              <div className="text-slate-300 mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                {drug.atcCode && `ATC: ${drug.atcCode}`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
              DHA Formulary ✅
            </span>
          </div>
        </div>

        {/* Prescribed details */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs bg-slate-50 rounded-lg p-3">
          {[
            ['Dose', `${drug.strength}`],
            ['Frequency', drug.frequency],
            ['Duration', drug.duration],
            ['Qty Prescribed', `${drug.quantity} ${drug.form}`],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-slate-400 mb-0.5">{k}</div>
              <div className="font-semibold text-slate-700" style={{ fontFamily: 'DM Mono, monospace' }}>{v}</div>
            </div>
          ))}
          {drug.indication && (
            <div className="col-span-2">
              <div className="text-slate-400 mb-0.5">Indication</div>
              <div className="text-teal-600 font-mono text-xs">{drug.indication}</div>
            </div>
          )}
        </div>

        {/* Dose change notice */}
        {drug.doseChanged && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-amber-700 text-xs font-semibold">
              Dose INCREASED: Previous {drug.previousDose} → Now {drug.strength}
            </span>
          </div>
        )}

        {/* Stock */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${drug.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-700' : drug.stockStatus === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {drug.stockStatus === 'in_stock' ? `✅ In Stock — ${drug.stockQty} ${drug.form}` : drug.stockStatus === 'out_of_stock' ? '🔴 Out of Stock' : `⚠️ Low: ${drug.stockQty} remaining`}
          </div>
        </div>

        {/* Batch selection */}
        {batches.length > 0 && (
          <div className="mb-3">
            <div className="text-slate-500 text-xs mb-1.5 uppercase tracking-wide">Select batch (FEFO):</div>
            <div className="space-y-1.5">
              {batches.map(b => (
                <label
                  key={b.batch}
                  onClick={() => { onBatchChange(b.batch); onChecklistItem(4); }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${selectedBatch === b.batch ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'} ${b.note ? 'bg-amber-50 border-amber-200' : ''}`}
                >
                  <input type="radio" checked={selectedBatch === b.batch} onChange={() => {}} className="accent-emerald-600" />
                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold text-slate-700">{b.batch}</span>
                    <span className="text-slate-400 text-xs ml-2">Exp: {b.expiry} · {b.qty} tabs</span>
                    {b.note && <div className="text-amber-600 text-xs">{b.note}</div>}
                  </div>
                </label>
              ))}
            </div>
            <div className="text-emerald-600 text-xs mt-1">Use oldest batch first (FEFO principle) ✅</div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div className="text-slate-500 text-xs mb-1">Qty to dispense:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQtyChange(Math.max(1, qty - 1))}
                className="w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >-</button>
              <input
                type="number"
                value={qty}
                onChange={e => { onQtyChange(parseInt(e.target.value) || 1); onChecklistItem(5); }}
                className="w-16 text-center font-bold border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:border-emerald-400"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 16 }}
              />
              <button
                onClick={() => onQtyChange(qty + 1)}
                className="w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >+</button>
              <span className="text-slate-400 text-xs">{drug.form}</span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Prescribed: {drug.quantity} {drug.form}</div>
          </div>
        </div>

        {/* Counseling notes */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-slate-500 uppercase tracking-wide text-xs">Counseling notes for patient</div>
            <button
              onClick={() => {
                const template = drugCounselingTemplates[drug.genericName] || '';
                if (template) onNoteChange(template);
              }}
              className="text-teal-600 hover:text-teal-700 text-xs font-medium"
            >
              🤖 Auto-suggest
            </button>
          </div>
          <textarea
            value={counselingNote}
            onChange={e => onNoteChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-400 resize-none"
            rows={3}
            placeholder="Add counseling notes for patient..."
          />
        </div>

        {/* Label */}
        <div>
          <button
            onClick={onToggleLabel}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium mb-2"
          >
            <Printer className="w-3.5 h-3.5" /> {showLabel ? 'Hide' : 'Preview'} Label
          </button>
          {showLabel && (
            <div className="border border-slate-300 rounded-lg p-3 bg-white text-xs font-mono text-slate-700 mb-2">
              <div className="font-bold text-center border-b pb-1 mb-1 text-sm">AL SHIFA PHARMACY</div>
              <div>Rania Hassan PharmD | DHA-PHARM-2019-003481</div>
              <div>Patient: {patientName.toUpperCase()}</div>
              <div>Drug: {drug.genericName.toUpperCase()} {drug.strength}</div>
              <div>Sig: Take as directed</div>
              <div>Qty: {qty} {drug.form}</div>
              <div>Dr: {doctorName} | {rxRef}</div>
              <div>Date: 7 April 2026 | Exp: 7 May 2026</div>
            </div>
          )}
          <button
            className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-3 h-3" /> Print Label
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDispensingWorkspace;
