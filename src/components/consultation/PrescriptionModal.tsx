import { useState } from 'react';
import { X, Search, AlertTriangle, CheckCircle, Languages, Shield } from 'lucide-react';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: any) => void;
}

export default function PrescriptionModal({ isOpen, onClose, onSave }: PrescriptionModalProps) {
  const [drugSearch, setDrugSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');
  const [form, setForm] = useState('');
  const [strength, setStrength] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [instructionsArabic, setInstructionsArabic] = useState('');
  const [quantity, setQuantity] = useState('');
  const [refills, setRefills] = useState('0');
  const [interactionStatus, setInteractionStatus] = useState<'safe' | 'monitor' | 'contraindicated'>('safe');
  const [showArabic, setShowArabic] = useState(false);

  const drugResults = [
    { name: 'Lisinopril', form: 'Tablet', strengths: ['5mg', '10mg', '20mg', '40mg'] },
    { name: 'Losartan', form: 'Tablet', strengths: ['25mg', '50mg', '100mg'] },
    { name: 'Valsartan', form: 'Tablet', strengths: ['40mg', '80mg', '160mg', '320mg'] },
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 12 hours',
    'Every 8 hours',
    'Every 6 hours',
    'As needed',
    'At bedtime',
  ];

  const handleDrugSelect = (drug: any) => {
    setSelectedDrug(drug.name);
    setForm(drug.form);
    setDrugSearch('');
  };

  const handleSave = () => {
    const prescription = {
      drug: selectedDrug,
      form,
      strength,
      dose,
      frequency,
      duration,
      instructions,
      instructionsArabic,
      quantity: parseInt(quantity),
      refills: parseInt(refills),
      interactionStatus,
    };
    onSave(prescription);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Write Prescription</h2>
              <p className="text-sm text-purple-200">DHA e-Prescription Compliant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Drug (DHA Formulary)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={selectedDrug || drugSearch}
                  onChange={(e) => {
                    setDrugSearch(e.target.value);
                    setSelectedDrug('');
                  }}
                  placeholder="Search drug name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {drugSearch && !selectedDrug && (
                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {drugResults.map((drug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDrugSelect(drug)}
                      className="w-full px-4 py-2 hover:bg-purple-50 text-left border-b border-gray-200 last:border-0"
                    >
                      <div className="font-semibold text-gray-900">{drug.name}</div>
                      <div className="text-sm text-gray-600">
                        {drug.form} - {drug.strengths.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDrug && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Form</label>
                    <input
                      type="text"
                      value={form}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Strength
                    </label>
                    <select
                      value={strength}
                      onChange={(e) => setStrength(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select strength</option>
                      <option value="5mg">5mg</option>
                      <option value="10mg">10mg</option>
                      <option value="20mg">20mg</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dose</label>
                    <input
                      type="text"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder="e.g., 1 tablet"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select frequency</option>
                      {frequencies.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 30 days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Refills</label>
                  <select
                    value={refills}
                    onChange={(e) => setRefills(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'refill' : 'refills'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Instructions
                    </label>
                    <button
                      onClick={() => setShowArabic(!showArabic)}
                      className="flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-semibold hover:bg-teal-200"
                    >
                      <Languages className="w-3 h-3" />
                      {showArabic ? 'English' : 'عربي'}
                    </button>
                  </div>
                  {!showArabic ? (
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Take with food. Avoid grapefruit juice."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  ) : (
                    <textarea
                      value={instructionsArabic}
                      onChange={(e) => setInstructionsArabic(e.target.value)}
                      placeholder="تناول مع الطعام"
                      rows={3}
                      dir="rtl"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg border-2 ${
                    interactionStatus === 'safe'
                      ? 'bg-green-50 border-green-300'
                      : interactionStatus === 'monitor'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {interactionStatus === 'safe' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          interactionStatus === 'monitor' ? 'text-amber-600' : 'text-rose-600'
                        }`}
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">
                        Drug Interaction Check
                      </h4>
                      <p className="text-sm text-gray-700">
                        {interactionStatus === 'safe'
                          ? 'No interactions detected with current medications.'
                          : interactionStatus === 'monitor'
                          ? 'Monitor patient for potential interaction with Atorvastatin. Consider dose adjustment.'
                          : 'Contraindicated with current medications. Do not prescribe.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">
                      DHA e-Prescription Compliance
                    </h4>
                    <p className="text-xs text-blue-800">
                      This prescription meets DHA e-prescription requirements and will be
                      electronically transmitted to the pharmacy.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Send to:</label>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Patient's Preferred Pharmacy</option>
              <option>Search Specific Pharmacy</option>
              <option>Print Prescription</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedDrug || !strength || !dose || !frequency}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
