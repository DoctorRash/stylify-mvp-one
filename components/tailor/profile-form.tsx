'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { updateTailorProfile, TailorProfileUpdateData } from '@/lib/actions/tailor';
import ImageUpload from '@/components/ui/image-upload';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
    business_name: z.string().min(2, 'Business name must be at least 2 characters'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
    years_experience: z.number().min(0, 'Years of experience cannot be negative'),
    location: z.string().min(2, 'Location is required'),
    portfolio_images: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const SPECIALTIES_LIST = [
    'Suits', 'Dresses', 'Alterations', 'Wedding', 'Traditional',
    'Casual', 'Leather', 'Embroidery', 'Uniforms', 'Kids'
];

interface ProfileFormProps {
    initialData?: Partial<ProfileFormData>;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            business_name: initialData?.business_name || '',
            bio: initialData?.bio || '',
            specialties: initialData?.specialties || [],
            years_experience: initialData?.years_experience || 0,
            location: initialData?.location || '',
            portfolio_images: initialData?.portfolio_images || [],
        },
    });

    const portfolioImages = watch('portfolio_images') || [];
    const currentSpecialties = watch('specialties') || [];

    const onSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await updateTailorProfile(user.id, data);
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

    const handleImageUpload = (url: string) => {
        setValue('portfolio_images', [...portfolioImages, url], { shouldDirty: true });
    };

    const removeImage = (index: number) => {
        const newImages = [...portfolioImages];
        newImages.splice(index, 1);
        setValue('portfolio_images', newImages, { shouldDirty: true });
    };

    const toggleSpecialty = (specialty: string) => {
        const current = [...currentSpecialties];
        const index = current.indexOf(specialty);
        if (index === -1) {
            current.push(specialty);
        } else {
            current.splice(index, 1);
        }
        setValue('specialties', current, { shouldDirty: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Business Name
                        </label>
                        <input
                            {...register('business_name')}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. Elite Tailoring Studio"
                        />
                        {errors.business_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.business_name.message}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                        </label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="Tell customers about your experience and style..."
                        />
                        {errors.bio && (
                            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            {...register('years_experience', { valueAsNumber: true })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                        />
                        {errors.years_experience && (
                            <p className="mt-1 text-sm text-red-500">{errors.years_experience.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                        </label>
                        <input
                            {...register('location')}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white"
                            placeholder="City, Country"
                        />
                        {errors.location && (
                            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Specialties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                    {SPECIALTIES_LIST.map((specialty) => (
                        <button
                            key={specialty}
                            type="button"
                            onClick={() => toggleSpecialty(specialty)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentSpecialties.includes(specialty)
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {specialty}
                        </button>
                    ))}
                </div>
                {errors.specialties && (
                    <p className="mt-2 text-sm text-red-500">{errors.specialties.message}</p>
                )}
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <AnimatePresence>
                        {portfolioImages.map((url, index) => (
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-lg overflow-hidden group"
                            >
                                <img src={url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <ImageUpload
                        bucketName="portfolios"
                        onUpload={handleImageUpload}
                        folderPath={user?.id}
                    />
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
