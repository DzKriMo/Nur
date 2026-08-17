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

export interface Verse {
  text: string;
  key: string; // e.g., "verse_1"
}

export interface SurahContent {
  index: string;
  name: string;
  verse: Record<string, string>; // verse_1: "text"
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
  index: number;
  name: string;
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
  content: AdhkarItem[];
  filename: string; // Added for internal use
}
