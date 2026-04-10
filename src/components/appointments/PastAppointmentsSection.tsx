import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentDetail } from '../../types/appointments';

interface PastAppointmentsSectionProps {
  appointments: AppointmentDetail[];
}

export default function PastAppointmentsSection({ appointments }: PastAppointmentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    if (type === 'Teleconsult') return 'text-violet-700';
    return 'text-teal-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-xl font-bold text-gray-900">Past Appointments</h3>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Clinic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(appointment.date, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={appointment.doctorPhoto}
                          alt={appointment.doctorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {appointment.doctorName}
                          </div>
                          <div className="text-xs text-gray-600">{appointment.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{appointment.clinicName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setSelectedAppointment(
                            selectedAppointment === appointment.id ? null : appointment.id
                          )
                        }
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        View Notes
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {appointment.followUpRequired && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                          Follow-up Required
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedAppointment && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              {appointments
                .filter((a) => a.id === selectedAppointment)
                .map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Visit Summary</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(appointment.date, 'MMMM dd, yyyy')} with {appointment.doctorName}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedAppointment(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      {appointment.diagnosis && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Diagnosis</h5>
                          <p className="text-sm text-gray-700">{appointment.diagnosis}</p>
                        </div>
                      )}

                      {appointment.prescriptionIssued && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Prescription</h5>
                          <p className="text-sm text-gray-700">Prescription was issued during this visit</p>
                        </div>
                      )}

                      {appointment.followUpInstructions && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Follow-up Instructions</h5>
                          <p className="text-sm text-gray-700">{appointment.followUpInstructions}</p>
                        </div>
                      )}

                      {appointment.aiTakeaways && appointment.aiTakeaways.length > 0 && (
                        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                            <h5 className="font-semibold text-violet-900">AI-Generated Key Takeaways</h5>
                          </div>
                          <ul className="space-y-2">
                            {appointment.aiTakeaways.map((takeaway, idx) => (
                              <li key={idx} className="text-sm text-violet-800 flex items-start gap-2">
                                <span className="text-violet-600 mt-1">•</span>
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
