import { getSurah, getTranslation } from '@/lib/data';
import VerseView from '@/components/quran/VerseView';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{
        chapterId: string;
    }>;
}

export default async function ChapterPage({ params }: PageProps) {
    const { chapterId } = await params;
    const surah = await getSurah(chapterId);
    const translation = await getTranslation(chapterId, 'en');
    const tafseer = await getTranslation(chapterId, 'ar');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/quran"
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Surahs</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white">{surah.name}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{surah.count} Verses</p>
                    </div>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <VerseView
                    surah={surah}
                    translation={translation}
                    tafseer={tafseer}
                    chapterId={chapterId}
                />
            </main>
        </div>
    );
}
