import { AlertTriangle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PatientAllergy } from '../../types/healthRecords';

interface AllergiesTabProps {
  allergies: PatientAllergy[];
}

export default function AllergiesTab({ allergies }: AllergiesTabProps) {
  const getSeverityColor = (severity: string) => {
    const colors = {
      Mild: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Moderate: 'bg-orange-100 text-orange-800 border-orange-300',
      Severe: 'bg-rose-100 text-rose-800 border-rose-300',
      Anaphylaxis: 'bg-red-600 text-white border-red-700',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getCategoryIcon = (category: string) => {
    return category;
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="transform -rotate-45 text-rose-600 text-9xl font-bold whitespace-nowrap">
          ALLERGIES
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Allergies</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Allergy</span>
          </button>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-rose-900">Emergency Information</h3>
            <p className="text-sm text-rose-700 mt-1">
              These allergies appear on your Emergency ID card and are visible to first responders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allergies.map((allergy) => (
            <div
              key={allergy.id}
              className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6 hover:shadow-lg transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -mr-16 -mt-16 opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-rose-900">{allergy.allergenName}</h3>
                    <p className="text-sm text-rose-700 mt-1 flex items-center gap-2">
                      <span className="px-2 py-1 bg-rose-200 rounded text-xs font-semibold">
                        {getCategoryIcon(allergy.category)}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(
                      allergy.severity
                    )}`}
                  >
                    {allergy.severity}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                      Reaction
                    </span>
                    <p className="text-sm text-rose-900 mt-1">{allergy.reactionDescription}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-rose-200">
                    <span className="text-rose-700">Discovered:</span>
                    <span className="font-semibold text-rose-900">
                      {format(allergy.discoveryDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {allergy.onEmergencyCard && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ON EMERGENCY CARD</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {allergies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Allergies Recorded</h3>
            <p className="text-gray-600 mb-4">
              Add your allergies to ensure safe medical care.
            </p>
            <button className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium">
              Add Your First Allergy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
