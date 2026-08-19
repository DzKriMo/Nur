'use client';

import { useState, useCallback, useMemo } from 'react';
import { Loader2, Layers, BookMarked } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';
import {
    DEFAULT_MEMORIZATION_STATE, MEMORIZATION_STORAGE_KEY, getAllMasteredVerses,
} from '@/lib/memorization';
import { SurahContent } from '@/types';
import MemorizationMode, { MemorizationExternalVerse } from './MemorizationMode';

/**
 * Cross-surah review: collects every mastered verse across all surahs and
 * runs the memorization session over them as a single review pass.
 */
export default function GlobalReview() {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [progress] = useStoredState(MEMORIZATION_STORAGE_KEY, DEFAULT_MEMORIZATION_STATE);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<{ surah: SurahContent; verses: MemorizationExternalVerse[] } | null>(null);

    const mastered = useMemo(() => getAllMasteredVerses(progress), [progress]);

    const start = useCallback(async () => {
        if (mastered.length === 0 || loading) return;
        setLoading(true);
        setError(null);
        try {
            const surahIds = [...new Set(mastered.map((m) => m.surahId))];
            const fetched = await Promise.all(
                surahIds.map(async (id) => {
                    const res = await fetch(`/api/quran/surah/${id}`);
                    if (!res.ok) throw new Error(`surah ${id}: ${res.status}`);
                    return (await res.json()) as SurahContent;
                })
            );
            const byId = new Map(fetched.map((s) => [s.index, s]));
            const verses: MemorizationExternalVerse[] = mastered.flatMap((m) => {
                const surah = byId.get(m.surahId);
                if (!surah) return [];
                const text = surah.verse[`verse_${m.verseNum}`] ?? surah.verse[m.verseNum];
                if (!text) return [];
                return [{ verseNum: m.verseNum, text, surahId: m.surahId, surahName: surah.name }];
            });
            if (verses.length === 0) throw new Error('empty');
            setSession({
                surah: {
                    index: 'review',
                    name: isAr ? 'مراجعة المحفوظ' : 'Global Review',
                    verse: Object.fromEntries(verses.map((v, i) => [`verse_${i + 1}`, v.text])),
                    count: verses.length,
                    juz: [],
                },
                verses,
            });
            setActive(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'failed');
        } finally {
            setLoading(false);
        }
    }, [mastered, loading, isAr]);

    if (active && session) {
        return (
            <MemorizationMode
                surah={session.surah}
                chapterId="review"
                externalVerses={session.verses}
                onExit={() => {
                    setActive(false);
                    setSession(null);
                }}
            />
        );
    }

    return (
        <div>
            <button
                onClick={start}
                disabled={mastered.length === 0 || loading}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:border-gold-500/50 hover:text-gold-600 dark:hover:text-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Layers size={15} />}
                {isAr ? 'مراجعة كل المحفوظ' : 'Review All Memorized'}
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    {mastered.length}
                </span>
            </button>
            {error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <BookMarked size={12} />
                    {isAr ? 'تعذّر تحميل المراجعة، حاول مرة أخرى' : 'Could not load review, please try again'}
                </p>
            )}
            {mastered.length === 0 && !error && (
                <p className="mt-2 text-xs text-slate-400">
                    {isAr ? 'أتقن آيات في وضع الحفظ لتتمكن من مراجعتها' : 'Master verses in memorize mode to review them here'}
                </p>
            )}
        </div>
    );
}