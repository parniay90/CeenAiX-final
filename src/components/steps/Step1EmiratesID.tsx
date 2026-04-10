import { useState } from 'react';
import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react';

interface Step1Props {
  data: {
    emiratesId: string;
    fullNameEnglish: string;
    dateOfBirth: string;
    gender: string;
  };
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
}

export default function Step1EmiratesID({ data, updateData, onNext }: Step1Props) {
  const [emiratesId, setEmiratesId] = useState(data.emiratesId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState('');

  const formatEmiratesId = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const parts = [];

    if (cleaned.length > 0) parts.push(cleaned.substring(0, 3));
    if (cleaned.length > 3) parts.push(cleaned.substring(3, 7));
    if (cleaned.length > 7) parts.push(cleaned.substring(7, 14));
    if (cleaned.length > 14) parts.push(cleaned.substring(14, 15));

    return parts.join('-');
  };

  const handleEmiratesIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEmiratesId(e.target.value);
    setEmiratesId(formatted);
    setError('');
  };

  const validateEmiratesId = (id: string) => {
    const cleaned = id.replace(/[^0-9]/g, '');
    return cleaned.length === 15;
  };

  const handleVerifyWithUAEPass = async () => {
    if (!validateEmiratesId(emiratesId)) {
      setError('Please enter a valid 15-digit Emirates ID');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      const mockData = {
        emiratesId: emiratesId,
        fullNameEnglish: 'Ahmed Mohammed Al Hashimi',
        dateOfBirth: '1985-03-15',
        gender: 'Male',
      };

      updateData(mockData);
      setIsVerified(true);
      setIsVerifying(false);

      setTimeout(() => {
        onNext();
      }, 1500);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (!validateEmiratesId(emiratesId)) {
      setError('Please enter a valid 15-digit Emirates ID');
      return;
    }

    updateData({ emiratesId });
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-12 text-center">
        <div className="relative inline-block mb-8">
          <div className={`w-64 h-40 border-2 border-teal-600 rounded-lg flex items-center justify-center ${isVerified ? 'bg-teal-50' : 'bg-white'}`}>
            <CreditCard className="w-24 h-24 text-teal-600" strokeWidth={1.5} />
            {isVerified && (
              <div className="absolute inset-0 flex items-center justify-center bg-teal-600 bg-opacity-90 rounded-lg animate-pulse">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            )}
            {isVerifying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-teal-600 opacity-10 rounded-lg animate-pulse"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600 animate-scan"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emirates ID Number
          </label>
          <input
            type="text"
            value={emiratesId}
            onChange={handleEmiratesIdChange}
            placeholder="784-1985-1234567-8"
            maxLength={18}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              error ? 'border-red-300' : isVerified ? 'border-green-500' : 'border-gray-300'
            }`}
            disabled={isVerifying || isVerified}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">Format: XXX-XXXX-XXXXXXX-X</p>
        </div>

        {isVerified && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Emirates ID Verified Successfully</span>
            </div>
            <p className="mt-2 text-sm text-green-700">Your information has been retrieved from UAE PASS</p>
          </div>
        )}

        {!showManual && !isVerified && (
          <button
            onClick={handleVerifyWithUAEPass}
            disabled={isVerifying || !emiratesId}
            className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying with UAE PASS...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-.94-7-5.07-7-9V8.3l7-3.11 7 3.11V11c0 3.93-3.14 8.06-7 9z"/>
                </svg>
                Verify with UAE PASS
              </>
            )}
          </button>
        )}

        {!showManual && !isVerified && (
          <div className="text-center">
            <button
              onClick={() => setShowManual(true)}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              Or enter manually
            </button>
          </div>
        )}

        {showManual && !isVerified && (
          <button
            onClick={handleManualEntry}
            disabled={!emiratesId}
            className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(160px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
