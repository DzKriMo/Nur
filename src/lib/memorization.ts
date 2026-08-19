// Quran memorization: Arabic normalization, fuzzy word matching, and
// persistent progress tracking (verses mastered, daily goals, streaks, milestones).

export interface VerseRecord {
    verseNum: string;
    bestAccuracy: number;
    attempts: number;
    mastered: boolean;
    lastAccuracy: number;
    updatedAt: number;
    // Normalized Arabic words that were missed on this verse, with counts
    // accumulated across attempts (used for "words to strengthen").
    weakWords?: Record<string, number>;
    // Spaced repetition: the next scheduled review timestamp and the current
    // interval (in days). Verses without a nextReview (mastered before SRS)
    // are treated as due immediately.
    nextReview?: number;
    intervalDays?: number;
    lapses?: number;
}

export interface SurahProgress {
    [verseNum: string]: VerseRecord;
}

export interface MemorizationState {
    surahs: Record<string, SurahProgress>;
    // dayKey ('YYYY-MM-DD') -> list of `${surahId}:${verseNum}` completed that day
    days: Record<string, string[]>;
    dailyGoal: number;
    // Show the first letter of hidden words as a recall hint (defaults to true).
    showHints: boolean;
}

export const DEFAULT_MEMORIZATION_STATE: MemorizationState = {
    surahs: {},
    days: {},
    dailyGoal: 5,
    showHints: true,
};

export const MEMORIZATION_STORAGE_KEY = 'nur-memorization';

export const MASTERY_THRESHOLD = 85;

export const MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000];

// Spaced-repetition review ladder (in days). A verse advances one rung after
// a strong review and drops back to the first rung after a lapse.
export const SRS_INTERVALS = [1, 3, 7, 15, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

export function dayKey(d = new Date()): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function normalizeArabic(text: string): string {
    return text
        .replace(/[\uFEFF\u200B-\u200F\u2060\u00A0]/g, '')
        .replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED\u08F0-\u08FF\u0610-\u061A\u06DD\uFD3E\uFD3F\u0300-\u036F]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[\u0660-\u0669]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
        .replace(/\s+/g, ' ')
        .trim();
}

export function normalizeArabicTokens(text: string): string[] {
    return normalizeArabic(text).split(' ').filter(Boolean);
}

// Muqatta'at (disjoint letters) opening a number of surahs. Reciters say the
// LETTER NAMES (e.g. "ألف لام ميم" for "الم"), so matching must accept those.
const MUQATTAAT_TOKENS = new Set(['الم', 'المص', 'الر', 'المر', 'كهيعص', 'طه', 'طسم', 'طس', 'يس', 'ص', 'حم', 'عسق', 'ق', 'ن']);

const ARABIC_LETTER_NAMES: Record<string, string> = {
    'ا': 'الف', 'ب': 'با', 'ج': 'جيم', 'د': 'دال', 'ه': 'ها',
    'و': 'واو', 'ز': 'زاي', 'ح': 'حا', 'ط': 'طا', 'ي': 'يا',
    'ك': 'كاف', 'ل': 'لام', 'م': 'ميم', 'ن': 'نون', 'س': 'سين',
    'ع': 'عين', 'ف': 'فا', 'ص': 'صاد', 'ق': 'قاف', 'ر': 'را',
    'ش': 'شين', 'ت': 'تا', 'ث': 'ثا', 'خ': 'خا', 'ذ': 'ذال',
    'ض': 'ضاد', 'ظ': 'ظا', 'غ': 'غين',
};

function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Array(m + 1);
    for (let i = 0; i <= m; i++) dp[i] = new Array(n + 1).fill(0);
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[m][n];
}

/**
 * Strips common Arabic proclitics (ال, و, ف, ب, ك, ل) so that e.g. "وَالرَّحِيم"
 * and "الرَّحِيم" are treated as the same word. This makes matching tolerant of
 * riwaya/ASR differences that add or drop a leading clitic.
 */
