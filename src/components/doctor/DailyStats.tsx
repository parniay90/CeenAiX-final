import { DailyStat } from '../../types/doctor';

interface DailyStatsProps {
  stats: DailyStat[];
}

export default function DailyStats({ stats }: DailyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
            {stat.badge && (
              <span className={`px-2 py-0.5 ${stat.badge.color} text-xs font-semibold rounded-full`}>
                {stat.badge.text}
              </span>
            )}
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                {stat.total && (
                  <span className="text-lg text-gray-400">/ {stat.total}</span>
                )}
              </div>

              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>

            {stat.label === "Today's Appointments" && stat.total && (
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={stat.color}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(stat.value / stat.total) * 176} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">
                    {Math.round((stat.value / stat.total) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
