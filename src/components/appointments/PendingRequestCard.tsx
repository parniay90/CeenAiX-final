import React from 'react';
import { AppointmentRequest } from '../../types/doctorAppointments';
import { Clock, AlertCircle, User } from 'lucide-react';

interface PendingRequestCardProps {
  request: AppointmentRequest;
  onApprove: (requestId: string, slot: { date: string; time: string }) => void;
  onDecline: (requestId: string) => void;
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({ request, onApprove, onDecline }) => {
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

  const getBadgeColor = () => {
    if (request.type === 'new_patient') return 'bg-blue-50 text-blue-700';
    if (request.type === 'referral') return 'bg-purple-50 text-purple-700';
    return 'bg-slate-100 text-slate-600';
  };

  const getUrgencyColor = () => {
    if (request.urgency === 'urgent' || request.urgency === 'high') return 'text-red-600';
    if (request.urgency === 'moderate') return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <div className="bg-white rounded-xl border-l-4 border-amber-400 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {request.type === 'new_patient' && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">
              🆕 New Patient Request
            </span>
          )}
          {request.type === 'referral' && (
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full">
              👨‍⚕️ Doctor Referral
            </span>
          )}
          {request.type === 'reschedule' && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
              🔄 Reschedule Request
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-[11px] text-slate-400 font-mono" style={{ fontFamily: 'DM Mono, monospace' }}>
            {request.requestedDate}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-amber-600 mt-1">
            <Clock className="w-3 h-3" />
            Waiting
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
          {request.patient.initials}
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-bold text-slate-900 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {request.patient.name}
          </h3>
          <p className="text-[12px] text-slate-500">
            {request.type === 'new_patient' ? 'New patient — no CeenAiX record' : `${request.patient.totalVisits || 0} previous visits`}
          </p>
          <div className="inline-block px-2 py-0.5 bg-slate-50 rounded text-[11px] text-slate-600 mt-1">
            {request.patient.insurance}
          </div>
        </div>
      </div>

      {request.referringDoctor && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
          <p className="text-[12px] font-bold text-purple-700 mb-1">
            Referred by Dr. {request.referringDoctor.name}
          </p>
          {request.referringDoctor.clinicalNotes && (
            <p className="text-[12px] text-purple-600 italic">
              "{request.referringDoctor.clinicalNotes}"
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-600">Reason:</span>
          <span className={`text-[10px] font-bold ${getUrgencyColor()}`}>
            {request.urgency.toUpperCase()}
          </span>
        </div>
        <p className="text-[13px] text-slate-600 italic leading-relaxed">
          "{request.reason}"
        </p>
      </div>

      {request.aiTriage && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0">
              AI
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-indigo-900 mb-1">Clinical Reminder</p>
              <p className="text-[12px] text-indigo-700 leading-relaxed">
                {request.aiTriage.reasoning}
              </p>
              {request.aiTriage.suggestedPreOrders && request.aiTriage.suggestedPreOrders.length > 0 && (
                <div className="mt-2 space-y-1">
                  {request.aiTriage.suggestedPreOrders.map((order, idx) => (
                    <div key={idx} className="text-[11px] text-indigo-600">
                      • {order}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {request.preferredDate && (
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-600 mb-2">Available slots on {request.preferredDate}:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSlot('10:30 AM')}
              className={`px-3 py-2 rounded-lg text-[12px] font-bold transition-colors ${
                selectedSlot === '10:30 AM'
                  ? 'bg-teal-500 text-white'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              10:30 AM ●
            </button>
            <button
              onClick={() => setSelectedSlot('3:30 PM')}
              className={`px-3 py-2 rounded-lg text-[12px] font-bold transition-colors ${
                selectedSlot === '3:30 PM'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              3:30 PM ○
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => selectedSlot && onApprove(request.id, { date: request.preferredDate || '', time: selectedSlot })}
          disabled={!selectedSlot}
          className={`flex-1 rounded-lg px-4 py-3 text-[13px] font-bold transition-colors ${
            selectedSlot
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          ✅ Approve & Book — {request.preferredDate}, {selectedSlot || 'Select time'}
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-colors">
          🔄 Suggest Different Time
        </button>
        <button
          onClick={() => onDecline(request.id)}
          className="flex-1 bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-colors"
        >
          ❌ Decline
        </button>
      </div>
    </div>
  );
};

export default PendingRequestCard;
