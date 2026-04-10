import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface DangerZoneProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({ showToast }) => {
  const [open, setOpen] = useState(false);
  const [inactiveModal, setInactiveModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 border-l-4 border-red-300">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-[12px] font-medium text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Account Actions</span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
        </button>

        {open && (
          <div className="px-6 pb-5 space-y-3 border-t border-slate-50">
            <div className="pt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[13px] font-semibold text-amber-800 mb-1">🟡 Set Account to Inactive</p>
              <p className="text-[12px] text-amber-700 mb-3">Pause your CeenAiX presence. Patients cannot book until reactivated.</p>
              <button onClick={() => setInactiveModal(true)} className="px-4 py-2 border border-amber-400 text-amber-700 hover:bg-amber-100 rounded-lg text-[12px] font-medium transition-colors">
                Set as Inactive
              </button>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[13px] font-semibold text-red-800 mb-1">🔴 Request Account Deletion</p>
              <p className="text-[12px] text-red-700 mb-1">Permanently delete your CeenAiX account.</p>
              <p className="text-[11px] text-red-500 mb-3 italic">Note: Patient records you authored cannot be deleted per UAE DHA retention requirements.</p>
              <button onClick={() => setDeleteModal(true)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[12px] font-medium transition-colors">
                Request Deletion
              </button>
            </div>
          </div>
        )}
      </div>

      {inactiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setInactiveModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-[16px] font-bold text-amber-800 mb-3">Set Account to Inactive?</h3>
            <p className="text-[13px] text-slate-600 mb-2">This will pause your CeenAiX presence. Patients will see "Not accepting new bookings" on your profile.</p>
            <p className="text-[12px] text-slate-400 mb-4">DHA will be notified of this status change. You can reactivate at any time.</p>
            <div className="flex space-x-2">
              <button onClick={() => setInactiveModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[13px] hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setInactiveModal(false); showToast('⚠️ Account set to inactive — patients cannot book', 'warning'); }} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[13px] font-medium transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-[16px] font-bold text-red-800 mb-3">Request Account Deletion</h3>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
              <p className="text-[12px] text-red-700 font-semibold">⚠️ UAE DHA Compliance Notice</p>
              <p className="text-[12px] text-red-600 mt-1">Patient records you have authored are subject to 10-year retention under DHA regulations and cannot be deleted. Only your profile and account credentials will be removed.</p>
            </div>
            <p className="text-[13px] text-slate-600 mb-4">This action is irreversible. Type CONFIRM to proceed:</p>
            <input placeholder="Type CONFIRM" className="w-full border border-red-300 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-red-400 mb-3" />
            <div className="flex space-x-2">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[13px] hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setDeleteModal(false); showToast('✅ Account deletion request submitted for review'); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13px] font-medium transition-colors">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DangerZone;
