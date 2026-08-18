'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhkarCategory {
    filename: string;
    titleAr: string;
    titleEn: string;
    content: { repeat: number }[];
}

const categoryIcons: Record<string, string> = {
    'azkar_sabah.json': '🌅',
    'azkar_massa.json': '🌙',
    'PostPrayer_azkar.json': '🕌',
};

export default function AdhkarCategoryCard({ category }: { category: AdhkarCategory }) {
    const { language } = useLanguage();
    return (
        <Link
            href={`/adhkar/${category.filename}`}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
        >
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    {categoryIcons[category.filename] || '❤️'}
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors font-arabic truncate">
                        {category.titleAr}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {category.titleEn}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {category.content.length} {language === 'ar' ? 'أذكار' : 'Adhkar'}
                    </p>
                </div>
            </div>
        </Link>
    );
}