'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Howl } from 'howler';
import { SurahContent } from '@/types';
import {
    Brain, Play, Pause, Mic, MicOff, ChevronLeft, ChevronRight,
    CheckCircle2, XCircle, AlertCircle, Flame, Target, Trophy, SkipForward,
    RotateCcw, ListMusic, Award, Star, Volume2, RefreshCw, Square, Eye, EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStoredState } from '@/lib/storage';
import { Riwaya, RIAWAYA_OPTIONS } from '@/lib/riwaya';
import {
    DEFAULT_MEMORIZATION_STATE, MEMORIZATION_STORAGE_KEY,
    normalizeArabicTokens, alignTokensMulti, recordVerse,
    getTodayVerses, getStreak, getTotalVerses, getSurahProgress,
    getUnlockedMilestones, getNewlyUnlockedMilestones, getSurahWeakWords,
    MemorizationState,
} from '@/lib/memorization';

interface MemorizationModeProps {
    surah: SurahContent;
    chapterId: string;
    riwaya?: Riwaya;
    onExit: () => void;
    // Cross-surah review: a flat list of mastered verses from any surah.
    // When provided, the session runs as a global review over these verses.
    externalVerses?: MemorizationExternalVerse[];
}

export interface MemorizationExternalVerse {
    verseNum: string;
    text: string;
    surahId: string;
    surahName: string;
}

interface VerseItem {
    verseNum: string;
    text: string;
    surahId?: string;
    surahName?: string;
}

