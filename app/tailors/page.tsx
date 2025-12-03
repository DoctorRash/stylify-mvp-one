import { getAllTailors } from '@/lib/actions/tailor';
import TailorCard from '@/components/tailor/tailor-card';
import { Search } from 'lucide-react';

export default async function TailorsDirectory({ searchParams }: { searchParams: Promise<{ location?: string; specialty?: string }> }) {
    const { location, specialty } = await searchParams;
    const { data: tailors } = await getAllTailors({ location, specialty });

    const specialties = ['Suits', 'Dresses', 'Alterations', 'Wedding', 'Traditional', 'Casual', 'Leather'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Find Your Perfect Tailor
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Connect with expert tailors who can bring your style to life. From custom suits to intricate alterations.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Filter By
                            </h3>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="location"
                                            defaultValue={location}
                                            placeholder="City or region..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Specialty
                                    </label>
                                    <div className="space-y-2">
                                        {specialties.map((s) => (
                                            <label key={s} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="specialty"
                                                    value={s}
                                                    defaultChecked={specialty === s}
                                                    className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {s}
                                                </span>
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="specialty"
                                                value=""
                                                defaultChecked={!specialty}
                                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                All Specialties
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                                >
                                    Apply Filters
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {tailors?.length || 0} Tailors Found
                            </h2>
                        </div>

                        {tailors && tailors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tailors.map((tailor) => (
                                    <TailorCard key={tailor.id} tailor={tailor} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No tailors found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Try adjusting your filters to find more results.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
