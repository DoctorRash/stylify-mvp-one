'use client';

import { useRouter } from 'next/navigation';

export default function BookButton({ tailorId }: { tailorId: string }) {
    const router = useRouter();

    if (!tailorId) {
        return (
            <button disabled className="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-bold cursor-not-allowed">
                Unavailable
            </button>
        );
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Booking for tailor:', tailorId);
                router.push(`/tailor/${tailorId}/book`);
            }}
            className="relative z-50 px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center cursor-pointer"
        >
            Book Now
        </button>
    );
}
