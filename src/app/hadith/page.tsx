import { getHadithBooks } from '@/lib/data';
import BookList from '@/components/hadith/BookList';

export default async function HadithPage() {
    const [majorBooks, fortyBooks, otherBooks] = await Promise.all([
        getHadithBooks('major'),
        getHadithBooks('forty'),
        getHadithBooks('other'),
    ]);

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center islamic-pattern rounded-3xl p-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-amber-800 dark:text-amber-500 mb-4 font-arabic">
                        الحديث الشريف
                    </h1>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                        Explore the sayings and actions of Prophet Muhammad (PBUH).
                    </p>
                </header>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 font-serif">The 9 Major Books</h2>
                        <BookList books={majorBooks} />
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 font-serif">The 40s Collections</h2>
                        <BookList books={fortyBooks} />
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 font-serif">Other Collections</h2>
                        <BookList books={otherBooks} />
                    </section>
                </div>
            </div>
        </div>
    );
}
