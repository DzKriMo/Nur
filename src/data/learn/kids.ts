export interface KidsLesson {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  color: string;
  steps: {
    title: string;
    titleAr: string;
    content: string;
    contentAr: string;
    funFact?: string;
    funFactAr?: string;
  }[];
}

export const kidsLessons: KidsLesson[] = [
  {
    id: 'who-is-allah',
    title: 'Who is Allah?',
    titleAr: 'من هو الله؟',
    icon: '☪️',
    color: '#059669',
    steps: [
      {
        title: 'Allah is One',
        titleAr: 'الله واحد',
        content: 'Allah is the One who created everything — the sun, the moon, the stars, the trees, the animals, and you! Allah is One and unique. There is nothing like Him.',
        contentAr: 'الله هو من خلق كل شيء — الشمس والقمر والنجوم والشجر والحيوانات وأنت! الله واحد وفريد. لا شيء مثله.',
        funFact: 'Did you know? The word "Allah" means "The One worthy of worship" in Arabic.',
        funFactAr: 'هل تعلم؟ كلمة "الله" تعني "المعبود بحق" بالعربية.'
      },
      {
        title: 'Allah sees everything',
        titleAr: 'الله يرى كل شيء',
        content: 'Allah sees everything you do, even when no one is watching. When you do good things, Allah is happy with you. When you make a mistake, Allah still loves you — just say sorry and try again!',
        contentAr: 'الله يرى كل شيء تفعله، حتى عندما لا أحد يراك. حين تفعل أشياء جيدة، الله سعيد بك. حين تخطئ، الله يحبك أيضاً — فقط قل آسف وحاول مرة أخرى!',
        funFact: 'Allah is closer to you than your own heartbeat!',
        funFactAr: 'الله أقرب إليك من نبضات قلبك!'
      }
    ]
  },
  {
    id: 'prayer-is-fun',
    title: 'Prayer is Fun!',
    titleAr: 'الصلاة ممتعة!',
    icon: '🕌',
    color: '#7c3aed',
    steps: [
      {
        title: 'Talking to Allah',
        titleAr: 'الحديث مع الله',
        content: 'Prayer (Salah) is like talking to Allah! Five times a day, you get to talk to the Creator of everything. It\'s like having a special phone call with the most important Person in the universe!',
        contentAr: 'الصلاة مثل الحديث مع الله! خمس مرات يومياً، يمكنك التحدث مع خالق كل شيء. إنها مثل مكالمة هاتفية مع أهم شخص في الكون!',
        funFact: 'The best time to pray is when you feel happy, sad, or need help.',
        funFactAr: 'أفضل وقت للصلاة هو عندما تشعر بالسعادة أو الحزن أو تحتاج مساعدة.'
      },
      {
        title: 'Steps of Prayer',
        titleAr: 'خطوات الصلاة',
        content: '1. Stand facing Mecca\n2. Say "Allahu Akbar" (Allah is Greatest)\n3. Put your hands on your chest\n4. Say "Subhana Rabbiyal Adheem" and bow\n5. Say "Subhana Rabbiyal A\'la" and prostrate\n6. Say "Assalamu Alaikum" to finish\n\nIt\'s like a beautiful dance for Allah!',
        contentAr: '1. وقف مستقبلاً مكة\n2. قل "الله أكبر"\n3. ضع يديك على صدرك\n4. قل "سبحان ربي العظيم" واركع\n5. قل "سبحان ربي الأعلى" واسجد\n6. قل "السلام عليكم" للانتهاء\n\nإنها رقصة جميلة لله!',
        funFact: 'When you pray, all your sins are forgiven!',
        funFactAr: 'حين تصلي، تُغفر كل ذنوبك!'
      }
    ]
  },
  {
    id: 'kindness',
    title: 'Being Kind',
    titleAr: 'الطيبة',
    icon: '❤️',
    color: '#dc2626',
    steps: [
      {
        title: 'Kindness to others',
        titleAr: 'الطيبة مع الآخرين',
        content: 'Allah loves people who are kind! Smile at your friends, help your mom and dad, share your toys, and say nice words. Even a smile is charity in Islam!',
        contentAr: 'يحب الله الناس الطيبين! ابتسم لأصدقائك، ساعد أمك وأبيك، شارك لعبتك، وقل كلمات لطيفة. حتى الابتسامة صدقة في الإسلام!',
        funFact: 'The Prophet Muhammad (PBUH) was the kindest person ever!',
        funFactAr: 'كان النبي محمد صلى الله عليه وسلم أكثر الناس طيبة!'
      },
      {
        title: 'Kindness to animals',
        titleAr: 'الطيبة مع الحيوانات',
        content: 'Islam teaches us to be kind to ALL of Allah\'s creation, including animals! Feed birds, be gentle with cats and dogs, and never hurt any animal. Allah sees everything you do!',
        contentAr: 'يُعلمنا الإسلام أن نكون طيبين مع جميع مخلوقات الله بما في ذلك الحيوانات! أطعم الطيور، كن لطيفاً مع القطط والكلاب، ولا تؤذي أي حيوان. الله يرى كل شيء تفعله!',
        funFact: 'There\'s a special reward for giving water to a thirsty animal!',
        funFactAr: 'هناك أجر خاص لإعطاء الماء لحيوان عطشان!'
      }
    ]
  },
  {
    id: 'prophets',
    title: 'Cool Prophets!',
    titleAr: 'أنبياء رائعون!',
    icon: '⭐',
    color: '#d97706',
    steps: [
      {
        title: 'Prophet Muhammad (PBUH)',
        titleAr: 'النبي محمد صلى الله عليه وسلم',
        content: 'Prophet Muhammad was the last and final prophet! He was super kind, loved children, and always told the truth. He taught us how to be good Muslims and good people.',
        contentAr: 'النبي محمد صلى الله عليه وسلم كان النبي الأخير! كان طيباً جداً، يحب الأطفال، ويقول الصدق دائماً. علمنا كيف نكون مسلمين صالحين.',
        funFact: 'Prophet Muhammad had a cat named Muezza and loved cats!',
        funFactAr: 'كان للنبي محمد صلى الله عليه وسلم قطة اسمها مُعِزَّة وكان يحب القطط!'
      },
      {
        title: 'Prophet Isa (Jesus)',
        titleAr: 'النبي عيسى عليه السلام',
        content: 'Prophet Isa was born in a special way — he had no father! He could heal the sick and bring people back to life by Allah\'s permission. He was sent to guide the Children of Israel.',
        contentAr: 'وُلد النبي عيسى عليه السلام بطريقة خاصة — بدون أب! كان يشفي المرضى ويُعيد الناس للحياة بإذن الله. أُرسل لتوجيه بني إسرائيل.',
        funFact: 'Baby Isa spoke from the cradle to defend his mother!',
        funFactAr: 'نطق الطفل عيسى من المهد دفاعاً عن أمه!'
      }
    ]
  },
  {
    id: 'good-words',
    title: 'Magic Words!',
    titleAr: 'كلمات سحرية!',
    icon: '✨',
    color: '#0891b2',
    steps: [
      {
        title: 'Words Allah loves',
        titleAr: 'كلمات يحبها الله',
        content: 'Islam has special words that make Allah happy when you say them!\n\n- "Bismillah" — In the name of Allah\n- "Alhamdulillah" — Praise be to Allah\n- "SubhanAllah" — Glory be to Allah\n- "Allahu Akbar" — Allah is Greatest\n- "Astaghfirullah" — I seek forgiveness from Allah',
        contentAr: 'في الإسلام كلمات خاصة تُسعد الله حين تقولها!\n\n- "بسم الله" — باسم الله\n- "الحمد لله" — الحمد لله\n- "سبحان الله" — سبحان الله\n- "الله أكبر" — الله أكبر\n- "أستغفر الله" — أستغفر الله',
        funFact: 'Saying "Bismillah" before eating brings blessings to your food!',
        funFactAr: 'قول "بسم الله" قبل الأكل يجلب البركة لطعامك!'
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
