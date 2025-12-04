import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAllTailors } from '@/lib/actions/tailor';
import Link from 'next/link';
import Image from 'next/image';

export default async function ExplorePage() {
    const { data: tailors } = await getAllTailors();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find a Tailor</h1>
                    <Link href="/customer/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] font-medium">
                        My Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tailors?.map((tailor) => (
                        <div key={tailor.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <Link href={`/tailors/${tailor.slug}`} className="block aspect-video bg-gray-100 dark:bg-gray-700 relative group">
                                {tailor.portfolio_images?.[0] ? (
                                    <img
                                        src={tailor.portfolio_images[0]}
                                        alt={tailor.business_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    {tailor.rating}
                                </div>
                            </Link>
                            <div className="p-6">
                                <Link href={`/tailors/${tailor.slug}`} className="block group">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                                        {tailor.business_name || tailor.profile?.full_name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {tailor.location || 'Location not specified'}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {tailor.specialties?.slice(0, 3).map((spec: string) => (
                                        <span key={spec} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded-md text-gray-600 dark:text-gray-300">
                                            {spec}
                                        </span>
                                    ))}
                                    {tailor.specialties?.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded-md text-gray-600 dark:text-gray-300">
                                            +{tailor.specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                                <Link
                                    href={`/tailors/${tailor.slug}`}
                                    className="block w-full py-2 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-center rounded-lg font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
