import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type TimeRange = '7D' | '30D' | '3M' | '1Y';

export default function HealthTrends() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  const mockData = [
    { day: 'Mar 8', bp: 125, sugar: 105, weight: 82 },
    { day: 'Mar 11', bp: 128, sugar: 110, weight: 82.5 },
    { day: 'Mar 14', bp: 130, sugar: 108, weight: 82.2 },
    { day: 'Mar 17', bp: 132, sugar: 115, weight: 83 },
    { day: 'Mar 20', bp: 135, sugar: 118, weight: 83.5 },
    { day: 'Mar 23', bp: 138, sugar: 112, weight: 83.2 },
    { day: 'Mar 26', bp: 136, sugar: 120, weight: 84 },
    { day: 'Mar 29', bp: 140, sugar: 125, weight: 84.5 },
    { day: 'Apr 1', bp: 142, sugar: 122, weight: 84.2 },
    { day: 'Apr 4', bp: 145, sugar: 130, weight: 85 },
  ];

  const metrics = [
    {
      label: 'Systolic BP Avg',
      value: '138',
      unit: 'mmHg',
      trend: 'up',
      change: '+8%',
      color: 'teal',
    },
    {
      label: 'Glucose Avg',
      value: '117',
      unit: 'mg/dL',
      trend: 'up',
      change: '+12%',
      color: 'amber',
    },
    {
      label: 'BMI',
      value: '27.2',
      unit: '',
      trend: 'up',
      change: '+3%',
      color: 'violet',
    },
  ];

  const maxBP = Math.max(...mockData.map((d) => d.bp));
  const maxSugar = Math.max(...mockData.map((d) => d.sugar));
  const maxWeight = Math.max(...mockData.map((d) => d.weight));

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Health Trends</h2>
        <div className="flex gap-2">
          {(['7D', '30D', '3M', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="bpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sugarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g>
            {mockData.map((point, i) => {
              const x = (i / (mockData.length - 1)) * 750 + 25;
              const bpY = 180 - ((point.bp - 100) / (maxBP - 100)) * 150;

              if (i < mockData.length - 1) {
                const nextPoint = mockData[i + 1];
                const nextX = ((i + 1) / (mockData.length - 1)) * 750 + 25;
                const nextBpY = 180 - ((nextPoint.bp - 100) / (maxBP - 100)) * 150;

                return (
                  <line
                    key={`bp-${i}`}
                    x1={x}
                    y1={bpY}
                    x2={nextX}
                    y2={nextBpY}
                    stroke="#0D9488"
                    strokeWidth="3"
                  />
                );
              }
              return null;
            })}
          </g>

          <g>
            {mockData.map((point, i) => {
              const x = (i / (mockData.length - 1)) * 750 + 25;
              const sugarY = 180 - ((point.sugar - 80) / (maxSugar - 80)) * 150;

              if (i < mockData.length - 1) {
                const nextPoint = mockData[i + 1];
                const nextX = ((i + 1) / (mockData.length - 1)) * 750 + 25;
                const nextSugarY = 180 - ((nextPoint.sugar - 80) / (maxSugar - 80)) * 150;

                return (
                  <line
                    key={`sugar-${i}`}
                    x1={x}
                    y1={sugarY}
                    x2={nextX}
                    y2={nextSugarY}
                    stroke="#F59E0B"
                    strokeWidth="3"
                  />
                );
              }
              return null;
            })}
          </g>

          {mockData.map((point, i) => {
            const x = (i / (mockData.length - 1)) * 750 + 25;
            const bpY = 180 - ((point.bp - 100) / (maxBP - 100)) * 150;
            const sugarY = 180 - ((point.sugar - 80) / (maxSugar - 80)) * 150;

            return (
              <g key={`points-${i}`}>
                <circle cx={x} cy={bpY} r="4" fill="#0D9488" />
                <circle cx={x} cy={sugarY} r="4" fill="#F59E0B" />
              </g>
            );
          })}
        </svg>

        <div className="absolute top-4 right-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
            <span className="text-gray-600">Blood Pressure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
            <span className="text-gray-600">Blood Sugar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
            <span className="text-gray-600">Weight</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-lg bg-gray-50 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric.trend === 'up' ? 'text-rose-600' : 'text-green-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
