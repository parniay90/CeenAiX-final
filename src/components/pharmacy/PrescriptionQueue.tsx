import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Prescription, PrescriptionStatus } from '../../types/pharmacy';
import { AlertCircle, Filter } from 'lucide-react';

interface PrescriptionQueueProps {
  prescriptions: Prescription[];
  onSelectPrescription: (prescription: Prescription) => void;
}

const statusConfig: Record<
  PrescriptionStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
  in_progress: { label: 'In Progress', bg: 'bg-teal-100', text: 'text-teal-800' },
  ready: { label: 'Ready', bg: 'bg-green-100', text: 'text-green-800' },
  dispensed: { label: 'Dispensed', bg: 'bg-slate-100', text: 'text-slate-700' },
  on_hold: { label: 'On Hold', bg: 'bg-rose-100', text: 'text-rose-800' },
  insurance_pending: {
    label: 'Insurance Pending',
    bg: 'bg-violet-100',
    text: 'text-violet-800',
  },
};

export default function PrescriptionQueue({
  prescriptions,
  onSelectPrescription,
}: PrescriptionQueueProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPrescriptions =
    filterStatus === 'all'
      ? prescriptions
      : prescriptions.filter((p) => p.status === filterStatus);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredPrescriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPrescriptions.map((p) => p.id));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Prescription Queue</h2>
          <p className="text-sm text-slate-600">
            {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{selectedIds.length} selected</span>
              <button className="px-3 py-1.5 bg-teal-600 text-white rounded text-sm font-semibold hover:bg-teal-700 transition-colors">
                Mark Dispensed
              </button>
              <button className="px-3 py-1.5 bg-slate-600 text-white rounded text-sm font-semibold hover:bg-slate-700 transition-colors">
                Print Labels
              </button>
            </div>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="on_hold">On Hold</option>
              <option value="insurance_pending">Insurance Pending</option>
              <option value="dispensed">Dispensed</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    filteredPrescriptions.length > 0 &&
                    selectedIds.length === filteredPrescriptions.length
                  }
                  onChange={selectAll}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Rx Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Patient Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Doctor
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Clinic
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Medications
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Insurance
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                Time Received
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPrescriptions.map((prescription) => {
              const config = statusConfig[prescription.status];
              return (
                <tr
                  key={prescription.id}
                  onClick={() => onSelectPrescription(prescription)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prescription.id)}
                      onChange={() => toggleSelect(prescription.id)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-slate-900">
                        {prescription.rxNumber}
                      </span>
                      {prescription.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded">
                          <AlertCircle className="w-3 h-3" />
                          URGENT
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {prescription.patientName}
                    </div>
                    {prescription.patientAllergies.length > 0 && (
                      <div className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Allergies: {prescription.patientAllergies.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {prescription.doctorName}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {prescription.doctorClinic}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-teal-100 text-teal-800 rounded-full text-sm font-bold">
                      {prescription.medicationCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {prescription.insuranceProvider}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text}`}
                    >
                      {config.label}
                    </span>
                    {prescription.interactionFlags.length > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded">
                          <AlertCircle className="w-3 h-3" />
                          {prescription.interactionFlags.length} interaction
                          {prescription.interactionFlags.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatDistanceToNow(prescription.timeReceived, { addSuffix: true })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
