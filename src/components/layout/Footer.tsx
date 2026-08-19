'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { KhatamStar, OrnamentDivider } from '@/components/layout/Ornament';

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
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-parchment-50/90 dark:bg-night-950/90 backdrop-blur-xl pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
                <div className="flex flex-col items-center gap-8">
                    <Link href="/" className="flex flex-col items-center gap-2 group">
                        <span className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 dark:from-emerald-500 dark:to-emerald-800 text-gold-300 shadow-lg shadow-emerald-900/20 transition-transform group-hover:rotate-[15deg]">
                            <KhatamStar size={22} />
                        </span>
                        <span className="font-display font-bold text-3xl text-gold-gradient">نور</span>
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs text-center leading-relaxed">
                        {t('about.built')}
                    </p>
                    <OrnamentDivider className="max-w-md" />
                </div>

                <div className="py-8">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                        {t('footer.quick_links')}
                    </p>
                    <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-2 max-w-2xl mx-auto">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-slate-500 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-300 transition-colors text-center"
                            >
                                {t(link.key)}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-slate-200/80 dark:border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500" dir="ltr">
                    <span>© {year} Nur</span>
                    <KhatamStar size={9} className="text-gold-500/70" />
                    <span dir={dir}>{t('footer.rights')}</span>
                </div>
            </div>
        </footer>
    );
}