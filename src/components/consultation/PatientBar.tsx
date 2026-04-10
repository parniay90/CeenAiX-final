import { useEffect, useState } from 'react';
import { AlertTriangle, FileText, Printer, X } from 'lucide-react';
import { PatientConsultation } from '../../types/consultation';

interface PatientBarProps {
  patient: PatientConsultation;
  onEndConsultation: () => void;
}

export default function PatientBar({ patient, onEndConsultation }: PatientBarProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  return (
    <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <img
          src={patient.patientPhoto}
          alt={patient.patientName}
          className="w-12 h-12 rounded-full object-cover border-2 border-teal-600"
        />

        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{patient.patientName}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>{calculateAge(patient.dob)}y</span>
              <span>•</span>
              <span>DOB: {new Date(patient.dob).toLocaleDateString('en-GB')}</span>
              <span>•</span>
              <span>Emirates ID: {patient.emiratesId}</span>
              <span>•</span>
              <span className="font-mono font-semibold">{patient.mrn}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-300">
              {patient.bloodType}
            </span>

            {patient.allergyCount > 0 && (
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded border-2 border-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {patient.allergyCount} Allergies
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-amber-50 border-2 border-amber-400 rounded-lg">
          <div className="text-xs text-amber-600 font-semibold mb-0.5">Consultation Time</div>
          <div className="text-lg font-mono font-bold text-amber-700">{formatTime(elapsedTime)}</div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            NABIDH Records
          </button>

          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Summary
          </button>

          <button
            onClick={onEndConsultation}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            End Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
