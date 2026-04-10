import React, { useState } from 'react';
import { Building2, CreditCard as Edit2, Trash2, Plus, CheckCircle2 } from 'lucide-react';

interface AffiliationsSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const AffiliationsSection: React.FC<AffiliationsSectionProps> = ({ showToast }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Clinic Affiliations
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-4 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">AN</div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Al Noor Medical Center</p>
                <p className="text-[12px] text-slate-500">Consultant Cardiologist — Full Time</p>
                <p className="text-[12px] text-slate-500">Cardiology Dept, Floor 3, Suite 301</p>
                <p className="text-[11px] text-slate-400 mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>Affiliated since: March 2018</p>
                <p className="text-[10px] text-slate-300" style={{ fontFamily: 'DM Mono, monospace' }}>DHA-FAC-2015-012847</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">✅ Primary</span>
              <div className="flex items-center space-x-1 text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-medium">DHA Verified</span>
              </div>
              <button onClick={() => showToast('✅ Edit affiliation opened')} className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors">
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-white border-l-4 border-slate-200 rounded-r-xl p-4 border border-slate-100 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">DH</div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">Dubai Heart Clinic</p>
                <p className="text-[12px] text-slate-500">Visiting Consultant — Thursdays PM only</p>
                <p className="text-[11px] text-slate-400 mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>Affiliated since: September 2021</p>
                <p className="text-[10px] text-slate-300" style={{ fontFamily: 'DM Mono, monospace' }}>DHA-FAC-2016-018432</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">Secondary</span>
              <div className="flex items-center space-x-1 text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-medium">DHA Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => showToast('✅ Edit affiliation opened')} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button onClick={() => showToast('✅ Remove affiliation confirmed')} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 rounded-xl text-[13px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clinic Affiliation</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-[16px] font-bold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Add Clinic Affiliation
            </h3>
            <div className="space-y-3">
              <input placeholder="Search CeenAiX-registered clinics..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <input placeholder="Your role / designation" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <input placeholder="DHA Facility number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-400" style={{ fontFamily: 'DM Mono, monospace' }} />
              <p className="text-[11px] text-slate-400">Admin approval required from clinic side after submission</p>
            </div>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowAddModal(false); showToast('✅ Affiliation request submitted for verification'); }} className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl text-[13px] font-medium hover:bg-teal-600 transition-colors">
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AffiliationsSection;
