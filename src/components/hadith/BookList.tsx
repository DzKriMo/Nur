'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookListProps {
    books: { id: string; name: string; filename: string }[];
}

export default function BookList({ books }: BookListProps) {
    const [query, setQuery] = useState('');
    const { t } = useLanguage();

    const filteredBooks = books.filter((book) =>
        book.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('hadith.search_books')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <Link
                            href={`/hadith/${book.filename}`}
                            key={book.id}
                            className="group relative bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800 hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <Book size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors mb-2">
                                        {book.name}
                                    </h3>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        {t('common.read')}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-stone-500 dark:text-stone-400">
                        No books found.
                    </div>
                )}
            </div>
        </div>
    );
}
