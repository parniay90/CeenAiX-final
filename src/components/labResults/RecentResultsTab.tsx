import { useState } from 'react';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, TrendingDown, TrendingUp, MessageCircle } from 'lucide-react';
import type { LabVisit, LabTest } from '../../types/patientLabResults';

interface RecentResultsTabProps {
  visit: LabVisit;
}

export default function RecentResultsTab({ visit }: RecentResultsTabProps) {
  const [expandedTests, setExpandedTests] = useState<string[]>([]);

  const toggleTest = (id: string) => {
    setExpandedTests(prev =>
      prev.includes(id) ? prev.filter(testId => testId !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'borderline':
      case 'elevated':
      case 'low':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

  const getValuePosition = (value: number, zones?: any[]) => {
    if (!zones) return 50;
    const maxZone = Math.max(...zones.map(z => z.max || 10));
    return Math.min((value / maxZone) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              DML
            </div>
            <div>
              <h3 className="text-xl font-playfair font-bold text-slate-900">{visit.labName}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>📍 {visit.labLocation}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">DHA Accredited ✓</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-mono font-bold text-slate-700">{visit.visitDate}</div>
            <div className="text-sm text-slate-500">Sample: {visit.sampleCollectionTime}</div>
            <div className="text-sm text-slate-500">Released: {visit.resultsReleasedTime}</div>
          </div>
        </div>

        {visit.reviewStatus === 'reviewed' && visit.overallComment && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">✅ Doctor Reviewed</span>
              <span className="text-xs text-slate-500">{visit.reviewedBy} — {visit.reviewedDate}</span>
            </div>
            <p className="text-sm text-blue-800 italic">"{visit.overallComment}"</p>
            <p className="text-xs text-blue-600 mt-1">— {visit.reviewedBy}</p>
            <button className="mt-2 px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message Dr. Fatima
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {visit.tests.map((test, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                test.status === 'normal' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              title={test.name}
            />
          ))}
          <span className="text-xs text-slate-500 ml-2">
            {visit.tests.filter(t => t.status === 'normal').length} normal ·{' '}
            {visit.tests.filter(t => t.status !== 'normal').length} to monitor
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {visit.tests.map((test, idx) => {
          const isExpanded = expandedTests.includes(test.id);

          return (
            <div
              key={test.id}
              style={{ animationDelay: `${idx * 80}ms`, borderLeftColor: test.categoryColor }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-[5px] animate-slideUp cursor-pointer"
              onClick={() => toggleTest(test.id)}
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-64">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center`} style={{ backgroundColor: test.categoryColor + '20' }}>
                        {getStatusIcon(test.status)}
                      </div>
                      <div>
                        <h4 className="text-base font-playfair font-bold text-slate-900">{test.name}</h4>
                        <div className="text-xs text-slate-400">{test.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-300">LOINC: {test.loinc}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    {!test.subTests ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-3">
                          <div className="text-4xl font-mono font-bold" style={{ color: test.categoryColor }}>
                            {test.value}
                          </div>
                          <div className="text-xl font-mono text-slate-400">{test.unit}</div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold`} style={{ backgroundColor: test.categoryColor + '20', color: test.categoryColor }}>
                            {test.statusLabel}
                          </div>
                        </div>

                        {test.referenceRange.zones && (
                          <div className="mb-3">
                            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                              {test.referenceRange.zones.map((zone, zIdx) => (
                                <div
                                  key={zIdx}
                                  className="absolute h-full"
                                  style={{
                                    left: zone.min ? `${(zone.min / (test.referenceRange.zones?.[test.referenceRange.zones.length - 1].max || 10)) * 100}%` : '0%',
                                    width: zone.max && zone.min ? `${((zone.max - zone.min) / (test.referenceRange.zones?.[test.referenceRange.zones.length - 1].max || 10)) * 100}%` : '33%',
                                    backgroundColor: zone.color + '40'
                                  }}
                                />
                              ))}
                              {test.value && (
                                <div
                                  className="absolute top-0 w-0.5 h-full animate-slideInRight"
                                  style={{
                                    left: `${getValuePosition(test.value, test.referenceRange.zones)}%`,
                                    backgroundColor: test.categoryColor
                                  }}
                                >
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg" style={{ color: test.categoryColor }}>
                                    ▼
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between mt-1">
                              {test.referenceRange.zones?.map((zone, zIdx) => (
                                <div key={zIdx} className="text-[10px] font-mono" style={{ color: zone.color }}>
                                  {zone.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-slate-600 italic">{test.patientExplanation}</p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        {test.subTests.map((subTest, subIdx) => (
                          <div key={subIdx} className="flex items-center gap-4 p-2 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-700">{subTest.name}</div>
                            </div>
                            <div className="font-mono text-sm font-bold text-slate-900">{subTest.value} {subTest.unit}</div>
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
                            </div>
                            <div className="text-xs text-emerald-600 font-bold">Normal ✓</div>
                          </div>
                        ))}
                        {test.medication && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                            💊 Your {test.medication} medication is keeping these levels healthy. Great job taking it consistently!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 w-48">
                    {test.trend && test.trend.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-400 uppercase mb-2">Trend</div>
                        <div className="flex items-end gap-1 h-16">
                          {test.trend.map((value, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex-1 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t transition-all duration-800"
                              style={{
                                height: `${(value / Math.max(...test.trend!)) * 100}%`,
                                animationDelay: `${tIdx * 100}ms`
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {test.trendDirection === 'improving' ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs text-emerald-600 font-bold">Improving</span>
                            </>
                          ) : test.trendDirection === 'worsening' ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-red-600" />
                              <span className="text-xs text-red-600 font-bold">Worsening</span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400">Stable</span>
                          )}
                        </div>
                      </div>
                    )}

                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                      {isExpanded ? '▲ Less Details' : '▼ More Details'}
                    </button>
                  </div>
                </div>

                {isExpanded && test.doctorComment && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <div className="text-xs font-bold text-blue-900 mb-1">Doctor's Note</div>
                      <p className="text-sm text-blue-800">"{test.doctorComment}"</p>
                      <p className="text-xs text-blue-600 mt-2">— {visit.orderedBy}, {visit.orderedBySpecialty}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
