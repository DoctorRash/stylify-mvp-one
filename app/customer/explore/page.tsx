'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';
import { useRouter } from 'next/navigation';

export default function CustomerExplore() {
    const { profile, signOut, loading } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-purple-50 dark:from-[var(--color-bg-dark)] dark:to-gray-900 p-8">
            <motion.div
                className="max-w-6xl mx-auto"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Welcome, {profile?.full_name}! 🛍️
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Discover talented tailors and create your custom wardrobe
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Hero Section */}
                <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-3xl font-bold mb-2">Find Your Perfect Tailor</h2>
                    <p className="mb-6 opacity-90 text-lg">
                        Browse talented tailors, try on designs virtually with AI, and get custom-made clothing
                    </p>
                    <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-lg">
                        Browse Tailors
                    </button>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            AI Virtual Try-On
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            See how designs look on you before ordering with our AI technology
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">👔</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Expert Tailors
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Connect with skilled tailors who bring your fashion vision to life
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Custom Designs
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Get perfectly fitted, one-of-a-kind clothing made just for you
                        </p>
                    </motion.div>
                </div>

                {/* Featured Tailors */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Tailors</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No tailors available yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            Check back soon to discover talented tailors in your area
                        </p>
                    </div>
                </div>

                {/* My Orders */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Orders</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            Start browsing tailors to place your first order
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
