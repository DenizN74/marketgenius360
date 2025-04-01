/*
  # Create payment tables

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `store_id` (uuid, references stores)
      - `transaction_id` (uuid, references transactions)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `payment_method` (text)
      - `payment_intent_id` (text)
      - `error_message` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `refunds`
      - `id` (uuid, primary key)
      - `payment_id` (uuid, references payments)
      - `amount` (numeric)
      - `reason` (text)
      - `status` (text)
      - `refund_id` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for store owners to manage their payments
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  transaction_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method text NOT NULL,
  payment_intent_id text UNIQUE,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  reason text,
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
  refund_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_store_id ON payments(store_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Store owners can manage their payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores s
      WHERE s.id = payments.store_id
      AND s.user_id = auth.uid()
    )
  );

-- Create policies for refunds
CREATE POLICY "Store owners can manage their refunds"
  ON refunds
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM payments p
      JOIN stores s ON s.id = p.store_id
      WHERE p.id = refunds.payment_id
      AND s.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();