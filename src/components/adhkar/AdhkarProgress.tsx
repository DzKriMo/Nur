'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface AdhkarProgressProps {
    totalItems: number;
    categoryFilename: string;
}

export default function AdhkarProgress({ totalItems, categoryFilename }: AdhkarProgressProps) {
    const [completed, setCompleted] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const checkProgress = () => {
            let count = 0;
            for (let i = 0; i < totalItems; i++) {
                const saved = localStorage.getItem(`adhkar_${categoryFilename}_${i}`);
                if (saved && parseInt(saved) > 0) count++;
            }
            setCompleted(count);
        };

        checkProgress();
        setMounted(true);

        const interval = setInterval(checkProgress, 1000);
        return () => clearInterval(interval);
    }, [totalItems, categoryFilename]);

    if (!mounted) return null;

    const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
    const allDone = completed === totalItems;

    return (
        <div className={cn(
            "rounded-2xl p-4 border-2 transition-all duration-500",
            allDone
                ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {allDone ? (
                        <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                    <span className={cn(
                        "text-sm font-medium",
                        allDone ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"
                    )}>
                        {allDone ? 'All Adhkar completed!' : `${completed} of ${totalItems} Adhkar`}
                    </span>
                </div>
                <span className={cn(
                    "text-xs font-bold",
                    allDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-500"
                )}>
                    {percentage}%
                </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        allDone ? "bg-emerald-500" : "bg-rose-400 dark:bg-rose-600"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
