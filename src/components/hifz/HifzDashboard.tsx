'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { SurahMeta } from '@/types';
import { Target, Flame, CheckCircle2, BookOpenText, TrendingUp, CalendarDays, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';
import {
    DEFAULT_MEMORIZATION_STATE,
    MEMORIZATION_STORAGE_KEY,
    dayKey,
    getGlobalStats,
    getMasteryPerSurah,
    getWeakWordsGlobal,
    getActivityDays,
} from '@/lib/memorization';

const HEATMAP_WEEKS = 16;

interface HifzDashboardProps {
    surahs: SurahMeta[];
}

export default function HifzDashboard({ surahs }: HifzDashboardProps) {
    const { t } = useLanguage();
    const [progress] = useStoredState(MEMORIZATION_STORAGE_KEY, DEFAULT_MEMORIZATION_STATE);

    const stats = useMemo(() => getGlobalStats(progress), [progress]);
    const mastery = useMemo(() => getMasteryPerSurah(progress), [progress]);
    const weakWords = useMemo(() => getWeakWordsGlobal(progress), [progress]);
    const totalQuranVerses = useMemo(() => surahs.reduce((n, s) => n + s.count, 0), [surahs]);

    const heatmap = useMemo(() => {
        const map = new Map(getActivityDays(progress).map((d) => [d.key, d.count]));
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - (HEATMAP_WEEKS * 7 - 1));
        const startDay = start.getDay();
        if (startDay !== 0) start.setDate(start.getDate() - startDay);
        const weeks: { date: Date; count: number }[][] = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            const week: { date: Date; count: number }[] = [];
            for (let i = 0; i < 7; i++) {
                week.push({ date: new Date(cursor), count: map.get(dayKey(cursor)) ?? 0 });
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push(week);
        }
        const max = Math.max(1, ...map.values());
        return { weeks, max };
    }, [progress]);

    const monthLabels = useMemo(() => {
        const labels: { text: string; col: number }[] = [];
        let lastMonth = -1;
        heatmap.weeks.forEach((week, col) => {
            const m = week[0].date.getMonth();
            if (m !== lastMonth) {
                labels.push({ text: week[0].date.toLocaleDateString('en', { month: 'short' }), col });
                lastMonth = m;
            }
        });
        return labels;
    }, [heatmap]);

    const statsCards = [
        {
            icon: Target,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            value: `${stats.todayCount}<span class="text-xs font-normal opacity-60">/${stats.dailyGoal}</span>`,
            label: t('quran.today'),
            sub: stats.todayCount >= stats.dailyGoal && stats.todayCount > 0 ? t('hifz.goal_met') : t('hifz.goal_hint'),
        },
        {
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-100 dark:bg-orange-900/30',
            value: String(stats.streak),
            label: t('quran.streak'),
            sub: `${stats.activeDays} ${t('hifz.active_days')}`,
        },
        {
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            value: String(stats.totalMastered),
            label: t('quran.memorized_total'),
            sub: `${Math.round((stats.totalMastered / Math.max(1, totalQuranVerses)) * 100)}% ${t('hifz.of_quran')}`,
        },
        {
            icon: BookOpenText,
            color: 'text-violet-500',
            bg: 'bg-violet-100 dark:bg-violet-900/30',
            value: String(stats.dueCount),
            label: t('hifz.due_review'),
            sub: t('hifz.srs_due'),
        },
        {
            icon: TrendingUp,
            color: 'text-sky-500',
            bg: 'bg-sky-100 dark:bg-sky-900/30',
            value: `${stats.averageAccuracy}%`,
            label: t('hifz.avg_accuracy'),
            sub: `${stats.totalAttempts} ${t('hifz.attempts')}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {statsCards.map(({ icon: Icon, color, bg, value, label, sub }) => (
                    <div key={label} className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4">
                        <div className={cn('flex items-center justify-center w-9 h-9 rounded-xl mb-2', bg, color)}>
                            <Icon size={17} />
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: value }} />
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarDays size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('hifz.activity')}</h3>
                    <span className="ml-auto text-xs text-slate-400">
                        {t('hifz.last')} {HEATMAP_WEEKS * 7} {t('common.days')}
                    </span>
                </div>
                <div className="overflow-x-auto pb-2">
                    <div className="flex gap-1.5 min-w-max">
                        <div className="flex flex-col gap-1 pr-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                <span key={d} className="text-[9px] text-slate-400 h-3.5 flex items-center">
                                    {i % 2 === 0 ? d : ''}
                                </span>
                            ))}
                        </div>
                        {heatmap.weeks.map((week, col) => (
                            <div key={col} className="flex flex-col gap-1">
                                {week.map(({ date, count }) => (
                                    <div
                                        key={date.toDateString()}
                                        className="w-3.5 h-3.5 rounded-[3px]"
                                        title={`${date.toLocaleDateString()} — ${count} ${count === 1 ? t('hifz.verse_unit') : t('hifz.verses_unit')}`}
                                        style={{
                                            backgroundColor: count === 0
                                                ? 'var(--color-cell-empty)'
                                                : `rgba(5, 150, 105, ${0.15 + 0.85 * (count / heatmap.max)})`,
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {monthLabels.length > 0 && (
                    <div className="flex gap-1.5 ml-5 mt-1.5 min-w-max overflow-hidden">
                        {monthLabels.map(({ text, col }) => (
                            <span key={`${text}-${col}`} className="text-[9px] text-slate-400" style={{ marginLeft: col * 20 }}>
                                {text}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-slate-400">
                    {t('hifz.less')}
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className="w-3 h-3 rounded-[3px]"
                            style={{ backgroundColor: i === 0 ? 'var(--color-cell-empty)' : `rgba(5, 150, 105, ${0.15 + 0.85 * (i / 4)})` }}
                        />
                    ))}
                    {t('hifz.more')}
                </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <BookOpenText size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('hifz.surah_mastery')}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-night-700 inline-block" />{t('hifz.not_started')}</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400/60 inline-block" />{t('hifz.in_progress')}</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />{t('hifz.complete')}</span>
                    </div>
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2.1rem, 1fr))' }}>
                    {[...surahs]
                        .sort((a, b) => parseInt(a.index) - parseInt(b.index))
                        .map((surah) => {
                            const mastered = mastery[surah.index] ?? 0;
                            const frac = mastered / Math.max(1, surah.count);
                            const pct = Math.round(frac * 100);
                            return (
                                <Link
                                    key={surah.index}
                                    href={`/quran/${surah.index}`}
                                    title={`${surah.title} — ${mastered}/${surah.count} (${pct}%)`}
                                    className={cn(
                                        'h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-transform hover:scale-110',
                                        frac === 0 && 'bg-slate-100 dark:bg-night-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700',
                                        frac > 0 && frac < 1 && 'bg-amber-400/40 text-amber-800 dark:text-amber-200 hover:bg-amber-400/60',
                                        frac >= 1 && 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    )}
                                >
                                    {parseInt(surah.index)}
                                </Link>
                            );
                        })}
                </div>
            </div>

            {weakWords.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        <AlertCircle size={16} className="text-amber-500" />
                        {t('hifz.global_weak_words')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {weakWords.map(({ word, count }) => (
                            <span key={word} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                                <span className="font-arabic">{word}</span>
                                <span className="opacity-60">{count}×</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}