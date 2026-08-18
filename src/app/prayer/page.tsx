'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/layout/PageHeader';
import { TranslationKey } from '@/i18n/translations';
import { cn } from '@/lib/utils';

interface PrayerTimes {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
}

const PRAYER_KEYS: (keyof PrayerTimes)[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_ICONS: Record<string, string> = {
    fajr: '🌅',
    sunrise: '☀️',
    dhuhr: '🌞',
    asr: '🌤️',
    maghrib: '🌇',
    isha: '🌙',
};

const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export default function PrayerPage() {
    const { t, language } = useLanguage();
    const [times, setTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [cityName, setCityName] = useState<string>('');
    const [countdown, setCountdown] = useState<string>('');

    const calculateNextPrayer = useCallback((prayerTimes: PrayerTimes) => {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        for (const key of PRAYER_KEYS) {
            const prayerMinutes = timeToMinutes(prayerTimes[key]);
            if (prayerMinutes > nowMinutes) {
                return key;
            }
        }
        return 'fajr';
    }, []);

    const fetchPrayerTimes = useCallback(async (lat: number, lon: number) => {
        try {
            const date = new Date();
            const method = 3; // Muslim World League
            const url = `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lon}&method=${method}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 200) {
                const t = data.data.timings;
                const prayerTimes: PrayerTimes = {
                    fajr: t.Fajr,
                    sunrise: t.Sunrise,
                    dhuhr: t.Dhuhr,
                    asr: t.Asr,
                    maghrib: t.Maghrib,
                    isha: t.Isha,
                };
                setTimes(prayerTimes);
                setNextPrayer(calculateNextPrayer(prayerTimes));
                setCityName(data.data.meta.timezone || '');
            }
        } catch {
            setError('Failed to fetch prayer times');
        } finally {
            setLoading(false);
        }
    }, [calculateNextPrayer]);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // Default to Mecca if location denied
                    fetchPrayerTimes(21.4225, 39.8262);
                }
            );
        } else {
            fetchPrayerTimes(21.4225, 39.8262);
        }
    }, [fetchPrayerTimes]);

    // Live countdown to next prayer
    useEffect(() => {
        if (!times || !nextPrayer) return;

        const getNextPrayerTime = () => {
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const target = timeToMinutes(times[nextPrayer as keyof PrayerTimes]);

            let diffMinutes = target - nowMinutes;
            if (diffMinutes <= 0) diffMinutes += 24 * 60;

            const h = Math.floor(diffMinutes / 60);
            const m = Math.floor(diffMinutes % 60);
            const s = 59 - now.getSeconds();
            return { h, m, s };
        };

        const update = () => {
            const { h, m, s } = getNextPrayerTime();
            setCountdown(
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            );
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [times, nextPrayer]);

    const countdownLabel = language === 'ar'
        ? `باقي ${countdown}`
        : `${countdown} remaining`;

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    titleKey="prayer.title"
                    subtitleKey="prayer.subtitle"
                    titleClassName="text-violet-800 dark:text-violet-400"
                />

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-violet-600 dark:text-violet-400 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <MapPin size={40} className="mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-500 dark:text-slate-400">{t('prayer.location_needed')}</p>
                    </div>
                ) : times ? (
                    <>
                        {nextPrayer && (
                            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-6 mb-8 text-center">
                                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">{t('prayer.next_prayer')}</p>
                                <p className="text-3xl font-bold text-violet-800 dark:text-violet-300 font-arabic">
                                    {PRAYER_ICONS[nextPrayer]} {t(`prayer.${nextPrayer}` as TranslationKey)}
                                </p>
                                <p className="text-2xl font-bold text-violet-700 dark:text-violet-400 mt-1">
                                    {times[nextPrayer as keyof PrayerTimes]}
                                </p>
                                {countdown && (
                                    <p className="text-sm font-mono text-violet-500 dark:text-violet-300 mt-2 tabular-nums">
                                        {countdownLabel}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {PRAYER_KEYS.map((key) => (
                                <div
                                    key={key}
                                    className={cn(
                                        "bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border transition-all",
                                        nextPrayer === key
                                            ? "border-violet-500 ring-1 ring-violet-500/50 shadow-lg"
                                            : "border-slate-100 dark:border-slate-800 shadow-sm"
                                    )}
                                >
                                    <div className="text-center">
                                        <span className="text-2xl mb-2 block">{PRAYER_ICONS[key]}</span>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
                                            {t(`prayer.${key}` as TranslationKey)}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {times[key]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {cityName && (
                            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400">
                                <Clock size={14} />
                                <span>{cityName}</span>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}