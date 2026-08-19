'use client';

import { useMemo } from 'react';
import { CalendarCheck, Flame, Sunrise, Sun, CloudSun, Sunset, Moon, Check, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';

type PrayerStatus = 'done' | 'qada';

type FardKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface DayLog {
    [key: string]: PrayerStatus | undefined;
}

type PrayerLog = Record<string, DayLog>;

const PRAYER_LOG_KEY = 'nur-prayer-log';

const FARD_KEYS: { key: FardKey; icon: typeof Sunrise }[] = [
    { key: 'fajr', icon: Sunrise },
    { key: 'dhuhr', icon: Sun },
    { key: 'asr', icon: CloudSun },
    { key: 'maghrib', icon: Sunset },
    { key: 'isha', icon: Moon },
];

function ymd(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isComplete(day: DayLog | undefined): boolean {
    return !!day && FARD_KEYS.every(({ key }) => day[key] === 'done' || day[key] === 'qada');
}

function computeStreak(log: PrayerLog, today: Date): number {
    let streak = 0;
    const d = new Date(today);
    if (!isComplete(log[ymd(d)])) d.setDate(d.getDate() - 1);
    while (isComplete(log[ymd(d)])) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

export default function PrayerTracker() {
    const { t } = useLanguage();
    const [log, setLog] = useStoredState<PrayerLog>(PRAYER_LOG_KEY, {});
    const today = useMemo(() => new Date(), []);

    const todayLog = log[ymd(today)] ?? {};

    const stats = useMemo(() => {
        const week: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            week.push(ymd(d));
        }
        const recorded = week.reduce((n, k) => n + Object.keys(log[k] ?? {}).length, 0);
        const completeDays = week.filter((k) => isComplete(log[k])).length;
        return { recorded, completeDays, streak: computeStreak(log, today) };
    }, [log, today]);

    const toggle = (key: FardKey, status: PrayerStatus) => {
        const day = ymd(today);
        setLog((prev) => {
            const current = prev[day]?.[key];
            const next = current === status ? undefined : status;
            return {
                ...prev,
                [day]: { ...(prev[day] ?? {}), [key]: next },
            };
        });
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                        <CalendarCheck size={18} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('prayer.tracker_title')}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('prayer.tracker_desc')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold" title={t('prayer.tracker_streak')}>
                    <Flame size={15} />
                    {stats.streak}
                    <span className="text-[11px] font-medium opacity-80">{t('prayer.tracker_streak')}</span>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {FARD_KEYS.map(({ key, icon: Icon }) => {
                    const status = todayLog[key];
                    return (
                        <div
                            key={key}
                            className={cn(
                                'flex items-center justify-between gap-2 rounded-xl border p-2.5 transition-colors',
                                status === 'done' && 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-900/15',
                                status === 'qada' && 'border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-900/15',
                                !status && 'border-slate-200 dark:border-slate-700'
                            )}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className={cn(
                                    'flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400',
                                    status && 'text-slate-700 dark:text-slate-200'
                                )}>
                                    <Icon size={16} />
                                </span>
                                <span className={cn(
                                    'text-sm font-medium truncate',
                                    status ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                                )}>
                                    {t(`prayer.${key}` as never)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => toggle(key, 'done')}
                                    aria-pressed={status === 'done'}
                                    className={cn(
                                        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                                        status === 'done'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-400'
                                    )}
                                >
                                    <Check size={13} />
                                    {t('prayer.tracker_done')}
                                </button>
                                <button
                                    onClick={() => toggle(key, 'qada')}
                                    aria-pressed={status === 'qada'}
                                    className={cn(
                                        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                                        status === 'qada'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-700 dark:hover:text-amber-400'
                                    )}
                                >
                                    <Clock3 size={13} />
                                    {t('prayer.tracker_qada')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t('prayer.tracker_week')}</span>
                <span>
                    {stats.recorded} {t('prayer.tracker_recorded')} · {stats.completeDays} {t('prayer.tracker_complete_days')}
                </span>
            </div>
        </div>
    );
}