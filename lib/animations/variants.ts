import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
};

export const cardHover: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: 'easeInOut',
        },
    },
    tap: {
        scale: 0.98,
    },
};

export const staggerChildren: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
        },
    },
};

export const tryonMorph: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
    exit: {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
        transition: {
            duration: 0.5,
        },
    },
};

export const shimmer: Variants = {
    initial: {
        backgroundPosition: '-200% 0',
    },
    animate: {
        backgroundPosition: '200% 0',
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

export const progressBar: Variants = {
    initial: {
        scaleX: 0,
    },
    animate: (progress: number) => ({
        scaleX: progress / 100,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    }),
};
