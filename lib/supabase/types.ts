// Type definitions for database tables
export type UserRole = 'customer' | 'tailor' | 'admin';
export type OrderStatus = 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface TailorProfile {
    id: string;
    user_id: string;
    business_name?: string;
    bio?: string;
    specialties: string[];
    years_experience: number;
    portfolio_images: string[];
    location?: string;
    rating: number;
    total_orders: number;
    created_at: string;
    updated_at: string;
}

export interface CustomerProfile {
    id: string;
    user_id: string;
    phone?: string;
    address?: string;
    measurements?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    customer_id: string;
    tailor_id?: string;
    status: OrderStatus;
    total_amount: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    garment_type: string;
    fabric_type?: string;
    measurements?: Record<string, any>;
    reference_image_url?: string;
    tryon_image_url?: string;
    price: number;
    created_at: string;
}
