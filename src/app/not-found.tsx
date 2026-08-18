'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center">
                <div className="font-arabic text-8xl font-bold text-emerald-600/20 dark:text-emerald-400/10 mb-4">
                    ٤٠٤
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                    {t('not_found.title')}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    {t('not_found.description')}
                </p>
                <Link
                    href="/"
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all hover:shadow-lg inline-block"
                >
                    {t('not_found.go_home')}
                </Link>
            </div>
        </div>
    );
}