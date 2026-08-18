export interface DailyHadith {
    book: string;
    bookAr: string;
    number: number;
    arabic: string;
    english: string;
    narrator?: string;
    narratorAr?: string;
}

export const dailyHadiths: DailyHadith[] = [
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 8,
        arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
        english: 'Islam is built upon five pillars: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying Zakat, performing Hajj, and fasting Ramadan.',
        narrator: 'Abdullah ibn Umar', narratorAr: 'عبد الله بن عمر',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 13,
        arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        english: 'None of you truly believes until he loves for his brother what he loves for himself.',
        narrator: 'Anas ibn Malik', narratorAr: 'أنس بن مالك',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 6114,
        arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
        english: 'The strong person is not the one who can wrestle, but the one who controls himself when angry.',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih Muslim', bookAr: 'صحيح مسلم', number: 2699,
        arabic: 'دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ',
        english: 'The supplication of a Muslim for his brother in his absence is answered.',
        narrator: 'Abu al-Darda', narratorAr: 'أبو الدرداء',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 2363,
        arabic: 'بَيْنَمَا رَجُلٌ يَمْشِي بِطَرِيقٍ اشْتَدَّ عَلَيْهِ الْعَطَشُ فَوَجَدَ بِئْرًا فَنَزَلَ فِيهَا فَشَرِبَ ثُمَّ خَرَجَ، فَإِذَا كَلْبٌ يَلْهَثُ يَأْكُلُ الثَّرَى مِنَ الْعَطَشِ، فَقَالَ: لَقَدْ بَلَغَ هَذَا مِثْلُ الَّذِي بَلَغَ بِي، فَمَلَأَ خُفَّهُ ثُمَّ أَمْسَكَهُ بِفِيهِ ثُمَّ رَقِيَ فَسَقَى الْكَلْبَ، فَشَكَرَ اللَّهُ لَهُ فَغَفَرَ لَهُ',
        english: 'While a man was walking on a road, he became very thirsty and found a well. When he came out, he saw a dog panting and eating mud from thirst. He said: "This dog has reached the same state as I did." So he filled his shoe and gave the dog water. Allah appreciated him and forgave him.',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 6464,
        arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
        english: 'The most beloved deeds to Allah are the most consistent ones, even if they are small.',
        narrator: 'Aisha', narratorAr: 'عائشة',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 7405,
        arabic: 'إِنَّ اللَّهَ قَالَ: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي',
        english: 'Allah the Almighty said: "I am as My servant thinks of Me."',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 6065,
        arabic: 'لاَ تَبَاغَضُوا وَلاَ تَحَاسَدُوا وَلاَ تَدَابَرُوا وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا',
        english: 'Do not hate one another, do not envy one another, do not turn away from one another, and be servants of Allah as brothers.',
        narrator: 'Anas ibn Malik', narratorAr: 'أنس بن مالك',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 6018,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 2989,
        arabic: 'كُلُّ مَعْرُوفٍ صَدَقَةٌ',
        english: 'Every good deed is charity.',
        narrator: 'Hudhayfa ibn al-Yaman', narratorAr: 'حذيفة بن اليمان',
    },
    {
        book: 'Sahih al-Bukhari', bookAr: 'صحيح البخاري', number: 6410,
        arabic: 'إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلاَّ وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ',
        english: 'Verily, Allah has ninety-nine names — one hundred minus one — whoever preserves them will enter Paradise.',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih Muslim', bookAr: 'صحيح مسلم', number: 1631,
        arabic: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
        english: 'When a person dies, his deeds come to an end except for three: ongoing charity, knowledge from which benefit is gained, or a righteous child who prays for him.',
        narrator: 'Abu Huraira', narratorAr: 'أبو هريرة',
    },
    {
        book: 'Sahih Muslim', bookAr: 'صحيح مسلم', number: 2999,
        arabic: 'عَجَبًا لأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
        english: 'Amazing is the affair of the believer. All of his affairs are good for him, and that is not for anyone except the believer. If ease comes to him, he is grateful and it is good for him; if hardship comes to him, he is patient and it is good for him.',
        narrator: 'Suhayb ibn Sinan', narratorAr: 'صهيب بن سنان',
    },
];

export function getHadithOfDay(): DailyHadith {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyHadiths[dayOfYear % dailyHadiths.length];
}