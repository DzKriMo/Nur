'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, BookOpenText, Heart, MessageCircle, Info, Home, Moon, Sun, Menu, X, Clock, Scroll, GraduationCap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import NextPrayerWidget from '@/components/prayer/NextPrayerWidget';
import { KhatamStar } from '@/components/layout/Ornament';
import { useState } from 'react';
import { useMounted } from '@/lib/storage';

export default function Navbar() {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const mounted = useMounted();

    const links = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/quran', label: t('nav.quran'), icon: Book },
        { href: '/hifz', label: t('nav.hifz'), icon: BookOpenText },
        { href: '/hadith', label: t('nav.hadith'), icon: MessageCircle },
        { href: '/adhkar', label: t('nav.adhkar'), icon: Heart },
        { href: '/names', label: t('nav.names'), icon: Sparkles },
        { href: '/stories', label: t('nav.stories'), icon: Scroll },
        { href: '/learn', label: t('nav.learn'), icon: GraduationCap },
        { href: '/prayer', label: t('nav.prayer'), icon: Clock },
        { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
        { href: '/about', label: t('nav.about'), icon: Info },
    ];

    const mobileLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/quran', label: t('nav.quran'), icon: Book },
        { href: '/hadith', label: t('nav.hadith'), icon: MessageCircle },
        { href: '/adhkar', label: t('nav.adhkar'), icon: Heart },
        { href: '/prayer', label: t('nav.prayer'), icon: Clock },
    ];

    const extraLinks = [
        { href: '/names', label: t('nav.names'), icon: Sparkles },
        { href: '/hifz', label: t('nav.hifz'), icon: BookOpenText },
        { href: '/learn', label: t('nav.learn'), icon: GraduationCap },
        { href: '/stories', label: t('nav.stories'), icon: Scroll },
        { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
        { href: '/about', label: t('nav.about'), icon: Info },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 bg-parchment-50/85 dark:bg-night-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 z-50">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-16 gap-1">
                        <Link href="/" className="flex items-center gap-2.5 mr-6 group">
                            <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 dark:from-emerald-500 dark:to-emerald-800 text-gold-300 shadow-md shadow-emerald-900/20 transition-transform group-hover:rotate-[15deg]">
                                <KhatamStar size={17} />
                            </span>
                            <span className="font-display font-bold text-2xl text-gold-gradient">نور</span>
                        </Link>

                        <div className="flex items-center gap-1 flex-1">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        title={link.label}
                                        className={cn(
                                            "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive(link.href)
                                                ? "text-gold-600 dark:text-gold-300 bg-gold-500/10"
                                                : "text-slate-600 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-300 hover:bg-gold-500/5"
                                        )}
                                    >
                                        <Icon size={16} />
                                        <span className="hidden lg:inline">{link.label}</span>
                                        {isActive(link.href) && (
                                            <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-1">
                            <NextPrayerWidget />
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-300 hover:bg-gold-500/5 transition-colors"
                                title={mounted ? (theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')) : ''}
                            >
                                {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-300 hover:bg-gold-500/5 transition-colors"
                            >
                                <span className="uppercase text-xs">{language === 'en' ? 'عربي' : 'EN'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-parchment-50/95 dark:bg-night-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
                <div className="flex justify-around items-center h-16 px-2">
                    {mobileLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors min-w-[56px]",
                                    active
                                        ? "text-gold-600 dark:text-gold-300"
                                        : "text-slate-400 dark:text-slate-500"
                                )}
                            >
                                {active && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />}
                                <Icon size={20} />
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={cn(
                            "flex flex-col items-center gap-0.5 p-1.5 rounded-xl min-w-[56px]",
                            mobileOpen ? "text-gold-600 dark:text-gold-300" : "text-slate-400 dark:text-slate-500"
                        )}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-[10px] font-medium">{t('common.more')}</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Slide-up Menu */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div
                        className="absolute bottom-16 left-0 right-0 bg-parchment-50 dark:bg-night-950 border-t border-gold-500/30 rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-gold-500/40 rounded-full mx-auto mb-4" />
                        <div className="space-y-1">
                            {extraLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gold-500/5 transition-colors"
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gold-500/5 transition-colors w-full"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                <span className="font-medium">{theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}</span>
                            </button>
                            <button
                                onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gold-500/5 transition-colors w-full"
                            >
                                <span className="font-arabic text-lg">{language === 'en' ? 'عربي' : 'EN'}</span>
                                <span className="font-medium">{t('common.language')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile spacer */}
            <div className="md:hidden h-16" />
        </>
    );
}
