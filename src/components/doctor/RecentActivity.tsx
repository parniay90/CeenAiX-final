import { FlaskConical, MessageSquare, Calendar, Pill, Clock } from 'lucide-react';
import { PatientActivity } from '../../types/doctor';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: PatientActivity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <FlaskConical className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'prescription':
        return <Pill className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-purple-100 text-purple-700';
      case 'message':
        return 'bg-blue-100 text-blue-700';
      case 'appointment':
        return 'bg-teal-100 text-teal-700';
      case 'prescription':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Recent Patient Activity</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="font-semibold text-sm text-gray-900">{activity.patientName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">{activity.message}</p>

                {activity.actionLabel && (
                  <button className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors">
                    {activity.actionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
        <button className="text-sm text-teal-700 font-semibold hover:text-teal-800 transition-colors">
          View All Activity →
        </button>
      </div>
    </div>
  );
}
