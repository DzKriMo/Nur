'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellRing, BellOff, BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState, getStored, setStored } from '@/lib/storage';

interface ReminderSetting {
    enabled: boolean;
    time: string;
}

const HIFZ_REMINDER_KEY = 'nur-hifz-reminder';
const GRACE_WINDOW_MIN = 60;

const DEFAULT_REMINDER: ReminderSetting = { enabled: false, time: '18:00' };

function notifiedKey(date = new Date()): string {
    const ymd = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return `nur-hifz-notified-${ymd}`;
}

function minutesOf(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function nextOccurrence(time: string): Date {
    const date = new Date();
    const target = minutesOf(time);
    const now = date.getHours() * 60 + date.getMinutes();
    date.setHours(Math.floor(target / 60), target % 60, 0, 0);
    if (target <= now) date.setDate(date.getDate() + 1);
    return date;
}

export default function HifzReminder() {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [reminder, setReminder] = useStoredState<ReminderSetting>(HIFZ_REMINDER_KEY, DEFAULT_REMINDER);
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const reminderRef = useRef(reminder);
    const permissionRef = useRef<NotificationPermission | 'unsupported'>('unsupported');
    const tRef = useRef(t);

    useEffect(() => {
        reminderRef.current = reminder;
    }, [reminder]);
    useEffect(() => {
        permissionRef.current = permission;
    }, [permission]);
    useEffect(() => {
        tRef.current = t;
    }, [t]);

    useEffect(() => {
        if ('Notification' in window) {
            queueMicrotask(() => setPermission(Notification.permission));
        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.permissions
                .query({ name: 'notifications' as PermissionName })
                .then((status) => {
                    setPermission(status.state as NotificationPermission);
                    status.onchange = () => setPermission(status.state as NotificationPermission);
                })
                .catch(() => setPermission('default'));
        }
    }, []);

    const showNotification = useCallback(() => {
        const options: NotificationOptions = {
            body: tRef.current('hifz.reminder_body'),
            tag: `hifz-${new Date().toDateString()}`,
            icon: '/icon.svg',
            data: { url: '/hifz' },
        };
        try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready
                    .then((reg) => reg.showNotification(tRef.current('hifz.reminder_title'), options))
                    .catch(() => {
                        if ('Notification' in window) new Notification(tRef.current('hifz.reminder_title'), options);
                    });
            } else if ('Notification' in window) {
                new Notification(tRef.current('hifz.reminder_title'), options);
            }
        } catch {
            // notifications not allowed
        }
        setStored(notifiedKey(), Date.now());
    }, []);

    const schedule = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
        if (!reminderRef.current.enabled || permissionRef.current !== 'granted') return;
        const delayMs = nextOccurrence(reminderRef.current.time).getTime() - Date.now();
        timerRef.current = setTimeout(() => {
            showNotification();
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(
                () => showNotification(),
                nextOccurrence(reminderRef.current.time).getTime() - Date.now()
            );
        }, Math.max(delayMs, 1000));
    }, [showNotification]);

    const catchUpMissed = useCallback(() => {
        if (permissionRef.current !== 'granted') return;
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (!reminderRef.current.enabled) return;
        const target = minutesOf(reminderRef.current.time);
        if (target <= nowMinutes && nowMinutes - target <= GRACE_WINDOW_MIN) {
            if (getStored<number | null>(notifiedKey(), null)) return;
            showNotification();
        }
    }, [showNotification]);

    useEffect(() => {
        if (permission !== 'granted') return;
        catchUpMissed();
        schedule();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [permission, reminder, catchUpMissed, schedule]);

    useEffect(() => {
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                catchUpMissed();
                schedule();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [catchUpMissed, schedule]);

    const requestPermission = async (): Promise<boolean> => {
        let result: NotificationPermission = 'denied';
        if ('Notification' in window) {
            result = await Notification.requestPermission();
        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            const status = await navigator.permissions.query({ name: 'notifications' as PermissionName });
            result = status.state as NotificationPermission;
        }
        setPermission(result);
        return result === 'granted';
    };

    const toggle = async () => {
        if (reminder.enabled) {
            setReminder({ ...reminder, enabled: false });
            return;
        }
        if (permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return;
        }
        setReminder({ ...reminder, enabled: true });
    };

    if (permission === 'unsupported') return null;

    const Icon = permission === 'granted' ? BellRing : permission === 'denied' ? BellOff : Bell;

    return (
        <div className={cn(
            'rounded-2xl border shadow-sm p-5 transition-colors',
            reminder.enabled
                ? 'bg-emerald-50/70 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-night-900 border-slate-100 dark:border-slate-800'
        )}>
            <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                    <Icon size={18} />
                </span>
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('hifz.reminder_title')}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('hifz.reminder_desc')}</p>
                </div>
            </div>

            {permission === 'denied' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <BellOff size={13} />
                    {t('hifz.reminder_denied')}
                </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <BookOpenText size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
                        disabled={!reminder.enabled}
                        className="px-2 py-1.5 rounded-lg text-sm bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                    <span className="text-xs text-slate-400">{t('hifz.reminder_hint')}</span>
                </div>
                <button
                    onClick={toggle}
                    aria-pressed={reminder.enabled}
                    className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                        reminder.enabled
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    )}
                >
                    {reminder.enabled ? (
                        <>
                            <BellRing size={14} />
                            {isAr ? 'مفعّل' : 'On'}
                        </>
                    ) : (
                        <>
                            <Bell size={14} />
                            {isAr ? 'تفعيل' : 'Enable'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}