function stripLeadingClitics(w: string): string {
    let s = w;
    if (s.startsWith('ال') && s.length > 3) s = s.slice(2);
    if (s.length > 1 && 'والفبكل'.includes(s[0])) s = s.slice(1);
    return s;
}

/**
 * Fuzzy Arabic word match. Exact match always wins; a clitic-insensitive match
 * tolerates riwaya/ASR prefix differences; otherwise a Levenshtein similarity
 * threshold tolerates common ASR errors (shadda/hamza variants).
 */
export function isWordMatch(a: string, b: string): boolean {
    if (!a || !b) return false;
    if (a === b) return true;
    if (stripLeadingClitics(a) === stripLeadingClitics(b)) return true;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return false;
    const similarity = 1 - levenshtein(a, b) / maxLen;
    return similarity >= 0.7;
}

/**
 * Greedy sequential alignment of recognized speech tokens against the target
 * verse words. Reveals target words in order; tolerates extra/missing tokens.
 * Returns the number of target words matched (revealed) from `cursor` onward.
 */
export function matchSpokenWords(spokenTokens: string[], targetWords: string[], cursor: number): number {
    let tokIdx = 0;
    let revealed = 0;
    for (let i = cursor; i < targetWords.length; i++) {
        let found = false;
        for (let k = tokIdx; k < Math.min(spokenTokens.length, tokIdx + 4); k++) {
            if (isWordMatch(spokenTokens[k], targetWords[i])) {
                found = true;
                tokIdx = k + 1;
                break;
            }
        }
        if (!found) break;
        revealed++;
    }
    return revealed;
}

export interface AlignResult {
    /** Number of target words resolved (matched or skipped-missed) from `startIndex`. */
    consumed: number;
    /** Absolute target indices that were skipped as unrecognized (riwaya/ASR variants). */
    missed: number[];
    /** End cursor position in each alternative stream after alignment. */
    cursors: number[];
}

/**
 * Try to match a single target word against a token stream starting at `cursor`.
 * Returns the next cursor position on success, or -1. Muqatta'at tokens (الم,
 * ق, كهيعص…) are also matched against the sequence of their letter names
 * (ألف لام ميم, قاف, كاف ها يا عين صاد) as reciters pronounce them.
 */
function matchTokenInStream(tokens: string[], cursor: number, word: string, lookahead: number): number {
    const end = Math.min(tokens.length, cursor + lookahead);
    for (let k = cursor; k < end; k++) {
        if (isWordMatch(tokens[k], word)) return k + 1;
    }
    if (MUQATTAAT_TOKENS.has(word)) {
        const names = [...word].map((c) => ARABIC_LETTER_NAMES[c]).filter(Boolean);
        if (names.length > 0) {
            const searchEnd = Math.min(tokens.length, cursor + lookahead + names.length);
            for (let start = cursor; start < searchEnd; start++) {
                let p = start;
                let matched = 0;
                for (const name of names) {
                    let q = p;
                    while (q < tokens.length && !isWordMatch(tokens[q], name)) q++;
                    if (q >= tokens.length) break;
                    p = q + 1;
                    matched++;
                }
                if (matched === names.length) return p;
            }
        }
    }
    return -1;
}

function tryMatchStream(altStreams: string[][], cursors: number[], word: string, lookahead: number): boolean {
    for (let a = 0; a < altStreams.length; a++) {
        const next = matchTokenInStream(altStreams[a], cursors[a], word, lookahead);
        if (next >= 0) {
            cursors[a] = next;
            return true;
        }
    }
    return false;
}

/**
 * Multi-alternative alignment with skip-ahead recovery. Each ASR alternative
 * is an independent chronological token stream; a target word is revealed when
 * ANY stream matches it in order within the lookahead window.
 *
 * Skip-ahead: if the current target word isn't recognized but the NEXT one is,
 * the current word is reported as `missed` (misheard or a riwaya variant the
 * engine doesn't recognize) and alignment continues instead of stalling.
 */
