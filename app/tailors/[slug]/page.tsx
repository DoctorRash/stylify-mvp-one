import { getTailorBySlug } from '@/lib/actions/tailor';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';

export default async function PublicTailorProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: tailor } = await getTailorBySlug(slug);

    if (!tailor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-lg">
                            {tailor.profiles?.avatar_url ? (
                                <img src={tailor.profiles.avatar_url} alt={tailor.business_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                    {tailor.business_name[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {tailor.business_name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {tailor.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {tailor.years_experience} Years Experience
                                        </span>
                                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                            <Star className="w-4 h-4 fill-current" />
                                            {tailor.rating || 'New'}
                                        </span>
                                    </div>
                                </div>
                                {tailor.user_id ? (
                                    <Link
                                        href={`/tailor/${tailor.user_id}/book`}
                                        className="relative z-10 px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center cursor-pointer"
                                    >
                                        Book Now
                                    </Link>
                                ) : (
                                    <button disabled className="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-bold cursor-not-allowed">
                                        Unavailable
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                                {tailor.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Specialties & Info */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {tailor.specialties?.map((s: string) => (
                                    <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Professional craftsmanship</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Timely delivery guaranteed</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Custom fitting sessions</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Portfolio */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Portfolio</h3>
                        {tailor.portfolio_images && tailor.portfolio_images.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tailor.portfolio_images.map((img: string, i: number) => (
                                    <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
                                        <img
                                            src={img}
                                            alt={`Portfolio ${i + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="text-4xl mb-4">📷</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No portfolio images yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    This tailor hasn't uploaded any work samples.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
