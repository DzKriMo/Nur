// Tajweed color annotation for the Quran reader.
//
// Produces colored text spans highlighting the three most visible tajweed
// rules, following the color convention used in popular mushaf apps:
//
//   - Madd      (elongation letters ا/ي/و)  -> gold
//   - Ghunnah   (noon sakinah rules, tanween, شَدّة on ن/م) -> emerald
//   - Qalqalah  (ق ط ب ج د carrying sukun) -> rose
//
// The original string is preserved exactly: concatenating segment texts
// reproduces the input character-for-character.

export type TajweedRule = 'madd' | 'ghunnah' | 'qalqalah';

export interface TajweedSegment {
    text: string;
    rule: TajweedRule | null;
}

const QALQALAH = new Set(['ق', 'ط', 'ب', 'ج', 'د']);

// Letters that trigger a ghunnah on a preceding noon sakinah or tanween:
// every letter except the six izhar letters (أ ه ع غ خ ح) and the two
// idgham-without-ghunnah letters (ل ر).
const GHUNNAH_LETTERS = new Set([
    'ي', 'ن', 'م', 'و', 'ب', 'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ف', 'ق', 'ك',
]);

const FATHATAN = '\u064B'; // ً
const DAMMATAN = '\u064C'; // ٌ
const KASRATAN = '\u064D'; // ٍ
const FATHA = '\u064E'; // َ
const DAMMA = '\u064F'; // ُ
const KASRA = '\u0650'; // ِ
const SHADDA = '\u0651'; // ّ
const SUKUN = '\u0652'; // ْ
const DAGGER_ALIF = '\u0670'; // ٰ

// Combining marks that belong to the preceding base character. Everything
// else (letters, tatweel, digits, spaces) starts a new base group.
const MARKS_RE = /[\u064B-\u0652\u0670\u0610-\u061A\u06D6-\u06ED\u08F0-\u08FF\u0300-\u036F]/;

interface Group {
    base: string;
    marks: string;
    hasFatha: boolean;
    hasDamma: boolean;
    hasKasra: boolean;
    hasSukun: boolean;
    hasShadda: boolean;
    hasDaggerAlif: boolean;
    tanween: string | null;
}

function splitMarks(text: string): { base: string; marks: string }[] {
    const groups: { base: string; marks: string }[] = [];
    for (const ch of text) {
        if (MARKS_RE.test(ch)) {
            if (groups.length > 0) groups[groups.length - 1].marks += ch;
            else groups.push({ base: '', marks: ch });
        } else {
            groups.push({ base: ch, marks: '' });
        }
    }
    return groups;
}

function analyze({ base, marks }: { base: string; marks: string }): Group {
    let hasFatha = false, hasDamma = false, hasKasra = false;
    let hasSukun = false, hasShadda = false, hasDaggerAlif = false;
    let tanween: string | null = null;
    for (const m of marks) {
        if (m === FATHA) hasFatha = true;
        else if (m === DAMMA) hasDamma = true;
        else if (m === KASRA) hasKasra = true;
        else if (m === SUKUN) hasSukun = true;
        else if (m === SHADDA) hasShadda = true;
        else if (m === DAGGER_ALIF) hasDaggerAlif = true;
        else if (m === FATHATAN || m === DAMMATAN || m === KASRATAN) tanween = m;
    }
    return { base, marks, hasFatha, hasDamma, hasKasra, hasSukun, hasShadda, hasDaggerAlif, tanween };
}

/** Annotate an Arabic verse string with tajweed color rules. */
export function annotateTajweed(text: string): TajweedSegment[] {
    const groups = splitMarks(text).map(analyze);
    const segments: TajweedSegment[] = [];

    const push = (piece: string, rule: TajweedRule | null) => {
        if (!piece) return;
        if (segments.length > 0 && segments[segments.length - 1].rule === rule) {
            segments[segments.length - 1].text += piece;
        } else {
            segments.push({ text: piece, rule });
        }
    };

    for (let i = 0; i < groups.length; i++) {
        const g = groups[i];
        // Spaces between words are not pauses — skip them when looking ahead.
        let nextBase = '';
        for (let j = i + 1; j < groups.length; j++) {
            if (groups[j].base.trim()) {
                nextBase = groups[j].base;
                break;
            }
        }

        // Qalqalah: ق ط ب ج د with sukun.
        if (g.base && QALQALAH.has(g.base) && g.hasSukun) {
            push(g.base + g.marks, 'qalqalah');
            continue;
        }

        // Ghunnah on noon sakinah (نْ) before a ghunnah letter, and on
        // shadda-carrying ن / م (نّ / مّ).
        if (g.base === 'ن' && g.hasSukun && GHUNNAH_LETTERS.has(nextBase)) {
            push(g.base + g.marks, 'ghunnah');
            continue;
        }
        if ((g.base === 'ن' || g.base === 'م') && g.hasShadda) {
            push(g.base + g.marks, 'ghunnah');
            continue;
        }
        // Ghunnah on the tanween mark (ً ٌ ٍ) before a ghunnah letter.
        if (g.tanween && GHUNNAH_LETTERS.has(nextBase)) {
            const at = g.marks.indexOf(g.tanween);
            push(g.base + g.marks.slice(0, at), null);
            push(g.tanween, 'ghunnah');
            const after = g.marks.slice(at + 1);
            if (after) push(after, null);
            continue;
        }

        // Madd: elongation alif after a fatha, the dagger alif (ٰ), and madd
        // ي / و (sukun after a matching short vowel).
        const prev = groups[i - 1];
        if (g.hasDaggerAlif) {
            const rest = g.marks.split(DAGGER_ALIF).join('');
            push(g.base + rest, null);
            push(DAGGER_ALIF, 'madd');
            continue;
        }
        if ((g.base === 'ا' || g.base === 'آ') && prev?.hasFatha) {
            push(g.base, 'madd');
            if (g.marks) push(g.marks, null);
            continue;
        }
        if (g.base === 'ي' && g.hasSukun && prev?.hasKasra) {
            push(g.base + g.marks, 'madd');
            continue;
        }
        if (g.base === 'و' && g.hasSukun && prev?.hasDamma) {
            push(g.base + g.marks, 'madd');
            continue;
        }

        push(g.base + g.marks, null);
    }

    return segments;
}