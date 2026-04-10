import React, { useState } from 'react';
import {
  Search, Plus, Download, AlertTriangle, X, Package,
  ChevronDown, ChevronRight, Lock, ShieldCheck, Clock,
  Eye, ShoppingCart, RefreshCw,
} from 'lucide-react';
import { inventoryItems, InventoryItem, BatchItem } from '../../data/pharmacyData';

type FilterType = 'all' | 'in_stock' | 'low' | 'critical' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'controlled' | 'dha_formulary';

const filterLabels: Record<FilterType, string> = {
  all: 'All',
  in_stock: 'In Stock',
  low: 'Low Stock',
  critical: 'Critical',
  out_of_stock: 'Out of Stock',
  expiring_soon: 'Expiring Soon',
  expired: 'Expired',
  controlled: 'Controlled',
  dha_formulary: 'DHA Formulary',
};

const stockConfig: Record<string, { label: string; bg: string; text: string; dot: string; rowBg: string }> = {
  in_stock:      { label: 'IN STOCK',      bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E', rowBg: 'transparent' },
  low:           { label: 'LOW STOCK',     bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B', rowBg: '#FFFDF7' },
  critical:      { label: 'CRITICAL',      bg: '#FFF7ED', text: '#C2410C', dot: '#F97316', rowBg: '#FFF8F3' },
  out_of_stock:  { label: 'OUT OF STOCK',  bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444', rowBg: '#FFF5F5' },
  expiring_soon: { label: 'EXPIRING SOON', bg: '#FEF9C3', text: '#854D0E', dot: '#EAB308', rowBg: '#FEFCE8' },
  expired:       { label: 'EXPIRED',       bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF', rowBg: '#F9FAFB' },
};

const batchStatusColor: Record<string, string> = {
  active: '#16A34A',
  expiring_soon: '#D97706',
  expired: '#9CA3AF',
};

interface BatchModalState { item: InventoryItem | null }
interface OrderModalState { item: InventoryItem | null }

interface Props {
  onNavigate: (page: string) => void;
}

const PharmacyInventory: React.FC<Props> = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [batchModal, setBatchModal] = useState<BatchModalState>({ item: null });
  const [orderModal, setOrderModal] = useState<OrderModalState>({ item: null });
  const [orderQty, setOrderQty] = useState('200');
  const [orderUrgency, setOrderUrgency] = useState<'standard' | 'express' | 'emergency'>('standard');
  const [orderSent, setOrderSent] = useState(false);
  const [newBatch, setNewBatch] = useState({ number: '', qty: '', expiry: '', supplier: '' });

  const filtered = inventoryItems.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      item.genericName.toLowerCase().includes(q) ||
      (item.brandName || '').toLowerCase().includes(q) ||
      item.atcCode.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all' ? true :
      filter === 'controlled' ? !!item.isControlled :
      filter === 'dha_formulary' ? !!item.isDHAFormulary :
      item.stockStatus === filter;
    return matchSearch && matchFilter;
  });

  const filterCounts: Record<FilterType, number> = {
    all: inventoryItems.length,
    in_stock: inventoryItems.filter(i => i.stockStatus === 'in_stock').length,
    low: inventoryItems.filter(i => i.stockStatus === 'low').length,
    critical: inventoryItems.filter(i => i.stockStatus === 'critical').length,
    out_of_stock: inventoryItems.filter(i => i.stockStatus === 'out_of_stock').length,
    expiring_soon: inventoryItems.filter(i => i.stockStatus === 'expiring_soon').length,
    expired: inventoryItems.filter(i => i.stockStatus === 'expired').length,
    controlled: inventoryItems.filter(i => !!i.isControlled).length,
    dha_formulary: inventoryItems.filter(i => !!i.isDHAFormulary).length,
  };

  const handleSendOrder = () => {
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      setOrderModal({ item: null });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F8FAFC' }}>
      <div className="mx-6 mt-5 mb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20 }}>
            Inventory Management
          </h2>
          <div className="text-slate-400" style={{ fontSize: 13 }}>
            Stock levels · Al Shifa Pharmacy · 7 April 2026
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export Stock Report
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" /> Receive Stock
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-6 mb-4 grid grid-cols-5 gap-3 flex-shrink-0">
        {[
          { label: 'Total SKUs', value: String(inventoryItems.length), color: '#334155', bg: '#F8FAFC' },
          { label: 'In Stock', value: String(filterCounts.in_stock), color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Low / Critical', value: `${filterCounts.low + filterCounts.critical}`, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Out of Stock', value: String(filterCounts.out_of_stock), color: '#B91C1C', bg: '#FEF2F2' },
          { label: 'Expiring Soon', value: String(filterCounts.expiring_soon), color: '#854D0E', bg: '#FEFCE8' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-slate-100 px-4 py-3 shadow-sm" style={{ background: stat.bg }}>
            <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, color: stat.color }}>{stat.value}</div>
            <div className="text-slate-500 mt-0.5" style={{ fontSize: 11 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="mx-6 mb-4 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Drug name, brand, ATC code, category..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(filterLabels) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1 font-medium transition-colors"
              style={{
                fontSize: 12,
                background: filter === f ? '#059669' : '#F1F5F9',
                color: filter === f ? '#fff' : '#475569',
              }}
              onMouseEnter={e => { if (filter !== f) e.currentTarget.style.background = '#E2E8F0'; }}
              onMouseLeave={e => { if (filter !== f) e.currentTarget.style.background = '#F1F5F9'; }}
            >
              {filterLabels[f]} ({filterCounts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mx-6 mb-6 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
        <div
          className="grid text-slate-400 uppercase tracking-widest px-5 py-3 border-b border-slate-100"
          style={{
            fontSize: 10, fontFamily: 'DM Mono, monospace',
            gridTemplateColumns: '2fr 1fr 1fr 80px 100px 120px 160px',
          }}
        >
          <div>Drug</div>
          <div>Category</div>
          <div>Stock Qty</div>
          <div>Days</div>
          <div>Reorder Lvl</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-slate-400 py-12" style={{ fontSize: 14 }}>
            No items match your search
          </div>
        )}

        {filtered.map((item, idx) => {
          const cfg = stockConfig[item.stockStatus] || stockConfig.in_stock;
          const stockPct = item.reorderLevel > 0 ? Math.min(100, (item.stockQty / (item.reorderLevel * 3)) * 100) : 100;
          return (
            <div
              key={item.id}
              className="grid items-center px-5 py-3.5 transition-colors cursor-pointer"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 80px 100px 120px 160px',
                borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : undefined,
                borderLeft: `4px solid ${cfg.dot}`,
                background: cfg.rowBg,
                minHeight: 64,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0FDF4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = cfg.rowBg; }}
            >
              {/* Drug name */}
              <div className="pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800" style={{ fontSize: 13 }}>
                    {item.genericName} {item.strength}
                  </span>
                  {item.isControlled && (
                    <span className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ background: '#EDE9FE', fontSize: 9, color: '#7C3AED' }}>
                      <Lock style={{ width: 8, height: 8 }} /> CS
                    </span>
                  )}
                  {item.isDHAFormulary && (
                    <span className="rounded-full px-1.5 py-0.5" style={{ background: '#ECFDF5', fontSize: 9, color: '#059669', fontFamily: 'DM Mono, monospace' }}>
                      DHA ✓
                    </span>
                  )}
                </div>
                <div className="text-slate-400 truncate" style={{ fontSize: 11 }}>
                  {item.brandName} · {item.form} · {item.atcCode}
                </div>
                {item.affectedPrescriptions && item.affectedPrescriptions.length > 0 && (
                  <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: 10, color: '#B91C1C' }}>
                    <AlertTriangle style={{ width: 10, height: 10 }} />
                    Affects: {item.affectedPrescriptions.join(', ')}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="text-slate-500 text-xs">{item.category}</div>

              {/* Stock qty + bar */}
              <div>
                <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 15, color: cfg.text }}>
                  {item.stockQty} <span className="font-normal text-slate-400" style={{ fontSize: 10 }}>{item.unit}</span>
                </div>
                <div className="w-24 h-1.5 rounded-full mt-1" style={{ background: '#E2E8F0' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${stockPct}%`, background: cfg.dot }}
                  />
                </div>
              </div>

              {/* Days supply */}
              <div>
                {item.daysSupply != null ? (
                  <span className="font-mono font-bold" style={{ fontSize: 13, color: item.daysSupply < 5 ? '#B91C1C' : '#D97706' }}>
                    {item.daysSupply}d
                  </span>
                ) : (
                  <span className="text-slate-300" style={{ fontSize: 12 }}>—</span>
                )}
              </div>

              {/* Reorder level */}
              <div className="font-mono text-slate-500" style={{ fontSize: 12 }}>
                {item.reorderLevel} {item.unit}
              </div>

              {/* Status badge */}
              <div>
                <span
                  className="font-bold rounded-full px-2 py-0.5 whitespace-nowrap"
                  style={{ fontSize: 10, background: cfg.bg, color: cfg.text }}
                >
                  {cfg.label}
                </span>
                {item.batches.length > 0 && (
                  <div className="text-slate-400 mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
                    {item.batches.length} batch{item.batches.length > 1 ? 'es' : ''}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setBatchModal({ item })}
                  className="flex items-center gap-1 text-slate-600 rounded-lg px-2.5 py-1.5 font-medium transition-colors"
                  style={{ background: '#F1F5F9', fontSize: 11 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                >
                  <Eye className="w-3 h-3" /> Batches
                </button>
                <button
                  onClick={() => { setOrderModal({ item }); setOrderSent(false); setOrderQty('200'); setOrderUrgency('standard'); }}
                  className="flex items-center gap-1 text-white rounded-lg px-2.5 py-1.5 font-semibold transition-colors"
                  style={{ background: '#059669', fontSize: 11 }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <ShoppingCart className="w-3 h-3" /> Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Detail Modal */}
      {batchModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17 }}>
                  Batch Details — {batchModal.item.genericName} {batchModal.item.strength}
                </h3>
                <div className="text-slate-400 text-xs mt-0.5">
                  {batchModal.item.brandName} · {batchModal.item.form} · {batchModal.item.atcCode}
                </div>
              </div>
              <button
                onClick={() => setBatchModal({ item: null })}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Current batches */}
              {batchModal.item.batches.length === 0 ? (
                <div className="text-center py-8 text-slate-400" style={{ fontSize: 14 }}>
                  No batches on file — item is out of stock
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-700" style={{ fontSize: 13 }}>Active Batches (FEFO order)</span>
                    <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      First Expired, First Out
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 overflow-hidden mb-6">
                    <div
                      className="grid text-slate-400 uppercase tracking-widest px-4 py-2.5 border-b border-slate-100"
                      style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', gridTemplateColumns: '1fr 80px 120px 1fr 100px 80px' }}
                    >
                      <div>Batch No.</div>
                      <div>Qty</div>
                      <div>Expiry</div>
                      <div>Supplier</div>
                      <div>Received</div>
                      <div>Status</div>
                    </div>
                    {batchModal.item.batches.map((batch, i) => (
                      <div
                        key={batch.batchNumber}
                        className="grid items-center px-4 py-3"
                        style={{
                          gridTemplateColumns: '1fr 80px 120px 1fr 100px 80px',
                          borderBottom: i < (batchModal.item?.batches.length ?? 0) - 1 ? '1px solid #F8FAFC' : undefined,
                          background: i === 0 ? '#F0FDF4' : 'transparent',
                        }}
                      >
                        <div className="font-mono text-slate-700" style={{ fontSize: 11 }}>
                          {batch.batchNumber}
                          {i === 0 && <span className="ml-2 text-emerald-600 font-bold" style={{ fontSize: 9 }}>FEFO ↑</span>}
                        </div>
                        <div className="font-bold font-mono" style={{ fontSize: 13, color: batchStatusColor[batch.status] }}>{batch.quantity}</div>
                        <div className="font-mono text-slate-600" style={{ fontSize: 12 }}>{batch.expiryDate}</div>
                        <div className="text-slate-500 truncate" style={{ fontSize: 11 }}>{batch.supplier}</div>
                        <div className="text-slate-400 font-mono" style={{ fontSize: 10 }}>{batch.receivedDate}</div>
                        <div>
                          <span
                            className="font-bold rounded-full px-2 py-0.5 whitespace-nowrap"
                            style={{
                              fontSize: 9,
                              background: batch.status === 'active' ? '#F0FDF4' : batch.status === 'expiring_soon' ? '#FEF9C3' : '#F3F4F6',
                              color: batchStatusColor[batch.status],
                            }}
                          >
                            {batch.status === 'active' ? 'ACTIVE' : batch.status === 'expiring_soon' ? 'EXPIRING' : 'EXPIRED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Add new batch */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700" style={{ fontSize: 13 }}>Add New Batch</span>
                </div>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4">
                  <div>
                    <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Batch Number</label>
                    <input
                      value={newBatch.number}
                      onChange={e => setNewBatch(p => ({ ...p, number: e.target.value }))}
                      placeholder="BT-2026-XXX-001"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Quantity</label>
                    <input
                      value={newBatch.qty}
                      onChange={e => setNewBatch(p => ({ ...p, qty: e.target.value }))}
                      placeholder="e.g. 200"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Expiry Date</label>
                    <input
                      value={newBatch.expiry}
                      onChange={e => setNewBatch(p => ({ ...p, expiry: e.target.value }))}
                      placeholder="e.g. Dec 2027"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Supplier</label>
                    <input
                      value={newBatch.supplier}
                      onChange={e => setNewBatch(p => ({ ...p, supplier: e.target.value }))}
                      placeholder="Supplier name"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                </div>
                <button
                  className="mt-3 w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                  onClick={() => setNewBatch({ number: '', qty: '', expiry: '', supplier: '' })}
                >
                  Add Batch to Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order From Supplier Modal */}
      {orderModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17 }}>
                  Order From Supplier
                </h3>
                <div className="text-slate-400 text-xs mt-0.5">
                  {orderModal.item.genericName} {orderModal.item.strength} · {orderModal.item.brandName}
                </div>
              </div>
              <button
                onClick={() => setOrderModal({ item: null })}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderSent ? (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="font-bold text-emerald-700 text-lg mb-1">Order Request Sent</div>
                <div className="text-slate-400 text-sm">
                  Order submitted to supplier for {orderModal.item.genericName} {orderModal.item.strength}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Current stock info */}
                <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="font-bold font-mono text-slate-800" style={{ fontSize: 18 }}>{orderModal.item.stockQty}</div>
                    <div className="text-slate-400 text-xs mt-0.5">Current Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold font-mono text-amber-600" style={{ fontSize: 18 }}>{orderModal.item.reorderLevel}</div>
                    <div className="text-slate-400 text-xs mt-0.5">Reorder Level</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold font-mono text-slate-600" style={{ fontSize: 18 }}>{orderModal.item.batches.length}</div>
                    <div className="text-slate-400 text-xs mt-0.5">Active Batches</div>
                  </div>
                </div>

                {/* Order quantity */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2" style={{ fontSize: 13 }}>
                    Order Quantity ({orderModal.item.unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-lg font-bold"
                      onClick={() => setOrderQty(q => String(Math.max(50, parseInt(q || '0') - 50)))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={orderQty}
                      onChange={e => setOrderQty(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:border-emerald-400"
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 16 }}
                    />
                    <button
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-lg font-bold"
                      onClick={() => setOrderQty(q => String(parseInt(q || '0') + 50))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2" style={{ fontSize: 13 }}>Order Urgency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['standard', 'express', 'emergency'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setOrderUrgency(u)}
                        className="rounded-xl py-2.5 text-center font-semibold border-2 transition-all"
                        style={{
                          fontSize: 12,
                          borderColor: orderUrgency === u ? (u === 'emergency' ? '#EF4444' : u === 'express' ? '#F59E0B' : '#059669') : '#E2E8F0',
                          background: orderUrgency === u ? (u === 'emergency' ? '#FEF2F2' : u === 'express' ? '#FFFBEB' : '#ECFDF5') : 'white',
                          color: orderUrgency === u ? (u === 'emergency' ? '#B91C1C' : u === 'express' ? '#B45309' : '#065F46') : '#64748B',
                        }}
                      >
                        {u === 'standard' ? '📦 Standard' : u === 'express' ? '⚡ Express' : '🚨 Emergency'}
                        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2 }}>
                          {u === 'standard' ? '3–5 days' : u === 'express' ? '24–48h' : 'Same day'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2" style={{ fontSize: 13 }}>Notes (optional)</label>
                  <textarea
                    placeholder="Additional instructions for supplier..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 resize-none"
                    rows={2}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setOrderModal({ item: null })}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendOrder}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Send Order Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyInventory;