interface SpeechRecognitionAlternative {
    transcript: string;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultEvent {
    results: Array<SpeechRecognitionResult>;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognitionInstance {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
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
const MAX_ALTERNATIVES = 3;
const LOOKAHEAD = 5;

// Errors that mean the mic can't be used at all (don't auto-restart).
const MIC_FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'language-not-supported', 'audio-capture']);

interface RecitationResult {
    accuracy: number;
    revealed: number;
    total: number;
    missing: string[];
}

export default function MemorizationMode({ surah, chapterId, riwaya = 'hafs', onExit, externalVerses }: MemorizationModeProps) {
    const { t } = useLanguage();
    const [tab, setTab] = useState<'memorize' | 'listen'>('memorize');
    const [repeats, setRepeats] = useState(3);
    const [fromVerse, setFromVerse] = useState(1);
    const [toVerse, setToVerse] = useState(surah.count);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [revealedWords, setRevealedWords] = useState(0);
    const [skippedIndices, setSkippedIndices] = useState<number[]>([]);
    const [speechUnsupported, setSpeechUnsupported] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [noSpeechHint, setNoSpeechHint] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RecitationResult | null>(null);
    const [celebration, setCelebration] = useState<string | null>(null);
    const [milestoneCelebration, setMilestoneCelebration] = useState<number | null>(null);
    const [reviewActive, setReviewActive] = useState(false);
    const [reviewList, setReviewList] = useState<VerseItem[]>([]);
    const [reviewSummary, setReviewSummary] = useState<{ total: number; strong: number } | null>(null);
    const [isHearing, setIsHearing] = useState(false);
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
    const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hearRef = useRef<Howl | null>(null);
    const reviewActiveRef = useRef(false);
    const reviewStrongRef = useRef(0);

    // Live detection state (kept in refs so recognition callbacks stay fresh).
    // Per alternative: finalized token stream (persistent, trimmed as the
    // frontier advances) + current interim transcript text.
    const finalTokensRef = useRef<string[][]>([]);
    const interimTextRef = useRef<string[]>([]);
    const revealedRef = useRef(0);
    const missedSetRef = useRef<Set<number>>(new Set());
    const keepListeningRef = useRef(false);
    const hardStopRef = useRef(false);
    const completedRef = useRef(false);
    const autoContinueRef = useRef(false);
    const receivedSpeechRef = useRef(false);
    const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const targetWordsRef = useRef<string[]>([]);
    const lastResultsLengthRef = useRef(0);
    const resultsCutoffRef = useRef(0);

    const verses = useMemo<VerseItem[]>(
        () => externalVerses && externalVerses.length > 0
            ? externalVerses.map((v) => ({
                verseNum: v.verseNum,
                text: v.text,
                surahId: v.surahId,
                surahName: v.surahName,
            }))
            : Object.entries(surah.verse).map(([key, text]) => ({
                verseNum: key.split('_')[1],
                text,
            })),
        [surah.verse, externalVerses]
    );

    const rangeVerses = useMemo(
        () => verses.filter((v) => {
            const n = parseInt(v.verseNum, 10);
            return n >= fromVerse && n <= toVerse;
        }),
        [verses, fromVerse, toVerse]
    );

    const activeVerses = reviewActive ? reviewList : rangeVerses;

    const currentVerse = activeVerses[Math.min(currentIdx, activeVerses.length - 1)];

    useEffect(() => {
        reviewActiveRef.current = reviewActive;
    }, [reviewActive]);

    // Keep the ref in sync with the index (also updated by auto-advance)
    useEffect(() => {
        currentIdxRef.current = currentIdx;
    }, [currentIdx]);

    // Reset recitation state whenever the current verse changes. Depends on the
    // stable verseNum (currentVerse object ref would change every render and
    // wipe the live reveal mid-verse).
    useEffect(() => {
        if (autoContinueRef.current) {
            // Auto-advance: keep the accumulated speech streams and the results
            // cutoff (already past the finished verse), because the user may
            // have started reciting the next verse during the transition — that
            // speech must survive into the new verse's alignment.
        } else {
            finalTokensRef.current = [];
            interimTextRef.current = [];
            resultsCutoffRef.current = lastResultsLengthRef.current;
            setLiveTranscript('');
        }
        revealedRef.current = 0;
        missedSetRef.current = new Set();
        completedRef.current = false;
        targetWordsRef.current = currentVerse ? normalizeArabicTokens(currentVerse.text) : [];
        receivedSpeechRef.current = false;
        setRevealedWords(0);
        setSkippedIndices([]);
        setResult(null);
        setCelebration(null);
        setError(null);
        setNoSpeechHint(false);
        setReviewSummary(null);
    }, [currentIdx, currentVerse?.verseNum, currentVerse, reviewActive]);

    // Global review mode: initialize the session over the external verses.
    const isGlobalReview = !!(externalVerses && externalVerses.length > 0);
    useEffect(() => {
        if (isGlobalReview) {
            setReviewList(externalVerses ?? []);
            setReviewActive(true);
            reviewStrongRef.current = 0;
            setReviewSummary(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const todayVerses = getTodayVerses(progress);
    const streak = getStreak(progress);
    const totalVerses = getTotalVerses(progress);
    const surahProgress = getSurahProgress(progress, chapterId);
    const surahWeakWords = getSurahWeakWords(progress, chapterId);
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
        hardStopRef.current = true;
        keepListeningRef.current = false;
        if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch {}
            recognitionRef.current = null;
        }
        setIsListening(false);
        setIsRestarting(false);
    }, []);

    const stopHearing = useCallback(() => {
        if (hearRef.current) {
            try { hearRef.current.stop(); } catch {}
            hearRef.current.unload();
            hearRef.current = null;
        }
        setIsHearing(false);
    }, []);

    const onExitMode = useCallback(() => {
        stopSound();
        stopRecognition();
        stopHearing();
        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
        if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        onExit();
    }, [onExit, stopSound, stopRecognition, stopHearing]);

    useEffect(() => {
        return () => {
            stopSound();
            stopRecognition();
            stopHearing();
            if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
        };
    }, [stopSound, stopRecognition, stopHearing]);

    const recordAttempt = useCallback((accuracy: number, missing: string[] = []) => {
        const prev = progressRef.current;
        const prevTotal = getTotalVerses(prev);
        const surahId = currentVerse.surahId ?? chapterId;
        const next = recordVerse(prev, surahId, currentVerse.verseNum, accuracy, missing);
        setProgress(next);
        const newly = getNewlyUnlockedMilestones(prevTotal, getTotalVerses(next));
        if (newly.length > 0) {
            setMilestoneCelebration(newly[newly.length - 1]);
            if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
            celebrationTimerRef.current = setTimeout(() => setMilestoneCelebration(null), 4000);
        }
    }, [chapterId, currentVerse, setProgress]);

    const completeVerse = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        // Pin the results cutoff at the end of THIS verse's speech so the next
        // verse's already-recognized words (spoken during the transition) are
        // kept, while this verse's earlier results stay dropped.
        resultsCutoffRef.current = lastResultsLengthRef.current;
        // Keep the mic live across verses so the next verse's recitation is
        // caught immediately. Per-verse state (streams, frontier, target) is
        // reset when the index advances; results older than the reset are cut.
        keepListeningRef.current = true;
        setIsListening(true);
        setIsRestarting(false);

        const target = targetWordsRef.current;
        const revealed = revealedRef.current;
        const total = target.length;
        const accuracy = total > 0 ? Math.round((revealed / total) * 100) : 0;
        const missing = target.slice(revealed);
        recordAttempt(accuracy, missing);
        setResult({ accuracy, revealed, total, missing });
        setCelebration(accuracy >= 85 ? 'verse_complete' : 'practice_more');

        const idx = currentIdxRef.current;
        if (idx + 1 < activeVerses.length) {
            autoContinueRef.current = true;
            advanceTimerRef.current = setTimeout(() => {
                setCurrentIdx(idx + 1);
            }, 1400);
        } else if (reviewActiveRef.current) {
            if (accuracy >= 85) reviewStrongRef.current += 1;
            stopRecognition();
            setReviewSummary({ total: activeVerses.length, strong: reviewStrongRef.current });
            advanceTimerRef.current = setTimeout(() => {
                setCelebration('review_complete');
            }, 1400);
        } else {
            stopRecognition();
            advanceTimerRef.current = setTimeout(() => setCelebration('range_complete'), 1400);
        }
    }, [activeVerses.length, recordAttempt, stopRecognition]);