/** How many stream tokens a single-word match may scan when searching. */
const MAX_SCAN = 64;
/** How many target words ahead the skip-ahead recovery may jump over. */
const SKIP_WINDOW = 4;

/**
 * Multi-alternative alignment with forgiving skip-ahead recovery. Each ASR
 * alternative is an independent chronological token stream; a target word is
 * revealed when ANY stream matches it in order.
 *
 * - The current frontier word is searched across the whole remaining stream
 *   (bounded by MAX_SCAN) so a long breath re-read that floods the stream with
 *   duplicates never buries it past a small window.
 * - Skip-ahead: if the current word isn't recognized but one of the next
 *   SKIP_WINDOW words is, the gap is recorded as `missed` (misheard or a
 *   riwaya variant the engine doesn't recognize) and alignment continues, so a
 *   single bad word can never stall the whole verse.
 */
export function alignTokensMulti(
    altStreams: string[][],
    targetWords: string[],
    startIndex = 0,
    lookahead = 5
): AlignResult {
    const cursors = altStreams.map(() => 0);
    const missed: number[] = [];
    let i = startIndex;
    while (i < targetWords.length) {
        if (tryMatchStream(altStreams, cursors, targetWords[i], MAX_SCAN)) {
            i++;
            continue;
        }
        let jumped = false;
        for (let j = 1; j <= SKIP_WINDOW && i + j < targetWords.length; j++) {
            if (tryMatchStream(altStreams, cursors, targetWords[i + j], lookahead + j * 2)) {
                for (let m = i; m < i + j; m++) missed.push(m);
                i += j + 1;
                jumped = true;
                break;
            }
        }
        if (jumped) continue;
        break;
    }
    return { consumed: i - startIndex, missed, cursors };
}

export function compareRecitation(spoken: string, target: string): { accuracy: number; missing: string[] } {
    const targetWords = normalizeArabicTokens(target);
    const spokenWords = normalizeArabicTokens(spoken);
    if (targetWords.length === 0) return { accuracy: 0, missing: [] };

    const missing = targetWords.filter((w) => !spokenWords.includes(w));
    const accuracy = Math.round(((targetWords.length - missing.length) / targetWords.length) * 100);
    return { accuracy, missing };
}

export function getTodayVerses(state: MemorizationState): number {
    return state.days[dayKey()]?.length ?? 0;
}

export function getStreak(state: MemorizationState): number {
    const days = new Set(
        Object.keys(state.days).filter((k) => (state.days[k]?.length ?? 0) > 0)
    );
    if (days.size === 0) return 0;
    let streak = 0;
    const d = new Date();
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

export function getTotalVerses(state: MemorizationState): number {
    let total = 0;
    for (const key of Object.keys(state.surahs)) {
        for (const v of Object.values(state.surahs[key])) {
            if (v.mastered) total++;
        }
    }
    return total;
}

export function getSurahProgress(state: MemorizationState, surahId: string): { mastered: number; total: number } {
    const surah = state.surahs[surahId] ?? {};
    let mastered = 0;
    for (const v of Object.values(surah)) {
        if (v.mastered) mastered++;
    }
    return { mastered, total: Object.keys(surah).length };
}

/**
 * Most-missed words across a surah's attempts, for "words to strengthen".
 * Normalized Arabic words weighted by how often they were missed.
 */
export function getSurahWeakWords(state: MemorizationState, surahId: string, limit = 6): { word: string; count: number }[] {
    const surah = state.surahs[surahId] ?? {};
    const counts: Record<string, number> = {};
    for (const v of Object.values(surah)) {
        if (v.weakWords) {
            for (const [word, c] of Object.entries(v.weakWords)) {
                counts[word] = (counts[word] ?? 0) + c;
            }
        }
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));
}

