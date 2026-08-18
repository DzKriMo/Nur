'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

interface SectionHeadingProps {
    titleKey: TranslationKey;
}

export default function SectionHeading({ titleKey }: SectionHeadingProps) {
    const { t } = useLanguage();
    return (
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
            {t(titleKey)}
        </h2>
    );
}