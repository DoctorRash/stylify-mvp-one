'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateCustomerProfile } from '@/lib/actions/customer';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(5, 'Address is required'),
    measurements: z.object({
        height: z.number().min(0),
        chest: z.number().min(0),
        waist: z.number().min(0),
        hips: z.number().min(0),
        inseam: z.number().min(0),
    }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData?: Partial<ProfileFormData>;
}

export default function CustomerProfileForm({ initialData }: ProfileFormProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone: initialData?.phone || '',
            address: initialData?.address || '',
            measurements: {
                height: initialData?.measurements?.height || 0,
                chest: initialData?.measurements?.chest || 0,
                waist: initialData?.measurements?.waist || 0,
                hips: initialData?.measurements?.hips || 0,
                inseam: initialData?.measurements?.inseam || 0,
            },
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await updateCustomerProfile(user.id, data);
            if (result.error) throw result.error;
            setSuccess(true);
            router.refresh();
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                        </label>
                        <input
                            {...register('phone')}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Shipping Address
                        </label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="123 Fashion St, Style City, SC 12345"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Measurements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Measurements (cm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {['height', 'chest', 'waist', 'hips', 'inseam'].map((measure) => (
                        <div key={measure}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                                {measure}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                {...register(`measurements.${measure}` as any, { valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            />
                            {errors.measurements?.[measure as keyof typeof errors.measurements] && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.measurements[measure as keyof typeof errors.measurements]?.message}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                {success && (
                    <span className="text-green-600 dark:text-green-400 font-medium animate-fade-in">
                        Profile saved successfully!
                    </span>
                )}
                {error && (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                        {error}
                    </span>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