/** All mastered verses across every surah (for cross-surah review). */
export function getAllMasteredVerses(state: MemorizationState): { surahId: string; verseNum: string }[] {
    const out: { surahId: string; verseNum: string }[] = [];
    for (const [surahId, surah] of Object.entries(state.surahs)) {
        for (const v of Object.values(surah)) {
            if (v.mastered) out.push({ surahId, verseNum: v.verseNum });
        }
    }
    return out;
}

/** True if a mastered verse is due for a spaced-repetition review today. */
export function isVerseDue(v: VerseRecord, now = Date.now()): boolean {
    return v.mastered && (v.nextReview === undefined || v.nextReview <= now);
}

/** Mastered verses due for review across every surah (SRS queue). */
export function getDueVerses(state: MemorizationState): { surahId: string; verseNum: string }[] {
    const out: { surahId: string; verseNum: string }[] = [];
    const now = Date.now();
    for (const [surahId, surah] of Object.entries(state.surahs)) {
        for (const v of Object.values(surah)) {
            if (isVerseDue(v, now)) out.push({ surahId, verseNum: v.verseNum });
        }
    }
    return out;
}

export function countDueVerses(state: MemorizationState): number {
    return getDueVerses(state).length;
}

export function countDueVersesInSurah(state: MemorizationState, surahId: string): number {
    const surah = state.surahs[surahId] ?? {};
    const now = Date.now();
    let count = 0;
    for (const v of Object.values(surah)) {
        if (isVerseDue(v, now)) count++;
    }
    return count;
}

/** The next review interval (days) scheduled for a verse, or null if unknown. */
export function getVerseInterval(state: MemorizationState, surahId: string, verseNum: string): number | null {
    return state.surahs[surahId]?.[verseNum]?.intervalDays ?? null;
}

export interface GlobalStats {
    totalMastered: number;
    totalAttempted: number;
    totalAttempts: number;
    averageAccuracy: number;
    dueCount: number;
    todayCount: number;
    dailyGoal: number;
    streak: number;
    activeDays: number;
    totalVersesLearned: number;
}

export function getGlobalStats(state: MemorizationState): GlobalStats {
    let totalMastered = 0;
    let totalAttempts = 0;
    let totalAttempted = 0;
    let accuracyWeightedSum = 0;
    for (const surah of Object.values(state.surahs)) {
        for (const v of Object.values(surah)) {
            if (v.mastered) totalMastered++;
            totalAttempted++;
            totalAttempts += v.attempts;
            accuracyWeightedSum += v.lastAccuracy * v.attempts;
        }
    }
    return {
        totalMastered,
        totalAttempted,
        totalAttempts,
        averageAccuracy: totalAttempts > 0 ? Math.round(accuracyWeightedSum / totalAttempts) : 0,
        dueCount: countDueVerses(state),
        todayCount: getTodayVerses(state),
        dailyGoal: state.dailyGoal,
        streak: getStreak(state),
        activeDays: Object.keys(state.days).filter((k) => (state.days[k]?.length ?? 0) > 0).length,
        totalVersesLearned: Object.keys(state.days).reduce((n, k) => n + (state.days[k]?.length ?? 0), 0),
    };
}

/** Mastered-verse count per surah id (the dashboard merges these with surah metadata). */
export function getMasteryPerSurah(state: MemorizationState): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [surahId, surah] of Object.entries(state.surahs)) {
        let mastered = 0;
        for (const v of Object.values(surah)) {
            if (v.mastered) mastered++;
        }
        if (mastered > 0) out[surahId] = mastered;
    }
    return out;
}

/** Days with activity, newest first: [{ key, count }]. */
export function getActivityDays(state: MemorizationState): { key: string; count: number }[] {
    return Object.entries(state.days)
        .map(([key, list]) => ({ key, count: list?.length ?? 0 }))
        .filter((d) => d.count > 0)
        .sort((a, b) => (a.key < b.key ? 1 : -1));
}

