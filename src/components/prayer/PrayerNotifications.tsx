'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellRing, BellOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRAYER_KEYS, PRAYER_ICONS, timeToMinutes } from '@/lib/prayer';
import { PrayerTimes } from '@/types';
import { getStored, setStored } from '@/lib/storage';

interface PrayerNotificationsProps {
    times: PrayerTimes;
}

const GRACE_WINDOW_MIN = 30;

function notifiedKey(key: string, date = new Date()): string {
    const ymd = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return `nur-prayer-notified-${key}-${ymd}`;
}

export default function PrayerNotifications({ times }: PrayerNotificationsProps) {
    const { t, language } = useLanguage();
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timesRef = useRef(times);
    const permissionRef = useRef<NotificationPermission | 'unsupported'>('unsupported');

    useEffect(() => {
        timesRef.current = times;
    }, [times]);

    useEffect(() => {
        permissionRef.current = permission;
    }, [permission]);

    useEffect(() => {
        if ('Notification' in window) {
            queueMicrotask(() => setPermission(Notification.permission));
        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            // iOS 16.4+ installed PWAs: the Notification constructor is not
            // available, but notifications work via the Service Worker + the
            // Permissions API.
            navigator.permissions
                .query({ name: 'notifications' as PermissionName })
                .then((status) => {
                    setPermission(status.state as NotificationPermission);
                    status.onchange = () => setPermission(status.state as NotificationPermission);
                })
                .catch(() => setPermission('default'));
        }
    }, []);

    const showNotification = useCallback((key: keyof PrayerTimes, name: string, body: string) => {
        const tag = `prayer-${key}-${new Date().toDateString()}`;
        const options: NotificationOptions = {
            body,
            tag,
            icon: '/icon.svg',
        };
        try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready
                    .then((reg) => reg.showNotification(`${PRAYER_ICONS[key]} ${name}`, options))
                    .catch(() => {
                        if ('Notification' in window) {
                            new Notification(`${PRAYER_ICONS[key]} ${name}`, options);
                        }
                    });
            } else if ('Notification' in window) {
                new Notification(`${PRAYER_ICONS[key]} ${name}`, options);
            }
        } catch {
            // notifications not allowed
        }
        setStored(notifiedKey(key as string), Date.now());
    }, []);

    // Fire a notification for any prayer whose time has passed recently and
    // hasn't been notified today yet (catches up if a timer was throttled/late).
    const catchUpMissed = useCallback(() => {
        if (permissionRef.current !== 'granted') return;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        for (const key of PRAYER_KEYS) {
            const m = timeToMinutes(timesRef.current[key]);
            // passed within the last GRACE_WINDOW_MIN minutes (including exactly now)
            if (m <= nowMinutes && nowMinutes - m <= GRACE_WINDOW_MIN) {
                if (getStored<number | null>(notifiedKey(key as string), null)) continue;
                const name = t(`prayer.${key}` as never);
                const body = language === 'ar' ? `حان الآن وقت صلاة ${name}` : `Time for ${name} prayer`;
                showNotification(key, name, body);
            }
        }
    }, [language, showNotification, t]);

    const scheduleNextRef = useRef<() => void>(() => {});

    const scheduleNext = useCallback(() => {
        if (permissionRef.current !== 'granted') return;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let nextKey: keyof PrayerTimes | null = null;
        let nextMinutes = Infinity;
        for (const key of PRAYER_KEYS) {
            let m = timeToMinutes(timesRef.current[key]);
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
            const body = language === 'ar' ? `حان الآن وقت صلاة ${name}` : `Time for ${name} prayer`;
            showNotification(nextKey as keyof PrayerTimes, name, body);
            scheduleNextRef.current();
        }, Math.max(delayMs, 1000));
    }, [language, showNotification, t]);

    useEffect(() => {
        scheduleNextRef.current = scheduleNext;
    }, [scheduleNext]);

    // Schedule the next prayer whenever permission is granted and times are available.
    useEffect(() => {
        if (permission !== 'granted' || !times) return;
        catchUpMissed();
        scheduleNext();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [permission, times, catchUpMissed, scheduleNext]);

    // Browsers throttle background-tab timers; when the tab regains focus,
    // catch up on any prayer time that passed while away.
    useEffect(() => {
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                catchUpMissed();
                scheduleNext();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [catchUpMissed, scheduleNext]);

    const enable = async () => {
        let result: NotificationPermission = 'denied';
        if ('Notification' in window) {
            result = await Notification.requestPermission();
        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Trigger the iOS permission prompt via the Permissions API.
            const status = await navigator.permissions.query({ name: 'notifications' as PermissionName });
            result = status.state as NotificationPermission;
        }
        setPermission(result);
        if (result === 'granted') {
            catchUpMissed();
            scheduleNext();
        }
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