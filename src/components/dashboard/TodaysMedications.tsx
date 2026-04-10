import { useState } from 'react';
import { Check, Flame } from 'lucide-react';
import { Medication } from '../../types/dashboard';

interface TodaysMedicationsProps {
  medications: Medication[];
}

export default function TodaysMedications({ medications }: TodaysMedicationsProps) {
  const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
  const streak = 5;

  const toggleMedication = (id: string) => {
    const newTaken = new Set(takenMeds);
    if (newTaken.has(id)) {
      newTaken.delete(id);
    } else {
      newTaken.add(id);
    }
    setTakenMeds(newTaken);
  };

  const groupedByTime = medications.reduce((acc, med) => {
    if (!acc[med.timeOfDay]) {
      acc[med.timeOfDay] = [];
    }
    acc[med.timeOfDay].push(med);
    return acc;
  }, {} as Record<string, Medication[]>);

  const timeSlots = Object.keys(groupedByTime).sort((a, b) => {
    const timeA = parseInt(a.replace(/[^0-9]/g, ''));
    const timeB = parseInt(b.replace(/[^0-9]/g, ''));
    return timeA - timeB;
  });

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Today's Medications</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-semibold">{streak}-day streak</span>
        </div>
      </div>

      <div className="space-y-6">
        {timeSlots.map((time, idx) => (
          <div key={time} className="relative">
            {idx !== timeSlots.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200"></div>
            )}

            <div className="flex gap-4">
              <div className="relative">
                <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-semibold text-sm z-10 relative">
                  {time.replace('AM', '').replace('PM', '')}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="text-sm font-medium text-gray-500 mb-2">{time}</div>
                {groupedByTime[time].map((med) => {
                  const isTaken = takenMeds.has(med.id);
                  return (
                    <div
                      key={med.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isTaken
                          ? 'border-teal-300 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{med.drugName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{med.dosage}</p>
                          <p className="text-xs text-gray-500 mt-1">{med.frequency}</p>
                        </div>
                        <button
                          onClick={() => toggleMedication(med.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isTaken
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {takenMeds.size} of {medications.length} taken today
          </span>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            View All Medications
          </button>
        </div>
      </div>
    </div>
  );
}
