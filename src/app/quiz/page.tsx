'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, BookOpenText, RefreshCw, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { Riwaya, normalizeRiwaya } from '@/lib/riwaya';
import { SurahContent } from '@/types';
import { DEFAULT_MEMORIZATION_STATE, MEMORIZATION_STORAGE_KEY, getAllMasteredVerses, getDueVerses } from '@/lib/memorization';
import { QuizVerse } from '@/lib/quiz';
import MemorizationQuiz from '@/components/quran/MemorizationQuiz';

type QuizSource = 'mastered' | 'due';

function readRiwaya(): Riwaya {
    if (typeof document === 'undefined') return 'hafs';
    const match = document.cookie.split(';').map((p) => p.trim()).find((p) => p.startsWith('nur-riwaya='));
    return match ? normalizeRiwaya(match.split('=')[1]) : 'hafs';
}

export default function QuizPage() {
    const { t } = useLanguage();
    const [progress] = useStoredState(MEMORIZATION_STORAGE_KEY, DEFAULT_MEMORIZATION_STATE);
    const [source, setSource] = useState<QuizSource>('mastered');
    const [surahFilter, setSurahFilter] = useState<string | null>(null);
    const [riwaya, setRiwaya] = useState<Riwaya>('hafs');
    const [verses, setVerses] = useState<QuizVerse[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRiwaya(readRiwaya());
        const match = window.location.search.match(/[?&]surah=(\d+)/);
        if (match) setSurahFilter(match[1].padStart(3, '0'));
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        setVerses(null);
        try {
            const candidates = source === 'due' ? getDueVerses(progress) : getAllMasteredVerses(progress);
            const list = surahFilter ? candidates.filter((m) => m.surahId === surahFilter) : candidates;
            const surahIds = [...new Set(list.map((m) => m.surahId))];
            const fetched = await Promise.all(
                surahIds.map(async (id) => {
                    const res = await fetch(`/api/quran/surah/${id}`);
                    if (!res.ok) throw new Error(`surah ${id}: ${res.status}`);
                    return (await res.json()) as SurahContent;
                })
            );
            const byId = new Map(fetched.map((s) => [s.index, s]));
            const pool: QuizVerse[] = list.flatMap((m) => {
                const surah = byId.get(m.surahId);
                if (!surah) return [];
                const text = surah.verse[`verse_${m.verseNum}`] ?? surah.verse[m.verseNum];
                if (!text) return [];
                return [{
                    surahId: m.surahId,
                    surahName: surah.name,
                    verseNum: m.verseNum,
                    text,
                    translation: '',
                }];
            });
            setVerses(pool);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'failed');
        } finally {
            setLoading(false);
        }
    }, [source, surahFilter, progress]);

    useEffect(() => {
        load();
    }, [load]);

    const switchSource = (s: QuizSource) => {
        setSource(s);
        setVerses(null);
    };

    return (
        <div className="min-h-screen pt-20 md:pt-28 px-4 md:px-12 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    titleKey="quiz.title"
                    subtitleKey="quiz.page_subtitle"
                    titleClassName="text-emerald-800 dark:text-emerald-400"
                />

                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <button
                        onClick={() => switchSource('mastered')}
                        aria-pressed={source === 'mastered'}
                        className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                            source === 'mastered'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white dark:bg-night-900 border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400'
                        )}
                    >
                        <BookOpenText size={14} />
                        {t('quiz.source_mastered')}
                    </button>
                    <button
                        onClick={() => switchSource('due')}
                        aria-pressed={source === 'due'}
                        className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                            source === 'due'
                                ? 'bg-violet-600 text-white border-violet-600'
                                : 'bg-white dark:bg-night-900 border-slate-200 dark:border-slate-800 text-violet-700 dark:text-violet-400 hover:border-violet-400'
                        )}
                    >
                        <RefreshCw size={14} />
                        {t('quiz.source_due')}
                    </button>
                    {surahFilter && (
                        <button
                            onClick={() => { setSurahFilter(null); setVerses(null); }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        >
                            <ArrowLeft size={14} className="rtl:rotate-180" />
                            {t('quiz.clear_surah')}
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                        <Loader2 size={28} className="animate-spin" />
                        <p className="text-sm">{t('quiz.loading')}</p>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-center text-sm text-red-600 dark:text-red-400 py-10">{t('quiz.load_error')}</p>
                )}

                {!loading && !error && verses !== null && (
                    <MemorizationQuiz verses={verses} riwaya={riwaya} onExit={() => window.history.back()} />
                )}
            </div>
        </div>
    );
}