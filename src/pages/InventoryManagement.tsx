import { useState } from 'react';
import {
  Plus,
  Upload,
  Download,
  Printer,
  RotateCcw,
  BarChart3,
  Clock,
  Package,
} from 'lucide-react';
import FilterSidebar from '../components/inventory/FilterSidebar';
import StatsRow from '../components/inventory/StatsRow';
import InventoryTable from '../components/inventory/InventoryTable';
import ReorderDrawer from '../components/inventory/ReorderDrawer';
import ExpiryManagement from '../components/inventory/ExpiryManagement';
import AnalyticsDashboard from '../components/inventory/AnalyticsDashboard';
import {
  MOCK_INVENTORY,
  MOCK_STATS,
  InventoryFilters,
  InventoryItem,
  ReorderRequest,
  ExpiryItem,
} from '../types/inventory';
import { differenceInDays } from 'date-fns';

type TabType = 'inventory' | 'expiry' | 'analytics';

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: 'all',
    stockStatus: 'all',
    controlledSubstance: null,
    supplier: 'all',
    formulary: 'all',
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [reconciliationMode, setReconciliationMode] = useState(false);
  const [selectedItemForReorder, setSelectedItemForReorder] = useState<InventoryItem | null>(null);

  const suppliers = Array.from(new Set(MOCK_INVENTORY.map((item) => item.supplier)));

  const filteredInventory = inventory.filter((item) => {
    if (filters.search && !item.drugName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.barcode.includes(filters.search)) {
      return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.stockStatus !== 'all' && item.stockStatus !== filters.stockStatus) {
      return false;
    }
    if (filters.controlledSubstance === true && !item.isControlledSubstance) {
      return false;
    }
    if (filters.supplier !== 'all' && item.supplier !== filters.supplier) {
      return false;
    }
    if (filters.formulary === 'dha' && !item.onDHAFormulary) {
      return false;
    }
    if (filters.formulary === 'non_dha' && item.onDHAFormulary) {
      return false;
    }
    return true;
  });

  const expiryItems: ExpiryItem[] = inventory
    .filter((item) => {
      const daysUntilExpiry = differenceInDays(item.expiryDate, new Date());
      return daysUntilExpiry <= 60;
    })
    .map((item) => ({
      id: item.id,
      drugName: item.drugName,
      strength: item.strength,
      form: item.form,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      currentStock: item.currentStock,
      costValue: item.currentStock * item.costPrice,
      daysUntilExpiry: differenceInDays(item.expiryDate, new Date()),
    }))
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const handleUpdateReorderPoint = (id: string, value: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reorderPoint: value } : item))
    );
  };

  const handleUpdateRetailPrice = (id: string, value: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, retailPrice: value } : item))
    );
  };

  const handleReorder = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setSelectedItemForReorder(item);
    }
  };

  const handleSubmitReorder = (request: ReorderRequest) => {
    console.log('Reorder request submitted:', request);
  };

  const handleEdit = (id: string) => {
    console.log('Edit item:', id);
  };

  const handleViewHistory = (id: string) => {
    console.log('View history:', id);
  };

  const handleWriteOff = (id: string) => {
    console.log('Write off:', id);
  };

  const handleMarkReturn = (id: string) => {
    console.log('Mark for return:', id);
  };

  const handleExpiryWriteOff = (id: string, dhaFormNumber: string) => {
    console.log('Expiry write off:', id, dhaFormNumber);
  };

  const handleTransfer = (id: string, destinationPharmacy: string) => {
    console.log('Transfer to:', destinationPharmacy);
  };

  const topDispensed = [
    { name: 'Paracetamol 500mg', quantity: 3420, change: 12 },
    { name: 'Metformin 500mg', quantity: 2850, change: 8 },
    { name: 'Amoxicillin 500mg', quantity: 2380, change: -5 },
    { name: 'Atorvastatin 20mg', quantity: 1950, change: 15 },
    { name: 'Omeprazole 20mg', quantity: 1720, change: 3 },
  ];

  const slowMoving = [
    {
      drugName: 'Vitamin B Complex',
      strength: '100mg',
      currentStock: 450,
      daysNoDispense: 87,
      costValue: 225.0,
    },
    {
      drugName: 'Antibiotic Cream',
      strength: '2%',
      currentStock: 120,
      daysNoDispense: 73,
      costValue: 360.0,
    },
    {
      drugName: 'Cough Syrup',
      strength: '100ml',
      currentStock: 95,
      daysNoDispense: 68,
      costValue: 475.0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <FilterSidebar filters={filters} onFiltersChange={setFilters} suppliers={suppliers} />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Inventory Management</h1>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('expiry')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'expiry'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Expiry Management
              {expiryItems.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-xs">
                  {expiryItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Drug
              </button>
              <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
              <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Bulk Reorder
              </button>
              <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <label className="ml-auto flex items-center gap-2 px-3 py-2 bg-violet-100 border border-violet-300 rounded-lg cursor-pointer hover:bg-violet-200 transition-colors">
                <input
                  type="checkbox"
                  checked={reconciliationMode}
                  onChange={(e) => setReconciliationMode(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-sm font-semibold text-violet-900">Reconciliation Mode</span>
              </label>
            </div>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'inventory' && (
            <>
              <StatsRow stats={MOCK_STATS} />
              <InventoryTable
                items={filteredInventory}
                onEdit={handleEdit}
                onReorder={handleReorder}
                onViewHistory={handleViewHistory}
                onWriteOff={handleWriteOff}
                onUpdateReorderPoint={handleUpdateReorderPoint}
                onUpdateRetailPrice={handleUpdateRetailPrice}
              />
            </>
          )}

          {activeTab === 'expiry' && (
            <ExpiryManagement
              items={expiryItems}
              onMarkReturn={handleMarkReturn}
              onWriteOff={handleExpiryWriteOff}
              onTransfer={handleTransfer}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard topDispensed={topDispensed} slowMoving={slowMoving} />
          )}
        </div>
      </div>

      <ReorderDrawer
        isOpen={selectedItemForReorder !== null}
        item={selectedItemForReorder}
        onClose={() => setSelectedItemForReorder(null)}
        onSubmit={handleSubmitReorder}
      />
    </div>
  );
}
