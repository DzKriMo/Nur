export interface QuranStory {
  id: string;
  title: string;
  titleAr: string;
  surah: string;
  surahAr: string;
  summary: string;
  summaryAr: string;
  fullStory: string;
  fullStoryAr: string;
  keyLessons: string[];
  keyLessonsAr: string[];
  characters: string[];
  charactersAr: string[];
  svgColor: string;
}

export const quranStories: QuranStory[] = [
  {
    id: 'creation-of-adam',
    title: 'The Creation of Adam',
    titleAr: 'خلق آدم',
    surah: 'Al-Baqarah (2:30-37)',
    surahAr: 'سورة البقرة',
    summary: 'Allah created Adam from clay, taught him the names of all things, and commanded the angels to prostrate before him.',
    summaryAr: 'خلق الله تعالى آدم من طين، وعلمه أسماء كل شيء، وأمر الملائكة بالسجود له.',
    fullStory: `When Allah informed the angels that He would place a successor (khalifah) on earth, they asked: "Will You place therein one who will cause corruption and shed blood?" Allah replied that He knows what they do not know.

Allah then created Adam from clay and fashioned him with His hands. He breathed into him of His spirit and taught him the names of all things. When He showed the names to the angels and asked them to name them, they said: "Glory be to You, we have no knowledge except what You have taught us."

Allah then commanded all the angels to prostrate before Adam. They all obeyed except Iblis (Satan), who refused out of pride, saying: "I am better than him. You created me from fire and created him from clay."

This refusal was the first act of disobedience, and Iblis was expelled from Allah's mercy. He vowed to lead Adam and his descendants astray, and Allah allowed him to try, but not to compel.

When Adam and his wife ate from the forbidden tree, they realized their mistake and repented. Allah forgave them and sent them to earth as His vicegerents, teaching them how to live and worship.`,
    fullStoryAr: `حين أخبر الله الملائكة أنه سيجعل في الأرض خليفة، سألوا: "أتجعل فيها من يفسد فيها ويسفك الدماء؟" فقال: "إني أعلم ما لا تعلمون."

خلق الله تعالى آدم من طين وشكّله بيده. نفخ فيه من روحه وعلمه أسماء كل شيء. حين أظهر الأسماء للملائكة وطلب منهم تسميتها، قالوا: "سبحانك لا علماً لنا إلا ما علّمتنا."

أمر الله جميع الملائكة بالسجود لأدم. أطاعوا جميعاً إلا إبليس (الشيطان) الذي امتنع من الكبر قائلاً: "أنا خير منه خلقتني من نار وخلقه من طين."

هذه الإشارة كانت أول عصيان، وطرد إبليس من رحمة الله. هدفه تضليل آدم وذريته، وسمح الله له بال尝试 لا بالcompulsion.

حين أكل آدم وزوجته من الشجرة المحرمة، أدركوا خطأهما وتابا.غفر لهما الله وأرسلهما إلى الأرض كخلفائه، وعلمهما كيف يعيشون ويعبدون.`,
    keyLessons: [
      'Humans were created with divine purpose',
      'Pride leads to destruction',
      'Repentance is always accepted',
      'We are all equal as descendants of Adam'
    ],
    keyLessonsAr: [
      'خُلق الإنسان بهدف إلهي',
      'الكبر يقود إلى الدمار',
      'التوبة مقبولة دائماً',
      'جميعنا متساوون كذري آدم'
    ],
    characters: ['Adam', 'Iblis (Satan)', 'The Angels'],
    charactersAr: ['آدم', 'إبليس (الشيطان)', 'الملائكة'],
    svgColor: '#059669'
  },
  {
    id: 'people-of-cave',
    title: 'The People of the Cave',
    titleAr: 'أصحاب الكهف',
    surah: 'Al-Kahf (18:9-26)',
    surahAr: 'سورة الكهف',
    summary: 'A group of young believers fled persecution and slept in a cave for over 300 years, protected by Allah.',
    summaryAr: 'مجموعة من الشباب المؤمنين هربوا من الاضطهاد وناموا في كهف لأكثر من 300 عام، محميين من الله.',
    fullStory: `In the city of Ephesus, during the reign of a tyrannical king who persecuted believers, a group of young men decided to follow the true religion. When the king threatened them, they fled to a cave to escape persecution.

Before sleeping, one of them suggested they pray to Allah for mercy and guidance. They prayed and fell into a deep sleep that Allah extended for over 300 years (some scholars say 309 years).

During their sleep, Allah protected them from the outside world. A dog accompanied them at the entrance of the cave. The people of the city debated their fate: some said they had fled, others said they would return if Allah willed.

When Allah eventually woke them, they thought they had slept only a day or part of a day. They sent one of them to buy food, and when he entered the city with his silver coin, people were amazed that the coin was from an ancient era.

The people of the cave eventually passed away, and Allah placed a sign at their resting place for people to reflect on His power and mercy.`,
    fullStoryAr: `في مدينة أفسس، خلال حكم طاغية اضطهد المؤمنين، قرر مجموعة من الشباب اتباع الدين الصحيح. حين هددهم الملك، فروا إلى كهف للهروب من الاضطهاد.

قبل النوم، اقترح أحدهم الدعاء إلى الله للرحمة والهداية. صلوا وناموا نوماً عميقاً مدد الله فيه أكثر من 300 عام (بعض العلماء يقول 309 سنوات).

أثناء نومهم، حماهم الله من العالم الخارجي. رافقهم كلب عند مدخل الكهف. ناقش أهل المدينة مصيرهم: بعضهم قال إنهم هربوا، وبعضهم قال سي عادون لو أراد الله.

حين أيقظهم الله في النهاية، ظنوا أنهم ناموا يوماً أو جزءاً من يوم. أرسلوا أحدهم لشراء الطعام، وحين دخل المدينة ب钱币 الفضة، удُundle الناس أن العملة كانت من حقبة قديمة.

توفي أهل الكهف في النهاية، وضع الله علامة في place restهم للناس للتأمل في قدرته ورحمته.`,
    keyLessons: [
      'Allah protects the faithful in times of persecution',
      'True faith requires sacrifice and courage',
      'Allah\'s power over time and death',
      'Patience and trust in Allah bring protection'
    ],
    keyLessonsAr: [
      'ينجي الله المؤمنين في أوقات الاضطهاد',
      'الإيمان الحقيقي يتطلب التضحية والشجاعة',
      'قدرة الله على الزمن والموت',
      'الصبر والثقة بالله يجلبان الحماية'
    ],
    characters: ['The Young Believers', 'The Tyrant King', 'The Dog'],
    charactersAr: ['الشباب المؤمنين', 'الملك الطاغية', 'الكلب'],
    svgColor: '#7c3aed'
  },
  {
    id: 'dhul-qarnayn',
    title: 'Dhul-Qarnayn',
    titleAr: 'ذي القرنين',
    surah: 'Al-Kahf (18:83-98)',
    surahAr: 'سورة الكهف',
    summary: 'A righteous king who traveled the world, helping people and building a barrier to protect against Gog and Magog.',
    summaryAr: 'ملك صالح سافر في العالم، مساعداً الناس وبناء حاجز لحماية من يأجوج ومأجوج.',
    fullStory: `Dhul-Qarnayn, meaning "The Two-Horned One," was a righteous king and traveler mentioned in Surah Al-Kahf. Allah gave him knowledge, power, and the means to travel to distant lands.

He traveled westward until he reached the setting place of the sun, where he found a people living near a dark sea. He offered them guidance and protection, and they thanked Allah.

He then traveled eastward until he reached the rising place of the sun, where he found a people with little protection from the sun. He helped them and treated them justly.

In his third journey, he traveled to a remote area between two mountains, where he found a people who could barely understand speech. They told him about Gog and Magog (Ya'juj and Ma'juj), who were terrorizing their land.

Dhul-Qarnayn built a massive barrier of iron and molten copper between the mountains, sealing it so thoroughly that Gog and Magog could not breach it. He said: "This is a mercy from my Lord."

The barrier will remain until the end of times, when Allah will permit Gog and Magog to emerge as one of the signs of the Day of Judgment.`,
    fullStoryAr: `ذي القرنين، أي "صاحب القرنين"، كان ملكاً صالحاً ومسافراً ورد ذكره في سورة الكهف. أعطاه الله العلم والقوة ووسائل السفر إلى أراضٍ بعيدة.

سافر غرباً حتى وصل إلى غروب الشمس، حيث وجد قوماً يعيشون قرب بحر داكن. عرض عليهم الهداية والحماية، فشكروا الله.

سافر شرقاً حتى وصل إلى شروق الشمس، حيث وجد قوماً بحماية قليلة من الشمس. ساعدهم وتعامل معهم بالعدل.

في رحلته الثالثة، سافر إلى منطقة نائية بين جبلين، حيث وجد قوماً بالكاد يفهمون الكلام. أخبروه عن يأجوج ومأجوج الذين كانوا يخيفون أرضهم.

بنى ذا القرنين حاجزاً ضخماً من الحديد والنحاس المنصهر بين الجبلين، وأحكم إغلاقه حتى لا يستطيعون اختراقه. قال: "هذا من رحمة ربي."

سيبقى الحاجز حتى نهاية الأزمنة، حين يسمح الله ليأجوج ومأجوج بالخروج كإحدى علامات يوم القيامة.`,
    keyLessons: [
      'Use power and authority for justice',
      'Help those in need regardless of their religion',
      'Trust in Allah\'s plan for protection',
      'True greatness lies in serving others'
    ],
    keyLessonsAr: [
      'استخدم القوة والسلطة للعدل',
      'ساعد المحتاجين بغض النظر عن دينهم',
      'ثق بمخطط الله للحماية',
      'العظيمة الحقيقية في خدمة الآخرين'
    ],
    characters: ['Dhul-Qarnayn', 'The People of the East', 'The People of Gog and Magog'],
    charactersAr: ['ذي القرنين', 'أهل المشرق', 'قوم يأجوج ومأجوج'],
    svgColor: '#d97706'
  },
  {
    id: 'luqman',
    title: 'Luqman\'s Advice',
    titleAr: 'وصية لقمان',
    surah: 'Luqman (31:12-19)',
    surahAr: 'سورة لقمان',
    summary: 'Luqman, a wise man, gave his son beautiful advice about faith, humility, and righteous conduct.',
    summaryAr: 'لقمان، رجل حكيم، أعطى ابنه نصيحة جميلة عن الإيمان والتواضع والconduct الصالح.',
    fullStory: `Luqman is mentioned in the Quran as a wise man who gave profound advice to his son. While not explicitly called a prophet, his wisdom is considered divinely inspired.

The advice of Luqman to his son includes some of the most beautiful moral teachings in the Quran:

First, he cautioned his son against associating partners with Allah (shirk), saying: "Indeed, associating others with Allah is great injustice."

Second, he emphasized the importance of gratitude: "O my son, be grateful for the favors of Allah."

Third, he taught about the consequences of actions: "O my son, if there is even the weight of a mustard seed in a rock or in the heavens or in the earth, Allah will bring it forth."

Fourth, he advised on proper behavior: "O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you."

Fifth, he taught humility: "Do not turn your cheek in contempt toward people, and do not walk through the earth arrogantly."

Luqman's advice encompasses the core values of Islamic ethics: monotheism, gratitude, responsibility, prayer, patience, and humility.`,
    fullStoryAr: `يُذكر لقمان في القرآن بوصفه حكيماً أعطى نصيحة عميقة لابنه. على الرغم من أنه لم يُسمى نبياً صراحةً، إلا أن حكمته تُعتبر من الإلهام الإلهي.

تتضمن وصية لقمان لابنه بعض أجمل التعاليم الأخلاقية في القرآن:

أولاً،حذر ابنه من الشرك، قائلاً: "إن الشرك لظلم عظيم."

ثانياً، أكد على أهمية الشكر: "يابني كن شكوراً لنعمة الله."

ثالثاً، علّمه عواقب الأفعال: "يابني إن كانت مثقال حبة من خردل في صخرة أو في السموات أو الأرض، يأت بها الله."

رابعاً، نصحه بالسلوك السليم: "يابني أقم الصلاة وأمر بالمعروف وانه عن المنكر واصبر على ما أصابك."

خامساً، علّمه التواضع: "ولا تصرف وجهك عن الناس ولا تمش في الأرض مرحاً."

تتعدد وصية لقمان القيم الأساسية للأخلاق الإسلامية: التوحيد والشكر والمسؤولية والصلاة والصبر والتواضع.`,
    keyLessons: [
      'Monotheism is the foundation of faith',
      'Gratitude increases blessings',
      'Every action has consequences',
      'Humility is a sign of true wisdom'
    ],
    keyLessonsAr: [
      'التوحيد أساس الإيمان',
      'الشكر يزيد البركات',
      'لكل فعل عواقب',
      'التواضع علامة الحكمة الحقيقية'
    ],
    characters: ['Luqman', 'His Son'],
    charactersAr: ['لقمان', 'ابنه'],
    svgColor: '#b45309'
  },
  {
    id: 'people-of-elephant',
    title: 'The People of the Elephant',
    titleAr: ' أصحاب الفيل',
    surah: 'Al-Fil (105)',
    surahAr: 'سورة الفيل',
    summary: 'Abrahah attacked the Kaaba with an army of elephants, but Allah destroyed them with small birds carrying stones.',
    summaryAr: 'هاجم أبرهة الكعبة بجيش من الفيلة، لكن الله دمّرهم بطيور صغيرة تحمل حجارة.',
    fullStory: `The People of the Elephant is a short but powerful surah that tells the story of Abrahah, the Christian ruler of Yemen, who attempted to destroy the Kaaba in Mecca.

Abrahah was envious of the importance of the Kaaba as a pilgrimage destination. He built a magnificent cathedral in Sana'a and tried to divert pilgrims there. When that failed, he decided to destroy the Kaaba.

He assembled a massive army that included war elephants. They marched toward Mecca. When the people of Mecca saw the approaching army, they fled to the mountains.

Abrahah's army entered Mecca, and he was about to destroy the Kaaba when Allah sent flocks of small birds (ababil) carrying stones of baked clay. The birds pelted the army, destroying it completely.

The event is mentioned in the Quran as a sign of Allah's protection of His house and as a reminder that no human power can overcome divine will.

This event is also associated with the birth year of Prophet Muhammad (PBUH), known as the "Year of the Elephant."`,
    fullStoryAr: `أصحاب الفيل سورة قصيرة لكنها قوية تروي قصة أبرهة، الحاكم المسيحي لليمن، الذي حاول تدمير الكعبة في مكة.

كان أبرهة غيوراً على أهمية الكعبة كوجهة حج. بنى كاتدرائية فخمة في صنعاء وحاول تحويل الحجاج إليها. حين فشل، قرر تدمير الكعبة.

جمع جيشاً ضخماً يشمل فيلة الحرب. ساروا نحو مكة.حين رأى أهل مكة الجيش المتقدم، فروا إلى الجبال.

دخل أبرهة جيشه مكة وكان على وشك تدمير الكعبة حين أرسل الله أسراباً من الطير الصغيرة (أبابيل) تحمل حجارة مخبأة. رمت الطير الجيش ودمّرته تماماً.

يُذكر الحدث في القرآن كعلامة على حماية الله لبيته وتذكير بأن لا قوة بشرية تقوى على تجاوز إرادة الله.

هذا الحدث يرتبط أيضاً بسنة ميلاد النبي محمد صلى الله عليه وسلم المعروفة بـ "عام الفيل".`,
    keyLessons: [
      'Allah protects His sacred places',
      'No army can overcome Allah\'s will',
      'Arrogance and envy lead to destruction',
      'Allah uses the weakest creatures to defeat the strongest'
    ],
    keyLessonsAr: [
      'ينجي الله أماكنه المقدسة',
      'لا جيش يقوى على تجاوز إرادة الله',
      'الكبر والحسد يقودان إلى الدمار',
      'يستخدم الله أضعف المخلوقات لهزيمة الأقوى'
    ],
    characters: ['Abrahah', 'The People of Mecca'],
    charactersAr: ['أبرهة', 'أهل مكة'],
    svgColor: '#dc2626'
  },
  {
    id: 'pharaoh-moses',
    title: 'Pharaoh and Moses',
    titleAr: 'فرعون وموسى',
    surah: 'Al-Qasas (28:3-43)',
    surahAr: 'سورة القصص',
    summary: 'Musa confronted Pharaoh with God\'s message, performed miracles, and led the Israelites out of Egypt through the parted Red Sea.',
    summaryAr: 'واجه موسى فرعون برسل الله، وأbow miracles، وقاد بني إسرائيل من مصر عبر البحر الأحمر الم分成.',
    fullStory: `The story of Pharaoh and Moses is one of the most dramatic in the Quran. It tells of the struggle between tyranny and faith, between oppression and liberation.

Pharaoh was a tyrannical king of Egypt who enslaved the Children of Israel and ordered the killing of all newborn boys. When Musa's mother placed him in a basket on the Nile, he was found by Pharaoh's wife and raised in the palace.

As a young man, Musa killed an Egyptian who was beating an Israelite and had to flee to Midian. There, he married and lived as a shepherd for ten years.

Allah called Musa from the fire on Mount Sinai and appointed him as a prophet. He gave him miracles: his staff turned into a serpent, and his hand glowed.

Musa and his brother Harun confronted Pharaoh with God's message. Pharaoh refused to believe and challenged Musa to a contest of magic. When Musa's staff swallowed the magicians' tricks, Pharaoh's advisors acknowledged it was from God, but Pharaoh persisted in his arrogance.

Allah sent plagues upon Egypt, and finally, when Pharaoh pursued the Israelites to the Red Sea, Musa struck the sea with his staff. It parted, allowing the Israelites to cross. When Pharaoh and his army followed, the sea closed upon them, and they drowned.

Before drowning, Pharaoh cried: "I believe that there is no deity except the One in whom the Children of Israel believe." But it was too late. Allah preserved his body as a sign for future generations.`,
    fullStoryAr: `تعد قصة فرعون وموسى من أكثر القصص درامية في القرآن. تروي الصراع بين الظلم والإيمان، بين القمع والتحرير.

كان فرعون ملكاً ظالماً في مصر استعبد بني إسرائيل وأمر بقتل جميع صغار boys.حين وضعت أمه موسى في سلة على النيل، وجدته زوجة فرعون وربّته في القصر.

كشاب، قتل موسى مصرياً كان يضرب إسرائيلياً وهرب إلى مدين. هناك تزوج وعاش راعياً لعشر سنوات.

ناداه الله من النار على جبل سيناء وعّنه نبياً. أعطاه معجزات: عصاه تحوّل to ثعبان، وتوهج يده.

واجه موسى وbrother هارون فرعون برسل الله. رفض فرعون الإيمان وتحدى موسى في مسابقة سحر.حين ابتلع عصاه tricks السحرة، أقر مستشارو فرعون أنها من الله، لكن أصرّ على كبره.

أرسل الله بلاء على مصر، وأخيراً حين طارد فرعون بني إسرائيل إلى البحر الأحمر، ضربه موسى بعصاه.شق، وسمح لبنى إسرائيل بالعبور.حين تبعهم فرعون وجيوشه، أطبق البحر عليهم وغرقوا.

قبل الغرق، صرخ فرعون: "آمنت أنه لا إله إلا الذي آمن به بنو إسرائيل." لكن فات الأوان. حفظ الله جثته كعلامة للأجيال القادمة.`,
    keyLessons: [
      'Tyranny never lasts forever',
      'Allah\'s power over all creation',
      'Faith in moments of desperation is accepted',
      'God\'s help comes at the most critical moment'
    ],
    keyLessonsAr: [
      'الظلم لا يدوم أبداً',
      'قدرة الله على كل مخلوق',
      'الإيمان في لحظات اليأس مقبول',
      'ينجي الله في أصعب اللحظات'
    ],
    characters: ['Musa (Moses)', 'Pharaoh', 'Harun (Aaron)', 'Pharaoh\'s Wife'],
    charactersAr: ['موسى', 'فرعون', 'هارون', 'زوجة فرعون'],
    svgColor: '#ea580c'
  },
  {
    id: 'solomon-bilqis',
    title: 'Solomon and the Queen of Sheba',
    titleAr: 'سليمان وملكة سبأ',
    surah: 'An-Naml (27:15-44)',
    surahAr: 'سورة النمل',
    summary: 'Sulaiman invited the Queen of Sheba to submit to Allah. She was amazed by his kingdom and accepted Islam.',
    summaryAr: 'دعا سليمان ملكة سبأ للاستسلام لله. أعجبت بمملكته وأسلمت.',
    fullStory: `Prophet Sulaiman (peace be upon him) was given wisdom, knowledge, and dominion over jinn, birds, and animals. One day, the hoopoe bird, which was part of his surveillance network, reported about the kingdom of Sheba (Saba') in Yemen.

The hoopoe told Sulaiman that the people of Sheba worshipped the sun instead of Allah, and that their queen, Bilqis, had a magnificent throne. Sulaiman sent a letter to the queen through the hoopoe, inviting her to submit to Allah.

When the queen received the letter, she called her advisors. They told her that they would fight whoever came against them. But the queen, being wise, decided to send Sulaiman a gift to assess his power.

When the gift arrived at Sulaiman's court, he was not impressed by worldly wealth. He said: "Do you help me with wealth? What Allah has given me is better than what He has given you."

Sulaiman then used his power to transfer her throne to his palace in the blink of an eye. When the queen arrived to see him, she was shown her own throne and was amazed.

When she saw the magnificent palace with its glass floor over water, she thought it was a pool and uncovered her legs. Sulaiman told her: "It is a palace made of glass." She submitted to Allah and believed in the message.

This story demonstrates that true wealth and power come from Allah, and that wisdom and faith are more valuable than any material possession.`,
    fullStoryAr: `أُعطي سليمان عليه السلام الحكمة والعلم وdominion على الجن والحيوان. ذات يوم، أبلغه الطير الهدهد عن مملكة سبأ في اليمن.

أخبره الهدهد عن قوم سبأ الذين عبدوا الشمس بدلاً من الله، وأن ملكتهم بلقيس كان لها عرش عظيم. أرسل سليمان رسالة للملكة عبر الهدهد داعياً إياها للاستسلام لله.

حين تلقت الملكة الرسالة، استشارت مستشاريها. أخبروها بأنهم سيقاومون من يهاجمهم. لكن الملكة الحكيمة قررت إرسال هدية لسليمان لتقييم قوته.

حين وصلت الهدية إلى محكمة سليمان، لم يتأثر بالثروات الدنيا. قال: "أتعجزون عن المال فما الله أعطاني خيراً مما أعطاكما."

نقل سليمان عرشها إلى قصره بلمح البصر. حين وصلت لتره، أُري عرشها وأُعجبت.

حين رأت القصر الفخم بأرضيته الزجاجية فوق الماء، ظننتها بركة وكشفت ساقيها. قال لها سليمان: "إنه قصر من الزجاج." استسلمت لله وآمنت بالرسالة.

تُظهر هذه القصة أن الثروة الحقيقية والقوة من الله، والحكمة والإيمان أكثر قيمة من أي ملكية مادية.`,
    keyLessons: [
      'True power comes from Allah',
      'Wisdom in dealing with others',
      'Wealth and material possessions are temporary',
      'Sincere guidance leads to the truth'
    ],
    keyLessonsAr: [
      'القوة الحقيقية من الله',
      'الحكمة في التعامل مع الآخرين',
      'الثروات والملكيات مؤقتة',
      'الهداية الصادقة تقود إلى الحق'
    ],
    characters: ['Sulaiman', 'Bilqis (Queen of Sheba)', 'The Hoopoe', 'Sulaiman\'s Jinn'],
    charactersAr: ['سليمان', 'بلقيس (ملكة سبأ)', 'الهدهد', 'جن سليمان'],
    svgColor: '#0891b2'
  },
  {
    id: 'yusuf-dream',
    title: 'The Story of Joseph',
    titleAr: 'قصة يوسف',
    surah: 'Yusuf (12)',
    surahAr: 'سورة يوسف',
    summary: 'Yusuf was thrown into a well by his jealous brothers, sold into slavery in Egypt, and rose to become a minister through Allah\'s wisdom.',
    summaryAr: 'ألقى إخوة يوسف الغيورون في البئر، وبُيع عبداً في مصر، و nhờ حكمة الله أصبح وزيراً.',
    fullStory: `The story of Joseph (peace be upon him) is the only complete story in the Quran, narrated from beginning to end in Surah Yusuf.

Yusuf was the son of Prophet Yaqub and the grandson of Ibrahim. He had eleven brothers who were jealous of him because he was their father's favorite. One day, Yusuf told his father about a dream he had seen: eleven stars, the sun, and the moon bowing down to him.

His brothers plotted against him and threw him into a well. A passing caravan found him and sold him in Egypt to a high-ranking official named Aziz. Yusuf grew up in Egypt and was known for his beauty and piety.

The wife of Aziz tried to seduce Yusuf, but he refused. She falsely accused him, and he was imprisoned. In prison, Yusuf interpreted dreams for his fellow prisoners. When the king of Egypt had a disturbing dream, Yusuf was brought to interpret it.

He predicted seven years of plenty followed by seven years of famine, and advised the king to store grain. The king appointed Yusuf as minister. When famine struck, Yusuf's brothers came to Egypt seeking food.

Through a series of events, Yusuf revealed his identity to them. He forgave them and said: "No blame on you today. Allah will forgive you, and He is the Most Merciful of the merciful."

The story teaches us about patience, forgiveness, and trust in Allah's plan. It is also a reminder that Allah turns evil into good for His servants.`,
    fullStoryAr: `تعد قصة يوسف عليه السلام القصة الوحيدة الكاملة في القرآن، تُروى من البداية إلى النهاية في سورة يوسف.

كان يوسف ابن يعقوب وحفيد إبراهيم. كان لديه أحد عشر أخاً كانوا يغارون منه لأنه المفضل عند أبيهم. ذات يوم، أخبر يوسف أباه عن حلم رأى فيه أحد عشر كوكباً والقمر والشمس ساجدين له.

دبر له إخوته وألقوه في البئر. وجدته قافلة وبيعته في مصر لمسؤول رفيع يُدعى عزيز. نشأ يوسف في مصر واشتُهر بجماله وتقواه.

حاولت زوجة عزيز تغوية يوسف، لكنه رفض. اتهمته زوراً فسُجن. في السجن، فسّر يوسف أحلام رفاقه. حين رأى ملك مصر حلمها مزعجاً، جُلب يوسف لتأويله.

تنبأ بسبع سنوات من الوفرة تليها سبع سنوات من القحط، ونصح الملك بتخزين الحبوب. عيّنه الملك وزيراً. حين جاء القحط، جاء إخوة يوسف إلى مصر طالبين الطعام.

من خلال سلسلة من الأحداث، كشف يوسف عن هويتهم. عفا عنهم وقال: "لا لوم عليكم اليوم يغفر الله لكم وهو أرحم الراحمين."

تُعلم القصة عن الصبر والمغفرة والثقة بمخطط الله. وهي تذكير بأن الله يحول الشر إلى خير لعباده.`,
    keyLessons: [
      'Patience through hardship leads to Allah\'s help',
      'Forgiveness is better than revenge',
      'Allah\'s plan is always perfect',
      'Modesty and piety are always rewarded'
    ],
    keyLessonsAr: [
      'الصبر عبر العسر يقود إلى نصر الله',
      'المغفرة أفضل من الانتقام',
      'مخطط الله دائماً مثالي',
      'العفة والتقوى تُكافأ دائماً'
    ],
    characters: ['Yusuf', 'Yaqub (Jacob)', 'The Brothers', 'Aziz', 'The King of Egypt'],
    charactersAr: ['يوسف', 'يعقوب', 'الإخوة', 'عزيز', 'ملك مصر'],
    svgColor: '#7c3aed'
  },
  {
    id: 'mary-jesus',
    title: 'Mary and the Birth of Isa',
    titleAr: 'ماريام وولادة عيسى',
    surah: 'Maryam (19:16-34)',
    surahAr: 'سورة مريم',
    summary: 'Allah chose Maryam above all women and blessed her with Isa without a father, a miracle from Allah.',
    summaryAr: 'اختار الله مريم فوق جميع النساء ورزقها بعيسى بدون أب، معجزة من الله.',
    fullStory: `The story of Maryam (Mary) and the birth of Isa (Jesus) is narrated beautifully in Surah Maryam and Surah Al-Imran.

Maryam was a righteous woman from the family of Imran. Her mother had dedicated her to the service of Allah before she was born. Maryam grew up in the temple, devoted to worship and prayer.

One day, while she was in her chamber, the angel Jibreel (Gabriel) appeared to her in the form of a man. She was frightened and sought refuge with Allah. Jibreel told her: "I am only a messenger of your Lord to give you a pure boy."

Maryam asked how she could have a son when no man had touched her. Jibreel replied: "So it is. Your Lord says: It is easy for Me. And We will make him a sign to the people and a mercy from Us."

When the birth pangs came upon her, she was directed to a palm tree. She cried out in pain and despair. Allah caused a stream to flow beneath her and ripe dates to fall from above. She was told to eat and drink.

When she brought the baby back to her people, they were shocked and accused her of immorality. Baby Isa spoke from the cradle: "Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet."

This story demonstrates Allah's power to create without precedent and the purity of the prophets.`,
    fullStoryAr: `تُروى قصة مريم وولادة عيسى عليه السلام بشكل جميل في سورة مريم وسورة آل عمران.

كانت مريم امرأة صديقة من آل عمران. أهدت أمهها لخدمة الله قبل ولادتها. نشأت في المعبد م devote to worship والصلاة.

ذات يوم، في محرابها، ظهر لها الملاك جبريل في شكل رجل. خافت وlseek refuge with الله. أخبرها جبريل: "إنما أنا رسول ربك لأهب لك غلاماً زكياً."

سألت كيف يمكن أن يكون لها ابن ولم يمسسها رجل. أجاب جبريل: "كذلك. ربك يقول: هو علي هين ونجعله آية للناس ورحمة منا."

حين ألمها المخاض، وجدها نخلة. نادت في الألم واليأس. جعل الله تدفقاً تحتها وتمراً ناضجاً يسقط من فوق. قيل لها كل وأشرب.

حين أحضرت الطفل إلى قومها، صُدموا واتهمتها بالفاحشة. نطق الطفل عيسى من المهد: "إني عبد الله آتاني الكتاب وجعلني نبياً."

تُظهر هذه القصة قدرة الله على الخلق بدون سبق ونقاء الأنبياء.`,
    keyLessons: [
      'Allah\'s power is beyond human comprehension',
      'The purity of the prophets is divinely protected',
      'Miracles are signs of Allah\'s power',
      'Faith and devotion bring great blessings'
    ],
    keyLessonsAr: [
      'قدرة الله تتجاوز تصور البشري',
      'نقاء الأنبياء محمي إلهياً',
      'المعجزات علامات قدرة الله',
      'الإيمان والdevotion تجلب بركات عظيمة'
    ],
    characters: ['Maryam (Mary)', 'Isa (Jesus)', 'Jibreel (Gabriel)'],
    charactersAr: ['مريم', 'عيسى', 'جبريل'],
    svgColor: '#059669'
  }
];
