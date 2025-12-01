'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CustomerProfileUpdateData = {
    phone: string;
    address: string;
    measurements: Record<string, number>;
};

export async function updateCustomerProfile(userId: string, data: CustomerProfileUpdateData) {
    const supabase = await createServerSupabaseClient();

    try {
        const { error } = await supabase
            .from('customer_profiles')
            .update({
                phone: data.phone,
                address: data.address,
                measurements: data.measurements,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) throw error;

        revalidatePath('/customer/profile');
        return { error: null };
    } catch (error) {
        console.error('Error updating customer profile:', error);
        return { error: error as Error };
    }
}

export async function getCustomerProfile(userId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('customer_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        return { data: null, error: error as Error };
    }
}
