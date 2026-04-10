import { useState } from 'react';
import { Plus } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import FilterPanel from '../components/appointments/FilterPanel';
import AppointmentCard from '../components/appointments/AppointmentCard';
import BookAppointmentDrawer from '../components/appointments/BookAppointmentDrawer';
import PastAppointmentsSection from '../components/appointments/PastAppointmentsSection';
import TeleconsultBanner from '../components/appointments/TeleconsultBanner';
import { MOCK_APPOINTMENTS, MOCK_PAST_APPOINTMENTS } from '../types/appointments';

export default function Appointments() {
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  const upcomingAppointments = MOCK_APPOINTMENTS.filter(
    (apt) => apt.status !== 'Completed' && apt.status !== 'Cancelled'
  );

  const hasTodayTeleconsult = upcomingAppointments.some((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const todayTeleconsult = upcomingAppointments.find((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PatientTopNav patientName="Ahmed Al Maktoum" />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="appointments" />

        <main className="flex-1 overflow-y-auto">
        <div className="flex">
          <FilterPanel onFilterChange={() => {}} />

          <div className="flex-1 p-6">
        {hasTodayTeleconsult && todayTeleconsult && (
          <TeleconsultBanner
            doctorName={todayTeleconsult.doctorName}
            appointmentTime={new Date(todayTeleconsult.date)}
          />
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Appointments</h1>
            <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-sm font-semibold">
              {upcomingAppointments.length}
            </span>
          </div>

          <button
            onClick={() => setIsBookingDrawerOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl sticky top-6 z-30"
          >
            <Plus className="w-5 h-5" />
            Book Appointment
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {upcomingAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>

        {upcomingAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
            <p className="text-gray-600 mb-4">You don't have any scheduled appointments</p>
            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Book Your First Appointment
            </button>
          </div>
        )}

        <PastAppointmentsSection appointments={MOCK_PAST_APPOINTMENTS} />
          </div>
        </div>
        </main>
      </div>

      <BookAppointmentDrawer
        isOpen={isBookingDrawerOpen}
        onClose={() => setIsBookingDrawerOpen(false)}
      />
    </div>
  );
}
