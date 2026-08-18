'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useMounted, resetStored } from '@/lib/storage';

interface AdhkarProgressProps {
    totalItems: number;
    categoryFilename: string;
}

export default function AdhkarProgress({ totalItems, categoryFilename }: AdhkarProgressProps) {
    const [completed, setCompleted] = useState(0);
    const mounted = useMounted();
    const { language } = useLanguage();
    const { markAdhkarDone, adhkarDoneToday, resetAdhkar } = useBookmarks();
    const markedRef = useRef(false);

    // Post-prayer adhkar are recited 5 times a day, so the once-daily "done" tracking does not apply to them.
    const isDailyOnce = !categoryFilename.startsWith('PostPrayer');

    useEffect(() => {
        const checkProgress = () => {
            let count = 0;
            for (let i = 0; i < totalItems; i++) {
                const saved = localStorage.getItem(`adhkar_${categoryFilename}_${i}`);
                if (saved && parseInt(saved) > 0) count++;
            }
            setCompleted(count);
            if (isDailyOnce && count === totalItems && totalItems > 0 && !markedRef.current) {
                markedRef.current = true;
                markAdhkarDone(categoryFilename);
            }
        };

        checkProgress();

        const interval = setInterval(checkProgress, 1000);
        return () => clearInterval(interval);
    }, [totalItems, categoryFilename, markAdhkarDone, isDailyOnce]);

    if (!mounted) return null;

    const handleReset = () => {
        if (!window.confirm(language === 'ar' ? 'إعادة تعيين جميع الأذكار في هذا القسم؟' : 'Reset all Adhkar in this category?')) return;
        for (let i = 0; i < totalItems; i++) {
            resetStored(`adhkar_${categoryFilename}_${i}`);
        }
        resetAdhkar(categoryFilename);
        markedRef.current = false;
        setCompleted(0);
    };

    const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
    const allDone = completed === totalItems;
    const doneToday = isDailyOnce ? adhkarDoneToday[categoryFilename] : false;

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
                        {allDone
                            ? (language === 'ar' ? 'تم إكمال جميع الأذكار!' : 'All Adhkar completed!')
                            : (language === 'ar'
                                ? `${completed} من أصل ${totalItems} ذكر`
                                : `${completed} of ${totalItems} Adhkar`)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {completed > 0 && (
                        <button
                            onClick={handleReset}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            title={language === 'ar' ? 'إعادة تعيين الأذكار' : 'Reset Adhkar'}
                        >
                            <RotateCcw size={14} />
                        </button>
                    )}
                    {doneToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {language === 'ar' ? 'أُنجز اليوم ✓' : 'Done today ✓'}
                        </span>
                    )}
                    <span className={cn(
                        "text-xs font-bold",
                        allDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-500"
                    )}>
                        {percentage}%
                    </span>
                </div>
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
