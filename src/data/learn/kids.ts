export interface KidsQuiz {
  question: string;
  questionAr: string;
  options: { text: string; textAr: string; correct: boolean }[];
}

export interface KidsLesson {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  color: string;
  references: string[];
  referencesAr: string[];
  steps: {
    title: string;
    titleAr: string;
    content: string;
    contentAr: string;
    funFact?: string;
    funFactAr?: string;
    quiz?: KidsQuiz;
  }[];
}

export const kidsLessons: KidsLesson[] = [
  {
    id: 'who-is-allah',
    title: 'Who is Allah?',
    titleAr: 'من هو الله؟',
    icon: '☪️',
    color: '#059669',
    references: [
      'Quran 112 — "Say: He is Allah, [who is] One"',
      'Quran 2:255 — The Verse of the Throne about Allah\'s greatness',
      'Sahih al-Bukhari 6410 — Allah has 99 names; whoever memorizes them enters Paradise'
    ],
    referencesAr: [
      'القرآن 112 — «قل هو الله أحد»',
      'القرآن 2:255 — آية الكرسي في عظمة الله',
      'صحيح البخاري 6410 — لله تسعة وتسعون اسماً من حفظها دخل الجنة'
    ],
    steps: [
      {
        title: 'Allah is One',
        titleAr: 'الله واحد',
        content: 'Allah is the One who created everything — the sun, the moon, the stars, the trees, the animals, and you! Allah is One and unique. There is nothing like Him.',
        contentAr: 'الله هو من خلق كل شيء — الشمس والقمر والنجوم والشجر والحيوانات وأنت! الله واحد وفريد. لا شيء مثله.',
        funFact: 'Did you know? The word "Allah" means "The One worthy of worship" in Arabic.',
        funFactAr: 'هل تعلم؟ كلمة "الله" تعني "المعبود بحق" بالعربية.',
        quiz: {
          question: 'How many gods are there in Islam?',
          questionAr: 'كم إلهاً في الإسلام؟',
          options: [
            { text: 'One', textAr: 'إله واحد', correct: true },
            { text: 'Two', textAr: 'إلهان', correct: false },
            { text: 'Many', textAr: 'آلهة كثيرة', correct: false }
          ]
        }
      },
      {
        title: 'Allah sees everything',
        titleAr: 'الله يرى كل شيء',
        content: 'Allah sees everything you do, even when no one is watching. When you do good things, Allah is happy with you. When you make a mistake, Allah still loves you — just say sorry and try again!',
        contentAr: 'الله يرى كل شيء تفعله، حتى عندما لا أحد يراك. حين تفعل أشياء جيدة، الله سعيد بك. حين تخطئ، الله يحبك أيضاً — فقط قل آسف وحاول مرة أخرى!',
        funFact: 'Allah is closer to you than your own heartbeat!',
        funFactAr: 'الله أقرب إليك من نبضات قلبك!',
        quiz: {
          question: 'When no one is watching you, what should you do?',
          questionAr: 'عندما لا يراك أحد، ماذا تفعل؟',
          options: [
            { text: 'Do good because Allah sees you', textAr: 'أفعل الخير لأن الله يراني', correct: true },
            { text: 'Do whatever I want', textAr: 'أفعل ما أشاء', correct: false },
            { text: 'It doesn\'t matter', textAr: 'لا يهم', correct: false }
          ]
        }
      }
    ]
  },
  {
    id: 'prayer-is-fun',
    title: 'Prayer is Fun!',
    titleAr: 'الصلاة ممتعة!',
    icon: '🕌',
    color: '#7c3aed',
    references: [
      'Quran 20:14 — "Establish prayer for My remembrance"',
      'Sahih al-Bukhari 349 — The five daily prayers were given to the Prophet during the Night Journey',
      'Sahih al-Bukhari 527 — The five prayers wipe away sins like a river washing away filth'
    ],
    referencesAr: [
      'القرآن 20:14 — «وأقم الصلاة لذكري»',
      'صحيح البخاري 349 — أُعطي النبي الصلوات الخمس ليلة الإسراء',
      'صحيح البخاري 527 — الصلوات الخمس تكفر الذنوب كما يغسل النهر الدرن'
    ],
    steps: [
      {
        title: 'Talking to Allah',
        titleAr: 'الحديث مع الله',
        content: 'Prayer (Salah) is like talking to Allah! Five times a day, you get to talk to the Creator of everything. It\'s like having a special phone call with the most important Person in the universe!',
        contentAr: 'الصلاة مثل الحديث مع الله! خمس مرات يومياً، يمكنك التحدث مع خالق كل شيء. إنها مثل مكالمة هاتفية مع أهم شخص في الكون!',
        funFact: 'You can talk to Allah at any time — when you are happy, sad, or in need of help, He is always listening.',
        funFactAr: 'يمكنك التحدث إلى الله في أي وقت — عندما تكون سعيداً أو حزيناً أو تحتاج مساعدة، فهو يسمعك دائماً.',
        quiz: {
          question: 'How many times a day do Muslims pray?',
          questionAr: 'كم مرة يصلي المسلمون في اليوم؟',
          options: [
            { text: 'Five times', textAr: 'خمس مرات', correct: true },
            { text: 'Two times', textAr: 'مرتين', correct: false },
            { text: 'One time', textAr: 'مرة واحدة', correct: false }
          ]
        }
      },
      {
        title: 'Steps of Prayer',
        titleAr: 'خطوات الصلاة',
        content: '1. Stand facing Mecca\n2. Say "Allahu Akbar" (Allah is Greatest)\n3. Put your hands on your chest\n4. Say "Subhana Rabbiyal Adheem" and bow\n5. Say "Subhana Rabbiyal A\'la" and prostrate\n6. Say "Assalamu Alaikum" to finish\n\nPraying with focus and humility is one of the most beautiful things you can do — you are standing directly before Allah, the Lord of all the worlds!',
        contentAr: '1. وقف مستقبلاً مكة\n2. قل "الله أكبر"\n3. ضع يديك على صدرك\n4. قل "سبحان ربي العظيم" واركع\n5. قل "سبحان ربي الأعلى" واسجد\n6. قل "السلام عليكم" للانتهاء\n\nالصلاة بخشوع وتركيز من أجمل الأعمال — فأنت تقف بين يدي الله رب العالمين مباشرة!',
        funFact: 'When you pray, all your sins are forgiven!',
        funFactAr: 'حين تصلي، تُغفر كل ذنوبك!',
        quiz: {
          question: 'What do we say to begin the prayer?',
          questionAr: 'ماذا نقول عند بداية الصلاة؟',
          options: [
            { text: 'Allahu Akbar', textAr: 'الله أكبر', correct: true },
            { text: 'Bismillah', textAr: 'بسم الله', correct: false },
            { text: 'Assalamu Alaikum', textAr: 'السلام عليكم', correct: false }
          ]
        }
      }
    ]
  },
  {
    id: 'kindness',
    title: 'Being Kind',
    titleAr: 'الطيبة',
    icon: '❤️',
    color: '#dc2626',
    references: [
      'Quran 4:36 — "And do good to parents, relatives, orphans, and the needy"',
      'Sahih al-Bukhari 13 — None of you truly believes until he loves for his brother what he loves for himself',
      'Sahih al-Bukhari 2363 — A man was forgiven by Allah for giving water to a thirsty dog',
      'Sahih al-Bukhari 6009 — Allah forgave a woman who gave water to a thirsty dog'
    ],
    referencesAr: [
      'القرآن 4:36 — «وبالوالدين إحساناً»',
      'صحيح البخاري 13 — لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
      'صحيح البخاري 2363 — غفر الله لرجل سقى كلباً عطشان',
      'صحيح البخاري 6009 — غفر الله لامرأة سقت كلباً عطشان'
    ],
    steps: [
      {
        title: 'Kindness to others',
        titleAr: 'الطيبة مع الآخرين',
        content: 'Allah loves people who are kind! Smile at your friends, help your mom and dad, share your toys, and say nice words. Kindness to others is a sign of true faith.',
        contentAr: 'يحب الله الناس الطيبين! ابتسم لأصدقائك، ساعد أمك وأبيك، شارك لعبتك، وقل كلمات لطيفة. الطيبة مع الآخرين علامة على الإيمان الحقيقي.',
        funFact: 'The Prophet Muhammad (PBUH) was the kindest person ever!',
        funFactAr: 'كان النبي محمد صلى الله عليه وسلم أكثر الناس طيبة!',
        quiz: {
          question: 'What is a sign of true faith?',
          questionAr: 'ما علامة الإيمان الحقيقي؟',
          options: [
            { text: 'Being kind to others', textAr: 'الطيبة مع الآخرين', correct: true },
            { text: 'Having many toys', textAr: 'امتلاك ألعاب كثيرة', correct: false },
            { text: 'Being the strongest', textAr: 'أن تكون الأقوى', correct: false }
          ]
        }
      },
      {
        title: 'Kindness to animals',
        titleAr: 'الطيبة مع الحيوانات',
        content: 'Islam teaches us to be kind to ALL of Allah\'s creation, including animals! Feed birds, be gentle with cats and dogs, and never hurt any animal. Allah sees everything you do!',
        contentAr: 'يُعلمنا الإسلام أن نكون طيبين مع جميع مخلوقات الله بما في ذلك الحيوانات! أطعم الطيور، كن لطيفاً مع القطط والكلاب، ولا تؤذي أي حيوان. الله يرى كل شيء تفعله!',
        funFact: 'There\'s a special reward for giving water to a thirsty animal!',
        funFactAr: 'هناك أجر خاص لإعطاء الماء لحيوان عطشان!',
        quiz: {
          question: 'What did the man in the story do for the thirsty dog?',
          questionAr: 'ماذا فعل الرجل في القصة للكلب العطشان؟',
          options: [
            { text: 'He gave it water', textAr: 'أعطاه الماء', correct: true },
            { text: 'He ignored it', textAr: 'تجاهله', correct: false },
            { text: 'He chased it away', textAr: 'طرده بعيداً', correct: false }
          ]
        }
      }
    ]
  },
  {
    id: 'prophets',
    title: 'Cool Prophets!',
    titleAr: 'أنبياء رائعون!',
    icon: '⭐',
    color: '#d97706',
    references: [
      'Quran 33:40 — Muhammad is the Messenger of Allah and the Seal of the Prophets',
      'Sahih al-Bukhari 3 — The first revelation to Prophet Muhammad in the cave of Hira',
      'Sahih al-Bukhari 3436 — Baby Isa spoke in the cradle, one of the three who spoke as infants'
    ],
    referencesAr: [
      'القرآن 33:40 — محمد رسول الله وخاتم النبيين',
      'صحيح البخاري 3 — أول وحي للنبي في غار حراء',
      'صحيح البخاري 3436 — تكلم عيسى في المهد، أحد الثلاثة الذين تكلموا صغاراً'
    ],
    steps: [
      {
        title: 'Prophet Muhammad (PBUH)',
        titleAr: 'النبي محمد صلى الله عليه وسلم',
        content: 'Prophet Muhammad was the last and final prophet! He was super kind, loved children, and always told the truth. He taught us how to be good Muslims and good people.',
        contentAr: 'النبي محمد صلى الله عليه وسلم كان النبي الأخير! كان طيباً جداً، يحب الأطفال، ويقول الصدق دائماً. علمنا كيف نكون مسلمين صالحين.',
        funFact: 'Prophet Muhammad loved the story of a man who was forgiven by Allah for giving water to a thirsty dog!',
        funFactAr: 'أحب النبي محمد قصة رجل غفر الله له لأنه سقى كلباً عطشان!',
        quiz: {
          question: 'Who is the last and final Prophet?',
          questionAr: 'من هو خاتم الأنبياء؟',
          options: [
            { text: 'Prophet Muhammad (PBUH)', textAr: 'النبي محمد صلى الله عليه وسلم', correct: true },
            { text: 'Prophet Adam', textAr: 'النبي آدم', correct: false },
            { text: 'Prophet Isa', textAr: 'النبي عيسى', correct: false }
          ]
        }
      },
      {
        title: 'Prophet Isa (Jesus)',
        titleAr: 'النبي عيسى عليه السلام',
        content: 'Prophet Isa was born in a special way — he had no father! He could heal the sick and bring people back to life by Allah\'s permission. He was sent to guide the Children of Israel.',
        contentAr: 'وُلد النبي عيسى عليه السلام بطريقة خاصة — بدون أب! كان يشفي المرضى ويُعيد الناس للحياة بإذن الله. أُرسل لتوجيه بني إسرائيل.',
        funFact: 'Baby Isa spoke from the cradle to defend his mother!',
        funFactAr: 'نطق الطفل عيسى من المهد دفاعاً عن أمه!',
        quiz: {
          question: 'What could Prophet Isa do by Allah\'s permission?',
          questionAr: 'ماذا كان يستطيع النبي عيسى بإذن الله؟',
          options: [
            { text: 'Heal the sick and bring back life', textAr: 'شفاء المرضى وإحياء الموتى', correct: true },
            { text: 'Fly to the moon', textAr: 'الطيران إلى القمر', correct: false },
            { text: 'Turn stone into gold', textAr: 'تحويل الحجر إلى ذهب', correct: false }
          ]
        }
      }
    ]
  },
  {
    id: 'good-words',
    title: 'Magic Words!',
    titleAr: 'كلمات سحرية!',
    icon: '✨',
    color: '#0891b2',
    references: [
      'Quran 2:152 — "Remember Me; I will remember you"',
      'Quran 7:180 — "And to Allah belong the best names"',
      'Sahih al-Bukhari 5376 — Say "Bismillah" and eat with your right hand',
      'Sahih al-Bukhari 6406 — Two words beloved to Ar-Rahman: "SubhanAllahi wa bihamdih, SubhanAllahil-Adheem"',
      'Sahih al-Bukhari 6306 — The Sayyid al-Istighfar (the master of seeking forgiveness)'
    ],
    referencesAr: [
      'القرآن 2:152 — «فاذكروني أذكركم»',
      'القرآن 7:180 — «ولله الأسماء الحسنى»',
      'صحيح البخاري 5376 — قل "بسم الله" وكل بيمينك',
      'صحيح البخاري 6406 — كلمتان حبيبتان إلى الرحمن: «سبحان الله وبحمده سبحان الله العظيم»',
      'صحيح البخاري 6306 — سيد الاستغفار'
    ],
    steps: [
      {
        title: 'Words Allah loves',
        titleAr: 'كلمات يحبها الله',
        content: 'Islam has special words that make Allah happy when you say them!\n\n- "Bismillah" — In the name of Allah\n- "Alhamdulillah" — Praise be to Allah\n- "SubhanAllah" — Glory be to Allah\n- "Allahu Akbar" — Allah is Greatest\n- "Astaghfirullah" — I seek forgiveness from Allah',
        contentAr: 'في الإسلام كلمات خاصة تُسعد الله حين تقولها!\n\n- "بسم الله" — باسم الله\n- "الحمد لله" — الحمد لله\n- "سبحان الله" — سبحان الله\n- "الله أكبر" — الله أكبر\n- "أستغفر الله" — أستغفر الله',
        funFact: 'Saying "Bismillah" before eating brings blessings to your food!',
        funFactAr: 'قول "بسم الله" قبل الأكل يجلب البركة لطعامك!',
        quiz: {
          question: 'What do we say before we start eating?',
          questionAr: 'ماذا نقول قبل أن نبدأ الأكل؟',
          options: [
            { text: 'Bismillah', textAr: 'بسم الله', correct: true },
            { text: 'Allahu Akbar', textAr: 'الله أكبر', correct: false },
            { text: 'Assalamu Alaikum', textAr: 'السلام عليكم', correct: false }
          ]
        }
      },
      {
        title: 'Kind words',
        titleAr: 'الكلام اللطيف',
        content: 'Always use kind words!\n\n- Say "Please" and "Thank you"\n- Say "Sorry" when you make a mistake\n- Say "How are you?" to show you care\n- Say "I love you for Allah\'s sake" to your Muslim friends\n\nKind words are like seeds that grow into beautiful trees of love!',
        contentAr: 'استخدم دائماً كلمات لطيفة!\n\n- قل "من فضلك" و "شكراً"\n- قل "آسف" حين تخطئ\n- قل "كيف حالك؟" لتُظهر اهتمامك\n- قل "أحبك في الله" لأصدقائك المسلمين\n\nالكلام اللطيف مثل البذور التي تنمو إلى أشجار جميلة من الحب!'
      }
    ]
  }
];