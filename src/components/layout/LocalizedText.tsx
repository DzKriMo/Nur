'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface LocalizedTextProps {
    en: string;
    ar: string;
    className?: string;
}

export default function LocalizedText({ en, ar, className }: LocalizedTextProps) {
    const { language } = useLanguage();
    return <span className={className}>{language === 'ar' ? ar : en}</span>;
}