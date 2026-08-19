export interface SurahMeta {
  place: string;
  type: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;
  pages: string;
  juz: {
    index: string;
    verse: {
      start: string;
      end: string;
    };
  }[];
}

export interface SurahContent {
  index: string;
  name: string;
  verse: Record<string, string>;
  count: number;
  juz: {
    index: string;
    verse: {
      start: string;
      end: string;
    };
  }[];
}

export interface TranslationContent {
  index: string | number;
  name?: string;
  verse: Record<string, string>;
  count: number;
}

export interface HadithBookMeta {
  id: number;
  length: number;
  arabic: {
    title: string;
    author: string;
    introduction: string;
  };
  english: {
    title: string;
    author: string;
    introduction: string;
  };
}

export interface HadithChapter {
  id: number;
  bookId: number;
  arabic: string;
  english: string;
}

export interface Hadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
}

export interface HadithBook {
  id: number;
  metadata: HadithBookMeta;
  chapters: HadithChapter[];
  hadiths: Hadith[];
}

export interface AdhkarItem {
  zekr: string;
  repeat: number;
  bless: string;
}

export interface AdhkarCategory {
  title: string;
  titleAr: string;
  titleEn: string;
  content: AdhkarItem[];
  filename: string;
}

export interface NameOfAllah {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export interface BookInfo {
  id: string;
  name: string;
  nameAr: string;
  filename: string;
  category: 'major' | 'forty' | 'other';
}

export interface Bookmark {
  surahId: string;
  verseNum: string;
  surahName: string;
  timestamp: number;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}
