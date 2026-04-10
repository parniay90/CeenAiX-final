import { PreferredLanguage, CommunicationMethod, HealthGoal } from '../../types/patient';
import { MessageSquare, Mail, Smartphone, Bell } from 'lucide-react';

interface Step4Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LANGUAGES: { value: PreferredLanguage; label: string; flag: string }[] = [
  { value: 'Arabic', label: 'Arabic', flag: '🇦🇪' },
  { value: 'English', label: 'English', flag: '🇬🇧' },
  { value: 'Urdu', label: 'Urdu', flag: '🇵🇰' },
  { value: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'Tagalog', label: 'Tagalog', flag: '🇵🇭' },
  { value: 'Other', label: 'Other', flag: '🌐' },
];

const COMMUNICATION_OPTIONS: { value: CommunicationMethod; icon: any }[] = [
  { value: 'SMS', icon: MessageSquare },
  { value: 'WhatsApp', icon: MessageSquare },
  { value: 'Email', icon: Mail },
  { value: 'App notification', icon: Bell },
];

const HEALTH_GOALS: HealthGoal[] = [
  'Preventive Care',
  'Chronic Disease Management',
  'Weight Management',
  'Mental Wellness',
  'Family Health',
];

export default function Step4Preferences({ data, updateData, onNext, onBack }: Step4Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleCommunication = (method: CommunicationMethod) => {
    const current = data.preferredCommunication || [];
    if (current.includes(method)) {
      updateData({ preferredCommunication: current.filter((m: string) => m !== method) });
    } else {
      updateData({ preferredCommunication: [...current, method] });
    }
  };

  const toggleHealthGoal = (goal: HealthGoal) => {
    const current = data.healthGoals || [];
    if (current.includes(goal)) {
      updateData({ healthGoals: current.filter((g: string) => g !== goal) });
    } else {
      updateData({ healthGoals: [...current, goal] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Preferred Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => updateData({ preferredLanguage: lang.value })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  data.preferredLanguage === lang.value
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className={`font-medium ${
                  data.preferredLanguage === lang.value ? 'text-teal-600' : 'text-gray-700'
                }`}>
                  {lang.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Preferred Communication Methods
            <span className="text-gray-500 text-xs ml-2">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {COMMUNICATION_OPTIONS.map(({ value, icon: Icon }) => {
              const isSelected = (data.preferredCommunication || []).includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleCommunication(value)}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-teal-600' : 'text-gray-700'}`}>
                    {value}
                  </span>
                  {isSelected && (
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Health Goals
            <span className="text-gray-500 text-xs ml-2">(Select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {HEALTH_GOALS.map((goal) => {
              const isSelected = (data.healthGoals || []).includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleHealthGoal(goal)}
                  className={`px-5 py-3 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred GP / Family Doctor
            <span className="text-gray-500 text-xs ml-2">(Optional)</span>
          </label>
          <input
            type="text"
            value={data.preferredGp}
            onChange={(e) => updateData({ preferredGp: e.target.value })}
            placeholder="Search by doctor name or clinic"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            We'll notify this doctor when you register with CeenAiX
          </p>
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
