import { useState, useCallback } from 'react';
import { Plus, CalendarX } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import FilterPanel, { AppointmentFilters } from '../components/appointments/FilterPanel';
import AppointmentCard from '../components/appointments/AppointmentCard';
import BookAppointmentDrawer from '../components/appointments/BookAppointmentDrawer';
import PastAppointmentsSection from '../components/appointments/PastAppointmentsSection';
import TeleconsultBanner from '../components/appointments/TeleconsultBanner';
import { MOCK_APPOINTMENTS, MOCK_PAST_APPOINTMENTS, AppointmentDetail } from '../types/appointments';

function applyFilters(appointments: AppointmentDetail[], filters: AppointmentFilters): AppointmentDetail[] {
  return appointments.filter(apt => {
    if (filters.status !== 'All' && apt.status !== filters.status) return false;
    if (filters.type !== 'All' && apt.type !== filters.type) return false;
    if (filters.specialty !== 'All' && apt.specialty !== filters.specialty) return false;
    if (filters.provider !== 'All' && apt.doctorName !== filters.provider) return false;
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      from.setHours(0, 0, 0, 0);
      if (new Date(apt.date) < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(apt.date) > to) return false;
    }
    return true;
  });
}

export default function Appointments() {
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({
    status: 'All',
    type: 'All',
    specialty: 'All',
    provider: 'All',
    dateFrom: '',
    dateTo: '',
  });

  const handleFilterChange = useCallback((f: AppointmentFilters) => {
    setFilters(f);
  }, []);

  const isStatusFilteringPast =
    filters.status === 'Completed' || filters.status === 'Cancelled';

  const upcomingSource = MOCK_APPOINTMENTS.filter(
    apt => apt.status !== 'Completed' && apt.status !== 'Cancelled'
  );
  const pastSource = MOCK_PAST_APPOINTMENTS;

  const filteredUpcoming = isStatusFilteringPast
    ? []
    : applyFilters(upcomingSource, filters);

  const filteredPast = applyFilters(pastSource, filters);

  const hasTodayTeleconsult = filteredUpcoming.some((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const todayTeleconsult = filteredUpcoming.find((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const totalFiltered = filteredUpcoming.length + filteredPast.length;
  const filtersActive =
    filters.status !== 'All' ||
    filters.type !== 'All' ||
    filters.specialty !== 'All' ||
    filters.provider !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName="Ahmed Al Maktoum" />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="appointments" />

        <main className="flex-1 overflow-y-auto">
          <div className="flex">
            <FilterPanel onFilterChange={handleFilterChange} />

            <div className="flex-1 p-6">
              {hasTodayTeleconsult && todayTeleconsult && (
                <TeleconsultBanner
                  doctorName={todayTeleconsult.doctorName}
                  appointmentTime={new Date(todayTeleconsult.date)}
                />
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isStatusFilteringPast ? 'Past Appointments' : 'Upcoming Appointments'}
                  </h1>
                  <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-sm font-semibold">
                    {filtersActive ? totalFiltered : filteredUpcoming.length}
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

              {!isStatusFilteringPast && (
                <div className="space-y-4 mb-8">
                  {filteredUpcoming.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}

                  {filteredUpcoming.length === 0 && !filtersActive && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                  {filteredUpcoming.length === 0 && filtersActive && !isStatusFilteringPast && (
                    <EmptyFilterResult />
                  )}
                </div>
              )}

              <PastAppointmentsSection appointments={filteredPast} />

              {isStatusFilteringPast && filteredPast.length === 0 && (
                <EmptyFilterResult />
              )}
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

function EmptyFilterResult() {
  return (
    <div className="text-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <CalendarX className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No appointments match your filters</h3>
      <p className="text-sm text-gray-500">Try adjusting or clearing the filters on the left.</p>
    </div>
  );
}
