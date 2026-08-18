'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMounted } from '@/lib/storage';

export default function ReadingProgress({ storyId }: { storyId: string }) {
    const { saveStoryProgress, markStoryCompleted, storyProgress, completedStories } = useBookmarks();
    const { t } = useLanguage();
    const mounted = useMounted();
    const [pct, setPct] = useState(0);

    const savedPct = storyProgress[storyId] ?? 0;
    const completed = completedStories.includes(storyId);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            if (max <= 0) return;
            const next = Math.min(100, Math.round((window.scrollY / max) * 100));
            setPct(next);
            saveStoryProgress(storyId, next);
            if (next >= 95) markStoryCompleted(storyId);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [storyId, saveStoryProgress, markStoryCompleted]);

    if (!mounted) return null;

    const resumeVisible = savedPct >= 2 && savedPct < 95 && !completed;

    const resume = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const target = Math.min(max, Math.max(0, (savedPct / 100) * max));
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: target, behavior: 'smooth' });
            });
        });
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-transparent pointer-events-none">
                <div
                    className="h-full bg-emerald-500 transition-all duration-150"
                    style={{ width: `${pct}%` }}
                />
            </div>

            {resumeVisible && (
                <button
                    onClick={resume}
                    className="fixed top-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                >
                    <Play size={13} />
                    {t('stories.resume')} {savedPct}%
                </button>
            )}
        </>
    );
}