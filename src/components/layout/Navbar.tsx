'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, Heart, MessageCircle, Info, Home, Moon, Sun, Menu, X, Clock, Scroll, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const links = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/quran', label: t('nav.quran'), icon: Book },
        { href: '/hadith', label: t('nav.hadith'), icon: MessageCircle },
        { href: '/adhkar', label: t('nav.adhkar'), icon: Heart },
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
            <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-16 gap-1">
                        <Link href="/" className="flex items-center gap-2 mr-6 font-bold text-xl text-emerald-600 dark:text-emerald-400 font-serif">
                            نور
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
                                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive(link.href)
                                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                                                : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <Icon size={16} />
                                        <span className="hidden lg:inline">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                title={mounted ? (theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')) : ''}
                            >
                                {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="uppercase text-xs">{language === 'en' ? 'عربي' : 'EN'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom">
                <div className="flex justify-around items-center h-16 px-2">
                    {mobileLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors min-w-[56px]",
                                    isActive(link.href)
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-slate-400 dark:text-slate-500"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-slate-400 dark:text-slate-500 min-w-[56px]"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-[10px] font-medium">{t('common.settings')}</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Slide-up Menu */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                        className="absolute bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4" />
                        <div className="space-y-1">
                            {extraLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                <span className="font-medium">{theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}</span>
                            </button>
                            <button
                                onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full"
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
