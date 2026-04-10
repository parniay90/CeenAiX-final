import React, { useState } from 'react';
import { Search, Plus, Download, AlertTriangle, X, Package } from 'lucide-react';
import { inventoryItems, InventoryItem, BatchItem } from '../../data/pharmacyData';

interface Props {
  onNavigate: (page: string) => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  out_of_stock: { label: '🔴 OUT OF STOCK', bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
  low: { label: '⚠️ LOW STOCK', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
  critical: { label: '🟠 CRITICAL', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-l-orange-600' },
  expiring_soon: { label: '⏰ EXPIRING SOON', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-l-orange-400' },
  in_stock: { label: '✅ In Stock', bg: 'bg-white', text: 'text-emerald-700', border: 'border-l-emerald-400' },
};

const PharmacyInventory: React.FC<Props> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<InventoryItem | null>(null);
  const [showAddStock, setShowAddStock] = useState(false);
  const [orderQty, setOrderQty] = useState(200);
  const [orderUrgency, setOrderUrgency] = useState('express');
  const [orderSent, setOrderSent] = useState(false);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'in_stock', label: 'In Stock' },
    { key: 'low', label: 'Low Stock' },
    { key: 'out_of_stock', label: 'Out of Stock' },
    { key: 'expiring_soon', label: 'Expiring Soon' },
    { key: 'controlled', label: 'Controlled' },
  ];

  const alertCount = inventoryItems.filter(i =>
    i.stockStatus === 'out_of_stock' || i.stockStatus === 'low' || i.stockStatus === 'expiring_soon'
  ).length;

  const filtered = inventoryItems.filter(item => {
    if (filter === 'controlled') return item.isControlled;
    if (filter !== 'all' && item.stockStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.genericName.toLowerCase().includes(q) ||
        (item.brandName || '').toLowerCase().includes(q) ||
        item.atcCode.toLowerCase().includes(q);
    }
    return true;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    const order = { out_of_stock: 0, low: 1, critical: 2, expiring_soon: 3, in_stock: 4 };
    return (order[a.stockStatus] ?? 5) - (order[b.stockStatus] ?? 5);
  });

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
            Inventory
          </h2>
          <div className="text-slate-400" style={{ fontSize: 13 }}>
            Drug stock, expiry tracking, and reorder management
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors animate-pulse">
            <AlertTriangle className="w-4 h-4" /> {alertCount} Alerts
          </button>
          <button
            onClick={() => setShowAddStock(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Stock
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Drug name, generic, ATC code, barcode..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-400"
              style={{ fontSize: 13 }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Drug', 'Category', 'Stock', 'Batches', 'Expiry', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-500 uppercase tracking-wider font-semibold" style={{ fontSize: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedFiltered.map(item => {
              const cfg = statusConfig[item.stockStatus] || statusConfig.in_stock;
              return (
                <tr
                  key={item.id}
                  className={`border-b border-slate-50 border-l-4 ${cfg.border} ${cfg.bg} hover:brightness-95 cursor-pointer transition-all ${item.isControlled ? 'bg-purple-50' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800" style={{ fontSize: 13 }}>
                      {item.genericName} {item.strength}
                      {item.isControlled && (
                        <span className="ml-2 bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">CS</span>
                      )}
                      {item.isDHAFormulary && (
                        <span className="ml-1 bg-emerald-50 text-emerald-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full">DHA ✅</span>
                      )}
                    </div>
                    {item.brandName && (
                      <div className="text-slate-400 italic" style={{ fontSize: 11 }}>{item.brandName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600" style={{ fontSize: 12 }}>{item.category}</div>
                    <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{item.atcCode}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`font-bold ${item.stockQty === 0 ? 'text-red-700' : item.stockStatus === 'low' ? 'text-amber-600' : 'text-emerald-700'}`}
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 14 }}
                    >
                      {item.stockQty === 0 ? '0' : item.stockQty.toLocaleString()} {item.unit.toUpperCase()}
                    </div>
                    {item.daysSupply && (
                      <div className="text-amber-600" style={{ fontSize: 10 }}>~{item.daysSupply} days supply</div>
                    )}
                    {item.affectedPrescriptions && item.affectedPrescriptions.length > 0 && (
                      <div className="text-red-600" style={{ fontSize: 10 }}>
                        {item.affectedPrescriptions.length} Rx affected
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600" style={{ fontSize: 12 }}>{item.batches.length} batch{item.batches.length !== 1 ? 'es' : ''}</div>
                    {item.batches.length > 0 && (
                      <div className="text-slate-400" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                        {item.batches[0].batchNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.batches.length > 0 ? (
                      <div
                        className={`font-mono text-xs ${item.stockStatus === 'expiring_soon' ? 'text-orange-700 font-bold' : 'text-slate-600'}`}
                        style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}
                      >
                        {item.batches[0].expiryDate}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text} border border-current border-opacity-20`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      {item.stockStatus === 'out_of_stock' && (
                        <button
                          onClick={() => setShowOrderModal(item)}
                          className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          📦 Order
                        </button>
                      )}
                      {(item.stockStatus === 'low' || item.stockStatus === 'expiring_soon') && (
                        <button
                          onClick={() => setShowOrderModal(item)}
                          className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                        >
                          📦 Order
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Batches
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Batch Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
                  {selectedItem.genericName} {selectedItem.strength} — Batches
                </h3>
                <div className="text-slate-400 text-xs">{selectedItem.category}</div>
              </div>
              <button onClick={() => setSelectedItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">
              {selectedItem.batches.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No active batches</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Batch #', 'Qty', 'Expiry', 'Supplier', 'Received', 'Status'].map(h => (
                        <th key={h} className="text-left pb-2 text-slate-400 text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.batches.map((b, i) => (
                      <tr key={b.batchNumber} className={`border-b border-slate-50 ${b.status === 'expiring_soon' ? 'bg-orange-50' : ''}`}>
                        <td className="py-2.5 font-mono text-xs text-teal-700">{b.batchNumber}</td>
                        <td className="py-2.5 font-bold font-mono text-xs">{b.quantity}</td>
                        <td className={`py-2.5 font-mono text-xs ${b.status === 'expiring_soon' ? 'text-orange-700 font-bold' : 'text-slate-700'}`}>
                          {b.expiryDate}
                        </td>
                        <td className="py-2.5 text-slate-600 text-xs">{b.supplier}</td>
                        <td className="py-2.5 text-slate-400 text-xs">{b.receivedDate}</td>
                        <td className="py-2.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${b.status === 'expiring_soon' ? 'bg-orange-100 text-orange-700' : b.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {b.status === 'expiring_soon' ? 'EXPIRING' : b.status === 'expired' ? 'EXPIRED' : 'ACTIVE'}
                          </span>
                          {i === 0 && selectedItem.batches.length > 1 && (
                            <div className="text-emerald-600 text-[9px] mt-0.5">FEFO — Use first</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-5 pb-4">
              <button
                onClick={() => { setSelectedItem(null); setShowAddStock(true); }}
                className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[440px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900" style={{ fontSize: 16 }}>
                Order from Supplier
              </h3>
              <button onClick={() => { setShowOrderModal(null); setOrderSent(false); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {!orderSent ? (
              <div className="p-5 space-y-4">
                <div className="bg-slate-50 rounded-lg p-3 text-sm">
                  <div className="font-semibold text-slate-800">{showOrderModal.genericName} {showOrderModal.strength}</div>
                  <div className="text-slate-500 text-xs">{showOrderModal.brandName}</div>
                </div>
                <div>
                  <label className="text-slate-600 text-xs font-semibold block mb-1">Preferred Supplier</label>
                  <div className="text-slate-700 text-sm bg-slate-50 rounded-lg px-3 py-2">
                    Al Andalous Medical / Pfizer Gulf
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 text-xs font-semibold block mb-1">Qty to order</label>
                  <input
                    type="number"
                    value={orderQty}
                    onChange={e => setOrderQty(parseInt(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                    style={{ fontFamily: 'DM Mono, monospace' }}
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-xs font-semibold block mb-1">Urgency</label>
                  <div className="flex gap-2">
                    {[['standard', 'Standard'], ['express', 'Express'], ['emergency', 'Emergency']].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setOrderUrgency(val)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${orderUrgency === val ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setOrderSent(true)}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-emerald-700 transition-colors"
                >
                  Send Order Request
                </button>
              </div>
            ) : (
              <div className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="font-bold text-emerald-700 mb-1">Order Request Sent ✅</div>
                <div className="text-slate-500 text-sm mb-4">Purchase order generated and sent to supplier.</div>
                <button
                  onClick={() => { setShowOrderModal(null); setOrderSent(false); }}
                  className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900" style={{ fontSize: 16 }}>Add New Stock Batch</h3>
              <button onClick={() => setShowAddStock(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                ['Drug name', 'text', 'e.g. Atorvastatin 20mg'],
                ['Batch number', 'text', 'e.g. BT-2026-ATV20-001'],
                ['Quantity', 'number', 'e.g. 200'],
                ['Expiry date', 'date', ''],
                ['Supplier', 'text', 'e.g. Al Andalous Medical'],
                ['Invoice #', 'text', 'e.g. INV-2026-00471'],
                ['Cost per unit (AED)', 'number', 'e.g. 2.50'],
              ].map(([label, type, placeholder]) => (
                <div key={label as string}>
                  <label className="text-slate-600 text-xs font-semibold block mb-1">{label as string}</label>
                  <input
                    type={type as string}
                    placeholder={placeholder as string}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              ))}
              <button
                onClick={() => setShowAddStock(false)}
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors"
              >
                Save Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyInventory;
