'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookMarked, MessageSquareQuote, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';

type Tab = 'quran' | 'hadith';

export default function SavedItems() {
    const { t } = useLanguage();
    const {
        quranBookmarks,
        removeVerseBookmark,
        hadithFavorites,
        removeHadithFavorite,
    } = useBookmarks();
    const [tab, setTab] = useState<Tab>('quran');

    const tabs: { id: Tab; label: string; icon: typeof BookMarked }[] = [
        { id: 'quran', label: t('quran.saved_verses'), icon: BookMarked },
        { id: 'hadith', label: t('hadith.saved_hadiths'), icon: MessageSquareQuote },
    ];

    return (
        <div className="min-h-screen bg-parchment-50 dark:bg-night-950 pb-20 md:pt-16">
            <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t('home.saved')}
                    </h1>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex gap-2 mb-6">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                tab === id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white dark:bg-night-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                            }`}
                        >
                            <Icon size={15} />
                            {label}
                            <span className={`text-xs px-1.5 rounded-full ${
                                tab === id ? 'bg-white/20' : 'bg-slate-100 dark:bg-night-800'
                            }`}>
                                {id === 'quran' ? quranBookmarks.length : hadithFavorites.length}
                            </span>
                        </button>
                    ))}
                </div>

                {tab === 'quran' && (
                    quranBookmarks.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                            <BookMarked size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                            {t('quran.no_saved_verses')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {quranBookmarks.map((b) => (
                                <div key={`${b.surahId}-${b.verseNum}`} className="bg-white dark:bg-night-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-3">
                                        <Link
                                            href={`/quran/${b.surahId}#verse-${b.verseNum}`}
                                            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            {t('quran.chapter')} {b.surahName} <span className="font-arabic">{b.surahNameAr}</span> - {t('quran.ayah')} {b.verseNum}
                                        </Link>
                                        <button
                                            onClick={() => removeVerseBookmark(b.surahId, b.verseNum)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                            title={t('common.remove')}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <Link href={`/quran/${b.surahId}#verse-${b.verseNum}`} className="block text-right text-lg leading-[2] font-arabic text-slate-800 dark:text-slate-100">
                                        {t('quran.go_to_verse')} ←
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {tab === 'hadith' && (
                    hadithFavorites.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                            <MessageSquareQuote size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                            {t('hadith.no_saved_hadiths')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {hadithFavorites.map((f) => (
                                <div key={`${f.bookId}-${f.hadithId}`} className="bg-white dark:bg-night-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-3">
                                        <Link
                                            href={`/hadith/${f.bookId}/${f.chapterId}`}
                                            className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:underline"
                                        >
                                            {f.bookName} - {t('hadith.number')} {f.idInBook}
                                        </Link>
                                        <button
                                            onClick={() => removeHadithFavorite(f.bookId, f.hadithId)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                            title={t('common.remove')}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <p className="text-right text-lg leading-loose font-arabic text-stone-800 dark:text-stone-200 mb-3">
                                        {f.arabic}
                                    </p>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3">
                                        <span className="font-semibold">{f.narrator}</span> — {f.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>
        </div>
    );
}
