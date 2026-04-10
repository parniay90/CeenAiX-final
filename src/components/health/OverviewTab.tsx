import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { HealthTimelineEvent, ActiveCondition } from '../../types/healthRecords';

interface OverviewTabProps {
  timelineEvents: HealthTimelineEvent[];
  activeConditions: ActiveCondition[];
}

export default function OverviewTab({ timelineEvents, activeConditions }: OverviewTabProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const getEventColor = (type: string) => {
    const colors = {
      visit: 'bg-teal-600',
      diagnosis: 'bg-rose-600',
      prescription: 'bg-amber-600',
      lab: 'bg-violet-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active: 'bg-rose-100 text-rose-700',
      Controlled: 'bg-green-100 text-green-700',
      Resolved: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-teal-900">
              Connected to UAE Health Information Exchange
            </h3>
            <p className="text-sm text-teal-700 mt-1">
              Records from 3 providers loaded via NABIDH
            </p>
          </div>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Ctext x='50' y='20' font-family='Arial' font-size='12' font-weight='bold' fill='%230F766E' text-anchor='middle'%3ENABIDH%3C/text%3E%3C/svg%3E"
            alt="NABIDH"
            className="h-6"
          />
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Health Timeline</h2>
          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div key={event.id} className="relative">
                {idx !== timelineEvents.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                <div className="flex gap-4">
                  <div className={`w-5 h-5 ${getEventColor(event.eventType)} rounded-full flex-shrink-0 relative z-10`}></div>
                  <div className="flex-1 pb-6">
                    <button
                      onClick={() =>
                        setExpandedEvent(expandedEvent === event.id ? null : event.id)
                      }
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.eventTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.providerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(event.eventDate, 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        {expandedEvent === event.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {expandedEvent === event.id && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Detailed information about this event would be displayed here, including
                          notes, related documents, and additional context.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Conditions</h2>
          <div className="space-y-4">
            {activeConditions.map((condition) => (
              <div
                key={condition.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{condition.conditionName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      condition.status
                    )}`}
                  >
                    {condition.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">ICD-10: {condition.icd10Code}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Onset: {format(condition.onsetDate, 'MMM dd, yyyy')}</p>
                  <p>Managing Doctor: {condition.managingDoctor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
