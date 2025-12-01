'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string, role: 'customer' | 'tailor') => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (user: User, retries = 3) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                // If profile not found (PGRST116)
                if (error.code === 'PGRST116') {
                    console.log('Profile not found. Attempting to auto-create...');

                    // Auto-heal: Create profile from user metadata
                    const { role, full_name } = user.user_metadata;

                    if (role) {
                        // 1. Create base profile
                        const { error: createError } = await supabase
                            .from('profiles')
                            .insert({
                                id: user.id,
                                email: user.email,
                                full_name: full_name || user.email?.split('@')[0],
                                role: role,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            });

                        if (createError) {
                            console.error('Failed to auto-create profile:', createError);
                            throw createError;
                        }

                        // 2. Create role-specific profile
                        if (role === 'tailor') {
                            await supabase.from('tailor_profiles').insert({ user_id: user.id });
                        } else if (role === 'customer') {
                            await supabase.from('customer_profiles').insert({ user_id: user.id });
                        }

                        // 3. Retry fetching immediately
                        return fetchProfile(user, 0);
                    }
                }

                // Retry logic for other errors or if auto-create failed
                if (retries > 0) {
                    console.log('Error fetching profile, retrying...', retries);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return fetchProfile(user, retries - 1);
                }
                throw error;
            }
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', JSON.stringify(error, null, 2));
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'tailor') => {
        try {
            // Sign up the user with metadata
            // The database trigger will automatically create the profile and role-specific profile
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('No user returned from signup');

            // Wait a moment for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1000));

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
