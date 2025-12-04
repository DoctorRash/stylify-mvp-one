'use client';

import { useState } from 'react';
import { generateTryOn, getTryOnResult } from '@/lib/actions/try-on';
import { X, Upload, Loader2 } from 'lucide-react';

interface TryOnDialogProps {
    garmentType: string;
    onClose: () => void;
}

export default function TryOnDialog({ garmentType, onClose }: TryOnDialogProps) {
    const [userImage, setUserImage] = useState<File | null>(null);
    const [userPreview, setUserPreview] = useState<string | null>(null);
    const [garmentImage, setGarmentImage] = useState<File | null>(null);
    const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setUserPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGarmentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setGarmentImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setGarmentPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!userImage || !garmentImage) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('userImage', userImage);
        formData.append('garmentImage', garmentImage);
        formData.append('garmentType', garmentType);

        const response = await generateTryOn(formData);

        if (response.error) {
            setError(response.error);
            setLoading(false);
            return;
        }

        // Poll for result
        if (response.predictionId) {
            const pollInterval = setInterval(async () => {
                const statusResponse = await getTryOnResult(response.predictionId!);

                if (statusResponse.error) {
                    setError(statusResponse.error);
                    clearInterval(pollInterval);
                    setLoading(false);
                    return;
                }

                if (statusResponse.status === 'succeeded' && statusResponse.output) {
                    const outputUrl = Array.isArray(statusResponse.output)
                        ? statusResponse.output[0]
                        : statusResponse.output;
                    setResult(outputUrl);
                    clearInterval(pollInterval);
                    setLoading(false);
                } else if (statusResponse.status === 'failed') {
                    setError('Try-on generation failed');
                    clearInterval(pollInterval);
                    setLoading(false);
                }
            }, 2000);

            // Timeout after 60 seconds
            setTimeout(() => {
                clearInterval(pollInterval);
                if (!result) {
                    setError('Try-on generation timed out');
                    setLoading(false);
                }
            }, 60000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Virtual Try-On</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {!result ? (
                        <>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Upload a photo of yourself to see how the {garmentType} would look on you.
                            </p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Photo
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                                            {userPreview ? (
                                                <div className="relative">
                                                    <img src={userPreview} alt="Your photo" className="max-h-48 mx-auto rounded-lg" />
                                                    <button
                                                        onClick={() => {
                                                            setUserImage(null);
                                                            setUserPreview(null);
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block">
                                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">Upload your photo</p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleUserImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Garment Photo
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                                            {garmentPreview ? (
                                                <div className="relative">
                                                    <img src={garmentPreview} alt="Garment" className="max-h-48 mx-auto rounded-lg" />
                                                    <button
                                                        onClick={() => {
                                                            setGarmentImage(null);
                                                            setGarmentPreview(null);
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block">
                                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">Upload garment</p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleGarmentImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={!userImage || !garmentImage || loading}
                                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Try-On'
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <p className="text-green-800 dark:text-green-200 font-medium">✨ Try-on generated successfully!</p>
                            </div>
                            <img src={result} alt="Try-on result" className="w-full rounded-lg" />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setUserImage(null);
                                        setUserPreview(null);
                                        setGarmentImage(null);
                                        setGarmentPreview(null);
                                    }}
                                    className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                >
                                    Continue Booking
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
