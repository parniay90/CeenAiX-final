import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CreditCard as Edit, Pause, Trash2, TrendingUp, X, CheckCircle2, Play } from 'lucide-react';
import type { Reminder, Medication } from '../../types/medications';

interface RemindersTabProps {
  reminders: Reminder[];
  medications: Medication[];
}

// ── Set / Edit Reminder Modal ─────────────────────────────────────────────────
function SetReminderModal({
  medications,
  existing,
  onClose,
}: {
  medications: Medication[];
  existing?: Reminder;
  onClose: () => void;
}) {
  const [selectedMed, setSelectedMed] = useState(existing?.medicationId || medications[0]?.id || '');
  const [time, setTime] = useState(existing ? existing.time.split(' ')[0] : '08:00');
  const [frequency, setFrequency] = useState(existing?.frequency || 'Daily');
  const [channels, setChannels] = useState(
    existing?.channels || { app: true, sms: false, whatsapp: false }
  );
  const [saved, setSaved] = useState(false);

  const toggleChannel = (ch: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const isEdit = !!existing;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={saved ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">
              {isEdit ? 'Edit Reminder' : 'Set New Reminder'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-5">
          {saved ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {isEdit ? 'Reminder Updated!' : 'Reminder Set!'}
              </h3>
              <p className="text-gray-500 text-sm">
                Your reminder has been {isEdit ? 'updated' : 'saved'} successfully.
              </p>
              <p className="text-teal-600 font-bold text-lg mt-2">{time}</p>
              <p className="text-gray-400 text-xs mt-1">
                Via: {[channels.app && 'App', channels.sms && 'SMS', channels.whatsapp && 'WhatsApp'].filter(Boolean).join(', ') || 'No channel selected'}
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Medication selector — only for new reminder */}
              {!isEdit && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medication</label>
                  <div className="grid grid-cols-2 gap-2">
                    {medications.map(med => (
                      <button
                        key={med.id}
                        onClick={() => setSelectedMed(med.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                          selectedMed === med.id
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: med.categoryColor }}
                        />
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${selectedMed === med.id ? 'text-teal-700' : 'text-gray-800'}`}>
                            {med.brandName}
                          </p>
                          <p className="text-xs text-gray-400">{med.strength}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Time — styled input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full appearance-none px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-xl text-lg font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Daily', 'Weekdays', 'Custom'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`py-2 rounded-xl text-xs font-medium border-2 capitalize transition-all ${
                        frequency === f
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:border-teal-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Channels</label>
                <div className="space-y-2">
                  {[
                    { key: 'app', label: '📱 App Notification' },
                    { key: 'sms', label: '💬 SMS' },
                    { key: 'whatsapp', label: '🟢 WhatsApp' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleChannel(key as keyof typeof channels)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                        channels[key as keyof typeof channels]
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm text-gray-700">{label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        channels[key as keyof typeof channels]
                          ? 'border-teal-600 bg-teal-600'
                          : 'border-gray-300'
                      }`}>
                        {channels[key as keyof typeof channels] && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSaved(true)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  {isEdit ? 'Save Changes' : 'Save Reminder'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  reminder,
  onConfirm,
  onClose,
}: {
  reminder: Reminder;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Delete Reminder</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 mb-2">Are you sure you want to delete this reminder?</p>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-5">
            <p className="font-semibold text-gray-900 text-sm">{reminder.medicationName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{reminder.dose} — {reminder.time}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RemindersTab({ reminders: initialReminders, medications }: RemindersTabProps) {
  const [reminders, setReminders] = useState(initialReminders);
  const [pausedIds, setPausedIds] = useState<string[]>([]);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [deleteReminder, setDeleteReminder] = useState<Reminder | null>(null);

  const adherenceData = [
    { day: 'Mon', taken: 4, total: 4 },
    { day: 'Tue', taken: 4, total: 4 },
    { day: 'Wed', taken: 4, total: 4 },
    { day: 'Thu', taken: 3, total: 4 },
    { day: 'Fri', taken: 4, total: 4 },
    { day: 'Sat', taken: 3, total: 4 },
    { day: 'Sun', taken: 4, total: 4 },
  ];

  const togglePause = (id: string) => {
    setPausedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setDeleteReminder(null);
  };

  return (
    <div className="space-y-6">

      {/* Adherence Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-bold mb-2">91% adherence this month</div>
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
          <div className="h-full bg-white transition-all duration-300" style={{ width: '91%' }} />
        </div>

        <div className="flex items-end justify-between gap-2">
          {adherenceData.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-12 rounded-lg transition-all duration-300 ${
                  day.taken === day.total ? 'bg-white' :
                  day.taken > 0 ? 'bg-amber-400' :
                  'bg-red-400'
                }`}
                style={{ height: `${Math.max((day.taken / day.total) * 80, 12)}px` }}
              />
              <div className="text-xs text-teal-100">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Reminders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Active Reminders</h3>
          <button
            onClick={() => setShowNewReminder(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            + Set New Reminder
          </button>
        </div>

        <div className="space-y-4">
          {reminders.map((reminder) => {
            const isPaused = pausedIds.includes(reminder.id);
            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-xl p-5 border-l-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                  isPaused ? 'border-amber-400 opacity-75' : 'border-teal-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPaused ? 'bg-amber-100' : 'bg-teal-100'
                    }`}>
                      <Bell className={`w-5 h-5 ${isPaused ? 'text-amber-600' : 'text-teal-600'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {reminder.medicationName} — {reminder.dose}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">⏰ {reminder.time}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isPaused
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {isPaused ? 'Paused 🟡' : 'Active 🟢'}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {reminder.channels.sms && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>💬</span> SMS ✓
                    </div>
                  )}
                  {reminder.channels.app && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>📱</span> App ✓
                    </div>
                  )}
                  {reminder.channels.whatsapp ? (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>💚</span> WhatsApp ✓
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>💚</span> WhatsApp ✗
                    </div>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="text-xs text-gray-600 italic">{reminder.messagePreview}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditReminder(reminder)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-xs font-medium"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => togglePause(reminder.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                      isPaused
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    {isPaused
                      ? <><Play className="w-3.5 h-3.5" /> Resume</>
                      : <><Pause className="w-3.5 h-3.5" /> Pause</>
                    }
                  </button>
                  <button
                    onClick={() => setDeleteReminder(reminder)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}

          {reminders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active reminders</p>
              <p className="text-gray-400 text-sm mt-1">Click "Set New Reminder" to add one</p>
            </div>
          )}
        </div>
      </div>

      {/* Missed Doses Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Missed Doses Analysis — Last 30 Days
          </div>
          <div className="text-gray-400">▼</div>
        </button>
      </div>

      {/* Modals */}
      {showNewReminder && (
        <SetReminderModal
          medications={medications}
          onClose={() => setShowNewReminder(false)}
        />
      )}
      {editReminder && (
        <SetReminderModal
          medications={medications}
          existing={editReminder}
          onClose={() => setEditReminder(null)}
        />
      )}
      {deleteReminder && (
        <DeleteModal
          reminder={deleteReminder}
          onConfirm={() => handleDelete(deleteReminder.id)}
          onClose={() => setDeleteReminder(null)}
        />
      )}
    </div>
  );
}