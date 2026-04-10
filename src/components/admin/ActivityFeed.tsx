import { Clock, FileText, Database, AlertTriangle, Brain, TestTube, Calendar } from 'lucide-react';
import { ActivityEvent, ActivityType } from '../../types/admin';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const getEventIcon = (type: ActivityType) => {
    switch (type) {
      case 'prescription':
        return FileText;
      case 'nabidh_sync':
        return Database;
      case 'interaction_alert':
        return AlertTriangle;
      case 'ai_consultation':
        return Brain;
      case 'lab_result':
        return TestTube;
      case 'appointment':
        return Calendar;
    }
  };

  const getEventColor = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'info':
        return 'text-teal-400 bg-teal-500 bg-opacity-10 border-teal-600';
      case 'warning':
        return 'text-amber-400 bg-amber-500 bg-opacity-10 border-amber-600';
      case 'critical':
        return 'text-rose-400 bg-rose-500 bg-opacity-10 border-rose-600';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-teal-400" />
        <h3 className="text-sm font-bold text-white uppercase">Organization Activity Feed</h3>
        <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map((event) => {
          const Icon = getEventIcon(event.type);
          const colorClass = getEventColor(event.severity);

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
            >
              <div className={`p-2 rounded-lg border ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-400 mb-1">
                  {event.organizationName}
                </div>
                <div className="text-sm font-semibold text-white mb-1">{event.description}</div>
                <div className="text-xs text-slate-500">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
}
