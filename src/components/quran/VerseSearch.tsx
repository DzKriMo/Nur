'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Loader2, BookMarked } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';

interface VerseResult {
    surahId: string;
    surahName: string;
    surahNameAr: string;
    verseNum: string;
    arabic: string;
    english: string;
    href: string;
}

export default function VerseSearch() {
    const { t } = useLanguage();
    const { isVerseBookmarked, toggleVerseBookmark, lastRead } = useBookmarks();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<VerseResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const performSearch = useCallback(async (q: string) => {
        if (q.trim().length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/quran/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.results ?? []);
            setSearched(true);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const onQueryChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => performSearch(value), 400);
    };

    return (
        <div className="space-y-6">
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-emerald-400">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={t('quran.verse_search_placeholder')}
                    className="w-full ps-10 pe-4 py-3.5 bg-white dark:bg-night-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all text-slate-900 dark:text-white placeholder-slate-400 text-base shadow-sm"
                />
            </div>

            {lastRead && !searched && (
                <div className="text-center">
                    <Link
                        href={`/quran/${lastRead.surahId}#verse-${lastRead.verseNum}`}
                        className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        <BookMarked size={16} />
                        {t('quran.continue_reading')}: {lastRead.surahName} - {t('quran.ayah')} {lastRead.verseNum}
                    </Link>
                </div>
            )}

            {searched && results.length === 0 && !loading && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-12">
                    {t('quran.no_verse_results')} &quot;{query}&quot;
                </div>
            )}

            <div className="space-y-4 max-w-3xl mx-auto">
                {results.map((r) => (
                    <div
                        key={`${r.surahId}-${r.verseNum}`}
                        className="bg-white dark:bg-night-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <Link
                                href={r.href}
                                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                {t('quran.chapter')} {r.surahName} <span className="font-arabic">{r.surahNameAr}</span> - {t('quran.ayah')} {r.verseNum}
                            </Link>
                            <button
                                onClick={() => toggleVerseBookmark({
                                    surahId: r.surahId,
                                    verseNum: r.verseNum,
                                    surahName: r.surahName,
                                    surahNameAr: r.surahNameAr,
                                })}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    isVerseBookmarked(r.surahId, r.verseNum)
                                        ? 'text-emerald-500'
                                        : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                                }`}
                                title={t('quran.save_verse')}
                            >
                                <BookMarked size={15} fill={isVerseBookmarked(r.surahId, r.verseNum) ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <p className="text-right text-lg leading-[2] font-arabic text-slate-800 dark:text-slate-100 mb-3">
                            {r.arabic}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                            {r.english}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
