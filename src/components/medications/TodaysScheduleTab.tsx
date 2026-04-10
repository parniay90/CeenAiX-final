import { Pill } from 'lucide-react';
import type { Medication } from '../../types/medications';

interface TodaysScheduleTabProps {
  medications: Medication[];
}

export default function TodaysScheduleTab({ medications }: TodaysScheduleTabProps) {
  const takenCount = medications.reduce((count, med) => {
    return count + med.schedule.filter(d => d.status === 'taken').length;
  }, 0);

  const totalCount = medications.reduce((count, med) => {
    return count + med.schedule.length;
  }, 0);

  const scheduleBlocks = [
    {
      time: '8:00 AM',
      label: 'Morning Cluster',
      status: 'taken',
      medications: [
        { ...medications[0], dose: medications[0].schedule[0] },
        { ...medications[2], dose: medications[2].schedule[0] },
        { ...medications[3], dose: medications[3].schedule[0] }
      ]
    },
    {
      time: '8:00 PM',
      label: 'Evening Cluster',
      status: 'pending',
      medications: [
        { ...medications[0], dose: medications[0].schedule[1] }
      ],
      countdown: 'In 4 hours 12 minutes',
      note: 'Take with your evening meal 🍽️'
    },
    {
      time: '10:00 PM',
      label: 'Bedtime',
      status: 'scheduled',
      medications: [
        { ...medications[1], dose: medications[1].schedule[0] }
      ],
      note: 'Best taken at bedtime — more effective at night 🌙'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tuesday, 7 April 2026</h3>
            <p className="text-sm text-slate-600 mt-1">{takenCount} of {totalCount} doses taken today — {Math.round((takenCount / totalCount) * 100)}% complete</p>
          </div>
          <div className="text-sm text-amber-600 font-medium">{totalCount - takenCount} remaining today</div>
        </div>

        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-800 ease-out"
            style={{ width: `${(takenCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {scheduleBlocks.map((block, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border-2 transition-all duration-300 ${
              block.status === 'taken' ? 'bg-emerald-50 border-emerald-300' :
              block.status === 'pending' ? 'bg-amber-50 border-amber-300 animate-glow' :
              'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                  block.status === 'taken' ? 'bg-emerald-500 text-white' :
                  block.status === 'pending' ? 'bg-amber-500 text-white' :
                  'bg-slate-300 text-slate-700'
                }`}>
                  {block.time}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{block.label}</div>
                  {block.countdown && (
                    <div className="text-xs text-amber-600 font-medium">{block.countdown}</div>
                  )}
                </div>
              </div>

              {block.status === 'taken' && (
                <div className="text-sm text-emerald-600 font-bold">All taken ✓</div>
              )}
            </div>

            <div className="space-y-3">
              {block.medications.map((med, medIdx) => (
                <div key={medIdx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: med.categoryColor + '20' }}>
                      <Pill className="w-5 h-5" style={{ color: med.categoryColor }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{med.brandName} {med.strength}</div>
                      <div className={`text-xs font-medium ${
                        block.status === 'taken' ? 'text-emerald-600' :
                        block.status === 'pending' ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        {block.status === 'taken' && med.dose?.takenAt ? `✅ Taken ${med.dose.takenAt}` :
                         block.status === 'pending' ? `⏰ ${block.label} dose — ${block.time}` :
                         `⏰ Scheduled for ${block.time}`}
                      </div>
                    </div>
                  </div>

                  {block.status === 'pending' && (
                    <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300">
                      Mark Taken ✓
                    </button>
                  )}

                  {block.status === 'scheduled' && (
                    <button className="px-4 py-2 border-2 border-slate-300 text-slate-400 rounded-full text-xs font-bold cursor-not-allowed">
                      Mark Taken ✓
                    </button>
                  )}
                </div>
              ))}
            </div>

            {block.note && (
              <div className="mt-3 text-xs text-slate-600 font-medium">{block.note}</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-2">Morning 8AM</div>
          <div className="text-lg font-bold text-emerald-600">✅ 3/3 Complete</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-2">Evening 8PM</div>
          <div className="text-lg font-bold text-amber-600">⏰ 0/1 Pending</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-2">Bedtime 10PM</div>
          <div className="text-lg font-bold text-slate-400">⏰ 0/1 Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-2">Overall</div>
          <div className="text-lg font-bold text-teal-600">{takenCount}/{totalCount} doses ({Math.round((takenCount / totalCount) * 100)}%)</div>
        </div>
      </div>
    </div>
  );
}
