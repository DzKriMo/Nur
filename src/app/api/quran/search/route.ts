import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

interface VerseEntry {
    surahId: string;
    surahName: string;
    surahNameAr: string;
    verseNum: string;
    arabic: string;
    arabicNorm: string;
    english: string;
}

/** Strips Arabic diacritics (tashkeel) and normalizes letter variants so searches work without them. */
function normalizeArabic(text: string): string {
    return text
        .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08E1\u0640]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ھ/g, 'ه')
        .replace(/ۀ/g, 'ه')
        .replace(/ے/g, 'ي');
}

let corpusCache: VerseEntry[] | null = null;
let corpusLoading: Promise<VerseEntry[]> | null = null;

async function loadQuranCorpus(): Promise<VerseEntry[]> {
    const surahDir = path.join(DATA_DIR, 'quran', 'surahs');
    const transDir = path.join(DATA_DIR, 'translation', 'en');
    const metaFile = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'quran', 'surah.json'), 'utf-8')) as {
        index: string; title: string; titleAr: string;
    }[];

    const metaMap = new Map(metaFile.map(s => [s.index, s]));

    const surahFiles = (await fs.readdir(surahDir)).filter(f => f.endsWith('.json'));

    const entries: VerseEntry[] = [];
    for (const file of surahFiles) {
        const surahId = file.replace('surah_', '').replace('.json', '');
        const surah = JSON.parse(await fs.readFile(path.join(surahDir, file), 'utf-8')) as {
            verse: Record<string, string>;
        };
        const meta = metaMap.get(surahId.padStart(3, '0'));
        const transFile = path.join(transDir, `en_translation_${surahId}.json`);
        let trans: Record<string, string> = {};
        try {
            trans = (JSON.parse(await fs.readFile(transFile, 'utf-8')) as { verse: Record<string, string> }).verse;
        } catch {
            // no translation for this surah
        }

        for (const [key, text] of Object.entries(surah.verse)) {
            const verseNum = key.split('_')[1];
            if (!verseNum) continue;
            entries.push({
                surahId,
                surahName: meta?.title ?? surahId,
                surahNameAr: meta?.titleAr ?? '',
                verseNum,
                arabic: text,
                arabicNorm: normalizeArabic(text),
                english: trans[key] ?? '',
            });
        }
    }

    return entries;
}

function getCorpus(): Promise<VerseEntry[]> {
    if (corpusCache) return Promise.resolve(corpusCache);
    if (!corpusLoading) {
        corpusLoading = loadQuranCorpus().then(corpus => {
            corpusCache = corpus;
            return corpus;
        });
    }
    return corpusLoading;
}

function scoreVerse(verse: VerseEntry, query: string, englishQuery: string): number {
    const arabic = verse.arabicNorm;
    const english = verse.english.toLowerCase();

    if (arabic === query) return 10;
    if (arabic.startsWith(query)) return 7;
    if (arabic.includes(query)) return 5;

    if (verse.english.toLowerCase() === englishQuery) return 9;
    if (english.startsWith(englishQuery)) return 6;
    if (english.includes(englishQuery)) return 4;

    const arabicWords = query.split(/\s+/).filter(Boolean);
    const englishWords = englishQuery.split(/\s+/).filter(Boolean);
    let matched = 0;
    for (const w of arabicWords) if (arabic.includes(w)) matched++;
    for (const w of englishWords) if (english.includes(w)) matched++;
    const totalWords = arabicWords.length + englishWords.length;
    return totalWords > 0 ? matched / totalWords : 0;
}

export async function GET(request: NextRequest) {
    const q = request.nextUrl.searchParams.get('q')?.trim();
    if (!q || q.length < 2) {
        return Response.json({ results: [], query: q ?? '' });
    }

    const query = normalizeArabic(q.toLowerCase());
    const englishQuery = q.toLowerCase();
    const corpus = await getCorpus();

    const scored: { verse: VerseEntry; score: number }[] = [];
    for (const verse of corpus) {
        const score = scoreVerse(verse, query, englishQuery);
        if (score > 0) scored.push({ verse, score });
    }

    scored.sort((a, b) => b.score - a.score);

    const results = scored.slice(0, 25).map(({ verse }) => ({
        surahId: verse.surahId,
        surahName: verse.surahName,
        surahNameAr: verse.surahNameAr,
        verseNum: verse.verseNum,
        arabic: verse.arabic,
        english: verse.english,
        href: `/quran/${verse.surahId}#verse-${verse.verseNum}`,
    }));

    return Response.json({ results, query: q });
}

export const dynamic = 'force-dynamic';
