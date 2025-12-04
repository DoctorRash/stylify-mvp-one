'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { createOrder } from '@/lib/actions/order';
import TryOnDialog from './try-on-dialog';

// Validation Schemas
const step1Schema = z.object({
    garment_type: z.string().min(1, 'Select a garment type'),
    fabric_type: z.string().optional(),
    notes: z.string().optional(),
});

const step2Schema = z.object({
    measurements: z.object({
        height: z.number().min(0),
        chest: z.number().min(0),
        waist: z.number().min(0),
        hips: z.number().min(0),
        inseam: z.number().min(0),
    }),
});

const bookingSchema = step1Schema.merge(step2Schema);

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    tailorId: string;
    specialties: string[];
}

const STEPS = [
    { id: 1, title: 'Style & Fabric' },
    { id: 2, title: 'Measurements' },
    { id: 3, title: 'Review' },
];

export default function BookingForm({ tailorId, specialties }: BookingFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTryOn, setShowTryOn] = useState(false);
    const supabase = createClient();

    const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            measurements: {
                height: 0,
                chest: 0,
                waist: 0,
                hips: 0,
                inseam: 0,
            }
        }
    });

    const formData = watch();

    // Load saved draft
    useEffect(() => {
        const saved = localStorage.getItem(`booking_draft_${tailorId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach(key => {
                    setValue(key as any, parsed[key]);
                });
            } catch (e) {
                console.error('Error loading draft', e);
            }
        }
    }, [tailorId, setValue]);

    // Autosave
    useEffect(() => {
        const subscription = watch((value) => {
            localStorage.setItem(`booking_draft_${tailorId}`, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch, tailorId]);

    const nextStep = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await trigger(['garment_type', 'fabric_type', 'notes']);
        } else if (step === 2) {
            isValid = await trigger('measurements');
        }

        if (isValid) setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const onSubmit = async (data: BookingFormData) => {
        setSubmitting(true);
        setError(null);

        try {
            // Import dynamically to avoid server-only module issues in client component if not handled by Next.js automatically
            // But usually server actions can be imported directly.
            // Let's assume createOrder is imported at top level.

            const result = await createOrder({
                tailor_id: tailorId,
                garment_type: data.garment_type,
                fabric_type: data.fabric_type,
                notes: data.notes,
                measurements: data.measurements,
            });

            if (result.error) throw new Error(result.error);

            // Clear draft
            localStorage.removeItem(`booking_draft_${tailorId}`);

            router.push('/customer/dashboard');
            router.refresh();
        } catch (err: any) {
            console.error('Error creating order:', err);
            setError(err.message || 'Failed to create order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.id
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                            {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm min-h-[400px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Style & Fabric</h3>

                            {/* AI Try-On Section */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                        <span className="text-2xl">✨</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                            AI Virtual Try-On
                                        </h4>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                                            Upload a photo of yourself to see how this garment style might look on you.
                                        </p>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                                onClick={() => setShowTryOn(true)}
                                            >
                                                Try it now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Measurements (cm)</h3>
                            <div className="grid grid-cols-2 gap-6">
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
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Order</h3>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Garment:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formData.garment_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Fabric:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formData.fabric_type || 'None specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Measurements:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Provided</span>
                                </div>
                                {formData.notes && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <span className="block text-gray-500 dark:text-gray-400 text-sm mb-1">Notes:</span>
                                        <p className="text-sm text-gray-900 dark:text-white">{formData.notes}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-8 flex justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1 || submitting}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${step === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Creating Order...' : 'Confirm Order'}
                            <Check className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </form>

            {showTryOn && (
                <TryOnDialog
                    garmentType={formData.garment_type || 'Custom Garment'}
                    onClose={() => setShowTryOn(false)}
                />
            )}
        </div>
    );
}
