import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ContextItem, HealthInsight, MOCK_ACTIVE_CONTEXT, MOCK_HEALTH_INSIGHTS, QUICK_TOPICS } from '../../types/aiChat';

interface ContextPanelProps {
  isDarkMode: boolean;
  onTopicClick?: (topic: string) => void;
}

export default function ContextPanel({ isDarkMode, onTopicClick }: ContextPanelProps) {
  const [expandedInsights, setExpandedInsights] = useState<string[]>([]);

  const toggleInsight = (id: string) => {
    setExpandedInsights((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedTextClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <div className={`h-full overflow-y-auto p-6 ${bgClass} ${textClass} border-l ${borderClass}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Active Context</h3>
        <p className={`text-sm ${mutedTextClass} mb-3`}>
          AI is referencing the following data:
        </p>
        <div className="flex flex-wrap gap-2">
          {MOCK_ACTIVE_CONTEXT.map((item, idx) => (
            <button
              key={idx}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all hover:scale-105 ${item.color}`}
            >
              <div className="font-bold">{item.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{item.data}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Health Insights Today</h3>
        <div className="space-y-3">
          {MOCK_HEALTH_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className={`${cardBgClass} border ${borderClass} rounded-lg p-4`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${textClass}`}>{insight.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                        insight.priority
                      )}`}
                    >
                      {insight.priority}
                    </span>
                  </div>
                  <p className={`text-sm ${mutedTextClass}`}>{insight.summary}</p>
                </div>
                <button
                  onClick={() => toggleInsight(insight.id)}
                  className={`p-1 ${mutedTextClass} hover:${textClass} transition-colors`}
                >
                  {expandedInsights.includes(insight.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {expandedInsights.includes(insight.id) && insight.fullDetails && (
                <div className={`mt-3 pt-3 border-t ${borderClass}`}>
                  <p className={`text-sm ${mutedTextClass}`}>{insight.fullDetails}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Ask About</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onTopicClick?.(topic)}
              className={`px-4 py-2 ${
                isDarkMode
                  ? 'bg-violet-900 text-violet-200 hover:bg-violet-800'
                  : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              } rounded-full text-sm font-medium transition-all`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-900 text-sm mb-1">Important Disclaimer</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              CeenAiX AI provides health information only. Always consult your doctor for medical
              decisions. In emergency, call 998.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
