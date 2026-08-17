'use client';

import { useState } from 'react';
import { AdhkarItem } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat } from 'lucide-react';

interface AdhkarCardProps {
    item: AdhkarItem;
}

export default function AdhkarCard({ item }: AdhkarCardProps) {
    const [count, setCount] = useState(0);
    const isCompleted = count >= item.repeat;

    const increment = () => {
        if (count < item.repeat) {
            setCount(count + 1);
        }
    };

    return (
        <div
            onClick={increment}
            className={cn(
                "bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all duration-300 cursor-pointer select-none",
                isCompleted
                    ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                    : "border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md"
            )}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                    <Repeat size={12} />
                    <span>{count} / {item.repeat}</span>
                </div>
            </div>

            <div className="text-right mb-6">
                <p className="text-2xl md:text-3xl leading-loose font-serif text-slate-800 dark:text-slate-100 font-arabic" dir="rtl">
                    {item.zekr}
                </p>
            </div>

            {item.bless && (
                <div className="text-sm text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-800 pt-4">
                    {item.bless}
                </div>
            )}

            <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-300",
                        isCompleted ? "bg-emerald-500" : "bg-rose-500"
                    )}
                    style={{ width: `${(count / item.repeat) * 100}%` }}
                />
            </div>
        </div>
    );
}
