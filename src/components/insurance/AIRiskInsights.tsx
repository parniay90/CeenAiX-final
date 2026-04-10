import { TrendingUp, AlertTriangle, HeartPulse, DollarSign } from 'lucide-react';
import { MOCK_RISK_INSIGHTS } from '../../types/insurance';

export default function AIRiskInsights() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'high-cost-risk':
        return <DollarSign className="w-5 h-5 text-violet-400" />;
      case 'chronic-deterioration':
        return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'preventive-care':
        return <TrendingUp className="w-5 h-5 text-teal-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-violet-600';
      case 'high':
        return 'border-rose-600';
      case 'medium':
        return 'border-teal-600';
      default:
        return 'border-slate-600';
    }
  };

  const getBgColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-violet-900 bg-opacity-10';
      case 'high':
        return 'bg-rose-900 bg-opacity-10';
      case 'medium':
        return 'bg-teal-900 bg-opacity-10';
      default:
        return 'bg-slate-900';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-violet-400" />
        <h2 className="text-sm font-bold text-white uppercase">AI Risk Insights</h2>
      </div>

      <div className="space-y-3">
        {MOCK_RISK_INSIGHTS.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-lg p-4 ${getBorderColor(insight.severity)} ${getBgColor(insight.severity)}`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1">{insight.title}</h3>
                <p className="text-sm text-slate-300 mb-2">{insight.description}</p>
                <div className="bg-slate-950 bg-opacity-50 border border-slate-700 rounded p-2 mb-2">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Recommendation</div>
                  <div className="text-xs text-white">{insight.recommendation}</div>
                </div>
                {insight.potentialSavings && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Potential Savings:</span>
                    <span className="text-sm font-bold text-green-400">
                      AED {insight.potentialSavings.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
