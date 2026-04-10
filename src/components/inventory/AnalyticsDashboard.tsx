import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TopDispensedDrug {
  name: string;
  quantity: number;
  change: number;
}

interface SlowMovingItem {
  drugName: string;
  strength: string;
  currentStock: number;
  daysNoDispense: number;
  costValue: number;
}

interface AnalyticsDashboardProps {
  topDispensed: TopDispensedDrug[];
  slowMoving: SlowMovingItem[];
}

export default function AnalyticsDashboard({ topDispensed, slowMoving }: AnalyticsDashboardProps) {
  const maxQuantity = Math.max(...topDispensed.map((d) => d.quantity));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Top Dispensed Medications This Month
          </h3>
          <div className="space-y-3">
            {topDispensed.map((drug, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{drug.name}</span>
                    {drug.change > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs text-green-700">
                        <TrendingUp className="w-3 h-3" />
                        {drug.change}%
                      </span>
                    ) : drug.change < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs text-rose-700">
                        <TrendingDown className="w-3 h-3" />
                        {Math.abs(drug.change)}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-xs text-slate-500">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{drug.quantity}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all"
                    style={{ width: `${(drug.quantity / maxQuantity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Stock Value Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[
              { month: 'Jan', value: 285000 },
              { month: 'Feb', value: 298000 },
              { month: 'Mar', value: 312000 },
              { month: 'Apr', value: 295000 },
              { month: 'May', value: 318000 },
              { month: 'Jun', value: 335000 },
            ].map((data, idx) => {
              const maxValue = 350000;
              const heightPercent = (data.value / maxValue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-teal-600 rounded-t hover:bg-teal-700 transition-colors cursor-pointer"
                    style={{ height: `${heightPercent}%` }}
                    title={`AED ${data.value.toLocaleString()}`}
                  />
                  <span className="text-xs text-slate-600 mt-2 font-semibold">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-600">
              Current Value:{' '}
              <span className="font-bold text-teal-700">AED 335,000</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Slow-Moving Stock (No Dispense {'>'} 60 Days)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                  Drug Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                  Strength
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                  Days No Dispense
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">
                  Cost Value
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {slowMoving.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {item.drugName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.strength}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold text-slate-900">
                    {item.currentStock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-900 rounded text-xs font-bold">
                      {item.daysNoDispense} days
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    AED {item.costValue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold">
                      Review Inventory
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {slowMoving.length === 0 && (
          <div className="text-center py-8 text-slate-600">
            <p className="font-semibold">No slow-moving stock detected</p>
            <p className="text-sm text-slate-500">All inventory is moving efficiently</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Wastage & Write-Off Trend
        </h3>
        <div className="h-48 flex items-end justify-between gap-3">
          {[
            { month: 'Jan', value: 2400 },
            { month: 'Feb', value: 1800 },
            { month: 'Mar', value: 2100 },
            { month: 'Apr', value: 1500 },
            { month: 'May', value: 1200 },
            { month: 'Jun', value: 980 },
          ].map((data, idx) => {
            const maxValue = 3000;
            const heightPercent = (data.value / maxValue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-rose-500 rounded-t hover:bg-rose-600 transition-colors cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                  title={`AED ${data.value.toLocaleString()}`}
                />
                <span className="text-xs text-slate-600 mt-2 font-semibold">{data.month}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-600">This Month</div>
            <div className="text-lg font-bold text-rose-700">AED 980</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Last Month</div>
            <div className="text-lg font-bold text-slate-700">AED 1,200</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Change</div>
            <div className="text-lg font-bold text-green-700">-18.3%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
