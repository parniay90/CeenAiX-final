import { Save, FlaskConical, Pill, UserPlus, FileText, CheckCircle } from 'lucide-react';

interface ActionBarProps {
  onSaveDraft: () => void;
  onOrderLabs: () => void;
  onWritePrescription: () => void;
  onCreateReferral: () => void;
  onGenerateSummary: () => void;
  onCompleteAndSign: () => void;
}

export default function ActionBar({
  onSaveDraft,
  onOrderLabs,
  onWritePrescription,
  onCreateReferral,
  onGenerateSummary,
  onCompleteAndSign,
}: ActionBarProps) {
  return (
    <div className="bg-white border-t border-gray-300 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-300"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          <button
            onClick={onOrderLabs}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            Order Labs
          </button>

          <button
            onClick={onWritePrescription}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Pill className="w-4 h-4" />
            Write Prescription
          </button>

          <button
            onClick={onCreateReferral}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Create Referral
          </button>

          <button
            onClick={onGenerateSummary}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Patient Summary
          </button>
        </div>

        <button
          onClick={onCompleteAndSign}
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-base font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <CheckCircle className="w-5 h-5" />
          Complete & Sign
        </button>
      </div>
    </div>
  );
}
