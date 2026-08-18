import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

let failures = 0;

function ok(msg) {
    console.log(`  ✓ ${msg}`);
}

function fail(msg) {
    failures++;
    console.error(`  ✗ ${msg}`);
}

async function main() {
    console.log('Verifying Nur data integrity...\n');

    // ---- Quran ----
    console.log('[Quran]');
    const meta = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'quran', 'surah.json'), 'utf-8'));
    if (meta.length === 114) ok(`surah.json has ${meta.length} surahs`);
    else fail(`surah.json has ${meta.length} surahs (expected 114)`);

    const surahDir = path.join(DATA_DIR, 'quran', 'surahs');
    const surahFiles = (await fs.readdir(surahDir)).filter(f => f.endsWith('.json'));
    if (surahFiles.length === 114) ok(`${surahFiles.length} surah content files`);
    else fail(`${surahFiles.length} surah content files (expected 114)`);

    let totalVerses = 0;
    const surahCounts = {};
    for (const file of surahFiles) {
        const s = JSON.parse(await fs.readFile(path.join(surahDir, file), 'utf-8'));
        // Verse keys are "verse_1", "verse_2", ... (verse_0 = basmalah on some surahs)
        const count = Object.keys(s.verse).filter(k => /^verse_[1-9]\d*$/.test(k)).length;
        totalVerses += count;
        const id = String(Number(file.replace('surah_', '').replace('.json', '')));
        surahCounts[id] = count;
    }
    // The total number of verses in the Quran (Hafs, excluding basmalah)
    if (totalVerses === 6236) ok(`total verses = ${totalVerses}`);
    else fail(`total verses = ${totalVerses} (expected 6236)`);

    // Spot check known surah lengths
    const expectedCounts = { '1': 7, '2': 286, '55': 78, '112': 4, '114': 6 };
    for (const [id, n] of Object.entries(expectedCounts)) {
        if (surahCounts[id] === n) ok(`surah ${id} has ${n} verses`);
        else fail(`surah ${id} has ${surahCounts[id]} verses (expected ${n})`);
    }

    // ---- Translations ----
    console.log('\n[Translations]');
    const transDir = path.join(DATA_DIR, 'translation', 'en');
    const transFiles = (await fs.readdir(transDir)).filter(f => f.endsWith('.json'));
    if (transFiles.length >= 100) ok(`${transFiles.length} English translation files`);
    else fail(`only ${transFiles.length} translation files`);

    const arTransDir = path.join(DATA_DIR, 'translation', 'ar');
    const arTransFiles = (await fs.readdir(arTransDir)).filter(f => f.endsWith('.json'));
    if (arTransFiles.length >= 100) ok(`${arTransFiles.length} Arabic tafseer files`);
    else fail(`only ${arTransFiles.length} tafseer files`);

    // ---- Hadith ----
    console.log('\n[Hadith]');
    let bookCount = 0;
    let hadithCount = 0;
    const bookDirs = ['the_9_books', 'forties', 'other_books'];
    for (const dir of bookDirs) {
        const d = path.join(DATA_DIR, 'hadith', 'by_book', dir);
        const files = (await fs.readdir(d)).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const book = JSON.parse(await fs.readFile(path.join(d, file), 'utf-8'));
            bookCount++;
            hadithCount += book.hadiths?.length || 0;
            if (!book.metadata?.arabic?.title) fail(`${file}: missing arabic title`);
        }
    }
    ok(`${bookCount} hadith books, ${hadithCount} total hadiths`);
    if (bookCount < 17) fail(`expected at least 17 books (found ${bookCount})`);

    // ---- Adhkar ----
    console.log('\n[Adhkar]');
    const adhkarDir = path.join(DATA_DIR, 'adhkar');
    const adhkarFiles = (await fs.readdir(adhkarDir)).filter(f => f.endsWith('.json'));
    for (const file of adhkarFiles) {
        const cat = JSON.parse(await fs.readFile(path.join(adhkarDir, file), 'utf-8'));
        if (Array.isArray(cat.content) && cat.content.length > 0) ok(`${file}: ${cat.content.length} items`);
        else fail(`${file}: invalid content`);
    }

    // ---- Stories & Learn & Daily (TypeScript data — verify via tsc in CI, here just check files exist) ----
    console.log('\n[Data modules]');
    const checkExists = [
        ['stories/prophets.ts', 'prophets stories data'],
        ['stories/quran.ts', 'quran stories data'],
        ['learn/kids.ts', 'kids lessons'],
        ['learn/newConvert.ts', 'new convert lessons'],
        ['daily/verses.ts', 'daily verses'],
        ['daily/hadiths.ts', 'daily hadiths'],
    ];
    for (const [rel, label] of checkExists) {
        try {
            await fs.access(path.join(DATA_DIR, rel));
            ok(`${label}`);
        } catch {
            fail(`missing ${rel}`);
        }
    }

    console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
    process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
