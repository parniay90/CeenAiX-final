import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { AIInsight } from '../../types/doctor';

interface AIInsightsProps {
  insights: AIInsight[];
}

export default function AIInsights({ insights }: AIInsightsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-bold text-gray-900">AI Clinical Insights</h2>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {insights.map((insight) => {
          const isExpanded = expandedId === insight.id;

          return (
            <div key={insight.id} className={`border-2 rounded-lg ${insight.color}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {insight.count && (
                        <span className="text-2xl font-bold mr-2">{insight.count}</span>
                      )}
                      {insight.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!insight.expandable && (
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    )}
                    {insight.expandable && (
                      <button
                        onClick={() => toggleExpand(insight.id)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && insight.details && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <ul className="space-y-2">
                      {insight.details.map((detail, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
