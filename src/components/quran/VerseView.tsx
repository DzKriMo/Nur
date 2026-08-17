'use client';

import { useState, useRef, useEffect } from 'react';
import { SurahContent, TranslationContent } from '@/types';
import { Play, Pause, BookOpen, Info } from 'lucide-react';
import { Howl } from 'howler';
import { cn } from '@/lib/utils';

interface VerseViewProps {
    surah: SurahContent;
    translation: TranslationContent;
    tafseer: TranslationContent;
    chapterId: string;
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function VerseView({ surah, translation, tafseer, chapterId }: VerseViewProps) {
    const [playingVerse, setPlayingVerse] = useState<string | null>(null);
    const [sound, setSound] = useState<Howl | null>(null);
    const [activeTab, setActiveTab] = useState<'translation' | 'tafseer'>('translation');
    const autoPlayRef = useRef(false);
    const verseRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const { t } = useLanguage();

    // Convert verses object to array
    const verses = Object.entries(surah.verse).map(([key, text]) => {
        const verseNum = key.split('_')[1];
        return {
            key,
            verseNum,
            text,
            translation: translation.verse[key],
            tafseer: tafseer.verse[key]
        };
    });

    const stopSound = () => {
        if (sound) {
            sound.stop();
            sound.unload();
            setSound(null);
        }
        setPlayingVerse(null);
    };

    const playVerse = (verseNum: string) => {
        // Stop any currently playing sound but don't reset autoPlayRef if we are in a sequence
        if (sound) {
            sound.stop();
            sound.unload();
        }

        const padSurah = chapterId.padStart(3, '0');
        const padVerse = verseNum.padStart(3, '0');
        const src = `/audio/${padSurah}/${padVerse}.mp3`;

        const newSound = new Howl({
            src: [src],
            html5: true,
            onend: () => {
                setPlayingVerse(null);
                if (autoPlayRef.current) {
                    const nextVerseNum = (parseInt(verseNum) + 1).toString();
                    // Check if next verse exists
                    if (parseInt(nextVerseNum) <= verses.length) {
                        playVerse(nextVerseNum);
                    } else {
                        autoPlayRef.current = false;
                    }
                }
            }
        });

        setSound(newSound);
        setPlayingVerse(verseNum);
        newSound.play();
    };

    const togglePlay = (verseNum: string) => {
        if (playingVerse === verseNum) {
            stopSound();
            autoPlayRef.current = false;
        } else {
            // If user manually plays a verse, we don't necessarily want auto-play unless they clicked "Play Surah"
            // But usually manual play is just for that verse.
            autoPlayRef.current = false;
            playVerse(verseNum);
        }
    };

    const playChapter = () => {
        autoPlayRef.current = true;
        playVerse('1');
    };

    useEffect(() => {
        return () => {
            if (sound) sound.unload();
        };
    }, [sound]);

    // Auto-scroll effect
    useEffect(() => {
        if (playingVerse) {
            const element = verseRefs.current.get(playingVerse);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [playingVerse]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-4 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('translation')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'translation'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        Translation
                    </button>
                    <button
                        onClick={() => setActiveTab('tafseer')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'tafseer'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        Tafseer
                    </button>
                </div>
                <button
                    onClick={playChapter}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                    <Play size={16} />
                    <span className="hidden sm:inline">{t('common.listen')}</span>
                </button>
            </div>

            <div className="space-y-6">
                {verses.map((verse) => (
                    <div
                        key={verse.key}
                        id={`verse-${verse.verseNum}`}
                        ref={(el) => {
                            if (el) verseRefs.current.set(verse.verseNum, el);
                            else verseRefs.current.delete(verse.verseNum);
                        }}
                        className={cn(
                            "bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border transition-all duration-300",
                            playingVerse === verse.verseNum
                                ? "border-emerald-500 ring-1 ring-emerald-500 shadow-emerald-100 dark:shadow-none"
                                : "border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                        )}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium text-sm">
                                    {verse.verseNum}
                                </div>
                                <button
                                    onClick={() => togglePlay(verse.verseNum)}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        playingVerse === verse.verseNum
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {playingVerse === verse.verseNum ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right mb-8">
                            <p className="text-3xl md:text-4xl leading-[2] font-serif text-slate-800 dark:text-slate-100 font-arabic">
                                {verse.text}
                            </p>
                        </div>

                        <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                            {activeTab === 'translation' ? (
                                <p>{verse.translation}</p>
                            ) : (
                                <div className="text-right font-arabic text-slate-700 dark:text-slate-300">
                                    {verse.tafseer}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
