import { getSurah, getTranslation } from '@/lib/data';
import VerseView from '@/components/quran/VerseView';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocalizedText from '@/components/layout/LocalizedText';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        chapterId: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapterId } = await params;
    const surah = await getSurah(chapterId);
    return {
        title: `سورة ${surah.name}`,
        description: `سورة ${surah.name} - ${surah.count} آية. اقرأ واستمع مع الترجمة الإنجليزية والتفسير.`,
        alternates: { canonical: `/quran/${chapterId}` },
    };
}

export default async function ChapterPage({ params }: PageProps) {
    const { chapterId } = await params;
    const surah = await getSurah(chapterId);
    const translation = await getTranslation(chapterId, 'en');
    const tafseer = await getTranslation(chapterId, 'ar');

    const prevId = parseInt(chapterId) > 1 ? (parseInt(chapterId) - 1).toString() : null;
    const nextId = parseInt(chapterId) < 114 ? (parseInt(chapterId) + 1).toString() : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pt-16">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                    <Link
                        href="/quran"
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span className="hidden sm:inline"><LocalizedText en="Back to Surahs" ar="رجوع للسور" /></span>
                    </Link>
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white font-arabic">{surah.name}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            <LocalizedText en={`${surah.count} Verses`} ar={`${surah.count} آية`} />
                        </p>
                    </div>
                    <div className="w-20" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <VerseView
                    surah={surah}
                    translation={translation}
                    tafseer={tafseer}
                    chapterId={chapterId}
                />

                <div className="flex justify-between mt-8">
                    {prevId ? (
                        <Link
                            href={`/quran/${prevId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-sm"
                        >
                            <ChevronLeft size={16} className="rotate-180" />
                            <LocalizedText en="Previous" ar="السابقة" />
                        </Link>
                    ) : <div />}
                    {nextId ? (
                        <Link
                            href={`/quran/${nextId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-sm"
                        >
                            <LocalizedText en="Next" ar="التالية" />
                            <ChevronRight size={16} className="rotate-180" />
                        </Link>
                    ) : <div />}
                </div>
            </main>
        </div>
    );
}