import { useState } from 'react';
import { AlertTriangle, Plus, X, Clock, Pill, Apple, Wind, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { PatientAllergy } from '../../types/healthRecords';

interface AllergiesTabProps {
  allergies: PatientAllergy[];
}

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  All: { label: 'All', icon: <Layers className="w-4 h-4" /> },
  Drug: { label: 'Drug', icon: <Pill className="w-4 h-4" /> },
  Food: { label: 'Food', icon: <Apple className="w-4 h-4" /> },
  Environmental: { label: 'Environmental', icon: <Wind className="w-4 h-4" /> },
  Latex: { label: 'Latex', icon: <Layers className="w-4 h-4" /> },
};

// ── Add Allergy — Coming Soon Modal ──────────────────────────────────────────
function AddAllergyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Add Allergy</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">In Progress</h3>
          <p className="text-gray-500 text-sm">
            Adding allergies is managed by your doctor. This feature will allow your care team to update your allergy list after clinical verification. Coming soon.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Severity color helper ─────────────────────────────────────────────────────
const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    Mild: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Moderate: 'bg-orange-100 text-orange-800 border-orange-300',
    Severe: 'bg-rose-100 text-rose-800 border-rose-300',
    Anaphylaxis: 'bg-red-600 text-white border-red-700',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllergiesTab({ allergies }: AllergiesTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Count per category
  const categoryCounts = allergies.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  // Filtered list
  const filtered = activeCategory === 'All'
    ? allergies
    : allergies.filter(a => a.category === activeCategory);

  return (
    <div className="space-y-6 relative">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="transform -rotate-45 text-rose-600 text-9xl font-bold whitespace-nowrap">
          ALLERGIES
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Allergies</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Allergy</span>
          </button>
        </div>

        {/* Emergency banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-rose-900">Emergency Information</h3>
            <p className="text-sm text-rose-700 mt-1">
              These allergies appear on your Emergency ID card and are visible to first responders.
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const count = key === 'All' ? allergies.length : (categoryCounts[key] || 0);
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                {cfg.icon}
                {cfg.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Allergy cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((allergy) => (
              <div
                key={allergy.id}
                className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6 hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -mr-16 -mt-16 opacity-50" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-rose-900">{allergy.allergenName}</h3>
                      <p className="text-sm text-rose-700 mt-1">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-rose-200 rounded text-xs font-semibold">
                          {CATEGORY_CONFIG[allergy.category as keyof typeof CATEGORY_CONFIG]?.icon}
                          {allergy.category}
                        </span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(allergy.severity)}`}>
                      {allergy.severity}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Reaction</span>
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
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeCategory === 'All' ? '' : activeCategory} Allergies Recorded
            </h3>
            <p className="text-gray-600">
              {activeCategory === 'All'
                ? 'Add your allergies to ensure safe medical care.'
                : `No ${activeCategory.toLowerCase()} allergies found.`}
            </p>
          </div>
        )}
      </div>

      {/* Add Allergy Modal */}
      {showAddModal && (
        <AddAllergyModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}