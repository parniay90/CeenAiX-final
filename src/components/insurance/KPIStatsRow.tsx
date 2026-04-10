import { FileCheck, Receipt, Bot, Shield, Clock, Users } from 'lucide-react';
import { MOCK_INSURANCE_KPIS } from '../../types/insurance';

export default function KPIStatsRow() {
  const kpis = MOCK_INSURANCE_KPIS;

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="w-4 h-4 text-amber-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Open Pre-Auth</div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-white">{kpis.openPreAuthRequests}</div>
          <div className="px-2 py-0.5 bg-amber-600 bg-opacity-20 border border-amber-600 rounded text-xs font-bold text-amber-400">
            {kpis.urgentPreAuthRequests} urgent
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Receipt className="w-4 h-4 text-teal-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Claims Today</div>
        </div>
        <div className="text-2xl font-bold text-white">{kpis.claimsSubmittedToday}</div>
        <div className="text-xs text-slate-500 mt-1">
          AED {(kpis.claimsTotalValue / 1000000).toFixed(2)}M value
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-green-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Auto-Approval</div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-green-400">{kpis.autoApprovalRate}%</div>
          <div className="text-xs text-green-400">automation</div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-rose-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Fraud Alerts</div>
        </div>
        <div className="text-2xl font-bold text-rose-400">{kpis.fraudAlerts}</div>
        <div className="text-xs text-rose-400 mt-1">Requires review</div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-green-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Avg Processing</div>
        </div>
        <div className="text-2xl font-bold text-green-400">{kpis.avgProcessingTime}h</div>
        <div className="text-xs text-slate-500 mt-1">Target: 8h</div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-blue-400" />
          <div className="text-xs font-bold text-slate-400 uppercase">Active Members</div>
        </div>
        <div className="text-2xl font-bold text-white">
          {kpis.activeMembers.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
