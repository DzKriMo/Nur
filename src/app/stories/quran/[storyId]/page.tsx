'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { quranStories } from '@/data/stories/quran';
import ReadingProgress from '@/components/stories/ReadingProgress';

export default function QuranStoryPage() {
    const params = useParams();
    const { t, dir, language } = useLanguage();
    const storyId = params.storyId as string;
    const story = quranStories.find(s => s.id === storyId);

    if (!story) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-500">{t('common.loading')}</p>
            </div>
        );
    }

    const isAr = language === 'ar';
    const title = isAr ? story.titleAr : story.title;
    const surah = isAr ? story.surahAr : story.surah;
    const summary = isAr ? story.summaryAr : story.summary;
    const fullStory = isAr ? story.fullStoryAr : story.fullStory;
    const keyLessons = isAr ? story.keyLessonsAr : story.keyLessons;
    const characters = isAr ? story.charactersAr : story.characters;

    const currentIndex = quranStories.findIndex(s => s.id === storyId);
    const prevStory = currentIndex > 0 ? quranStories[currentIndex - 1] : null;
    const nextStory = currentIndex < quranStories.length - 1 ? quranStories[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 md:pt-24 px-4 pb-16">
            <ReadingProgress key={storyId} storyId={storyId} />
            <div className="max-w-3xl mx-auto">
                <Link href="/stories/quran" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors">
                    {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {t('stories.back_to_stories')}
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div
                        className="h-48 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: `${story.svgColor}20` }}
                    >
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl"
                            style={{ backgroundColor: story.svgColor }}
                        >
                            {story.titleAr.charAt(0)}
                        </div>
                        <div className="absolute inset-0 islamic-star-bg opacity-10" />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-arabic">{title}</h1>
                            <p className="text-violet-600 dark:text-violet-400 font-medium text-lg font-arabic">{story.titleAr}</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{surah}</p>
                        </div>

                        <div className="mb-6">
                            <p className={`text-lg text-slate-700 dark:text-slate-200 font-medium italic border-r-4 border-violet-500 pr-4 py-2 bg-violet-50 dark:bg-violet-900/10 rounded-r-lg font-arabic ${isAr ? 'border-r-4 border-l-0 pr-4 pl-0' : ''}`}>
                                {summary}
                            </p>
                        </div>

                        <div className={isAr ? "text-right" : ""}>
                            {fullStory.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 font-arabic text-base md:text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {characters.length > 0 && (
                            <div className="mt-6 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Users size={16} className="mt-0.5 flex-shrink-0" />
                                <span><strong>{t('stories.characters')}:</strong> {characters.join(', ')}</span>
                            </div>
                        )}

                        {keyLessons.length > 0 && (
                            <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                                <h3 className="font-bold text-violet-800 dark:text-violet-300 mb-3">{t('stories.key_lessons')}</h3>
                                <ul className="space-y-2">
                                    {keyLessons.map((lesson, i) => (
                                        <li key={i} className="flex items-start gap-2 text-violet-700 dark:text-violet-200 text-sm font-arabic">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                                            {lesson}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-violet-600 dark:text-violet-400" />
                                {t('stories.references')}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1">{t('stories.quran_refs')}</p>
                                    <ul className="space-y-1">
                                        <li className="text-sm text-slate-600 dark:text-slate-300 font-arabic">• {surah}</li>
                                    </ul>
                                </div>
                                {(isAr ? story.hadithRefsAr : story.hadithRefs).length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">{t('stories.hadith_refs')}</p>
                                        <ul className="space-y-1">
                                            {(isAr ? story.hadithRefsAr : story.hadithRefs).map((ref, i) => (
                                                <li key={i} className="text-sm text-slate-600 dark:text-slate-300 font-arabic">• {ref}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    {prevStory ? (
                        <Link
                            href={`/stories/quran/${prevStory.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                        >
                            {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                            <span className="text-sm font-arabic">{isAr ? prevStory.titleAr : prevStory.title}</span>
                        </Link>
                    ) : <div />}
                    {nextStory ? (
                        <Link
                            href={`/stories/quran/${nextStory.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                        >
                            <span className="text-sm font-arabic">{isAr ? nextStory.titleAr : nextStory.title}</span>
                            {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
}
