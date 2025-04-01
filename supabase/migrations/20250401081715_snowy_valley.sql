/*
  # Create products table and related security policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `name` (text)
      - `sku` (text, unique)
      - `price` (decimal)
      - `stock` (integer)
      - `category` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Primary key on id
    - Index on store_id for faster joins
    - Index on sku for unique constraint and lookups
    - Index on category for filtering

  3. Security
    - Enable RLS
    - Add policies for store owners to manage their products
    - Add policies for authenticated users to view products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(store_id, sku)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create update trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Store owners can manage their products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores s
      WHERE s.id = products.store_id
      AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores s
      WHERE s.id = products.store_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can view products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);