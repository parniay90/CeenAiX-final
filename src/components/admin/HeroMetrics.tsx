import { TrendingUp, TrendingDown } from 'lucide-react';
import { HeroMetric } from '../../types/admin';

interface HeroMetricsProps {
  metrics: HeroMetric[];
}

export default function HeroMetrics({ metrics }: HeroMetricsProps) {
  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-teal-600 transition-colors"
        >
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">{metric.label}</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            {metric.color === 'green' && (
              <div className="px-2 py-0.5 bg-green-500 bg-opacity-20 border border-green-500 rounded text-xs font-bold text-green-400">
                {metric.value}
              </div>
            )}
          </div>
          {metric.trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {metric.trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-500" />
              )}
              <span
                className={`text-xs font-bold ${
                  metric.trend > 0 ? 'text-green-500' : 'text-rose-500'
                }`}
              >
                {metric.trend > 0 ? '+' : ''}
                {metric.trend}%
              </span>
              {metric.trendLabel && (
                <span className="text-xs text-slate-500">{metric.trendLabel}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
