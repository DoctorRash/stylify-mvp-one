'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type TailorProfileUpdateData = {
    business_name: string;
    bio: string;
    specialties: string[];
    years_experience: number;
    location: string;
    portfolio_images?: string[];
};

export async function updateTailorProfile(userId: string, data: TailorProfileUpdateData) {
    const supabase = await createServerSupabaseClient();

    try {
        const { error } = await supabase
            .from('tailor_profiles')
            .update({
                business_name: data.business_name,
                bio: data.bio,
                specialties: data.specialties,
                years_experience: data.years_experience,
                location: data.location,
                portfolio_images: data.portfolio_images,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) throw error;

        revalidatePath('/tailor/profile');
        revalidatePath('/tailor/dashboard');
        return { error: null };
    } catch (error) {
        console.error('Error updating tailor profile:', error);
        return { error: error as Error };
    }
}

export async function getTailorProfile(userId: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('tailor_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tailor profile:', error);
        return { data: null, error: error as Error };
    }
}

export async function getTailorBySlug(slug: string) {
    const supabase = await createServerSupabaseClient();

    try {
        const { data, error } = await supabase
            .from('tailor_profiles')
            .select('*, profiles:user_id(full_name, avatar_url)')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tailor by slug:', error);
        return { data: null, error: error as Error };
    }
}

export async function getAllTailors(filters?: { location?: string; specialty?: string }) {
    const supabase = await createServerSupabaseClient();

    try {
        let query = supabase
            .from('tailor_profiles')
            .select('*, profiles:user_id(full_name, avatar_url)')
            .not('slug', 'is', null);

        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }

        if (filters?.specialty) {
            query = query.contains('specialties', [filters.specialty]);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tailors:', error);
        return { data: [], error: error as Error };
    }
}
