import React from 'react';
import { CalendarAppointment, DaySchedule } from '../../types/doctorAppointments';

interface WeekCalendarProps {
  week: DaySchedule[];
  onAppointmentClick: (appointment: CalendarAppointment) => void;
  onSlotClick: (date: string, time: string) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ week, onAppointmentClick, onSlotClick }) => {
  const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

  const getTypeColor = (type: string) => {
    const colors = {
      follow_up: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-400' },
      new_patient: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
      post_procedure: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-400' },
      annual_check: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-400' },
      teleconsultation: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
      walk_in: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-400' },
      emergency: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' }
    };
    return colors[type as keyof typeof colors] || colors.follow_up;
  };

  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const hourIndex = hour - 9;
    const minuteOffset = minute / 60;
    return (hourIndex + minuteOffset) * 60;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
      <div className="flex bg-slate-50 border-b border-slate-200">
        <div className="w-14 flex-shrink-0" />
        {week.map((day) => (
          <div key={day.date} className="flex-1 px-3 py-3 text-center border-r border-slate-100 last:border-r-0">
            <div className="text-[12px] text-slate-400 uppercase font-semibold mb-1">
              {day.dayName.slice(0, 3)}
            </div>
            {day.isToday ? (
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-teal-600 text-white text-[20px] font-bold">
                {day.date.split(' ')[0]}
              </div>
            ) : (
              <div className={`text-[20px] font-bold ${day.isPast ? 'text-slate-400' : 'text-slate-700'}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {day.date.split(' ')[0]}
              </div>
            )}
            {day.stats.total > 0 && (
              <div className="text-[10px] text-slate-400 mt-1">
                {day.stats.total} appts
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="flex">
          <div className="w-14 flex-shrink-0 py-2">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="h-[60px] pr-2 text-right">
                <span className="text-[11px] text-slate-300 font-mono" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {time}
                </span>
              </div>
            ))}
          </div>

          {week.map((day, dayIdx) => (
            <div
              key={day.date}
              className={`flex-1 relative border-r border-slate-100 last:border-r-0 ${
                day.isToday ? 'bg-teal-50/20' : ''
              }`}
            >
              {timeSlots.map((_, slotIdx) => (
                <div
                  key={slotIdx}
                  className="h-[60px] border-b border-slate-100 hover:bg-teal-50 cursor-pointer transition-colors"
                  onClick={() => !day.isPast && onSlotClick(day.date, timeSlots[slotIdx])}
                />
              ))}

              {day.date === '7' && dayIdx === 2 && (
                <div className="absolute left-0 right-0 h-[2px] bg-red-500 z-10" style={{ top: '310px' }}>
                  <div className="absolute left-0 w-1.5 h-1.5 bg-red-500 rounded-full -top-[3px]" />
                  <div className="absolute right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded font-mono -top-2.5">
                    NOW — 2:07 PM
                  </div>
                </div>
              )}

              {day.appointments.map((apt, aptIdx) => {
                const colors = getTypeColor(apt.type);
                const top = getAppointmentPosition(apt.time);
                const height = apt.duration;
                const isCompleted = apt.status === 'completed';
                const isActive = apt.status === 'in_progress';

                return (
                  <div
                    key={aptIdx}
                    onClick={() => onAppointmentClick(apt)}
                    className={`absolute left-[5%] right-[5%] rounded-lg border-l-[3px] p-1.5 cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${
                      isActive ? 'bg-teal-500 border-teal-700 shadow-lg' : `${colors.bg} ${colors.border}`
                    } ${isCompleted ? 'opacity-75' : ''}`}
                    style={{ top: `${top}px`, height: `${height}px`, zIndex: 5 }}
                  >
                    {isCompleted && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px]">
                        ✓
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-white/20 px-1 rounded text-[8px] text-white font-bold">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    <div className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : colors.text}`} style={{ fontFamily: 'DM Mono, monospace' }}>
                      {apt.time}
                    </div>
                    {height >= 25 && (
                      <div className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {apt.patient.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                    )}
                    {height >= 35 && (
                      <div className={`text-[10px] truncate ${isActive ? 'text-white/90' : colors.text}`}>
                        {apt.type.replace(/_/g, ' ')}
                      </div>
                    )}
                    {height >= 45 && apt.fee && (
                      <div className={`text-[9px] truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        {apt.patient.insurance} · AED {apt.fee}
                      </div>
                    )}
                  </div>
                );
              })}

              {day.date === '7' && dayIdx === 2 && (
                <div
                  className="absolute left-[5%] right-[5%] bg-slate-100 border border-slate-200 rounded-lg p-2 text-center"
                  style={{ top: '120px', height: '105px', zIndex: 3 }}
                >
                  <span className="text-[10px] text-slate-400 italic">Lunch</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-mono font-semibold text-emerald-600">
            Week Total: AED 10,400 confirmed + AED 2,300 estimated
          </div>
          <div className="flex gap-2">
            {week.map((day) => {
              const width = (day.stats.revenue / 3000) * 100;
              return (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${Math.min(width, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
