import { MapPin, Calendar, Clock, Video, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentDetail } from '../../types/appointments';

interface AppointmentCardProps {
  appointment: AppointmentDetail;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const getTypeBadge = (type: string) => {
    if (type === 'Teleconsult') {
      return 'bg-violet-100 text-violet-700 border-violet-300';
    }
    return 'bg-teal-100 text-teal-700 border-teal-300';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Confirmed') {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    return 'bg-amber-100 text-amber-700 border-amber-300';
  };

  const isWithin10Minutes = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const diff = appointmentTime.getTime() - now.getTime();
    return diff <= 10 * 60 * 1000 && diff > 0;
  };

  return (
    <div className="bg-white rounded-lg border-l-4 border-teal-600 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex gap-4">
        <img
          src={appointment.doctorPhoto}
          alt={appointment.doctorName}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{appointment.doctorName}</h3>
              <p className="text-sm text-gray-600 mt-1">{appointment.specialty}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(appointment.type)}`}>
                {appointment.type === 'Teleconsult' && <Video className="w-3 h-3 inline mr-1" />}
                {appointment.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{appointment.clinicName}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{appointment.clinicAddress}</span>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-lg font-serif font-semibold text-gray-900">
                {format(appointment.date, 'MMMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span className="text-lg font-serif font-semibold text-gray-900">
                {appointment.time}
              </span>
            </div>
          </div>

          {appointment.prepNotes && (
            <div className="mb-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-violet-900 text-sm mb-1">Preparation Notes</h4>
                  <p className="text-sm text-violet-800">{appointment.prepNotes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {appointment.type === 'Teleconsult' && (
              <button
                disabled={!isWithin10Minutes()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isWithin10Minutes()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Video className="w-4 h-4 inline mr-2" />
                {isWithin10Minutes() ? 'Join Call' : 'Join Call (Available 10 min before)'}
              </button>
            )}
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Reschedule
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Add to Calendar
            </button>
            {appointment.type === 'In-Person' && (
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                <MapPin className="w-4 h-4 inline mr-2" />
                Get Directions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
