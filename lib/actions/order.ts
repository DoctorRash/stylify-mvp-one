'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getTailorOrders(tailorId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                customer:customer_profiles(
                    user_id,
                    phone,
                    address,
                    profile:profiles(full_name, email)
                ),
                items:order_items(*)
            `)
            .eq('tailor_id', tailorId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tailor orders:', error);
        return { data: null, error: error as Error };
    }
}

export async function getCustomerOrders(customerId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                tailor:tailor_profiles(
                    business_name,
                    profile:profiles(full_name)
                ),
                items:order_items(*)
            `)
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        return { data: null, error: error as Error };
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) throw error;

        revalidatePath('/tailor/dashboard');
        revalidatePath('/customer/dashboard');
        return { error: null };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { error: error as Error };
    }
}

export async function getAllTailors() {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('tailor_profiles')
            .select(`
                *,
                profile:profiles(full_name, avatar_url)
            `)
            .order('rating', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tailors:', error);
        return { data: null, error: error as Error };
    }
}
