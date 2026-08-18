'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    getSavedCoords,
    getSavedMethod,
    fetchPrayerData,
    formatCountdownTo,
    PRAYER_ICONS,
} from '@/lib/prayer';
import { useMounted } from '@/lib/storage';
import { PrayerTimes } from '@/types';

export default function NextPrayerWidget() {
    const { t, language } = useLanguage();
    const mounted = useMounted();
    const [, setTick] = useState(0);
    const [nextKey, setNextKey] = useState<keyof PrayerTimes | null>(null);
    const [times, setTimes] = useState<PrayerTimes | null>(null);

    useEffect(() => {
        const coords = getSavedCoords();
        if (!coords) return;
        const method = getSavedMethod();
        fetchPrayerData(coords.lat, coords.lon, method, coords.city)
            .then(data => {
                setNextKey(data.nextPrayer);
                setTimes(data.times);
            })
            .catch(() => {
                setTimes(null);
                setNextKey(null);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted || !nextKey || !times) return null;

    const countdown = formatCountdownTo(times[nextKey]);

    const label = language === 'ar'
        ? `${PRAYER_ICONS[nextKey]} ${t(`prayer.${nextKey}` as never)} - باقي ${countdown.h}:${countdown.m}:${countdown.s}`
        : `${PRAYER_ICONS[nextKey]} ${t(`prayer.${nextKey}` as never)} - ${countdown.h}:${countdown.m}:${countdown.s} left`;

    return (
        <Link
            href="/prayer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-medium hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            title={t('prayer.next_prayer')}
        >
            <Clock size={13} />
            <span className="tabular-nums whitespace-nowrap">{label}</span>
        </Link>
    );
}