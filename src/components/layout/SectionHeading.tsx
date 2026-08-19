'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { OrnamentDivider } from '@/components/layout/Ornament';

interface SectionHeadingProps {
    titleKey: TranslationKey;
}

export default function SectionHeading({ titleKey }: SectionHeadingProps) {
    const { t } = useLanguage();
    return (
        <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-display tracking-wide">
                {t(titleKey)}
            </h2>
            <OrnamentDivider className="max-w-[180px]" />
        </div>
    );
}