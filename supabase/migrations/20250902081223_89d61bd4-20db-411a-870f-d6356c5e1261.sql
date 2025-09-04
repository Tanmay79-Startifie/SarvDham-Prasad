-- Create locations (categories) table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create temples (subcategories) table
CREATE TABLE public.temples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create product types enum
CREATE TYPE product_type AS ENUM ('prasad', 'spiritual_products');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  type product_type NOT NULL DEFAULT 'prasad',
  weights JSONB DEFAULT '["0.5", "1", "2"]', -- Available weights in kg
  base_price INTEGER NOT NULL, -- Price in paise (for 0.5kg)
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  weight TEXT NOT NULL, -- Selected weight
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL, -- Total price in paise
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  order_status TEXT DEFAULT 'received', -- received, processing, shipped, delivered
  payment_id TEXT,
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required)
CREATE POLICY "locations_public_read" ON public.locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "temples_public_read" ON public.temples
  FOR SELECT USING (is_active = true);

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (is_active = true);

-- Create policies for admin access (will be implemented later)
CREATE POLICY "locations_admin_all" ON public.locations
  FOR ALL USING (true);

CREATE POLICY "temples_admin_all" ON public.temples
  FOR ALL USING (true);

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (true);

CREATE POLICY "orders_admin_all" ON public.orders
  FOR ALL USING (true);

-- Create policy for order insertion (public can create orders)
CREATE POLICY "orders_public_insert" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_temples_location_id ON public.temples(location_id);
CREATE INDEX idx_products_temple_id ON public.products(temple_id);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_orders_product_id ON public.orders(product_id);
CREATE INDEX idx_orders_date ON public.orders(order_date);
CREATE INDEX idx_orders_status ON public.orders(order_status);

-- Insert sample data
INSERT INTO public.locations (name, description, display_order) VALUES
('Mathura', 'The birthplace of Lord Krishna', 1),
('Vrindavan', 'The playground of Lord Krishna', 2),
('Barsana', 'The birthplace of Radha Rani', 3),
('Gokul', 'Where Lord Krishna spent his childhood', 4);

INSERT INTO public.temples (location_id, name, description, display_order) VALUES
((SELECT id FROM public.locations WHERE name = 'Mathura'), 'Krishna Janmabhoomi', 'The sacred birthplace temple of Lord Krishna', 1),
((SELECT id FROM public.locations WHERE name = 'Mathura'), 'Dwarkadhish Temple', 'Famous temple dedicated to Lord Krishna', 2),
((SELECT id FROM public.locations WHERE name = 'Vrindavan'), 'Banke Bihari Temple', 'Most popular temple in Vrindavan', 1),
((SELECT id FROM public.locations WHERE name = 'Vrindavan'), 'ISKCON Temple', 'International temple complex', 2),
((SELECT id FROM public.locations WHERE name = 'Barsana'), 'Radha Rani Temple', 'Main temple of Radha Rani', 1),
((SELECT id FROM public.locations WHERE name = 'Gokul'), 'Gokulnath Temple', 'Ancient temple in Gokul', 1);

-- Insert sample prasad products
INSERT INTO public.products (temple_id, name, description, type, base_price, is_featured) VALUES
((SELECT id FROM public.temples WHERE name = 'Krishna Janmabhoomi'), 'Makhan Mishri Prasad', 'Sacred butter and sugar crystal prasad from Krishna Janmabhoomi', 'prasad', 30000, true),
((SELECT id FROM public.temples WHERE name = 'Banke Bihari Temple'), 'Panchamrit Prasad', 'Divine five-nectar prasad from Banke Bihari', 'prasad', 25000, true),
((SELECT id FROM public.temples WHERE name = 'Radha Rani Temple'), 'Gulal Prasad', 'Sacred colored powder prasad from Radha Rani Temple', 'prasad', 20000, false),
((SELECT id FROM public.temples WHERE name = 'ISKCON Temple'), 'Laddu Prasad', 'Sweet laddu prasad from ISKCON Temple', 'prasad', 35000, true);