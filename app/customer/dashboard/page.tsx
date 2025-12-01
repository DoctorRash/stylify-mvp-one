import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getCustomerOrders } from '@/lib/actions/order';
import Link from 'next/link';

export default async function CustomerDashboard() {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/auth');

    const { data: orders } = await getCustomerOrders(session.user.id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/customer/explore" className="text-[var(--color-primary)] font-medium hover:underline">
                            Find Tailors
                        </Link>
                        <Link href="/customer/profile" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] font-medium">
                            Profile
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="text-red-600 hover:text-red-700 font-medium">Sign Out</button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-6">
                    {orders?.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        Order #{order.id.slice(0, 8)}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Tailor: <span className="font-medium text-gray-900 dark:text-white">{order.tailor?.business_name || order.tailor?.profile?.full_name}</span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    ${order.total_amount}
                                </span>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}

                    {(!orders || orders.length === 0) && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Find a tailor and start your custom clothing journey.
                            </p>
                            <Link
                                href="/customer/explore"
                                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Explore Tailors
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
