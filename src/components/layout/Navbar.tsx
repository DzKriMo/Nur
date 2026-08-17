'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, Heart, MessageCircle, Info, Home } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();

    const links = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/quran', label: t('nav.quran'), icon: Book },
        { href: '/hadith', label: t('nav.hadith'), icon: Book },
        { href: '/adhkar', label: t('nav.adhkar'), icon: Heart },
        { href: '/chat', label: t('nav.chat'), icon: MessageCircle },
        { href: '/about', label: t('nav.about'), icon: Info },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:relative md:border-t-0 md:border-b z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-around md:justify-end md:gap-8 h-16 items-center">
                    <Link href="/" className="hidden md:flex items-center gap-2 mr-auto font-bold text-xl text-emerald-600 dark:text-emerald-400 font-serif">
                        Nur
                    </Link>

                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:px-4 md:py-2 rounded-xl transition-colors",
                                    isActive
                                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10"
                                        : "text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-[10px] md:text-sm font-medium">{link.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={toggleLanguage}
                        className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:px-4 md:py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                    >
                        <Globe size={20} />
                        <span className="text-[10px] md:text-sm font-medium uppercase">{language}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
