import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ChapterList from '@/components/hadith/ChapterList';
import LocalizedText from '@/components/layout/LocalizedText';
import { getHadithBook } from '@/lib/data';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        bookId: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bookId } = await params;
    const book = await getHadithBook(bookId);
    return {
        title: book.metadata.arabic.title,
        description: `${book.metadata.arabic.title} - ${book.metadata.arabic.author}، يضم ${book.chapters.length} بابًا من الأحاديث النبوية مع الترجمة.`,
        alternates: { canonical: `/hadith/${bookId}` },
    };
}

export default async function BookPage({ params }: PageProps) {
    const { bookId } = await params;
    const book = await getHadithBook(bookId);
    const chapters = book.chapters;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20 md:pt-16">
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 sticky top-0 md:top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                    <Link
                        href="/hadith"
                        className="flex items-center gap-1 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors text-sm"
                    >
                        <ChevronLeft size={18} className="rotate-180" />
                        <span className="hidden sm:inline"><LocalizedText en="Back to Books" ar="رجوع للكتب" /></span>
                    </Link>
                    <div className="text-center min-w-0 flex-1 mx-4">
                        <h1 className="font-bold text-lg text-stone-900 dark:text-white truncate">{book.metadata.english.title}</h1>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                            <LocalizedText en={`${chapters.length} Chapters`} ar={`${chapters.length} باب`} />
                        </p>
                    </div>
                    <div className="w-20" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <ChapterList bookId={bookId} chapters={chapters} />
            </main>
        </div>
    );
}
