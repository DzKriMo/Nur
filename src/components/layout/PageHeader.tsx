'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

interface PageHeaderProps {
    titleKey: TranslationKey;
    subtitleKey: TranslationKey;
    titleClassName?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ titleKey, subtitleKey, titleClassName, children }: PageHeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="mb-12 text-center islamic-pattern rounded-3xl p-6 md:p-12">
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 font-arabic ${titleClassName ?? ''}`}>
                {t(titleKey)}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                {t(subtitleKey)}
            </p>
            {children}
        </header>
    );
}