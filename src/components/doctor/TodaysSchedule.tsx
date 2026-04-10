import { useState } from 'react';
import { ChevronDown, ChevronUp, Video, Clock, Play } from 'lucide-react';
import { Appointment } from '../../types/doctor';

interface TodaysScheduleProps {
  appointments: Appointment[];
}

export default function TodaysSchedule({ appointments }: TodaysScheduleProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-teal-100 border-teal-300 text-teal-800';
      case 'pending':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'completed':
        return 'bg-slate-100 border-slate-300 text-slate-600';
      case 'no-show':
        return 'bg-rose-100 border-rose-300 text-rose-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Follow-up':
        return 'bg-teal-100 text-teal-700';
      case 'Urgent':
        return 'bg-red-100 text-red-700';
      case 'Teleconsult':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>8:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {appointments.map((appointment) => {
          const isExpanded = expandedId === appointment.id;
          const isCurrent = appointment.time === '10:00' && appointment.status === 'confirmed';

          return (
            <div
              key={appointment.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                isCurrent ? 'bg-teal-50 border-l-4 border-l-teal-600' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 text-center flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{appointment.time}</p>
                  <p className="text-xs text-gray-500">30 min</p>
                </div>

                <img
                  src={appointment.patientPhoto}
                  alt={appointment.patientName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <span className="text-sm text-gray-600">
                          {appointment.age}y, {appointment.gender}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{appointment.reason}</p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-1 ${getTypeColor(
                            appointment.type
                          )} text-xs font-semibold rounded`}
                        >
                          {appointment.type === 'Teleconsult' && (
                            <Video className="w-3 h-3 inline mr-1" />
                          )}
                          {appointment.type}
                        </span>
                        <span
                          className={`px-2 py-1 ${getStatusColor(
                            appointment.status
                          )} text-xs font-semibold rounded border`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(appointment.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {appointment.lastVisit && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Last Visit</p>
                          <p className="text-sm text-gray-800">{appointment.lastVisit}</p>
                        </div>
                      )}

                      {appointment.conditions && appointment.conditions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Active Conditions
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {appointment.conditions.map((condition, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {appointment.medications && appointment.medications.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Current Medications
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {appointment.medications.map((medication, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                              >
                                {medication}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {appointment.aiNote && (
                        <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-violet-900 mb-1">
                            AI Pre-Consultation Note
                          </p>
                          <p className="text-sm text-violet-800">{appointment.aiNote}</p>
                        </div>
                      )}

                      {isCurrent && (
                        <button className="w-full mt-2 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" />
                          Start Consultation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
