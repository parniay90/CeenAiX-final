import { FileText, Download, Eye, Share2, Printer } from 'lucide-react';
import type { ImagingStudy } from '../../types/patientImaging';

interface ReportsTabProps {
  studies: ImagingStudy[];
}

export default function ReportsTab({ studies }: ReportsTabProps) {
  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'CT':
        return '#0891b2';
      case 'MRI':
        return '#7c3aed';
      case 'X-Ray':
        return '#64748b';
      case 'Ultrasound':
        return '#0d9488';
      case 'Echo':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Radiology Reports</h3>
        <p className="text-sm text-slate-500">Download official imaging reports and radiologist interpretations</p>
      </div>

      {studies.map((study, idx) => {
        const modalityColor = getModalityColor(study.modality);

        return (
          <div
            key={study.id}
            style={{ animationDelay: `${idx * 80}ms` }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: modalityColor }}
              >
                <FileText className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900">
                  {study.studyType}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <span>Date: {study.studyDate}</span>
                  <span>·</span>
                  <span>{study.facility}</span>
                  <span>·</span>
                  <span>{study.facilityLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Radiologist: {study.radiologist}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>PDF · 3-4 pages · 285 KB</span>
                  <span>·</span>
                  <span>DHA accredited — DICOM compliant</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  Accession: {study.accessionNumber}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
              <div className="text-xs font-bold text-teal-900 mb-1">Report Summary</div>
              <p className="text-sm text-teal-800">{study.impression}</p>
              <div className="text-xs text-teal-600 mt-2">
                — {study.radiologist}, {study.radiologistCredentials}
              </div>
            </div>

            {study.tags && study.tags.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                {study.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          All radiology reports contain sensitive health information. Only share with authorized healthcare providers or when required for medical care.
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-blue-900 mb-1">Report Contents Include:</div>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Clinical indication and reason for study</li>
              <li>• Imaging technique and protocol used</li>
              <li>• Detailed findings by anatomical region</li>
              <li>• Radiologist's impression and conclusions</li>
              <li>• Recommendations for follow-up if needed</li>
              <li>• Comparison with prior studies when available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
