// Memorization quiz engine: generates drills from a pool of mastered verses.
// Three modes — fill-in-the-blank, word order, and listen-and-choose — each
// reinforce the words the user is memorizing.

import { Riwaya } from '@/lib/riwaya';

export type QuizMode = 'fill' | 'order' | 'audio';

export interface QuizVerse {
    surahId: string;
    surahName: string;
    verseNum: string;
    text: string;
    translation: string;
}

export interface FillQuestion {
    type: 'fill';
    surahId: string;
    surahName: string;
    verseNum: string;
    translation: string;
    verseText: string;
    /** Verse text split into display chunks; a `null` marks a blank slot. */
    parts: (string | null)[];
    /** The hidden tokens, in blank order. */
    answers: string[];
    /** Shuffled word bank: answers + distractors. */
    options: string[];
}

export interface OrderQuestion {
    type: 'order';
    surahId: string;
    surahName: string;
    verseNum: string;
    translation: string;
    verseText: string;
    /** Correct token sequence (a contiguous window of the verse). */
    correct: string[];
    /** Shuffled tokens the user must reorder. */
    words: string[];
}

export interface AudioOption {
    text: string;
    surahName: string;
    verseNum: string;
}

export interface AudioQuestion {
    type: 'audio';
    surahId: string;
    surahName: string;
    verseNum: string;
    text: string;
    translation: string;
    audioUrl: string;
    options: AudioOption[];
    correctIndex: number;
}

export type QuizQuestion = FillQuestion | OrderQuestion | AudioQuestion;

const MAX_ORDER_WORDS = 12;

function randint(n: number): number {
    return Math.floor(Math.random() * n);
}

function shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = randint(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sample<T>(arr: readonly T[], n: number): T[] {
    return shuffle(arr).slice(0, Math.max(0, n));
}

function tokens(text: string): string[] {
    return text.split(/\s+/).map((s) => s.trim()).filter(Boolean);
}

function unique(arr: readonly string[]): string[] {
    return [...new Set(arr)];
}

/** A contiguous window of at most MAX_ORDER_WORDS tokens (keeps order puzzles tractable). */
function windowTokens(words: string[]): string[] {
    if (words.length <= MAX_ORDER_WORDS) return words;
    const start = randint(words.length - MAX_ORDER_WORDS + 1);
    return words.slice(start, start + MAX_ORDER_WORDS);
}

function makeFill(verse: QuizVerse, pool: QuizVerse[]): FillQuestion {
    const words = tokens(verse.text);
    const blankCount = Math.max(2, Math.min(5, Math.round(words.length * 0.35)));
    const blankIdx = sample(words.map((_, i) => i), Math.min(blankCount, words.length)).sort((a, b) => a - b);

    const parts: (string | null)[] = [];
    const answers: string[] = [];
    words.forEach((w, i) => {
        if (i > 0) parts.push(' ');
        if (blankIdx.includes(i)) {
            parts.push(null);
            answers.push(w);
        } else {
            parts.push(w);
        }
    });

    const distractorPool = unique(
        pool.flatMap((v) => tokens(v.text)).filter((w) => !answers.includes(w))
    );
    const distractors = sample(distractorPool, Math.min(4, distractorPool.length));

    return {
        type: 'fill',
        surahId: verse.surahId,
        surahName: verse.surahName,
        verseNum: verse.verseNum,
        translation: verse.translation,
        verseText: verse.text,
        answers,
        parts,
        options: shuffle(unique([...answers, ...distractors])),
    };
}

function makeOrder(verse: QuizVerse): OrderQuestion {
    const correct = windowTokens(tokens(verse.text));
    let words = shuffle(correct);
    for (let i = 0; i < 5 && words.length > 1 && words.join(' ') === correct.join(' '); i++) {
        words = shuffle(correct);
    }
    return {
        type: 'order',
        surahId: verse.surahId,
        surahName: verse.surahName,
        verseNum: verse.verseNum,
        translation: verse.translation,
        verseText: verse.text,
        correct,
        words,
    };
}

function makeAudio(correct: QuizVerse, pool: QuizVerse[], riwaya: Riwaya): AudioQuestion {
    const others = pool.filter((v) => v.surahId !== correct.surahId || v.verseNum !== correct.verseNum);
    const distractors = sample(others, Math.min(3, others.length));
    const all = shuffle([correct, ...distractors]);
    const options: AudioOption[] = all.map((v) => ({
        text: v.text,
        surahName: v.surahName,
        verseNum: v.verseNum,
    }));
    const padSurah = correct.surahId.padStart(3, '0');
    const padVerse = correct.verseNum.padStart(3, '0');
    return {
        type: 'audio',
        surahId: correct.surahId,
        surahName: correct.surahName,
        verseNum: correct.verseNum,
        text: correct.text,
        translation: correct.translation,
        audioUrl: riwaya === 'warsh'
            ? `/api/audio-warsh/${padSurah}/${padVerse}`
            : `/audio/${padSurah}/${padVerse}.mp3`,
        options,
        correctIndex: all.indexOf(correct),
    };
}

/** Build a quiz of up to `count` questions from a pool of verses. */
export function buildQuiz(
    verses: QuizVerse[],
    mode: QuizMode,
    count: number,
    riwaya: Riwaya
): QuizQuestion[] {
    if (verses.length === 0) return [];
    const n = Math.max(1, Math.min(count, verses.length));
    const selected = sample(verses, n);
    if (mode === 'fill') return selected.map((v) => makeFill(v, verses));
    if (mode === 'order') return selected.map((v) => makeOrder(v));
    return selected.map((v) => makeAudio(v, verses, riwaya));
}