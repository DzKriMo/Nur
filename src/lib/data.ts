import fs from 'fs/promises';
import path from 'path';
import { SurahMeta, SurahContent, HadithBook, AdhkarCategory, TranslationContent, HadithChapter, Hadith, BookInfo, NameOfAllah } from '@/types';
import { Riwaya } from '@/lib/riwaya';

const DATA_DIR = path.join(process.cwd(), 'src/data');

const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function quranDir(riwaya: Riwaya): string {
    return riwaya === 'hafs' ? 'quran' : path.join('quran', riwaya);
}

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (entry && entry.expiry > Date.now()) return entry.data as T;
    cache.delete(key);
    return null;
}

function setCache(key: string, data: unknown): void {
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

// Quran
export async function getSurahs(riwaya: Riwaya = 'hafs'): Promise<SurahMeta[]> {
    const key = `surahs_${riwaya}`;
    const cached = getCached<SurahMeta[]>(key);
    if (cached) return cached;
    const filePath = path.join(DATA_DIR, quranDir(riwaya), 'surah.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: SurahMeta[] = JSON.parse(fileContent);
    setCache(key, data);
    return data;
}

export async function getSurah(index: string, riwaya: Riwaya = 'hafs'): Promise<SurahContent> {
    const id = parseInt(index, 10);
    const key = `surah_${riwaya}_${id}`;
    const cached = getCached<SurahContent>(key);
    if (cached) return cached;
    const filePath = path.join(DATA_DIR, quranDir(riwaya), 'surahs', `surah_${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: SurahContent = JSON.parse(fileContent);
    setCache(key, data);
    return data;
}

export async function getTranslation(index: string, lang: 'en' | 'ar' = 'en'): Promise<TranslationContent> {
    const id = parseInt(index, 10);
    const key = `translation_${lang}_${id}`;
    const cached = getCached<TranslationContent>(key);
    if (cached) return cached;
    const filePath = path.join(DATA_DIR, 'translation', lang, `${lang}_translation_${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: TranslationContent = JSON.parse(fileContent);
    setCache(key, data);
    return data;
}

// Hadith
const HADITH_BOOKS: BookInfo[] = [
    // Major 9
    { id: 'bukhari', name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', filename: 'bukhari.json', category: 'major' },
    { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', filename: 'muslim.json', category: 'major' },
    { id: 'abudawud', name: 'Sunan Abi Dawud', nameAr: 'سنن أبي داود', filename: 'abudawud.json', category: 'major' },
    { id: 'ahmed', name: 'Musnad Ahmad', nameAr: 'مسند أحمد', filename: 'ahmed.json', category: 'major' },
    { id: 'tirmidhi', name: 'Jami al-Tirmidhi', nameAr: 'جامع الترمذي', filename: 'tirmidhi.json', category: 'major' },
    { id: 'nasai', name: 'Sunan al-Nasai', nameAr: 'سنن النسائي', filename: 'nasai.json', category: 'major' },
    { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', filename: 'ibnmajah.json', category: 'major' },
    { id: 'malik', name: 'Muwatta Malik', nameAr: 'موطأ مالك', filename: 'malik.json', category: 'major' },
    { id: 'darimi', name: 'Sunan al-Darimi', nameAr: 'سنن الدارمي', filename: 'darimi.json', category: 'major' },
    // Forties
    { id: 'nawawi40', name: '40 Hadith Nawawi', nameAr: 'الأربعون النووية', filename: 'nawawi40.json', category: 'forty' },
    { id: 'qudsi40', name: '40 Hadith Qudsi', nameAr: 'الأربعون القدسية', filename: 'qudsi40.json', category: 'forty' },
    { id: 'shahwaliullah40', name: '40 Hadith Shah Waliullah', nameAr: 'الأربعون للشهاب الولي', filename: 'shahwaliullah40.json', category: 'forty' },
    // Other
    { id: 'riyad_assalihin', name: 'Riyad al-Salihin', nameAr: 'رياض الصالحين', filename: 'riyad_assalihin.json', category: 'other' },
    { id: 'bulugh_almaram', name: 'Bulugh al-Maram', nameAr: 'بلوغ المرام', filename: 'bulugh_almaram.json', category: 'other' },
    { id: 'aladab_almufrad', name: 'Al-Adab al-Mufrad', nameAr: 'الأدب المفرد', filename: 'aladab_almufrad.json', category: 'other' },
    { id: 'mishkat_almasabih', name: 'Mishkat al-Masabih', nameAr: 'مشكاة المصابيح', filename: 'mishkat_almasabih.json', category: 'other' },
    { id: 'shamail_muhammadiyah', name: 'Shamail al-Muhammadiyah', nameAr: 'الشمائل المحمدية', filename: 'shamail_muhammadiyah.json', category: 'other' },
];

function getBookDir(category: string): string {
    if (category === 'major') return 'the_9_books';
    if (category === 'forty') return 'forties';
    return 'other_books';
}

export async function getHadithBooks(category?: string): Promise<BookInfo[]> {
    if (category) {
        return HADITH_BOOKS.filter(b => b.category === category);
    }
    return HADITH_BOOKS;
}

export async function getHadithBook(filename: string): Promise<HadithBook> {
    const key = `hadith_book_${filename}`;
    const cached = getCached<HadithBook>(key);
    if (cached) return cached;

    const bookInfo = HADITH_BOOKS.find(b => b.filename === filename);
    const dir = getBookDir(bookInfo?.category || 'major');
    const filePath = path.join(DATA_DIR, 'hadith', 'by_book', dir, filename);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: HadithBook = JSON.parse(fileContent);
    setCache(key, data);
    return data;
}

// Permanent in-memory cache for hadith books (static data, avoids re-parsing large JSON)
const hadithBookCache = new Map<string, HadithBook>();
const hadithBookLoading = new Map<string, Promise<HadithBook>>();

export function getHadithBookCached(filename: string): Promise<HadithBook> {
    const existing = hadithBookCache.get(filename);
    if (existing) return Promise.resolve(existing);
    const pending = hadithBookLoading.get(filename);
    if (pending) return pending;

    const load = (async () => {
        const book = await getHadithBook(filename);
        hadithBookCache.set(filename, book);
        hadithBookLoading.delete(filename);
        return book;
    })();
    hadithBookLoading.set(filename, load);
    return load;
}

export async function getAllHadithBooks(): Promise<HadithBook[]> {
    const books = await getHadithBooks();
    return Promise.all(books.map(b => getHadithBookCached(b.filename)));
}

export async function getHadithChapters(filename: string): Promise<HadithChapter[]> {
    const book = await getHadithBook(filename);
    return book.chapters;
}

export async function getHadiths(filename: string, chapterId: string): Promise<Hadith[]> {
    const key = `hadiths_${filename}_${chapterId}`;
    const cached = getCached<Hadith[]>(key);
    if (cached) return cached;

    const book = await getHadithBook(filename);
    const cId = parseInt(chapterId, 10);
    const data = book.hadiths.filter(h => h.chapterId === cId);
    setCache(key, data);
    return data;
}

// Adhkar
const ADHKAR_TITLES: Record<string, { en: string; ar: string }> = {
    'azkar_sabah.json': { en: 'Morning Adhkar', ar: 'أذكار الصباح' },
    'azkar_massa.json': { en: 'Evening Adhkar', ar: 'أذكار المساء' },
    'PostPrayer_azkar.json': { en: 'Post-Prayer Adhkar', ar: 'أذكار بعد الصلاة' },
};

export async function getAdhkarCategories(): Promise<AdhkarCategory[]> {
    const key = 'adhkar_categories';
    const cached = getCached<AdhkarCategory[]>(key);
    if (cached) return cached;

    const dirPath = path.join(DATA_DIR, 'adhkar');
    const files = await fs.readdir(dirPath);

    const categories = await Promise.all(files.filter(f => f.endsWith('.json')).map(async (file) => {
        const filePath = path.join(dirPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const titles = ADHKAR_TITLES[file] || { en: data.title, ar: data.title };
        return {
            ...data,
            filename: file,
            titleEn: titles.en,
            titleAr: titles.ar,
        };
    }));

    setCache(key, categories);
    return categories;
}

export async function getAdhkar(filename: string): Promise<AdhkarCategory> {
    const key = `adhkar_${filename}`;
    const cached = getCached<AdhkarCategory>(key);
    if (cached) return cached;

    const filePath = path.join(DATA_DIR, 'adhkar', filename);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const titles = ADHKAR_TITLES[filename] || { en: data.title, ar: data.title };
    const result: AdhkarCategory = {
        ...data,
        filename,
        titleEn: titles.en,
        titleAr: titles.ar,
    };
    setCache(key, result);
    return result;
}

let namesCache: NameOfAllah[] | null = null;

export async function getNames(): Promise<NameOfAllah[]> {
    if (namesCache) return namesCache;
    const filePath = path.join(DATA_DIR, 'names.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    namesCache = JSON.parse(fileContent) as NameOfAllah[];
    return namesCache;
}
