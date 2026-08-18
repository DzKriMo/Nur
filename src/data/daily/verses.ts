export interface DailyVerse {
    surah: string;
    surahAr: string;
    verseNum: number;
    arabic: string;
    english: string;
    reference: string;
    referenceAr: string;
}

export const dailyVerses: DailyVerse[] = [
    {
        surah: 'Al-Baqarah', surahAr: 'البقرة', verseNum: 152,
        arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
        english: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
        reference: 'Surah Al-Baqarah, Ayah 152', referenceAr: 'سورة البقرة، الآية 152',
    },
    {
        surah: 'Al-Baqarah', surahAr: 'البقرة', verseNum: 186,
        arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
        english: 'And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
        reference: 'Surah Al-Baqarah, Ayah 186', referenceAr: 'سورة البقرة، الآية 186',
    },
    {
        surah: 'Al-Baqarah', surahAr: 'البقرة', verseNum: 153,
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        english: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
        reference: 'Surah Al-Baqarah, Ayah 153', referenceAr: 'سورة البقرة، الآية 153',
    },
    {
        surah: 'Al-Baqarah', surahAr: 'البقرة', verseNum: 286,
        arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
        english: 'Allah does not burden a soul beyond that it can bear.',
        reference: 'Surah Al-Baqarah, Ayah 286', referenceAr: 'سورة البقرة، الآية 286',
    },
    {
        surah: "Ali 'Imran", surahAr: 'آل عمران', verseNum: 139,
        arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
        english: 'Do not weaken and do not grieve, for you will be superior if you are believers.',
        reference: "Surah Ali 'Imran, Ayah 139", referenceAr: 'سورة آل عمران، الآية 139',
    },
    {
        surah: 'Al-Ar\'af', surahAr: 'الأعراف', verseNum: 199,
        arabic: 'خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ',
        english: 'Take what is given freely, enjoin what is good, and turn away from the ignorant.',
        reference: 'Surah Al-A\'raf, Ayah 199', referenceAr: 'سورة الأعراف، الآية 199',
    },
    {
        surah: 'Ar-Ra\'d', surahAr: 'الرعد', verseNum: 28,
        arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        english: 'Verily, in the remembrance of Allah do hearts find rest.',
        reference: 'Surah Ar-Ra\'d, Ayah 28', referenceAr: 'سورة الرعد، الآية 28',
    },
    {
        surah: 'An-Nahl', surahAr: 'النحل', verseNum: 90,
        arabic: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ',
        english: 'Indeed, Allah orders justice and good conduct and giving to relatives.',
        reference: 'Surah An-Nahl, Ayah 90', referenceAr: 'سورة النحل، الآية 90',
    },
    {
        surah: 'Al-Kahf', surahAr: 'الكهف', verseNum: 46,
        arabic: 'الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا ۖ وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا',
        english: 'Wealth and children are the adornment of worldly life, but the enduring good deeds are better to your Lord in reward and better for hope.',
        reference: 'Surah Al-Kahf, Ayah 46', referenceAr: 'سورة الكهف، الآية 46',
    },
    {
        surah: 'Ta-Ha', surahAr: 'طه', verseNum: 14,
        arabic: 'إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
        english: 'Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.',
        reference: 'Surah Ta-Ha, Ayah 14', referenceAr: 'سورة طه، الآية 14',
    },
    {
        surah: 'Az-Zumar', surahAr: 'الزمر', verseNum: 53,
        arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
        english: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.',
        reference: 'Surah Az-Zumar, Ayah 53', referenceAr: 'سورة الزمر، الآية 53',
    },
    {
        surah: 'Al-Mulk', surahAr: 'الملك', verseNum: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
        english: 'Who created death and life to test you as to which of you is best in deed.',
        reference: 'Surah Al-Mulk, Ayah 2', referenceAr: 'سورة الملك، الآية 2',
    },
    {
        surah: 'Ash-Sharh', surahAr: 'الشرح', verseNum: 5,
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        english: 'For indeed, with hardship comes ease.',
        reference: 'Surah Ash-Sharh, Ayah 5', referenceAr: 'سورة الشرح، الآية 5',
    },
    {
        surah: 'Al-Hashr', surahAr: 'الحشر', verseNum: 22,
        arabic: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ',
        english: 'He is Allah, other than whom there is no deity.',
        reference: 'Surah Al-Hashr, Ayah 22', referenceAr: 'سورة الحشر، الآية 22',
    },
];

export function getVerseOfDay(): DailyVerse {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyVerses[dayOfYear % dailyVerses.length];
}