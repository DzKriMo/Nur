'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuranViewToggle() {
    const { t } = useLanguage();
    return (
        <div className="flex justify-center gap-3">
            <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
                {t('quran.view_surah')}
            </span>
            <Link
                href="/quran/juz"
                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
                {t('quran.view_juz')}
            </Link>
        </div>
    );
}