    const createRecognition = useCallback(() => {
        if (hardStopRef.current) return;
        const win = window as SpeechWindow;
        const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SR) {
            setSpeechUnsupported(true);
            setMicError(window.isSecureContext === false ? 'insecure_context' : null);
            return;
        }

        const recognition = new SR();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = MAX_ALTERNATIVES;
        // Each recognition instance has its own results array index space.
        lastResultsLengthRef.current = 0;
        resultsCutoffRef.current = 0;

        recognition.onresult = (event) => {
            lastResultsLengthRef.current = event.results.length;
            if (hardStopRef.current) return;
            setSpeechUnsupported(false);
            setMicError(null);

            const last = event.results[event.results.length - 1];
            const text = last?.[0]?.transcript ?? '';
            if (text) setLiveTranscript(text);

            // Accumulate every result, including during the short verse-
            // transition window (completedRef set), so recitation of the next
            // verse that starts before the index advances is not lost.
            const startRes = Math.max(event.resultIndex, resultsCutoffRef.current);
            for (let i = startRes; i < event.results.length; i++) {
                const res = event.results[i];
                for (let a = 0; a < Math.min(MAX_ALTERNATIVES, res.length); a++) {
                    const text = res[a]?.transcript ?? '';
                    if (!text) continue;
                    if (res.isFinal) {
                        if (!finalTokensRef.current[a]) finalTokensRef.current[a] = [];
                        finalTokensRef.current[a].push(...normalizeArabicTokens(text));
                    } else {
                        interimTextRef.current[a] = text;
                    }
                }
            }

            if (completedRef.current) return;

            if (!receivedSpeechRef.current) {
                receivedSpeechRef.current = true;
                if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
                setNoSpeechHint(false);
            }

            // Combined chronological streams: finalized tokens (persistent) + live interim
            const streams: string[][] = [];
            for (let a = 0; a < MAX_ALTERNATIVES; a++) {
                streams.push([
                    ...(finalTokensRef.current[a] ?? []),
                    ...normalizeArabicTokens(interimTextRef.current[a] ?? ''),
                ]);
            }

            // Fresh alignment anchored at the current revealed frontier, so
            // re-reciting already-revealed words (breath, restarts) never
            // disturbs the reveal and long verses stay monotonic. Reveal is
            // kept monotonic; words the engine can't recognize get marked as
            // missed (skip-ahead) so the verse keeps flowing. After an advance
            // the consumed stream prefix is dropped so repeated words don't
            // push the frontier word past the lookahead window.
            const target = targetWordsRef.current;
            if (target.length === 0) return;
            const frontier = revealedRef.current;
            const { consumed, missed, cursors } = alignTokensMulti(streams, target, frontier, LOOKAHEAD);
            const newFrontier = frontier + consumed;
            if (newFrontier > frontier) {
                for (const m of missed) missedSetRef.current.add(m);
                revealedRef.current = newFrontier;
                setRevealedWords(newFrontier);
                setSkippedIndices(Array.from(missedSetRef.current).sort((a, b) => a - b));
                for (let a = 0; a < MAX_ALTERNATIVES; a++) {
                    const finalTokens = finalTokensRef.current[a] ?? [];
                    if (cursors[a] >= finalTokens.length) {
                        finalTokensRef.current[a] = [];
                        interimTextRef.current[a] = '';
                    } else {
                        finalTokensRef.current[a] = finalTokens.slice(cursors[a]);
                    }
                }
                if (newFrontier >= target.length) {
                    completeVerse();
                }
            }
        };

        recognition.onend = () => {
            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
            // Chrome stops recognition after silence; if the user still wants to
            // continue, seamlessly restart so live detection never dies. This
            // also covers the short verse-transition window where completedRef
            // is set while the mic stays live.
            if (keepListeningRef.current && !hardStopRef.current) {
                setIsRestarting(true);
                restartTimerRef.current = setTimeout(() => {
                    setIsRestarting(false);
                    // If the mic has been live a while with no speech, nudge the user.
                    if (!receivedSpeechRef.current) setNoSpeechHint(true);
                    createRecognition();
                }, 150);
            } else {
                setIsListening(false);
            }
        };

        recognition.onerror = (event) => {
            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
            // Fatal mic errors (permission denied, no mic, unsupported language):
            // stop for good and tell the user. Transient errors (no-speech,
            // network, aborted) are recovered by the onend auto-restart.
            if (MIC_FATAL_ERRORS.has(event.error)) {
                hardStopRef.current = true;
                keepListeningRef.current = false;
                if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
                if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
                setIsListening(false);
                setIsRestarting(false);
                setMicError(event.error);
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;
        setIsListening(true);
        try {
            recognition.start();
        } catch {
            setIsListening(false);
            setSpeechUnsupported(true);
        }
    }, [completeVerse]);

    const startListening = useCallback(() => {
        stopHearing();
        hardStopRef.current = false;
        keepListeningRef.current = true;
        setResult(null);
        setCelebration(null);
        setError(null);
        setMicError(null);
        setNoSpeechHint(false);
        setLiveTranscript('');
        receivedSpeechRef.current = false;
        finalTokensRef.current = [];
        interimTextRef.current = [];
        revealedRef.current = 0;
        missedSetRef.current = new Set();
        completedRef.current = false;
        setRevealedWords(0);
        setSkippedIndices([]);
        createRecognition();
        if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
        noSpeechTimerRef.current = setTimeout(() => {
            if (!receivedSpeechRef.current && keepListeningRef.current) setNoSpeechHint(true);
        }, 5000);
    }, [createRecognition, stopHearing]);

    const startListeningRef = useRef(startListening);
    useEffect(() => {
        startListeningRef.current = startListening;
    }, [startListening]);

    const createRecognitionRef = useRef(createRecognition);
    useEffect(() => {
        createRecognitionRef.current = createRecognition;
    }, [createRecognition]);

    // Auto-continue: when a verse is fully revealed, the next verse appears. The
    // recognition instance is kept alive across the transition so the user can
    // start reciting the next verse immediately; only re-arm the per-verse
    // no-speech timer here (state was reset by the verse-change effect).
    useEffect(() => {
        if (autoContinueRef.current) {
            autoContinueRef.current = false;
            if (tab === 'memorize') {
                if (recognitionRef.current) {
                    keepListeningRef.current = true;
                    setIsListening(true);
                    setIsRestarting(false);
                    if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
                    noSpeechTimerRef.current = setTimeout(() => {
                        if (!receivedSpeechRef.current && keepListeningRef.current) setNoSpeechHint(true);
                    }, 5000);
                } else {
                    // Recognition died during the transition: restart it
                    // without clearing the accumulated speech streams.
                    keepListeningRef.current = true;
                    setIsListening(true);
                    createRecognitionRef.current();
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIdx]);

    const stopListening = useCallback(() => {
        hardStopRef.current = true;
        keepListeningRef.current = false;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch {}
            recognitionRef.current = null;
        }
        setIsListening(false);
        setIsRestarting(false);

        const target = targetWordsRef.current;
        const revealed = revealedRef.current;
        const total = target.length;
        if (total > 0) {
            const accuracy = Math.round((revealed / total) * 100);
            const missing = target.slice(revealed);
            recordAttempt(accuracy, missing);
            setResult({ accuracy, revealed, total, missing });
            if (accuracy >= 85) {
                setCelebration('perfect');
            } else if (accuracy >= 50) {
                setCelebration('great');
            } else {
                setCelebration('practice_more');
            }
        }
    }, [recordAttempt]);

    const skipVerse = useCallback(() => {
        stopRecognition();
        stopHearing();
        const idx = currentIdxRef.current;
        if (idx + 1 < activeVerses.length) {
            setCurrentIdx(idx + 1);
        } else if (reviewActiveRef.current) {
            setReviewSummary({ total: activeVerses.length, strong: reviewStrongRef.current });
            setCelebration('review_complete');
        } else {
            setCelebration('range_complete');
        }
    }, [activeVerses.length, stopRecognition, stopHearing]);

    const prevVerse = useCallback(() => {
        stopRecognition();
        stopHearing();
        const idx = currentIdxRef.current;
        if (idx - 1 >= 0) {
            setCurrentIdx(idx - 1);
        }
    }, [stopRecognition, stopHearing]);

    // Resume recitation from a tapped word: keep everything before it revealed
    // and re-anchor the live detection there, so a mistake mid-verse (or a
    // mis-detected word) never forces a full re-read of a long verse.
    const startFromWord = useCallback((index: number) => {
        if (tab !== 'memorize') return;
        const target = targetWordsRef.current;
        if (!target.length || index < 0 || index >= target.length) return;
        stopHearing();
        if (advanceTimerRef.current) {
            clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = null;
        }
        if (!isListening) {
            startListeningRef.current();
        }
        revealedRef.current = index;
        completedRef.current = false;
        missedSetRef.current = new Set();
        setRevealedWords(index);
        setSkippedIndices([]);
        setResult(null);
        setCelebration(null);
    }, [tab, isListening, stopHearing]);

    // ---- Listen & Repeat playback ----
    const playVerse = useCallback((idx: number) => {
        const verse = activeVerses[idx];
        if (!verse) return;

        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }

        const padSurah = (verse.surahId ?? chapterId).padStart(3, '0');
        const padVerse = verse.verseNum.padStart(3, '0');
        const src = riwaya === 'warsh'
            ? `/api/audio-warsh/${padSurah}/${padVerse}`
            : `/audio/${padSurah}/${padVerse}.mp3`;

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
                    if (nextIdx < activeVerses.length) {
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
    }, [chapterId, activeVerses, repeats, stopSound, riwaya]);

    const togglePlay = useCallback(() => {
        if (isPlayingRef.current) {
            stopSound();
        } else {
            repeatCountRef.current = 0;
            playVerse(currentIdxRef.current);
        }
    }, [playVerse, stopSound]);

    const jumpTo = useCallback((idx: number) => {
        const clamped = Math.max(0, Math.min(idx, activeVerses.length - 1));
        stopHearing();
        currentIdxRef.current = clamped;
        setCurrentIdx(clamped);
        if (isPlayingRef.current) {
            repeatCountRef.current = 0;
            playVerse(clamped);
        }
    }, [playVerse, activeVerses.length, stopHearing]);

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
        stopHearing();
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    };

    // Hear the current verse once (e.g. from the memorize tab), then — when
    // requested — automatically open the mic so the user recites from memory.
    const hearCurrentVerse = useCallback((autoListenAfter = false) => {
        if (isHearing) {
            stopHearing();
            return;
        }
        const verse = activeVerses[currentIdxRef.current];
        if (!verse) return;
        stopRecognition();

        const padSurah = (verse.surahId ?? chapterId).padStart(3, '0');
        const padVerse = verse.verseNum.padStart(3, '0');
        const src = riwaya === 'warsh'
            ? `/api/audio-warsh/${padSurah}/${padVerse}`
            : `/audio/${padSurah}/${padVerse}.mp3`;

        const sound = new Howl({
            src: [src],
            html5: true,
            onend: () => {
                if (hearRef.current === sound) {
                    hearRef.current = null;
                    setIsHearing(false);
                }
                if (autoListenAfter && tab === 'memorize') {
                    startListeningRef.current();
                }
            },
            onloaderror: () => {
                if (hearRef.current === sound) {
                    hearRef.current = null;
                    setIsHearing(false);
                }
                setError('audio_missing');
            },
        });

        hearRef.current = sound;
        setIsHearing(true);
        sound.play();
    }, [activeVerses, chapterId, isHearing, riwaya, stopHearing, stopRecognition, tab]);

    // Review mode: re-test the surah's already-mastered verses for retention.
    const startReview = useCallback(() => {
        const mastered = verses.filter((v) => progressRef.current.surahs[chapterId]?.[v.verseNum]?.mastered);
        if (mastered.length === 0) return;
        stopRecognition();
        stopHearing();
        stopSound();
        setReviewList(mastered);
        reviewStrongRef.current = 0;
        setReviewSummary(null);
        setReviewActive(true);
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    }, [verses, chapterId, stopRecognition, stopHearing, stopSound]);

    const stopReview = useCallback(() => {
        stopRecognition();
        stopHearing();
        if (advanceTimerRef.current) {
            clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = null;
        }
        setReviewSummary(null);
        setReviewActive(false);
        currentIdxRef.current = 0;
        setCurrentIdx(0);
    }, [stopRecognition, stopHearing]);

    const currentDisplayWords = currentVerse ? currentVerse.text.split(' ').filter(Boolean) : [];
    const skippedSet = new Set(skippedIndices);
    const showHints = progress.showHints ?? true;

    return (
        <div className="bg-white dark:bg-night-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain size={20} className="text-violet-600 dark:text-violet-400" />
                    <h2 className="font-bold text-slate-900 dark:text-white text-lg font-arabic">
                        {isGlobalReview ? t('quran.global_review') : surah.name}
                        <span className="inline-block ml-2 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-medium align-middle">
                            {RIAWAYA_OPTIONS.find((r) => r.id === riwaya)?.labelAr ?? 'حفص'}
                        </span>
                    </h2>
                </div>
                <button
                    onClick={onExitMode}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 dark:bg-night-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    {t('common.close')}
                </button>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-night-800 p-1 rounded-xl mb-4">
                <button
                    onClick={() => { stopRecognition(); stopHearing(); setTab('memorize'); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        tab === 'memorize'
                            ? "bg-white dark:bg-night-900 text-violet-700 dark:text-violet-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                >
                    <Brain size={15} />
                    {t('quran.memorize_tab')}
                </button>
                <button
                    onClick={() => { stopRecognition(); stopHearing(); setTab('listen'); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        tab === 'listen'
                            ? "bg-white dark:bg-night-900 text-violet-700 dark:text-violet-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                >
                    <ListMusic size={15} />
                    {t('quran.listen_tab')}
                </button>
            </div>

            {/* Range + repeats controls (or review banner) */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                {reviewActive ? (
                    <>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 text-xs font-semibold">
                            <RefreshCw size={12} />
                            {t('quran.review_mode')}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            {Math.min(currentIdx + 1, reviewList.length)}/{reviewList.length}
                        </span>
                        <button
                            onClick={stopReview}
                            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <XCircle size={14} />
                            {t('quran.stop_review')}
                        </button>
                    </>
                ) : (
                    <>
                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span>{t('quran.from')}</span>
                            <select
                                value={fromVerse}
                                onChange={(e) => changeFrom(parseInt(e.target.value, 10))}
                                className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                                className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                                    className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                    </>
                )}
            </div>

            {/* Verse display */}
            <div
                ref={versesRef}
                className="min-h-[170px] rounded-xl bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center gap-4"
            >
                {currentVerse ? (
                    <>
                        <div className={cn(
                            "flex items-center justify-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-medium text-sm px-3 py-1.5",
                            !currentVerse.surahName && "w-10 h-10 px-0 py-0"
                        )}>
                            {currentVerse.surahName && <span className="font-arabic">{currentVerse.surahName}</span>}
                            <span>{currentVerse.verseNum}</span>
                        </div>

                        {tab === 'memorize' ? (
                            <>
                                {(isListening || isRestarting) && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full bg-emerald-500", isListening ? "animate-pulse" : "animate-ping")} />
                                        {isRestarting ? '·' : t('quran.listening')}
                                    </p>
                                )}
                                <p className="text-2xl md:text-3xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic text-center">
                                    {currentDisplayWords.map((word, i) => (
                                        <span
                                            key={i}
                                            onClick={() => startFromWord(i)}
                                            title={t('quran.start_here')}
                                            className={cn(
                                                "inline-block transition-all duration-300 mx-0.5 cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded px-0.5",
                                                i < revealedWords && !skippedSet.has(i)
                                                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                                    : skippedSet.has(i)
                                                        ? "text-red-400 dark:text-red-500 line-through"
                                                        : "text-slate-300 dark:text-slate-600"
                                            )}
                                        >
                                            {i < revealedWords || skippedSet.has(i)
                                                ? word
                                                : showHints
                                                    ? word[0] + '•'.repeat(Math.min(3, Math.max(1, word.length - 1)))
                                                    : '••••'}
                                        </span>
                                    ))}
                                </p>
                                {!isListening && !isRestarting && !result && revealedWords > 0 && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {revealedWords}/{targetWordsRef.current.length} {t('quran.words_revealed')}
                                    </p>
                                )}
                                {isListening && noSpeechHint && !liveTranscript && (
                                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                        {t('quran.no_speech_hint')}
                                    </p>
                                )}
                                {isListening && liveTranscript && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-arabic" dir="rtl">
                                        {liveTranscript}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                {isPlaying && (
                                    <p className="text-xs font-medium text-violet-600 dark:text-violet-400 flex items-center gap-2">
                                        <Volume2 size={13} />
                                        {t('quran.listening')}
                                    </p>
                                )}
                                <p className="text-2xl md:text-3xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic text-center">
                                    {currentVerse.text}
                                </p>
                            </>
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

                    {micError && (
                        <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2 justify-center">
                            <AlertCircle size={15} />
                            {micError === 'not-allowed' || micError === 'service-not-allowed'
                                ? t('quran.mic_denied')
                                : micError === 'insecure_context'
                                    ? t('quran.insecure_context')
                                    : t('quran.mic_error')}
                        </p>
                    )}

                    {isHearing && (
                        <p className="text-xs font-medium text-violet-600 dark:text-violet-400 flex items-center justify-center gap-2 mt-3">
                            <Volume2 size={13} className="animate-pulse" />
                            {t('quran.playing')}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            onClick={() => hearCurrentVerse(true)}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors",
                                isHearing
                                    ? "bg-violet-600 border-violet-600 text-white"
                                    : "bg-white dark:bg-night-800 border-violet-200 dark:border-violet-900 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                            )}
                            title={t('quran.hear_then_recite')}
                        >
                            {isHearing ? <Square size={14} /> : <Volume2 size={14} />}
                            {isHearing ? t('quran.stop_hear') : t('quran.hear_then_recite')}
                        </button>

                        <button
                            onClick={() => setProgress({ ...progress, showHints: !showHints })}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors bg-white dark:bg-night-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            title={t('quran.first_letters')}
                        >
                            {showHints ? <Eye size={14} /> : <EyeOff size={14} />}
                            {t('quran.first_letters')}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                            onClick={() => { stopSound(); if (!isListening) prevVerse(); }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                            title={t('quran.prev_verse')}
                        >
                            <SkipForward size={18} className="rotate-180" />
                        </button>

                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={cn(
                                "w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-colors",
                                isListening
                                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
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
                    {riwaya === 'warsh' && (
                        <p className="text-center mt-1 text-xs text-slate-400 dark:text-slate-500">
                            {t('quran.warsh_audio_note')}
                        </p>
                    )}
                </>
            )}

            <div className="flex items-center justify-center mt-4 gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{Math.min(currentIdx + 1, activeVerses.length)}</span>
                <span>/</span>
                <span>{activeVerses.length}</span>
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
                            {celebration === 'practice_more' && t('quran.practice_more')}
                            {celebration === 'review_complete' && t('quran.review_complete')}
                            {celebration === 'verse_complete' && (
                                <span className="font-normal opacity-80">· {t('quran.auto_advancing')}</span>
                            )}
                        </div>
                    )}

                    {reviewSummary && (
                        <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                            <RefreshCw size={16} />
                            {t('quran.review_summary')}: {reviewSummary.strong}/{reviewSummary.total}
                            {reviewActive && (
                                <button
                                    onClick={stopReview}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                                >
                                    {t('quran.stop_review')}
                                </button>
                            )}
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
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button
                                        onClick={() => { setResult(null); if (!isListening) startListening(); }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                                    >
                                        <RotateCcw size={15} />
                                        {t('quran.retry_verse')}
                                    </button>
                                    <button
                                        onClick={() => hearCurrentVerse(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 dark:bg-night-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <Volume2 size={15} />
                                        {t('quran.hear_again')}
                                    </button>
                                    <button
                                        onClick={skipVerse}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 dark:bg-night-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                            className="px-1.5 py-1 rounded-md bg-slate-50 dark:bg-night-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                        >
                            {[1, 3, 5, 10, 20, 50].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-slate-50 dark:bg-night-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                            <Target size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{todayVerses}<span className="text-xs font-normal text-slate-500 dark:text-slate-400">/{dailyGoal}</span></p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.today')}</p>
                        <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-night-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                            <Flame size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{streak}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.streak')}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-night-800 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                            <CheckCircle2 size={14} />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{totalVerses}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quran.memorized_total')}</p>
                    </div>
                </div>

                {/* Surah mastery + milestones + weak words */}
                {!isGlobalReview && (
                <div className="rounded-xl bg-slate-50 dark:bg-night-800 p-3">
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
                    {surahWeakWords.length > 0 && (
                        <div className="mt-3">
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                <AlertCircle size={11} />
                                {t('quran.words_to_strengthen')}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {surahWeakWords.map(({ word, count }) => (
                                    <span key={word} className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[11px] font-medium">
                                        <span className="font-arabic">{word}</span>
                                        <span className="opacity-60">{count}×</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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
                    {!reviewActive && surahProgress.mastered > 0 && (
                        <button
                            onClick={startReview}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                        >
                            <RefreshCw size={14} />
                            {t('quran.review_mastered')} ({surahProgress.mastered})
                        </button>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}