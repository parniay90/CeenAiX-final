import { User, FileText, TestTube, Calendar, Clock, Shield, Building, AlertCircle } from 'lucide-react';
import { PatientInfo, SampleInfo, OrderedTest, PreviousResult } from '../../types/labResults';
import { format } from 'date-fns';

interface OrderDetailsPanelProps {
  patient: PatientInfo;
  sample: SampleInfo;
  orderedTests: OrderedTest[];
  clinicalNotes?: string;
  previousResults: PreviousResult[];
}

export default function OrderDetailsPanel({
  patient,
  sample,
  orderedTests,
  clinicalNotes,
  previousResults,
}: OrderDetailsPanelProps) {
  const getPriorityBadge = (priority: 'stat' | 'urgent' | 'routine') => {
    switch (priority) {
      case 'stat':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'urgent':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'routine':
        return 'bg-teal-100 text-teal-900 border-teal-300';
    }
  };

  const getFlagStyle = (flag: string) => {
    switch (flag) {
      case 'critical':
        return 'text-rose-700 font-bold';
      case 'abnormal':
        return 'text-amber-700 font-bold';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 border-r border-slate-300">
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-4 py-4 border-b border-teal-800">
        <h2 className="text-lg font-bold text-white">Order Details</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Patient Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-slate-600">Name</div>
              <div className="font-bold text-slate-900">{patient.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-600">Emirates ID</div>
                <div className="font-mono text-xs font-semibold text-slate-900">
                  {patient.emiratesId}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Gender</div>
                <div className="font-semibold text-slate-900 capitalize">{patient.gender}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-600">Date of Birth</div>
                <div className="font-semibold text-slate-900">
                  {format(patient.dateOfBirth, 'dd MMM yyyy')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Age</div>
                <div className="font-semibold text-slate-900">{patient.age} years</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Referring Doctor</div>
              <div className="font-semibold text-slate-900">{patient.referringDoctor}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Clinic</div>
              <div className="font-semibold text-slate-900">{patient.clinic}</div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <div className="text-xs text-slate-600">Insurance</div>
              </div>
              <div className="font-semibold text-slate-900">{patient.insurance}</div>
              {patient.insuranceNumber && (
                <div className="font-mono text-xs text-slate-600">{patient.insuranceNumber}</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TestTube className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Sample Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-slate-600">Sample ID</div>
              <div className="font-mono font-bold text-slate-900">{sample.sampleId}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Sample Type</div>
              <div className="font-semibold text-slate-900">{sample.sampleType}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Collection Time
                </div>
                <div className="font-semibold text-slate-900">
                  {format(sample.collectionTime, 'dd MMM HH:mm')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Accessioned
                </div>
                <div className="font-semibold text-slate-900">
                  {format(sample.accessioningTime, 'HH:mm')}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Assigned Technician</div>
              <div className="font-semibold text-slate-900">{sample.assignedTech}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Priority</div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getPriorityBadge(
                  sample.priority
                )}`}
              >
                {sample.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Tests Ordered</h3>
          </div>
          <div className="space-y-2">
            {orderedTests.map((test, idx) => (
              <div
                key={test.id}
                className="border border-slate-200 rounded p-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                      <span className="text-xs font-mono font-bold text-teal-700">
                        {test.cptCode}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{test.testName}</div>
                    <div className="text-xs text-slate-600">{test.category}</div>
                  </div>
                  {test.completed && (
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {clinicalNotes && (
          <div className="bg-amber-50 rounded-lg border-2 border-amber-300 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-900 uppercase">Clinical Notes</h3>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{clinicalNotes}</p>
          </div>
        )}

        {previousResults.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase">Previous Results</h3>
              <span className="text-xs text-slate-500">(from NABIDH)</span>
            </div>
            <div className="space-y-2">
              {previousResults.map((result, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded p-2 bg-slate-50"
                >
                  <div className="text-xs text-slate-600 mb-1">{result.testName}</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-bold ${getFlagStyle(result.flag)}`}>
                        {result.value} {result.unit}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(result.date, 'dd MMM yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
