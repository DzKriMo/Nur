'use client';

import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrnamentDivider } from '@/components/layout/Ornament';
import { cn } from '@/lib/utils';

interface TafsirDrawerProps {
    surahName: string;
    verseNum: string;
    text: string;
    translation: string;
    tafseer: string;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
}

export default function TafsirDrawer({
    surahName, verseNum, text, translation, tafseer,
    hasPrev, hasNext, onPrev, onNext, onClose,
}: TafsirDrawerProps) {
    const { t, dir } = useLanguage();
    const Next = dir === 'rtl' ? ChevronLeft : ChevronRight;
    const Prev = dir === 'rtl' ? ChevronRight : ChevronLeft;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative bg-white dark:bg-night-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-600 dark:text-gold-300 font-medium text-xs shrink-0">
                            {verseNum}
                        </span>
                        <p className="font-arabic font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {surahName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                        aria-label={t('common.close')}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-4 space-y-4">
                    <p className="text-right font-arabic text-2xl leading-[2] text-slate-800 dark:text-slate-100">
                        {text}
                    </p>
                    {translation && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
                            {translation}
                        </p>
                    )}
                    <div className="max-w-xs mx-auto">
                        <OrnamentDivider />
                    </div>
                    <div className="text-right font-arabic text-slate-700 dark:text-slate-300 leading-loose">
                        {tafseer}
                    </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <button
                        onClick={onPrev}
                        disabled={!hasPrev}
                        className={cn(
                            "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            hasPrev
                                ? "bg-slate-100 dark:bg-night-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                                : "opacity-40 cursor-not-allowed"
                        )}
                    >
                        <Prev size={15} />
                        {t('quran.prev_verse')}
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className={cn(
                            "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            hasNext
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "opacity-40 cursor-not-allowed"
                        )}
                    >
                        {t('quran.next_verse')}
                        <Next size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}