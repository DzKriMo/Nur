'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { SurahContent } from '@/types';
import { Brain, Play, Pause, Eye, EyeOff, Mic, MicOff, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MemorizationModeProps {
    surah: SurahContent;
    chapterId: string;
    onExit: () => void;
}

interface VerseItem {
    verseNum: string;
    text: string;
}

interface SpeechRecognitionAlternative {
    transcript: string;
}

interface SpeechRecognitionEvent {
    results: Array<Array<SpeechRecognitionAlternative>>;
    resultIndex: number;
}

// Minimal typing for the Web Speech API (only exposed in some browsers)
interface SpeechRecognitionInstance {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionInstance;
}

type SpeechWindow = Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const REPEAT_OPTIONS = [1, 2, 3, 5, 7];

function normalizeArabic(text: string): string {
    return text
        .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED\u0610-\u061A]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/\s+/g, ' ')
        .trim();
}

function compareRecitation(spoken: string, target: string): { accuracy: number; missing: string[] } {
    const targetWords = normalizeArabic(target).split(' ').filter(Boolean);
    const spokenWords = normalizeArabic(spoken).split(' ').filter(Boolean);
    if (targetWords.length === 0) return { accuracy: 0, missing: [] };

    const missing = targetWords.filter((w) => !spokenWords.includes(w));
    const accuracy = Math.round(((targetWords.length - missing.length) / targetWords.length) * 100);
    return { accuracy, missing };
}

