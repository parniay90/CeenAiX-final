import { useState } from 'react';
import { Pill } from 'lucide-react';
import { MedicationItem } from '../../types/dispensing';
import MedicationItemCard from './MedicationItemCard';

interface MedicationsPanelProps {
  medications: MedicationItem[];
  onUpdateMedication: (id: string, updates: Partial<MedicationItem>) => void;
  onRequestPreAuth: (id: string) => void;
  counselingNotes: string;
  onCounselingNotesChange: (notes: string) => void;
}

export default function MedicationsPanel({
  medications,
  onUpdateMedication,
  onRequestPreAuth,
  counselingNotes,
  onCounselingNotesChange,
}: MedicationsPanelProps) {
  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-6 h-6 text-teal-700" />
          <h2 className="text-xl font-bold text-slate-900">Prescription Items</h2>
          <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-bold">
            {medications.length} item{medications.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {medications.map((medication) => (
            <MedicationItemCard
              key={medication.id}
              medication={medication}
              onUpdate={onUpdateMedication}
              onRequestPreAuth={onRequestPreAuth}
            />
          ))}
        </div>

        <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">
            Pharmacist Counseling Notes
          </h3>
          <textarea
            value={counselingNotes}
            onChange={(e) => onCounselingNotesChange(e.target.value)}
            placeholder="Enter counseling notes for the patient. Auto-suggestions will appear based on drug class..."
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() =>
                onCounselingNotesChange(
                  counselingNotes +
                    '\n• Take medications with food to reduce stomach upset.'
                )
              }
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
            >
              + Take with food
            </button>
            <button
              onClick={() =>
                onCounselingNotesChange(
                  counselingNotes + '\n• Complete the full course even if feeling better.'
                )
              }
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
            >
              + Complete course
            </button>
            <button
              onClick={() =>
                onCounselingNotesChange(
                  counselingNotes + '\n• Store in a cool, dry place away from direct sunlight.'
                )
              }
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
            >
              + Storage instructions
            </button>
            <button
              onClick={() =>
                onCounselingNotesChange(
                  counselingNotes + '\n• Monitor blood sugar levels regularly.'
                )
              }
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
            >
              + Monitor blood sugar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
