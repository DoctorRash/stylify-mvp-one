import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTailorOrders } from '@/lib/actions/order';
import Link from 'next/link';

export default async function TailorDashboard() {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/auth');

    const { data: orders } = await getTailorOrders(session.user.id);

    // Fetch tailor profile for header
    const { data: profile } = await supabase
        .from('tailor_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

    const isProfileComplete = profile?.business_name && profile?.location && profile?.specialties?.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tailor Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/tailor/profile" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] font-medium">
                            Edit Profile
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="text-red-600 hover:text-red-700 font-medium">Sign Out</button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!isProfileComplete ? (
                    <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Complete your profile
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300">
                                Add your business details and portfolio to start receiving orders.
                            </p>
                        </div>
                        <Link
                            href="/tailor/profile"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Setup Profile
                        </Link>
                    </div>
                ) : (
                    <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                                Your Public Profile is Live!
                            </h3>
                            <p className="text-green-700 dark:text-green-300 text-sm">
                                Share your profile with customers:
                                <a href={`/tailors/${profile.slug}`} target="_blank" className="ml-2 font-mono underline hover:text-green-900 dark:hover:text-green-100">
                                    {`/tailors/${profile.slug}`}
                                </a>
                            </p>
                        </div>
                        <Link
                            href={`/tailors/${profile.slug}`}
                            target="_blank"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            View Profile
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Orders</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {orders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length || 0}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            ${orders?.reduce((acc, o) => acc + (o.total_amount || 0), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Orders</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {orders?.filter(o => o.status === 'completed').length || 0}
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {orders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {order.customer?.profile?.full_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                order.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            ${order.total_amount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!orders || orders.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No orders found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
