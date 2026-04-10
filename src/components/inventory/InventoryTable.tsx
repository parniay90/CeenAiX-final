import { CreditCard as Edit, RotateCcw, History, Trash2, Lock, Shield } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';
import { format, differenceInDays } from 'date-fns';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (id: string) => void;
  onReorder: (id: string) => void;
  onViewHistory: (id: string) => void;
  onWriteOff: (id: string) => void;
  onUpdateReorderPoint: (id: string, value: number) => void;
  onUpdateRetailPrice: (id: string, value: number) => void;
}

export default function InventoryTable({
  items,
  onEdit,
  onReorder,
  onViewHistory,
  onWriteOff,
  onUpdateReorderPoint,
  onUpdateRetailPrice,
}: InventoryTableProps) {
  const getRowStyle = (item: InventoryItem) => {
    if (item.stockStatus === 'out_of_stock') {
      return 'bg-rose-50 border-l-4 border-rose-500';
    }
    if (item.stockStatus === 'low' || item.stockStatus === 'critical' || item.stockStatus === 'expiring_soon') {
      return 'bg-amber-50 border-l-4 border-amber-500';
    }
    return 'bg-white border-l-4 border-green-500';
  };

  const getExpiryBadge = (expiryDate: Date) => {
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());

    if (daysUntilExpiry < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-900 rounded text-xs font-bold">
          EXPIRED - Do Not Dispense
        </span>
      );
    }

    if (daysUntilExpiry <= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold">
          {daysUntilExpiry} days left
        </span>
      );
    }

    return (
      <span className="text-sm text-slate-700">{format(expiryDate, 'dd MMM yyyy')}</span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Drug Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Generic Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Strength</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Form</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">SKU/Barcode</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Current Stock</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Reorder Point</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Supplier</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">Cost Price</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">Retail Price</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className={`${getRowStyle(item)} hover:bg-opacity-80 transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.isControlledSubstance && (
                      <Lock className="w-4 h-4 text-violet-700" />
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.drugName}</div>
                      <div className="text-xs text-slate-600">Batch: {item.batchNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{item.genericName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.strength}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded capitalize">
                    {item.form}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-mono text-slate-900">{item.sku}</div>
                  <div className="text-xs font-mono text-slate-500">{item.barcode}</div>
                </td>
                <td className="px-4 py-3">
                  <div className={`text-center text-lg font-bold ${
                    item.currentStock === 0 ? 'text-rose-700' :
                    item.currentStock < item.reorderPoint ? 'text-amber-700' :
                    'text-green-700'
                  }`}>
                    {item.currentStock}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.reorderPoint}
                    onChange={(e) => onUpdateReorderPoint(item.id, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-3">{getExpiryBadge(item.expiryDate)}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-slate-900">{item.supplier}</div>
                  <div className="text-xs text-slate-500">{item.supplierContact}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    AED {item.costPrice.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    value={item.retailPrice}
                    onChange={(e) => onUpdateRetailPrice(item.id, parseFloat(e.target.value))}
                    className="w-24 px-2 py-1 border border-slate-300 rounded text-right text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {item.onDHAFormulary && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs font-bold">
                      <Shield className="w-3 h-3" />
                      DHA
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(item.id)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => onReorder(item.id)}
                      className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                      title="Reorder"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => onViewHistory(item.id)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                      title="View History"
                    >
                      <History className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => onWriteOff(item.id)}
                      className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                      title="Write Off"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No inventory items found</p>
          <p className="text-sm text-slate-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
