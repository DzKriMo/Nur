// Quran memorization: Arabic normalization, fuzzy word matching, and
// persistent progress tracking (verses mastered, daily goals, streaks, milestones).

export interface VerseRecord {
    verseNum: string;
    bestAccuracy: number;
    attempts: number;
    mastered: boolean;
    lastAccuracy: number;
    updatedAt: number;
}

export interface SurahProgress {
    [verseNum: string]: VerseRecord;
}

export interface MemorizationState {
    surahs: Record<string, SurahProgress>;
    // dayKey ('YYYY-MM-DD') -> list of `${surahId}:${verseNum}` completed that day
    days: Record<string, string[]>;
    dailyGoal: number;
}

export const DEFAULT_MEMORIZATION_STATE: MemorizationState = {
    surahs: {},
    days: {},
    dailyGoal: 5,
};

export const MEMORIZATION_STORAGE_KEY = 'nur-memorization';

export const MASTERY_THRESHOLD = 85;

export const MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000];

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
}

function tryMatchStream(altStreams: string[][], cursors: number[], word: string, lookahead: number): boolean {
    for (let a = 0; a < altStreams.length; a++) {
        const tokens = altStreams[a];
        const end = Math.min(tokens.length, cursors[a] + lookahead);
        for (let k = cursors[a]; k < end; k++) {
            if (isWordMatch(tokens[k], word)) {
                cursors[a] = k + 1;
                return true;
            }
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
        if (tryMatchStream(altStreams, cursors, targetWords[i], lookahead)) {
            i++;
            continue;
        }
        if (i + 1 < targetWords.length && tryMatchStream(altStreams, cursors, targetWords[i + 1], lookahead + 2)) {
            missed.push(i);
            i++;
            continue;
        }
        break;
    }
    return { consumed: i - startIndex, missed };
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
    accuracy: number
): MemorizationState {
    const surah = state.surahs[surahId] ?? {};
    const prev = surah[verseNum];
    const mastered = (prev?.mastered ?? false) || accuracy >= MASTERY_THRESHOLD;
    const record: VerseRecord = {
        verseNum,
        bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
        attempts: (prev?.attempts ?? 0) + 1,
        mastered,
        lastAccuracy: accuracy,
        updatedAt: Date.now(),
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