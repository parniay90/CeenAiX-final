import { useState } from 'react';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, MessageCircle, Download, Eye } from 'lucide-react';
import type { ImagingStudy, ImagingFinding } from '../../types/patientImaging';

interface RecentStudiesTabProps {
  studies: ImagingStudy[];
}

export default function RecentStudiesTab({ studies }: RecentStudiesTabProps) {
  const [expandedStudies, setExpandedStudies] = useState<string[]>([]);

  const toggleStudy = (id: string) => {
    setExpandedStudies(prev =>
      prev.includes(id) ? prev.filter(studyId => studyId !== id) : [...prev, id]
    );
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'normal':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'mild':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

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
      {studies.map((study, idx) => {
        const isExpanded = expandedStudies.includes(study.id);
        const normalCount = study.findings.filter(f => f.severity === 'normal').length;
        const abnormalCount = study.findings.filter(f => f.severity !== 'normal').length;
        const modalityColor = getModalityColor(study.modality);

        return (
          <div
            key={study.id}
            style={{ animationDelay: `${idx * 80}ms`, borderLeftColor: modalityColor }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-[5px] animate-slideUp"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleStudy(study.id)}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: modalityColor }}
                  >
                    {study.modality}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{study.studyType}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <span>{study.studyDate}</span>
                        <span>·</span>
                        <span>{study.facility}</span>
                        <span>·</span>
                        <span>{study.facilityLocation}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Reported by {study.radiologist}, {study.radiologistCredentials}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {normalCount > 0 && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                          {normalCount} Normal
                        </span>
                      )}
                      {abnormalCount > 0 && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
                          {abnormalCount} Finding{abnormalCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {study.reviewStatus === 'reviewed' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                          Doctor Reviewed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg mb-3">
                    <div className="text-xs font-bold text-teal-900 mb-1">Patient Summary</div>
                    <p className="text-sm text-teal-800">{study.patientSummary}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">Indication:</span> {study.indication}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Report
                      </button>
                      <button className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Findings</h4>
                    <div className="space-y-3">
                      {study.findings.map((finding) => (
                        <div
                          key={finding.id}
                          className="p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: finding.color + '20' }}
                            >
                              {getSeverityIcon(finding.severity)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-sm font-bold text-slate-900">{finding.category}</div>
                                  <div className="text-sm text-slate-700">{finding.finding}</div>
                                  {finding.location && (
                                    <div className="text-xs text-slate-500 mt-1">Location: {finding.location}</div>
                                  )}
                                  {finding.measurement && (
                                    <div className="text-xs font-mono text-slate-600 mt-1">{finding.measurement}</div>
                                  )}
                                </div>
                                <div
                                  className="px-3 py-1 rounded-full text-xs font-bold"
                                  style={{ backgroundColor: finding.color + '20', color: finding.color }}
                                >
                                  {finding.severityLabel}
                                </div>
                              </div>

                              <div className="p-3 bg-white border border-slate-200 rounded-lg mb-2">
                                <div className="text-xs font-bold text-slate-600 mb-1">What This Means</div>
                                <p className="text-sm text-slate-700">{finding.patientExplanation}</p>
                              </div>

                              {finding.doctorComment && (
                                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                  <div className="text-xs font-bold text-blue-900 mb-1">Doctor's Note</div>
                                  <p className="text-sm text-blue-800">"{finding.doctorComment}"</p>
                                </div>
                              )}

                              <details className="mt-2">
                                <summary className="text-xs text-teal-600 cursor-pointer hover:text-teal-700 font-medium">
                                  Show technical details
                                </summary>
                                <div className="mt-2 p-3 bg-slate-100 rounded text-xs text-slate-600 font-mono">
                                  {finding.technicalDescription}
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-bold text-blue-900 mb-1">Radiologist's Impression</div>
                    <p className="text-sm text-blue-800 italic">"{study.impression}"</p>
                    <div className="text-xs text-blue-600 mt-2">
                      — {study.radiologist}, {study.radiologistCredentials}
                    </div>
                  </div>

                  {study.reviewStatus === 'reviewed' && study.overallComment && (
                    <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                          Doctor Reviewed
                        </span>
                        <span className="text-xs text-slate-500">{study.reviewedBy} — {study.reviewedDate}</span>
                      </div>
                      <p className="text-sm text-emerald-800 italic">"{study.overallComment}"</p>
                      <button className="mt-3 px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message {study.reviewedBy}
                      </button>
                    </div>
                  )}

                  {study.followUpRecommended && study.followUpInstructions && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="text-xs font-bold text-amber-900 mb-1">Follow-Up Recommended</div>
                      <p className="text-sm text-amber-800">{study.followUpInstructions}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Ordered by:</span> {study.orderedBy}, {study.orderedBySpecialty}
                      </div>
                      <div>
                        <span className="font-medium">Accession #:</span> {study.accessionNumber}
                      </div>
                      <div>
                        <span className="font-medium">Study time:</span> {study.studyTime}
                      </div>
                      <div>
                        <span className="font-medium">Reported:</span> {study.reportedTime}
                      </div>
                      <div>
                        <span className="font-medium">Series:</span> {study.seriesCount}
                      </div>
                      <div>
                        <span className="font-medium">Images:</span> {study.imageCount}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <p className="text-sm text-cyan-800">
          All imaging reports are DHA-accredited and stored in the Dubai Nabidh HIE (Health Information Exchange). Your studies are accessible by authorized healthcare providers across the UAE.
        </p>
      </div>
    </div>
  );
}
