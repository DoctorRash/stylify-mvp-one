'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CreateOrderData = {
    tailor_id: string;
    garment_type: string;
    fabric_type?: string;
    notes?: string;
    measurements: Record<string, number>;
};

export async function createOrder(data: CreateOrderData) {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { error: 'Not authenticated' };
    }

    try {
        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: session.user.id,
                tailor_id: data.tailor_id,
                status: 'pending',
                total_amount: 0, // Logic for pricing could go here later
                notes: data.notes,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order Item
        const { error: itemError } = await supabase
            .from('order_items')
            .insert({
                order_id: order.id,
                garment_type: data.garment_type,
                fabric_type: data.fabric_type,
                measurements: data.measurements,
                price: 0,
            });

        if (itemError) {
            // Rollback order if item creation fails (optional but good practice)
            await supabase.from('orders').delete().eq('id', order.id);
            throw itemError;
        }

        revalidatePath('/customer/dashboard');
        revalidatePath(`/tailor/${data.tailor_id}/book`);

        return { success: true, orderId: order.id };
    } catch (err: any) {
        console.error('Error creating order:', err);
        return { error: err.message || 'Failed to create order' };
    }
}

export async function getCustomerOrders(userId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                tailor:tailor_id (
                    full_name,
                    tailor_profiles (
                        business_name
                    )
                )
            `)
            .eq('customer_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match frontend expectations
        const formattedOrders = data.map(order => ({
            ...order,
            tailor: order.tailor ? {
                ...order.tailor,
                business_name: order.tailor.tailor_profiles?.[0]?.business_name,
                profile: {
                    full_name: order.tailor.full_name
                }
            } : null
        }));

        return { data: formattedOrders, error: null };
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        return { data: [], error: error as Error };
    }
}

export async function getTailorOrders(userId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                customer:customer_id (
                    full_name
                )
            `)
            .eq('tailor_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match frontend expectations
        const formattedOrders = data.map(order => ({
            ...order,
            customer: order.customer ? {
                profile: {
                    full_name: order.customer.full_name
                }
            } : null
        }));

        return { data: formattedOrders, error: null };
    } catch (error) {
        console.error('Error fetching tailor orders:', error);
        return { data: [], error: error as Error };
    }
}
