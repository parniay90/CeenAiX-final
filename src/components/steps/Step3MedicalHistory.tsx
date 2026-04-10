import { useState } from 'react';
import { Camera, X, Sparkles } from 'lucide-react';
import { INSURANCE_PROVIDERS, PreExistingCondition } from '../../types/patient';

interface Step3Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONDITIONS: PreExistingCondition[] = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Cancer History', 'None'];

export default function Step3MedicalHistory({ data, updateData, onNext, onBack }: Step3Props) {
  const [allergyInput, setAllergyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleCondition = (condition: PreExistingCondition) => {
    const current = data.preExistingConditions || [];
    if (condition === 'None') {
      updateData({ preExistingConditions: ['None'] });
    } else {
      const filtered = current.filter((c: string) => c !== 'None');
      if (filtered.includes(condition)) {
        updateData({ preExistingConditions: filtered.filter((c: string) => c !== condition) });
      } else {
        updateData({ preExistingConditions: [...filtered, condition] });
      }
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      const current = data.allergies || [];
      updateData({ allergies: [...current, allergyInput.trim()] });
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => {
    const current = data.allergies || [];
    updateData({ allergies: current.filter((_: string, i: number) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Provider
          </label>
          <select
            value={data.insuranceProvider}
            onChange={(e) => updateData({ insuranceProvider: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select insurance provider</option>
            {INSURANCE_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Card Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.insuranceCardNumber}
              onChange={(e) => updateData({ insuranceCardNumber: e.target.value })}
              placeholder="Enter policy number"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Scan
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pre-existing Conditions
          </label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((condition) => {
              const isSelected = (data.preExistingConditions || []).includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </label>
          <textarea
            value={data.currentMedications}
            onChange={(e) => updateData({ currentMedications: e.target.value })}
            placeholder="List your current medications (e.g., Metformin 500mg, Aspirin 81mg)"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="mt-2 flex items-center gap-2 text-sm text-teal-600">
            <Sparkles className="w-4 h-4" />
            <span>CeenAiX AI will check interactions automatically</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAllergy();
                }
              }}
              placeholder="Add allergy (e.g., Penicillin, Peanuts)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.allergies || []).map((allergy: string, index: number) => (
              <div
                key={index}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-full flex items-center gap-2 font-medium"
              >
                <span>{allergy}</span>
                <button
                  type="button"
                  onClick={() => removeAllergy(index)}
                  className="hover:bg-red-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Type
          </label>
          <div className="grid grid-cols-4 md:grid-cols-9 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateData({ bloodType: type })}
                className={`py-3 rounded-lg font-bold transition-all ${
                  data.bloodType === type
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
