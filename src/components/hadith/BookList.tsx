'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Book, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookInfo } from '@/types';

interface BookListProps {
    books: BookInfo[];
}

export default function BookList({ books }: BookListProps) {
    const [query, setQuery] = useState('');
    const { t } = useLanguage();

    const filteredBooks = useMemo(() => {
        return books.filter((book) =>
            book.name.toLowerCase().includes(query.toLowerCase()) ||
            book.nameAr.includes(query)
        );
    }, [books, query]);

    const categoryColors: Record<string, string> = {
        major: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500',
        forty: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
        other: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500',
    };

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book) => (
                    <Link
                        href={`/hadith/${book.filename}`}
                        key={book.id}
                        className="group relative bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800 hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-colors flex-shrink-0">
                                <Book size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors truncate">
                                    {book.name}
                                </h3>
                                <p className="text-sm font-arabic text-stone-500 dark:text-stone-400 truncate">
                                    {book.nameAr}
                                </p>
                                <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[book.category]}`}>
                                    {book.category === 'major' ? t('hadith.major_books') : book.category === 'forty' ? t('hadith.forty_books') : t('hadith.other_books')}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="col-span-full text-center py-12 text-stone-500 dark:text-stone-400">
                    {t('hadith.no_books')}
                </div>
            )}
        </div>
    );
}
