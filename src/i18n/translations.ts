export type Language = 'en' | 'ar';

export type TranslationKey = keyof typeof translations.en;

export const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.quran': 'Quran',
        'nav.hadith': 'Hadith',
        'nav.adhkar': 'Adhkar',
        'nav.chat': 'AI Chat',
        'nav.about': 'About',

        // Home
        'home.hero.title': 'Nur Islamic App',
        'home.hero.subtitle': 'Your companion for Quran, Hadith, and Adhkar',
        'home.features.quran': 'Read & Listen to Quran',
        'home.features.hadith': 'Explore Hadith Collections',
        'home.features.adhkar': 'Daily Adhkar',
        'home.features.chat': 'Islamic AI Assistant',

        // Quran
        'quran.search': 'Search Surah...',
        'quran.chapter': 'Surah',
        'quran.verse': 'Ayah',
        'quran.juz': 'Juz',
        'quran.page': 'Page',
        'quran.revelation_place': 'Revelation Place',
        'quran.verses': 'Verses',

        // Hadith
        'hadith.search_books': 'Search Books...',
        'hadith.search_hadiths': 'Search Hadiths...',
        'hadith.book': 'Book',
        'hadith.number': 'Hadith #',
        'hadith.chapter': 'Chapter',

        // Adhkar
        'adhkar.title': 'Adhkar & Duas',
        'adhkar.count': 'Count',
        'adhkar.reset': 'Reset',

        // Common
        'common.read': 'Read',
        'common.listen': 'Listen',
        'common.back': 'Back',
        'common.loading': 'Loading...',
        'common.settings': 'Settings',
        'common.language': 'Language',
    },
    ar: {
        // Navigation
        'nav.home': 'الرئيسية',
        'nav.quran': 'القرآن الكريم',
        'nav.hadith': 'الحديث الشريف',
        'nav.adhkar': 'الأذكار',
        'nav.chat': 'المساعد الذكي',
        'nav.about': 'عن التطبيق',

        // Home
        'home.hero.title': 'تطبيق نور الإسلامي',
        'home.hero.subtitle': 'رفيقك للقرآن والحديث والأذكار',
        'home.features.quran': 'اقرأ واستمع للقرآن',
        'home.features.hadith': 'تصفح كتب الحديث',
        'home.features.adhkar': 'أذكار اليوم والليلة',
        'home.features.chat': 'المساعد الإسلامي الذكي',

        // Quran
        'quran.search': 'ابحث عن سورة...',
        'quran.chapter': 'سورة',
        'quran.verse': 'آية',
        'quran.juz': 'جزء',
        'quran.page': 'صفحة',
        'quran.revelation_place': 'مكان النزول',
        'quran.verses': 'آيات',

        // Hadith
        'hadith.search_books': 'ابحث في الكتب...',
        'hadith.search_hadiths': 'ابحث في الأحاديث...',
        'hadith.book': 'كتاب',
        'hadith.number': 'حديث رقم',
        'hadith.chapter': 'باب',

        // Adhkar
        'adhkar.title': 'الأذكار والأدعية',
        'adhkar.count': 'العدد',
        'adhkar.reset': 'إعادة تعيين',

        // Common
        'common.read': 'قراءة',
        'common.listen': 'استماع',
        'common.back': 'رجوع',
        'common.loading': 'جاري التحميل...',
        'common.settings': 'الإعدادات',
        'common.language': 'اللغة',
    }
};
