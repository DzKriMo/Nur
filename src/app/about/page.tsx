'use client';

import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-24 md:pt-28">
            <div className="max-w-2xl w-full bg-white dark:bg-night-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 dark:text-emerald-400">
                    <Heart size={40} />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 font-serif">{t('about.title')}</h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    {t('about.description')}
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 mb-8">
                    <p className="font-arabic text-xl md:text-2xl text-emerald-800 dark:text-emerald-400 mb-4 leading-loose">
                        {t('about.dedication')}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 italic">
                        {t('about.hadith')}
                    </p>
                </div>

                <p className="text-sm text-slate-400">
                    {t('about.built')}
                </p>
            </div>
        </div>
    );
}
