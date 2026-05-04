import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Download, Eye, Share2, X, CheckCircle, Send } from 'lucide-react';
import type { LabVisit } from '../../types/patientLabResults';

interface AllReportsTabProps {
  visits: LabVisit[];
}

// ── Download Modal ────────────────────────────────────────────────────────────
function DownloadModal({ visit, onClose }: { visit: LabVisit; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Download className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Download Report</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Report Downloaded!</h3>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-gray-700">Full Lab Report — {visit.labName}</span> has been downloaded to your device.
          </p>
          <p className="text-gray-400 text-xs mt-2">PDF · {visit.visitDate}</p>
          <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ visit, onClose }: { visit: LabVisit; onClose: () => void }) {
  const [method, setMethod] = useState<'link' | 'email' | 'whatsapp'>('link');
  const [shared, setShared] = useState(false);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={shared ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Share Report</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{visit.labName} — {visit.visitDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5">
          {shared ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Report Shared!</h3>
              <p className="text-gray-500 text-sm">Your lab report has been shared successfully.</p>
              <p className="text-gray-400 text-xs mt-1">
                via {method === 'link' ? 'Secure Link' : method === 'email' ? 'Email' : 'WhatsApp'}
              </p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">⚠️ The recipient has view-only access to this report.</p>
              </div>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Report summary */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Full Lab Report — {visit.labName}</p>
                  <p className="text-xs text-gray-400">{visit.visitDate} · {visit.tests.length} tests</p>
                </div>
              </div>

              {/* Share method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Share via</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'link', label: 'Secure Link', icon: '🔗' },
                    { id: 'email', label: 'Email', icon: '📧' },
                    { id: 'whatsapp', label: 'WhatsApp', icon: '🟢' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setMethod(opt.id as typeof method)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                        method === opt.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className={`text-xs font-medium ${method === opt.id ? 'text-teal-700' : 'text-gray-600'}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">⚠️ Only share with authorized healthcare providers. Recipient will have view-only access.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => setShared(true)} className="flex-1 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  visit,
  onClose,
  onDownload,
  onShare,
}: {
  visit: LabVisit;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Dark header */}
        <div className="bg-gray-900 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Full Lab Report — {visit.labName}</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          {/* Document info */}
          <div className="bg-gray-50 rounded-xl p-5 mb-5">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Report Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Lab Name</p>
                <p className="font-medium text-gray-900">{visit.labName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Visit Date</p>
                <p className="font-medium text-gray-900">{visit.visitDate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Tests Included</p>
                <p className="font-medium text-gray-900">{visit.tests.length} tests</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">File</p>
                <p className="font-medium text-gray-900">PDF · 2 pages · 142 KB</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">Ordered By</p>
                <p className="font-medium text-gray-900">{visit.orderedBy} — {visit.orderedBySpecialty}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">NABIDH Reference</p>
                <p className="font-medium text-gray-900 font-mono text-xs">{visit.nabidh}</p>
              </div>
            </div>
          </div>

          {/* Preview placeholder */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-10">
            <div className="text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">Document preview not available in demo mode</p>
              <p className="text-xs mt-1">Click Download to view the full report</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { onClose(); onDownload(); }}
              className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={() => { onClose(); onShare(); }}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllReportsTab({ visits }: AllReportsTabProps) {
  const [downloadVisit, setDownloadVisit] = useState<LabVisit | null>(null);
  const [shareVisit, setShareVisit] = useState<LabVisit | null>(null);
  const [previewVisit, setPreviewVisit] = useState<LabVisit | null>(null);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Lab Reports 📋</h3>
        <p className="text-sm text-gray-500">Download official lab reports as PDF</p>
      </div>

      {visits.map((visit, idx) => (
        <div
          key={visit.id}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-red-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-gray-900">
                Full Lab Report — {visit.labName}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>Date: {visit.visitDate}</span>
                <span>·</span>
                <span>{visit.tests.length} tests</span>
              </div>
              <div className="text-sm text-gray-500">
                Ordered by: {visit.orderedBy}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>PDF · 2 pages · 142 KB</span>
                <span>·</span>
                <span>DHA stamp: Nabidh HIE registered — FHIR R4</span>
              </div>
              <div className="text-xs font-mono text-gray-300 mt-1">
                Ref: {visit.nabidh}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setDownloadVisit(visit)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setPreviewVisit(visit)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setShareVisit(visit)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
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

      {/* Modals */}
      {downloadVisit && <DownloadModal visit={downloadVisit} onClose={() => setDownloadVisit(null)} />}
      {shareVisit && <ShareModal visit={shareVisit} onClose={() => setShareVisit(null)} />}
      {previewVisit && (
        <PreviewModal
          visit={previewVisit}
          onClose={() => setPreviewVisit(null)}
          onDownload={() => setDownloadVisit(previewVisit)}
          onShare={() => setShareVisit(previewVisit)}
        />
      )}
    </div>
  );
}