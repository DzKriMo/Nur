import { getHadithBooks } from '@/lib/data';
import BookList from '@/components/hadith/BookList';

export default async function HadithPage() {
    const books = await getHadithBooks();

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-stone-900 dark:to-stone-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-amber-800 dark:text-amber-500 mb-4 font-serif">
                        Hadith Collections
                    </h1>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                        Explore the sayings and actions of Prophet Muhammad (PBUH).
                    </p>
                </header>

                <BookList books={books} />
            </div>
        </div>
    );
}
