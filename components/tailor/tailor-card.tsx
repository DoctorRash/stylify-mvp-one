import Link from 'next/link';
import { Star } from 'lucide-react';

interface TailorCardProps {
    tailor: any;
}

export default function TailorCard({ tailor }: TailorCardProps) {
    return (
        <Link href={`/tailors/${tailor.slug}`} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {tailor.portfolio_images?.[0] ? (
                        <img
                            src={tailor.portfolio_images[0]}
                            alt={tailor.business_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">🧵</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {tailor.rating || 'New'}
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                        {tailor.business_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {tailor.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tailor.specialties?.slice(0, 3).map((s: string) => (
                            <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                                {s}
                            </span>
                        ))}
                        {tailor.specialties?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                                +{tailor.specialties.length - 3}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            {tailor.profiles?.avatar_url ? (
                                <img src={tailor.profiles.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                                    {tailor.profiles?.full_name?.[0] || 'T'}
                                </div>
                            )}
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {tailor.profiles?.full_name}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {tailor.years_experience}y exp
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
