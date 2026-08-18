'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AdhkarItem } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, RotateCcw, Check, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhkarCardProps {
    item: AdhkarItem;
    index: number;
    categoryFilename: string;
    totalItems: number;
}

export default function AdhkarCard({ item, index, categoryFilename, totalItems }: AdhkarCardProps) {
    const storageKey = `adhkar_${categoryFilename}_${index}`;
    const [count, setCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const isCompleted = count >= item.repeat;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setCount(parseInt(saved, 10) || 0);
        setMounted(true);
    }, [storageKey]);

    const scrollToNext = useCallback(() => {
        setTimeout(() => {
            const nextCard = document.getElementById(`adhkar-card-${index + 1}`);
            if (nextCard) {
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 600);
    }, [index]);

    const increment = useCallback(() => {
        if (count < item.repeat) {
            const newCount = count + 1;
            setCount(newCount);
            localStorage.setItem(storageKey, newCount.toString());

            if (navigator.vibrate) navigator.vibrate(15);

            if (newCount >= item.repeat) {
                setJustCompleted(true);
                setTimeout(() => setJustCompleted(false), 1500);
                if (index < totalItems - 1) {
                    scrollToNext();
                }
            }
        }
    }, [count, item.repeat, storageKey, index, totalItems, scrollToNext]);

    const reset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCount(0);
        setJustCompleted(false);
        localStorage.setItem(storageKey, '0');
    }, [storageKey]);

    if (!mounted) return null;

    const progress = (count / item.repeat) * 100;
    const remaining = item.repeat - count;

    return (
        <div
            id={`adhkar-card-${index}`}
            ref={cardRef}
            onClick={increment}
            className={cn(
                "rounded-2xl p-5 md:p-6 shadow-sm border-2 transition-all duration-500 cursor-pointer select-none relative overflow-hidden",
                isCompleted
                    ? "border-emerald-400 dark:border-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-950/30 shadow-emerald-200/50 dark:shadow-emerald-900/20"
                    : justCompleted
                    ? "border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 scale-[1.02] shadow-lg"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md active:scale-[0.98]"
            )}
        >
            {/* Progress bar background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out rounded-full",
                        isCompleted ? "bg-emerald-500" : "bg-rose-400 dark:bg-rose-600"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Completion check overlay */}
            {isCompleted && (
                <div className="absolute top-4 left-4 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check size={16} className="text-white" strokeWidth={3} />
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300",
                    isCompleted
                        ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                    <Repeat size={12} className={isCompleted ? "text-emerald-600 dark:text-emerald-400" : ""} />
                    <span>{count} / {item.repeat}</span>
                </div>

                <div className="flex items-center gap-2">
                    {!isCompleted && remaining > 0 && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {remaining} {t('adhkar.count').toLowerCase()}
                        </span>
                    )}
                    {count > 0 && (
                        <button
                            onClick={reset}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            title={t('adhkar.reset')}
                        >
                            <RotateCcw size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Arabic text */}
            <div className="text-right mb-4">
                <p className={cn(
                    "text-xl md:text-2xl leading-[2] font-arabic transition-colors duration-300",
                    isCompleted
                        ? "text-emerald-800 dark:text-emerald-200"
                        : "text-slate-800 dark:text-slate-100"
                )} dir="rtl">
                    {item.zekr}
                </p>
            </div>

            {/* Source / bless text */}
            {item.bless && (
                <div className={cn(
                    "text-xs italic border-t pt-3 font-arabic text-right transition-colors duration-300",
                    isCompleted
                        ? "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                )} dir="rtl">
                    {item.bless}
                </div>
            )}

            {/* Tap hint */}
            {!isCompleted && count === 0 && (
                <div className="mt-3 text-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
                        {t('adhkar.count')} 👆
                    </span>
                </div>
            )}

            {/* Completion animation flash */}
            {justCompleted && (
                <div className="absolute inset-0 bg-emerald-400/10 dark:bg-emerald-400/5 animate-pulse pointer-events-none" />
            )}
        </div>
    );
}
