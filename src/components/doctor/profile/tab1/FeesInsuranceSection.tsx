import React, { useState } from 'react';
import { CircleDollarSign, ShieldCheck, CreditCard as Edit2, Save, X } from 'lucide-react';

interface FeesInsuranceSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const insuranceList = [
  { name: 'Daman (National Health Insurance)', accepted: true },
  { name: 'AXA Gulf', accepted: true },
  { name: 'ADNIC (Abu Dhabi National Insurance)', accepted: true },
  { name: 'Oman Insurance Company', accepted: true },
  { name: 'Thiqa (Government healthcare)', accepted: true },
  { name: 'Orient Insurance', accepted: true },
  { name: 'GIG Gulf', accepted: true },
  { name: 'Al Wathba', accepted: false },
  { name: 'MetLife', accepted: false },
];

const FeesInsuranceSection: React.FC<FeesInsuranceSectionProps> = ({ showToast }) => {
  const [editingFees, setEditingFees] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(false);
  const [inPerson, setInPerson] = useState(400);
  const [tele, setTele] = useState(300);
  const [emergency, setEmergency] = useState(400);
  const [insurance, setInsurance] = useState(insuranceList);

  const accepted = insurance.filter((p) => p.accepted);
  const notAccepted = insurance.filter((p) => !p.accepted);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultation Fees</h2>
          </div>
          {!editingFees ? (
            <button onClick={() => setEditingFees(true)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
              <Edit2 className="w-3.5 h-3.5" /><span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => { setEditingFees(false); showToast('✅ Fees updated — visible to patients immediately'); }} className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-[12px] text-white font-medium transition-colors">
                <Save className="w-3.5 h-3.5" /><span>Save</span>
              </button>
              <button onClick={() => setEditingFees(false)} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-50">
          {[
            { label: 'In-Person Consultation', value: inPerson, setter: setInPerson },
            { label: 'Teleconsultation', value: tele, setter: setTele },
            { label: 'Follow-up', value: 400, setter: null },
            { label: 'Emergency / Walk-in', value: emergency, setter: setEmergency },
          ].map((fee) => (
            <div key={fee.label} className="flex items-center justify-between px-6 py-3.5">
              <span className="text-[13px] text-slate-700" style={{ fontFamily: 'Inter, sans-serif' }}>{fee.label}</span>
              {editingFees && fee.setter ? (
                <div className="flex items-center space-x-2">
                  <span className="text-[12px] text-slate-400">AED</span>
                  <input
                    type="number"
                    value={fee.value}
                    onChange={(e) => fee.setter!(Number(e.target.value))}
                    min={100}
                    max={2000}
                    className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-[14px] text-right focus:outline-none focus:ring-2 focus:ring-teal-400"
                    style={{ fontFamily: 'DM Mono, monospace' }}
                  />
                </div>
              ) : (
                <span className="text-[16px] font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace' }}>
                  AED {fee.value.toLocaleString()}
                </span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-[13px] text-slate-700">New Patient Surcharge</span>
            <span className="text-[14px] text-slate-400">None</span>
          </div>
        </div>
        {editingFees && (
          <div className="px-6 pb-4">
            <p className="text-[11px] text-slate-400 italic">
              Fees are shown to patients before booking. Actual patient payment depends on insurance co-pay.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Accepted Insurance</h2>
              <p className="text-[12px] text-slate-400">Verified insurance panels registered with DHA</p>
            </div>
          </div>
          {!editingInsurance ? (
            <button onClick={() => setEditingInsurance(true)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
              <Edit2 className="w-3.5 h-3.5" /><span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => { setEditingInsurance(false); showToast('✅ Insurance panels updated'); }} className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-[12px] text-white font-medium transition-colors">
                <Save className="w-3.5 h-3.5" /><span>Save</span>
              </button>
              <button onClick={() => setEditingInsurance(false)} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4">
          {editingInsurance ? (
            <div className="space-y-2">
              {insurance.map((provider, i) => (
                <label key={i} className="flex items-center space-x-3 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={provider.accepted}
                    onChange={() => setInsurance((ins) => ins.map((p, j) => j === i ? { ...p, accepted: !p.accepted } : p))}
                    className="w-4 h-4 rounded accent-teal-500"
                  />
                  <span className="text-[13px] text-slate-700">{provider.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {accepted.map((p) => (
                  <span key={p.name} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full border border-emerald-200">
                    ✅ {p.name}
                  </span>
                ))}
              </div>
              {notAccepted.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {notAccepted.map((p) => (
                    <span key={p.name} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[11px] rounded-full line-through">
                      ❌ {p.name}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeesInsuranceSection;
