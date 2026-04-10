import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Sample, SamplePriority, SampleStatus } from '../../types/laboratory';
import { format } from 'date-fns';

interface SampleQueueProps {
  samples: Sample[];
  onSampleClick: (sample: Sample) => void;
}

export default function SampleQueue({ samples, onSampleClick }: SampleQueueProps) {
  const [barcodeSearch, setBarcodeSearch] = useState('');

  const getPriorityStyle = (priority: SamplePriority) => {
    switch (priority) {
      case 'stat':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'urgent':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'routine':
        return 'bg-teal-100 text-teal-900 border-teal-300';
    }
  };

  const getStatusStyle = (status: SampleStatus) => {
    switch (status) {
      case 'received':
        return 'bg-slate-100 text-slate-700';
      case 'accessioned':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resulted':
        return 'bg-purple-100 text-purple-700';
      case 'verified':
        return 'bg-indigo-100 text-indigo-700';
      case 'released':
        return 'bg-green-100 text-green-700';
      case 'nabidh_submitted':
        return 'bg-teal-100 text-teal-700';
    }
  };

  const getStatusLabel = (status: SampleStatus) => {
    switch (status) {
      case 'received':
        return 'Received';
      case 'accessioned':
        return 'Accessioned';
      case 'in_progress':
        return 'In Progress';
      case 'resulted':
        return 'Resulted';
      case 'verified':
        return 'Verified';
      case 'released':
        return 'Released';
      case 'nabidh_submitted':
        return 'NABIDH Submitted';
    }
  };

  const sortedSamples = [...samples].sort((a, b) => {
    const priorityOrder: Record<SamplePriority, number> = { stat: 0, urgent: 1, routine: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredSamples = barcodeSearch
    ? sortedSamples.filter(
        (s) =>
          s.barcode.includes(barcodeSearch) ||
          s.sampleId.toLowerCase().includes(barcodeSearch.toLowerCase())
      )
    : sortedSamples;

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Sample Queue</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={barcodeSearch}
            onChange={(e) => setBarcodeSearch(e.target.value)}
            placeholder="Scan barcode or search sample ID..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Sample ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Patient Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Doctor
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Clinic
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                Tests
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Collection Time
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                Priority
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Technician
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSamples.map((sample) => (
              <tr
                key={sample.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onSampleClick(sample)}
              >
                <td className="px-3 py-3">
                  <div className="text-sm font-mono font-bold text-slate-900">{sample.sampleId}</div>
                  <div className="text-xs text-slate-600">{sample.barcode}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-sm font-semibold text-slate-900">{sample.patientName}</div>
                  <div className="text-xs text-slate-600">{sample.patientMRN}</div>
                </td>
                <td className="px-3 py-3 text-sm text-slate-700">{sample.orderingDoctor}</td>
                <td className="px-3 py-3 text-sm text-slate-700">{sample.clinic}</td>
                <td className="px-3 py-3 text-center">
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-800 rounded text-xs font-bold cursor-help"
                    title={sample.tests.map((t) => t.testName).join(', ')}
                  >
                    {sample.tests.length}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-xs text-slate-900 font-semibold">
                    {format(sample.collectionTime, 'HH:mm')}
                  </div>
                  <div className="text-xs text-slate-600">
                    {format(sample.collectionTime, 'dd MMM')}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getPriorityStyle(
                      sample.priority
                    )}`}
                  >
                    {sample.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusStyle(
                      sample.status
                    )}`}
                  >
                    {getStatusLabel(sample.status)}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-slate-700">
                  {sample.assignedTechnician || (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <button className="p-1.5 hover:bg-teal-100 rounded transition-colors">
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSamples.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 font-semibold">No samples found</p>
          <p className="text-sm text-slate-500">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
