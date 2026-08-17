import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ChapterList from '@/components/hadith/ChapterList';
import { getHadithBook } from '@/lib/data';

interface PageProps {
    params: Promise<{
        bookId: string;
    }>;
}

export default async function BookPage({ params }: PageProps) {
    const { bookId } = await params;
    const book = await getHadithBook(bookId);
    const chapters = book.chapters;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20">
            <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/hadith"
                        className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Books</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-stone-900 dark:text-white">{book.metadata.english.title}</h1>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{chapters.length} Chapters</p>
                    </div>
                    <div className="w-24" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <ChapterList bookId={bookId} chapters={chapters} />
            </main>
        </div>
    );
}
