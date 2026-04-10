import { useState } from 'react';
import { Download, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExportReportModalProps {
  onClose: () => void;
}

export default function ExportReportModal({ onClose }: ExportReportModalProps) {
  const [reportType, setReportType] = useState<'monthly' | 'full' | 'insurance' | 'tax' | 'custom'>('monthly');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [language, setLanguage] = useState<'english' | 'arabic'>('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const [includeSections, setIncludeSections] = useState({
    summary: true,
    consultationBreakdown: true,
    insuranceClaims: true,
    transactions: true,
    payouts: true,
    patientNames: false,
    platformFees: false
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleDownload = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Report Ready! ✅
          </h3>
          <div className="text-sm text-slate-600 mb-1">Ahmed_AlRashidi_Earnings_Apr2026.pdf</div>
          <div className="text-xs text-slate-500 mb-6">File size: 245 KB</div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Now
            </button>
            <button className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
              📧 Send to Email
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Download className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Generating Your Report...
          </h3>
          <div className="text-sm text-slate-600 mb-6">
            Generating your [April 2026] earnings report...
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-teal-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-xs text-slate-500">{progress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Download className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Export Earnings Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Report Type
            </label>
            <div className="space-y-2">
              {[
                { id: 'monthly', label: 'Monthly Summary', desc: 'One-page PDF overview' },
                { id: 'full', label: 'Full Transaction Log', desc: 'Detailed CSV/Excel' },
                { id: 'insurance', label: 'Insurance Claims Report', desc: 'Claims only, for insurer follow-up' },
                { id: 'tax', label: 'Tax Summary', desc: 'UAE VAT — 5% on consultation fees' },
                { id: 'custom', label: 'Custom Date Range', desc: 'Choose specific dates' }
              ].map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    reportType === type.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={reportType === type.id}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                    <div className="text-xs text-slate-500">{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Period
            </label>
            {reportType === 'custom' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-900">April 2026</div>
                  <div className="text-xs text-slate-500">(partial)</div>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pdf', label: 'PDF', desc: 'Formatted, printable' },
                { id: 'excel', label: 'Excel', desc: 'For accountant' },
                { id: 'csv', label: 'CSV', desc: 'Raw data' }
              ].map((fmt) => (
                <label
                  key={fmt.id}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    format === fmt.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={fmt.id}
                    checked={format === fmt.id}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="text-sm font-semibold text-slate-900 mb-1">{fmt.label}</div>
                  <div className="text-xs text-slate-500 text-center">{fmt.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Include Sections */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Include Sections
            </label>
            <div className="space-y-2">
              {[
                { id: 'summary', label: 'Revenue summary' },
                { id: 'consultationBreakdown', label: 'Consultation breakdown by type' },
                { id: 'insuranceClaims', label: 'Insurance claims by provider' },
                { id: 'transactions', label: 'Transaction list' },
                { id: 'payouts', label: 'Payout history' },
                { id: 'patientNames', label: 'Patient names (for privacy — off by default)' },
                { id: 'platformFees', label: 'Platform fee breakdown' }
              ].map((section) => (
                <label key={section.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSections[section.id as keyof typeof includeSections]}
                    onChange={(e) =>
                      setIncludeSections((prev) => ({
                        ...prev,
                        [section.id]: e.target.checked
                      }))
                    }
                    className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700">{section.label}</span>
                </label>
              ))}
            </div>
            {!includeSections.patientNames && (
              <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Include anonymized patient IDs instead
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'english', label: 'English' },
                { id: 'arabic', label: 'Arabic' }
              ].map((lang) => (
                <label
                  key={lang.id}
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    language === lang.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.id}
                    checked={language === lang.id}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="text-sm font-semibold text-slate-900">{lang.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* VAT Note for Tax Summary */}
          {reportType === 'tax' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-900 font-medium mb-1">UAE VAT (5%) Information</div>
              <div className="text-xs text-blue-700">
                UAE VAT (5%) applies to consultation fees. CeenAiX collects and remits VAT on your behalf. This report shows VAT amounts for your records.
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  );
}
