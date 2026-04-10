import React from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, FileText, MessageCircle } from 'lucide-react';
import { CalendarAppointment } from '../../types/doctorAppointments';

interface AppointmentDetailPanelProps {
  appointment: CalendarAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}

const AppointmentDetailPanel: React.FC<AppointmentDetailPanelProps> = ({
  appointment,
  isOpen,
  onClose,
  onReschedule,
  onCancel
}) => {
  if (!isOpen || !appointment) return null;

  const getStatusBadge = () => {
    const badges = {
      completed: { text: '✅ Completed', bg: 'bg-emerald-100', textColor: 'text-emerald-700' },
      in_progress: { text: '🔵 In Progress', bg: 'bg-teal-100', textColor: 'text-teal-700' },
      confirmed: { text: '✅ Confirmed', bg: 'bg-blue-100', textColor: 'text-blue-700' },
      pending: { text: '⏰ Pending', bg: 'bg-amber-100', textColor: 'text-amber-700' },
      cancelled: { text: '❌ Cancelled', bg: 'bg-red-100', textColor: 'text-red-700' },
      no_show: { text: '⚠️ No-Show', bg: 'bg-red-100', textColor: 'text-red-700' },
      checked_in: { text: '🔵 Checked In', bg: 'bg-blue-100', textColor: 'text-blue-700' },
      rescheduled: { text: '🔄 Rescheduled', bg: 'bg-slate-100', textColor: 'text-slate-600' }
    };
    return badges[appointment.status] || badges.confirmed;
  };

  const status = getStatusBadge();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 w-[380px] bg-white shadow-2xl z-50 overflow-y-auto"
        style={{ animation: 'slideInRight 300ms ease-out' }}
      >
        <div className="bg-[#0A1628] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="text-white/60 text-[10px] font-bold uppercase mb-1">
              {appointment.type.replace(/_/g, ' ')}
            </div>
            <h2 className="text-white text-[16px] font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {appointment.patient.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${status.bg} ${status.textColor}`}>
              {status.text}
            </span>
            <div className="text-right">
              <div className="text-[14px] font-mono font-bold text-emerald-600">
                AED {appointment.fee}
              </div>
              {appointment.insuranceCoverage && (
                <div className="text-[10px] text-slate-400">
                  {appointment.patient.insurance} covers {appointment.insuranceCoverage}%
                </div>
              )}
            </div>
          </div>

          <div className="bg-teal-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
                {appointment.patient.initials}
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {appointment.patient.name}
                </h3>
                <p className="text-[12px] text-slate-600 mb-2">
                  {appointment.patient.id} · {appointment.patient.age}{appointment.patient.gender} · {appointment.patient.insurance}
                </p>
                {appointment.patient.allergies && appointment.patient.allergies.length > 0 && (
                  <div className="space-y-1">
                    {appointment.patient.allergies.map((allergy, idx) => (
                      <div key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded">
                        ⚠️ {allergy}
                      </div>
                    ))}
                  </div>
                )}
                <button className="text-[12px] text-teal-600 hover:text-teal-700 font-bold mt-2">
                  📋 Open Full Record →
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Appointment Details
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400">Date</div>
                  <div className="text-[13px] text-slate-900 font-semibold">
                    {appointment.date}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400">Time</div>
                  <div className="text-[13px] text-slate-900 font-semibold font-mono">
                    {appointment.time} {appointment.endTime && `– ${appointment.endTime}`} ({appointment.duration} min)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400">Location</div>
                  <div className="text-[13px] text-slate-900 font-semibold">
                    Al Noor Medical Center
                  </div>
                  <div className="text-[12px] text-slate-500">
                    {appointment.room || 'Room assignment pending'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400">Type</div>
                  <div className="text-[13px] text-slate-900 font-semibold">
                    {appointment.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — {appointment.visitReason || 'Cardiology'}
                  </div>
                </div>
              </div>

              {appointment.chiefComplaint && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-[11px] font-bold text-blue-900 mb-1">Chief Complaint</div>
                  <p className="text-[12px] text-blue-700 italic">
                    "{appointment.chiefComplaint}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {appointment.bookedBy && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Booking Information
              </h4>
              <div className="text-[12px] text-slate-600">
                Booked by: <span className="font-semibold">{appointment.bookedBy}</span>
                {appointment.bookedDate && ` — ${appointment.bookedDate}`}
              </div>
              {appointment.referredBy && (
                <div className="text-[12px] text-slate-600 mt-1">
                  Referred by: <span className="font-semibold text-purple-600">{appointment.referredBy}</span>
                </div>
              )}
            </div>
          )}

          {appointment.status === 'completed' && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">
                Visit Summary
              </h4>
              <div className="space-y-2">
                <button className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors text-left">
                  📋 View Full SOAP Notes →
                </button>
                <div className="flex gap-2">
                  <div className="flex-1 bg-emerald-50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-emerald-600 font-bold">Prescriptions</div>
                    <div className="text-[13px] text-emerald-900 font-bold">✅ 2 sent</div>
                  </div>
                  <div className="flex-1 bg-indigo-50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-indigo-600 font-bold">Labs</div>
                    <div className="text-[13px] text-indigo-900 font-bold">✅ Ordered</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
            <div className="space-y-2 pt-2">
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-3 text-[13px] font-bold transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Edit Appointment
              </button>
              <button
                onClick={onReschedule}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors flex items-center justify-center gap-2"
              >
                🔄 Reschedule
              </button>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message Patient
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors"
              >
                ❌ Cancel Appointment
              </button>
            </div>
          )}

          {appointment.status === 'completed' && (
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors">
              📋 View Summary
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default AppointmentDetailPanel;
