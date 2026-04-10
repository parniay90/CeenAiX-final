import { useState } from 'react';
import { AlertTriangle, Phone, X, User, Heart, AlertCircle } from 'lucide-react';
import { MOCK_MEDICAL_ID } from '../../types/aiChat';

export default function EmergencyButton() {
  const [showMedicalID, setShowMedicalID] = useState(false);

  const handleEmergencyCall = () => {
    window.location.href = 'tel:998';
  };

  return (
    <>
      <button
        onClick={() => setShowMedicalID(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all hover:scale-105 animate-pulse-red"
      >
        <AlertTriangle className="w-6 h-6" />
        <span className="font-bold text-lg">Emergency</span>
      </button>

      {showMedicalID && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-7 h-7 text-red-600" />
                Medical ID
              </h2>
              <button
                onClick={() => setShowMedicalID(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900">Blood Type</h3>
                </div>
                <p className="text-3xl font-bold text-red-700">{MOCK_MEDICAL_ID.bloodType}</p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <h3 className="font-bold text-amber-900 mb-2">Allergies</h3>
                {MOCK_MEDICAL_ID.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {MOCK_MEDICAL_ID.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-700">No known allergies</p>
                )}
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Medical Conditions</h3>
                {MOCK_MEDICAL_ID.conditions.length > 0 ? (
                  <ul className="space-y-1">
                    {MOCK_MEDICAL_ID.conditions.map((condition, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">No medical conditions</p>
                )}
              </div>

              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-teal-900">Emergency Contact</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold text-teal-900">Name:</span>{' '}
                    <span className="text-teal-800">{MOCK_MEDICAL_ID.emergencyContact.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-teal-900">Relationship:</span>{' '}
                    <span className="text-teal-800">{MOCK_MEDICAL_ID.emergencyContact.relationship}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-teal-900">Phone:</span>{' '}
                    <a
                      href={`tel:${MOCK_MEDICAL_ID.emergencyContact.phone}`}
                      className="text-teal-600 underline font-semibold"
                    >
                      {MOCK_MEDICAL_ID.emergencyContact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleEmergencyCall}
              className="w-full py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              Call 998 Emergency Services
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              This information is accessible without login in emergency situations
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-red {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(220, 38, 38, 0);
          }
        }
        .animate-pulse-red {
          animation: pulse-red 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
