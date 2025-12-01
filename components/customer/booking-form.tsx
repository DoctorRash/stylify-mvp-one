'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const bookingSchema = z.object({
    garment_type: z.string().min(1, 'Select a garment type'),
    fabric_type: z.string().optional(),
    notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    tailorId: string;
    specialties: string[];
}

export default function BookingForm({ tailorId, specialties }: BookingFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    const onSubmit = async (data: BookingFormData) => {
        setSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_id: user.id,
                    tailor_id: tailorId,
                    status: 'pending',
                    total_amount: 0, // To be updated by tailor
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
                    price: 0,
                });

            if (itemError) throw itemError;

            router.push('/customer/dashboard');
            router.refresh();
        } catch (err) {
            console.error('Error creating order:', err);
            setError('Failed to create order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Garment Type
                        </label>
                        <select
                            {...register('garment_type')}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select a type...</option>
                            {specialties.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {errors.garment_type && (
                            <p className="mt-1 text-sm text-red-500">{errors.garment_type.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fabric Preference (Optional)
                        </label>
                        <input
                            {...register('fabric_type')}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. Cotton, Silk, Wool"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes for Tailor
                        </label>
                        <textarea
                            {...register('notes')}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="Describe your requirements..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {submitting ? 'Creating Order...' : 'Submit Request'}
            </button>
        </form>
    );
}
