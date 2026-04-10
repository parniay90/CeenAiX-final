/*
  # Inventory Management Schema

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `pharmacy_id` (uuid, references pharmacies)
      - `drug_name` (text) - Brand/trade name
      - `generic_name` (text) - Generic name
      - `strength` (text) - e.g., 500mg
      - `form` (enum) - tablet, capsule, syrup, injection, cream, inhaler, drops, patch
      - `sku` (text, unique) - Stock keeping unit
      - `barcode` (text) - Product barcode
      - `current_stock` (integer) - Current quantity in stock
      - `reorder_point` (integer) - Minimum stock before reorder
      - `expiry_date` (date) - Batch expiry date
      - `supplier_id` (uuid, references suppliers)
      - `cost_price` (decimal) - Unit cost price
      - `retail_price` (decimal) - Unit retail price
      - `on_dha_formulary` (boolean) - DHA formulary status
      - `is_controlled_substance` (boolean) - Controlled substance flag
      - `category` (enum) - Drug category
      - `batch_number` (text) - Current batch number
      - `last_restocked` (timestamptz) - Last restock date
      - `average_dispense_rate` (decimal) - Average daily dispense
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text) - Supplier name
      - `contact_person` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `trade_license` (text) - UAE trade license
      - `payment_terms` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)

    - `purchase_orders`
      - `id` (uuid, primary key)
      - `pharmacy_id` (uuid, references pharmacies)
      - `supplier_id` (uuid, references suppliers)
      - `order_number` (text, unique) - PO number
      - `status` (enum) - pending, approved, shipped, received, cancelled
      - `total_amount` (decimal)
      - `expected_delivery_date` (date)
      - `ordered_by` (uuid, references pharmacists)
      - `ordered_at` (timestamptz)
      - `received_at` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `purchase_order_items`
      - `id` (uuid, primary key)
      - `purchase_order_id` (uuid, references purchase_orders)
      - `inventory_item_id` (uuid, references inventory_items)
      - `quantity_ordered` (integer)
      - `quantity_received` (integer)
      - `unit_cost` (decimal)
      - `total_cost` (decimal)
      - `created_at` (timestamptz)

    - `stock_movements`
      - `id` (uuid, primary key)
      - `inventory_item_id` (uuid, references inventory_items)
      - `movement_type` (enum) - restock, dispense, write_off, transfer, return, adjustment
      - `quantity` (integer) - Can be negative for reductions
      - `stock_before` (integer)
      - `stock_after` (integer)
      - `reference_id` (uuid) - ID of related record (PO, dispensing, etc.)
      - `reference_type` (text) - Type of reference
      - `performed_by` (uuid, references auth.users)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `write_off_records`
      - `id` (uuid, primary key)
      - `inventory_item_id` (uuid, references inventory_items)
      - `quantity` (integer)
      - `reason` (text)
      - `dha_form_number` (text) - DHA waste disposal form
      - `cost_value` (decimal) - Total cost value written off
      - `approved_by` (uuid, references pharmacists)
      - `written_off_at` (timestamptz)
      - `created_at` (timestamptz)

    - `stock_transfers`
      - `id` (uuid, primary key)
      - `inventory_item_id` (uuid, references inventory_items)
      - `from_pharmacy_id` (uuid, references pharmacies)
      - `to_pharmacy_id` (uuid, references pharmacies)
      - `quantity` (integer)
      - `status` (enum) - pending, in_transit, completed, cancelled
      - `initiated_by` (uuid, references pharmacists)
      - `received_by` (uuid, references pharmacists)
      - `initiated_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

    - `supplier_returns`
      - `id` (uuid, primary key)
      - `inventory_item_id` (uuid, references inventory_items)
      - `supplier_id` (uuid, references suppliers)
      - `quantity` (integer)
      - `reason` (text)
      - `batch_number` (text)
      - `expiry_date` (date)
      - `status` (enum) - requested, approved, shipped, completed
      - `requested_by` (uuid, references pharmacists)
      - `requested_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Pharmacists can access records for their pharmacy only
    - Stock movements are audit-logged and immutable
    - Write-offs require DHA form number for compliance
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE drug_form AS ENUM ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'inhaler', 'drops', 'patch');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE drug_category AS ENUM ('antibiotics', 'antidiabetics', 'antihypertensives', 'analgesics', 'antihistamines', 'cardiovascular', 'respiratory', 'gastrointestinal', 'vitamins', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE po_status AS ENUM ('pending', 'approved', 'shipped', 'received', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE movement_type AS ENUM ('restock', 'dispense', 'write_off', 'transfer', 'return', 'adjustment');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transfer_status AS ENUM ('pending', 'in_transit', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE return_status AS ENUM ('requested', 'approved', 'shipped', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text,
  phone text NOT NULL,
  email text,
  address text,
  trade_license text,
  payment_terms text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (active = true);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  drug_name text NOT NULL,
  generic_name text NOT NULL,
  strength text NOT NULL,
  form drug_form NOT NULL,
  sku text UNIQUE NOT NULL,
  barcode text,
  current_stock integer DEFAULT 0,
  reorder_point integer DEFAULT 0,
  expiry_date date NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  cost_price decimal(10,2) NOT NULL,
  retail_price decimal(10,2) NOT NULL,
  on_dha_formulary boolean DEFAULT false,
  is_controlled_substance boolean DEFAULT false,
  category drug_category DEFAULT 'other',
  batch_number text,
  last_restocked timestamptz,
  average_dispense_rate decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view pharmacy inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.pharmacy_id = inventory_items.pharmacy_id
      AND pharmacists.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can manage pharmacy inventory"
  ON inventory_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.pharmacy_id = inventory_items.pharmacy_id
      AND pharmacists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.pharmacy_id = inventory_items.pharmacy_id
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Purchase orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) NOT NULL,
  order_number text UNIQUE NOT NULL,
  status po_status DEFAULT 'pending',
  total_amount decimal(10,2) DEFAULT 0,
  expected_delivery_date date,
  ordered_by uuid REFERENCES pharmacists(id) NOT NULL,
  ordered_at timestamptz DEFAULT now(),
  received_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view pharmacy purchase orders"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.pharmacy_id = purchase_orders.pharmacy_id
      AND pharmacists.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create purchase orders"
  ON purchase_orders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = purchase_orders.ordered_by
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Purchase order items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid REFERENCES purchase_orders(id) NOT NULL,
  inventory_item_id uuid REFERENCES inventory_items(id) NOT NULL,
  quantity_ordered integer NOT NULL,
  quantity_received integer DEFAULT 0,
  unit_cost decimal(10,2) NOT NULL,
  total_cost decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view purchase order items"
  ON purchase_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po
      JOIN pharmacists ph ON ph.pharmacy_id = po.pharmacy_id
      WHERE po.id = purchase_order_items.purchase_order_id
      AND ph.user_id = auth.uid()
    )
  );

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid REFERENCES inventory_items(id) NOT NULL,
  movement_type movement_type NOT NULL,
  quantity integer NOT NULL,
  stock_before integer NOT NULL,
  stock_after integer NOT NULL,
  reference_id uuid,
  reference_type text,
  performed_by uuid REFERENCES auth.users(id) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view stock movements"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventory_items ii
      JOIN pharmacists ph ON ph.pharmacy_id = ii.pharmacy_id
      WHERE ii.id = stock_movements.inventory_item_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create stock movements"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (performed_by = auth.uid());

-- Write-off records table
CREATE TABLE IF NOT EXISTS write_off_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid REFERENCES inventory_items(id) NOT NULL,
  quantity integer NOT NULL,
  reason text NOT NULL,
  dha_form_number text NOT NULL,
  cost_value decimal(10,2) NOT NULL,
  approved_by uuid REFERENCES pharmacists(id) NOT NULL,
  written_off_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE write_off_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view write-off records"
  ON write_off_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventory_items ii
      JOIN pharmacists ph ON ph.pharmacy_id = ii.pharmacy_id
      WHERE ii.id = write_off_records.inventory_item_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create write-off records"
  ON write_off_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = write_off_records.approved_by
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Stock transfers table
CREATE TABLE IF NOT EXISTS stock_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid REFERENCES inventory_items(id) NOT NULL,
  from_pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  to_pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  quantity integer NOT NULL,
  status transfer_status DEFAULT 'pending',
  initiated_by uuid REFERENCES pharmacists(id) NOT NULL,
  received_by uuid REFERENCES pharmacists(id),
  initiated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view relevant stock transfers"
  ON stock_transfers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE (pharmacists.pharmacy_id = stock_transfers.from_pharmacy_id
        OR pharmacists.pharmacy_id = stock_transfers.to_pharmacy_id)
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Supplier returns table
CREATE TABLE IF NOT EXISTS supplier_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid REFERENCES inventory_items(id) NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) NOT NULL,
  quantity integer NOT NULL,
  reason text NOT NULL,
  batch_number text,
  expiry_date date,
  status return_status DEFAULT 'requested',
  requested_by uuid REFERENCES pharmacists(id) NOT NULL,
  requested_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view supplier returns"
  ON supplier_returns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventory_items ii
      JOIN pharmacists ph ON ph.pharmacy_id = ii.pharmacy_id
      WHERE ii.id = supplier_returns.inventory_item_id
      AND ph.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_pharmacy_id ON inventory_items(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiry_date ON inventory_items(expiry_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_pharmacy_id ON purchase_orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_stock_movements_inventory_item_id ON stock_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_write_off_records_inventory_item_id ON write_off_records(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_from_pharmacy ON stock_transfers(from_pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_to_pharmacy ON stock_transfers(to_pharmacy_id);
