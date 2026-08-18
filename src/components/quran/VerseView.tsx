'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SurahContent, TranslationContent } from '@/types';
import { Play, Pause, Share2, Check, ListMusic } from 'lucide-react';
import { Howl } from 'howler';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface VerseViewProps {
    surah: SurahContent;
    translation: TranslationContent;
    tafseer: TranslationContent;
    chapterId: string;
}

export default function VerseView({ surah, translation, tafseer, chapterId }: VerseViewProps) {
    const [playingVerse, setPlayingVerse] = useState<string | null>(null);
    const [sound, setSound] = useState<Howl | null>(null);
    const [activeTab, setActiveTab] = useState<'translation' | 'tafseer'>('translation');
    const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
    const autoPlayRef = useRef(false);
    const verseRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const soundRef = useRef<Howl | null>(null);
    const { t } = useLanguage();

    const verses = Object.entries(surah.verse).map(([key, text]) => {
        const verseNum = key.split('_')[1];
        return {
            key,
            verseNum,
            text,
            translation: translation.verse[key] || '',
            tafseer: tafseer.verse[key] || ''
        };
    });

    const stopSound = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
            soundRef.current = null;
        }
        setSound(null);
        setPlayingVerse(null);
    }, []);

    const playVerse = useCallback((verseNum: string) => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
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
                    if (parseInt(nextVerseNum) <= verses.length) {
                        setTimeout(() => playVerse(nextVerseNum), 300);
                    } else {
                        autoPlayRef.current = false;
                    }
                }
            },
            onloaderror: () => {
                setPlayingVerse(null);
                autoPlayRef.current = false;
            }
        });

        soundRef.current = newSound;
        setSound(newSound);
        setPlayingVerse(verseNum);
        newSound.play();
    }, [chapterId, verses.length]);

    const togglePlay = (verseNum: string) => {
        if (playingVerse === verseNum) {
            stopSound();
            autoPlayRef.current = false;
        } else {
            autoPlayRef.current = false;
            playVerse(verseNum);
        }
    };

    const playChapter = () => {
        autoPlayRef.current = true;
        playVerse('1');
    };

    const playFromHere = (verseNum: string) => {
        autoPlayRef.current = true;
        playVerse(verseNum);
    };

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.unload();
            }
        };
    }, []);

    useEffect(() => {
        if (playingVerse) {
            const element = verseRefs.current.get(playingVerse);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [playingVerse]);

    const shareVerse = async (verseNum: string, text: string, trans: string) => {
        const shareText = `${surah.name} ${verseNum}: ${text}\n\n${trans}`;
        if (navigator.share) {
            try { await navigator.share({ text: shareText }); } catch {}
        } else {
            await navigator.clipboard.writeText(shareText);
            setCopiedVerse(verseNum);
            setTimeout(() => setCopiedVerse(null), 2000);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 backdrop-blur-xl sticky top-[56px] md:top-[128px] z-30">
                <div className="flex gap-1">
                    <button
                        onClick={() => setActiveTab('translation')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'translation'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        {t('quran.translation')}
                    </button>
                    <button
                        onClick={() => setActiveTab('tafseer')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'tafseer'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        {t('quran.tafseer')}
                    </button>
                </div>
                <button
                    onClick={playChapter}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
                >
                    <Play size={16} />
                    <span className="hidden sm:inline">{t('common.listen')}</span>
                </button>
            </div>

            <div className="space-y-4">
                {verses.map((verse) => (
                    <div
                        key={verse.key}
                        id={`verse-${verse.verseNum}`}
                        ref={(el) => {
                            if (el) verseRefs.current.set(verse.verseNum, el);
                            else verseRefs.current.delete(verse.verseNum);
                        }}
                        className={cn(
                            "bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border transition-all duration-300",
                            playingVerse === verse.verseNum
                                ? "border-emerald-500 ring-1 ring-emerald-500/50 shadow-emerald-100 dark:shadow-none"
                                : "border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                        )}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                                    {verse.verseNum}
                                </div>
                                <button
                                    onClick={() => togglePlay(verse.verseNum)}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                        playingVerse === verse.verseNum
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {playingVerse === verse.verseNum ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <button
                                    onClick={() => playFromHere(verse.verseNum)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                    title={t('quran.play_from_here')}
                                >
                                    <ListMusic size={13} />
                                    <span className="hidden sm:inline">{t('quran.play_from_here')}</span>
                                </button>
                            </div>
                            <button
                                onClick={() => shareVerse(verse.verseNum, verse.text, verse.translation)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                                title={t('quran.share_verse')}
                            >
                                {copiedVerse === verse.verseNum ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                            </button>
                        </div>

                        <div className="text-right mb-5">
                            <p className="text-2xl md:text-3xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic">
                                {verse.text}
                            </p>
                        </div>

                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                            {activeTab === 'translation' ? (
                                <p>{verse.translation}</p>
                            ) : (
                                <div className="text-right font-arabic text-slate-700 dark:text-slate-300 leading-loose">
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