/** Most-missed words across the whole memorized set, weighted by miss count. */
export function getWeakWordsGlobal(state: MemorizationState, limit = 10): { word: string; count: number }[] {
    const counts: Record<string, number> = {};
    for (const surah of Object.values(state.surahs)) {
        for (const v of Object.values(surah)) {
            if (v.weakWords) {
                for (const [word, c] of Object.entries(v.weakWords)) {
                    counts[word] = (counts[word] ?? 0) + c;
                }
            }
        }
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));
}

/**
 * Bump the weak-word counts for a verse without touching mastery or the
 * spaced-repetition schedule (used by quizzes and other passive drills).
 */
export function addWeakWords(
    state: MemorizationState,
    surahId: string,
    verseNum: string,
    missedWords: string[]
): MemorizationState {
    if (missedWords.length === 0) return state;
    const surah = state.surahs[surahId];
    const record = surah?.[verseNum];
    if (!record) return state;
    const weakWords = { ...(record.weakWords ?? {}) };
    for (const w of missedWords) {
        const normalized = normalizeArabic(w);
        if (normalized) weakWords[normalized] = (weakWords[normalized] ?? 0) + 1;
    }
    return {
        ...state,
        surahs: {
            ...state.surahs,
            [surahId]: { ...surah, [verseNum]: { ...record, weakWords } },
        },
    };
}

export function getUnlockedMilestones(total: number): number[] {
    return MILESTONES.filter((m) => total >= m);
}

export function getNewlyUnlockedMilestones(prevTotal: number, nextTotal: number): number[] {
    return MILESTONES.filter((m) => m > prevTotal && m <= nextTotal);
}

export function recordVerse(
    state: MemorizationState,
    surahId: string,
    verseNum: string,
    accuracy: number,
    missedWords: string[] = []
): MemorizationState {
    const surah = state.surahs[surahId] ?? {};
    const prev = surah[verseNum];
    const mastered = (prev?.mastered ?? false) || accuracy >= MASTERY_THRESHOLD;

    const weakWords = { ...(prev?.weakWords ?? {}) };
    for (const w of missedWords) {
        const normalized = normalizeArabic(w);
        if (normalized) weakWords[normalized] = (weakWords[normalized] ?? 0) + 1;
    }

    // Spaced-repetition scheduling: strong reviews climb the interval ladder,
    // lapses drop the verse back to the shortest interval.
    const wasStrong = accuracy >= MASTERY_THRESHOLD;
    let intervalDays = prev?.intervalDays ?? 0;
    if (wasStrong) {
        const idx = SRS_INTERVALS.indexOf(intervalDays);
        intervalDays = idx === -1
            ? SRS_INTERVALS[0]
            : SRS_INTERVALS[Math.min(idx + 1, SRS_INTERVALS.length - 1)];
    } else {
        intervalDays = SRS_INTERVALS[0];
    }
    const lapses = (prev?.lapses ?? 0) + (wasStrong ? 0 : 1);
    const nextReview = Date.now() + intervalDays * DAY_MS;

    const record: VerseRecord = {
        verseNum,
        bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
        attempts: (prev?.attempts ?? 0) + 1,
        mastered,
        lastAccuracy: accuracy,
        updatedAt: Date.now(),
        weakWords,
        nextReview,
        intervalDays,
        lapses,
    };

    const today = dayKey();
    const dayVerses = state.days[today] ?? [];
    const key = `${surahId}:${verseNum}`;
    const nextDays = mastered && !dayVerses.includes(key)
        ? { ...state.days, [today]: [...dayVerses, key] }
        : state.days;

    return {
        ...state,
        surahs: {
            ...state.surahs,
            [surahId]: { ...surah, [verseNum]: record },
        },
        days: nextDays,
    };
}