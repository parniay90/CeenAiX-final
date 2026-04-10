import { FileText, Download, Eye, Share2 } from 'lucide-react';
import type { LabVisit } from '../../types/patientLabResults';

interface AllReportsTabProps {
  visits: LabVisit[];
}

export default function AllReportsTab({ visits }: AllReportsTabProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Lab Reports 📋</h3>
        <p className="text-sm text-slate-500">Download official lab reports as PDF</p>
      </div>

      {visits.map((visit, idx) => (
        <div
          key={visit.id}
          style={{ animationDelay: `${idx * 80}ms` }}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>

            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">
                Full Lab Report — {visit.labName}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <span>Date: {visit.visitDate}</span>
                <span>·</span>
                <span>{visit.tests.length} tests</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Ordered by: {visit.orderedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>PDF · 2 pages · 142 KB</span>
                <span>·</span>
                <span>DHA stamp: Nabidh HIE registered — FHIR R4</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 mt-1">
                Ref: {visit.nabidh}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          ⚠️ Lab reports contain sensitive health data. Only share with authorized healthcare providers.
        </p>
      </div>
    </div>
  );
}
