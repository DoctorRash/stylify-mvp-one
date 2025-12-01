import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function TailorDashboard() {
    const supabase = await createServerSupabaseClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth');
    }

    // Fetch tailor profile
    const { data: profile } = await supabase
        .from('tailor_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

    // Fetch user name
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

    const isProfileComplete = profile?.business_name && profile?.location && profile?.specialties?.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tailor Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-300">
                            {profile?.business_name || userProfile?.full_name}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                            {(profile?.business_name || userProfile?.full_name || 'T')[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {userProfile?.full_name?.split(' ')[0]}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your business today.
                    </p>
                </div>

                {!isProfileComplete && (
                    <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Complete your profile
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300">
                                Add your business details and portfolio to start receiving orders.
                            </p>
                        </div>
                        <a
                            href="/tailor/profile"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Setup Profile
                        </a>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Active Orders</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Rating</h3>
                        <div className="flex items-center gap-1">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {profile?.rating || '0.0'}
                            </span>
                            <span className="text-yellow-400 text-xl">★</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                        <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">
                            View All
                        </button>
                    </div>
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400 py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="font-medium">No orders yet</p>
                        <p className="text-sm mt-1">Orders will appear here once customers start booking.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
