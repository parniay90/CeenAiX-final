import { Check, AlertCircle, Clock } from 'lucide-react';
import { PreventiveCare } from '../../types/dashboard';

interface PreventiveCareChecklistProps {
  items: PreventiveCare[];
}

export default function PreventiveCareChecklist({ items }: PreventiveCareChecklistProps) {
  const completedCount = items.filter((item) => item.status === 'completed').length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-teal-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-slate-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-teal-200 bg-teal-50';
      case 'overdue':
        return 'border-rose-200 bg-rose-50';
      case 'upcoming':
        return 'border-slate-200 bg-slate-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-teal-700';
      case 'overdue':
        return 'text-rose-700';
      case 'upcoming':
        return 'text-slate-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Preventive Care Checklist</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {completedCount} of {totalCount} completed
          </span>
          <span className="text-sm font-semibold text-teal-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 ${getStatusColor(item.status)}`}
          >
            <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
            <div className="flex-1">
              <h3 className={`font-semibold ${getTextColor(item.status)}`}>
                {item.careType}
              </h3>
              {item.status === 'completed' && item.completedDate && (
                <p className="text-xs text-gray-600 mt-1">
                  Completed: {new Date(item.completedDate).toLocaleDateString()}
                </p>
              )}
              {item.status === 'overdue' && item.dueDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  Overdue since: {new Date(item.dueDate).toLocaleDateString()}
                </p>
              )}
              {item.status === 'upcoming' && item.dueDate && (
                <p className="text-xs text-gray-600 mt-1">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {item.status !== 'completed' && (
              <button className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors">
                Schedule
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
