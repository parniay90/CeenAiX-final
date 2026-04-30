import { useState } from 'react';
import { Download, TrendingUp, Sparkles, X, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { LabResult } from '../../types/healthRecords';

interface LabResultsTabProps {
  labResults: LabResult[];
}

// ── Download Success Modal ────────────────────────────────────────────────────
function DownloadModal({ testName, onClose }: { testName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Download className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Download Report</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Report Downloaded!</h3>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-gray-700">{testName}</span> report has been
            downloaded successfully to your device.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Trend — Coming Soon Modal ────────────────────────────────────────────
function ViewTrendModal({ testName, onClose }: { testName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">View Trend</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">In Progress</h3>
          <p className="text-gray-500 text-sm">
            Trend tracking for <span className="font-semibold text-gray-700">{testName}</span> will
            be available once more results are recorded over time. This feature will show a full
            history chart of your results.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LabResultsTab({ labResults }: LabResultsTabProps) {
  const [selectedTestType, setSelectedTestType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [downloadResult, setDownloadResult] = useState<LabResult | null>(null);
  const [trendResult, setTrendResult] = useState<LabResult | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      Normal: 'bg-green-100 text-green-800 border-green-300',
      Abnormal: 'bg-amber-100 text-amber-800 border-amber-300',
      Critical: 'bg-rose-100 text-rose-800 border-rose-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getValueColor = (status: string) => {
    const colors = {
      Normal: 'text-green-700',
      Abnormal: 'text-amber-700',
      Critical: 'text-rose-700',
    };
    return colors[status as keyof typeof colors] || 'text-gray-700';
  };

  const testTypes = ['all', ...new Set(labResults.map((r) => r.testType))];

  // ── Date range filter logic ──────────────────────────────────────────────
  const getDateRangeStart = (): Date | null => {
    if (dateRange === 'all') return null;
    const now = new Date();
    const days = parseInt(dateRange);
    const start = new Date(now);
    start.setDate(now.getDate() - days);
    return start;
  };

  const filteredResults = labResults.filter((result) => {
    // Filter by test type
    if (selectedTestType !== 'all' && result.testType !== selectedTestType) {
      return false;
    }
    // Filter by date range
    const rangeStart = getDateRangeStart();
    if (rangeStart && new Date(result.collectionDate) < rangeStart) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lab Results</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
            <select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {testTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Test Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-teal-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{result.testName}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span>{format(result.collectionDate, 'MMMM dd, yyyy')}</span>
                  <span className="text-gray-300">•</span>
                  <span>{result.labName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {result.testType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
                <button
                  onClick={() => setDownloadResult(result)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download report"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Result Value</span>
                <p className={`text-2xl font-bold mt-1 ${getValueColor(result.status)}`}>
                  {result.resultValue}{' '}
                  {result.unit && <span className="text-sm">{result.unit}</span>}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Reference Range</span>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {result.referenceRange}
                  {result.unit && <span className="text-sm ml-1">{result.unit}</span>}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => setTrendResult(result)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-colors font-medium"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>View Trend</span>
                </button>
              </div>
            </div>

            {result.aiInterpretation && (
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-violet-900 text-sm mb-1">AI Health Insight</h4>
                    <p className="text-sm text-violet-800">{result.aiInterpretation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredResults.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lab Results Found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      )}

      {/* Download Modal */}
      {downloadResult && (
        <DownloadModal
          testName={downloadResult.testName}
          onClose={() => setDownloadResult(null)}
        />
      )}

      {/* View Trend Modal */}
      {trendResult && (
        <ViewTrendModal
          testName={trendResult.testName}
          onClose={() => setTrendResult(null)}
        />
      )}
    </div>
  );
}