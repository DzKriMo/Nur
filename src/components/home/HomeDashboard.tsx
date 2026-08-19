'use client';

import Link from 'next/link';
import { BookMarked, MessageSquareQuote, Heart, BookOpen, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { getVerseOfDay } from '@/data/daily/verses';
import { getHadithOfDay } from '@/data/daily/hadiths';
import NextPrayerWidget from '@/components/prayer/NextPrayerWidget';

const ADHKAR_LINKS = [
    { href: '/adhkar/azkar_sabah.json', key: 'adhkar.morning' as const },
    { href: '/adhkar/azkar_massa.json', key: 'adhkar.evening' as const },
    { href: '/adhkar/PostPrayer_azkar.json', key: 'adhkar.post_prayer' as const },
];

export default function HomeDashboard() {
    const { t, language, dir } = useLanguage();
    const { lastRead, adhkarDoneToday, quranBookmarks, hadithFavorites, completedStories } = useBookmarks();

    const isAr = language === 'ar';
    const verse = getVerseOfDay();
    const hadith = getHadithOfDay();

    const verseText = isAr ? verse.arabic : verse.english;
    const verseRef = isAr ? verse.referenceAr : verse.reference;
    const hadithText = isAr ? hadith.arabic : hadith.english;
    const hadithRef = `${isAr ? hadith.bookAr : hadith.book}, ${t('hadith.number')} ${hadith.number}`;

    const savedCount = quranBookmarks.length + hadithFavorites.length;
    const completedStoriesCount = completedStories.length;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Verse of the day */}
                <Link
                    href="/quran"
                    className="group bg-white dark:bg-night-900 rounded-3xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                            <Star size={12} className="fill-emerald-400 text-emerald-400" />
                            {t('home.verse_of_day')}
                        </span>
                    </div>
                    <p className="text-xl leading-[2] font-arabic text-emerald-900 dark:text-emerald-100 mb-3 text-right flex-1">
                        {isAr ? verse.arabic : null}
                        {!isAr && <span className="text-slate-700 dark:text-slate-200 font-sans text-base leading-relaxed block text-left">{verseText}</span>}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{verseRef}</p>
                </Link>

                {/* Hadith of the day */}
                <Link
                    href="/hadith"
                    className="group bg-white dark:bg-night-900 rounded-3xl p-6 shadow-sm border border-amber-100 dark:border-amber-900/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                            <MessageSquareQuote size={12} />
                            {t('home.hadith_of_day')}
                        </span>
                    </div>
                    <p className="text-xl leading-loose font-arabic text-amber-900 dark:text-amber-100 mb-3 text-right flex-1">
                        {isAr ? hadithText : null}
                        {!isAr && <span className="text-slate-700 dark:text-slate-200 font-sans text-base leading-relaxed block text-left">{hadithText}</span>}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{hadithRef}</p>
                </Link>

                {/* Continue reading / saved */}
                <div className="bg-white dark:bg-night-900 rounded-3xl p-6 shadow-sm border border-violet-100 dark:border-violet-900/40 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-full">
                            <BookOpen size={12} />
                            {t('home.continue_reading')}
                        </span>
                        <NextPrayerWidget />
                    </div>

                    {lastRead ? (
                        <Link
                            href={`/quran/${lastRead.surahId}#verse-${lastRead.verseNum}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                        >
                            <BookOpen size={18} className="text-violet-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-violet-800 dark:text-violet-300 truncate">
                                    {lastRead.surahName} - {t('quran.ayah')} {lastRead.verseNum}
                                </p>
                                <p className="text-xs text-violet-500 dark:text-violet-400">{t('quran.continue_reading')}</p>
                            </div>
                            {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </Link>
                    ) : (
                        <Link
                            href="/quran"
                            className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                        >
                            <BookOpen size={18} className="text-violet-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{t('home.start_reading')}</span>
                        </Link>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/saved"
                            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm font-medium"
                        >
                            <BookMarked size={15} />
                            {t('home.saved')} ({savedCount})
                        </Link>
                        <Link
                            href="/stories"
                            className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm font-medium"
                        >
                            <Star size={15} className="fill-amber-400 text-amber-400" />
                            {t('stories.title')} ({completedStoriesCount})
                        </Link>
                    </div>
                </div>
            </div>

            {/* Daily Adhkar strip */}
            <div className="mt-5 bg-white dark:bg-night-900 rounded-3xl p-5 shadow-sm border border-rose-100 dark:border-rose-900/40">
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-full">
                        <Heart size={12} className="fill-rose-400 text-rose-400" />
                        {t('home.daily_adhkar')}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ADHKAR_LINKS.map(({ href, key }) => {
                        const isDailyOnce = !href.includes('PostPrayer');
                        const done = isDailyOnce && adhkarDoneToday[href.replace('/adhkar/', '')];
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                            >
                                <span className="text-sm font-medium text-rose-700 dark:text-rose-300">{t(key)}</span>
                                {done && (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                                        {t('home.done_today')}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}