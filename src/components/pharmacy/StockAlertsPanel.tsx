import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { StockAlert } from '../../types/pharmacy';
import { formatDistanceToNow } from 'date-fns';

interface StockAlertsPanelProps {
  alerts: StockAlert[];
  onOrder: (alertId: string) => void;
  onToggleAutoReorder: (alertId: string) => void;
}

export default function StockAlertsPanel({
  alerts,
  onOrder,
  onToggleAutoReorder,
}: StockAlertsPanelProps) {
  const criticalAlerts = alerts.filter((a) => a.level === 'critical');
  const lowAlerts = alerts.filter((a) => a.level === 'low');

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Stock Alerts</h3>
        </div>
        <span className="text-xs text-slate-600">{alerts.length} items</span>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {criticalAlerts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold text-rose-900 uppercase">
                Critical (0-5 units)
              </h4>
            </div>
            <div className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-900">
                        {alert.drugName}
                      </h5>
                      <p className="text-xs text-slate-600">{alert.genericName}</p>
                    </div>
                    <span className="text-lg font-bold text-rose-700">
                      {alert.currentStock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                    <span>Reorder point: {alert.reorderPoint}</span>
                    <span className="text-slate-500">{alert.supplier}</span>
                  </div>
                  {alert.lastOrderDate && (
                    <div className="text-xs text-slate-500 mb-2">
                      Last order: {formatDistanceToNow(alert.lastOrderDate, { addSuffix: true })}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOrder(alert.id)}
                      className="flex-1 px-3 py-2 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Order Now
                    </button>
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-rose-300 rounded cursor-pointer hover:bg-rose-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={alert.autoReorderEnabled}
                        onChange={() => onToggleAutoReorder(alert.id)}
                        className="w-3 h-3 text-rose-600 rounded focus:ring-2 focus:ring-rose-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Auto</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowAlerts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-900 uppercase">
                Low Stock (6-20 units)
              </h4>
            </div>
            <div className="space-y-2">
              {lowAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-900">
                        {alert.drugName}
                      </h5>
                      <p className="text-xs text-slate-600">{alert.genericName}</p>
                    </div>
                    <span className="text-lg font-bold text-amber-700">
                      {alert.currentStock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                    <span>Reorder point: {alert.reorderPoint}</span>
                    <span className="text-slate-500">{alert.supplier}</span>
                  </div>
                  {alert.lastOrderDate && (
                    <div className="text-xs text-slate-500 mb-2">
                      Last order: {formatDistanceToNow(alert.lastOrderDate, { addSuffix: true })}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOrder(alert.id)}
                      className="flex-1 px-3 py-2 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Order
                    </button>
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-amber-300 rounded cursor-pointer hover:bg-amber-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={alert.autoReorderEnabled}
                        onChange={() => onToggleAutoReorder(alert.id)}
                        className="w-3 h-3 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Auto</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
