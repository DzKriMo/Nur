'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hadith } from '@/types';

interface HadithListProps {
    hadiths: Hadith[];
}

export default function HadithList({ hadiths }: HadithListProps) {
    const [query, setQuery] = useState('');
    const { t } = useLanguage();

    const filteredHadiths = hadiths.filter((hadith) =>
        hadith.english.text.toLowerCase().includes(query.toLowerCase()) ||
        hadith.english.narrator.toLowerCase().includes(query.toLowerCase()) ||
        hadith.arabic.includes(query) ||
        hadith.idInBook.toString().includes(query)
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('hadith.search_hadiths')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                />
            </div>

            <div className="space-y-8">
                {filteredHadiths.length > 0 ? (
                    filteredHadiths.map((hadith) => (
                        <div
                            key={hadith.id}
                            className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-sm border border-stone-100 dark:border-stone-800"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                    {t('hadith.number')} {hadith.idInBook}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl leading-loose font-serif text-stone-800 dark:text-stone-200 font-arabic" dir="rtl">
                                        {hadith.arabic}
                                    </p>
                                </div>

                                <div className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                    <p className="font-semibold mb-2 text-stone-900 dark:text-white">{hadith.english.narrator}</p>
                                    <p>{hadith.english.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-stone-500 dark:text-stone-400">
                        No hadiths found.
                    </div>
                )}
            </div>
        </div>
    );
}
