import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { AIMetrics } from '../../types/admin';

interface AIMetricsPanelProps {
  metrics: AIMetrics;
}

export default function AIMetricsPanel({ metrics }: AIMetricsPanelProps) {
  const maxInteractions = Math.max(...metrics.specialtyBreakdown.map((s) => s.interactions));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-teal-400" />
        <h3 className="text-sm font-bold text-white uppercase">AI Performance Metrics</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Model Accuracy</span>
          <span className="text-lg font-bold text-white">{metrics.modelAccuracy}%</span>
        </div>
        <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"
            style={{ width: `${metrics.modelAccuracy}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-400">Alert Accuracy</span>
          </div>
          <div className="text-xl font-bold text-white">{metrics.alertAccuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">Physician action rate</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-400">Interactions Today</span>
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.totalInteractions.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Clinical decisions supported</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-bold text-slate-400 uppercase mb-3">By Specialty</div>
        <div className="space-y-2">
          {metrics.specialtyBreakdown.map((specialty) => (
            <div key={specialty.specialty}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">{specialty.specialty}</span>
                <span className="text-slate-500 font-mono">{specialty.interactions}</span>
              </div>
              <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full"
                  style={{ width: `${(specialty.interactions / maxInteractions) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-400 uppercase">Bias Monitoring</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metrics.biasMonitoring.map((demo) => (
            <div
              key={demo.demographic}
              className="bg-slate-900 border border-slate-700 rounded p-2"
            >
              <div className="text-xs text-slate-400 mb-1">{demo.demographic}</div>
              <div className="text-base font-bold text-white">{demo.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
