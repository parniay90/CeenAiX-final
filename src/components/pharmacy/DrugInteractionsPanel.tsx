import { AlertCircle, Phone, File as FileEdit } from 'lucide-react';
import { DrugInteraction } from '../../types/pharmacy';
import { formatDistanceToNow } from 'date-fns';

interface DrugInteractionsPanelProps {
  interactions: DrugInteraction[];
  onContactDoctor: (interactionId: string) => void;
  onOverride: (interactionId: string) => void;
}

export default function DrugInteractionsPanel({
  interactions,
  onContactDoctor,
  onOverride,
}: DrugInteractionsPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-700" />
          <h3 className="text-sm font-bold text-slate-900">Interactions Flagged Today</h3>
        </div>
        <span className="text-xs text-slate-600">{interactions.length} alerts</span>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {interactions.map((interaction) => (
          <div
            key={interaction.id}
            className={`p-4 rounded-lg border-2 ${
              interaction.severity === 'contraindicated'
                ? 'bg-rose-50 border-rose-300'
                : interaction.severity === 'major'
                ? 'bg-orange-50 border-orange-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {interaction.patientName}
                </h4>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span>{interaction.drugA}</span>
                  <span className="text-slate-500">↔</span>
                  <span>{interaction.drugB}</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  interaction.severity === 'contraindicated'
                    ? 'bg-rose-600 text-white'
                    : interaction.severity === 'major'
                    ? 'bg-orange-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {interaction.severity.toUpperCase()}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                {interaction.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 mb-3 pb-3 border-b border-slate-200">
              <div>
                <span className="font-semibold">Type:</span>{' '}
                <span className="capitalize">{interaction.interactionType}</span>
              </div>
              <div>
                <span className="font-semibold">Doctor:</span> {interaction.prescribingDoctor}
              </div>
              <div className="text-slate-500">
                {formatDistanceToNow(interaction.flaggedAt, { addSuffix: true })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onContactDoctor(interaction.id)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3 h-3" />
                Contact Doctor
              </button>
              <button
                onClick={() => onOverride(interaction.id)}
                className="flex-1 px-3 py-2 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileEdit className="w-3 h-3" />
                Override & Document
              </button>
            </div>
          </div>
        ))}

        {interactions.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No drug interactions flagged today</p>
          </div>
        )}
      </div>
    </div>
  );
}
