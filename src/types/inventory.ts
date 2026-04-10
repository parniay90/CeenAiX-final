export type StockStatus = 'in_stock' | 'low' | 'critical' | 'out_of_stock' | 'expired' | 'expiring_soon';
export type DrugForm = 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'inhaler' | 'drops' | 'patch';
export type DrugCategory = 'antibiotics' | 'antidiabetics' | 'antihypertensives' | 'analgesics' | 'antihistamines' | 'cardiovascular' | 'respiratory' | 'gastrointestinal' | 'vitamins' | 'other';

export interface InventoryItem {
  id: string;
  drugName: string;
  genericName: string;
  strength: string;
  form: DrugForm;
  sku: string;
  barcode: string;
  currentStock: number;
  reorderPoint: number;
  expiryDate: Date;
  supplier: string;
  supplierContact: string;
  costPrice: number;
  retailPrice: number;
  onDHAFormulary: boolean;
  isControlledSubstance: boolean;
  category: DrugCategory;
  stockStatus: StockStatus;
  batchNumber: string;
  lastRestocked: Date;
  averageDispenseRate: number;
}

export interface InventoryFilters {
  search: string;
  category: DrugCategory | 'all';
  stockStatus: StockStatus | 'all';
  controlledSubstance: boolean | null;
  supplier: string | 'all';
  formulary: 'dha' | 'non_dha' | 'all';
}

export interface InventoryStats {
  totalSKUs: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  expiringIn30Days: number;
}

export interface ReorderRequest {
  drugId: string;
  drugName: string;
  currentStock: number;
  reorderQuantity: number;
  supplier: string;
  supplierContact: string;
  expectedDeliveryDate: Date;
  estimatedCost: number;
}

export interface ExpiryItem {
  id: string;
  drugName: string;
  strength: string;
  form: DrugForm;
  batchNumber: string;
  expiryDate: Date;
  currentStock: number;
  costValue: number;
  daysUntilExpiry: number;
  action?: 'return' | 'write_off' | 'transfer';
}

export interface WriteOffRecord {
  id: string;
  drugId: string;
  drugName: string;
  quantity: number;
  reason: string;
  dhaFormNumber: string;
  approvedBy: string;
  writtenOffAt: Date;
}

export interface StockHistory {
  id: string;
  drugId: string;
  action: 'restock' | 'dispense' | 'write_off' | 'transfer' | 'return';
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    drugName: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    strength: '500mg',
    form: 'tablet',
    sku: 'MET-500-TAB',
    barcode: '6281234567890',
    currentStock: 850,
    reorderPoint: 200,
    expiryDate: new Date('2026-08-15'),
    supplier: 'Julphar Pharmaceuticals',
    supplierContact: '+971 4 234 5678',
    costPrice: 0.35,
    retailPrice: 0.75,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'antidiabetics',
    stockStatus: 'in_stock',
    batchNumber: 'BTH-MET-2024-089',
    lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 45,
  },
  {
    id: 'inv-002',
    drugName: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    strength: '20mg',
    form: 'tablet',
    sku: 'ATO-20-TAB',
    barcode: '6281234567901',
    currentStock: 35,
    reorderPoint: 150,
    expiryDate: new Date('2025-11-20'),
    supplier: 'Spimaco',
    supplierContact: '+971 4 345 6789',
    costPrice: 0.65,
    retailPrice: 1.50,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'cardiovascular',
    stockStatus: 'low',
    batchNumber: 'BTH-ATO-2024-156',
    lastRestocked: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 28,
  },
  {
    id: 'inv-003',
    drugName: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    strength: '500mg',
    form: 'capsule',
    sku: 'AMX-500-CAP',
    barcode: '6281234567912',
    currentStock: 0,
    reorderPoint: 300,
    expiryDate: new Date('2026-03-10'),
    supplier: 'GlaxoSmithKline',
    supplierContact: '+971 4 456 7890',
    costPrice: 0.45,
    retailPrice: 1.20,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'antibiotics',
    stockStatus: 'out_of_stock',
    batchNumber: 'BTH-AMX-2024-203',
    lastRestocked: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 65,
  },
  {
    id: 'inv-004',
    drugName: 'Tramadol',
    genericName: 'Tramadol Hydrochloride',
    strength: '50mg',
    form: 'tablet',
    sku: 'TRA-50-TAB',
    barcode: '6281234567923',
    currentStock: 125,
    reorderPoint: 50,
    expiryDate: new Date('2026-12-05'),
    supplier: 'Pharma International',
    supplierContact: '+971 4 567 8901',
    costPrice: 1.20,
    retailPrice: 2.50,
    onDHAFormulary: true,
    isControlledSubstance: true,
    category: 'analgesics',
    stockStatus: 'in_stock',
    batchNumber: 'BTH-TRA-2024-087',
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 12,
  },
  {
    id: 'inv-005',
    drugName: 'Ventolin Inhaler',
    genericName: 'Salbutamol',
    strength: '100mcg',
    form: 'inhaler',
    sku: 'VEN-100-INH',
    barcode: '6281234567934',
    currentStock: 180,
    reorderPoint: 80,
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    supplier: 'GlaxoSmithKline',
    supplierContact: '+971 4 456 7890',
    costPrice: 15.50,
    retailPrice: 32.00,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'respiratory',
    stockStatus: 'expiring_soon',
    batchNumber: 'BTH-VEN-2023-412',
    lastRestocked: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 8,
  },
  {
    id: 'inv-006',
    drugName: 'Paracetamol',
    genericName: 'Acetaminophen',
    strength: '500mg',
    form: 'tablet',
    sku: 'PAR-500-TAB',
    barcode: '6281234567945',
    currentStock: 1500,
    reorderPoint: 400,
    expiryDate: new Date('2027-06-30'),
    supplier: 'Julphar Pharmaceuticals',
    supplierContact: '+971 4 234 5678',
    costPrice: 0.15,
    retailPrice: 0.40,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'analgesics',
    stockStatus: 'in_stock',
    batchNumber: 'BTH-PAR-2024-534',
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 120,
  },
  {
    id: 'inv-007',
    drugName: 'Omeprazole',
    genericName: 'Omeprazole Magnesium',
    strength: '20mg',
    form: 'capsule',
    sku: 'OME-20-CAP',
    barcode: '6281234567956',
    currentStock: 15,
    reorderPoint: 100,
    expiryDate: new Date('2025-09-15'),
    supplier: 'Spimaco',
    supplierContact: '+971 4 345 6789',
    costPrice: 0.55,
    retailPrice: 1.30,
    onDHAFormulary: true,
    isControlledSubstance: false,
    category: 'gastrointestinal',
    stockStatus: 'critical',
    batchNumber: 'BTH-OME-2024-178',
    lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    averageDispenseRate: 22,
  },
];

export const MOCK_STATS: InventoryStats = {
  totalSKUs: 1247,
  inStock: 1180,
  lowStock: 45,
  outOfStock: 12,
  expiringIn30Days: 23,
};

export const DRUG_CATEGORIES: { value: DrugCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'antibiotics', label: 'Antibiotics' },
  { value: 'antidiabetics', label: 'Antidiabetics' },
  { value: 'antihypertensives', label: 'Antihypertensives' },
  { value: 'analgesics', label: 'Analgesics' },
  { value: 'antihistamines', label: 'Antihistamines' },
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'gastrointestinal', label: 'Gastrointestinal' },
  { value: 'vitamins', label: 'Vitamins & Supplements' },
  { value: 'other', label: 'Other' },
];

export const STOCK_STATUSES: { value: StockStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Stock Levels' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'critical', label: 'Critical' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'expired', label: 'Expired' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
];
