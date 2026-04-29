import { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, CalendarX, ChevronUp, X, Clock, CalendarCheck, AlertCircle, ChevronDown } from 'lucide-react';
import { format, addDays } from 'date-fns';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import FilterPanel, { AppointmentFilters } from '../components/appointments/FilterPanel';
import AppointmentCard from '../components/appointments/AppointmentCard';
import BookAppointmentDrawer from '../components/appointments/BookAppointmentDrawer';
import PastAppointmentsSection from '../components/appointments/PastAppointmentsSection';
import TeleconsultBanner from '../components/appointments/TeleconsultBanner';
import DirectionsModal from '../components/patient/DirectionsModal';
import { MOCK_APPOINTMENTS, MOCK_PAST_APPOINTMENTS, AppointmentDetail, MOCK_TIME_SLOTS } from '../types/appointments';
import { MOCK_PATIENT } from '../types/patientDashboard';

// Clinic coordinates map
const CLINIC_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Dubai Healthcare City': { lat: 25.2285, lng: 55.3273 },
  'Mediclinic Dubai Mall': { lat: 25.1972, lng: 55.2796 },
  'Cleveland Clinic Abu Dhabi': { lat: 24.4975, lng: 54.4040 },
  'American Hospital Dubai': { lat: 25.2283, lng: 55.3255 },
};

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

