import { Plus, Video } from 'lucide-react';
import { Appointment } from '../../types/dashboard';
import { format } from 'date-fns';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Teleconsult':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (date: Date) => {
    try {
      return {
        date: format(date, 'MMM dd, yyyy'),
        time: format(date, 'h:mm a'),
      };
    } catch {
      return { date: 'Invalid Date', time: '' };
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Book New</span>
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => {
          const { date, time } = formatDateTime(appointment.appointmentDate);
          return (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {appointment.doctorName}
                      {appointment.isTeleconsult && (
                        <Video className="w-4 h-4 text-teal-600" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{appointment.clinicName}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700 font-medium">{date}</span>
                  <span className="text-gray-500">{time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
