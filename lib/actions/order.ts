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
