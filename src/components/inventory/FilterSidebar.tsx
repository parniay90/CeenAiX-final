import { Search, Lock } from 'lucide-react';
import { InventoryFilters, DRUG_CATEGORIES, STOCK_STATUSES } from '../../types/inventory';

interface FilterSidebarProps {
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  suppliers: string[];
}

export default function FilterSidebar({ filters, onFiltersChange, suppliers }: FilterSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">Filters</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
            Search Drug or Barcode
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Name or scan barcode..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {DRUG_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
            Stock Status
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => onFiltersChange({ ...filters, stockStatus: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {STOCK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg cursor-pointer hover:bg-violet-100 transition-colors">
            <input
              type="checkbox"
              checked={filters.controlledSubstance === true}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  controlledSubstance: e.target.checked ? true : null,
                })
              }
              className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
            />
            <Lock className="w-4 h-4 text-violet-700" />
            <span className="text-sm font-semibold text-violet-900">Controlled Substances Only</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
            Supplier
          </label>
          <select
            value={filters.supplier}
            onChange={(e) => onFiltersChange({ ...filters, supplier: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
            DHA Formulary
          </label>
          <select
            value={filters.formulary}
            onChange={(e) => onFiltersChange({ ...filters, formulary: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Both</option>
            <option value="dha">DHA Formulary Only</option>
            <option value="non_dha">Non-Formulary Only</option>
          </select>
        </div>

        <button
          onClick={() =>
            onFiltersChange({
              search: '',
              category: 'all',
              stockStatus: 'all',
              controlledSubstance: null,
              supplier: 'all',
              formulary: 'all',
            })
          }
          className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
