'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    // Handle redirect when user is authenticated and profile is loaded
    useEffect(() => {
        if (user && profile && !loading) {
            if (profile.role === 'tailor') {
                router.push('/tailor/dashboard');
            } else if (profile.role === 'customer') {
                router.push('/customer/explore');
            }
        }
    }, [user, profile, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-purple-50 dark:from-[var(--color-bg-dark)] dark:to-gray-900 px-4">
            <motion.div
                className="w-full max-w-md"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                        Stylify
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        AI-powered fashion marketplace
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${mode === 'login'
                                ? 'bg-white dark:bg-gray-600 text-[var(--color-primary)] shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${mode === 'signup'
                                ? 'bg-white dark:bg-gray-600 text-[var(--color-primary)] shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {mode === 'login' ? <LoginForm /> : <SignupForm />}
                </div>

                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
}

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Redirect is handled by the useEffect in the parent component
        }
    };

    return (
        <motion.form
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-[var(--color-primary)] hover:underline">
                    Forgot password?
                </a>
            </div>

            <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </motion.button>
        </motion.form>
    );
}

function SignupForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'tailor'>('customer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!role) {
            setError('Please select a role');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, fullName, role);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Middleware will handle redirect based on role
            router.refresh();
        }
    };

    return (
        <motion.form
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="John Doe"
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                </label>
                <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                </label>
                <input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                    minLength={6}
                />
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    I am a...
                </label>
                <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'customer' | 'tailor')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    disabled={loading}
                >
                    <option value="customer">Customer</option>
                    <option value="tailor">Tailor</option>
                </select>
            </div>

            <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
        </motion.form>
    );
}

