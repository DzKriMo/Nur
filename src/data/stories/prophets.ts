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
  hadithRefs: string[];
  hadithRefsAr: string[];
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
    summaryAr: 'خلق الله تعالى آدم عليه السلام من طين ونفخ فيه من روحه، وكان أول نبي وأول إنسان.',
    fullStory: `The story of Prophet Adam (peace be upon him) is one of the most profound in Islamic tradition. Allah Almighty created Adam from clay, shaping him with His own hands, and then breathed into him of His spirit.

When Allah told the angels that He was going to create a vicegerent (khalifah) on earth, they asked: "Will You place therein one who will cause corruption and shed blood?" Allah replied that He knows what they do not know.

After creating Adam, Allah taught him the names of all things and commanded the angels to prostrate before him. All angels prostrated except Iblis (Satan), who refused out of pride, saying he was created from fire while Adam was created from clay. This act of disobedience led to his expulsion.

Allah then taught Adam the words of repentance and dwelt him in Paradise with his wife Hawwa (Eve). They were given one prohibition: not to approach a certain tree. Iblis tempted them, and they both ate from it. When they realized their mistake, they repented to Allah, and He forgave them.

From Adam, Allah sent prophets and messengers to guide humanity. Adam is considered the first prophet, and his story teaches us about creation, free will, repentance, and the consequences of disobedience.`,
    fullStoryAr: `تعد قصة آدم عليه السلام من أعظم القصص في التراث الإسلامي. خلق الله تعالى آدم من طين وشكّله بيده، ثم نفخ فيه من روحه.

حين أخبر الله الملائكة أنه سيجعل في الأرض خليفة، سألوا: «أتجعل فيها من يفسد فيها ويسفك الدماء؟» فقال: «إني أعلم ما لا تعلمون».

بعد خلق آدم، علّمه الله أسماء كل شيء وأمر الملائكة بالسجود له، فسجد جميع الملائكة إلا إبليس الذي امتنع من الكبر، قائلاً إنه خُلق من النار بينما خُلق آدم من الطين، وهذا العصيان أدى إلى طرده من رحمة الله.

ثم علّمه الله كلمات التوبة وأسكنه في الجنة مع زوجته حواء، وكانت لهما حرمة واحدة: ألا يقتربا من شجرة معينة. فأغواهما إبليس وأكلا منها، وحين أدركا خطأهما تابا إلى الله فغفر لهما.

ومن ذرية آدم أرسل الله الأنبياء والمرسلين لتوجيه البشرية. يعتبر آدم أول نبي، وتعلمنا قصته عن الخلق والإرادة الحرة والتوبة وعواقب المعصية.`,
    keyLessons: [
      'Allah created humans with dignity and purpose',
      'Pride and arrogance can lead to fall',
      'Repentance is always accepted by Allah',
      'We are all descendants of Adam, making us equal'
    ],
    keyLessonsAr: [
      'خلق الله الإنسان بكرامة وله هدف',
      'الكبر والغرور قد يؤديان إلى السقوط',
      'التوبة مقبولة دائماً عند الله',
      'جميعنا من ذرية آدم، مما يجعلنا متساوين'
    ],
    relatedSurahs: ['Al-Baqarah (2:30-37)', 'Al-A\'raf (7:19-25)', 'Ta-Ha (20:115-123)'],
    hadithRefs: [
      'Sahih al-Bukhari 3326 — Allah created Adam 60 cubits tall and taught him to greet the angels with peace',
      'Sahih al-Bukhari 3340 — On the Day of Resurrection people first seek intercession from Adam',
      'Sahih al-Bukhari 4737 — Adam and Musa argued about pre-decree (Qadar)'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3326 — خلق الله آدم بطول ستين ذراعاً وعلّمه السلام على الملائكة',
      'صحيح البخاري 3340 — يوم القيامة يطلب الناس الشفاعة من آدم أولاً',
      'صحيح البخاري 4737 — احتجاج آدم وموسى في القدر'
    ],
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
    summaryAr: 'دعا نوح عليه السلام قومه إلى الله تسعمائة وخمسين عاماً، وحين رفضوا نجاه الله والمؤمنين في سفينة عظيمة خلال الطوفان.',
    fullStory: `Prophet Nuh (peace be upon him) is one of the most patient prophets in Islamic history. He was sent to a people who worshipped idols and rejected the message of monotheism.

Nuh called his people to worship Allah alone for 950 years. Despite his persistent efforts, only a few believed in him. His own wife and one of his sons disbelieved and drowned in the flood.

When all hope of his people's guidance was lost, Allah commanded Nuh to build an ark. He built it under divine guidance, and when the flood came, he took with him his family, believers, and pairs of every animal.

The ark sailed for months as water covered the earth. Eventually, the flood subsided, and the ark came to rest on Mount Judi. Nuh and the believers disembarked, and the human race continued from those who survived.

The story of Nuh teaches us about patience, perseverance in calling to truth, and Allah's power over all things.`,
    fullStoryAr: `يعد نوح عليه السلام من أصبر الأنبياء في التاريخ الإسلامي، أُرسل إلى قوم كانوا يعبدون الأصنام ويرفضون رسالة التوحيد.

دعا نوح قومه إلى عبادة الله وحده تسعمائة وخمسين عاماً، ورغم جهوده المستمرة قلّ من آمن به، حتى إن زوجته وأحد أبنائه كفرا وغرقا في الطوفان.

حين يئس من هداية قومه، أمره الله ببناء السفينة، فبناها بإلهام إلهي، وحين جاء الطوفان حمل معه أهله والمؤمنين ومن كل حيوان زوجين اثنين.

أبحرت السفينة شهوراً والماء يغطي الأرض، ثم انكشف الطوفان واستوت السفينة على جبل الجودي، فنزل نوح والمؤمنون وتكاثر الناس من بعدهم.

تعلمنا من قصة نوح الصبر والمثابرة في الدعوة إلى الحق، وقدرة الله على كل شيء.`,
    keyLessons: [
      'Patience in calling to truth, even when few listen',
      'Allah saves the believers in times of trial',
      'Disobedience has severe consequences',
      'Allah\'s plan always prevails'
    ],
    keyLessonsAr: [
      'الصبر في الدعوة إلى الحق حتى لو قلّ المستجيبون',
      'ينجي الله المؤمنين في أوقات الابتلاء',
      'للعصيان عواقب وخيمة',
      'مشروع الله ينتصر دائماً'
    ],
    relatedSurahs: ['Nuh (71)', 'Hud (11:25-49)', 'Al-Mu\'minun (23:23-30)'],
    hadithRefs: [
      'Sahih al-Bukhari 3340 — Nuh was the first messenger sent to the people of the earth; Allah named him a thankful slave',
      'Sahih al-Bukhari 4476 — Nuh is among the prophets people approach for intercession'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3340 — نوح أول الرسل إلى أهل الأرض، وسّمه الله عبداً شكوراً',
      'صحيح البخاري 4476 — نوح من الأنبياء الذين يطلب الناس منهم الشفاعة'
    ],
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
    summaryAr: 'رفض إبراهيم عليه السلام عبادة الأصنام وأُلقي في النار وبنى الكعبة، وهو أبو الأنبياء وخليل الله.',
    fullStory: `Prophet Ibrahim (peace be upon him) is known as the "Friend of Allah" (Khalilullah) and is one of the greatest prophets. He is considered the patriarch of the Abrahamic faiths.

Born in Iraq, Ibrahim rejected the idol worship of his people from a young age. He questioned the stars, the moon, and the sun, concluding that none of them could be his Lord. He declared his faith in the One Creator.

When his people persisted in idolatry, Ibrahim destroyed their idols, leaving only the largest one. When confronted, he challenged them to question the largest idol, which of course could not speak. His people, enraged, threw him into fire.

Allah commanded the fire: "O fire, be coolness and safety upon Ibrahim." He emerged unharmed. This miracle increased his faith and the faith of those who witnessed it.

Ibrahim later migrated to Canaan and then to Egypt. Allah tested him with various trials, including the command to sacrifice his son Ismail. Both Ibrahim and Ismail submitted to Allah's will, but Allah replaced Ismail with a ram.

Ibrahim, along with his son Ismail, built the Kaaba in Mecca, establishing it as the first house of worship for humanity.`,
    fullStoryAr: `يُعرف إبراهيم عليه السلام بـ «خليل الله»، وهو من أعظم الأنبياء ويُعتبر أبا الأديان الإبراهيمية.

وُلد في العراق ورفض عبادة الأصنام منذ صغره، فتأمل في النجوم والقمر والشمس وخلص إلى أنه لا يليق بعبادته سوى الله الواحد الأحد، فأعلن إيمانه بالخالق.

حين أصرّ قومه على الشرك، دمّر أصنامهم وترك الأكبر منها، وحين واجههم طلب منهم أن يسألوا الأكبر، وبالطبع لم يستطع الكلام، فغضبوا وألقوه في النار.

فأمر الله النار أن تكون برداً وسلاماً على إبراهيم، فخرج منها سالماً، وزادت هذه المعجزة إيمانه وإيمان من شاهدها.

هاجر إبراهيم إلى كنعان ثم إلى مصر، وابتلاه الله بتجارب عظيمة، منها أمره بالتضحية بابنه إسماعيل، فخضعا لإرادة الله، وافتدى الله إسماعيل بذبح عظيم.

بنى إبراهيم مع ابنه إسماعيل الكعبة في مكة، فجعلها أول بيت للعبادة في الأرض.`,
    keyLessons: [
      'Questioning to find truth is a sign of wisdom',
      'Allah protects His faithful servants',
      'True faith requires complete submission to Allah',
      'Building for Allah\'s sake leaves an eternal legacy'
    ],
    keyLessonsAr: [
      'البحث عن الحقيقة بالسؤال علامة من علامات الحكمة',
      'يحفظ الله عباده المؤمنين',
      'الإيمان الحقيقي يتطلب التسليم الكامل لله',
      'البناء من أجل الله يترك أثراً باقياً'
    ],
    relatedSurahs: ['Al-Baqarah (2:124-141)', 'Al-An\'am (6:74-83)', 'Ibrahim (14:35-41)', 'Al-Hajj (22:26-33)'],
    hadithRefs: [
      'Sahih al-Bukhari 3340 — Ibrahim is the Khalil (friend) of Allah; people seek his intercession on the Day of Resurrection',
      'Sahih al-Bukhari 3364 — The story of Ibrahim bringing Hajar and Ismail to Mecca and the springing of Zamzam',
      'Sahih al-Bukhari 3371 — Ibrahim used to seek refuge (for Ismail and Ishaq) with Allah\'s perfect words'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3340 — إبراهيم خليل الله، يطلب الناس شفاعته يوم القيامة',
      'صحيح البخاري 3364 — قصة مجيء إبراهيم بهاجر وإسماعيل إلى مكة وظهور زمزم',
      'صحيح البخاري 3371 — كان إبراهيم يعوّذ إسماعيل وإسحاق بكلمات الله التامة'
    ],
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
    summaryAr: 'إسماعيل عليه السلام هو ابن إبراهيم الذي استسلم للتضحية في سبيل الله، وبُنيت الكعبة على يديه مع أبيه.',
    fullStory: `Prophet Ismail (peace be upon him) was the eldest son of Prophet Ibrahim and Hajjar (Hagar). His story is deeply connected to the annual Hajj pilgrimage.

When Sarah, Ibrahim's wife, could not have children, she gave Hajar to Ibrahim as a wife. Ismail was born to them. Later, Allah blessed Ibrahim and Sarah with a son, Ishaq (Isaac).

Allah tested Ibrahim with a command to leave Hajar and Ismail in the barren valley of Mecca. Hajar, desperate for water, ran between the hills of Safa and Marwa seven times. Allah then caused the well of Zamzam to spring forth from beneath Ismail's feet.

The most profound test came when Ibrahim saw in a dream that he must sacrifice Ismail. Both Ibrahim and Ismail submitted to Allah's will. As Ibrahim prepared to carry out the sacrifice, Allah called out to him and provided a ram instead.

This event is commemorated annually during Eid al-Adha, where Muslims worldwide sacrifice animals in remembrance of Ibrahim's and Ismail's devotion.

Ismail grew up in Mecca, and together with his father Ibrahim, he built the Kaaba. He is considered the ancestor of the Arab people and particularly the tribe of Quraysh.`,
    fullStoryAr: `يعد إسماعيل عليه السلام الابن الأكبر للنبي إبراهيم وهاجر، وترتبط قصته ارتباطاً وثيقاً بمناسك الحج السنوية.

حين تأخرت سارة زوجة إبراهيم عن الإنجاب، وهبت هاجر لإبراهيم زوجةً، فولدت له إسماعيل، ثم رزق الله إبراهيم وسارة إسحاق.

ابتلى الله إبراهيم بأمره أن يترك هاجر وإسماعيل في وادٍ غير ذي زرع في مكة، فسعت هاجر بين الصفا والمروة سبع مرات تبحث عن الماء، ففجر الله عين زمزم من تحت قدمي إسماعيل.

جاء الابتلاء الأعظم حين رأى إبراهيم في المنام أنه يذبح ابنه، فخضعا معاً لأمر الله، وحين همّ إبراهيم بتنفيذ الذبح ناداه الله وفداه بكبش عظيم.

يُحتفل بهذا الحدث كل عام في عيد الأضحى، حيث يضحي المسلمون في أنحاء العالم إحياءً لذكرى طاعة إبراهيم وإسماعيل.

نشأ إسماعيل في مكة وبنى مع أبيه الكعبة، ويُعتبر سلفاً للقبائل العربية ولا سيما قريش.`,
    keyLessons: [
      'Absolute submission to Allah is the essence of faith',
      'Allah tests those He loves most',
      'Zamzam is a miracle that continues to this day',
      'Sacrifice for Allah\'s sake brings great reward'
    ],
    keyLessonsAr: [
      'التسليم المطلق لله جوهر الإيمان',
      'يبتلي الله من يحبهم أكثر',
      'زمزم معجزة مستمرة إلى اليوم',
      'التضحية في سبيل الله تجلب أجراً عظيماً'
    ],
    relatedSurahs: ['Al-Baqarah (2:127-129)', 'As-Saffat (37:100-113)'],
    hadithRefs: [
      'Sahih al-Bukhari 3364 — Hajar ran between Safa and Marwah seeking water; Zamzam sprang beneath Ismail',
      'Sahih al-Bukhari 3365 — Ibrahim and Ismail raised the foundations of the Kaaba'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3364 — سعت هاجر بين الصفا والمروة، وفجرت زمزم تحت إسماعيل',
      'صحيح البخاري 3365 — رفع إبراهيم وإسماعيل قواعد الكعبة'
    ],
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
    summaryAr: 'أُرسل لوط عليه السلام إلى قوم سدوم الذين ارتكبوا الفواحش، فدمّرهم الله بمطر من الحجارة.',
    fullStory: `Prophet Lut (peace be upon him) was the nephew of Prophet Ibrahim. He was sent to the people of the cities of Sodom and Gomorrah, who were committing terrible acts of immorality.

The people of Lut had abandoned natural relations and instead practiced lewd acts publicly. Lut warned them repeatedly, but they persisted in their evil ways. They even threatened to expel him and his family from the city.

When the angels came to Ibrahim with the news of the punishment, Lut was deeply distressed. The angels then visited Lut and informed him of the impending destruction, telling him to leave the city with his family at night and not to look back.

Allah sent upon the cities a rain of stones made of baked clay. The punishment was so severe that the cities were completely destroyed. Lut's wife, who disbelieved, perished along with the rest of the disbelievers.

Only Lut and his daughters were saved. They took refuge in a cave, and from his daughters, Lut's descendants continued.

The story of Lut is a reminder of the consequences of moral corruption and the importance of maintaining righteousness.`,
    fullStoryAr: `أُرسل لوط عليه السلام وهو ابن أخي إبراهيم إلى أهل مدينتي سدوم وعمورة الذين كانوا يرتكبون أفعالاً فاحشة شنعاء.

ترك قوم لوط الفطرة السليمة ومارسوا الفاحشة علناً، فحذّرهم لوط مراراً، لكنهم أصروا على طريقهم، بل هددوه بطرده هو وأهله من المدينة.

حين بشّرت الملائكة إبراهيم بالعذاب، حزن لوط حزناً شديداً، ثم زارته الملائكة وأخبرته بالعذاب الوشيك، وأمرته أن يخرج بأهله ليلاً وألا يلتفت أحد منهم.

أنزل الله على المدن مطراً من حجارة من سجيل، فكان العذاب أليماً ودمّرت المدن تماماً، وهلكت زوجة لوط الكافرة مع الكافرين.

نجا لوط وبناته فقط، ولجأوا إلى كهف، ومن بناته تكاثرت ذريته.

قصة لوط تذكير بعواقب الفساد الأخلاقي وأهمية التمسك بالاستقامة.`,
    keyLessons: [
      'Moral corruption leads to destruction',
      'Patience in delivering the message, even when rejected',
      'Allah\'s punishment is certain for persistent sinners',
      'Following divine guidance protects from destruction'
    ],
    keyLessonsAr: [
      'الفساد الأخلاقي يؤدي إلى الدمار',
      'الصبر في تبليغ الرسالة حتى مع الرفض',
      'عقاب الله محقق للمصرين على الذنوب',
      'اتباع الهدى يحفظ من الهلاك'
    ],
    relatedSurahs: ['Hud (11:77-83)', 'Al-Hijr (15:61-77)', 'Ash-Shu\'ara (26:160-175)'],
    hadithRefs: [
      'Sahih al-Bukhari 3207 — "May Allah have mercy on Lut; he sought refuge in a strong pillar" (i.e., Allah)'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3207 — «رحم الله لوطاً، لقد أوى إلى ركن شديد» أي إلى الله'
    ],
    svgColor: '#dc2626'
  },
  {
    id: 'yusuf',
    name: 'Prophet Yusuf',
    nameAr: 'يوسف عليه السلام',
    title: 'The Beautiful',
    titleAr: 'الجميل',
    era: '~1700 BCE (estimated)',
    eraAr: 'حوالي 1700 قبل الميلاد (تقديري)',
    summary: 'Yusuf (AS) was thrown into a well by his brothers, sold into slavery in Egypt, and eventually became a minister. His story is the most detailed in the Quran.',
    summaryAr: 'أُلقي يوسف عليه السلام في البئر من قبل إخوته، وبُيع في مصر، ثم أصبح وزيراً. قصته من أطول القصص في القرآن.',
    fullStory: `The story of Prophet Yusuf (peace be upon him) is narrated in detail in Surah Yusuf, the only surah that tells an entire story from beginning to end.

Yusuf was the son of Prophet Yaqub (Jacob). He had eleven brothers who were jealous of him because he was their father's favorite. They plotted against him and threw him into a well.

A passing caravan found Yusuf and sold him in Egypt to a high-ranking official. Yusuf grew up in Egypt and was known for his beauty and piety. The wife of his master tried to seduce him, but he refused. She falsely accused him, and he was imprisoned.

In prison, Yusuf interpreted dreams for his fellow prisoners. When the king of Egypt had a disturbing dream, Yusuf was brought to interpret it. He predicted seven years of plenty followed by seven years of famine.

Impressed, the king appointed Yusuf as minister. When famine struck, Yusuf's brothers came to Egypt seeking food. Through a series of events, Yusuf revealed his identity to them. He forgave them and said: "No blame on you today. Allah will forgive you, and He is the Most Merciful of the merciful."

The story of Yusuf teaches us about patience, forgiveness, and trust in Allah's plan.`,
    fullStoryAr: `تُروى قصة يوسف عليه السلام بالتفصيل في سورة يوسف، وهي السورة الوحيدة التي تروي قصة كاملة من أولها إلى آخرها.

كان يوسف ابن يعقوب عليه السلام، وله أحد عشر أخاً كانوا يغارون منه لأنه كان أحبّ إلى أبيهم، فدبّروا له مكيدة وألقوه في البئر.

التقطته قافلة وبيعته في مصر إلى عزيز مصر، فنشأ يوسف معروفاً بجماله وتقواه، وراودته امرأة العزيز عن نفسه فأبى، فاتهمته ظلماً وسُجن.

في السجن فسّر يوسف رؤيا أصحابه، وحين رأى ملك مصر رؤيا مزعجة، جُلب يوسف لتأويلها، فنبأه بسبع سنين من الخصب تليها سبع من الجدب.

أعجب الملك بحكمته فجعله على خزائن الأرض، وحين جاء الجدب قدم إخوة يوسف إلى مصر يطلبون الطعام، فكشف لهم يوسف عن نفسه بعد سلسلة من الأحداث، وعفا عنهم وقال: «لا تثريب عليكم اليوم، يغفر الله لكم وهو أرحم الراحمين».

تعلمنا من قصة يوسف الصبر والعفو وحسن الظن بالله والثقة بتدبيره.`,
    keyLessons: [
      'Patience through hardship leads to Allah\'s help',
      'Forgiveness is better than revenge',
      'Allah\'s plan is always perfect',
      'Modesty and piety are always rewarded'
    ],
    keyLessonsAr: [
      'الصبر على البلاء يقود إلى نصر الله',
      'العفو خير من الانتقام',
      'تدبير الله دائماً في صالح العبد',
      'العفة والتقوى تُكافأ دائماً'
    ],
    relatedSurahs: ['Yusuf (12)'],
    hadithRefs: [
      'Sahih al-Bukhari 3207 — The Prophet (PBUH) said he would not have stayed in prison as long as Yusuf without accepting freedom'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3207 — قال النبي صلى الله عليه وسلم: لو لبثت في السجن طول ما لبث يوسف لأجبت الداعي'
    ],
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
    summaryAr: 'نجا موسى عليه السلام من فرعون، وكلمه الله على جبل الطور، وقاد بني إسرائيل خارج مصر بمعجزات كثيرة.',
    fullStory: `Prophet Musa (peace be upon him) is one of the most prominent prophets in Islam, Christianity, and Judaism. He is known as "Kaluamullah" (the Speaker to Allah) because he spoke directly with Allah.

Born during a time when Pharaoh was killing newborn Israelite boys, Musa's mother placed him in a basket on the Nile. He was found by Pharaoh's wife and raised in the royal palace.

As a young man, Musa accidentally killed an Egyptian and fled to Midian. There, he married and lived as a shepherd for ten years. One day, he saw a fire on Mount Sinai and went to investigate. There, Allah spoke to him directly and appointed him as a prophet.

Allah gave Musa many miracles: his staff turned into a serpent, his hand glowed when placed on his chest, and he parted the Red Sea. He confronted Pharaoh with God's message of liberation for the Israelites.

Pharaoh refused to believe and pursued the Israelites. When they reached the Red Sea, Musa struck it with his staff, and it parted. The Israelites crossed safely, but Pharaoh and his army were drowned.

Musa led the Israelites for forty years in the wilderness, receiving the Torah and guiding them with divine law.`,
    fullStoryAr: `يعد موسى عليه السلام من أبرز الأنبياء في الإسلام والمسيحية واليهودية، ويُعرف بـ «كليم الله» لأنه كلمه الله مباشرة.

وُلد في وقت كان فرعون يذبح أبناء بني إسرائيل، فوضعته أمه في تابوت على النيل، فالتقطته امرأة فرعون وربّته في القصر الملكي.

في شبابه قتل موسى مصرياً بالخطأ فهرب إلى مدين، فتزوج وعاش راعياً عشر سنين، ثم رأى ناراً على جبل الطور فذهب إليها، فكلمه الله واصطفاه نبياً.

أعطاه الله معجزات: عصا تتحول إلى ثعبان، ويداً تخرج بيضاء، وشقّ البحر، فذهب إلى فرعون برسالة تحرير بني إسرائيل من العبودية.

رفض فرعون الإيمان وطارد بني إسرائيل، وعند البحر الأحمر ضرب موسى البحر بعصاه فانفلق، فعبر بنو إسرائيل بأمان وغرق فرعون وجنوده.

قاد موسى بني إسرائيل أربعين سنة في التيه، متلقياً التوراة وهادياً إياهم بشرع الله.`,
    keyLessons: [
      'Allah chooses the unlikely for great missions',
      'Confronting tyranny with truth and divine help',
      'Miracles confirm prophethood',
      'God\'s help comes at the most critical moment'
    ],
    keyLessonsAr: [
      'يختار الله غير المتوقع للمهمات العظيمة',
      'مواجهة الطغيان بالحق وبعون الله',
      'المعجزات تصدّق النبوة',
      'نصر الله يأتي في أصعب اللحظات'
    ],
    relatedSurahs: ['Al-Baqarah (2:51-73)', 'Ta-Ha (20:9-98)', 'Al-Qasas (28:3-43)'],
    hadithRefs: [
      'Sahih al-Bukhari 3407 — The angel of death was sent to Musa, who struck him and returned his sight',
      'Sahih al-Bukhari 3401 — The story of Musa and Al-Khidr on the seashore',
      'Sahih al-Bukhari 4737 — Musa argued with Adam about pre-decree (Qadar)'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3407 — أرسل الله ملك الموت إلى موسى فلطمه فردّ بصره',
      'صحيح البخاري 3401 — قصة موسى مع الخضر عند مجمع البحرين',
      'صحيح البخاري 4737 — احتجاج موسى على آدم في القدر'
    ],
    svgColor: '#ea580c'
  },
  {
    id: 'dawud',
    name: 'Prophet Dawud',
    nameAr: 'داود عليه السلام',
    title: 'The King and Psalmist',
    titleAr: 'الملك والمرتّل',
    era: '~1000 BCE (estimated)',
    eraAr: 'حوالي 1000 قبل الميلاد (تقديري)',
    summary: 'Dawud (AS) was a king, prophet, and warrior who defeated Goliath and was given the Zabur (Psalms).',
    summaryAr: 'كان داود عليه السلام ملكاً ونبياً ومحارباً، هزم جالوت وأُعطي الزبور.',
    fullStory: `Prophet Dawud (peace be upon him) is one of the most beloved prophets in Islamic tradition. He was a king, prophet, warrior, and poet who was given the Zabur (Psalms) by Allah.

As a young shepherd, Dawud was called to face the giant Goliath (Jalut) in battle against the Philistines. While the seasoned soldiers of Israel trembled in fear, the young Dawud stepped forward with only a sling and five stones.

Dawud threw a stone that struck Goliath's forehead, killing him. The Philistines fled in panic, and the Israelites won a decisive victory. This event established Dawud's reputation as a brave warrior.

Allah made Dawud king and gave him the Zabur. He was known for his beautiful voice and his devotion to Allah. When he would praise Allah, the mountains and birds would join him in glorification.

Dawud was given a special gift: the ability to understand the language of birds and to shape iron with his hands. He used these gifts in the service of Allah and his people.

The story of Dawud teaches us about courage, faith, and the importance of using one's talents in the service of Allah.`,
    fullStoryAr: `يعد داود عليه السلام من أحب الأنبياء إلى المسلمين، كان ملكاً ونبياً ومحارباً وشاعراً أُعطي الزبور من الله.

كراعٍ صغير، استُدعي داود لمواجهة العملاق جالوت في حرب ضد الفلسطينيين، وبينما ارتعب جنود بني إسرائيل تقدم داود الشاب بمقلاع وخمسة حجارة فقط.

رمى داود حجراً أصاب جبهة جالوت فأرداه قتيلاً، وهرب الفلسطينيون مذعورين، وحقق بنو إسرائيل نصراً حاسماً، وأصبح داود بطلاً مشهوراً.

جعله الله ملكاً وآتاه الزبور، وكان صوته جميلاً يسبح الله فتُجيب الجبال والطيور معه بالتسبيح.

أعطاه الله نعمة فهم لغة الطير وإلانة الحديد بيديه، فاستخدم هذه النعم في خدمة الله وخدمة شعبه.

تعلمنا من قصة داود الشجاعة والإيمان وأهمية توظيف المواهب في خدمة الله.`,
    keyLessons: [
      'Courage comes from faith in Allah',
      'Allah uses the weak to defeat the strong',
      'Gratitude and worship increase blessings',
      'Talents should be used in Allah\'s service'
    ],
    keyLessonsAr: [
      'الشجاعة تنبع من الإيمان بالله',
      'يستخدم الله الضعفاء لهزيمة الأقوياء',
      'الشكر والعبادة يزيدان النعم',
      'يجب توظيف المواهب في خدمة الله'
    ],
    relatedSurahs: ['Al-Baqarah (2:251)', 'Saad (38:17-26)', 'Al-Anbiya (21:78-80)'],
    hadithRefs: [
      'Sahih al-Bukhari 3420 — The most beloved fasting to Allah was Dawud\'s (fasting alternate days), and the most beloved prayer was Dawud\'s (a third of the night)'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3420 — أحب الصيام إلى الله صيام داود (يصوم يوماً ويفطر يوماً)، وأحب الصلاة صلاة داود (نصف الليل أو ثلثه)'
    ],
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
    summaryAr: 'أُعطي سليمان عليه السلام الحكمة وسخر له الجن والريح، وكان يفهم لغة الطير والنمل.',
    fullStory: `Prophet Sulaiman (peace be upon him) was the son of Dawud and one of the most powerful prophets in terms of worldly authority. He was granted wisdom, dominion over jinn, and understanding of the speech of all creatures.

Sulaiman inherited his father's kingdom and expanded it greatly. He had a magnificent throne that was described in the Quran as being made of gold and silver, adorned with precious gems.

He commanded the jinn to build for him grand structures, palaces, and monuments. The wind was made subservient to him, blowing at his command. He had armies of humans, jinn, and birds.

One of the most famous stories about Sulaiman involves the Queen of Sheba (Bilqis). When she heard about his kingdom and wisdom, she sent him a grand gift. Sulaiman, not impressed by worldly wealth, invited her to his palace, where she saw a floor made of glass with water beneath it, thinking it was a pool.

The ant, one of the creatures Sulaiman could understand, warned its people about Sulaiman's approaching armies. This demonstrates his dominion over even the smallest creatures.

Sulaiman was also known for his wisdom in judgment. The famous story of the two women claiming the same baby, where he suggested dividing the baby in two, showcases his wisdom.

When Sulaiman died, he was standing with his staff, supporting himself. The jinn continued working, thinking he was alive, until a termite ate through his staff and he fell. This shows that even the greatest of worldly power is temporary.`,
    fullStoryAr: `يعد سليمان عليه السلام ابن داود وأقوى الأنبياء سلطاناً في الأرض، آتاه الله الحكمة وسخر له الجن والريح وفهم لغة كل المخلوقات.

ورث سليمان ملك أبيه ووسّعه، وكان له عرش عظيم وصفه القرآن بأنه من ذهب وفضة مرصع بالجواهر.

أمر الجن ببناء القصور والمعالم الفخمة، وسخرت له الريح تجري بأمره، وكان له جنود من الإنس والجن والطير.

من أشهر قصصه قصة ملكة سبأ بلقيس، حين سمعت بملكه وحكمته أرسلت له هدية، فلم يلتفت إليها سليمان، ودعاها إلى قصره، فرأت أرضاً من زجاج تحتها ماء فظنته ماءً.

النملة التي فهم سليمان قولها حذرت قومها من جيوشه، فيظهر بذلك سلطانه على أصغر المخلوقات.

عُرف سليمان بالحكمة في القضاء، وأشهر ذلك قصته في حكمه بين المرأتين المتنازعتين على الطفل.

حين توفي سليمان كان متكئاً على عصاه، فظل الجن يعملون ظانين أنه حي، حتى أكلت الأرضة عصاه فسقط، فتبين أن الجن لا يعلمون الغيب، وأن سلطان الدنيا زائل.`,
    keyLessons: [
      'Wisdom is the greatest gift from Allah',
      'Worldly power is temporary',
      'Even the smallest creatures have value',
      'Justice and fairness are essential in leadership'
    ],
    keyLessonsAr: [
      'الحكمة أعظم هدية من الله',
      'سلطان الدنيا زائل',
      'حتى أصغر المخلوقات لها قيمة',
      'العدل والأمانة أساسان في القيادة'
    ],
    relatedSurahs: ['Al-Baqarah (2:102)', 'An-Naml (27:15-44)', 'Saad (38:30-40)'],
    hadithRefs: [
      'Sahih al-Bukhari 3427 — Sulaiman\'s wise judgement in the case of two women arguing over a child, after Dawud\'s judgement'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3427 — قضى سليمان بحكمته في قصة المرأتين والطفل بعد قضاء داود'
    ],
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
    summaryAr: 'ابتلعه الحوت بعد مغادرته قومه، فتاب في بطن الحوت ونجاه الله.',
    fullStory: `Prophet Yunus (peace be upon him), known as "Dhun-Nun" (the One of the Whale), is one of the most emotionally moving stories in the Quran.

Yunus was sent to the people of Nineveh in modern-day Iraq. He called them to worship Allah and abandon their idolatry, but they refused to listen. Frustrated, Yunus left his people without Allah's permission, warning them that punishment would come.

When Yunus left, the people of Nineveh saw signs of impending doom. They repented sincerely, and Allah accepted their repentance and spared them from punishment.

Meanwhile, Yunus boarded a ship that was caught in a terrible storm. When the sailors cast lots to throw someone overboard to lighten the ship, the lot fell on Yunus. He was thrown into the sea, where he was swallowed by a great whale.

In the belly of the whale, in complete darkness, surrounded by water on all sides, Yunus called out in despair: "There is no deity except You. Glory be to You. Indeed, I have been of the wrongdoers."

Allah heard his prayer and commanded the whale to release him. Yunus was cast onto the shore, weak and ill. Allah grew a tree to shade him and provided for him. He then sent Yunus back to his people, who now believed.

The story of Yunus teaches us that Allah's mercy is always greater than His punishment, and that sincere repentance is never rejected.`,
    fullStoryAr: `يعد يونس عليه السلام الملقب بـ «ذي النون» من أكثر القصص تأثيراً في القرآن.

أُرسل يونس إلى أهل نينوى في العراق القديم، فدعاهم إلى عبادة الله وترك الشرك، لكنهم رفضوا، فخرج من بينهم مغاضباً محذراً من نزول العذاب.

بعد خروجه رأى أهل نينوى علامات العذاب فتابوا توبة صادقة، فقبل الله توبتهم وصرف عنهم العذاب.

ركب يونس سفينة فجاءتها عاصفة شديدة، فاقترع البحارة لتخفيف السفينة فوقعت القرعة عليه، فأُلقى في البحر فالتقمه حوت عظيم.

في بطن الحوت في الظلمات الثلاث نادى: «لا إله إلا أنت سبحانك إني كنت من الظالمين»، فاستجاب الله له وأمر الحوت أن يلفظه إلى الشاطئ وهو سقيم، فأنبت عليه شجرة من يقطين تظله.

ثم أرسله الله إلى قومه الذين آمنوا جميعاً، فتعلمنا أن رحمة الله أوسع من عقابه، وأن التوبة الصادقة لا تُرد أبداً.`,
    keyLessons: [
      'Allah\'s mercy is greater than His punishment',
      'Sincere repentance is always accepted',
      'We should not leave our duties without Allah\'s permission',
      'Even in the darkest moments, Allah hears our prayers'
    ],
    keyLessonsAr: [
      'رحمة الله أوسع من عقابه',
      'التوبة الصادقة مقبولة دائماً',
      'لا ينبغي ترك الواجب بغير إذن الله',
      'الله يسمع دعاءنا حتى في أحلك اللحظات'
    ],
    relatedSurahs: ['Yunus (10:98)', 'Al-Anbiya (21:87-88)', 'As-Saffat (37:139-148)'],
    hadithRefs: [
      'Sahih al-Bukhari 3413 — "It is not right for any Muslim to say that I am better than Yunus bin Matta"'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3413 — «لا ينبغي لعبد أن يقول أنا خير من يونس بن متى»'
    ],
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
    summaryAr: 'وُلد عيسى عليه السلام لمريم دون أب، وأجرى المعجزات بإذن الله، وهو المسيح.',
    fullStory: `Prophet Isa (peace be upon him), known as Jesus in Christianity, is one of the most important prophets in Islam. He is referred to as "Kalimatullah" (the Word of Allah) and "Ruhullah" (the Spirit of Allah).

Isa was born to Maryam (Mary), a righteous woman chosen by Allah above all women. The story of his birth is narrated in Surah Maryam and Surah Al-Imran.

When Maryam was young and devoted to worship, the angel Jibreel (Gabriel) appeared to her and gave her the news that she would bear a son, even though no man had touched her. She was distressed and hid, but when the birth pangs came, she was directed to a palm tree.

She called out in despair, wishing she had died before this. The angel told her not to grieve and that Allah had provided a stream beneath her and a date palm above. Baby Isa spoke from the cradle, defending his mother's honor.

Isa performed many miracles by Allah's permission: healing the blind, curing lepers, raising the dead, and knowing what people had in their houses. He was given the Injeel (Gospel) to guide the Children of Israel.

The Quran emphasizes that Isa was a prophet and servant of Allah, not divine himself. He will return before the Day of Judgment to defeat the false messiah (Dajjal) and establish justice on earth.`,
    fullStoryAr: `يعد عيسى عليه السلام من أهم الأنبياء في الإسلام، ويُشار إليه بـ «كلمة الله» و«روح منه».

وُلد لمريم، المرأة الصديقة التي اصطفاها الله على نساء العالمين، وتُروى قصة ميلاده في سورة مريم وسورة آل عمران.

بينما كانت مريم منصرفة للعبادة، جاءها الملاك جبريل وبشرها بغلام من غير أن يمسها بشر، فأجابها بأنه رسول ربها ليهبها غلاماً زكياً.

حين جاءها المخاض أوت إلى جذع النخلة، ونادت: «يا ليتني مت قبل هذا»، فناداها ألا تحزن وقد جعل الله تحتها سرياً ونخلاً، فنطق عيسى من المهد مدافعاً عن أمه.

أجرى عيسى المعجزات بإذن الله: يبرئ الأكمه والأبرص ويحيي الموتى ويعلم ما يأكلون ويدخرون، وآتاه الله الإنجيل لهداية بني إسرائيل.

يؤكد القرآن أن عيسى نبي وعبد من عباد الله وليس إلهاً، وأنه سينزل قبل يوم القيامة ليكسر الصليب ويقتل الدجال ويقيم العدل في الأرض.`,
    keyLessons: [
      'Allah\'s power is beyond human comprehension',
      'Miracles are by Allah\'s permission, not by the prophet\'s own power',
      'Isa is a prophet and servant of Allah, not divine',
      'The birth of Isa shows Allah\'s ability to create without precedent'
    ],
    keyLessonsAr: [
      'قدرة الله تتجاوز تصور البشر',
      'المعجزات تكون بإذن الله لا بقدرة النبي',
      'عيسى نبي وعبد لله وليس إلهاً',
      'ميلاد عيسى دليل على قدرة الله على الخلق من غير سابق'
    ],
    relatedSurahs: ['Al-Imran (3:45-59)', 'Maryam (19:16-36)', 'Al-Anbiya (21:91)'],
    hadithRefs: [
      'Sahih al-Bukhari 3436 — Three spoke in the cradle: Isa, Juraij, and the baby in the story of the woman',
      'Sahih al-Bukhari 3443 — "I am the nearest of all people to Isa, son of Mary"',
      'Sahih al-Bukhari 3435 — Whoever testifies that Isa is the slave and Messenger of Allah, and His word, will enter Paradise'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3436 — ثلاثة تكلموا في المهد: عيسى وجريج وصاحب قصة المرأة',
      'صحيح البخاري 3443 — «أنا أولى الناس بعيسى ابن مريم»',
      'صحيح البخاري 3435 — من شهد أن عيسى عبد الله ورسوله وكلمته دخل الجنة'
    ],
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
    summaryAr: 'محمد صلى الله عليه وسلم آخر الأنبياء والمرسلين، تلقى القرآن من جبريل وأسس دين الإسلام.',
    fullStory: `Prophet Muhammad (peace and blessings be upon him) is the final prophet and messenger of Allah, sent to all of humanity. He is known as "Al-Amin" (the Trustworthy) and "Al-Mustafa" (the Chosen One).

Born in Mecca in 570 CE, Muhammad was orphaned at a young age. He grew up known for his honesty, generosity, and moral character. He worked as a shepherd and later as a merchant.

At the age of 40, while meditating in the cave of Hira, the angel Jibreel appeared to him with the first revelation: "Read in the name of your Lord who created." This marked the beginning of his prophethood.

For the first three years, Muhammad secretly called people to Islam. After receiving divine permission, he began preaching publicly. The Quraysh persecuted the early Muslims, forcing many to migrate to Abyssinia.

After 13 years of persecution in Mecca, Muhammad and his followers migrated to Medina (the Hijra), where he established the first Muslim community. He combined his roles as prophet, statesman, and military leader.

Over the next 23 years, the message of Islam spread throughout Arabia. Muhammad conquered Mecca peacefully, destroyed the idols around the Kaaba, and established the monotheistic worship of Allah.

Before his death in 632 CE, Muhammad delivered his farewell sermon, emphasizing equality, justice, and the rights of all people. He left behind the Quran as the literal word of Allah and the Sunnah as his practical example.

The story of Muhammad teaches us about the perfect character, mercy to all creation, and the importance of following divine guidance.`,
    fullStoryAr: `يعد محمد صلى الله عليه وسلم خاتم الأنبياء والمرسلين، أُرسل إلى الناس كافة، ويُعرف بـ «الأمين» و«المصطفى».

وُلد في مكة عام 570 ميلادي ويتيم الأبوين في صغره، فنشأ معروفاً بصدقه وكرم أخلاقه، وعمل راعياً ثم تاجراً.

في سن الأربعين، وهو يتعبد في غار حراء، نزل عليه جبريل بأول وحي: «اقرأ باسم ربك الذي خلق»، فكانت بداية نبوته.

دعا سراً ثلاث سنين، ثم أُمر بإعلان الدعوة علناً، فاضطهدته قريش واضطهدت المسلمين، وهاجر كثيرون إلى الحبشة.

بعد ثلاث عشرة سنة من الاضطهاد، هاجر النبي وأصحابه إلى المدينة، حيث أسس أول مجتمع إسلامي، وجمع بين النبوة والسياسة والقيادة.

في ثلاث وعشرين سنة انتشر الإسلام في جزيرة العرب، وفتح النبي مكة فتحاً مبيناً، وكسر الأصنام حول الكعبة، وأقام التوحيد.

قبل وفاته عام 632 خطب النبي خطبة الوداع مؤكداً على المساواة والعدالة وحقوق الناس، وترك للأمة القرآن كلام الله والسنة مثالاً عملياً.

تعلمنا من سيرة النبي الكمال في الأخلاق والرحمة بكل الخلق وأهمية اتباع الهدى.`,
    keyLessons: [
      'The perfect example of character and conduct',
      'Mercy to all of creation',
      'Patience and perseverance lead to victory',
      'The Quran is the final and preserved divine revelation'
    ],
    keyLessonsAr: [
      'الكمال في الخلق والسلوك',
      'الرحمة بجميع المخلوقات',
      'الصبر والمثابرة يؤديان إلى النصر',
      'القرآن هو الوحي الخاتم المحفوظ'
    ],
    relatedSurahs: ['Al-Ahzab (33:40)', 'Al-Fath (48:1-3)', 'Al-Qalam (68:1-4)'],
    hadithRefs: [
      'Sahih al-Bukhari 3 — The first revelation in the cave of Hira: "Read in the name of your Lord" (96:1-5)',
      'Sahih al-Bukhari 3340 — "I will be the chief of the people on the Day of Resurrection" — the hadith of intercession',
      'Sahih al-Bukhari 349 — The Prophet\'s journey to Jerusalem and ascension (Isra & Mi\'raj)'
    ],
    hadithRefsAr: [
      'صحيح البخاري 3 — أول الوحي في غار حراء: «اقرأ باسم ربك الذي خلق» (العلق 1-5)',
      'صحيح البخاري 3340 — «أنا سيد ولد آدم يوم القيامة» — حديث الشفاعة',
      'صحيح البخاري 349 — رحلة الإسراء والمعراج'
    ],
    svgColor: '#16a34a'
  }
];