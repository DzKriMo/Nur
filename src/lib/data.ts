import fs from 'fs/promises';
import path from 'path';
import { SurahMeta, SurahContent, HadithBook, AdhkarCategory, AdhkarItem, TranslationContent, HadithChapter, Hadith } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Quran
export async function getSurahs(): Promise<SurahMeta[]> {
    const filePath = path.join(DATA_DIR, 'quran', 'surah.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function getSurah(index: string): Promise<SurahContent> {
    // Pad index with leading zeros if needed, assuming file names are like surah_1.json, surah_2.json...
    // Wait, the file names are surah_1.json, surah_2.json (no padding based on list_dir output in step 12)
    // But the index in surah.json is "001".
    // So we should parse int.
    const id = parseInt(index, 10);
    const filePath = path.join(DATA_DIR, 'quran', 'surahs', `surah_${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function getTranslation(index: string, lang: 'en' | 'ar' = 'en'): Promise<TranslationContent> {
    const id = parseInt(index, 10);
    const filePath = path.join(DATA_DIR, 'translation', lang, `${lang}_translation_${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Hadith
export async function getHadithBooks(): Promise<{ id: string; name: string; filename: string }[]> {
    // Since we don't have a master list, we can list the files in the_9_books
    // Or we can hardcode them for better display names if we know them.
    // The files are: abudawud.json, ahmed.json, bukhari.json, etc.
    // Let's read the directory.
    const dirPath = path.join(DATA_DIR, 'hadith', 'by_book', 'the_9_books');
    const files = await fs.readdir(dirPath);

    // We need to read each file to get the metadata (title)
    const books = await Promise.all(files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        // Read only the first few bytes to get metadata? No, JSON.parse needs full file.
        // These files are large (Bukhari is 12MB). Reading all of them just to list books is bad.
        // Optimization: Create a lightweight index or hardcode the list.
        // For now, I'll hardcode the list based on the filenames I saw, to avoid performance hit.
        const name = file.replace('.json', '');
        return {
            id: name,
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
            filename: file
        };
    }));

    return books;
}

export async function getHadithBook(filename: string): Promise<HadithBook> {
    const filePath = path.join(DATA_DIR, 'hadith', 'by_book', 'the_9_books', filename);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function getHadithChapters(filename: string): Promise<HadithChapter[]> {
    const book = await getHadithBook(filename);
    return book.chapters;
}

export async function getHadiths(filename: string, chapterId: string): Promise<Hadith[]> {
    const book = await getHadithBook(filename);
    const cId = parseInt(chapterId, 10);
    return book.hadiths.filter(h => h.chapterId === cId);
}

// Adhkar
export async function getAdhkarCategories(): Promise<AdhkarCategory[]> {
    const dirPath = path.join(DATA_DIR, 'adhkar');
    const files = await fs.readdir(dirPath);

    const categories = await Promise.all(files.filter(f => f.endsWith('.json')).map(async (file) => {
        const filePath = path.join(dirPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return {
            ...data,
            filename: file
        };
    }));

    return categories;
}

export async function getAdhkar(filename: string): Promise<AdhkarCategory> {
    const filePath = path.join(DATA_DIR, 'adhkar', filename);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}
