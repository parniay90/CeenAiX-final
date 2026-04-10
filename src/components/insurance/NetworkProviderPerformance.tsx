import { Building2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { MOCK_NETWORK_PROVIDERS } from '../../types/insurance';

export default function NetworkProviderPerformance() {
  const getFraudScoreColor = (score: number) => {
    if (score >= 30) return 'text-rose-400';
    if (score >= 20) return 'text-amber-400';
    return 'text-green-400';
  };

  const getFraudScoreIcon = (score: number) => {
    if (score >= 30) return <AlertTriangle className="w-3.5 h-3.5" />;
    if (score >= 20) return <TrendingUp className="w-3.5 h-3.5" />;
    return <TrendingDown className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-400" />
        <h2 className="text-sm font-bold text-white uppercase">Network Provider Performance</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-3 py-2">Provider</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-3 py-2">Claims</th>
              <th className="text-right text-xs font-bold text-slate-400 uppercase px-3 py-2">Avg Value</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-3 py-2">Denial %</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-3 py-2">Fraud Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {MOCK_NETWORK_PROVIDERS.map((provider) => (
              <tr key={provider.id} className="hover:bg-slate-900 transition-colors">
                <td className="px-3 py-3">
                  <div className="text-sm font-bold text-white">{provider.name}</div>
                  <div className="text-xs text-slate-500">{provider.specialty}</div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="text-sm text-slate-300">{provider.claimsCount.toLocaleString()}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-bold text-white">
                    AED {provider.avgClaimValue.toLocaleString()}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`text-sm font-bold ${
                      provider.denialRate > 6
                        ? 'text-rose-400'
                        : provider.denialRate > 4
                        ? 'text-amber-400'
                        : 'text-green-400'
                    }`}
                  >
                    {provider.denialRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className={`flex items-center justify-center gap-1 text-sm font-bold ${getFraudScoreColor(provider.fraudScore)}`}>
                    {getFraudScoreIcon(provider.fraudScore)}
                    {provider.fraudScore}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-400">Fraud Score: 0-19 (Low Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-slate-400">20-29 (Medium Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
            <span className="text-slate-400">30+ (High Risk)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
