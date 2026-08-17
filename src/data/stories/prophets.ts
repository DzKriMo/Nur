export interface ProphetStory {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  quranicTitle?: string;
  quranicTitleAr?: string;
  era: string;
  eraAr: string;
  summary: string;
  summaryAr: string;
  fullStory: string;
  fullStoryAr: string;
  keyLessons: string[];
  keyLessonsAr: string[];
  relatedSurahs: string[];
  svgColor: string;
}

export const prophetsStories: ProphetStory[] = [
  {
    id: 'adam',
    name: 'Prophet Adam',
    nameAr: 'آدم عليه السلام',
    title: 'The First Human',
    titleAr: 'أول إنسان',
    era: 'Beginning of Creation',
    eraAr: 'بداية الخلق',
    summary: 'Allah created Adam (AS) from clay and breathed His spirit into him. He was the first prophet and the first human being.',
    summaryAr: 'خلق الله تعالى آدم عليه السلام من طين ونفخ فيه من روحه. وكان أول نبي وأول إنسان.',
    fullStory: `The story of Prophet Adam (peace be upon him) is one of the most profound in Islamic tradition. Allah Almighty created Adam from clay, shaping him with His own hands, and then breathed into him of His spirit.

When Allah told the angels that He was going to create a vicegerent (khalifah) on earth, they asked: "Will You place therein one who will cause corruption and shed blood?" Allah replied that He knows what they do not know.

After creating Adam, Allah taught him the names of all things and commanded the angels to prostrate before him. All angels prostrated except Iblis (Satan), who refused out of pride, saying he was created from fire while Adam was created from clay. This act of disobedience led to his expulsion.

Allah then taught Adam the words of repentance and dwelt him in Paradise with his wife Hawwa (Eve). They were given one prohibition: not to approach a certain tree. Iblis tempted them, and they both ate from it. When they realized their mistake, they repented to Allah, and He forgave them.

From Adam, Allah sent prophets and messengers to guide humanity. Adam is considered the first prophet, and his story teaches us about creation, free will, repentance, and the consequences of disobedience.`,
    fullStoryAr: `تعد قصة آدم عليه السلام من أعظم القصص في التراث الإسلامي. خلق الله تعالى آدم من طين، وشكّله بيده_handling، ثم نفخ فيه من روحه.

حين أخبر الله الملائكة أنه سيجعل في الأرض خليفة، سألوا: "أتجعل فيها من يفسد فيها ويسفك الدماء؟" فقال: "إني أعلم ما لا تعلمون."

بعد خلق آدم، علّمه الله أسماء كل شيء وأمر الملائكة بالسجود له. سجد جميع الملائكة إلا إبليس (الشيطان) الذي امتنع من الكبر، قائلاً إنه خُلق من النار بينما خلق آدم من الطين. هذا العصيان أدى إلى طرده.

ثم علّمه الله كلمات التوبة وأسكنه في الجنة مع زوجته حواء. كانت هناك حرمة واحدة: لا يقتربا من شجرة معينة. أغرىهما إبليس فأكلا منها. حين أدركوا خطأهما، تابا إلى الله فغفر لهما.

من آدم أرسل الله أنبياء ومرسلين لتوجيه البشرية. يعتبر آدم أول نبي، وتعلمنا قصته عن الخلق والإرادة الحرة والتوبة وعواقب العصيان.`,
    keyLessons: [
      'Allah created humans with dignity and purpose',
      'Pride and arrogance can lead to fall',
      'Repentance is always accepted by Allah',
      'We are all descendants of Adam, making us equal'
    ],
    keyLessonsAr: [
      'خلق الله الإنسان بكرامة وpurpose',
      'الكبر والغرور قد يؤديان إلى السقوط',
      'التوبة مقبولة دائماً عند الله',
      'جميعنا من ذرية آدم مما يجعلنا متساويين'
    ],
    relatedSurahs: ['Al-Baqarah (2:30-37)', 'Al-A\'raf (7:19-25)', 'Ta-Ha (20:115-123)'],
    svgColor: '#059669'
  },
  {
    id: 'nuh',
    name: 'Prophet Nuh',
    nameAr: 'نوح عليه السلام',
    title: 'The Ark Builder',
    titleAr: 'صاحب السفينة',
    era: '~2500 BCE (estimated)',
    eraAr: 'حوالي 2500 قبل الميلاد (تقديري)',
    summary: 'Nuh (AS) called his people to Allah for 950 years. When they refused, Allah saved him and the believers in a great ark during the Great Flood.',
    summaryAr: 'دعا نوح عليه السلام قومه إلى الله لمدة 950 عاماً. حين رفضوا، نجاه الله والمؤمنين في سفينة عظيمة خلال الطوفان العظيم.',
    fullStory: `Prophet Nuh (peace be upon him) is one of the most patient prophets in Islamic history. He was sent to a people who worshipped idols and rejected the message of monotheism.

Nuh called his people to worship Allah alone for 950 years. Despite his persistent efforts, only a few believed in him. His own wife and one of his sons disbelieved and drowned in the flood.

When all hope of his people's guidance was lost, Allah commanded Nuh to build an ark. He built it under divine guidance, and when the flood came, he took with him his family, believers, and pairs of every animal.

The ark sailed for months as water covered the earth. Eventually, the flood subsided, and the ark came to rest on Mount Judi. Nuh and the believers disembarked, and the human race continued from those who survived.

The story of Nuh teaches us about patience, perseverance in calling to truth, and Allah's power over all things.`,
    fullStoryAr: `يعد نوح عليه السلام من أصبر الأنبياء في التاريخ الإسلامي. أُرسل إلى قوم كانوا يعبدون الأصنام ويرفضون رسالة التوحيد.

دعا نوح قومه إلى عبادة الله وحده لمدة 950 عاماً. رغم جهوده المستمرة، قلّ من آمن به. زوجته وأحد أبنائه كفرا وغرقا في الطوفان.

حين ضاعت كل أمل في هداية قومه، أمره الله ببناء سفينة. بنى السفينة بإلهام إلهي، وحين جاء الطوفان، أخذ معه أسرته والمؤمنين serta من كل حيوان.

أبحرت السفينة لمدة أشهر وغطت الماء الأرض. استقرت السفينة في النهاية على جبل الجودي. نزل نوح والمؤمنين، وتكامل الجنس البشري من الناجين.

تعلمنا من قصة نوح عن الصبر والمثابرة في الدعوة إلى الحق وقدرة الله على كل شيء.`,
    keyLessons: [
      'Patience in calling to truth, even when few listen',
      'Allah saves the believers in times of trial',
      'Disobedience has severe consequences',
      'Allah\'s plan always prevails'
    ],
    keyLessonsAr: [
      'الصبر في الدعوة إلى الحق حتى لو قلّ المستمعون',
      'ينجي الله المؤمنين في أوقات الابتلاء',
      'للعصيان عواقب وخيمة',
      'مخطط الله ي.prevails دائماً'
    ],
    relatedSurahs: ['Nuh (71)', 'Hud (11:25-49)', 'Al-Mu\'minun (23:23-30)'],
    svgColor: '#0284c7'
  },
  {
    id: 'ibrahim',
    name: 'Prophet Ibrahim',
    nameAr: 'إبراهيم عليه السلام',
    title: 'The Friend of Allah',
    titleAr: 'خليل الله',
    era: '~2000 BCE (estimated)',
    eraAr: 'حوالي 2000 قبل الميلاد (تقديري)',
    summary: 'Ibrahim (AS) rejected idol worship, was thrown into fire, and built the Kaaba. He is the father of prophets and the friend of Allah.',
    summaryAr: 'رفض إبراهيم عليه السلام عبادة الأصنام، وأُلقي في النار، وبنى الكعبة. وهو أب الأنبياء وخليل الله.',
    fullStory: `Prophet Ibrahim (peace be upon him) is known as the "Friend of Allah" (Khalilullah) and is one of the greatest prophets. He is considered the patriarch of the Abrahamic faiths.

Born in Iraq, Ibrahim rejected the idol worship of his people from a young age. He questioned the stars, the moon, and the sun, concluding that none of them could be his Lord. He declared his faith in the One Creator.

When his people persisted in idolatry, Ibrahim destroyed their idols, leaving only the largest one. When confronted, he challenged them to question the largest idol, which of course could not speak. His people, enraged, threw him into fire.

Allah commanded the fire: "O fire, be coolness and safety upon Ibrahim." He emerged unharmed. This miracle increased his faith and the faith of those who witnessed it.

Ibrahim later migrated to Canaan and then to Egypt. Allah tested him with various trials, including the command to sacrifice his son Ismail. Both Ibrahim and Ismail submitted to Allah's will, but Allah replaced Ismail with a ram.

Ibrahim, along with his son Ismail, built the Kaaba in Mecca, establishing it as the first house of worship for humanity.`,
    fullStoryAr: `يُعرف إبراهيم عليه السلام بـ "خليل الله" وهو من أعظم الأنبياء. يُعتبر أبا الأديان الإبراهيمية.

وُلد في العراق ورفض عبادة الأصنام منذ صغره. سأل عن النجوم والقمر والشمس، وتوصل إلى أن لا أحد منها يمكن أن يكون ربه. أعلن إيمانه بالخالق الواحد.

حين أصرّ قومه على الشرك، دمّر آلهتهم تاركاً الأكبر. حين واجههم، طلب منهم أن يسألوا الأكبر الذي بالطبع لا يستطيع الكلام. أغضبهم فألقوه في النار.

أمر الله النار: "يا نار كوني برداً وسلاماً على إبراهيم." خرج سالماً. هذا المعجزة زادت إيمانه وإيمان من شاهدها.

هاجر إبراهيم لاحقاً إلى كنعان ثم مصر. ابتلاه الله بتجارب مختلفة، بما في ذلك أمر التضحية بابنه إسماعيل. خضعا لإرادة الله، لكن الله استبدل إسماعيل بكبش.

بنى إبراهيم مع ابنه إسماعيل الكعبة في مكة، وجعلها أول بيت معبود للبشرية.`,
    keyLessons: [
      'Questioning to find truth is a sign of wisdom',
      'Allah protects His faithful servants',
      'True faith requires complete submission to Allah',
      'Building for Allah\'s sake leaves an eternal legacy'
    ],
    keyLessonsAr: [
      'السؤال من أجل إيجاد الحقيقة علامة حكمة',
      'ينجي الله عباده المؤمنين',
      'الإيمان الحقيقي يتطلب الخضوع الكامل لإرادة الله',
      'البناء من أجل الله يترك إرثاً دائماً'
    ],
    relatedSurahs: ['Al-Baqarah (2:124-141)', 'Al-An\'am (6:74-83)', 'Ibrahim (14:35-41)', 'Al-Hajj (22:26-33)'],
    svgColor: '#d97706'
  },
  {
    id: 'ismail',
    name: 'Prophet Ismail',
    nameAr: 'إسماعيل عليه السلام',
    title: 'The Sacrifice',
    titleAr: 'ذبيح الله',
    era: '~1900 BCE (estimated)',
    eraAr: 'حوالي 1900 قبل الميلاد (تقديري)',
    summary: 'Ismail (AS) was the son of Ibrahim who was willing to be sacrificed for Allah. The Kaaba was built by his father and himself.',
    summaryAr: 'إسماعيل عليه السلام هو ابن إبراهيم الذي كان مستعداً للتضحية من أجل الله. بُنيت الكعبة من قبل أبيه وأبيه.',
    fullStory: `Prophet Ismail (peace be upon him) was the eldest son of Prophet Ibrahim and Hajjar (Hagar). His story is deeply connected to the annual Hajj pilgrimage.

When Sarah, Ibrahim's wife, could not have children, she gave Hajar to Ibrahim as a wife. Ismail was born to them. Later, Allah blessed Ibrahim and Sarah with a son, Ishaq (Isaac).

Allah tested Ibrahim with a command to leave Hajar and Ismail in the barren valley of Mecca. Hajar, desperate for water, ran between the hills of Safa and Marwa seven times. Allah then caused the well of Zamzam to spring forth from beneath Ismail's feet.

The most profound test came when Ibrahim saw in a dream that he must sacrifice Ismail. Both Ibrahim and Ismail submitted to Allah's will. As Ibrahim prepared to carry out the sacrifice, Allah called out to him and provided a ram instead.

This event is commemorated annually during Eid al-Adha, where Muslims worldwide sacrifice animals in remembrance of Ibrahim's and Ismail's devotion.

Ismail grew up in Mecca, and together with his father Ibrahim, he built the Kaaba. He is considered the ancestor of the Arab people and particularly the tribe of Quraysh.`,
    fullStoryAr: `يعد إسماعيل عليه السلام الابن الأكبر للنبي إبراهيم وهاجر. ترتبط قصته بشدة بحجMuslimsAnnual.

حين لم تستطع سارة، زوجة إبراهيم، الإنجاب، أعطتها هاجر لإبراهيم زوجة. ولد إسماعيل لهما. لاحقاً، بارك الله لإبراهيم وسارة بإسماعيل إسماعيل.

ابتلاه الله بأمر بترك هاجر وإسماعيل في وادٍ مقفر في مكة. هاجر الم Dichotomy جريت بين جبلي الصفا والمروة سبع مرات. سبب الله تعالى زمزم من تحت قدمي إسماعيل.

جاء الابتلاء الأعمق حين رأى إبراهيم في المنام أنه يجب أن يضحي بإسماعيل. خضعا لإرادة الله. حين أعد إبراهيم تنفيذ الأمر، ناداه الله وقدم له كبشاً بدلاً.

يُحتفل بهذا الحدث سنوياً في عيد الأضحى، حيث يضحي المسلمون في جميع أنحاء العالم تذكيراً بudevotion إبراهيم وإسماعيل.

نشأ إسماعيل في مكة، وقام مع أبيه ببناء الكعبة. يُعتبر سلف القبائل العربية وخاصة قريش.`,
    keyLessons: [
      'Absolute submission to Allah is the essence of faith',
      'Allah tests those He loves most',
      'Zamzam is a miracle that continues to this day',
      'Sacrifice for Allah\'s sake brings great reward'
    ],
    keyLessonsAr: [
      'الخضوع المطلق لله جوهر الإيمان',
      'يبتلى الله من يحبهم أكثر',
      'زمزم معجزة مستمرة حتى اليوم',
      'التضحية من أجل الله تجلب عظيم الأجر'
    ],
    relatedSurahs: ['Al-Baqarah (2:127-129)', 'As-Saffat (37:100-113)'],
    svgColor: '#7c3aed'
  },
  {
    id: 'lut',
    name: 'Prophet Lut',
    nameAr: 'لوط عليه السلام',
    title: 'The Messenger to the Cities',
    titleAr: 'رسول المدن',
    era: 'Time of Ibrahim',
    eraAr: 'زمن إبراهيم',
    summary: 'Lut (AS) was sent to the people of Sodom who practiced immorality. They were destroyed by a rain of stones.',
    summaryAr: 'أُرسل لوط عليه السلام إلى قوم سدوم الذين مارسوا الفسوق. دمروا بمطر من الحجارة.',
    fullStory: `Prophet Lut (peace be upon him) was the nephew of Prophet Ibrahim. He was sent to the people of the cities of Sodom and Gomorrah, who were committing terrible acts of immorality.

The people of Lut had abandoned natural relations and instead practiced lewd acts publicly. Lut warned them repeatedly, but they persisted in their evil ways. They even threatened to expel him and his family from the city.

When the angels came to Ibrahim with the news of the punishment, Lut was deeply distressed. The angels then visited Lut and informed him of the impending destruction, telling him to leave the city with his family at night and not to look back.

Allah sent upon the cities a rain of stones made of baked clay. The punishment was so severe that the cities were completely destroyed. Lut's wife, who disbelieved, perished along with the rest of the disbelievers.

Only Lut and his daughters were saved. They took refuge in a cave, and from his daughters, Lut's descendants continued.

The story of Lut is a reminder of the consequences of moral corruption and the importance of maintaining righteousness.`,
    fullStoryAr: `أُرسل لوط عليه السلام وهو ابن عم إبراهيم إلى أهل مدن سدوم وعمورة الذين كانوا يرتكبون أفعالاً فاحشة.

ترك قوم لوط العلاقات الطبيعية ومارسوا الفحشاء علناً.حذرهم لوط مراراً، لكنهم أصرّوا على طريقتهم. thậm chí هددوا بترحيله وعائلته من المدينة.

حين جاءت الملائكة لإبراهيم بنبأ العقوبة، أُصيب لوط بقلق شديد. زارت الملائكة لوط وأبلغته بال.destroy الوشيك، وأمروا ب отделه وعائلته في الليل وعدم النظر إلى الوراء.

أرسل الله على المدن مطراً من الحجارة المخبأة. كانت العقوبة بالغة الشدة فدمّرت المدن تماماً. زوجة لوط التي كفرت هلكت مع بقية الكافرين.

نجا لوط وبناته فقط. لجأوا في كهف، ومن بناته تكاملت ذرية لوط.

تذكير قصة لوط بعواقب الفساد الأخلاقي وأهمية الحفاظ على الصدق.`,
    keyLessons: [
      'Moral corruption leads to destruction',
      'Patience in delivering the message, even when rejected',
      'Allah\'s punishment is certain for persistent sinners',
      'Following divine guidance protects from destruction'
    ],
    keyLessonsAr: [
      'الفساد الأخلاقي يؤدي إلى الدمار',
      'الصبر في إيصال الرسالة حتى لو رُفضت',
      'عقوبة الله مؤكدة للمصرين على الذنوب',
      'اتباع الإلهي يحمي من الدمار'
    ],
    relatedSurahs: ['Hud (11:77-83)', 'Al-Hijr (15:61-77)', 'Ash-Shu\'ara (26:160-175)'],
    svgColor: '#dc2626'
  },
  {
    id: 'yusuf',
    name: 'Prophet Yusuf',
    nameAr: 'يوسف عليه السلام',
    title: 'The Beautiful',
    titleAr: 'الحسين',
    era: '~1700 BCE (estimated)',
    eraAr: 'حوالي 1700 قبل الميلاد (تقديري)',
    summary: 'Yusuf (AS) was thrown into a well by his brothers, sold into slavery in Egypt, and eventually became a minister. His story is the most detailed in the Quran.',
    summaryAr: 'أُلقي يوسف عليه السلام في البئر من قبل إخوته، وبُيع عبداً في مصر، وأصبح وزيراً. قصته هي التفصيلية في القرآن.',
    fullStory: `The story of Prophet Yusuf (peace be upon him) is narrated in detail in Surah Yusuf, the only surah that tells an entire story from beginning to end.

Yusuf was the son of Prophet Yaqub (Jacob). He had eleven brothers who were jealous of him because he was their father's favorite. They plotted against him and threw him into a well.

A passing caravan found Yusuf and sold him in Egypt to a high-ranking official. Yusuf grew up in Egypt and was known for his beauty and piety. The wife of his master tried to seduce him, but he refused. She falsely accused him, and he was imprisoned.

In prison, Yusuf interpreted dreams for his fellow prisoners. When the king of Egypt had a disturbing dream, Yusuf was brought to interpret it. He predicted seven years of plenty followed by seven years of famine.

Impressed, the king appointed Yusuf as minister. When famine struck, Yusuf's brothers came to Egypt seeking food. Through a series of events, Yusuf revealed his identity to them. He forgave them and said: "No blame on you today. Allah will forgive you, and He is the Most Merciful of the merciful."

The story of Yusuf teaches us about patience, forgiveness, and trust in Allah's plan.`,
    fullStoryAr: `تُروى قصة يوسف عليه السلام بالتفصيل في سورة يوسف، وهي السورة الوحيدة التي تروي قصة كاملة من البداية إلى النهاية.

كان يوسف ابن يعقوب عليه السلام. كان لديه أحد عشر أخاً وكانوا يغارون منه لأنه المفضل عند أبيهم. دبروا له وألقوه في البئر.

وجدت قافلة يوسف وبيعته في مصر لمسؤول رفيع. نشأ يوسف في مصر واشتُهر بجماله وتقواه. حاولت زوجة سيده أن تغويه، لكنه رفض. اتهمته زوجة سيده زوراً فسُجن.

في السجن، فسّر يوسف أحلام رفاقه. حين رأى ملك مصر حلمها مزعجاً، جُلب يوسف لتأويله. تنبأ بسبع سنوات من الوفرة تليها سبع سنوات من القحط.

أعجب الملك وعيّن يوسف وزيراً.حين جاء القحط، جاء إخوة يوسف إلى مصر طالبين الطعام. من خلال سلسلة من الأحداث، كشف يوسف عن هويتهم. عفا عنهم وقال: "لا لوم عليكم اليوم يغفر الله لكم وهو أرحم الراحمين."

تعلمنا من قصة يوسف عن الصبر والمغفرة والثقة بمخطط الله.`,
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
    relatedSurahs: ['Yusuf (12)'],
    svgColor: '#7c3aed'
  },
  {
    id: 'musa',
    name: 'Prophet Musa',
    nameAr: 'موسى عليه السلام',
    title: 'The Speaker to Allah',
    titleAr: 'كليم الله',
    era: '~1300 BCE (estimated)',
    eraAr: 'حوالي 1300 قبل الميلاد (تقديري)',
    summary: 'Musa (AS) was saved from Pharaoh, spoke to Allah on Mount Sinai, and led the Israelites out of Egypt with many miracles.',
    summaryAr: 'نجا موسى عليه السلام من فرعون، و北宋 Barmore مع الله على جبل سيناء، وقاد بني إسرائيل من مصر بالعديد من المعجزات.',
    fullStory: `Prophet Musa (peace be upon him) is one of the most prominent prophets in Islam, Christianity, and Judaism. He is known as "Kaluamullah" (the Speaker to Allah) because he spoke directly with Allah.

Born during a time when Pharaoh was killing newborn Israelite boys, Musa's mother placed him in a basket on the Nile. He was found by Pharaoh's wife and raised in the royal palace.

As a young man, Musa accidentally killed an Egyptian and fled to Midian. There, he married and lived as a shepherd for ten years. One day, he saw a fire on Mount Sinai and went to investigate. There, Allah spoke to him directly and appointed him as a prophet.

Allah gave Musa many miracles: his staff turned into a serpent, his hand glowed when placed on his chest, and he parted the Red Sea. He confronted Pharaoh with God's message of liberation for the Israelites.

Pharaoh refused to believe and pursued the Israelites. When they reached the Red Sea, Musa struck it with his staff, and it parted. The Israelites crossed safely, but Pharaoh and his army were drowned.

Musa led the Israelites for forty years in the wilderness, receiving the Torah and guiding them with divine law.`,
    fullStoryAr: `يعد موسى عليه السلام من أبرز الأنبياء في الإسلام والمسيحية واليهودية. يُعرف بـ "كليم الله" لأنه تحدث مباشرة مع الله.

وُلد في وقت كان فيه فرعون يقتل صغار بنى إسرائيل. وضعته أمه في سلة على النيل. وجدته زوجة فرعون وربّته في القصر الملكي.

كشاب، قتل موسى مصرياً بالخطأ وهرب إلى مدين. هناك تزوج وعاش راعياً لعشر سنوات. ذات يوم، رأى ناراً على جبل سيناء وذهب للتحقيق. هناك، تحدث الله إليه مباشرة وعّنه نبياً.

أعطاه الله معجزات كثيرة: تحوّل عصاه إلى ثعبان، يده تتوهج当他 وضعها على صدره، وشق البحر الأحمر. واجه فرعون برسل الله لتحرير بني إسرائيل.

رفض فرعون الإيمان وطارد بني إسرائيل.حين وصلوا إلى البحر الأحمر، ضربه موسى بعصاه فشق.عبر بنى إسرائيل بأمان، لكن فرعون وجيوشه غرقوا.

قاد موسى بني إسرائيل أربعين سنة في البرية، متلقياً التوراة ويوجههم بالقانون الإلهي.`,
    keyLessons: [
      'Allah chooses the unlikely for great missions',
      'Confronting tyranny with truth and divine help',
      'Miracles confirm prophethood',
      'God\'s help comes at the most critical moment'
    ],
    keyLessonsAr: [
      'يختار الله غير المتوقع للمهام العظيمة',
      'مواجهة الظلم بالحق والمساعدة الإلهية',
      'المعجزات تؤكد النبوة',
      'come help come help comes at the most critical moment'
    ],
    relatedSurahs: ['Al-Baqarah (2:51-73)', 'Ta-Ha (20:9-98)', 'Al-Qasas (28:3-43)'],
    svgColor: '#ea580c'
  },
  {
    id: 'dawud',
    name: 'Prophet Dawud',
    nameAr: 'داود عليه السلام',
    title: 'The King and Psalmist',
    titleAr: 'الملك والمرتل',
    era: '~1000 BCE (estimated)',
    eraAr: 'حوالي 1000 قبل الميلاد (تقديري)',
    summary: 'Dawud (AS) was a king, prophet, and warrior who defeated Goliath and was given the Zabur (Psalms).',
    summaryAr: 'داود عليه السلام كان ملكاً ونبياً ومحارباً هزم جالوت وأُعطي الزبور.',
    fullStory: `Prophet Dawud (peace be upon him) is one of the most beloved prophets in Islamic tradition. He was a king, prophet, warrior, and poet who was given the Zabur (Psalms) by Allah.

As a young shepherd, Dawud was called to face the giant Goliath (Jalut) in battle against the Philistines. While the seasoned soldiers of Israel trembled in fear, the young Dawud stepped forward with only a sling and five stones.

Dawud threw a stone that struck Goliath's forehead, killing him. The Philistines fled in panic, and the Israelites won a decisive victory. This event established Dawud's reputation as a brave warrior.

Allah made Dawud king and gave him the Zabur. He was known for his beautiful voice and his devotion to Allah. When he would praise Allah, the mountains and birds would join him in glorification.

Dawud was given a special gift: the ability to understand the language of birds and to shape iron with his hands. He used these gifts in the service of Allah and his people.

The story of Dawud teaches us about courage, faith, and the importance of using one's talents in the service of Allah.`,
    fullStoryAr: `يعد داود عليه السلام من أحباب الأنبياء في التراث الإسلامي. كان ملكاً ونبياً ومحارباً وشاعراً أُعطي الزبور من الله.

كراعٍ صغير، نُادِي داود لمواجهة العملاق جالوت في معركة ضد الفلسطينين. بينما ارتجف جنود إسرائيل المخضرمون من الخوف، تقدم داود الشاب بمنجاة فقط وخمس حجارة.

ألقى داود حجرة أصابت جبهة جالوت وقتلتاه. هرب الفلسطينيون في ذعر، وفاز بنو إسرائيل نصراً حاسماً. هذا الحدث أسّس لسمعة داود كمحارب شجاع.

جعله الله ملكاً وأعطاه الزبور. اشتُهر بصوته الجميل و Devotion له. حين كان يحمد الله، الجبل والطيور كانت تنضم إليه في التكبير.

أُعطي داود هدايا خاصة: فهم لغة الطيور وتشكيل الحديد بيديه. استخدم هذه الهدايا في خدمة الله وشعبه.

تعلمنا من قصة داود عن الشجاعة والإيمان وأهمية استخدام موهباتك في خدمة الله.`,
    keyLessons: [
      'Courage comes from faith in Allah',
      'Allah uses the weak to defeat the strong',
      'Gratitude and worship increase blessings',
      'Talents should be used in Allah\'s service'
    ],
    keyLessonsAr: [
      'الشجاعة تأتي من الإيمان بالله',
      'يستخدم الله الضعفاء لهزيمة الأقوياء',
      'الشكر والعبادة تزيد البركات',
      'يجب استخدام الموهبات في خدمة الله'
    ],
    relatedSurahs: ['Al-Baqarah (2:251)', 'Saad (38:17-26)', 'Al-Anbiya (21:78-80)'],
    svgColor: '#b45309'
  },
  {
    id: 'sulaiman',
    name: 'Prophet Sulaiman',
    nameAr: 'سليمان عليه السلام',
    title: 'The Wise King',
    titleAr: 'الملك الحكيم',
    era: '~950 BCE (estimated)',
    eraAr: 'حوالي 950 قبل الميلاد (تقديري)',
    summary: 'Sulaiman (AS) was given wisdom, ruled over jinn and animals, and had a magnificent kingdom. He could understand the speech of birds and ants.',
    summaryAr: 'سليمان عليه السلام أُعطي الحكمة، وحكم على الجن والحيوان، وكان له مملكة عظيمة. كان يفهم كلام الطيور والنمل.',
    fullStory: `Prophet Sulaiman (peace be upon him) was the son of Dawud and one of the most powerful prophets in terms of worldly authority. He was granted wisdom, dominion over jinn, and understanding of the speech of all creatures.

Sulaiman inherited his father's kingdom and expanded it greatly. He had a magnificent throne that was described in the Quran as being made of gold and silver, adorned with precious gems.

He commanded the jinn to build for him grand structures, palaces, and monuments. The wind was made subservient to him, blowing at his command. He had armies of humans, jinn, and birds.

One of the most famous stories about Sulaiman involves the Queen of Sheba (Bilqis). When she heard about his kingdom and wisdom, she sent him a grand gift. Sulaiman, not impressed by worldly wealth, invited her to his palace, where she saw a floor made of glass with water beneath it, thinking it was a pool.

The ant, one of the creatures Sulaiman could understand, warned its people about Sulaiman's approaching armies. This demonstrates his dominion over even the smallest creatures.

Sulaiman was also known for his wisdom in judgment. The famous story of the two women claiming the same baby, where he suggested dividing the baby in two, showcases his wisdom.

When Sulaiman died, he was standing with his staff, supporting himself. The jinn continued working, thinking he was alive, until a termite ate through his staff and he fell. This shows that even the greatest of worldly power is temporary.`,
    fullStoryAr: `يعد سليمان عليه السلام ابن داود وأقوى الأنبياء من حيث السلطة الدنيوية. أُعطي الحكمة وال dominion على الجن وفهم كلام جميع المخلوقات.

ورث سليمان مملكة أبيه ووسّعها بشكل كبير. كان له عرش عظيم وصف في القرآن بأنه مصنوع من الذهب والفضة ومزين بالأحجار الكريمة.

أمر الجن ببناء له قصور ومعالم فخمة. الرياح كانت خاضعة له وتهب بأمره. كان لديه جيوش من البشر والجن والطيور.

من أشهر القصص عن سليمان تلك المتعلقة بالملكة بلقيس (بلكيس). حين سمعت عن مملكته وحكمته، أرسلت له هدايا فخمة. سليمان الذي لم يتأثر بالثروات الدنيا، دعاها إلى قصره حيث رأت أرضاً من الزجاج بماء تحتها، وظننتها بركة.

النملة، من المخلوقات التي كان سليمان يفهمها، حذرت قومها من جيوش سليمان المتقدمة. هذا يدل على سيطرته على أصغر المخلوقات.

يُعرف سليمان أيضاً بحكمته في القضاء. القصة الشهيرة للمرأتين المتنازعتين على نفس الطفل، حيث اقترح تقسيم الطفل إلى نصفين، تُظهر حكمته.

حين مات سليمان، كان واقفاً بعصاه ي support himself. استمر الجن في العمل ظناً منهم أنه حي، حتى أكلت حشرة العصا فسقط. هذا يدل على أن حتى أعظم سلطة دنيوية مؤقتة.`,
    keyLessons: [
      'Wisdom is the greatest gift from Allah',
      'Worldly power is temporary',
      'Even the smallest creatures have value',
      'Justice and fairness are essential in leadership'
    ],
    keyLessonsAr: [
      'الحكمة أعظم هدية من الله',
      'السلطة الدنيا مؤقتة',
      'حتى أصغر المخلوقات لها قيمة',
      'العدل والأمانة ضرورية في القيادة'
    ],
    relatedSurahs: ['Al-Baqarah (2:102)', 'An-Naml (27:15-44)', 'Saad (38:30-40)'],
    svgColor: '#0891b2'
  },
  {
    id: 'yunus',
    name: 'Prophet Yunus',
    nameAr: 'يونس عليه السلام',
    title: 'The Prophet of the Whale',
    titleAr: 'نبي الحوت',
    era: '~700 BCE (estimated)',
    eraAr: 'حوالي 700 قبل الميلاد (تقديري)',
    summary: 'Yunus (AS) was swallowed by a whale after leaving his people. He repented in the whale\'s belly and was saved by Allah.',
    summaryAr: 'ابتلعه الحوت بعد مغادرته قومه. تاب في بطن الحوت ونجاه الله.',
    fullStory: `Prophet Yunus (peace be upon him), known as "Dhun-Nun" (the One of the Whale), is one of the most emotionally moving stories in the Quran.

Yunus was sent to the people of Nineveh in modern-day Iraq. He called them to worship Allah and abandon their idolatry, but they refused to listen. Frustrated, Yunus left his people without Allah's permission, warning them that punishment would come.

When Yunus left, the people of Nineveh saw signs of impending doom. They repented sincerely, and Allah accepted their repentance and spared them from punishment.

Meanwhile, Yunus boarded a ship that was caught in a terrible storm. When the sailors cast lots to throw someone overboard to lighten the ship, the lot fell on Yunus. He was thrown into the sea, where he was swallowed by a great whale.

In the belly of the whale, in complete darkness, surrounded by water on all sides, Yunus called out in despair: "There is no deity except You. Glory be to You. Indeed, I have been of the wrongdoers."

Allah heard his prayer and commanded the whale to release him. Yunus was cast onto the shore, weak and ill. Allah grew a tree to shade him and provided for him. He then sent Yunus back to his people, who now believed.

The story of Yunus teaches us that Allah's mercy is always greater than His punishment, and that sincere repentance is never rejected.`,
    fullStoryAr: `يعد يونس عليه السلام المعروف بـ "ذو النون" من أحاسس القصص في القرآن.

أُرسل يونس إلى أهل نينوى في العراق الحديث. دعاهم إلى عبادة الله وترك الشرك، لكنهم رفضوا الاستماع. غاضباً، غادر يونس قومه دون إذن الله، محذراً إياهم بأن العقوبة قادمة.

حين غادر يونس، رأى أهل نينوى علامات الدمار الوشيك. تابوا بصدق، وقبل الله توبتهم وعفا عنهم.

في هذه الأثناء، ركب يونس سفينة أصابتها عاصفة مروعة.حين ألقى البحارة القرعة لتحديد من يُلقى في البحر لتخفيف السفينة، وقعت القرعة على يونس. أُلقى في البحر حيث ابتلعه حوت عظيم.

في بطن الحوت، في ظلام تام، محاطاً بالماء من كل جانب، نادى يونس في اليأس: "لا إله إلا أنت سبحانك إني كنت من الظالمين."

سمع الله دعاءه وأمر الحوت بإطلاقه. أُلقي يونس على الشاطئ، ضعيفاً ومريضاً. نبت الله شجعة ليظله ورزقه. ثم أعاده الله إلى قومه الذين آمنوا.

تعلمنا من قصة يونس أن رحمة الله دائماً أكبر من عقابه، والتوبة الصادقة لا تُرفض أبداً.`,
    keyLessons: [
      'Allah\'s mercy is greater than His punishment',
      'Sincere repentance is always accepted',
      'We should not leave our duties without Allah\'s permission',
      'Even in the darkest moments, Allah hears our prayers'
    ],
    keyLessonsAr: [
      'رحمة الله دائماً أكبر من عقابه',
      'التوبة الصادقة مقبولة دائماً',
      'لا يجب أن نترك واجباتنا بدون إذن الله',
      'حتى في أحلك اللحظات، الله يسمع صلاتنا'
    ],
    relatedSurahs: ['Yunus (10:98)', 'Al-Anbiya (21:87-88)', 'As-Saffat (37:139-148)'],
    svgColor: '#0369a1'
  },
  {
    id: 'isa',
    name: 'Prophet Isa',
    nameAr: 'عيسى عليه السلام',
    title: 'The Word of Allah',
    titleAr: 'كلمة الله',
    era: '~4 BCE - 30 CE',
    eraAr: '4 قبل الميلاد - 30 ميلادي',
    summary: 'Isa (AS) was born to Maryam (Mary) without a father, performed miracles by Allah\'s permission, and is the Messiah.',
    summaryAr: 'عيسى عليه السلام وُلد لماريام بدون أب، وأ.perform miracles بإذن الله، وهو المسيح.',
    fullStory: `Prophet Isa (peace be upon him), known as Jesus in Christianity, is one of the most important prophets in Islam. He is referred to as "Kalimatullah" (the Word of Allah) and "Ruhullah" (the Spirit of Allah).

Isa was born to Maryam (Mary), a righteous woman chosen by Allah above all women. The story of his birth is narrated in Surah Maryam and Surah Al-Imran.

When Maryam was young and devoted to worship, the angel Jibreel (Gabriel) appeared to her and gave her the news that she would bear a son, even though no man had touched her. She was distressed and hid, but when the birth pangs came, she was directed to a palm tree.

She called out in despair, wishing she had died before this. The angel told her not to grieve and that Allah had provided a stream beneath her and a date palm above. Baby Isa spoke from the cradle, defending his mother's honor.

Isa performed many miracles by Allah's permission: healing the blind, curing lepers, raising the dead, and knowing what people had in their houses. He was given the Injeel (Gospel) to guide the Children of Israel.

The Quran emphasizes that Isa was a prophet and servant of Allah, not divine himself. He will return before the Day of Judgment to defeat the false messiah (Dajjal) and establish justice on earth.`,
    fullStoryAr: `يعد عيسى عليه السلام المعروف بيسوع في المسيحية من أهم الأنبياء في الإسلام. يُشار إليه بـ "كلمة الله" و "روح الله".

وُلد عيسى لماريام (مريم)، امرأة صديقة اختارها الله فوق جميع النساء. تُروى قصة ميلاده في سورة مريم و سورة آل عمران.

حين كانت مريم شابة م devote to worship، ظهر لها الملاك جبريل وأخبرها بأنها ستحمل ابناً رغم أنها لم يمسسها رجل. أُصيبت بالقلق واختبأت، لكن حين ألمها المخاض، وجدها نخلة.

نادت في اليأس متمنية الموت قبل هذا. أخبرها الملاك لا تحزني و[rescue] الله تدفقاً تحتك ونخلاً فوقك. نطق الطفل عيسى من المهد دفاعاً عن س母亲.

أ perform عيسى المعجزات بإذن الله: شفاء الأعمى وعلاج البرص وإحياء الموتى ومعرفة ما في بيوت الناس. أُعطي الإنجيل لتوجيه بني إسرائيل.

يؤكد القرآن أن عيسى كان نبياً وعبداً لله، لا إلهاً بنفسه. سيعود قبل يوم القيامة لهزيمة الدجال و establish العدالة على الأرض.`,
    keyLessons: [
      'Allah\'s power is beyond human comprehension',
      'Miracles are by Allah\'s permission, not by the prophet\'s own power',
      'Isa is a prophet and servant of Allah, not divine',
      'The birth of Isa shows Allah\'s ability to create without precedent'
    ],
    keyLessonsAr: [
      'قدرة الله تتجاوز تصور البشري',
      'المعجزات بإذن الله وليس بقوة النبي',
      'عيسى نبي وعبد لله لا إله',
      'ميلاد عيسى يُظهر قدرة الله على الخلق بدون سبق'
    ],
    relatedSurahs: ['Al-Imran (3:45-59)', 'Maryam (19:16-36)', 'Al-Anbiya (21:91)'],
    svgColor: '#059669'
  },
  {
    id: 'muhammad',
    name: 'Prophet Muhammad',
    nameAr: 'محمد صلى الله عليه وسلم',
    title: 'The Seal of Prophets',
    titleAr: 'خاتم الأنبياء',
    era: '570-632 CE',
    eraAr: '570-632 ميلادي',
    summary: 'Muhammad (PBUH) is the final prophet and messenger of Allah. He received the Quran through Jibreel and established the religion of Islam.',
    summaryAr: 'محمد صلى الله عليه وسلم هو النبي والرسول الأخير لله. تلقى القرآن من جبريل وأسس دين الإسلام.',
    fullStory: `Prophet Muhammad (peace and blessings be upon him) is the final prophet and messenger of Allah, sent to all of humanity. He is known as "Al-Amin" (the Trustworthy) and "Al-Mustafa" (the Chosen One).

Born in Mecca in 570 CE, Muhammad was orphaned at a young age. He grew up known for his honesty, generosity, and moral character. He worked as a shepherd and later as a merchant.

At the age of 40, while meditating in the cave of Hira, the angel Jibreel appeared to him with the first revelation: "Read in the name of your Lord who created." This marked the beginning of his prophethood.

For the first three years, Muhammad secretly called people to Islam. After receiving divine permission, he began preaching publicly. The Quraysh persecuted the early Muslims, forcing many to migrate to Abyssinia.

After 13 years of persecution in Mecca, Muhammad and his followers migrated to Medina (the Hijra), where he established the first Muslim community. He combined his roles as prophet, statesman, and military leader.

Over the next 23 years, the message of Islam spread throughout Arabia. Muhammad conquered Mecca peacefully, destroyed the idols around the Kaaba, and established the monotheistic worship of Allah.

Before his death in 632 CE, Muhammad delivered his farewell sermon, emphasizing equality, justice, and the rights of all people. He left behind the Quran as the literal word of Allah and the Sunnah as his practical example.

The story of Muhammad teaches us about the perfect character, mercy to all creation, and the importance of following divine guidance.`,
    fullStoryAr: `يعد محمد صلى الله عليه وسلم النبي والرسول الأخير لله، أُرسل إلى جميع البشرية. يُعرف بـ "الأمين" و "المصطفى".

وُلد في مكة عام 570 ميلادي وتجسس في سن صغيرة. نشأ معروفاً بصدقه وكرمه وأخلاقه. عمل راعياً ثم تاجراً.

في سن الأربعين، حين كان يتأمل في غار حراء، ظهر له الملاك جبريل بأول وحي: "اقرأ بسم ربك الذي خلق." هذا أشار إلى بداية نبوته.

في أول ثلاث سنوات، دعا محمد سراً إلى الإسلام. بعد الإذن الإلهي، بدأ ي preached publicly.اضطهدت قريش المسلمين الأوائل، مما دفع كثيرين للهجرة إلى الحبشة.

بعد 13 عاماً من الاضطهاد في مكة، هاجر محمد وأتباعه إلى المدينة (الهجرة)، حيث أسس أول مجتمع مسلم.جمع بين دوره كنبي و رجل دولة وقائد عسكري.

في الـ 23 عاماً التالية، انتشر رسالة الإسلام في جميع أنحاء الجزيرة العربية. فتح مكة بسلام ودمّر الأصنام حول الكعبة وأسس عبادة الله التوحيدية.

قبل وفاته عام 632 ميلادي، ألقى محمد خطبته الأخيرة مؤكداً على المساواة والعدالة وحقوق جميع الناس. ترك القرآن كلام الله الحرفي والسنة كمثال عملي.

تعلمنا من قصة محمد عن الكمال الأخلاقي والرحمة لكل المخلوقات وأهمية اتباع الإلهي.`,
    keyLessons: [
      'The perfect example of character and conduct',
      'Mercy to all of creation',
      'Patience and perseverance lead to victory',
      'The Quran is the final and preserved divine revelation'
    ],
    keyLessonsAr: [
      'الكمال في الأخلاق والسلوك',
      'الرحمة بكل المخلوقات',
      'الصبر والمثابرة يقودان إلى النصر',
      'القرآن هو الوحي الإلهي الأخير والمحفوظ'
    ],
    relatedSurahs: ['Al-Ahzab (33:40)', 'Al-Fath (48:1-3)', 'Al-Qalam (68:1-4)'],
    svgColor: '#16a34a'
  }
];
