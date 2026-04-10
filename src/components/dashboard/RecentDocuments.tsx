import { FileText, Download, Eye } from 'lucide-react';
import { Document } from '../../types/dashboard';
import { format } from 'date-fns';

interface RecentDocumentsProps {
  documents: Document[];
}

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  const getDocumentIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-rose-600" />;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lab_report: 'Lab Report',
      prescription: 'Prescription',
      referral: 'Referral Letter',
      other: 'Document',
    };
    return labels[type] || 'Document';
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {getDocumentIcon(doc.documentType)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                  {getDocumentTypeLabel(doc.documentType)}
                </span>
                <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors">
          Upload New Document
        </button>
      </div>
    </div>
  );
}
