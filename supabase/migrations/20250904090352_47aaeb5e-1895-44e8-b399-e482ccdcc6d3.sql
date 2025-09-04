-- Create enum types for better data integrity
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'rider');
CREATE TYPE public.order_status AS ENUM ('CREATED', 'PAID', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE public.payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE public.payment_gateway AS ENUM ('stripe', 'razorpay', 'paypal');

-- User profiles table with addresses and roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  addresses JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories table for better organization
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,4) DEFAULT 0.0000,
ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

-- Enhanced orders table with complete order management
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS order_status order_status DEFAULT 'CREATED',
ADD COLUMN IF NOT EXISTS tax_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tip_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rider_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS tracking_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS delivery_address_json JSONB;

-- Order items table for detailed order tracking
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  weight TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table for payment tracking
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  gateway payment_gateway NOT NULL,
  gateway_payment_id TEXT NOT NULL,
  gateway_customer_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method_details JSONB,
  receipt_url TEXT,
  refund_reason TEXT,
  gateway_fee_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refunds table for refund tracking
CREATE TABLE public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  amount_cents INTEGER NOT NULL,
  reason TEXT,
  gateway_refund_id TEXT,
  status TEXT DEFAULT 'pending',
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications table for email/SMS tracking
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  order_id UUID REFERENCES public.orders(id),
  type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs for security and compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API keys table for external integrations
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- Create security definer function for user existence check
CREATE OR REPLACE FUNCTION public.user_exists(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_uuid AND is_active = true);
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
USING (
  EXISTS(
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins and riders can view all order items"
ON public.order_items FOR SELECT
USING (public.get_user_role(auth.uid()) IN ('admin', 'rider'));

CREATE POLICY "System can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- RLS Policies for payments
CREATE POLICY "Users can view their payments"
ON public.payments FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can manage payments"
ON public.payments FOR ALL
WITH CHECK (true);

-- RLS Policies for refunds
CREATE POLICY "Users can view their refunds"
ON public.refunds FOR SELECT
USING (
  EXISTS(
    SELECT 1 FROM public.orders 
    WHERE orders.id = refunds.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage refunds"
ON public.refunds FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage notifications"
ON public.notifications FOR ALL
WITH CHECK (true);

-- RLS Policies for audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- RLS Policies for API keys
CREATE POLICY "Admins can manage API keys"
ON public.api_keys FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON public.payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) VALUES
('Prasad', 'Sacred food offerings from temples', 1),
('Spiritual Items', 'Religious and spiritual products', 2),
('Puja Items', 'Items for worship and ceremonies', 3)
ON CONFLICT DO NOTHING;

-- Update existing products to have category_id
UPDATE public.products SET 
  category_id = (SELECT id FROM public.categories WHERE name = 'Prasad' LIMIT 1),
  sku = CONCAT('PROD-', SUBSTRING(id::TEXT, 1, 8)),
  currency = 'INR',
  stock_quantity = 100
WHERE category_id IS NULL;