'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { OrnamentDivider } from '@/components/layout/Ornament';

interface PageHeaderProps {
    titleKey: TranslationKey;
    subtitleKey: TranslationKey;
    titleClassName?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ titleKey, subtitleKey, titleClassName, children }: PageHeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="relative mb-12 text-center islamic-pattern rounded-3xl p-6 md:p-12 overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 font-display tracking-wide ${titleClassName ?? ''}`}>
                {t(titleKey)}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-5">
                {t(subtitleKey)}
            </p>
            <OrnamentDivider className="max-w-[220px] mx-auto mb-6" />
            {children}
        </header>
    );
}