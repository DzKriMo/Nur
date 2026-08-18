'use client';

import { useState, useMemo } from 'react';
import { Search, BookMarked, Share2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { Hadith } from '@/types';

interface HadithListProps {
    hadiths: Hadith[];
    bookId: string;
    bookName: string;
    bookNameAr: string;
}

export default function HadithList({ hadiths, bookId, bookName, bookNameAr }: HadithListProps) {
    const [query, setQuery] = useState('');
    const { t } = useLanguage();
    const { isHadithFavorite, toggleHadithFavorite } = useBookmarks();
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const filteredHadiths = useMemo(() => {
        if (!query.trim()) return hadiths;
        return hadiths.filter((hadith) =>
            hadith.english.text.toLowerCase().includes(query.toLowerCase()) ||
            hadith.english.narrator.toLowerCase().includes(query.toLowerCase()) ||
            hadith.arabic.includes(query) ||
            hadith.idInBook.toString().includes(query)
        );
    }, [hadiths, query]);

    const shareHadith = async (hadith: Hadith) => {
        const shareText = `${hadith.english.narrator} — ${hadith.english.text}\n\n(${bookName}, Hadith ${hadith.idInBook})\n${hadith.arabic}`;
        if (navigator.share) {
            try { await navigator.share({ text: shareText }); } catch {}
        } else {
            await navigator.clipboard.writeText(shareText);
            setCopiedId(hadith.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-stone-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('hadith.search_hadiths')}
                    className="w-full ps-10 pe-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                />
            </div>

            <div className="space-y-4">
                {filteredHadiths.map((hadith) => (
                    <div
                        key={hadith.id}
                        className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-stone-100 dark:border-stone-800 pb-3">
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                {t('hadith.number')} {hadith.idInBook}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => shareHadith(hadith)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                                    title={t('common.share')}
                                >
                                    {copiedId === hadith.id ? <Check size={14} className="text-amber-500" /> : <Share2 size={14} />}
                                </button>
                                <button
                                    onClick={() => toggleHadithFavorite({
                                        bookId,
                                        chapterId: hadith.chapterId,
                                        hadithId: hadith.id,
                                        idInBook: hadith.idInBook,
                                        arabic: hadith.arabic,
                                        narrator: hadith.english.narrator,
                                        text: hadith.english.text,
                                        bookName,
                                        bookNameAr,
                                    })}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                        isHadithFavorite(bookId, hadith.id)
                                            ? "text-amber-500"
                                            : "text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
                                    }`}
                                    title={t('hadith.save_hadith')}
                                >
                                    <BookMarked size={14} fill={isHadithFavorite(bookId, hadith.id) ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-right">
                                <p className="text-xl md:text-2xl leading-loose font-arabic text-stone-800 dark:text-stone-200" dir="rtl">
                                    {hadith.arabic}
                                </p>
                            </div>

                            <div className="text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-4">
                                <p className="font-semibold mb-2 text-stone-900 dark:text-white text-sm">{hadith.english.narrator}</p>
                                <p className="text-sm">{hadith.english.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHadiths.length === 0 && (
                <div className="text-center py-12 text-stone-500 dark:text-stone-400">
                    {t('hadith.no_hadiths')}
                </div>
            )}
        </div>
    );
}