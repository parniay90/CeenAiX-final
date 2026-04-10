import { LogOut, X } from 'lucide-react';

interface SignOutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  portalName?: string;
}

export default function SignOutModal({ onConfirm, onCancel, portalName = 'portal' }: SignOutModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut size={20} className="text-red-600" />
            </div>
            <div className="font-bold text-slate-800">Sign Out</div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-slate-600 text-sm mb-6">
          Are you sure you want to sign out of the <span className="font-semibold text-slate-800">{portalName}</span>? Your session will be ended.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
