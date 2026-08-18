'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useStoredState } from '@/lib/storage';

export interface VerseBookmark {
    surahId: string;
    verseNum: string;
    surahName: string;
    surahNameAr: string;
    timestamp: number;
}

export interface HadithFavorite {
    bookId: string;
    chapterId: number;
    hadithId: number;
    idInBook: number;
    arabic: string;
    narrator: string;
    text: string;
    bookName: string;
    bookNameAr: string;
    timestamp: number;
}

export interface LastRead {
    surahId: string;
    verseNum: string;
    surahName: string;
    timestamp: number;
}

interface LearnEntry {
    completed: boolean;
    score: number;
}

interface BookmarksContextType {
    quranBookmarks: VerseBookmark[];
    isVerseBookmarked: (surahId: string, verseNum: string) => boolean;
    toggleVerseBookmark: (bookmark: Omit<VerseBookmark, 'timestamp'>) => void;
    removeVerseBookmark: (surahId: string, verseNum: string) => void;

    hadithFavorites: HadithFavorite[];
    isHadithFavorite: (bookId: string, hadithId: number) => boolean;
    toggleHadithFavorite: (fav: Omit<HadithFavorite, 'timestamp'>) => void;
    removeHadithFavorite: (bookId: string, hadithId: number) => void;

    lastRead: LastRead | null;
    saveLastRead: (surahId: string, verseNum: string, surahName: string) => void;

    storyProgress: Record<string, number>;
    saveStoryProgress: (storyId: string, pct: number) => void;
    completedStories: string[];
    markStoryCompleted: (storyId: string) => void;

    learnProgress: Record<string, LearnEntry>;
    markLearnCompleted: (lessonId: string, score: number) => void;

    adhkarDoneToday: Record<string, boolean>;
    markAdhkarDone: (filename: string) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
    const [quranBookmarks, setQuranBookmarks] = useStoredState<VerseBookmark[]>('nur-quran-bookmarks', []);
    const [hadithFavorites, setHadithFavorites] = useStoredState<HadithFavorite[]>('nur-hadith-favorites', []);
    const [lastRead, setLastRead] = useStoredState<LastRead | null>('nur-last-read', null);
    const [storyProgress, setStoryProgress] = useStoredState<Record<string, number>>('nur-story-progress', {});
    const [storyCompletedSet, setStoryCompletedSet] = useStoredState<string[]>('nur-story-completed', []);
    const [learnProgress, setLearnProgress] = useStoredState<Record<string, LearnEntry>>('nur-learn-progress', {});
    const [adhkarDone, setAdhkarDone] = useStoredState<Record<string, boolean>>('nur-adhkar-done', {});

    const isVerseBookmarked = useCallback((surahId: string, verseNum: string) =>
        quranBookmarks.some(b => b.surahId === surahId && b.verseNum === verseNum), [quranBookmarks]);

    const toggleVerseBookmark = useCallback((bookmark: Omit<VerseBookmark, 'timestamp'>) => {
        setQuranBookmarks(prev => {
            const exists = prev.some(b => b.surahId === bookmark.surahId && b.verseNum === bookmark.verseNum);
            if (exists) return prev.filter(b => !(b.surahId === bookmark.surahId && b.verseNum === bookmark.verseNum));
            return [{ ...bookmark, timestamp: Date.now() }, ...prev];
        });
    }, [setQuranBookmarks]);

    const removeVerseBookmark = useCallback((surahId: string, verseNum: string) => {
        setQuranBookmarks(prev => prev.filter(b => !(b.surahId === surahId && b.verseNum === verseNum)));
    }, [setQuranBookmarks]);

    const isHadithFavorite = useCallback((bookId: string, hadithId: number) =>
        hadithFavorites.some(f => f.bookId === bookId && f.hadithId === hadithId), [hadithFavorites]);

    const toggleHadithFavorite = useCallback((fav: Omit<HadithFavorite, 'timestamp'>) => {
        setHadithFavorites(prev => {
            const exists = prev.some(f => f.bookId === fav.bookId && f.hadithId === fav.hadithId);
            if (exists) return prev.filter(f => !(f.bookId === fav.bookId && f.hadithId === fav.hadithId));
            return [{ ...fav, timestamp: Date.now() }, ...prev];
        });
    }, [setHadithFavorites]);

    const removeHadithFavorite = useCallback((bookId: string, hadithId: number) => {
        setHadithFavorites(prev => prev.filter(f => !(f.bookId === bookId && f.hadithId === hadithId)));
    }, [setHadithFavorites]);

    const saveLastRead = useCallback((surahId: string, verseNum: string, surahName: string) => {
        setLastRead({ surahId, verseNum, surahName, timestamp: Date.now() });
    }, [setLastRead]);

    const saveStoryProgress = useCallback((storyId: string, pct: number) => {
        setStoryProgress(prev => {
            if ((prev[storyId] ?? 0) >= 95) return prev;
            return { ...prev, [storyId]: pct };
        });
    }, [setStoryProgress]);

    const markStoryCompleted = useCallback((storyId: string) => {
        setStoryCompletedSet(prev => prev.includes(storyId) ? prev : [...prev, storyId]);
        setStoryProgress(prev => ({ ...prev, [storyId]: 100 }));
    }, [setStoryCompletedSet, setStoryProgress]);

    const markLearnCompleted = useCallback((lessonId: string, score: number) => {
        setLearnProgress(prev => {
            const existing = prev[lessonId];
            if (existing && existing.score >= score) return prev;
            return { ...prev, [lessonId]: { completed: true, score } };
        });
    }, [setLearnProgress]);

    const markAdhkarDone = useCallback((filename: string) => {
        setAdhkarDone(prev => ({ ...prev, [filename]: true }));
    }, [setAdhkarDone]);

    const value: BookmarksContextType = {
        quranBookmarks,
        isVerseBookmarked,
        toggleVerseBookmark,
        removeVerseBookmark,
        hadithFavorites,
        isHadithFavorite,
        toggleHadithFavorite,
        removeHadithFavorite,
        lastRead,
        saveLastRead,
        storyProgress,
        saveStoryProgress,
        completedStories: storyCompletedSet,
        markStoryCompleted,
        learnProgress,
        markLearnCompleted,
        adhkarDoneToday: adhkarDone,
        markAdhkarDone,
    };

    return (
        <BookmarksContext.Provider value={value}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarksContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarksProvider');
    }
    return context;
}
