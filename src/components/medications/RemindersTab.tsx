import { Bell, CreditCard as Edit, Pause, Trash2, TrendingUp } from 'lucide-react';
import type { Reminder, Medication } from '../../types/medications';

interface RemindersTabProps {
  reminders: Reminder[];
  medications: Medication[];
}

export default function RemindersTab({ reminders }: RemindersTabProps) {
  const adherenceData = [
    { day: 'Mon', taken: 4, total: 4 },
    { day: 'Tue', taken: 4, total: 4 },
    { day: 'Wed', taken: 4, total: 4 },
    { day: 'Thu', taken: 3, total: 4 },
    { day: 'Fri', taken: 4, total: 4 },
    { day: 'Sat', taken: 3, total: 4 },
    { day: 'Sun', taken: 4, total: 4 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-playfair font-bold mb-2">91% adherence this month</div>
            <div className="text-teal-100 flex items-center gap-2">
              <span className="text-2xl">🔥</span> Keep it up!
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-teal-100 mb-1">54/60 doses taken · 6 missed</div>
            <div className="text-sm text-teal-100">90 days streak</div>
          </div>
        </div>

        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-white transition-all duration-800 ease-out"
            style={{ width: '91%' }}
          />
        </div>

        <div className="flex items-end justify-between gap-2">
          {adherenceData.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 rounded-lg transition-all duration-800 ${
                    day.taken === day.total ? 'bg-white' :
                    day.taken > 0 ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}
                  style={{
                    height: `${Math.max((day.taken / day.total) * 80, 12)}px`,
                    animationDelay: `${idx * 100}ms`
                  }}
                />
              </div>
              <div className="text-xs text-teal-100">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Active Reminders</h3>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
            + Set New Reminder
          </button>
        </div>

        <div className="space-y-4">
          {reminders.map((reminder, idx) => (
            <div
              key={reminder.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="bg-white rounded-xl p-5 border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{reminder.medicationName} — {reminder.dose}</h4>
                    <div className="text-sm text-slate-600 mt-1">⏰ {reminder.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                  Active 🟢
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {reminder.channels.sms && (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span>💬</span> SMS ✓
                  </div>
                )}
                {reminder.channels.app && (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span>📱</span> App ✓
                  </div>
                )}
                {reminder.channels.whatsapp ? (
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span>💚</span> WhatsApp ✓
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>💚</span> WhatsApp ✗
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg mb-3">
                <div className="text-xs text-slate-600 italic">{reminder.messagePreview}</div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-xs font-medium">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all text-xs font-medium">
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-medium">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Missed Doses Analysis — Last 30 Days
          </div>
          <div className="text-slate-400">▼</div>
        </button>
      </div>
    </div>
  );
}
