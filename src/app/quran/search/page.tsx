'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import VerseSearch from '@/components/quran/VerseSearch';

export default function QuranSearchPage() {
    const { t, dir } = useLanguage();

    return (
        <div className="min-h-screen bg-parchment-50 dark:bg-night-950 pb-20 md:pt-16">
            <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center">
                    <Link
                        href="/quran"
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span>{t('quran.back_to_surahs')}</span>
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8" dir={dir}>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-2 text-center">
                    {t('quran.search_verses')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">
                    {t('quran.search_all')}
                </p>
                <VerseSearch />
            </main>
        </div>
    );
}
