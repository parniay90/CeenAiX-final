import type { LabVisit } from '../../types/patientLabResults';

interface MyTrendsTabProps {
  visit: LabVisit;
}

export default function MyTrendsTab({ visit }: MyTrendsTabProps) {
  const hba1cTest = visit.tests.find(t => t.name === 'HbA1c');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Your Health Trends 📈</h3>
        <p className="text-sm text-slate-500">Tracking your key lab values over time</p>
      </div>

      {hba1cTest && hba1cTest.trend && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-playfair font-bold text-slate-900">HbA1c Progress 🩸</h4>
              <p className="text-sm text-slate-500">6-month trend — target: below 6.5%</p>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold mb-1">
                {hba1cTest.value}% {hba1cTest.statusLabel}
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                ↓ –0.6% improved
              </div>
            </div>
          </div>

          <div className="relative h-56">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {hba1cTest.trend.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all duration-1000"
                    style={{
                      height: `${(value / Math.max(...hba1cTest.trend!)) * 100}%`,
                      animationDelay: `${idx * 150}ms`
                    }}
                  />
                  <div className="text-xs font-mono text-slate-400">{hba1cTest.trendDates?.[idx]}</div>
                  <div className="text-xs font-mono font-bold text-slate-700">{value}%</div>
                </div>
              ))}
            </div>

            <div className="absolute left-0 right-0 h-px bg-emerald-500" style={{ top: '30%' }}>
              <div className="absolute right-0 -top-3 text-xs text-emerald-600 font-bold">Target: 6.5%</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800 font-medium">
              Sep 2025: 7.4% → Mar 2026: 6.8% | Change: –0.6%
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Keep going — you could reach 6.5% by June 2026!
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4">💡 Key Insights from Your Lab Trends</h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-emerald-600 font-bold mb-2">Great Progress on Diabetes Management</div>
            <p className="text-sm text-slate-600">
              Your HbA1c has dropped from 7.4% to 6.8% — a 0.6-point improvement in just 6 months.
              At this rate, you could reach your target of 6.5% by June 2026. Metformin + diet changes are working! 💪
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-amber-600 font-bold mb-2">Vitamin D Still Needs Attention</div>
            <p className="text-sm text-slate-600">
              Your Vitamin D went from 18 to 22 ng/mL — improving, but still insufficient.
              Your daily Vitamin D 2000IU supplement should raise this to the healthy range (30+) by June.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-blue-600 font-bold mb-2">Cholesterol Perfectly Managed</div>
            <p className="text-sm text-slate-600">
              All your cholesterol values are in the healthy range. Your Atorvastatin medication is working well —
              keep taking it consistently at bedtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
