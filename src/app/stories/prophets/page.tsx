'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { prophetsStories } from '@/data/stories/prophets';

export default function ProphetsPage() {
    const { t, dir, language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/stories" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
                    {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {t('stories.back_to_stories')}
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('stories.prophets')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {t('stories.prophets_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prophetsStories.map((prophet) => (
                        <Link
                            key={prophet.id}
                            href={`/stories/prophets/${prophet.id}`}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 overflow-hidden group"
                        >
                            <div
                                className="h-32 flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: `${prophet.svgColor}15` }}
                            >
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: prophet.svgColor }}
                                >
                                    {prophet.nameAr.charAt(0)}
                                </div>
                                <div className="absolute inset-0 islamic-star-bg opacity-10" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 font-arabic">{isAr ? prophet.nameAr : prophet.name}</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1 font-arabic">{prophet.nameAr}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-arabic">{isAr ? prophet.summaryAr : prophet.summary}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
