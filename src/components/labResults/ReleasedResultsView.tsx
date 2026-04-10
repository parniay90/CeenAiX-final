import { CheckCircle, FileText, Database, Bell, Clock, User } from 'lucide-react';
import { AuditEntry } from '../../types/labResults';
import { format } from 'date-fns';

interface ReleasedResultsViewProps {
  auditTrail: AuditEntry[];
  releasedAt?: Date;
  nabidhSubmittedAt?: Date;
  doctorNotifiedAt?: Date;
  patientNotifiedAt?: Date;
}

export default function ReleasedResultsView({
  auditTrail,
  releasedAt,
  nabidhSubmittedAt,
  doctorNotifiedAt,
  patientNotifiedAt,
}: ReleasedResultsViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-700" />
          <div>
            <h3 className="text-lg font-bold text-green-900">Results Released</h3>
            <p className="text-sm text-green-800">
              All results have been verified and released to the ordering physician
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {releasedAt && (
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-700" />
                <div className="text-xs font-bold text-slate-700 uppercase">Released</div>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {format(releasedAt, 'dd MMM yyyy HH:mm')}
              </div>
            </div>
          )}

          {nabidhSubmittedAt && (
            <div className="bg-white rounded-lg p-3 border border-violet-300">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-violet-700" />
                <div className="text-xs font-bold text-slate-700 uppercase">NABIDH Submitted</div>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {format(nabidhSubmittedAt, 'dd MMM yyyy HH:mm')}
              </div>
              <div className="mt-1 text-xs text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Acknowledged
              </div>
            </div>
          )}

          {doctorNotifiedAt && (
            <div className="bg-white rounded-lg p-3 border border-blue-300">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-blue-700" />
                <div className="text-xs font-bold text-slate-700 uppercase">Doctor Notified</div>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {format(doctorNotifiedAt, 'dd MMM yyyy HH:mm')}
              </div>
              <div className="mt-1 text-xs text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Alert sent to CeenAiX
              </div>
            </div>
          )}

          {patientNotifiedAt && (
            <div className="bg-white rounded-lg p-3 border border-teal-300">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-teal-700" />
                <div className="text-xs font-bold text-slate-700 uppercase">Patient Notified</div>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {format(patientNotifiedAt, 'dd MMM yyyy HH:mm')}
              </div>
              <div className="mt-1 text-xs text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Results available in patient portal
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-slate-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase">Result PDF Preview</h3>
        </div>

        <div className="border-2 border-slate-300 rounded-lg p-8 bg-slate-50 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Laboratory Results Report
            </p>
            <p className="text-xs text-slate-600">PDF preview would appear here</p>
            <button className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700">
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-slate-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase">Audit Trail</h3>
        </div>

        <div className="space-y-3">
          {auditTrail.map((entry, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-3 border-b border-slate-200 last:border-0"
            >
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-teal-600 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{entry.action}</div>
                    {entry.details && (
                      <div className="text-xs text-slate-600 mt-0.5">{entry.details}</div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 text-right">
                    <div>{format(entry.timestamp, 'dd MMM yyyy')}</div>
                    <div className="font-mono">{format(entry.timestamp, 'HH:mm:ss')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <User className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-700 font-semibold">{entry.performedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