// ── Reschedule Modal ───────────────────────────────────────────────────────────
function RescheduleModal({
  appointment,
  onClose,
  onConfirm,
}: {
  appointment: AppointmentDetail;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(today, 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

  const handleConfirm = () => {
    if (!selectedTime) return;
    onConfirm(selectedDate, selectedTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Reschedule Appointment</p>
              <p className="text-xs text-gray-400 mt-0.5">{appointment.doctorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Date picker */}
          <p className="text-sm font-semibold text-gray-700 mb-3">Select a new date</p>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {days.map(day => {
              const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                  className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}
                >
                  <span className="text-xs font-medium">{format(day, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(day, 'd')}</span>
                  <span className="text-xs">{format(day, 'MMM')}</span>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          <p className="text-sm font-semibold text-gray-700 mb-3">Select a time</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {MOCK_TIME_SLOTS.map(slot => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  !slot.available
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : selectedTime === slot.time
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-200 text-gray-700 hover:border-teal-300'
                }`}
              >
                {slot.available ? slot.time : <span className="line-through">{slot.time}</span>}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              selectedTime
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reschedule Success Modal ───────────────────────────────────────────────────
function RescheduleSuccessModal({
  date,
  time,
  onDone,
}: {
  date: Date;
  time: string;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-8 py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
            <CalendarCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-xl mb-4">Reschedule Requested!</h3>
          <p className="text-gray-700 font-semibold text-base mb-1">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-teal-600 font-semibold text-base mb-4">{time}</p>
          <p className="text-gray-400 text-sm mb-8">Your doctor will confirm the new time shortly.</p>
          <button
            onClick={onDone}
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cancel Modal ───────────────────────────────────────────────────────────────
const CANCEL_REASONS = [
  'I feel better and no longer need the appointment',
  'I need to reschedule for a different time',
  'Personal / family emergency',
  'Work or travel conflict',
  'Found a different provider',
  'Other',
];

function CancelModal({ appointment, onClose }: { appointment: AppointmentDetail; onClose: () => void }) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedReason) return;
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Cancel Appointment</p>
              <p className="text-xs text-gray-400 mt-0.5">{appointment.doctorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4">
          {confirmed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Appointment Cancelled</h3>
              <p className="text-gray-500 text-sm">Your appointment with {appointment.doctorName} has been cancelled.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Why do you want to cancel your appointment on{' '}
                <span className="font-semibold text-gray-900">{format(appointment.date, 'MMM d, yyyy')}</span>?
              </p>
              <div className="space-y-2 mb-4">
                {CANCEL_REASONS.map(reason => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                      selectedReason === reason
                        ? 'border-red-400 bg-red-50 text-red-700 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {selectedReason === 'Other' && (
                <textarea
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  placeholder="Please tell us more..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  rows={3}
                />
              )}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedReason}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    selectedReason
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Cancel Appointment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Add to Calendar Modal ──────────────────────────────────────────────────────
function AddToCalendarModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Add to Calendar</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">In Progress</h3>
          <p className="text-gray-500 text-sm">Calendar integration is coming soon. You'll be able to add appointments directly to Google Calendar, Apple Calendar, and Outlook.</p>
          <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Enhanced AppointmentCard with action handlers ─────────────────────────────
function AppointmentCardWithActions({
  appointment,
  onReschedule,
}: {
  appointment: AppointmentDetail;
  onReschedule: (id: string, date: Date, time: string) => void;
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [successData, setSuccessData] = useState<{ date: Date; time: string } | null>(null);

  const coordinates = CLINIC_COORDINATES[appointment.clinicName] || { lat: 25.2048, lng: 55.2708 };

  const isWithin10Minutes = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const diff = appointmentTime.getTime() - now.getTime();
    return diff <= 10 * 60 * 1000 && diff > 0;
  };

  const handleRescheduleConfirm = (date: Date, time: string) => {
    setShowReschedule(false);
    setSuccessData({ date, time });
    onReschedule(appointment.id, date, time);
  };

  const handleSuccessDone = () => {
    setSuccessData(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg border-l-4 border-teal-600 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-4">
          <img src={appointment.doctorPhoto} alt={appointment.doctorName} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-600 mt-1">{appointment.specialty}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${appointment.type === 'Teleconsult' ? 'bg-violet-100 text-violet-700 border-violet-300' : 'bg-teal-100 text-teal-700 border-teal-300'}`}>
                  {appointment.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                  {appointment.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <span className="font-medium">{appointment.clinicName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{appointment.clinicAddress}</span>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <span className="text-lg font-semibold text-gray-900">{format(appointment.date, 'MMMM dd, yyyy')}</span>
              <span className="text-lg font-semibold text-gray-900">{appointment.time}</span>
            </div>

            {appointment.prepNotes && (
              <div className="mb-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-sm font-semibold text-violet-900 mb-1">Preparation Notes</p>
                <p className="text-sm text-violet-800">{appointment.prepNotes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {appointment.type === 'Teleconsult' && (
                <button
                  disabled={!isWithin10Minutes()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${isWithin10Minutes() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  {isWithin10Minutes() ? 'Join Call' : 'Join Call (Available 10 min before)'}
                </button>
              )}
              <button onClick={() => setShowReschedule(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Reschedule
              </button>
              <button onClick={() => setShowCancel(true)} className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowCalendar(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Add to Calendar
              </button>
              {appointment.type === 'In-Person' && (
                <button onClick={() => setShowDirections(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                  Get Directions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReschedule && (
        <RescheduleModal
          appointment={appointment}
          onClose={() => setShowReschedule(false)}
          onConfirm={handleRescheduleConfirm}
        />
      )}
      {successData && (
        <RescheduleSuccessModal
          date={successData.date}
          time={successData.time}
          onDone={handleSuccessDone}
        />
      )}
      {showCancel && <CancelModal appointment={appointment} onClose={() => setShowCancel(false)} />}
      {showCalendar && <AddToCalendarModal onClose={() => setShowCalendar(false)} />}
      {showDirections && (
        <DirectionsModal
          isOpen={showDirections}
          onClose={() => setShowDirections(false)}
          clinic={appointment.clinicName}
          location={appointment.clinicAddress}
          doctorName={appointment.doctorName}
          coordinates={coordinates}
        />
      )}
    </>
  );
}

// ── Past Appointments — open by default + badge when collapsed ─────────────────
function PastAppointmentsSectionOpen({ appointments }: { appointments: AppointmentDetail[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">Past Appointments</h3>
          {!isExpanded && (
            <span className="px-2.5 py-0.5 bg-teal-600 text-white text-sm font-semibold rounded-full">
              {appointments.length}
            </span>
          )}
        </div>
        {isExpanded
          ? <ChevronUp className="w-6 h-6 text-gray-600" />
          : <ChevronDown className="w-6 h-6 text-gray-600" />
        }
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Clinic</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{format(appointment.date, 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={appointment.doctorPhoto} alt={appointment.doctorName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{appointment.doctorName}</div>
                          <div className="text-xs text-gray-600">{appointment.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{appointment.clinicName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${appointment.type === 'Teleconsult' ? 'text-violet-700' : 'text-teal-700'}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedAppointment(selectedAppointment === appointment.id ? null : appointment.id)}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
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
              {appointments.filter(a => a.id === selectedAppointment).map(appointment => (
                <div key={appointment.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Visit Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">{format(appointment.date, 'MMMM dd, yyyy')} with {appointment.doctorName}</p>
                    </div>
                    <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-600">✕</button>
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
                        <h5 className="font-semibold text-violet-900 mb-3">AI-Generated Key Takeaways</h5>
                        <ul className="space-y-2">
                          {appointment.aiTakeaways.map((t, i) => (
                            <li key={i} className="text-sm text-violet-800 flex items-start gap-2">
                              <span className="text-violet-600 mt-1">•</span>
                              <span>{t}</span>
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Appointments() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const [filters, setFilters] = useState<AppointmentFilters>({
    status: 'All', type: 'All', specialty: 'All',
    provider: 'All', dateFrom: '', dateTo: '',
  });

  const handleFilterChange = useCallback((f: AppointmentFilters) => setFilters(f), []);

  const handleReschedule = useCallback((id: string, date: Date, time: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? { ...apt, date, time, status: 'Awaiting Confirmation' as AppointmentDetail['status'] }
          : apt
      )
    );
  }, []);

  // Scroll-to-top
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const isStatusFilteringPast = filters.status === 'Completed' || filters.status === 'Cancelled';

  const upcomingSource = appointments.filter(apt => apt.status !== 'Completed' && apt.status !== 'Cancelled');
  const pastSource = MOCK_PAST_APPOINTMENTS;

  const filteredUpcoming = isStatusFilteringPast ? [] : applyFilters(upcomingSource, filters);
  const filteredPast = applyFilters(pastSource, filters);

  const hasTodayTeleconsult = filteredUpcoming.some(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear();
  });

  const todayTeleconsult = filteredUpcoming.find(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return apt.type === 'Teleconsult' &&
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear();
  });

  const totalFiltered = filteredUpcoming.length + filteredPast.length;
  const filtersActive = filters.status !== 'All' || filters.type !== 'All' ||
    filters.specialty !== 'All' || filters.provider !== 'All' ||
    filters.dateFrom !== '' || filters.dateTo !== '';

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="appointments" />

        <main ref={mainRef} className="flex-1 overflow-y-auto">
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
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>

              {!isStatusFilteringPast && (
                <div className="space-y-4 mb-8">
                  {filteredUpcoming.map(appointment => (
                    <AppointmentCardWithActions key={appointment.id} appointment={appointment} onReschedule={handleReschedule} />
                  ))}

                  {filteredUpcoming.length === 0 && !filtersActive && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
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

              <PastAppointmentsSectionOpen appointments={filteredPast} />

              {isStatusFilteringPast && filteredPast.length === 0 && <EmptyFilterResult />}
            </div>
          </div>
        </main>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

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