import { NextRequest } from 'next/server';
import { getHadithBooks, getHadithBookCached } from '@/lib/data';

interface SearchResult {
    bookId: string;
    bookName: string;
    bookNameAr: string;
    chapterId: number;
    hadithId: number;
    idInBook: number;
    arabic: string;
    narrator: string;
    text: string;
    href: string;
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

const normCache = new Map<number, string>();

function normAr(text: string, id: number): string {
    let n = normCache.get(id);
    if (n === undefined) {
        n = normalizeArabic(text);
        normCache.set(id, n);
    }
    return n;
}

function scoreHadith(arabic: string, english: string, narrator: string, query: string): number {
    const ar = arabic;
    const en = english.toLowerCase();
    const na = narrator.toLowerCase();

    if (ar === query) return 10;
    if (ar.startsWith(query)) return 7;
    if (ar.includes(query)) return 5;

    if (en === query) return 9;
    if (en.startsWith(query)) return 6;
    if (en.includes(query)) return 4;

    if (na.includes(query)) return 3;

    const words = query.split(/\s+/).filter(Boolean);
    let matched = 0;
    for (const w of words) if (ar.includes(w) || en.includes(w)) matched++;
    return words.length > 0 ? (matched / words.length) * 3 : 0;
}

export async function GET(request: NextRequest) {
    const q = request.nextUrl.searchParams.get('q')?.trim();
    if (!q || q.length < 2) {
        return Response.json({ results: [], query: q ?? '' });
    }

    const query = normalizeArabic(q.toLowerCase());
    const bookInfos = await getHadithBooks();

    const scored: { result: SearchResult; score: number }[] = [];

    for (const info of bookInfos) {
        let book;
        try {
            book = await getHadithBookCached(info.filename);
        } catch {
            continue;
        }

        for (const hadith of book.hadiths) {
            const score = scoreHadith(normAr(hadith.arabic, hadith.id), hadith.english.text, hadith.english.narrator, query);
            if (score > 0) {
                scored.push({
                    score,
                    result: {
                        bookId: info.filename,
                        bookName: info.name,
                        bookNameAr: info.nameAr,
                        chapterId: hadith.chapterId,
                        hadithId: hadith.id,
                        idInBook: hadith.idInBook,
                        arabic: hadith.arabic,
                        narrator: hadith.english.narrator,
                        text: hadith.english.text,
                        href: `/hadith/${info.filename}/${hadith.chapterId}`,
                    },
                });
            }
        }
    }

    scored.sort((a, b) => b.score - a.score);

    const results = scored.slice(0, 25).map(({ result }) => result);

    return Response.json({ results, query: q });
}

export const dynamic = 'force-dynamic';