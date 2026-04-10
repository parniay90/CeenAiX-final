import { useState } from 'react';
import { NATIONALITIES } from '../../types/patient';
import { Search } from 'lucide-react';

interface Step2Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PersonalInfo({ data, updateData, onNext, onBack }: Step2Props) {
  const [searchNationality, setSearchNationality] = useState('');
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  const filteredNationalities = NATIONALITIES.filter((n) =>
    n.name.toLowerCase().includes(searchNationality.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const selectedNationality = NATIONALITIES.find(n => n.name === data.nationality);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name (English)
          </label>
          <input
            type="text"
            value={data.fullNameEnglish}
            onChange={(e) => updateData({ fullNameEnglish: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name (Arabic)
          </label>
          <input
            type="text"
            value={data.fullNameArabic}
            onChange={(e) => updateData({ fullNameArabic: e.target.value })}
            dir="rtl"
            placeholder="الاسم الكامل"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateData({ gender: 'Male' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                data.gender === 'Male'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => updateData({ gender: 'Female' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                data.gender === 'Female'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div className="relative md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <div className="relative">
            <div
              onClick={() => setShowNationalityDropdown(!showNationalityDropdown)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer bg-white flex items-center justify-between"
            >
              <span className={selectedNationality ? 'text-gray-900' : 'text-gray-400'}>
                {selectedNationality ? `${selectedNationality.flag} ${selectedNationality.name}` : 'Select nationality'}
              </span>
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            {showNationalityDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-white p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search nationality..."
                    value={searchNationality}
                    onChange={(e) => setSearchNationality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {filteredNationalities.map((nation) => (
                  <div
                    key={nation.code}
                    onClick={() => {
                      updateData({ nationality: nation.name });
                      setShowNationalityDropdown(false);
                      setSearchNationality('');
                    }}
                    className="px-4 py-3 hover:bg-teal-50 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-xl">{nation.flag}</span>
                    <span>{nation.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-medium">
              +971
            </div>
            <input
              type="tel"
              value={data.phone.replace('+971', '')}
              onChange={(e) => updateData({ phone: '+971' + e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="50 123 4567"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={data.emergencyContactName}
            onChange={(e) => updateData({ emergencyContactName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            value={data.emergencyContactPhone}
            onChange={(e) => updateData({ emergencyContactPhone: e.target.value })}
            placeholder="+971 50 123 4567"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Residency Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['UAE National', 'UAE Resident', 'Medical Tourist'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateData({ residencyStatus: status })}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  data.residencyStatus === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
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
