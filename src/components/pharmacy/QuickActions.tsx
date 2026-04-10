import { Plus, Search, MessageSquare, Printer } from 'lucide-react';

interface QuickActionsProps {
  onAddPrescription: () => void;
  onCheckAvailability: () => void;
  onCounselingLog: () => void;
  onPrintReport: () => void;
}

export default function QuickActions({
  onAddPrescription,
  onCheckAvailability,
  onCounselingLog,
  onPrintReport,
}: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <button
          onClick={onAddPrescription}
          className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg hover:from-teal-100 hover:to-teal-200 transition-all group"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-teal-600 rounded-lg group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-teal-900">
              Add Walk-in Prescription
            </span>
          </div>
        </button>

        <button
          onClick={onCheckAvailability}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-blue-900">
              Check Drug Availability
            </span>
          </div>
        </button>

        <button
          onClick={onCounselingLog}
          className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-200 rounded-lg hover:from-violet-100 hover:to-violet-200 transition-all group"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-violet-600 rounded-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-violet-900">
              Patient Counseling Log
            </span>
          </div>
        </button>

        <button
          onClick={onPrintReport}
          className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all group"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-slate-600 rounded-lg group-hover:scale-110 transition-transform">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">Print Daily Report</span>
          </div>
        </button>
      </div>
    </div>
  );
}
