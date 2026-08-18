import { PrayerTimes } from '@/types';
import { getStored, setStored } from '@/lib/storage';

export const PRAYER_KEYS: (keyof PrayerTimes)[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_ICONS: Record<string, string> = {
    fajr: '🌅',
    sunrise: '☀️',
    dhuhr: '🌞',
    asr: '🌤️',
    maghrib: '🌇',
    isha: '🌙',
};

export const PRAYER_METHODS: { id: number; labelKey: string }[] = [
    { id: 0, labelKey: 'prayer.method_0' }, // Umm al-Qura
    { id: 1, labelKey: 'prayer.method_1' }, // Karachi
    { id: 2, labelKey: 'prayer.method_2' }, // ISNA
    { id: 3, labelKey: 'prayer.method_3' }, // MWL
    { id: 4, labelKey: 'prayer.method_4' }, // Egyptian
    { id: 5, labelKey: 'prayer.method_5' }, // Jafari
    { id: 6, labelKey: 'prayer.method_6' }, // Dubai
    { id: 7, labelKey: 'prayer.method_7' }, // Moonsighting
];

export interface StoredCoords {
    lat: number;
    lon: number;
    city: string;
}

export function getSavedCoords(): StoredCoords | null {
    return getStored<StoredCoords | null>('nur-prayer-coords', null);
}

export function saveCoords(coords: StoredCoords): void {
    setStored('nur-prayer-coords', coords);
}

export function getSavedMethod(): number {
    const m = getStored<number>('nur-prayer-method', 3);
    return Number.isFinite(m) ? m : 3;
}

export function saveMethod(method: number): void {
    setStored('nur-prayer-method', method);
}

export function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
}

export interface PrayerData {
    times: PrayerTimes;
    nextPrayer: keyof PrayerTimes;
    hijri: { day: number; month: string; year: number; dayName: string };
    cityName: string;
}

export async function fetchPrayerData(lat: number, lon: number, method: number, cityName?: string): Promise<PrayerData> {
    const date = new Date();
    const url = `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lon}&method=${method}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 200) {
        throw new Error('API error');
    }

    const t = data.data.timings;
    const times: PrayerTimes = {
        fajr: t.Fajr,
        sunrise: t.Sunrise,
        dhuhr: t.Dhuhr,
        asr: t.Asr,
        maghrib: t.Maghrib,
        isha: t.Isha,
    };

    const hijriDate = data.data.date?.hijri;

    return {
        times,
        nextPrayer: computeNextPrayer(times),
        hijri: hijriDate
            ? { day: hijriDate.day, month: hijriDate.month?.ar ?? hijriDate.month?.en ?? '', year: hijriDate.year, dayName: hijriDate.weekday?.ar ?? '' }
            : { day: 0, month: '', year: 0, dayName: '' },
        cityName: cityName || data.data.meta?.timezone || '',
    };
}

export function computeNextPrayer(times: PrayerTimes): keyof PrayerTimes {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (const key of PRAYER_KEYS) {
        if (timeToMinutes(times[key]) > nowMinutes) return key;
    }
    return 'fajr';
}

export function formatCountdownTo(targetTime: string): { h: string; m: string; s: string } {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let diffMinutes = timeToMinutes(targetTime) - nowMinutes;
    if (diffMinutes <= 0) diffMinutes += 24 * 60;
    const h = Math.floor(diffMinutes / 60);
    const m = Math.floor(diffMinutes % 60);
    const s = 60 - now.getSeconds();
    return {
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
    };
}

// Qibla
export function computeQiblaBearing(lat: number, lon: number): number {
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (kaabaLat * Math.PI) / 180;
    const dLambda = ((kaabaLon - lon) * Math.PI) / 180;
    const y = Math.sin(dLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
}
