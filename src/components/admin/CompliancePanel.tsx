import { Shield, Calendar, AlertCircle, Database } from 'lucide-react';
import { ComplianceMetrics } from '../../types/admin';
import { formatDistanceToNow } from 'date-fns';

interface CompliancePanelProps {
  metrics: ComplianceMetrics;
}

export default function CompliancePanel({ metrics }: CompliancePanelProps) {
  const daysUntilAudit = Math.ceil(
    (metrics.nextAuditDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-teal-400" />
        <h3 className="text-base font-bold text-white uppercase">Compliance Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-400">DHA Audit Score</span>
            <span className="text-2xl font-bold text-white">{metrics.dhaScore}/100</span>
          </div>
          <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"
              style={{ width: `${metrics.dhaScore}%` }}
            ></div>
          </div>
          <div className="mt-2">
            {metrics.dhaScore >= 95 ? (
              <div className="px-3 py-1 bg-green-500 bg-opacity-20 border border-green-600 rounded text-xs font-bold text-green-400 inline-block">
                Excellent Compliance
              </div>
            ) : metrics.dhaScore >= 80 ? (
              <div className="px-3 py-1 bg-teal-500 bg-opacity-20 border border-teal-600 rounded text-xs font-bold text-teal-400 inline-block">
                Good Compliance
              </div>
            ) : (
              <div className="px-3 py-1 bg-amber-500 bg-opacity-20 border border-amber-600 rounded text-xs font-bold text-amber-400 inline-block">
                Needs Attention
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-bold text-slate-400">Next DHA Audit</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatDistanceToNow(metrics.nextAuditDate)}
          </div>
          <div className="text-xs text-slate-500">
            {metrics.nextAuditDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="mt-2">
            <div
              className={`px-3 py-1 border rounded text-xs font-bold inline-block ${
                daysUntilAudit > 60
                  ? 'bg-slate-500 bg-opacity-20 border-slate-600 text-slate-400'
                  : daysUntilAudit > 30
                  ? 'bg-amber-500 bg-opacity-20 border-amber-600 text-amber-400'
                  : 'bg-rose-500 bg-opacity-20 border-rose-600 text-rose-400'
              }`}
            >
              {daysUntilAudit} days remaining
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-slate-400 uppercase">NABIDH Submission</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.nabidhSubmissionRate}%</div>
          <div className="text-xs text-slate-500">Data submission success rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-400 uppercase">Outstanding Items</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metrics.outstandingItems.length}
          </div>
          <div className="text-xs text-slate-500">Action items requiring attention</div>
        </div>
      </div>

      {metrics.outstandingItems.length > 0 && (
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase mb-3">
            Outstanding Action Items
          </div>
          <div className="space-y-2">
            {metrics.outstandingItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-900 border border-amber-600 border-opacity-30 rounded-lg"
              >
                <div className="mt-0.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{item}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
