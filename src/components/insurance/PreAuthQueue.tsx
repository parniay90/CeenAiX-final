import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, AlertTriangle, Clock, Bot } from 'lucide-react';
import { MOCK_PRE_AUTHORIZATIONS, PreAuthorization } from '../../types/insurance';
import { formatDistanceToNow } from 'date-fns';

export default function PreAuthQueue() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [preAuths, setPreAuths] = useState(MOCK_PRE_AUTHORIZATIONS);

  const handleSelectAll = () => {
    const approveableIds = preAuths
      .filter(pa => pa.aiRecommendation === 'approve' && pa.status === 'pending')
      .map(pa => pa.id);
    setSelectedItems(approveableIds);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAction = (id: string, action: 'approve' | 'deny' | 'more-info' | 'escalate') => {
    setPreAuths(prev =>
      prev.map(pa =>
        pa.id === id
          ? {
              ...pa,
              status:
                action === 'approve' ? 'approved' :
                action === 'deny' ? 'denied' :
                action === 'more-info' ? 'more-info-needed' :
                'escalated'
            }
          : pa
      )
    );
  };

  const handleBulkApprove = () => {
    setPreAuths(prev =>
      prev.map(pa =>
        selectedItems.includes(pa.id) ? { ...pa, status: 'approved' } : pa
      )
    );
    setSelectedItems([]);
  };

  const getAIBadge = (pa: PreAuthorization) => {
    if (pa.aiRecommendation === 'approve') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 bg-opacity-20 border border-green-600 rounded text-xs font-bold text-green-400">
          <Bot className="w-3 h-3" />
          AI: Approve
        </div>
      );
    } else if (pa.aiRecommendation === 'review') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 bg-opacity-20 border border-amber-600 rounded text-xs font-bold text-amber-400">
          <Bot className="w-3 h-3" />
          AI: Review Needed
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-rose-600 bg-opacity-20 border border-rose-600 rounded text-xs font-bold text-rose-400">
          <Bot className="w-3 h-3" />
          AI: Deny - not covered
        </div>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs font-bold rounded">Approved</span>;
      case 'denied':
        return <span className="px-2 py-1 bg-rose-600 bg-opacity-20 text-rose-400 text-xs font-bold rounded">Denied</span>;
      case 'escalated':
        return <span className="px-2 py-1 bg-violet-600 bg-opacity-20 text-violet-400 text-xs font-bold rounded">Escalated</span>;
      case 'more-info-needed':
        return <span className="px-2 py-1 bg-amber-600 bg-opacity-20 text-amber-400 text-xs font-bold rounded">More Info</span>;
      default:
        return <span className="px-2 py-1 bg-slate-600 bg-opacity-20 text-slate-400 text-xs font-bold rounded">Pending</span>;
    }
  };

  const getSLAColor = (deadline: Date) => {
    const hoursRemaining = (deadline.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursRemaining < 2) return 'text-rose-400';
    if (hoursRemaining < 4) return 'text-amber-400';
    return 'text-green-400';
  };

  const pendingPreAuths = preAuths.filter(pa => pa.status === 'pending');
  const urgentPending = pendingPreAuths.filter(pa => pa.priority === 'urgent');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg">
      <div className="px-5 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Pre-Authorization Queue</h2>
            <div className="text-sm text-slate-400">
              {pendingPreAuths.length} pending ({urgentPending.length} urgent)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded transition-colors"
            >
              Select AI-Approved
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
              >
                Bulk Approve ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">Patient</th>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">Doctor</th>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">Diagnosis</th>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">Procedure</th>
              <th className="text-right text-xs font-bold text-slate-400 uppercase px-4 py-3">Cost</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-4 py-3">Priority</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-4 py-3">SLA Timer</th>
              <th className="text-left text-xs font-bold text-slate-400 uppercase px-4 py-3">AI Rec.</th>
              <th className="text-center text-xs font-bold text-slate-400 uppercase px-4 py-3">Status</th>
              <th className="text-right text-xs font-bold text-slate-400 uppercase px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {preAuths.map((pa) => {
              const isSelected = selectedItems.includes(pa.id);
              const hoursRemaining = (pa.slaDeadline.getTime() - Date.now()) / (1000 * 60 * 60);

              return (
                <tr
                  key={pa.id}
                  className={`hover:bg-slate-900 transition-colors ${
                    pa.priority === 'urgent' ? 'bg-amber-900 bg-opacity-5' : ''
                  } ${isSelected ? 'bg-teal-900 bg-opacity-10' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(pa.id)}
                      className="rounded"
                      disabled={pa.status !== 'pending' || pa.aiRecommendation !== 'approve'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-white">{pa.patientName}</div>
                    <div className="text-xs text-slate-500">ID: {pa.patientId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">{pa.doctorName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{pa.diagnosis}</div>
                    <div className="text-xs text-slate-500">{pa.icd10}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">{pa.procedure}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-bold text-white">
                      AED {pa.estimatedCost.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {pa.priority === 'urgent' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-600 bg-opacity-20 border border-rose-600 rounded text-xs font-bold text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-600 bg-opacity-20 text-slate-400 text-xs font-bold rounded">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center justify-center gap-1 text-sm font-bold ${getSLAColor(pa.slaDeadline)}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {hoursRemaining < 1
                        ? `${Math.round(hoursRemaining * 60)}m`
                        : `${Math.round(hoursRemaining)}h`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getAIBadge(pa)}
                    {pa.aiReason && (
                      <div className="text-xs text-slate-500 mt-1 max-w-xs">{pa.aiReason}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(pa.status)}
                  </td>
                  <td className="px-4 py-3">
                    {pa.status === 'pending' && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAction(pa.id, 'approve')}
                          className="p-1.5 hover:bg-green-600 hover:bg-opacity-20 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          onClick={() => handleAction(pa.id, 'deny')}
                          className="p-1.5 hover:bg-rose-600 hover:bg-opacity-20 rounded transition-colors"
                          title="Deny"
                        >
                          <XCircle className="w-4 h-4 text-rose-400" />
                        </button>
                        <button
                          onClick={() => handleAction(pa.id, 'more-info')}
                          className="p-1.5 hover:bg-amber-600 hover:bg-opacity-20 rounded transition-colors"
                          title="Request More Info"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleAction(pa.id, 'escalate')}
                          className="p-1.5 hover:bg-violet-600 hover:bg-opacity-20 rounded transition-colors"
                          title="Escalate"
                        >
                          <AlertTriangle className="w-4 h-4 text-violet-400" />
                        </button>
                      </div>
                    )}
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
