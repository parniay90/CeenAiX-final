import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ImagingStudy, ImagingFinding } from '../../types/patientImaging';

interface MyFindingsTabProps {
  studies: ImagingStudy[];
}

export default function MyFindingsTab({ studies }: MyFindingsTabProps) {
  const allFindings: Array<ImagingFinding & { studyDate: string; studyType: string }> = [];

  studies.forEach(study => {
    study.findings.forEach(finding => {
      allFindings.push({
        ...finding,
        studyDate: study.studyDate,
        studyType: study.studyType
      });
    });
  });

  const normalFindings = allFindings.filter(f => f.severity === 'normal');
  const abnormalFindings = allFindings.filter(f => f.severity !== 'normal');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'normal':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'mild':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">My Imaging Findings Summary</h3>
        <p className="text-sm text-slate-500">Plain-English summary of all findings across your imaging studies</p>
      </div>

      {abnormalFindings.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-amber-900 mb-4">Findings Requiring Attention</h4>

          <div className="space-y-4">
            {abnormalFindings.map((finding, idx) => (
              <div
                key={finding.id}
                style={{ animationDelay: `${idx * 80}ms`, borderLeftColor: finding.color }}
                className="bg-white rounded-xl p-5 shadow-sm border-l-4 animate-slideUp"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: finding.color + '20' }}
                  >
                    {getSeverityIcon(finding.severity)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="text-base font-bold text-slate-900">{finding.category}</h5>
                        <div className="text-sm text-slate-700 mt-1">{finding.finding}</div>
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

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg mb-2">
                      <div className="text-xs font-bold text-blue-900 mb-1">What This Means for You</div>
                      <p className="text-sm text-blue-800">{finding.patientExplanation}</p>
                    </div>

                    {finding.doctorComment && (
                      <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
                        <div className="text-xs font-bold text-emerald-900 mb-1">Your Doctor Says:</div>
                        <p className="text-sm text-emerald-800 italic">"{finding.doctorComment}"</p>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-slate-400">
                      From: {finding.studyType} ({finding.studyDate})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-emerald-900 mb-4">Normal Findings (All Clear)</h4>

        <div className="grid grid-cols-2 gap-4">
          {normalFindings.map((finding, idx) => (
            <div
              key={finding.id}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="bg-white rounded-xl p-4 shadow-sm animate-slideUp"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-900">{finding.category}</h5>
                  <div className="text-xs text-slate-600 mt-1">{finding.finding}</div>
                  <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold mt-2 inline-block">
                    Normal
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {finding.studyType} ({finding.studyDate})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Overall Health Insights from Imaging</h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-emerald-600 font-bold text-sm">Excellent Heart Function</div>
            </div>
            <p className="text-sm text-slate-600">
              Your echocardiogram shows perfect heart function (LVEF 62%) with all valves working normally. No signs of diabetes affecting your heart muscle.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-amber-600 font-bold text-sm">Mild Liver Fat - Improving</div>
            </div>
            <p className="text-sm text-slate-600">
              Grade 1 fatty liver is common with diabetes and reversible with the lifestyle changes you're already doing. Focus on low-carb diet and exercise.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-teal-600 font-bold text-sm">Low Cardiac Risk</div>
            </div>
            <p className="text-sm text-slate-600">
              CAC score of 42 indicates minimal plaque buildup. With Atorvastatin and diabetes control, you're preventing progression. Excellent work.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Tracking Changes Over Time</h4>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900">Coronary Artery Calcification</div>
              <div className="flex items-center gap-2">
                <Minus className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Stable</span>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              First baseline CT scan (Feb 2026) shows CAC score 42. No prior studies for comparison. Will track changes in 3-5 years.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900">Liver Steatosis</div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-600 font-medium">Expected to improve</span>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Grade 1 fatty liver on ultrasound (Dec 2025). Follow-up ultrasound scheduled for June 2026 to assess response to weight loss and diet changes.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900">Kidney Health</div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-600 font-medium">Normal</span>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Both kidneys appear completely normal on ultrasound with no signs of diabetic kidney disease. Excellent news.
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Remember: These are plain-English summaries. Always discuss your imaging findings with your doctor for complete medical interpretation and treatment planning.
        </p>
      </div>
    </div>
  );
}
