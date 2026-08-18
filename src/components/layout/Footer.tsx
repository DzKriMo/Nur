'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

const quickLinks: { href: string; key: TranslationKey }[] = [
    { href: '/quran', key: 'nav.quran' },
    { href: '/hadith', key: 'nav.hadith' },
    { href: '/adhkar', key: 'nav.adhkar' },
    { href: '/prayer', key: 'nav.prayer' },
    { href: '/stories', key: 'nav.stories' },
    { href: '/learn', key: 'nav.learn' },
    { href: '/chat', key: 'nav.chat' },
    { href: '/saved', key: 'home.saved' },
    { href: '/about', key: 'nav.about' },
];

export default function Footer() {
    const { t, dir } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="text-center md:text-left">
                        <Link href="/" className="font-arabic text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            نور
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
                            {t('about.built')}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center md:text-left">
                            {t('footer.quick_links')}
                        </p>
                        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-2">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-center md:text-left"
                                >
                                    {t(link.key)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500" dir="ltr">
                    <span>© {year} Nur</span>
                    <span className="hidden sm:inline">•</span>
                    <span dir={dir}>{t('footer.rights')}</span>
                </div>
            </div>
        </footer>
    );
}