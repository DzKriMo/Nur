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

function scoreHadith(arabic: string, english: string, narrator: string, query: string): number {
    const ar = arabic.toLowerCase();
    const en = english.toLowerCase();
    const na = narrator.toLowerCase();

    if (arabic === query) return 10;
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

    const query = q.toLowerCase();
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
            const score = scoreHadith(hadith.arabic, hadith.english.text, hadith.english.narrator, query);
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