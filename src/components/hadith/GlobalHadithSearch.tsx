'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Loader2, BookMarked } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';

interface SearchResult {
    bookId: string;
    bookName: string;
    bookNameAr: string;
    chapterId: number;
    hadithId: number;
    idInBook: number;
    arabic: string;
    narrator: string;
    text: string;
    href: string;
}

export default function GlobalHadithSearch() {
    const { t } = useLanguage();
    const { isHadithFavorite, toggleHadithFavorite } = useBookmarks();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
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
            const res = await fetch(`/api/hadith/search?q=${encodeURIComponent(q)}`);
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
        debounceRef.current = setTimeout(() => performSearch(value), 450);
    };

    return (
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 p-6 mb-10">
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-amber-500">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={t('hadith.search_all_placeholder')}
                    className="w-full ps-10 pe-4 py-3.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all text-stone-900 dark:text-stone-100 placeholder-stone-400 text-base"
                />
            </div>

            {searched && results.length === 0 && !loading && (
                <div className="text-center text-stone-500 dark:text-stone-400 py-10">
                    {t('hadith.no_search_results')}
                </div>
            )}

            {searched && results.length > 0 && !loading && (
                <div className="mt-6">
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                        {t('hadith.results_for')} &quot;{query}&quot;
                    </p>
                    <div className="space-y-4">
                        {results.map((r) => (
                            <div key={`${r.bookId}-${r.hadithId}`} className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-5 border border-stone-100 dark:border-stone-700">
                                <div className="flex justify-between items-center mb-3">
                                    <Link
                                        href={r.href}
                                        className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:underline"
                                    >
                                        {r.bookName} {t('hadith.in_book')} {t('hadith.number')} {r.idInBook}
                                    </Link>
                                    <button
                                        onClick={() => toggleHadithFavorite({
                                            bookId: r.bookId,
                                            chapterId: r.chapterId,
                                            hadithId: r.hadithId,
                                            idInBook: r.idInBook,
                                            arabic: r.arabic,
                                            narrator: r.narrator,
                                            text: r.text,
                                            bookName: r.bookName,
                                            bookNameAr: r.bookNameAr,
                                        })}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                            isHadithFavorite(r.bookId, r.hadithId)
                                                ? 'text-amber-500'
                                                : 'text-stone-300 dark:text-stone-600 hover:text-amber-500'
                                        }`}
                                        title={t('hadith.save_hadith')}
                                    >
                                        <BookMarked size={15} fill={isHadithFavorite(r.bookId, r.hadithId) ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                                <p className="text-right text-lg leading-loose font-arabic text-stone-800 dark:text-stone-200 mb-3">
                                    {r.arabic}
                                </p>
                                <p className="text-sm text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-700 pt-3 line-clamp-3">
                                    <span className="font-semibold">{r.narrator}</span> — {r.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}