import { useState } from 'react';
import { X, Star, DollarSign, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import { SPECIALTIES, MOCK_DOCTORS, MOCK_TIME_SLOTS, Doctor } from '../../types/appointments';

interface BookAppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentDrawer({ isOpen, onClose }: BookAppointmentDrawerProps) {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTeleconsult, setIsTeleconsult] = useState(false);
  const [inNetworkOnly, setInNetworkOnly] = useState(true);
  const [reasonForVisit, setReasonForVisit] = useState('');

  if (!isOpen) return null;

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    if (selectedSpecialty && doc.specialty !== selectedSpecialty) return false;
    if (inNetworkOnly && !doc.inNetwork) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Specialty</h3>
              <div className="grid grid-cols-2 gap-3">
                {SPECIALTIES.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => {
                      setSelectedSpecialty(specialty.name);
                      setStep(2);
                    }}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
                  >
                    <div className="text-4xl mb-2">{specialty.icon}</div>
                    <div className="font-semibold text-gray-900">{specialty.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Back to Specialties
              </button>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Provider</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inNetworkOnly}
                    onChange={(e) => setInNetworkOnly(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">In-Network Only</span>
                </label>
              </div>

              <div className="space-y-3">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setStep(3);
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
                  >
                    <div className="flex gap-4">
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">{doctor.hospital}</p>
                          </div>
                          {doctor.inNetwork && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              In-Network
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>Languages: {doctor.languages.join(', ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-teal-600">
                            <Clock className="w-4 h-4" />
                            <span>Next: {format(doctor.nextAvailable, 'MMM dd, h:mm a')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>AED {doctor.consultationFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedDoctor && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Back to Providers
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date & Time</h3>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTeleconsult}
                    onChange={(e) => setIsTeleconsult(e.target.checked)}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Schedule as Teleconsult (Video Call)
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedTime(slot.time);
                        setStep(4);
                      }}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        slot.available
                          ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <button
                onClick={() => setStep(3)}
                className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Back to Date & Time
              </button>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Reason for Visit</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms or reason for visit
                </label>
                <textarea
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  rows={4}
                  placeholder="Please describe what you'd like to discuss with the doctor..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Fever', 'Cough', 'Headache', 'Fatigue', 'Pain', 'Other'].map((symptom) => (
                    <button
                      key={symptom}
                      className="px-3 py-1 bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-700 rounded-full text-sm font-medium transition-colors"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Insurance pre-authorization may be required for this visit. We'll check your coverage and notify you if additional approval is needed.
                </p>
              </div>

              <button
                onClick={() => setStep(5)}
                className="mt-4 w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {step === 5 && selectedDoctor && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Appointment</h3>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex gap-4 mb-4">
                  <img
                    src={selectedDoctor.photo}
                    alt={selectedDoctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedDoctor.name}</h4>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedDoctor.hospital}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-900">
                      {format(selectedDate, 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900">
                      {isTeleconsult ? 'Teleconsult' : 'In-Person'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-semibold text-gray-900">AED {selectedDoctor.consultationFee}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
