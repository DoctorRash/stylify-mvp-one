import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'tailor') {
      redirect('/tailor/dashboard');
    } else if (profile?.role === 'customer') {
      redirect('/customer/explore');
    }
  }

  redirect('/auth');
}

