import { Pill, MessageCircle } from 'lucide-react';
import type { PastMedication } from '../../types/medications';

interface PastMedicationsTabProps {
  medications: PastMedication[];
}

export default function PastMedicationsTab({ medications }: PastMedicationsTabProps) {
  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
            ✅ {label}
          </div>
        );
      case 'stopped':
        return (
          <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
            ⏹ {label}
          </div>
        );
      case 'expired':
        return (
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
            ⏰ {label}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Past Medications 🕐</h3>
        <p className="text-sm text-slate-500">Medications you've taken before — for reference</p>
      </div>

      <div className="space-y-4">
        {medications.map((med, idx) => (
          <div
            key={med.id}
            style={{ animationDelay: `${idx * 80}ms` }}
            className="bg-white rounded-xl p-5 border-l-4 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 opacity-85 hover:opacity-100 animate-slideUp"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-slate-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-bold text-slate-700">{med.brandName} {med.strength}</h4>
                    {getStatusBadge(med.status, med.statusLabel)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div>{med.prescribedOn} — {med.duration}</div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div>For: {med.reason}</div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div>{med.prescribedBy}</div>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 border-2 border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all duration-300 text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Request Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
