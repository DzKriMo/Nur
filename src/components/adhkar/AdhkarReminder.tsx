'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellRing, BellOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState, getStored, setStored } from '@/lib/storage';

type ReminderPart = 'morning' | 'evening';

interface ReminderSetting {
    enabled: boolean;
    time: string;
}

const ADHKAR_REMINDERS_KEY = 'nur-adhkar-reminders';
const GRACE_WINDOW_MIN = 60;

const DEFAULT_REMINDERS: Record<ReminderPart, ReminderSetting> = {
    morning: { enabled: false, time: '06:00' },
    evening: { enabled: false, time: '17:30' },
};

const PART_PAGES: Record<ReminderPart, string> = {
    morning: '/adhkar/azkar_sabah.json',
    evening: '/adhkar/azkar_massa.json',
};

function notifiedKey(part: ReminderPart, date = new Date()): string {
    const ymd = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return `nur-adhkar-notified-${part}-${ymd}`;
}

function minutesOf(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

/** Next Date at which the given HH:MM time occurs (today if still ahead). */
function nextOccurrence(time: string): Date {
    const date = new Date();
    const target = minutesOf(time);
    const now = date.getHours() * 60 + date.getMinutes();
    date.setHours(Math.floor(target / 60), target % 60, 0, 0);
    if (target <= now) date.setDate(date.getDate() + 1);
    return date;
}

export default function AdhkarReminder() {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [reminders, setReminders] = useStoredState<Record<ReminderPart, ReminderSetting>>(
        ADHKAR_REMINDERS_KEY,
        DEFAULT_REMINDERS
    );
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
    const timersRef = useRef<Partial<Record<ReminderPart, ReturnType<typeof setTimeout>>>>({});
    const remindersRef = useRef(reminders);
    const permissionRef = useRef<NotificationPermission | 'unsupported'>('unsupported');
    const tRef = useRef(t);
    const isArRef = useRef(isAr);

    useEffect(() => {
        remindersRef.current = reminders;
    }, [reminders]);
    useEffect(() => {
        permissionRef.current = permission;
    }, [permission]);
    useEffect(() => {
        tRef.current = t;
        isArRef.current = isAr;
    }, [t, isAr]);

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

    const showNotification = useCallback((part: ReminderPart) => {
        const page = PART_PAGES[part];
        const tag = `adhkar-${part}-${new Date().toDateString()}`;
        const body = tRef.current(`adhkar.reminder_body_${part}` as never);
        const options: NotificationOptions = {
            body,
            tag,
            icon: '/icon.svg',
            data: { url: page },
        };
        try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready
                    .then((reg) => reg.showNotification(tRef.current(`adhkar.reminder_${part}` as never), options))
                    .catch(() => {
                        if ('Notification' in window) new Notification(tRef.current(`adhkar.reminder_${part}` as never), options);
                    });
            } else if ('Notification' in window) {
                new Notification(tRef.current(`adhkar.reminder_${part}` as never), options);
            }
        } catch {
            // notifications not allowed
        }
        setStored(notifiedKey(part), Date.now());
    }, []);

    const scheduleAll = useCallback(() => {
        const parts = Object.keys(PART_PAGES) as ReminderPart[];
        for (const part of parts) {
            if (timersRef.current[part]) {
                clearTimeout(timersRef.current[part]);
                timersRef.current[part] = undefined;
            }
            const setting = remindersRef.current[part];
            if (!setting.enabled || permissionRef.current !== 'granted') continue;

            const delayMs = nextOccurrence(setting.time).getTime() - Date.now();
            timersRef.current[part] = setTimeout(() => {
                showNotification(part);
                // Re-arm for the next day.
                if (timersRef.current[part]) clearTimeout(timersRef.current[part]);
                timersRef.current[part] = setTimeout(
                    () => showNotification(part),
                    nextOccurrence(remindersRef.current[part].time).getTime() - Date.now()
                );
            }, Math.max(delayMs, 1000));
        }
    }, [showNotification]);

    // Fire a notification if a reminder time passed while the tab was away
    // and it hasn't been sent today yet.
    const catchUpMissed = useCallback(() => {
        if (permissionRef.current !== 'granted') return;
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        for (const part of Object.keys(PART_PAGES) as ReminderPart[]) {
            const setting = remindersRef.current[part];
            if (!setting.enabled) continue;
            const target = minutesOf(setting.time);
            if (target <= nowMinutes && nowMinutes - target <= GRACE_WINDOW_MIN) {
                if (getStored<number | null>(notifiedKey(part), null)) continue;
                showNotification(part);
            }
        }
    }, [showNotification]);

    useEffect(() => {
        if (permission !== 'granted') return;
        catchUpMissed();
        scheduleAll();
        const timers = timersRef.current;
        return () => {
            for (const part of Object.keys(PART_PAGES) as ReminderPart[]) {
                if (timers[part]) clearTimeout(timers[part]);
            }
        };
    }, [permission, reminders, catchUpMissed, scheduleAll]);

    useEffect(() => {
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                catchUpMissed();
                scheduleAll();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [catchUpMissed, scheduleAll]);

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

    const toggle = async (part: ReminderPart) => {
        const current = reminders[part];
        if (current.enabled) {
            setReminders((prev) => ({ ...prev, [part]: { ...prev[part], enabled: false } }));
            return;
        }
        if (permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return;
        }
        setReminders((prev) => ({ ...prev, [part]: { ...prev[part], enabled: true } }));
    };

    const setTime = (part: ReminderPart, time: string) => {
        setReminders((prev) => ({ ...prev, [part]: { ...prev[part], time } }));
    };

    if (permission === 'unsupported') return null;

    const Icon = permission === 'granted' ? BellRing : permission === 'denied' ? BellOff : Bell;

    return (
        <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                    <Icon size={18} />
                </span>
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('adhkar.reminder')}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('adhkar.reminder_desc')}</p>
                </div>
            </div>

            {permission === 'denied' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <BellOff size={13} />
                    {t('adhkar.reminder_denied')}
                </p>
            )}

            <div className="mt-4 space-y-3">
                {(['morning', 'evening'] as ReminderPart[]).map((part) => {
                    const setting = reminders[part];
                    return (
                        <div
                            key={part}
                            className={cn(
                                'flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors',
                                setting.enabled
                                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-900/15'
                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-night-800'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-700 text-gold-600 dark:text-gold-300">
                                    <Sparkles size={15} />
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {t(`adhkar.reminder_${part}` as never)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={setting.time}
                                    onChange={(e) => setTime(part, e.target.value)}
                                    className="px-2 py-1.5 rounded-lg text-sm bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    disabled={!setting.enabled}
                                />
                                <button
                                    onClick={() => toggle(part)}
                                    aria-pressed={setting.enabled}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                                        setting.enabled
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                    )}
                                >
                                    {setting.enabled ? (
                                        <>
                                            <BellRing size={13} />
                                            {isAr ? 'مفعّل' : 'On'}
                                        </>
                                    ) : (
                                        <>
                                            <Bell size={13} />
                                            {isAr ? 'تفعيل' : 'Enable'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}