export default function MemorizationMode({ surah, chapterId, onExit }: MemorizationModeProps) {
    const { t } = useLanguage();
    const [repeats, setRepeats] = useState(3);
    const [fromVerse, setFromVerse] = useState(1);
    const [toVerse, setToVerse] = useState(surah.count);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hideText, setHideText] = useState(true);
    const [revealed, setRevealed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognitionResult, setRecognitionResult] = useState<{ accuracy: number; missing: string[] } | null>(null);
    const [speechUnsupported, setSpeechUnsupported] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const soundRef = useRef<Howl | null>(null);
    const repeatCountRef = useRef(0);
    const currentIdxRef = useRef(0);
    const repeatsRef = useRef(repeats);
    const isPlayingRef = useRef(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const versesRef = useRef<HTMLDivElement | null>(null);

    repeatsRef.current = repeats;

    const verses: VerseItem[] = Object.entries(surah.verse).map(([key, text]) => ({
        verseNum: key.split('_')[1],
        text,
    }));

    const rangeVerses = verses.filter((v) => {
        const n = parseInt(v.verseNum, 10);
        return n >= fromVerse && n <= toVerse;
    });

    const currentVerse = rangeVerses[Math.min(currentIdx, rangeVerses.length - 1)];

    const stopSound = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
            soundRef.current = null;
        }
        isPlayingRef.current = false;
        setIsPlaying(false);
    }, []);

    const playVerse = useCallback((idx: number) => {
        const verse = rangeVerses[idx];
        if (!verse) return;

        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }

        const padSurah = chapterId.padStart(3, '0');
        const padVerse = verse.verseNum.padStart(3, '0');
        const src = `/audio/${padSurah}/${padVerse}.mp3`;

        const sound = new Howl({
            src: [src],
            html5: true,
            onend: () => {
                repeatCountRef.current += 1;
                if (repeatCountRef.current < repeatsRef.current) {
                    sound.play();
                } else {
                    repeatCountRef.current = 0;
                    const nextIdx = idx + 1;
                    if (nextIdx < rangeVerses.length) {
                        playVerse(nextIdx);
                    } else {
                        stopSound();
                    }
                }
            },
            onloaderror: () => {
                setError('audio_missing');
                stopSound();
            },
        });

        soundRef.current = sound;
        currentIdxRef.current = idx;
        setCurrentIdx(idx);
        setRevealed(false);
        setRecognitionResult(null);
        isPlayingRef.current = true;
        setIsPlaying(true);
        sound.play();
    }, [chapterId, rangeVerses, stopSound]);

    const togglePlay = useCallback(() => {
        if (isPlayingRef.current) {
            stopSound();
        } else {
            repeatCountRef.current = 0;
            playVerse(currentIdxRef.current);
        }
    }, [playVerse, stopSound]);

    const jumpTo = useCallback((idx: number) => {
        const clamped = Math.max(0, Math.min(idx, rangeVerses.length - 1));
        currentIdxRef.current = clamped;
        setCurrentIdx(clamped);
        setRevealed(false);
        setRecognitionResult(null);
        if (isPlayingRef.current) {
            repeatCountRef.current = 0;
            playVerse(clamped);
        }
    }, [playVerse, rangeVerses.length]);

    const onExitMode = useCallback(() => {
        stopSound();
        onExit();
    }, [onExit, stopSound]);

    useEffect(() => {
        return () => {
            stopSound();
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onend = null;
                try { recognitionRef.current.stop(); } catch {}
            }
        };
    }, [stopSound]);

    const scrollToCurrent = () => {
        versesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    useEffect(() => {
        if (currentVerse && isPlaying) {
            scrollToCurrent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIdx]);

    const checkRecitation = () => {
        if (isListening) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch {}
            }
            setIsListening(false);
            return;
        }

        const win = window as SpeechWindow;
        const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SR) {
            setSpeechUnsupported(true);
            return;
        }

        setRecognitionResult(null);
        setSpeechUnsupported(false);

        const recognition = new SR();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const spoken = event.results[0]?.[0]?.transcript ?? '';
            const target = currentVerse?.text ?? '';
            setRecognitionResult(compareRecitation(spoken, target));
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognition.onerror = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognitionRef.current = recognition;
        setIsListening(true);
        try {
            recognition.start();
        } catch {
            setIsListening(false);
            setSpeechUnsupported(true);
        }
    };

    const changeFrom = (val: number) => {
        const v = Math.max(1, Math.min(val, toVerse, surah.count));
        setFromVerse(v);
        stopSound();
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    };

    const changeTo = (val: number) => {
        const v = Math.max(fromVerse, Math.min(val, surah.count));
        setToVerse(v);
        stopSound();
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    };

    const accuracy = recognitionResult?.accuracy ?? null;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain size={20} className="text-violet-600 dark:text-violet-400" />
                    <h2 className="font-bold text-slate-900 dark:text-white text-lg font-arabic">{surah.name}</h2>
                </div>
                <button
                    onClick={onExitMode}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    {t('common.close')}
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('quran.repeats')}</span>
                    <select
                        value={repeats}
                        onChange={(e) => setRepeats(parseInt(e.target.value, 10))}
                        className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {REPEAT_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}×</option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('quran.from')}</span>
                    <select
                        value={fromVerse}
                        onChange={(e) => changeFrom(parseInt(e.target.value, 10))}
                        className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {verses.map((v) => (
                            <option key={v.verseNum} value={parseInt(v.verseNum, 10)}>{v.verseNum}</option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>{t('quran.to')}</span>
                    <select
                        value={toVerse}
                        onChange={(e) => changeTo(parseInt(e.target.value, 10))}
                        className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {verses.map((v) => (
                            <option key={v.verseNum} value={parseInt(v.verseNum, 10)}>{v.verseNum}</option>
                        ))}
                    </select>
                </label>

                <button
                    onClick={() => setHideText(!hideText)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        hideText
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    )}
                >
                    {hideText ? <EyeOff size={15} /> : <Eye size={15} />}
                    {hideText ? t('quran.hide_text') : t('quran.show_text')}
                </button>
            </div>

            {/* Verse display */}
            <div
                ref={versesRef}
                className="min-h-[160px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center gap-4"
            >
                {currentVerse ? (
                    <>
                        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-medium text-sm">
                            {currentVerse.verseNum}
                        </div>
                        {hideText && !revealed ? (
                            <>
                                <p className="text-2xl md:text-3xl text-slate-300 dark:text-slate-600 font-arabic select-none">
                                    ﷽ ﷽ ﷽ ﷽ ﷽
                                </p>
                                <p className="text-sm text-slate-400 dark:text-slate-500">{t('quran.recite')}</p>
                            </>
                        ) : (
                            <p className="text-2xl md:text-3xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic text-center">
                                {currentVerse.text}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-slate-400">{t('common.loading')}</p>
                )}
            </div>

            {error && (
                <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertCircle size={15} />
                    {error === 'audio_missing' ? t('quran.audio_missing') : error}
                </p>
            )}

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4 mt-5">
                <button
                    onClick={() => jumpTo(currentIdx - 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                    title={t('quran.prev_verse')}
                >
                    <ChevronLeft size={20} className="rotate-180" />
                </button>

                <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg transition-colors"
                    title={t('quran.play_from_here')}
                >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                </button>

                <button
                    onClick={() => jumpTo(currentIdx + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                    title={t('quran.next_verse')}
                >
                    <ChevronRight size={20} className="rotate-180" />
                </button>
            </div>

            <div className="flex items-center justify-center mt-4 gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{currentIdx + 1}</span>
                <span>/</span>
                <span>{rangeVerses.length}</span>
            </div>

            {/* Recitation check */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={checkRecitation}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                            isListening
                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                    >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        {isListening ? t('quran.reciting') : t('quran.check_recitation')}
                    </button>

                    {!isListening && !recognitionResult && !speechUnsupported && hideText && !revealed && (
                        <button
                            onClick={() => setRevealed(true)}
                            className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
                        >
                            {t('quran.reveal')}
                        </button>
                    )}

                    {speechUnsupported && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{t('quran.speech_unsupported')}</p>
                    )}

                    {recognitionResult && (
                        <div className="w-full max-w-md">
                            <div className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium mb-2",
                                accuracy !== null && accuracy >= 80
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    : accuracy !== null && accuracy >= 50
                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                                {accuracy !== null && accuracy >= 80 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>{t('quran.accuracy')}: {accuracy}%</span>
                            </div>
                            {recognitionResult.missing.length > 0 ? (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {t('quran.missed_words')}: <span className="font-arabic">{recognitionResult.missing.join(' · ')}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">{t('quran.no_missed')}</p>
                            )}
                            <div className="flex justify-center mt-3">
                                <button
                                    onClick={() => setRevealed(true)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {t('quran.reveal')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}