import { getHadiths, getHadithBook } from '@/lib/data';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import HadithList from '@/components/hadith/HadithList';

interface PageProps {
    params: Promise<{
        bookId: string;
        chapterId: string;
    }>;
}

export default async function ChapterPage({ params }: PageProps) {
    const { bookId, chapterId } = await params;
    const hadiths = await getHadiths(bookId, chapterId);
    const book = await getHadithBook(bookId);
    const chapter = book.chapters.find(c => c.id === parseInt(chapterId));

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20">
            <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={`/hadith/${bookId}`}
                        className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Chapters</span>
                    </Link>
                    <div className="text-center max-w-md truncate px-4">
                        <h1 className="font-bold text-lg text-stone-900 dark:text-white truncate">{chapter?.english}</h1>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{hadiths.length} Hadiths</p>
                    </div>
                    <div className="w-24" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                <HadithList hadiths={hadiths} />
            </main>
        </div>
    );
}
