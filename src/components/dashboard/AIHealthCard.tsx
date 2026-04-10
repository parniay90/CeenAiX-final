import { ChevronRight } from 'lucide-react';
import { AIInsight, HealthScore } from '../../types/dashboard';

interface AIHealthCardProps {
  patientName: string;
  healthScore: HealthScore;
  insights: AIInsight[];
}

export default function AIHealthCard({ patientName, healthScore, insights }: AIHealthCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthScore.score / 100) * circumference;

  return (
    <div className="relative bg-gradient-to-br from-[#0F766E] to-[#0D9488] rounded-xl p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="90" cy="50" r="1.5" fill="currentColor">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <path
                d="M 10 10 L 30 10 L 30 30 M 70 70 L 90 70 L 90 50"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100;100,100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              Good morning, {patientName.split(' ')[0]}.
            </h2>
            <p className="text-teal-100 text-lg">Your health score today is:</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke={getScoreColor(healthScore.score)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{healthScore.score}</div>
                  <div className="text-xs text-teal-100">/ 100</div>
                </div>
              </div>
            </div>
            <div
              className="mt-3 px-4 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: getScoreColor(healthScore.score) }}
            >
              {healthScore.riskLevel}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {insights.map((insight) => (
            <button
              key={insight.id}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg flex items-center justify-between group transition-all"
            >
              <span className="text-sm font-medium text-left">{insight.insightText}</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-teal-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-5a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            <span>Powered by CeenAiX AI</span>
          </div>
          <span>Last updated: Today 7:30 AM</span>
        </div>
      </div>
    </div>
  );
}
