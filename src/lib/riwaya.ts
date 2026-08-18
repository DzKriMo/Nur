// Riwaya (Quran reading style) support: Hafs (default) and Warsh.
// The preference is stored in a cookie so server-rendered Quran pages can
// pick the correct data files at request time.

export type Riwaya = 'hafs' | 'warsh';

export const RIAWAYA_COOKIE = 'nur-riwaya';

export const RIAWAYA_OPTIONS: { id: Riwaya; labelEn: string; labelAr: string }[] = [
    { id: 'hafs', labelEn: 'Hafs', labelAr: 'حفص' },
    { id: 'warsh', labelEn: 'Warsh', labelAr: 'ورش' },
];

export function isRiwaya(value: unknown): value is Riwaya {
    return value === 'hafs' || value === 'warsh';
}

export function normalizeRiwaya(value: unknown): Riwaya {
    return isRiwaya(value) ? value : 'hafs';
}

/** Read the riwaya from a cookie header value (server side). */
export function getRiwayaFromCookie(cookieHeader: string | undefined): Riwaya {
    if (!cookieHeader) return 'hafs';
    const match = cookieHeader.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${RIAWAYA_COOKIE}=`));
    return match ? normalizeRiwaya(match.split('=')[1]) : 'hafs';
}

/** Persist the riwaya preference (client side). */
export function setRiwayaCookie(riwaya: Riwaya): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${RIAWAYA_COOKIE}=${riwaya}; path=/; max-age=31536000; SameSite=Lax`;
}
