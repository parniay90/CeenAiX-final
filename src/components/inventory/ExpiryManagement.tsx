import { useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2, ArrowRightLeft } from 'lucide-react';
import { ExpiryItem } from '../../types/inventory';
import { format, differenceInDays } from 'date-fns';

interface ExpiryManagementProps {
  items: ExpiryItem[];
  onMarkReturn: (id: string) => void;
  onWriteOff: (id: string, dhaFormNumber: string) => void;
  onTransfer: (id: string, destinationPharmacy: string) => void;
}

export default function ExpiryManagement({
  items,
  onMarkReturn,
  onWriteOff,
  onTransfer,
}: ExpiryManagementProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'return' | 'write_off' | 'transfer' | null>(null);
  const [dhaFormNumber, setDhaFormNumber] = useState('');
  const [destinationPharmacy, setDestinationPharmacy] = useState('');

  const handleAction = () => {
    if (!selectedItem || !actionType) return;

    if (actionType === 'write_off' && dhaFormNumber) {
      onWriteOff(selectedItem, dhaFormNumber);
    } else if (actionType === 'return') {
      onMarkReturn(selectedItem);
    } else if (actionType === 'transfer' && destinationPharmacy) {
      onTransfer(selectedItem, destinationPharmacy);
    }

    setSelectedItem(null);
    setActionType(null);
    setDhaFormNumber('');
    setDestinationPharmacy('');
  };

  const getUrgencyColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'bg-rose-50 border-l-4 border-rose-500';
    if (daysUntilExpiry <= 15) return 'bg-orange-50 border-l-4 border-orange-500';
    if (daysUntilExpiry <= 30) return 'bg-amber-50 border-l-4 border-amber-500';
    return 'bg-yellow-50 border-l-4 border-yellow-500';
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-bold text-amber-900 uppercase">
            Expiry Management - Next 60 Days
          </h3>
        </div>
        <p className="text-sm text-amber-800">
          {items.length} item{items.length !== 1 ? 's' : ''} expiring within 60 days. Take action to minimize wastage.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Drug Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Strength/Form</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Batch Number</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Expiry Date</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Days Left</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">Cost Value</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className={`${getUrgencyColor(item.daysUntilExpiry)}`}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-slate-900">{item.drugName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-700">
                      {item.strength} • <span className="capitalize">{item.form}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-slate-700">{item.batchNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {format(item.expiryDate, 'dd MMM yyyy')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        item.daysUntilExpiry < 0 ? 'bg-rose-100 text-rose-900' :
                        item.daysUntilExpiry <= 15 ? 'bg-orange-100 text-orange-900' :
                        item.daysUntilExpiry <= 30 ? 'bg-amber-100 text-amber-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {item.daysUntilExpiry < 0 ? 'EXPIRED' : `${item.daysUntilExpiry} days`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-slate-900">{item.currentStock}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      AED {item.costValue.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setActionType('return');
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                        title="Mark for Return"
                      >
                        <RotateCcw className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setActionType('write_off');
                        }}
                        className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                        title="Write Off"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setActionType('transfer');
                        }}
                        className="p-1.5 hover:bg-green-100 rounded transition-colors"
                        title="Transfer"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {actionType && selectedItem && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => {
              setSelectedItem(null);
              setActionType(null);
              setDhaFormNumber('');
              setDestinationPharmacy('');
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 w-[450px] z-50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {actionType === 'return' && 'Mark for Return to Supplier'}
              {actionType === 'write_off' && 'Write Off - DHA Waste Disposal'}
              {actionType === 'transfer' && 'Transfer to Another Pharmacy'}
            </h3>

            {actionType === 'write_off' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  DHA Waste Disposal Form Number
                </label>
                <input
                  type="text"
                  value={dhaFormNumber}
                  onChange={(e) => setDhaFormNumber(e.target.value)}
                  placeholder="DHA-WD-2026-XXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="mt-1 text-xs text-slate-600">
                  Required for DHA compliance and audit trail
                </p>
              </div>
            )}

            {actionType === 'transfer' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Destination Pharmacy
                </label>
                <select
                  value={destinationPharmacy}
                  onChange={(e) => setDestinationPharmacy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select pharmacy...</option>
                  <option value="CeenAiX Marina">CeenAiX Pharmacy - Dubai Marina</option>
                  <option value="CeenAiX JBR">CeenAiX Pharmacy - JBR</option>
                  <option value="CeenAiX Downtown">CeenAiX Pharmacy - Downtown</option>
                  <option value="CeenAiX Deira">CeenAiX Pharmacy - Deira</option>
                </select>
              </div>
            )}

            {actionType === 'return' && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  This item will be marked for return to the supplier. A return request will be
                  automatically generated.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAction}
                disabled={
                  (actionType === 'write_off' && !dhaFormNumber) ||
                  (actionType === 'transfer' && !destinationPharmacy)
                }
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setActionType(null);
                  setDhaFormNumber('');
                  setDestinationPharmacy('');
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
