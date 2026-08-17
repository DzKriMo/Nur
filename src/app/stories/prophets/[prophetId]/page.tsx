'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { prophetsStories } from '@/data/stories/prophets';

export default function ProphetStoryPage() {
    const params = useParams();
    const { t, dir } = useLanguage();
    const prophetId = params.prophetId as string;
    const prophet = prophetsStories.find(p => p.id === prophetId);

    if (!prophet) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-500">{t('common.loading')}</p>
            </div>
        );
    }

    const currentIndex = prophetsStories.findIndex(p => p.id === prophetId);
    const prevProphet = currentIndex > 0 ? prophetsStories[currentIndex - 1] : null;
    const nextProphet = currentIndex < prophetsStories.length - 1 ? prophetsStories[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/stories/prophets" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
                    {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {t('stories.back_to_stories')}
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div
                        className="h-48 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: `${prophet.svgColor}20` }}
                    >
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl"
                            style={{ backgroundColor: prophet.svgColor }}
                        >
                            {prophet.nameAr.charAt(0)}
                        </div>
                        <div className="absolute inset-0 islamic-star-bg opacity-10" />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{prophet.name}</h1>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium text-lg font-arabic">{prophet.nameAr}</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{prophet.title} — {prophet.era}</p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            {prophet.fullStory.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {prophet.keyLessons.length > 0 && (
                            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-3">{t('stories.key_lessons')}</h3>
                                <ul className="space-y-2">
                                    {prophet.keyLessons.map((lesson, i) => (
                                        <li key={i} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-200 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                            {lesson}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <BookOpen size={16} />
                            <span className="font-medium">{t('stories.source')}:</span>
                            <span>{prophet.relatedSurahs.join(' • ')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    {prevProphet ? (
                        <Link
                            href={`/stories/prophets/${prevProphet.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                        >
                            {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                            <span className="text-sm">{prevProphet.name}</span>
                        </Link>
                    ) : <div />}
                    {nextProphet ? (
                        <Link
                            href={`/stories/prophets/${nextProphet.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                        >
                            <span className="text-sm">{nextProphet.name}</span>
                            {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
}
