/*
  # Create financial analytics tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `store_id` (uuid, references stores)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_amount` (numeric)
      - `transaction_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `financial_metrics`
      - `id` (uuid, primary key)
      - `store_id` (uuid, references stores)
      - `date` (date)
      - `total_sales` (numeric)
      - `total_orders` (integer)
      - `average_order_value` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for store owners to manage their data
    - Add policies for authenticated users to read their own data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  transaction_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create financial_metrics table
CREATE TABLE IF NOT EXISTS financial_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  total_sales numeric(10,2) NOT NULL DEFAULT 0,
  total_orders integer NOT NULL DEFAULT 0,
  average_order_value numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_store_id ON transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_metrics_store_date ON financial_metrics(store_id, date);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Store owners can manage their transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores s
      WHERE s.id = transactions.store_id
      AND s.user_id = auth.uid()
    )
  );

-- Create policies for financial_metrics
CREATE POLICY "Store owners can manage their metrics"
  ON financial_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores s
      WHERE s.id = financial_metrics.store_id
      AND s.user_id = auth.uid()
    )
  );

-- Create function to update financial metrics
CREATE OR REPLACE FUNCTION update_financial_metrics()
RETURNS trigger AS $$
BEGIN
  -- Update or insert financial metrics for the day
  INSERT INTO financial_metrics (
    store_id,
    date,
    total_sales,
    total_orders,
    average_order_value
  )
  SELECT
    store_id,
    date_trunc('day', transaction_date)::date as date,
    SUM(total_amount) as total_sales,
    COUNT(DISTINCT id) as total_orders,
    SUM(total_amount) / COUNT(DISTINCT id) as average_order_value
  FROM transactions
  WHERE store_id = NEW.store_id
    AND date_trunc('day', transaction_date) = date_trunc('day', NEW.transaction_date)
  GROUP BY store_id, date_trunc('day', transaction_date)::date
  ON CONFLICT (store_id, date)
  DO UPDATE SET
    total_sales = EXCLUDED.total_sales,
    total_orders = EXCLUDED.total_orders,
    average_order_value = EXCLUDED.average_order_value;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating metrics
CREATE TRIGGER update_financial_metrics_trigger
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_financial_metrics();