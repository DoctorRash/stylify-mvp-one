import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTailorProfile } from '@/lib/actions/tailor';
import BookingForm from '@/components/customer/booking-form';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/auth');

    const { data: tailor } = await getTailorProfile(id);

    if (!tailor) {
        return <div>Tailor not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Order</h1>
                    <a href="/customer/explore" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)]">
                        Cancel
                    </a>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Booking with {tailor.business_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {tailor.location} • {tailor.years_experience} years experience
                    </p>
                </div>

                <BookingForm tailorId={id} specialties={tailor.specialties} />
            </main>
        </div>
    );
}
