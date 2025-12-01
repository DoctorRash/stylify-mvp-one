import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/tailor/profile-form';

export default async function TailorProfilePage() {
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                    <a
                        href="/tailor/dashboard"
                        className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] font-medium"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Professional Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Update your business details and portfolio to attract more customers.
                    </p>
                </div>

                <ProfileForm initialData={profile || {}} />
            </main>
        </div>
    );
}
