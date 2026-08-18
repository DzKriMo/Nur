import { getHadiths, getHadithBook } from '@/lib/data';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import HadithList from '@/components/hadith/HadithList';
import LocalizedText from '@/components/layout/LocalizedText';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        bookId: string;
        chapterId: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bookId, chapterId } = await params;
    const book = await getHadithBook(bookId);
    const chapter = book.chapters.find(c => c.id === parseInt(chapterId));
    const chapterTitle = chapter?.arabic ?? 'باب من كتب الحديث';
    return {
        title: chapterTitle,
        description: `${chapterTitle} - من ${book.metadata.arabic.title}، أحاديث نبوية مع الترجمة.`,
        alternates: { canonical: `/hadith/${bookId}/${chapterId}` },
    };
}

export default async function ChapterPage({ params }: PageProps) {
    const { bookId, chapterId } = await params;
    const [hadiths, book] = await Promise.all([
        getHadiths(bookId, chapterId),
        getHadithBook(bookId),
    ]);
    const chapter = book.chapters.find(c => c.id === parseInt(chapterId));

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20 md:pt-16">
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                    <Link
                        href={`/hadith/${bookId}`}
                        className="flex items-center gap-1 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span className="hidden sm:inline"><LocalizedText en="Back to Chapters" ar="رجوع للأبواب" /></span>
                    </Link>
                    <div className="text-center min-w-0 flex-1 mx-4">
                        <h1 className="font-bold text-lg text-stone-900 dark:text-white truncate">{chapter?.english}</h1>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                            <LocalizedText en={`${hadiths.length} Hadiths`} ar={`${hadiths.length} حديث`} />
                        </p>
                    </div>
                    <div className="w-20" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-4 space-y-8">
                <HadithList
                    hadiths={hadiths}
                    bookId={bookId}
                    bookName={book.metadata.english.title}
                    bookNameAr={book.metadata.arabic.title}
                />
            </main>
        </div>
    );
}
