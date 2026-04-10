import { useState } from 'react';
import { X, Save, Pill, FlaskConical, Activity } from 'lucide-react';
import { QuickVitals } from '../../types/telemedicine';

interface QuickClinicalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientDob: string;
  chiefComplaint: string;
  onPrescription: () => void;
  onLabOrder: () => void;
}

export default function QuickClinicalPanel({
  isOpen,
  onClose,
  patientName,
  patientDob,
  chiefComplaint,
  onPrescription,
  onLabOrder,
}: QuickClinicalPanelProps) {
  const [quickNotes, setQuickNotes] = useState('');
  const [vitals, setVitals] = useState<Partial<QuickVitals>>({});

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 bottom-18 w-80 bg-teal-900 bg-opacity-95 backdrop-blur-sm border-r border-teal-700 shadow-2xl z-30 overflow-y-auto">
      <div className="sticky top-0 bg-teal-800 px-4 py-3 flex items-center justify-between border-b border-teal-700 z-10">
        <h3 className="text-white font-bold text-sm">Quick Clinical Tools</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-teal-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-teal-800 bg-opacity-60 rounded-lg p-3 border border-teal-700">
          <h4 className="text-xs font-bold text-teal-200 mb-2">Patient Profile</h4>
          <div className="space-y-1">
            <div className="text-white font-semibold text-sm">{patientName}</div>
            <div className="text-teal-300 text-xs">
              {calculateAge(patientDob)}y • DOB: {new Date(patientDob).toLocaleDateString('en-GB')}
            </div>
            <div className="mt-2 pt-2 border-t border-teal-700">
              <div className="text-xs text-teal-200 font-semibold mb-1">Chief Complaint:</div>
              <div className="text-xs text-white">{chiefComplaint}</div>
            </div>
          </div>
        </div>

        <div className="bg-teal-800 bg-opacity-60 rounded-lg p-3 border border-teal-700">
          <label className="block text-xs font-bold text-teal-200 mb-2">
            Quick Notes
            <span className="ml-2 text-teal-400 font-normal">(Auto-saves to SOAP)</span>
          </label>
          <textarea
            value={quickNotes}
            onChange={(e) => setQuickNotes(e.target.value)}
            placeholder="Type clinical notes during consultation..."
            rows={6}
            className="w-full px-3 py-2 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <button className="mt-2 w-full px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-500 transition-colors flex items-center justify-center gap-1.5">
            <Save className="w-3 h-3" />
            Save Notes
          </button>
        </div>

        <div className="bg-teal-800 bg-opacity-60 rounded-lg p-3 border border-teal-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-teal-200 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Vital Signs Entry
            </h4>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-teal-300 mb-1">BP (Systolic)</label>
                <input
                  type="number"
                  placeholder="120"
                  value={vitals.bp?.systolic || ''}
                  onChange={(e) =>
                    setVitals({
                      ...vitals,
                      bp: { ...vitals.bp, systolic: parseInt(e.target.value) || 0, diastolic: vitals.bp?.diastolic || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs text-teal-300 mb-1">BP (Diastolic)</label>
                <input
                  type="number"
                  placeholder="80"
                  value={vitals.bp?.diastolic || ''}
                  onChange={(e) =>
                    setVitals({
                      ...vitals,
                      bp: { ...vitals.bp, systolic: vitals.bp?.systolic || 0, diastolic: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-teal-300 mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                placeholder="72"
                value={vitals.hr || ''}
                onChange={(e) => setVitals({ ...vitals, hr: parseInt(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs text-teal-300 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                placeholder="36.6"
                value={vitals.temp || ''}
                onChange={(e) => setVitals({ ...vitals, temp: parseFloat(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs text-teal-300 mb-1">SpO2 (%)</label>
              <input
                type="number"
                placeholder="98"
                value={vitals.spo2 || ''}
                onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs text-teal-300 mb-1">Blood Glucose (mg/dL)</label>
              <input
                type="number"
                placeholder="95"
                value={vitals.glucose || ''}
                onChange={(e) => setVitals({ ...vitals, glucose: parseInt(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-teal-950 bg-opacity-50 border border-teal-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button className="w-full px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-500 transition-colors flex items-center justify-center gap-1.5">
              <Save className="w-3 h-3" />
              Save Vitals
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onPrescription}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Pill className="w-4 h-4" />
            Write Prescription
          </button>

          <button
            onClick={onLabOrder}
            className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            Order Lab Tests
          </button>
        </div>
      </div>
    </div>
  );
}
