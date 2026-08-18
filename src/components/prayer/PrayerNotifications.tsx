'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, BellOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRAYER_KEYS, PRAYER_ICONS, timeToMinutes } from '@/lib/prayer';
import { PrayerTimes } from '@/types';

interface PrayerNotificationsProps {
    times: PrayerTimes;
}

export default function PrayerNotifications({ times }: PrayerNotificationsProps) {
    const { t, language } = useLanguage();
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            queueMicrotask(() => setPermission(Notification.permission));
        }
    }, []);

    function scheduleNext() {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let nextKey: keyof PrayerTimes | null = null;
        let nextMinutes = Infinity;
        for (const key of PRAYER_KEYS) {
            let m = timeToMinutes(times[key]);
            if (m <= nowMinutes) m += 24 * 60;
            if (m < nextMinutes) {
                nextMinutes = m;
                nextKey = key;
            }
        }
        if (!nextKey) return;

        const delayMs = (nextMinutes - nowMinutes) * 60 * 1000 - now.getSeconds() * 1000;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            const name = t(`prayer.${nextKey}` as never);
            try {
                new Notification(`${PRAYER_ICONS[nextKey]} ${name}`, {
                    body: language === 'ar' ? `حان الآن وقت صلاة ${name}` : `Time for ${name} prayer`,
                    tag: `prayer-${nextKey}-${new Date().toDateString()}`,
                });
            } catch {
                // notifications not allowed
            }
            scheduleNext();
        }, Math.max(delayMs, 5000));
    }

    const enable = async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') scheduleNext();
    };

    const disable = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setPermission('default');
    };

    if (permission === 'unsupported') return null;

    return (
        <div className="flex items-center gap-2">
            {permission === 'granted' ? (
                <button
                    onClick={disable}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                    <BellRing size={15} />
                    {t('prayer.notifications_enabled')}
                </button>
            ) : permission === 'denied' ? (
                <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <BellOff size={15} />
                    {t('prayer.notifications_denied')}
                </span>
            ) : (
                <button
                    onClick={enable}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                >
                    <Bell size={15} />
                    {t('prayer.enable_notifications')}
                </button>
            )}
        </div>
    );
}