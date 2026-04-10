import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { LabVisit } from '../../types/patientLabResults';

interface AllHistoryTabProps {
  visits: LabVisit[];
}

export default function AllHistoryTab({ visits }: AllHistoryTabProps) {
  const [expandedVisits, setExpandedVisits] = useState<string[]>([]);

  const toggleVisit = (id: string) => {
    setExpandedVisits(prev =>
      prev.includes(id) ? prev.filter(visitId => visitId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">All Lab History 🗂️</h3>
          <p className="text-sm text-slate-500">Complete record of all laboratory visits</p>
        </div>

        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>All Tests</option>
            <option>Abnormal Only</option>
            <option>Normal Only</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {visits.map((visit, idx) => {
        const isExpanded = expandedVisits.includes(visit.id);
        const normalCount = visit.tests.filter(t => t.status === 'normal').length;
        const abnormalCount = visit.tests.filter(t => t.status !== 'normal').length;

        return (
          <div
            key={visit.id}
            style={{ animationDelay: `${idx * 80}ms` }}
            className="bg-white rounded-xl border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp"
          >
            <div
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => toggleVisit(visit.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                  {visit.labName.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{visit.labName}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{visit.visitDate}</span>
                    <span>·</span>
                    <span>{visit.tests.length} tests</span>
                    <span>·</span>
                    <span>Ordered by {visit.orderedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {normalCount > 0 && (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">
                      {normalCount} Normal ✅
                    </span>
                  )}
                  {abnormalCount > 0 && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold">
                      {abnormalCount} To Monitor ⚠️
                    </span>
                  )}
                </div>

                {visit.reviewStatus === 'reviewed' && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                    ✅ Reviewed
                  </span>
                )}

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="px-5 pb-5 space-y-2 border-t border-slate-100 pt-4">
                {visit.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold`} style={{ backgroundColor: test.categoryColor + '20', color: test.categoryColor }}>
                        {test.value || '—'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{test.name}</div>
                        <div className="text-xs text-slate-500">{test.fullName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {test.value && (
                          <div className="font-mono text-sm font-bold text-slate-900">
                            {test.value} {test.unit}
                          </div>
                        )}
                        <div className="text-xs text-slate-500">{test.referenceRange.text}</div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-bold`} style={{ backgroundColor: test.categoryColor + '20', color: test.categoryColor }}>
                        {test.statusLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
