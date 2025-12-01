-- Stylify MVP - Initial Database Schema
-- Phase 2: Authentication & Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'tailor', 'admin');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'in_progress', 'completed', 'cancelled');

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extended user profiles with role information
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TAILOR PROFILES TABLE
-- ============================================================================
-- Tailor-specific information and portfolio
CREATE TABLE tailor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    years_experience INTEGER DEFAULT 0,
    portfolio_images TEXT[] DEFAULT '{}',
    location TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Enable RLS
ALTER TABLE tailor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tailor_profiles
CREATE POLICY "Tailor profiles are viewable by everyone"
    ON tailor_profiles FOR SELECT
    USING (true);

CREATE POLICY "Tailors can update own profile"
    ON tailor_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Tailors can insert own profile"
    ON tailor_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- CUSTOMER PROFILES TABLE
-- ============================================================================
-- Customer-specific information and measurements
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    measurements JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_profiles
CREATE POLICY "Customers can view own profile"
    ON customer_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can update own profile"
    ON customer_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own profile"
    ON customer_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
-- Order tracking and management
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tailor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status order_status DEFAULT 'draft',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Tailors can view assigned orders"
    ON orders FOR SELECT
    USING (auth.uid() = tailor_id);

CREATE POLICY "Customers can create orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = customer_id);

CREATE POLICY "Tailors can update assigned orders"
    ON orders FOR UPDATE
    USING (auth.uid() = tailor_id);

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================
-- Individual items within orders
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    garment_type TEXT NOT NULL,
    fabric_type TEXT,
    measurements JSONB,
    reference_image_url TEXT,
    tryon_image_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_items
CREATE POLICY "Order items viewable by order participants"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.customer_id = auth.uid() OR orders.tailor_id = auth.uid())
        )
    );

CREATE POLICY "Customers can insert order items"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.customer_id = auth.uid()
        )
    );

CREATE POLICY "Order participants can update items"
    ON order_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.customer_id = auth.uid() OR orders.tailor_id = auth.uid())
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tailor_profiles_updated_at
    BEFORE UPDATE ON tailor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Note: Storage buckets must be created via Supabase Dashboard or API
-- This is a reference for what needs to be created:
--
-- 1. avatars (public)
--    - Max file size: 2MB
--    - Allowed types: image/jpeg, image/png, image/webp
--
-- 2. portfolios (public)
--    - Max file size: 5MB
--    - Allowed types: image/jpeg, image/png, image/webp
--
-- 3. order-images (private)
--    - Max file size: 10MB
--    - Allowed types: image/jpeg, image/png, image/webp
--
-- 4. tryon-results (private)
--    - Max file size: 10MB
--    - Allowed types: image/jpeg, image/png, image/webp

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Performance optimization indexes

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_tailor_profiles_user_id ON tailor_profiles(user_id);
CREATE INDEX idx_tailor_profiles_rating ON tailor_profiles(rating DESC);
CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_tailor_id ON orders(tailor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================
-- No initial data needed for MVP
