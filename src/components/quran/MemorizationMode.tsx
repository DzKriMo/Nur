'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { SurahContent } from '@/types';
import {
    Brain, Play, Pause, Mic, MicOff, ChevronLeft, ChevronRight,
    CheckCircle2, XCircle, AlertCircle, Flame, Target, Trophy, SkipForward,
    RotateCcw, ListMusic, Award, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';
import {
    DEFAULT_MEMORIZATION_STATE, MEMORIZATION_STORAGE_KEY,
    normalizeArabicTokens, matchSpokenWords, recordVerse,
    getTodayVerses, getStreak, getTotalVerses, getSurahProgress,
    getUnlockedMilestones, getNewlyUnlockedMilestones,
    MemorizationState,
} from '@/lib/memorization';

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

interface SpeechRecognitionResultEvent {
    results: Array<{ isFinal: boolean; [index: number]: SpeechRecognitionAlternative }>;
    resultIndex: number;
}

interface SpeechRecognitionInstance {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
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

interface RecitationResult {
    accuracy: number;
    revealed: number;
    total: number;
    missing: string[];
}

export default function MemorizationMode({ surah, chapterId, onExit }: MemorizationModeProps) {
    const { t } = useLanguage();
    const [tab, setTab] = useState<'memorize' | 'listen'>('memorize');
    const [repeats, setRepeats] = useState(3);
    const [fromVerse, setFromVerse] = useState(1);
    const [toVerse, setToVerse] = useState(surah.count);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [revealedWords, setRevealedWords] = useState(0);
    const [speechUnsupported, setSpeechUnsupported] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RecitationResult | null>(null);
    const [celebration, setCelebration] = useState<string | null>(null);
    const [milestoneCelebration, setMilestoneCelebration] = useState<number | null>(null);
    const [progress, setProgress] = useStoredState<MemorizationState>(
        MEMORIZATION_STORAGE_KEY,
        DEFAULT_MEMORIZATION_STATE
    );

    const progressRef = useRef(progress);
    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    const soundRef = useRef<Howl | null>(null);
    const repeatCountRef = useRef(0);
    const currentIdxRef = useRef(0);
    const isPlayingRef = useRef(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const versesRef = useRef<HTMLDivElement | null>(null);
    const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const transcriptRef = useRef('');
    const cursorRef = useRef(0);
    const targetWordsRef = useRef<string[]>([]);
    const autoContinueRef = useRef(false);

    const verses: VerseItem[] = Object.entries(surah.verse).map(([key, text]) => ({
        verseNum: key.split('_')[1],
        text,
    }));

    const rangeVerses = verses.filter((v) => {
        const n = parseInt(v.verseNum, 10);
        return n >= fromVerse && n <= toVerse;
    });

    const currentVerse = rangeVerses[Math.min(currentIdx, rangeVerses.length - 1)];

    // Keep the ref in sync with the index (also updated by auto-advance)
    useEffect(() => {
        currentIdxRef.current = currentIdx;
    }, [currentIdx]);

    // Reset recitation state whenever the current verse changes
    useEffect(() => {
        transcriptRef.current = '';
        cursorRef.current = 0;
        targetWordsRef.current = currentVerse ? normalizeArabicTokens(currentVerse.text) : [];
        setRevealedWords(0);
        setResult(null);
        setCelebration(null);
        setError(null);
    }, [currentIdx, currentVerse]);

    const todayVerses = getTodayVerses(progress);
    const streak = getStreak(progress);
    const totalVerses = getTotalVerses(progress);
    const surahProgress = getSurahProgress(progress, chapterId);
    const unlockedMilestones = getUnlockedMilestones(totalVerses);
    const dailyGoal = progress.dailyGoal;
    const goalProgress = Math.min(100, Math.round((todayVerses / Math.max(1, dailyGoal)) * 100));

    const stopSound = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
            soundRef.current = null;
        }
        isPlayingRef.current = false;
        setIsPlaying(false);
    }, []);

    const stopRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch {}
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    const onExitMode = useCallback(() => {
        stopSound();
        stopRecognition();
        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
        if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        onExit();
    }, [onExit, stopSound, stopRecognition]);

    useEffect(() => {
        return () => {
            stopSound();
            stopRecognition();
            if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        };
    }, [stopSound, stopRecognition]);

    const recordAttempt = useCallback((accuracy: number) => {
        const prev = progressRef.current;
        const prevTotal = getTotalVerses(prev);
        const next = recordVerse(prev, chapterId, currentVerse.verseNum, accuracy);
        setProgress(next);
        const newly = getNewlyUnlockedMilestones(prevTotal, getTotalVerses(next));
        if (newly.length > 0) {
            setMilestoneCelebration(newly[newly.length - 1]);
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
            celebrationTimerRef.current = setTimeout(() => setMilestoneCelebration(null), 4000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapterId, currentVerse]);

    const startListening = useCallback(() => {
        const win = window as SpeechWindow;
        const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SR) {
            setSpeechUnsupported(true);
            return;
        }

        stopRecognition();
        setSpeechUnsupported(false);
        setResult(null);
        setCelebration(null);
        transcriptRef.current = '';
        cursorRef.current = 0;
        setRevealedWords(0);

        const recognition = new SR();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                const transcript = res[0]?.transcript ?? '';
                if (res.isFinal) final += transcript + ' ';
                else interim += transcript + ' ';
            }
            if (final) transcriptRef.current = transcriptRef.current + final;
            const combined = transcriptRef.current + ' ' + interim;

            const target = targetWordsRef.current;
            if (target.length === 0) return;
            const spokenTokens = normalizeArabicTokens(combined);
            const matched = matchSpokenWords(spokenTokens, target, cursorRef.current);
            if (matched > 0) {
                cursorRef.current += matched;
                setRevealedWords(cursorRef.current);
                if (cursorRef.current >= target.length) {
                    // Verse fully revealed — record and auto-advance
                    const accuracy = Math.round((cursorRef.current / target.length) * 100);
                    recordAttempt(accuracy);
                    stopRecognition();
                    setResult({ accuracy, revealed: cursorRef.current, total: target.length, missing: [] });
                    setCelebration('verse_complete');
                    const idx = currentIdxRef.current;
                    if (idx + 1 < rangeVerses.length) {
                        autoContinueRef.current = true;
                        advanceTimerRef.current = setTimeout(() => {
                            setCurrentIdx(idx + 1);
                        }, 2200);
                    } else {
                        advanceTimerRef.current = setTimeout(() => setCelebration('range_complete'), 2200);
                    }
                }
            }
        };

        recognition.onend = () => {
            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
            setIsListening(false);
        };

        recognition.onerror = () => {
            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        setIsListening(true);
        try {
            recognition.start();
        } catch {
            setIsListening(false);
            setSpeechUnsupported(true);
        }
    }, [rangeVerses.length, recordAttempt, stopRecognition]);

    const startListeningRef = useRef(startListening);
    useEffect(() => {
        startListeningRef.current = startListening;
    }, [startListening]);

    // Auto-continue: when a verse is fully revealed, the next verse appears and
    // we restart listening automatically so the session flows verse to verse.
    useEffect(() => {
        if (autoContinueRef.current) {
            autoContinueRef.current = false;
            if (tab === 'memorize') {
                startListeningRef.current();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIdx]);

    const stopListening = useCallback(() => {
        const target = targetWordsRef.current;
        const revealed = cursorRef.current;
        stopRecognition();
        if (target.length > 0) {
            const accuracy = Math.round((revealed / target.length) * 100);
            const missing = target.slice(revealed);
            recordAttempt(accuracy);
            setResult({ accuracy, revealed, total: target.length, missing });
            if (accuracy >= 85) {
                setCelebration('perfect');
            } else if (accuracy >= 50) {
                setCelebration('great');
            } else {
                setCelebration(null);
            }
        }
    }, [recordAttempt, stopRecognition]);

    const skipVerse = useCallback(() => {
        stopRecognition();
        const idx = currentIdxRef.current;
        if (idx + 1 < rangeVerses.length) {
            setCurrentIdx(idx + 1);
        } else {
            setCelebration('range_complete');
        }
    }, [rangeVerses.length, stopRecognition]);

    // ---- Listen & Repeat playback ----
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
                if (repeatCountRef.current < repeats) {
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
        isPlayingRef.current = true;
        setIsPlaying(true);
        sound.play();
    }, [chapterId, rangeVerses, repeats, stopSound]);

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
        if (isPlayingRef.current) {
            repeatCountRef.current = 0;
            playVerse(clamped);
        }
    }, [playVerse, rangeVerses.length]);

    const changeFrom = (val: number) => {
        const v = Math.max(1, Math.min(val, toVerse, surah.count));
        setFromVerse(v);
        stopSound();
        stopRecognition();
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    };

    const changeTo = (val: number) => {
        const v = Math.max(fromVerse, Math.min(val, surah.count));
        setToVerse(v);
        stopSound();
        stopRecognition();
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    };

    const currentDisplayWords = currentVerse ? currentVerse.text.split(' ').filter(Boolean) : [];

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

            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                <button
                    onClick={() => { stopRecognition(); setTab('memorize'); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        tab === 'memorize'
                            ? "bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                >
                    <Brain size={15} />
                    {t('quran.memorize_tab')}
                </button>
                <button
                    onClick={() => { stopRecognition(); setTab('listen'); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        tab === 'listen'
                            ? "bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                >
                    <ListMusic size={15} />
                    {t('quran.listen_tab')}
                </button>
            </div>

            {/* Range + repeats controls */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
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

                {tab === 'listen' && (
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
                )}

                {tab === 'listen' && (
                    <button
                        onClick={() => setTab('memorize')}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                    >
                        <Mic size={15} />
                        {t('quran.tap_mic')}
                    </button>
                )}
            </div>

            {/* Verse display */}
            <div
                ref={versesRef}
                className="min-h-[170px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center gap-4"
            >
                {currentVerse ? (
                    <>
                        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-medium text-sm">
                            {currentVerse.verseNum}
                        </div>

                        {tab === 'memorize' ? (
                            <>
                                {isListening && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        {t('quran.listening')}
                                    </p>
                                )}
                                <p className="text-2xl md:text-3xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic text-center">
                                    {currentDisplayWords.map((word, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "inline-block transition-all duration-300 mx-0.5",
                                                i < revealedWords
                                                    ? "text-emerald-700 dark:text-emerald-400"
                                                    : "text-slate-300 dark:text-slate-600"
                                            )}
                                        >
                                            {i < revealedWords ? word : '••••'}
                                        </span>
                                    ))}
                                </p>
                                {!isListening && !result && revealedWords > 0 && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {revealedWords}/{targetWordsRef.current.length} {t('quran.words_revealed')}
                                    </p>
                                )}
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

            {/* Memorize controls */}
            {tab === 'memorize' && (
                <>
                    {speechUnsupported && (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">{t('quran.speech_unsupported')}</p>
                    )}

                    <div className="flex items-center justify-center gap-4 mt-5">
                        <button
                            onClick={() => { if (isPlaying) { stopSound(); } if (!isListening) skipVerse(); }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                            title={t('quran.skip_verse')}
                        >
                            <SkipForward size={18} className="rotate-180" />
                        </button>

                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={cn(
                                "w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-colors",
                                isListening
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                            )}
                            title={isListening ? t('quran.stop_mic') : t('quran.tap_mic')}
                        >
                            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <button
                            onClick={skipVerse}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                            title={t('quran.skip_verse')}
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>

                    <p className="text-center mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {t('quran.memorize_hint')}
                    </p>
                </>
            )}

            {/* Listen controls */}
            {tab === 'listen' && (
                <>
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

                    <p className="text-center mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {t('quran.listen_first')}
                    </p>
                </>
            )}

            <div className="flex items-center justify-center mt-4 gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{currentIdx + 1}</span>
                <span>/</span>
                <span>{rangeVerses.length}</span>
            </div>

            {/* Result / celebration panel */}
            {(result || celebration || milestoneCelebration) && (
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                    {milestoneCelebration !== null && (
                        <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 animate-pulse">
                            <Award size={16} />
                            {t('quran.milestone_reached')} {milestoneCelebration} {t('quran.memorized_total')}
                        </div>
                    )}

                    {celebration && (
                        <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <CheckCircle2 size={16} />
                            {celebration === 'verse_complete' && t('quran.verse_complete')}
                            {celebration === 'surah_complete' && t('quran.surah_complete')}
                            {celebration === 'range_complete' && t('quran.range_complete')}
                            {celebration === 'perfect' && t('quran.perfect')}
                            {celebration === 'great' && t('quran.great')}
                            <span className="font-normal opacity-80">· {t('quran.auto_advancing')}</span>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-2">
                            <div className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium",
                                result.accuracy >= 85
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    : result.accuracy >= 50
                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                                {result.accuracy >= 85 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>{t('quran.accuracy')}: {result.accuracy}%</span>
                                <span className="opacity-70 ml-auto">({result.revealed}/{result.total})</span>
                            </div>

                            {result.missing.length > 0 ? (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {t('quran.weak_words')}: <span className="font-arabic">{result.missing.slice(0, 8).join(' · ')}</span>
                                    {result.missing.length > 8 && ' …'}
                                </p>
                            ) : (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">{t('quran.no_missed')}</p>
                            )}

                            {result.accuracy < 85 && (
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => { setResult(null); if (!isListening) startListening(); }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                                    >
                                        <RotateCcw size={15} />
                                        {t('quran.retry_verse')}
                                    </button>
                                    <button
                                        onClick={skipVerse}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <SkipForward size={15} />
                                        {t('quran.skip_verse')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Journey / progress */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                        <Trophy size={16} className="text-amber-500" />
                        {t('quran.your_progress')}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                        {t('quran.daily_goal')}
                        <select
                            value={dailyGoal}
                            onChange={(e) => setProgress({ ...progress, dailyGoal: parseInt(e.target.value, 10) })}
                            className="px-1.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                        >
                            {[1, 3, 5, 10, 20, 50].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                            <Target size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{todayVerses}<span className="text-xs font-normal text-slate-500 dark:text-slate-400">/{dailyGoal}</span></p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.today')}</p>
                        <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                            <Flame size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{streak}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.streak')}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                            <CheckCircle2 size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{totalVerses}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.memorized_total')}</p>
                    </div>
                </div>

                {/* Surah mastery + milestones */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('quran.surah_mastery')}</p>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {surahProgress.mastered}<span className="text-slate-400">/{surahProgress.total || '–'}</span>
                        </p>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${surahProgress.total > 0 ? Math.round((surahProgress.mastered / surahProgress.total) * 100) : 0}%` }}
                        />
                    </div>
                    {unlockedMilestones.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            {unlockedMilestones.map((m) => (
                                <span key={m} className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[11px] font-medium">
                                    <Star size={11} fill="currentColor" />
                                    {m}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}