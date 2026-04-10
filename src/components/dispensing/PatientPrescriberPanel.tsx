import { User, Phone, CreditCard, AlertTriangle, Stethoscope, CheckCircle, Building2 } from 'lucide-react';
import { PatientInfo, PrescriberInfo } from '../../types/dispensing';
import { format } from 'date-fns';

interface PatientPrescriberPanelProps {
  patient: PatientInfo;
  prescriber: PrescriberInfo;
  nabidheConnected: boolean;
}

export default function PatientPrescriberPanel({
  patient,
  prescriber,
  nabidheConnected,
}: PatientPrescriberPanelProps) {
  return (
    <div className="h-full bg-slate-50 border-r border-slate-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Patient Information</h3>
          </div>

          <div className="flex items-start gap-4 mb-4">
            {patient.photoUrl ? (
              <img
                src={patient.photoUrl}
                alt={patient.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
                <User className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900 mb-1">{patient.name}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-mono font-semibold">{patient.emiratesId}</span>
                </div>
                <div className="text-slate-600">
                  DOB: {format(patient.dateOfBirth, 'dd MMM yyyy')}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-slate-700 font-semibold">{patient.insuranceCard}</div>
                <div className="text-slate-500 text-xs">{patient.insuranceNetwork}</div>
              </div>
            </div>
          </div>

          {patient.allergies.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
                <h4 className="text-sm font-bold text-rose-900 uppercase">Allergies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-rose-100 text-rose-900 rounded-full text-sm font-bold"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Prescriber Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="text-base font-bold text-slate-900">{prescriber.name}</div>
              <div className="text-slate-600">{prescriber.specialty}</div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">DHA License:</span>
                <span className="font-mono font-semibold text-slate-900">{prescriber.dhaLicense}</span>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-slate-900 font-semibold">{prescriber.clinic}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{prescriber.contactNumber}</span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-600">Prescribed:</span>
                <div className="text-slate-900 font-semibold">
                  {format(prescriber.prescribeDate, 'dd MMM yyyy, h:mm a')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  nabidheConnected ? 'bg-green-500' : 'bg-slate-400'
                }`}
              />
              <span className="text-sm font-semibold text-slate-900">NABIDH Connection</span>
            </div>
            {nabidheConnected && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                <CheckCircle className="w-3 h-3" />
                Connected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {nabidheConnected
              ? 'Prescription received via NABIDH Health Information Exchange'
              : 'Manually entered prescription'}
          </p>
        </div>
      </div>
    </div>
  );
}
