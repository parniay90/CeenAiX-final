import { ClipboardCheck, AlertTriangle, AlertCircle, FileText, DollarSign } from 'lucide-react';
import { PharmacyKPIs } from '../../types/pharmacy';

interface KPIStatsProps {
  kpis: PharmacyKPIs;
}

export default function KPIStats({ kpis }: KPIStatsProps) {
  const dispensedPercentage = (kpis.prescriptionsToday.dispensed / kpis.prescriptionsToday.total) * 100;

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.prescriptionsToday.total}</div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Prescriptions Today</h3>
        <div className="text-xs text-slate-600 space-y-1 mb-3">
          <div className="flex justify-between">
            <span>Dispensed:</span>
            <span className="font-semibold text-teal-700">{kpis.prescriptionsToday.dispensed}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending:</span>
            <span className="font-semibold text-amber-700">{kpis.prescriptionsToday.pending}</span>
          </div>
          <div className="flex justify-between">
            <span>On Hold:</span>
            <span className="font-semibold text-rose-700">{kpis.prescriptionsToday.onHold}</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all"
            style={{ width: `${dispensedPercentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{Math.round(dispensedPercentage)}% completed</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.lowStockAlerts.total}</div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Low Stock Alerts</h3>
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-100 rounded text-xs font-semibold text-amber-800">
          <AlertCircle className="w-3 h-3" />
          {kpis.lowStockAlerts.critical} critical
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-rose-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-rose-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.drugInteractionsFlagged}</div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Drug Interactions Flagged</h3>
        <p className="text-xs text-slate-600">Needs pharmacist review</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <FileText className="w-5 h-5 text-slate-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.insuranceClaimsPending}</div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Insurance Claims Pending</h3>
        <p className="text-xs text-slate-600">Awaiting authorization</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpis.revenueToday.toLocaleString()}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Revenue Today</h3>
        <p className="text-xs text-slate-600">AED</p>
      </div>
    </div>
  );
}
