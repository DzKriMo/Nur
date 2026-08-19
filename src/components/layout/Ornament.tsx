'use client';

/**
 * Small reusable Islamic ornaments: the khatam (8-pointed star), a crescent
 * moon, and a gold divider. Used across the app for a cohesive heritage look.
 */

export function KhatamStar({ size = 20, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M12 1 L15.18 8.82 L23 12 L15.18 15.18 L12 23 L8.82 15.18 L1 12 L8.82 8.82 Z" />
        </svg>
    );
}

export function Crescent({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden>
            <path d="M32 4 A20 20 0 1 0 44 35 A22 22 0 1 1 32 4 Z" />
        </svg>
    );
}

export function OrnamentDivider({ className }: { className?: string }) {
    return (
        <div aria-hidden className={`ornament-divider ${className ?? ''}`}>
            <span className="ornament-star" />
        </div>
    );
}