export interface NewConvertLesson {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  references: string[];
  referencesAr: string[];
  steps: {
    title: string;
    titleAr: string;
    content: string;
    contentAr: string;
    quiz?: {
      question: string;
      questionAr: string;
      options: { text: string; textAr: string; correct: boolean }[];
    };
  }[];
}

export const newConvertLessons: NewConvertLesson[] = [
  {
    id: 'shahada',
    title: 'The Shahada',
    titleAr: 'الشهادة',
    icon: '🕌',
    references: [
      'Quran 3:18 — "Allah bears witness that there is no deity except Him"',
      'Quran 47:19 — "Know that there is no deity except Allah"',
      'Sahih al-Bukhari 8 — Islam is built on five pillars',
      'Sahih al-Bukhari 54 — Whoever testifies that there is no deity except Allah and that Muhammad is His Messenger'
    ],
    referencesAr: [
      'القرآن 3:18 — «شهد الله أنه لا إله إلا هو»',
      'القرآن 47:19 — «فاعلم أنه لا إله إلا الله»',
      'صحيح البخاري 8 — الإسلام مبني على خمسة أركان',
      'صحيح البخاري 54 — من شهد أن لا إله إلا الله وأن محمداً رسول الله'
    ],
    steps: [
      {
        title: 'What is the Shahada?',
        titleAr: 'ما هي الشهادة؟',
        content: 'The Shahada is the declaration of faith in Islam. It is the most important pillar and the gateway to becoming Muslim. The Shahada is: "La ilaha illallah Muhammadur Rasulullah" — meaning "There is no deity worthy of worship except Allah, and Muhammad is the Messenger of Allah."',
        contentAr: 'الشهادة هي إعلان الإيمان بالإسلام. وهي أهم ركن وبوابتك لدخول الإسلام. الشهادة هي: "لا إله إلا الله محمد رسول الله" — أي لا معبود بحق إلا الله، ومحمد رسول الله.',
        quiz: {
          question: 'What does "La ilaha illallah" mean?',
          questionAr: 'ماذا تعني "لا إله إلا الله"؟',
          options: [
            { text: 'There is no deity worthy of worship except Allah', textAr: 'لا معبود بحق إلا الله', correct: true },
            { text: 'Muhammad is the Messenger of Allah', textAr: 'محمد رسول الله', correct: false },
            { text: 'There is no God at all', textAr: 'لا يوجد الله أبداً', correct: false }
          ]
        }
      },
      {
        title: 'Saying the Shahada',
        titleAr: 'قول الشهادة',
        content: 'To become Muslim, you simply need to say the Shahada sincerely and with conviction. It is recommended to say it in front of witnesses, but the most important thing is the sincerity in your heart. You can say it in Arabic or in your own language. The Shahada is: "La ilaha illallah Muhammadur Rasulullah."',
        contentAr: 'لدخول الإسلام، تحتاج فقط إلى قول الشهادة بصدق واقتناع. يُنصح بقولها أمام شاهدين، لكن الأهم هو الصدق في قلبك. يمكنك قولها بالعربية أو بلغتك. الشهادة هي: "لا إله إلا الله محمد رسول الله."'
      },
      {
        title: 'What the Shahada means',
        titleAr: 'ماذا تعني الشهادة',
        content: 'The first part "La ilaha illallah" means that only Allah deserves worship — not humans, not statues, not the sun or moon. The second part "Muhammadur Rasulullah" means that Muhammad is the final prophet sent by Allah to guide humanity. Accepting this means you accept Allah as your only God and Muhammad as His final messenger.',
        contentAr: 'الجزء الأول "لا إله إلا الله" يعني أن الله فقط يستحق العبادة — لا البشر، لا التماثيل، لا الشمس أو القمر. الجزء الثاني "محمد رسول الله" يعني أن محمد هو النبي الأخير أرسله الله لتوجيه البشرية. قبول هذا يعني أنك تقبل الله كإلهك الوحيد ومحمد كرسوله الأخير.'
      }
    ]
  },
  {
    id: 'wudu',
    title: 'Wudu (Ablution)',
    titleAr: 'الوضوء',
    icon: '💧',
    references: [
      'Quran 5:6 — "O you who have believed, when you rise to [perform] prayer, wash your faces and your forearms"',
      'Sahih al-Bukhari 158 — The Prophet\'s wudu step by step',
      'Sahih al-Bukhari 193 — Sins fall away with the water of wudu'
    ],
    referencesAr: [
      'القرآن 5:6 — «يا أيها الذين آمنوا إذا قمتم إلى الصلاة فاغسلوا وجوهكم وأيديكم»',
      'صحيح البخاري 158 — وضوء النبي صلى الله عليه وسلم خطوة بخطوة',
      'صحيح البخاري 193 — تخرج الخطايا مع ماء الوضوء'
    ],
    steps: [
      {
        title: 'What is Wudu?',
        titleAr: 'ما هو الوضوء؟',
        content: 'Wudu is the ritual purification before prayer. It involves washing specific parts of the body with clean water. It is a requirement for every prayer and helps you prepare spiritually and physically.',
        contentAr: 'الوضوء هو الطهارة قبل الصلاة. يتضمن غسل أجزاء معينة من الجسم بماء نظيف. وهو شرط لكل صلاة ويُساعدك على الاستعداد روحانياً وجسدياً.',
        quiz: {
          question: 'How many times do you wash each arm in Wudu?',
          questionAr: 'كم مرة تغسل كل يد في الوضوء؟',
          options: [
            { text: 'Once', textAr: 'مرة واحدة', correct: false },
            { text: 'Three times', textAr: 'ثلاث مرات', correct: true },
            { text: 'Seven times', textAr: 'سبع مرات', correct: false }
          ]
        }
      },
      {
        title: 'Steps of Wudu',
        titleAr: 'خطوات الوضوء',
        content: '1. Say "Bismillah" (In the name of Allah)\n2. Wash your hands three times\n3. Rinse your mouth three times\n4. Clean your nose three times\n5. Wash your face three times\n6. Wash your right arm three times, then left arm three times\n7. Wipe your head once\n8. Clean your ears once\n9. Wash your right foot three times, then left foot three times',
        contentAr: '1. قل "بسم الله"\n2. اغسل يديك ثلاث مرات\n3. مضمض فمك ثلاث مرات\n4. استنشق أنفك ثلاث مرات\n5. اغسل وجهك ثلاث مرات\n6. اغسل يدك اليمنى ثلاث مرات ثم اليسرى ثلاث مرات\n7. مسح رأسك مرة واحدة\n8. تنظيف أذنيك مرة واحدة\n9. اغسل قدمك اليمنى ثلاث مرات ثم اليسرى ثلاث مرات'
      }
    ]
  },
  {
    id: 'prayer',
    title: 'Prayer (Salah)',
    titleAr: 'الصلاة',
    icon: '🕌',
    references: [
      'Quran 2:238 — "Maintain with care the [obligatory] prayers"',
      'Quran 20:14 — "Establish prayer for My remembrance"',
      'Sahih al-Bukhari 349 — The five daily prayers were made obligatory during the Night Journey',
      'Sahih al-Bukhari 527 — The five prayers wipe away sins like a river washing away filth'
    ],
    referencesAr: [
      'القرآن 2:238 — «حافظوا على الصلوات»',
      'القرآن 20:14 — «وأقم الصلاة لذكري»',
      'صحيح البخاري 349 — فرضت الصلوات الخمس ليلة الإسراء',
      'صحيح البخاري 527 — الصلوات الخمس تكفر الذنوب كما يغسل النهر الدرن'
    ],
    steps: [
      {
        title: 'What is Salah?',
        titleAr: 'ما هي الصلاة؟',
        content: 'Salah is the five daily prayers that every Muslim must perform. It is the second pillar of Islam and a direct connection between you and Allah. Prayer keeps you mindful of Allah throughout the day.',
        contentAr: 'الصلاة هي الصلوات الخمس اليومية التي يجب على كل مسلم أداؤها. وهي الركن الثاني من أركان الإسلام وربط مباشر بينك وبين الله. تُبقيك الصلاة في ذكر الله طوال اليوم.',
        quiz: {
          question: 'How many daily prayers does a Muslim perform?',
          questionAr: 'كم صلاة يؤدي المسلم يومياً؟',
          options: [
            { text: 'Three', textAr: 'ثلاث', correct: false },
            { text: 'Five', textAr: 'خمس', correct: true },
            { text: 'Seven', textAr: 'سبع', correct: false }
          ]
        }
      },
      {
        title: 'The Five Daily Prayers',
        titleAr: 'الصلوات الخمس اليومية',
        content: '1. Fajr — Dawn prayer (2 rak\'ahs)\n2. Dhuhr — Noon prayer (4 rak\'ahs)\n3. Asr — Afternoon prayer (4 rak\'ahs)\n4. Maghrib — Sunset prayer (3 rak\'ahs)\n5. Isha — Night prayer (4 rak\'ahs)\n\nEach prayer takes about 5-10 minutes. You can pray anywhere clean.',
        contentAr: '1. الفجر — صلاة الفجر (ركعتان)\n2. الظهر — صلاة الظهر (أربع ركعات)\n3. العصر — صلاة العصر (أربع ركعات)\n4. المغرب — صلاة المغرب (ثلاث ركعات)\n5. العشاء — صلاة العشاء (أربع ركعات)\n\nتستغرق كل صلاة 5-10 دقائق. يمكنك الصلاة في أي مكان نظيف.'
      },
      {
        title: 'How to Pray',
        titleAr: 'كيفية الصلاة',
        content: '1. Face the Qibla (direction of Mecca)\n2. Say "Allahu Akbar" (Allah is Greatest)\n3. Recite Al-Fatiha and another surah\n4. Bow (Ruku) saying "Subhana Rabbiyal Adheem"\n5. Stand up saying "Sami Allahu liman hamidah"\n6. Prostrate (Sujud) saying "Subhana Rabbiyal A\'la"\n7. Sit and testify\n8. Say "Assalamu Alaikum" to finish\n\nDon\'t worry if you make mistakes — Allah knows your intention.',
        contentAr: '1. استقبل القبلة (اتجاه مكة)\n2. قل "الله أكبر"\n3. اقرأ الفاتحة وسورة أخرى\n4. اركع قائلاً "سبحان ربي العظيم"\n5. قم قائلاً "سمع الله لمن حمده"\n6. اسجد قائلاً "سبحان ربي الأعلى"\n7. اجلس وتشهد\n8. قل "السلام عليكم" للانتهاء\n\nلا تقلق لو أخطأت — الله يعلم نيتك.'
      }
    ]
  },
  {
    id: 'fasting',
    title: 'Fasting (Sawm)',
    titleAr: 'الصيام',
    icon: '🌙',
    references: [
      'Quran 2:183-185 — "O you who have believed, decreed upon you is fasting"',
      'Sahih al-Bukhari 8 — Fasting during Ramadan is one of the five pillars',
      'Sahih al-Bukhari 1901 — Whoever fasts Ramadan out of faith and seeking reward has his past sins forgiven',
      'Sahih al-Bukhari 1933 — Whoever forgets and eats while fasting, let him complete his fast'
    ],
    referencesAr: [
      'القرآن 2:183-185 — «كتب عليكم الصيام»',
      'صحيح البخاري 8 — صوم رمضان من أركان الإسلام الخمسة',
      'صحيح البخاري 1901 — من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه',
      'صحيح البخاري 1933 — من نسي وهو صائم فأكل وشرب فليتم صومه'
    ],
    steps: [
      {
        title: 'What is Sawm?',
        titleAr: 'ما هو الصيام؟',
        content: 'Sawm is fasting during the month of Ramadan, the ninth month of the Islamic calendar. Muslims abstain from food, drink, and other physical needs from dawn to sunset. Fasting teaches patience, self-discipline, and empathy for those less fortunate.',
        contentAr: 'الصيام هو الإمساك عن الطعام والشراب وسائر الحاجات الجسدية من الفجر إلى المغرب خلال شهر رمضان. يُعلم الصيام الصبر والانضباط الذاتي والتعاطف مع المحتاجين.',
        quiz: {
          question: 'When does fasting begin each day?',
          questionAr: 'متى يبدأ الصيام كل يوم؟',
          options: [
            { text: 'At sunset', textAr: 'عند الغروب', correct: false },
            { text: 'At dawn (Fajr)', textAr: 'عند الفجر', correct: true },
            { text: 'At midnight', textAr: 'في منتصف الليل', correct: false }
          ]
        }
      },
      {
        title: 'What breaks the fast?',
        titleAr: 'ما الذي يُبطل الصيام؟',
        content: 'The fast is broken by eating, drinking, or intentional vomiting. However, if you accidentally eat or drink, your fast is still valid and you should continue. If you are sick or traveling, you can make up the days later or feed a poor person.',
        contentAr: 'يُبطل الصيام بالأكل أو الشراب أو التقيؤ المتعمد. لكن لو أكلت أو شربت بالخطأ، صيامك ساري ويجب أن تستمر. لو كنت مريضاً أو مسافراً، يمكنك تعويض الأيام لاحقاً أو إطعام مسكين.',
        quiz: {
          question: 'If you accidentally eat during fasting, what should you do?',
          questionAr: 'لو أكلت بالخطأ أثناء الصيام، ماذا تفعل؟',
          options: [
            { text: 'Break your fast completely', textAr: 'أبطل صيامك تماماً', correct: false },
            { text: 'Continue fasting and make it up later', textAr: 'أكمل الصيام وعدّه لاحقاً', correct: true },
            { text: 'Do nothing', textAr: 'لا تفعل شيئاً', correct: false }
          ]
        }
      }
    ]
  },
  {
    id: 'faith',
    title: 'The Six Articles of Faith',
    titleAr: 'أركان الإيمان الستة',
    icon: '📖',
    references: [
      'Quran 4:136 — "Believe in Allah and His Messenger and the Book He sent down"',
      'Sahih al-Bukhari 50 — The hadith of Jibril: faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and Qadar',
      'Sahih al-Bukhari 4777 — The six articles of faith as explained to the angel Jibril'
    ],
    referencesAr: [
      'القرآن 4:136 — «آمنوا بالله ورسوله والكتاب الذي نزل»',
      'صحيح البخاري 50 — حديث جبريل: الإيمان أن تؤمن بالله وملائكته وكتبه ورسله واليوم الآخر والقدر',
      'صحيح البخاري 4777 — أركان الإيمان الستة كما شرحها جبريل'
    ],
    steps: [
      {
        title: 'What Muslims believe',
        titleAr: 'ما يؤمن به المسلمون',
        content: 'Every Muslim must believe in six articles of faith:\n\n1. Belief in Allah (God)\n2. Belief in the Angels\n3. Belief in the Holy Books (Quran, Torah, Bible, etc.)\n4. Belief in the Prophets (Adam, Noah, Abraham, Moses, Jesus, Muhammad, etc.)\n5. Belief in the Day of Judgment\n6. Belief in Divine Decree (Qadar) — that everything happens by Allah\'s will and knowledge',
        contentAr: 'يجب على كل مسلم الإيمان بأركان الإيمان الستة:\n\n1. الإيمان بالله\n2. الإيمان بالملائكة\n3. الإيمان بالكتب السماوية (القرآن والتوراة والإنجيل وغيرها)\n4. الإيمان بالأنبياء (آدم ونوح وإبراهيم وموسى وعيسى ومحمد عليهم السلام)\n5. الإيمان بيوم القيامة\n6. الإيمان بالقضاء والقدر — أن كل شيء يحدث بإرادة الله وعلمه',
        quiz: {
          question: 'How many articles of faith are there in Islam?',
          questionAr: 'كم ركن من أركان الإيمان في الإسلام؟',
          options: [
            { text: 'Four', textAr: 'أربعة', correct: false },
            { text: 'Six', textAr: 'ستة', correct: true },
            { text: 'Ten', textAr: 'عشرة', correct: false }
          ]
        }
      }
    ]
  }
];
