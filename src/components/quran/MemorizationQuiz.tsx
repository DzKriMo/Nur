'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Howl } from 'howler';
import Link from 'next/link';
import {
    Type, ListOrdered, Headphones, Pause, CheckCircle2, XCircle,
    RotateCcw, Trophy, Volume2, X, Brain, ArrowRight, ArrowLeft, Undo2, Eraser,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { useStoredState } from '@/lib/storage';
import { Riwaya } from '@/lib/riwaya';
import { buildQuiz, QuizMode, QuizQuestion, QuizVerse } from '@/lib/quiz';
import { DEFAULT_MEMORIZATION_STATE, MEMORIZATION_STORAGE_KEY, addWeakWords, normalizeArabic } from '@/lib/memorization';

interface MemorizationQuizProps {
    verses: QuizVerse[];
    riwaya: Riwaya;
    onExit: () => void;
}

const MODE_OPTIONS: { mode: QuizMode; icon: typeof Type; key: TranslationKey; color: string }[] = [
    { mode: 'fill', icon: Type, key: 'quiz.mode_fill', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30' },
    { mode: 'order', icon: ListOrdered, key: 'quiz.mode_order', color: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30' },
    { mode: 'audio', icon: Headphones, key: 'quiz.mode_audio', color: 'text-gold-600 dark:text-gold-400 bg-gold-500/15' },
];

const COUNT_OPTIONS = [5, 10, 15, 20];

export default function MemorizationQuiz({ verses, riwaya, onExit }: MemorizationQuizProps) {
    const { t, dir } = useLanguage();
    const [progress, setProgress] = useStoredState(MEMORIZATION_STORAGE_KEY, DEFAULT_MEMORIZATION_STATE);

    const [phase, setPhase] = useState<'setup' | 'playing' | 'result'>('setup');
    const [mode, setMode] = useState<QuizMode>('fill');
    const [count, setCount] = useState(5);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState<{ correct: boolean; missedWords: string[] }[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const [fillArr, setFillArr] = useState<(string | null)[]>([]);
    const [placed, setPlaced] = useState<string[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [playing, setPlaying] = useState(false);
    const soundRef = useRef<Howl | null>(null);

    const question = questions[qIndex];

    const stopSound = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
            soundRef.current = null;
        }
        setPlaying(false);
    }, []);

    useEffect(() => stopSound, [stopSound]);

    useEffect(() => {
        if (phase !== 'playing') return;
        if (question?.type === 'fill') setFillArr(Array(question.answers.length).fill(null));
        if (question?.type === 'order') setPlaced([]);
        if (question?.type === 'audio') {
            setSelected(null);
            stopSound();
        }
        setFeedback(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qIndex, phase, question?.type]);

    const start = () => {
        const built = buildQuiz(verses, mode, count, riwaya);
        if (built.length === 0) return;
        setQuestions(built);
        setQIndex(0);
        setScore(0);
        setResults([]);
        setFeedback(null);
        stopSound();
        setPhase('playing');
    };

    const finish = useCallback(() => {
        let next = progress;
        questions.forEach((q, i) => {
            const missed = results[i]?.missedWords ?? [];
            if (missed.length > 0) next = addWeakWords(next, q.surahId, q.verseNum, missed);
        });
        setProgress(next);
        stopSound();
        setPhase('result');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions, results, stopSound]);

    const recordAnswer = (correct: boolean, missed: string[]) => {
        setResults((prev) => [...prev, { correct, missedWords: missed }]);
        if (correct) setScore((s) => s + 1);
        setFeedback(correct ? 'correct' : 'wrong');
    };

    const next = () => {
        setFeedback(null);
        stopSound();
        if (qIndex + 1 >= questions.length) {
            finish();
        } else {
            setQIndex((i) => i + 1);
        }
    };

    const tapOption = (opt: string) => {
        if (feedback || question?.type !== 'fill') return;
        const idx = fillArr.findIndex((v) => v === null);
        if (idx === -1) return;
        const nextArr = [...fillArr];
        nextArr[idx] = opt;
        setFillArr(nextArr);
        if (nextArr.every((v) => v !== null)) {
            const q = question as Extract<QuizQuestion, { type: 'fill' }>;
            let correct = true;
            const missed: string[] = [];
            nextArr.forEach((v, i) => {
                if (v !== q.answers[i]) {
                    correct = false;
                    missed.push(q.answers[i]);
                }
            });
            recordAnswer(correct, missed);
        }
    };

    const placeWord = (w: string) => {
        if (feedback || question?.type !== 'order') return;
        setPlaced((p) => [...p, w]);
    };

    const undoWord = () => {
        if (feedback) return;
        setPlaced((p) => p.slice(0, -1));
    };

    const clearOrder = () => {
        if (feedback) return;
        setPlaced([]);
    };

    const checkOrder = () => {
        if (feedback || question?.type !== 'order') return;
        const q = question as Extract<QuizQuestion, { type: 'order' }>;
        const correct = placed.join(' ') === q.correct.join(' ');
        const missed = correct ? [] : q.correct.filter((w) => !placed.includes(w));
        recordAnswer(correct, missed);
    };

    const chooseAudio = (idx: number) => {
        if (feedback || question?.type !== 'audio') return;
        setSelected(idx);
        const q = question as Extract<QuizQuestion, { type: 'audio' }>;
        recordAnswer(idx === q.correctIndex, []);
    };

    const toggleAudio = () => {
        if (question?.type !== 'audio') return;
        if (playing) {
            stopSound();
            return;
        }
        const q = question as Extract<QuizQuestion, { type: 'audio' }>;
        if (soundRef.current) soundRef.current.unload();
        const sound = new Howl({
            src: [q.audioUrl],
            html5: true,
            onend: () => setPlaying(false),
            onloaderror: () => setPlaying(false),
        });
        soundRef.current = sound;
        setPlaying(true);
        sound.play();
    };

    const progressPct = questions.length > 0 ? Math.round((qIndex / questions.length) * 100) : 0;
    const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const missedVerses = questions.filter((_, i) => results[i] && !results[i].correct);
    const missedWords = [
        ...new Set(results.flatMap((r) => r.missedWords.map((w) => normalizeArabic(w)))),
    ];

    const Nav = dir === 'rtl' ? ArrowLeft : ArrowRight;

    if (phase === 'setup') {
        return (
            <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Brain size={19} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('quiz.title')}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('quiz.subtitle')}</p>
                    </div>
                    <button
                        onClick={onExit}
                        className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={t('common.close')}
                    >
                        <X size={16} />
                    </button>
                </div>

                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t('quiz.pick_mode')}</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {MODE_OPTIONS.map(({ mode: m, icon: Icon, key, color }) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            aria-pressed={mode === m}
                            className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all',
                                mode === m
                                    ? 'border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-900/15'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                            )}
                        >
                            <span className={cn('flex items-center justify-center w-9 h-9 rounded-lg', color)}>
                                <Icon size={17} />
                            </span>
                            <span className={mode === m ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}>
                                {t(key)}
                            </span>
                        </button>
                    ))}
                </div>

                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t('quiz.questions')}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {COUNT_OPTIONS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCount(c)}
                            aria-pressed={count === c}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                                count === c
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-400'
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <button
                    onClick={start}
                    disabled={verses.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t('quiz.start')}
                    <Nav size={16} />
                </button>
                {verses.length === 0 && (
                    <p className="mt-2 text-center text-xs text-slate-400">{t('quiz.no_verses')}</p>
                )}
            </div>
        );
    }

    if (phase === 'result') {
        return (
            <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 md:p-6">
                <div className="text-center mb-6">
                    <span className="mx-auto mb-3 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Trophy size={28} />
                    </span>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{scorePct}%</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {score} / {questions.length} {t('quiz.correct')}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {scorePct >= 90
                            ? t('quiz.excellent')
                            : scorePct >= 60
                                ? t('quiz.good')
                                : t('quiz.keep_going')}
                    </p>
                </div>

                {missedVerses.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{t('quiz.review_verses')}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {missedVerses.map((q) => (
                                <Link
                                    key={`${q.surahId}-${q.verseNum}`}
                                    href={`/quran/${q.surahId}#verse-${q.verseNum}`}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                                >
                                    <XCircle size={11} />
                                    {q.surahName} {q.verseNum}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {missedWords.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{t('quiz.words_to_strengthen')}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {missedWords.map((w) => (
                                <span key={w} className="px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                                    <span className="font-arabic">{w}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => setPhase('setup')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-night-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RotateCcw size={15} />
                        {t('quiz.new_quiz')}
                    </button>
                    <button
                        onClick={onExit}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    // playing
    return (
        <div className="rounded-2xl bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {qIndex + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={15} />
                    {score}
                </div>
                <button
                    onClick={onExit}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={t('common.close')}
                >
                    <X size={16} />
                </button>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>

            {question && (
                <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                    <span className="font-arabic font-medium text-slate-500 dark:text-slate-400">{question.surahName}</span>
                    <span>{t('quran.verse')} {parseInt(question.verseNum)}</span>
                </div>
            )}

            {question?.type === 'fill' && (
                <>
                    <p className="text-right font-arabic text-xl leading-[2.1] text-slate-800 dark:text-slate-100 mb-5" dir="rtl">
                        {question.parts.map((p, i) =>
                            p === null ? (
                                <span
                                    key={i}
                                    className={cn(
                                        'inline-block min-w-[3rem] mx-0.5 px-2 rounded-md border-b-2 text-center',
                                        feedback === 'correct'
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300'
                                            : feedback === 'wrong' && fillArr[i] !== question.answers[i]
                                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-300 line-through'
                                                : feedback === 'wrong'
                                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300'
                                                    : 'border-gold-500/60 bg-parchment-50 dark:bg-night-800 text-slate-900 dark:text-white'
                                    )}
                                >
                                    {fillArr[i] ?? '\u00A0'}
                                </span>
                            ) : (
                                <span key={i}>{p}</span>
                            )
                        )}
                    </p>
                    {question.translation && (
                        <p className="text-xs text-slate-400 italic mb-5">{question.translation}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {question.options.map((opt) => {
                            const needed = question.answers.filter((a) => a === opt).length || 1;
                            const used = fillArr.filter((v) => v === opt).length;
                            const available = used < needed && feedback === null;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => tapOption(opt)}
                                    disabled={!available}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg font-arabic text-sm border transition-colors',
                                        available
                                            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-night-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                                            : 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-night-800 text-slate-400'
                                    )}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {question?.type === 'order' && (
                <>
                    <div className="min-h-[4.5rem] rounded-xl bg-parchment-50 dark:bg-night-800 border border-gold-500/30 p-3 mb-4 flex flex-wrap gap-1.5 items-start">
                        {placed.length === 0 ? (
                            <span className="text-xs text-slate-400">{t('quiz.tap_words')}</span>
                        ) : (
                            placed.map((w, i) => (
                                <button
                                    key={`${w}-${i}`}
                                    onClick={() => { if (!feedback) setPlaced((p) => p.filter((_, j) => j !== i)); }}
                                    className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-arabic text-sm"
                                >
                                    {w}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={undoWord}
                            disabled={feedback !== null || placed.length === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                        >
                            <Undo2 size={13} />
                            {t('quiz.undo')}
                        </button>
                        <button
                            onClick={clearOrder}
                            disabled={feedback !== null || placed.length === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-night-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                        >
                            <Eraser size={13} />
                            {t('quiz.clear')}
                        </button>
                        <button
                            onClick={checkOrder}
                            disabled={feedback !== null || placed.length !== question.correct.length}
                            className="ml-auto flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                        >
                            <CheckCircle2 size={13} />
                            {t('quiz.check')}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {question.words.map((w, i) => (
                            <button
                                key={`${w}-${i}`}
                                onClick={() => placeWord(w)}
                                disabled={feedback !== null || placed.includes(w)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg font-arabic text-sm border transition-colors',
                                    placed.includes(w) || feedback !== null
                                        ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-night-800 text-slate-400'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-night-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                                )}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {question?.type === 'audio' && (
                <>
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={toggleAudio}
                            disabled={feedback !== null}
                            className={cn(
                                'flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors',
                                feedback !== null
                                    ? 'bg-slate-100 dark:bg-night-800 text-slate-400'
                                    : 'bg-gold-500 text-white hover:bg-gold-600'
                            )}
                        >
                            {playing ? <Pause size={16} /> : <Volume2 size={16} />}
                            {t('quiz.listen')}
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400 mb-4">{t('quiz.choose_matching')}</p>
                    <div className="space-y-2 mb-5">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => chooseAudio(idx)}
                                disabled={feedback !== null}
                                className={cn(
                                    'w-full text-right rounded-xl border p-3 transition-colors',
                                    feedback === null && 'border-slate-200 dark:border-slate-700 bg-white dark:bg-night-800 hover:border-emerald-400',
                                    feedback === 'correct' && idx === question.correctIndex && 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-900/15',
                                    feedback === 'wrong' && idx === selected && 'border-rose-500 bg-rose-50/70 dark:bg-rose-900/15',
                                    feedback === 'wrong' && idx === question.correctIndex && 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-900/15'
                                )}
                            >
                                <p className="font-arabic text-sm leading-loose text-slate-800 dark:text-slate-100">{opt.text}</p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    {opt.surahName} · {t('quran.verse')} {parseInt(opt.verseNum)}
                                </p>
                            </button>
                        ))}
                    </div>
                </>
            )}

            {feedback !== null && (
                <div className={cn(
                    'flex items-center justify-between gap-3 rounded-xl p-3 mb-2',
                    feedback === 'correct' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
                )}>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                        {feedback === 'correct' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {feedback === 'correct' ? t('quiz.correct_answer') : t('quiz.wrong_answer')}
                    </span>
                    <button
                        onClick={next}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                    >
                        {t('quiz.next')}
                        <Nav size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}