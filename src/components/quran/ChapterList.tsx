'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SurahMeta } from '@/types';
import { Search, Bookmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChapterListProps {
    surahs: SurahMeta[];
    lastRead?: { surahId: string; verseNum: string; surahName: string } | null;
}

export default function ChapterList({ surahs, lastRead }: ChapterListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useLanguage();

    const filteredSurahs = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return surahs.filter((surah) =>
            surah.title.toLowerCase().includes(query) ||
            surah.titleAr.includes(query) ||
            surah.index.toString().includes(query)
        );
    }, [surahs, searchQuery]);

    return (
        <div className="space-y-8">
            {lastRead && (
                <Link
                    href={`/quran/${lastRead.surahId}#verse-${lastRead.verseNum}`}
                    className="block bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Bookmark size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t('quran.last_read')}</p>
                            <p className="font-bold text-slate-900 dark:text-white">{lastRead.surahName} - {t('quran.verse')} {lastRead.verseNum}</p>
                        </div>
                    </div>
                </Link>
            )}

            <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder={t('quran.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                    <Link
                        href={`/quran/${surah.index}`}
                        key={surah.index}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-serif text-base group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {parseInt(surah.index)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {surah.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-arabic">
                                        {surah.titleAr}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    surah.type === 'Mecca' || surah.type === 'Makkiyah'
                                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                }`}>
                                    {surah.type === 'Mecca' || surah.type === 'Makkiyah' ? t('quran.meccan') : t('quran.medinan')}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {surah.count} {t('common.verses')}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredSurahs.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-12">
                    {t('quran.no_results')} &quot;{searchQuery}&quot;
                </div>
            )}
        </div>
    );
}
