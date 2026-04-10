import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { TATMetric } from '../../types/laboratory';

interface TATMonitorProps {
  metrics: TATMetric[];
}

export default function TATMonitor({ metrics }: TATMonitorProps) {
  const formatTime = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return `${days}d ${hours}h`;
    }
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase">Turnaround Time Monitor</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const isWithinTarget = metric.avgTATMinutes <= metric.targetTATMinutes;
          const percentageOfTarget = (metric.avgTATMinutes / metric.targetTATMinutes) * 100;
          const complianceRate = (metric.withinTarget / metric.sampleCount) * 100;

          return (
            <div key={metric.category} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{metric.categoryLabel}</h4>
                  <div className="text-xs text-slate-600">{metric.sampleCount} samples</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      isWithinTarget ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {formatTime(metric.avgTATMinutes)}
                    </span>
                    {isWithinTarget ? (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    Target: {formatTime(metric.targetTATMinutes)}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">TAT vs Target</span>
                  <span className={`font-bold ${
                    isWithinTarget ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {percentageOfTarget.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isWithinTarget ? 'bg-green-600' : 'bg-amber-600'
                    }`}
                    style={{ width: `${Math.min(percentageOfTarget, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 rounded px-2 py-1">
                  <div className="text-slate-600">Within Target</div>
                  <div className="font-bold text-green-700">
                    {metric.withinTarget} ({complianceRate.toFixed(0)}%)
                  </div>
                </div>
                <div className="bg-amber-50 rounded px-2 py-1">
                  <div className="text-slate-600">Exceeds Target</div>
                  <div className="font-bold text-amber-700">
                    {metric.exceedsTarget} ({(100 - complianceRate).toFixed(0)}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xs text-slate-600 mb-1">Overall Compliance</div>
            <div className="text-lg font-bold text-green-700">
              {(
                (metrics.reduce((sum, m) => sum + m.withinTarget, 0) /
                  metrics.reduce((sum, m) => sum + m.sampleCount, 0)) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
          <div className="bg-teal-50 rounded-lg p-2">
            <div className="text-xs text-slate-600 mb-1">Total Samples</div>
            <div className="text-lg font-bold text-teal-700">
              {metrics.reduce((sum, m) => sum + m.sampleCount, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
