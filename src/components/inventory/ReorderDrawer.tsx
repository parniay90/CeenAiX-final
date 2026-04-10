import { useState, useEffect } from 'react';
import { X, TrendingUp, Send } from 'lucide-react';
import { InventoryItem, ReorderRequest } from '../../types/inventory';
import { format, addDays } from 'date-fns';

interface ReorderDrawerProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (request: ReorderRequest) => void;
}

export default function ReorderDrawer({ isOpen, item, onClose, onSubmit }: ReorderDrawerProps) {
  const [reorderQuantity, setReorderQuantity] = useState(0);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  useEffect(() => {
    if (item) {
      const suggestedQuantity = Math.max(
        item.reorderPoint * 2,
        Math.ceil(item.averageDispenseRate * 30)
      );
      setReorderQuantity(suggestedQuantity);
      setExpectedDeliveryDate(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const estimatedCost = reorderQuantity * item.costPrice;
  const daysOfSupply = item.averageDispenseRate > 0 ? Math.floor(reorderQuantity / item.averageDispenseRate) : 0;

  const handleSubmit = () => {
    onSubmit({
      drugId: item.id,
      drugName: item.drugName,
      currentStock: item.currentStock,
      reorderQuantity,
      supplier: item.supplier,
      supplierContact: item.supplierContact,
      expectedDeliveryDate: new Date(expectedDeliveryDate),
      estimatedCost,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Reorder Medication</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{item.drugName}</h3>
            <p className="text-sm text-slate-600 mb-3">{item.genericName} • {item.strength}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Current Stock:</span>
                <span className={`ml-2 font-bold ${
                  item.currentStock === 0 ? 'text-rose-700' :
                  item.currentStock < item.reorderPoint ? 'text-amber-700' :
                  'text-green-700'
                }`}>
                  {item.currentStock}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Reorder Point:</span>
                <span className="ml-2 font-bold text-slate-900">{item.reorderPoint}</span>
              </div>
              <div>
                <span className="text-slate-600">Avg. Dispense Rate:</span>
                <span className="ml-2 font-bold text-slate-900">{item.averageDispenseRate}/day</span>
              </div>
              <div>
                <span className="text-slate-600">Cost Price:</span>
                <span className="ml-2 font-bold text-slate-900">AED {item.costPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-bold text-blue-900 uppercase">AI Suggestion</h4>
            </div>
            <p className="text-sm text-blue-800">
              Based on average dispense rate of {item.averageDispenseRate} units/day, we suggest ordering{' '}
              <span className="font-bold">{reorderQuantity} units</span> to maintain a 30-day supply.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Reorder Quantity
            </label>
            <input
              type="number"
              value={reorderQuantity}
              onChange={(e) => setReorderQuantity(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {daysOfSupply > 0 && (
              <p className="mt-1 text-sm text-slate-600">
                Approximately {daysOfSupply} days of supply
              </p>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase">Supplier Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Supplier:</span>
                <span className="font-semibold text-slate-900">{item.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Contact:</span>
                <span className="font-semibold text-slate-900">{item.supplierContact}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-teal-50 border-2 border-teal-300 rounded-lg p-4">
            <h4 className="text-sm font-bold text-teal-900 mb-3 uppercase">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-teal-800">Quantity:</span>
                <span className="font-bold text-teal-900">{reorderQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-800">Unit Cost:</span>
                <span className="font-semibold text-teal-900">AED {item.costPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-teal-300 flex justify-between">
                <span className="font-bold text-teal-900">Estimated Total:</span>
                <span className="text-xl font-bold text-teal-900">
                  AED {estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={reorderQuantity <= 0 || !expectedDeliveryDate}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Order
            </button>
            <p className="text-xs text-slate-600 text-center">
              Purchase order will be created and sent to supplier email
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
