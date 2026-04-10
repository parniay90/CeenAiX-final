import { DollarSign, PieChart } from 'lucide-react';
import type { Medication } from '../../types/medications';

interface CostsCoverageTabProps {
  medications: Medication[];
}

export default function CostsCoverageTab({ medications }: CostsCoverageTabProps) {
  const totalFullPrice = medications.reduce((sum, med) => sum + med.monthlyPrice, 0);
  const totalYouPay = medications.reduce((sum, med) => sum + med.insurancePrice, 0);
  const totalCovered = totalFullPrice - totalYouPay;
  const annualYouPay = totalYouPay * 12;
  const annualSavings = totalCovered * 12;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-teal-200 shadow-lg">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-slate-400 uppercase tracking-wide font-bold mb-3">Your Monthly Cost</div>
            <div className="text-5xl font-mono font-bold text-teal-600 mb-4">AED {totalYouPay}</div>
            <div className="text-sm text-slate-400 mb-6">per month — your out-of-pocket</div>

            <div className="space-y-3 mb-6">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{med.categoryEmoji}</span>
                    <span className="text-slate-700">{med.brandName} {med.strength}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-900">
                    AED {med.insurancePrice}
                    {med.insuranceCovered && med.insurancePrice === 0 && (
                      <span className="text-xs text-emerald-600 ml-2">(100% covered)</span>
                    )}
                    {med.insuranceCovered && med.insurancePrice > 0 && (
                      <span className="text-xs text-teal-600 ml-2">(10% co-pay)</span>
                    )}
                    {!med.insuranceCovered && (
                      <span className="text-xs text-amber-600 ml-2">(not covered)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">Total without insurance:</div>
                <div className="text-sm text-slate-400 line-through font-mono">AED {totalFullPrice}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-base font-bold text-emerald-600">You save:</div>
                <div className="text-xl font-mono font-bold text-emerald-600">AED {totalCovered}/month</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-400 uppercase tracking-wide font-bold mb-3">Coverage Breakdown</div>

            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F0F9FF"
                    strokeWidth="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="20"
                    strokeDasharray={`${(totalCovered / totalFullPrice) * 251.2} 251.2`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="20"
                    strokeDasharray={`${(totalYouPay / totalFullPrice) * 251.2} 251.2`}
                    strokeDashoffset={`-${(totalCovered / totalFullPrice) * 251.2}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-teal-600">AED {totalYouPay}</div>
                    <div className="text-xs text-slate-400">your cost</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-slate-700">Daman Pays</span>
                </div>
                <span className="text-sm font-bold text-slate-900">AED {totalCovered} ({Math.round((totalCovered / totalFullPrice) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded-full" />
                  <span className="text-sm text-slate-700">You Pay</span>
                </div>
                <span className="text-sm font-bold text-slate-900">AED {totalYouPay} ({Math.round((totalYouPay / totalFullPrice) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Medication Coverage Table</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Medication</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Full Price</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Daman Covers</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">You Pay</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Coverage Type</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, idx) => (
                <tr key={med.id} className={idx !== medications.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span>{med.categoryEmoji}</span>
                      <span className="text-sm font-medium text-slate-900">{med.brandName} {med.strength}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-sm text-slate-600">AED {med.monthlyPrice}</td>
                  <td className="py-4 px-4 text-right font-mono text-sm text-emerald-600 font-bold">
                    AED {med.monthlyPrice - med.insurancePrice}
                    {med.insuranceCovered && (
                      <span className="text-xs ml-1">
                        ({Math.round(((med.monthlyPrice - med.insurancePrice) / med.monthlyPrice) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-sm font-bold text-slate-900">AED {med.insurancePrice}</td>
                  <td className="py-4 px-4">
                    {med.insuranceCovered ? (
                      med.insurancePrice === 0 ? (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-emerald-600">✓</span>
                          <span className="text-slate-600">Generic — fully covered</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-green-600">✓</span>
                          <span className="text-slate-600">Brand — 10% co-pay</span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-amber-600">⚠️</span>
                        <span className="text-slate-600">Supplement — not covered</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-teal-50 font-bold">
                <td className="py-4 px-4 text-sm text-slate-900">TOTAL</td>
                <td className="py-4 px-4 text-right font-mono text-sm text-slate-900">AED {totalFullPrice}</td>
                <td className="py-4 px-4 text-right font-mono text-sm text-emerald-600">AED {totalCovered}</td>
                <td className="py-4 px-4 text-right font-mono text-sm text-teal-600">AED {totalYouPay}</td>
                <td className="py-4 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-slate-500 italic">
          Note: Costs are approximate. Actual co-pay may vary by pharmacy.
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-8 h-8 text-teal-600" />
          <h3 className="text-xl font-bold text-slate-900">Annual Cost Projection</h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-slate-400 mb-2">Without Insurance</div>
            <div className="text-3xl font-mono font-bold text-slate-400 line-through">AED {totalFullPrice * 12}</div>
            <div className="text-xs text-slate-400 mt-1">per year</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-teal-600 mb-2">With Daman Gold</div>
            <div className="text-3xl font-mono font-bold text-teal-600">AED {annualYouPay}</div>
            <div className="text-xs text-slate-500 mt-1">per year (AED {totalYouPay}/month)</div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
            <div className="text-sm text-emerald-100 mb-2">Your Savings</div>
            <div className="text-3xl font-mono font-bold">AED {annualSavings}</div>
            <div className="text-xs text-emerald-100 mt-1">saved per year</div>
          </div>
        </div>
      </div>
    </div>
  );
}
