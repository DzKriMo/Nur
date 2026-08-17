'use client';

import { useState, useCallback, useEffect } from 'react';
import { AdhkarItem } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhkarCardProps {
    item: AdhkarItem;
    index: number;
    categoryFilename: string;
}

export default function AdhkarCard({ item, index, categoryFilename }: AdhkarCardProps) {
    const storageKey = `adhkar_${categoryFilename}_${index}`;
    const [count, setCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();
    const isCompleted = count >= item.repeat;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setCount(parseInt(saved, 10) || 0);
        setMounted(true);
    }, [storageKey]);

    const increment = useCallback(() => {
        if (count < item.repeat) {
            const newCount = count + 1;
            setCount(newCount);
            localStorage.setItem(storageKey, newCount.toString());
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }, [count, item.repeat, storageKey]);

    const reset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCount(0);
        localStorage.setItem(storageKey, '0');
    }, [storageKey]);

    if (!mounted) return null;

    return (
        <div
            onClick={increment}
            className={cn(
                "bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all duration-300 cursor-pointer select-none",
                isCompleted
                    ? "border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md"
            )}
        >
            <div className="flex justify-between items-center mb-4">
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                    <Repeat size={12} />
                    <span>{count} / {item.repeat}</span>
                </div>
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

            <div className="text-right mb-5">
                <p className="text-xl md:text-2xl leading-loose font-arabic text-slate-800 dark:text-slate-100" dir="rtl">
                    {item.zekr}
                </p>
            </div>

            {item.bless && (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-800 pt-3 font-arabic text-right" dir="rtl">
                    {item.bless}
                </div>
            )}

            <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        isCompleted ? "bg-emerald-500" : "bg-rose-500"
                    )}
                    style={{ width: `${(count / item.repeat) * 100}%` }}
                />
            </div>
        </div>
    );
}
