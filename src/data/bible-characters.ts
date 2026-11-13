export type BibleCharacter = {
  id: string;
  name_en: string;
  name_ar: string;
  clues: [string, string, string];
  clues_ar: [string, string, string];
  biography: string;
  key_verse: string;
  key_verse_ref: string;
  testament: 'OT' | 'NT';
};

export const BIBLE_CHARACTERS: BibleCharacter[] = [
  {
    id: 'nehemiah',
    name_en: 'Nehemiah',
    name_ar: 'نحميا',
    clues: [
      'I organized my community to rebuild using one hand for work and one hand for a weapon.',
      'I wept and prayed for days when I heard that my city lay in ruins, thousands of miles away.',
      'I was a trusted cupbearer to a Persian king, and I convinced him to let me go home.',
    ],
    clues_ar: [
      'نظّمت مجتمعي للبناء من جديد، باليد اليمنى نعمل وباليد اليسرى نحمل السلاح.',
      'بكيتُ وصليتُ أياماً حين سمعتُ أن مدينتي تقع في خراب على بُعد آلاف الأميال.',
      'كنتُ ساقياً موثوقاً لملك فارسي، وأقنعتُه بأن يأذن لي بالعودة إلى وطني.',
    ],
    biography:
      'Nehemiah was a Jewish exile serving as cupbearer to King Artaxerxes of Persia when he received devastating news that Jerusalem\'s walls lay in rubble. Burdened with grief, he fasted and prayed before boldly asking the king for permission to return and rebuild. Against fierce opposition from enemies like Sanballat and Tobiah, he rallied the people to rebuild Jerusalem\'s entire wall in just 52 days — a feat so swift that even their enemies recognized it as God\'s work. His story is a testament to prayerful leadership, courageous action, and unwavering dependence on God.',
    key_verse: 'The God of heaven will give us success. We his servants will start rebuilding.',
    key_verse_ref: 'Nehemiah 2:20',
    testament: 'OT',
  },
  {
    id: 'esther',
    name_en: 'Esther',
    name_ar: 'إستير',
    clues: [
      'I risked my life by approaching the throne uninvited, knowing "if I perish, I perish."',
      'I hosted two banquets for the king and his most powerful official before revealing my true request.',
      'I was an orphaned Jewish girl who became Queen of Persia and saved my people from genocide.',
    ],
    clues_ar: [
      'خاطرتُ بحياتي حين اقتربتُ من العرش دون دعوة، وأنا أعلم "إن هلكتُ فقد هلكتُ".',
      'أقمتُ وليمتين للملك وأكبر مسؤوليه قبل أن أكشف طلبي الحقيقي.',
      'كنتُ يتيمة يهودية أصبحتْ ملكةً لفارس وأنقذتْ شعبها من الإبادة.',
    ],
    biography:
      'Esther was a young Jewish woman raised by her cousin Mordecai who became queen to the Persian King Ahasuerus (Xerxes). When the king\'s wicked advisor Haman plotted to exterminate all Jews in the empire, Mordecai urged Esther to intercede — reminding her she may have been placed in the palace "for such a time as this." At great personal risk, she approached the king unsummoned, exposed Haman\'s evil plan, and saved her entire people from destruction. Her courage, wisdom, and faith make her one of the most celebrated women in Scripture.',
    key_verse: 'Who knows whether you have not come to the kingdom for such a time as this?',
    key_verse_ref: 'Esther 4:14',
    testament: 'OT',
  },
  {
    id: 'joseph',
    name_en: 'Joseph',
    name_ar: 'يوسف',
    clues: [
      'I interpreted dreams for two fellow prisoners, and two years later my gift brought me before the most powerful man in the world.',
      'My brothers sold me to slave traders for twenty pieces of silver, yet I forgave them and said God meant it for good.',
      'My father gave me a coat of many colors, making my brothers jealous — but God used their betrayal to place me second-in-command of Egypt.',
    ],
    clues_ar: [
      'فسّرتُ أحلام اثنين من رفاقي في السجن، وبعد عامين قادني موهبتي أمام أقوى رجل في العالم.',
      'باعني إخوتي لتجار الرقيق بعشرين قطعة فضة، لكنني سامحتُهم وقلتُ: أنتم قصدتم بي الشر والله قصد به الخير.',
      'أعطاني أبي قميصاً بألوان كثيرة فحسدني إخوتي، لكن الله استخدم خيانتهم لأجعلني ثاني رجل في مصر.',
    ],
    biography:
      'Joseph was the eleventh son of Jacob and his beloved wife Rachel, favored above his brothers and gifted with the ability to interpret dreams. His brothers\' jealousy led them to sell him into Egyptian slavery, where he endured false accusations and prison before his God-given gift of dream interpretation brought him before Pharaoh. He correctly predicted seven years of plenty followed by seven years of famine, was appointed as Egypt\'s second-in-command, and ultimately reunited with his family in a tearful scene of forgiveness. His life is a profound picture of redemption, divine providence, and grace.',
    key_verse: 'You intended to harm me, but God intended it for good.',
    key_verse_ref: 'Genesis 50:20',
    testament: 'OT',
  },
  {
    id: 'ruth',
    name_en: 'Ruth',
    name_ar: 'راعوث',
    clues: [
      'A wealthy kinsman-redeemer spread the corner of his garment over me as a sign of his commitment to care for me.',
      'I followed my mother-in-law to a foreign land and gleaned leftover grain in the fields to survive.',
      'I was a Moabite widow who refused to leave my bereaved mother-in-law, saying "where you go, I will go."',
    ],
    clues_ar: [
      'بسط عليّ وليّ الأمر الغني طرف ثوبه علامةً على تعهّده بحمايتي والاعتناء بي.',
      'تبعتُ حماتي إلى أرض غريبة ولقطتُ السنابل المتبقية في الحقول كي أعيش.',
      'كنتُ أرملة مؤابية رفضتُ أن أترك حماتي الحزينة قائلةً: "حيثما ذهبتِ أذهب".',
    ],
    biography:
      'Ruth was a Moabite woman who married into an Israelite family living in Moab. When her husband died, she chose to remain loyal to her mother-in-law Naomi and return with her to Bethlehem, abandoning her own homeland and gods. In Bethlehem she humbly gleaned grain in the fields and caught the attention of the wealthy and kind landowner Boaz, a relative of Naomi. Boaz redeemed her according to the law of the kinsman-redeemer, married her, and together they became great-grandparents of King David and ancestors of Jesus Christ.',
    key_verse: 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.',
    key_verse_ref: 'Ruth 1:16',
    testament: 'OT',
  },
  {
    id: 'gideon',
    name_en: 'Gideon',
    name_ar: 'جدعون',
    clues: [
      'God whittled my army from 32,000 soldiers down to just 300, saying too many men would claim the glory for themselves.',
      'I laid a wool fleece on the ground twice, asking God for two opposite miracles to confirm His call on my life.',
      'My 300 warriors surrounded the enemy camp at night, smashing jars to reveal torches and shouting "A sword for the LORD and for Gideon!"',
    ],
    clues_ar: [
      'قلّص الله جيشي من 32,000 مقاتل إلى 300 فقط، قائلاً: إن كثرتهم ستجعلهم يدّعون المجد لأنفسهم.',
      'وضعتُ جزّة صوف على الأرض مرتين طالباً معجزتين متضادتين ليؤكد الله دعوته لي.',
      'طوّق محاربوي الثلاثمئة المعسكر ليلاً وكسروا الجرار فظهرت الشعل وهتفوا: سيف للرب وللجدعون!',
    ],
    biography:
      'Gideon was an unlikely military leader — the least member of the weakest clan of Manasseh — whom God called while he was secretly threshing wheat in a winepress to hide it from the Midianite oppressors. Despite initial fear and doubt (testing God twice with a fleece), he obeyed God\'s unconventional strategy: reducing his army from 32,000 to just 300 men armed not with swords but with trumpets, torches, and clay jars. The strategy worked miraculously, routing the vast Midianite army in a night-time surprise assault. His story shows that God\'s strength is made perfect in human weakness.',
    key_verse: 'The LORD said to Gideon, "With the three hundred men that lapped I will save you and give the Midianites into your hands."',
    key_verse_ref: 'Judges 7:7',
    testament: 'OT',
  },
  {
    id: 'elijah',
    name_en: 'Elijah',
    name_ar: 'إيليا',
    clues: [
      'After my greatest victory, I was so exhausted and afraid that I ran into the desert and asked God to let me die — and an angel brought me bread twice.',
      'I called down fire from heaven in front of a crowd, drenching the altar with water first to make the miracle undeniable.',
      'I was fed by ravens beside a brook, and later I was taken up to heaven in a whirlwind with horses and a chariot of fire.',
    ],
    clues_ar: [
      'بعد أعظم انتصاراتي، اجتاحني الإرهاق والخوف فهربتُ إلى البرية وطلبتُ الموت، فأتاني ملاك بخبز مرتين.',
      'استدعيتُ نار السماء أمام الحشود بعد أن أغرقتُ المذبح بالماء لتكون المعجزة لا تقبل الجدل.',
      'أطعمتني الغربان بجانب نهر، ثم صُعِدتُ إلى السماء في زوبعة مع خيول ومركبة نارية.',
    ],
    biography:
      'Elijah the Tishbite was one of Israel\'s most dramatic prophets, who appeared suddenly in the reign of wicked King Ahab to announce a years-long drought as God\'s judgment. He was miraculously sustained by ravens and a widow\'s unending jar of flour before his famous showdown on Mount Carmel, where he challenged 450 prophets of Baal alone — and God answered with fire that consumed even the water-soaked altar. After his victory he fled in exhaustion and despair, was tenderly ministered to by an angel, and heard God\'s voice not in earthquake or fire but in a still small whisper. He was one of only two people in all of Scripture taken to heaven without dying.',
    key_verse: 'Answer me, LORD, answer me, so these people will know that you, LORD, are God.',
    key_verse_ref: '1 Kings 18:37',
    testament: 'OT',
  },
  {
    id: 'daniel',
    name_en: 'Daniel',
    name_ar: 'دانيال',
    clues: [
      'I saw visions of four great beasts, a Son of Man coming on the clouds, and an Ancient of Days seated on a throne of flames.',
      'I was thrown into a den of lions because I refused to stop praying three times a day toward Jerusalem.',
      'As a teenager in a foreign land, I refused the king\'s food and drink to honor God — and I emerged healthier than everyone else.',
    ],
    clues_ar: [
      'رأيتُ رؤى عن أربعة وحوش عظيمة وابن إنسان آتٍ على السحاب وعتيق الأيام جالس على عرش من لهب.',
      'أُلقيَ بي في جبّ الأسود لأنني رفضتُ التوقف عن الصلاة ثلاث مرات يومياً باتجاه أورشليم.',
      'في غربتي وأنا مراهق، رفضتُ طعام الملك وشرابه تكريماً لله فظهرتُ أكثر صحة من الجميع.',
    ],
    biography:
      'Daniel was a young Jewish nobleman taken captive to Babylon where, from his very first days, he resolved not to defile himself with the king\'s food. His faithfulness was rewarded with wisdom and the God-given ability to interpret dreams and visions, bringing him before kings Nebuchadnezzar, Belshazzar, and Darius. Even when a jealous law made his prayers illegal, he knelt at his window toward Jerusalem three times a day — landing him in a lions\' den from which God delivered him unharmed. His prophecies of world empires and the end times remain among the most studied in all of Scripture.',
    key_verse: 'My God sent his angel, and he shut the mouths of the lions.',
    key_verse_ref: 'Daniel 6:22',
    testament: 'OT',
  },
  {
    id: 'jonah',
    name_en: 'Jonah',
    name_ar: 'يونان',
    clues: [
      'I preached the shortest recorded sermon in the Bible, and it produced the greatest recorded revival — an entire city of 120,000 people repented.',
      'When a shade plant I loved withered and died, God used my anger to teach me a lesson about compassion.',
      'I tried to sail away from God\'s assignment, was thrown overboard in a storm, and spent three days inside a great fish.',
    ],
    clues_ar: [
      'ألقيتُ أقصر موعظة مسجّلة في الكتاب المقدس فأنتجتْ أعظم صحوة روحية، إذ تاب مدينة بأكملها من 120,000 نسمة.',
      'حين ذبل النبات الذي أحببتُه ومات، استخدم الله غضبي ليعلمني درساً عن الرحمة.',
      'حاولتُ الإبحار هرباً من مهمة الله فأُلقيَ بي في البحر وقضيتُ ثلاثة أيام في بطن حوت عظيم.',
    ],
    biography:
      'Jonah was an Israelite prophet who received a divine command to preach repentance to Nineveh, the capital of Israel\'s greatest enemy, Assyria — and promptly boarded a ship heading the opposite direction. A violent storm, terrified sailors, and three days in the belly of a great fish later, he finally obeyed. His reluctant eight-word message produced an astonishing citywide repentance, from king to peasant. Yet Jonah was furious at God\'s mercy toward his enemies, and God\'s gentle rebuke about a withered plant closes the book — leaving Jonah\'s heart still wrestling. Jesus later compared His own burial and resurrection to Jonah\'s three days in the deep.',
    key_verse: 'Salvation comes from the LORD.',
    key_verse_ref: 'Jonah 2:9',
    testament: 'OT',
  },
  {
    id: 'deborah',
    name_en: 'Deborah',
    name_ar: 'دبورة',
    clues: [
      'I held court under a palm tree, and people came from all over Israel to have their disputes settled by me.',
      'When my military commander refused to go into battle without me, I agreed — but I told him the honor would go to a woman.',
      'I was both a prophetess and a judge over Israel who led Barak and 10,000 men to victory against Sisera\'s iron chariots.',
    ],
    clues_ar: [
      'جلستُ للقضاء تحت نخلة وكان الناس يأتون من كل إسرائيل لأفصل في نزاعاتهم.',
      'حين رفض قائدي العسكري الذهاب للمعركة دوني، وافقتُ لكنني أخبرته أن المجد سيكون لامرأة.',
      'كنتُ نبية وقاضية على إسرائيل وقدتُ باراق وعشرة آلاف مقاتل إلى النصر على مركبات سيسرا الحديدية.',
    ],
    biography:
      'Deborah was a prophetess and the only female judge of Israel mentioned in Scripture, holding court under the Palm of Deborah between Ramah and Bethel. When Israel was oppressed by Jabin king of Canaan and his fearsome general Sisera with 900 iron chariots, Deborah summoned Barak and delivered God\'s battle plan. When Barak refused to go without her, she agreed but prophesied that the final glory would belong to a woman — a prophecy fulfilled when Jael drove a tent peg through Sisera\'s head. Deborah and Barak\'s victory song in Judges 5 is one of the oldest poems in the Hebrew Bible.',
    key_verse: 'Village life in Israel ceased, until I, Deborah, arose, arose a mother in Israel.',
    key_verse_ref: 'Judges 5:7',
    testament: 'OT',
  },
  {
    id: 'samson',
    name_en: 'Samson',
    name_ar: 'شمشون',
    clues: [
      'In my final act, I pushed apart two pillars in a crowded stadium, and in my death I killed more of God\'s enemies than in my entire life.',
      'The secret of my extraordinary power was hidden in my hair — and the woman I loved betrayed me by having it shaved while I slept.',
      'I was set apart to God from before birth as a Nazirite, and I once killed a lion with my bare hands on the way to visit a woman I fancied.',
    ],
    clues_ar: [
      'في عملي الأخير، دفعتُ عمودين في ملعب مكتظ بالناس وقتلتُ في موتي من أعداء الله أكثر مما قتلتُهم في حياتي كلها.',
      'سرّ قوتي الخارقة كان مخبأً في شعري، والمرأة التي أحببتُها خانتني بحلقه وأنا نائم.',
      'كنتُ مكرّساً لله منذ قبل ولادتي نذيراً، وقتلتُ ذات مرة أسداً بيديّ العاريتين في طريقي لزيارة امرأة.',
    ],
    biography:
      'Samson was a Nazirite judge of Israel whose supernatural strength — the outward sign of his consecration to God — made him a one-man army against the Philistines. His story is a tragic cycle of spiritual potential and moral failure: he killed a lion bare-handed, struck down a thousand men with a donkey\'s jawbone, and yet repeatedly compromised his calling through forbidden relationships. His betrayal by Delilah, who discovered the secret of his strength, led to his capture, blinding, and enslavement. Yet in his final moment, blind and mocked, he cried out to God for strength one last time — and brought down the Philistine temple on 3,000 people.',
    key_verse: 'Sovereign LORD, remember me. Please, God, strengthen me just once more.',
    key_verse_ref: 'Judges 16:28',
    testament: 'OT',
  },
  {
    id: 'david',
    name_en: 'David',
    name_ar: 'داود',
    clues: [
      'I wrote poems of worship from the depths of guilt after committing terrible sin, crying "Create in me a clean heart, O God."',
      'I refused to wear the king\'s armor and instead picked up five smooth stones from a stream before facing a giant warrior.',
      'I was the youngest of eight brothers, anointed by a prophet while still tending sheep, and I became Israel\'s greatest king.',
    ],
    clues_ar: [
      'كتبتُ أشعار عبادة من عمق الذنب بعد خطيئتي الفادحة صارخاً: "اخلق فيّ يا الله قلباً نقياً".',
      'رفضتُ لبس درع الملك واخترتُ بدلاً من ذلك خمسة حجارة من النهر قبل مواجهة المحارب العملاق.',
      'كنتُ أصغر ثمانية إخوة، مُسِحتُ ملكاً بيد نبي وأنا لا أزال أرعى الغنم، وأصبحتُ أعظم ملوك إسرائيل.',
    ],
    biography:
      'David was the youngest son of Jesse of Bethlehem, anointed by the prophet Samuel as Israel\'s future king while still a teenage shepherd. His defeat of the Philistine giant Goliath with a sling and stone launched a career of extraordinary military victories, deep friendship with Jonathan, and passionate pursuit of God — earning him the title "a man after God\'s own heart." He established Jerusalem as Israel\'s capital, organized worship, wrote dozens of psalms, and was promised an eternal dynasty through which the Messiah would come. His life also carried deep sorrow: his adultery with Bathsheba and the murder of Uriah haunted him, and family conflict tore his household apart.',
    key_verse: 'The LORD is my shepherd; I shall not want.',
    key_verse_ref: 'Psalm 23:1',
    testament: 'OT',
  },
  {
    id: 'solomon',
    name_en: 'Solomon',
    name_ar: 'سليمان',
    clues: [
      'I wrote 3,000 proverbs and 1,005 songs, and rulers from the ends of the earth came to hear my wisdom.',
      'When God appeared to me in a dream and offered me anything I wanted, I asked for a discerning heart to govern God\'s people.',
      'I built a magnificent Temple in Jerusalem that took seven years to construct — and when I dedicated it, the glory of God filled it like a cloud.',
    ],
    clues_ar: [
      'كتبتُ 3000 مثل و1005 أغانٍ وجاء حكام من أقاصي الأرض ليسمعوا حكمتي.',
      'حين ظهر لي الله في حلم وعرض عليّ ما أشاء، طلبتُ قلباً فاهماً لأحكم بين شعبه.',
      'بنيتُ هيكلاً رائعاً في أورشليم استغرق بناؤه سبع سنوات، وحين كرّستُه ملأ مجد الله المكان كالغيمة.',
    ],
    biography:
      'Solomon was the son of David and Bathsheba, chosen by God to build the Temple in Jerusalem that his father had longed to build. At the outset of his reign he asked God for wisdom rather than wealth or long life, and God gave him all three — making him the wisest and wealthiest king of his era, drawing dignitaries like the Queen of Sheba to marvel at his court. He wrote Proverbs, Ecclesiastes, the Song of Songs, and two Psalms, and his architectural achievements were legendary. Tragically, his 700 wives and 300 concubines turned his heart toward foreign gods in his old age, and the kingdom split in two after his death.',
    key_verse: 'The fear of the LORD is the beginning of wisdom.',
    key_verse_ref: 'Proverbs 9:10',
    testament: 'OT',
  },
  {
    id: 'abraham',
    name_en: 'Abraham',
    name_ar: 'إبراهيم',
    clues: [
      'I raised a knife over my only son on a mountain, fully intending to obey God — and at the last moment God provided a ram caught in a thicket.',
      'God promised me descendants as numerous as the stars and the sand, even though my wife and I were far too old to have children.',
      'I left a great city called Ur of the Chaldeans without knowing where I was going, simply because God told me to.',
    ],
    clues_ar: [
      'رفعتُ السكين فوق ابني الوحيد على الجبل مصمّماً على طاعة الله، فأعدّ الله في اللحظة الأخيرة كبشاً مقرنّاً في الأدغال.',
      'وعدني الله بذرية كنجوم السماء وكرمل البحر رغم أن زوجتي وأنا تجاوزنا سن الإنجاب بكثير.',
      'تركتُ مدينة أور العظيمة دون أن أعرف وجهتي، فقط لأن الله أمرني بذلك.',
    ],
    biography:
      'Abraham, originally named Abram, was called by God to leave his homeland of Ur and journey to a land God would show him — a radical act of faith that made him the father of a new nation. God made a covenant with him, promising land, descendants, and that through him all nations of the earth would be blessed. At age 100, he and his 90-year-old wife Sarah miraculously conceived their promised son Isaac. His faith reached its ultimate test when God commanded him to sacrifice Isaac on Mount Moriah — a test he was ready to fulfill until God provided a substitute ram. He is revered as the father of faith by Jews, Christians, and Muslims alike.',
    key_verse: 'Abraham believed God, and it was credited to him as righteousness.',
    key_verse_ref: 'Romans 4:3',
    testament: 'OT',
  },
  {
    id: 'moses',
    name_en: 'Moses',
    name_ar: 'موسى',
    clues: [
      'I spent 40 days on a mountaintop and came down with my face glowing so brightly that people were afraid to look at me.',
      'I stretched out my staff over the sea and the waters divided, and 600 chariots pursued us into the dry ground between walls of water.',
      'A bush burned without being consumed, and from its flames God called my name twice and sent me to tell Pharaoh to let His people go.',
    ],
    clues_ar: [
      'قضيتُ 40 يوماً على قمة الجبل ونزلتُ ووجهي يشع نوراً حتى خاف الناس أن ينظروا إليّ.',
      'مددتُ عصاي على البحر فانشقّ، وطارد 600 عربة حربية الشعب في الأرض الجافة بين جدارين من الماء.',
      'اشتعلت عليحة ولم تحترق، ومن لهيبها ناداني الله باسمي مرتين وأرسلني لأقول لفرعون: أطلق شعبي.',
    ],
    biography:
      'Moses was a Hebrew born during Pharaoh\'s genocide of Israelite babies, hidden in a basket on the Nile, and providentially raised in Pharaoh\'s own palace. After killing an Egyptian and fleeing to Midian, he encountered God in a burning bush at age 80 and was commissioned to liberate his people. He brought ten devastating plagues upon Egypt, led the Exodus of perhaps two million people through the parted Red Sea, received the Ten Commandments on Mount Sinai, and shepherded an often rebellious nation through forty years in the wilderness. He spoke to God face to face, as a man speaks to his friend, and is called the greatest prophet Israel ever knew.',
    key_verse: 'I AM WHO I AM. This is what you are to say to the Israelites: "I AM has sent me to you."',
    key_verse_ref: 'Exodus 3:14',
    testament: 'OT',
  },
  {
    id: 'isaiah',
    name_en: 'Isaiah',
    name_ar: 'إشعياء',
    clues: [
      'I described the coming Messiah as "a man of sorrows, acquainted with grief" who would be pierced for our transgressions — 700 years before it happened.',
      'In a vision I saw the Lord seated on a throne so high that only the hem of his robe filled the entire Temple, and creatures with six wings cried "Holy, holy, holy."',
      'I prophesied "Unto us a Child is born, unto us a Son is given" and called Him Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.',
    ],
    clues_ar: [
      'وصفتُ المسيح الآتي بأنه "رجل أوجاع ومختبر الحزن" ومطعون من أجل ذنوبنا، قبل 700 سنة من حدوث ذلك.',
      'رأيتُ في رؤيا الرب جالساً على عرش مرتفع حتى ملأ ذيل ثوبه الهيكل كله، وكائنات بستة أجنحة تهتف: "قدوس قدوس قدوس".',
      'تنبأتُ: "لأنه وُلِد لنا ولد وأُعطينا ابن" وسمّيتُه العجيب المشير الإله القدير أبا الأبدية رئيس السلام.',
    ],
    biography:
      'Isaiah son of Amoz prophesied in Jerusalem during the reigns of four kings of Judah, beginning with a shattering vision of God\'s holiness that exposed his own unworthiness. His lips were cleansed with a burning coal from the altar, and he answered God\'s call with "Here am I, send me." His sixty-six chapter book has been called the "Gospel of the Old Testament" for its breathtaking prophecies of a coming Servant-Savior: born of a virgin, despised and rejected, bearing the sins of many, and rising to reign in glory. The New Testament quotes Isaiah more than any other prophet.',
    key_verse: 'He was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him.',
    key_verse_ref: 'Isaiah 53:5',
    testament: 'OT',
  },
  {
    id: 'jeremiah',
    name_en: 'Jeremiah',
    name_ar: 'إرميا',
    clues: [
      'I was thrown into an empty cistern and sank into the mud, left to die — until a palace servant begged the king to pull me out with ropes.',
      'I tried to stop preaching because the message brought me only rejection, but I said the word of God was like "a fire shut up in my bones" I could not contain.',
      'I am called the weeping prophet because I mourned over Jerusalem for forty years — yet I also proclaimed a promise of a new covenant written on the heart.',
    ],
    clues_ar: [
      'أُلقيَ بي في بئر فارغة فغرقتُ في الطين تاركاً لأموت، حتى توسّل خادم للملك كي يسحبني بحبال.',
      'حاولتُ أن أتوقف عن التبشير لأن الرسالة جلبت لي الرفض فقط، لكنني قلتُ: كلام الله كنار موقدة في عظامي لا أستطيع حبسها.',
      'يُدعونني نبي البكاء لأنني نِحتُ على أورشليم أربعين سنة، ومع ذلك بشّرتُ بوعد عهد جديد مكتوب على القلوب.',
    ],
    biography:
      'Jeremiah was called as a prophet while still a youth, tasked with delivering an unwanted message of impending judgment to the kingdom of Judah for forty years — from King Josiah\'s reign through Jerusalem\'s fall to Babylon. He faced imprisonment, being thrown into a muddy cistern, public ridicule, and the agony of watching his nation refuse to repent. He composed the book of Lamentations weeping over the city\'s destruction. Yet amid the rubble he proclaimed stunning hope: a new covenant God would write not on stone tablets but on human hearts. He is sometimes called a "type of Christ" for his suffering, rejection, and unceasing intercession for his people.',
    key_verse: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."',
    key_verse_ref: 'Jeremiah 29:11',
    testament: 'OT',
  },
  {
    id: 'noah',
    name_en: 'Noah',
    name_ar: 'نوح',
    clues: [
      'I sent out a raven and then a dove from a window, and when the dove returned with an olive branch I knew the waters were receding.',
      'I built a massive vessel while my neighbors mocked me — it took 120 years, and not a drop of rain had ever fallen when I began.',
      'I was the only righteous man God found in a corrupt generation, and He chose me and my family — along with two of every animal — to survive the flood.',
    ],
    clues_ar: [
      'أرسلتُ غراباً ثم حمامة من نافذة، وحين عادت الحمامة بغصن زيتون عرفتُ أن المياه بدأت تنحسر.',
      'بنيتُ سفينة ضخمة وجيراني يسخرون مني، استغرق بناؤها 120 عاماً ولم تكن قطرة مطر قد سقطت حين بدأتُ.',
      'كنتُ الرجل الصالح الوحيد الذي وجده الله في جيل فاسد فاختارني أنا وعائلتي مع زوجين من كل حيوان لننجو من الطوفان.',
    ],
    biography:
      'Noah lived in an era so saturated with human wickedness that God grieved having created humanity. Yet Noah "walked with God" — a rare phrase in Scripture — and was chosen to build a massive ark according to precise divine specifications. He preached righteousness for over a century while constructing it, with no one listening. When the floodwaters came, he, his wife, his three sons and their wives, and representatives of every animal kind were sealed inside. After 150 days the waters receded, and God established a covenant with all creation, sealing it with the first rainbow. He stands as a symbol of salvation by grace through faith in Scripture and in later Christian tradition.',
    key_verse: 'Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God.',
    key_verse_ref: 'Genesis 6:9',
    testament: 'OT',
  },
  {
    id: 'mary-magdalene',
    name_en: 'Mary Magdalene',
    name_ar: 'مريم المجدلية',
    clues: [
      'I stood weeping outside an empty tomb when a man I thought was the gardener spoke my name — and I recognized His voice immediately.',
      'I traveled with Jesus and His disciples, supporting the ministry from my own resources, along with other women who had been healed.',
      'Seven demons had been cast out of me, and from that moment I became one of the most devoted followers of Jesus — present at the cross when most of His disciples had fled.',
    ],
    clues_ar: [
      'وقفتُ أبكي خارج القبر الفارغ حين نطق بي رجل ظننتُه البستاني، فعرفتُ صوته فوراً.',
      'سافرتُ مع يسوع وتلاميذه أُعين الخدمة من مالي الخاص، مع نساء أخريات شُفين هن أيضاً.',
      'أُخرجَ مني سبعة شياطين، ومن تلك اللحظة صرتُ من أشد أتباع يسوع إخلاصاً وكنتُ عند الصليب حين فرّ أغلب التلاميذ.',
    ],
    biography:
      'Mary Magdalene was a woman from the town of Magdala on the shore of the Sea of Galilee from whom Jesus cast out seven demons, forever changing the trajectory of her life. She became one of his most devoted followers, one of the women who financially supported Jesus and the twelve, and one of the few who stayed at the cross through the crucifixion. She was present at the burial and returned before dawn on the first day of the week to anoint the body — only to find the tomb empty. The risen Christ appeared to her first of all, calling her name, and commissioned her to carry the news to the disciples. She is called the "Apostle to the Apostles" in early Christian tradition.',
    key_verse: 'Jesus said to her, "Mary." She turned toward him and cried out in Aramaic, "Rabboni!" (which means "Teacher").',
    key_verse_ref: 'John 20:16',
    testament: 'NT',
  },
  {
    id: 'peter',
    name_en: 'Peter',
    name_ar: 'بطرس',
    clues: [
      'I denied knowing my closest friend three times in one night, and when a rooster crowed I went outside and wept bitterly — but I was fully restored by a beach breakfast.',
      'I stepped out of a boat in the middle of a storm and walked on the waves toward Jesus — until I noticed the wind and began to sink.',
      'Jesus renamed me "Rock" and said He would build His church on me, and on the day of Pentecost I preached a sermon that added 3,000 people to the church.',
    ],
    clues_ar: [
      'أنكرتُ معرفة أعز أصدقائي ثلاث مرات في ليلة واحدة، وحين صاح الديك خرجتُ وبكيتُ بمرارة، لكنني أُعدتُ كلياً على شاطئ أمام وجبة.',
      'نزلتُ من القارب وسط العاصفة ومشيتُ على الأمواج نحو يسوع، حتى رأيتُ الريح فبدأتُ أغرق.',
      'سمّاني يسوع "الصخرة" وقال سيبني كنيسته عليّ، ويوم العنصرة ألقيتُ عظة أضافت 3000 نفس للكنيسة.',
    ],
    biography:
      'Peter, born Simon bar Jonah, was a fisherman from Bethsaida whom Jesus called to be a fisher of men and renamed "Peter" (the Rock). Impulsive, passionate, and deeply loyal, he was consistently part of Jesus\' inner circle of three and was the first to confess, "You are the Christ, the Son of the living God." Yet he also sank when he doubted, rebuked Jesus for predicting His death, and denied Him three times in the high priest\'s courtyard. After the resurrection, Jesus tenderly restored him over breakfast with a triple commission: "Feed my sheep." He preached at Pentecost, led the early Jerusalem church, opened the gospel to Gentiles through Cornelius, and according to tradition was crucified upside down in Rome.',
    key_verse: 'You are the Christ, the Son of the living God.',
    key_verse_ref: 'Matthew 16:16',
    testament: 'NT',
  },
  {
    id: 'paul',
    name_en: 'Paul',
    name_ar: 'بولس',
    clues: [
      'I was bitten by a poisonous snake on a beach and shook it into the fire unhurt — and the islanders decided I must be a god.',
      'On the road to arrest and imprison Christians, I was suddenly blinded by a light brighter than the sun and heard a voice say, "Why are you persecuting me?"',
      'I was shipwrecked three times, stoned and left for dead once, beaten with rods, imprisoned, and I still said "To live is Christ, and to die is gain."',
    ],
    clues_ar: [
      'لدغتني أفعى سامة على الشاطئ فنفضتُها في النار سليماً، فقرر سكان الجزيرة أنني لا بد أن أكون إلهاً.',
      'في طريقي لاعتقال المسيحيين وسجنهم، أعماني فجأة نور أشد من الشمس وسمعتُ صوتاً يقول: لماذا تضطهدني؟',
      'انكسرت بي السفينة ثلاث مرات وجُلدتُ بالعصي وسُجنتُ ورُجمتُ وتُركتُ لأموت، ومع ذلك قلتُ: الحياة هي المسيح والموت هو ربح.',
    ],
    biography:
      'Paul, born Saul of Tarsus, was a Pharisee of Pharisees, a Roman citizen, and a zealous persecutor of the early church — until a blinding encounter with the risen Christ on the Damascus road transformed him into history\'s most prolific missionary. He made three major missionary journeys around the Mediterranean world, planting churches in modern-day Turkey, Greece, and beyond. He wrote thirteen (or fourteen) epistles that form the theological backbone of the New Testament, including Romans, Corinthians, Galatians, and Philippians. Imprisoned in Rome, he continued writing letters of encouragement. According to tradition he was beheaded under Emperor Nero, dying as the same kind of witness he had once tried to erase.',
    key_verse: 'For to me, to live is Christ and to die is gain.',
    key_verse_ref: 'Philippians 1:21',
    testament: 'NT',
  },
  {
    id: 'john-the-baptist',
    name_en: 'John the Baptist',
    name_ar: 'يوحنا المعمدان',
    clues: [
      'I sent messengers from prison to ask Jesus, "Are you the one who is to come, or should we look for someone else?" — and Jesus called me the greatest man ever born.',
      'I lived in the desert, wore clothes made of camel\'s hair with a leather belt, and ate locusts and wild honey.',
      'I baptized crowds in the Jordan River, calling people to repentance, and I said of Jesus: "He must increase, but I must decrease."',
    ],
    clues_ar: [
      'أرسلتُ رسلاً من السجن أسأل يسوع: هل أنت الآتي أم ننتظر آخر؟ فأعلن يسوع أنني أعظم من وُلد من امرأة.',
      'عشتُ في البرية وارتديتُ ثياباً من وبر الجمل بحزام جلدي وأكلتُ جراداً وعسلاً برياً.',
      'عمّدتُ الحشود في نهر الأردن داعياً إلى التوبة وقلتُ عن يسوع: هو ينبغي أن يزداد وأنا أن أنقص.',
    ],
    biography:
      'John the Baptist was the miraculous son of elderly priest Zechariah and his wife Elizabeth — a relative of Mary — born six months before Jesus to prepare the way for the Messiah. He burst onto the scene as a desert preacher, calling Israel to repentance with fiery urgency, baptizing thousands in the Jordan, and refusing to soften his message even before kings. He baptized Jesus himself, witnessing the Spirit descend like a dove and the Father\'s voice from heaven. He boldly condemned King Herod Antipas\'s adulterous marriage and was imprisoned for it. At the request of Herodias\'s daughter after a dance, Herod gave the order that ended his life — his head brought on a platter.',
    key_verse: 'He must become greater; I must become less.',
    key_verse_ref: 'John 3:30',
    testament: 'NT',
  },
  {
    id: 'mary-mother-of-jesus',
    name_en: 'Mary, Mother of Jesus',
    name_ar: 'مريم العذراء',
    clues: [
      'An old man at the Temple told me that a sword would pierce my own soul — a prophecy I pondered for thirty-three years.',
      'When an angel announced I would conceive by the Holy Spirit without knowing a man, I responded: "Let it be to me according to your word."',
      'I was present in the upper room at Pentecost when the Holy Spirit was poured out — from the Annunciation to the birth of the Church, I was there.',
    ],
    clues_ar: [
      'أخبرني شيخ في الهيكل أن سيفاً سيجوز في نفسي، وهو نبوة تأمّلتُها ثلاثة وثلاثين عاماً.',
      'حين أعلن ملاك أنني سأحبل من الروح القدس دون أن أعرف رجلاً، أجبتُ: هوذا أنا أمة الرب، ليكن لي بحسب قولك.',
      'كنتُ حاضرة في العلّية يوم العنصرة حين انسكب الروح القدس، من البشارة إلى ميلاد الكنيسة كنتُ هناك.',
    ],
    biography:
      'Mary was a young Jewish girl from Nazareth betrothed to a carpenter named Joseph when the angel Gabriel appeared to her with the most astonishing news in human history: she would bear the Son of God. Her response — "I am the Lord\'s servant" — is a model of surrender and faith. She carried Jesus to term while unmarried, gave birth in a stable in Bethlehem, fled to Egypt to protect her child, and raised him in Nazareth. She was present at his first miracle in Cana, stood at the foot of the cross watching her son die, and was with the disciples in the upper room at Pentecost. The Church has honored her as Theotokos, "God-bearer," and Mother of the Lord.',
    key_verse: 'My soul glorifies the Lord and my spirit rejoices in God my Savior.',
    key_verse_ref: 'Luke 1:46–47',
    testament: 'NT',
  },
  {
    id: 'stephen',
    name_en: 'Stephen',
    name_ar: 'إسطفانوس',
    clues: [
      'As I was being executed, I looked up and said I could see the Son of Man standing at the right hand of God — and among those watching approvingly was a young man named Saul.',
      'I was chosen as one of seven men to serve tables and care for widows — but I also performed great wonders and signs among the people.',
      'I became the first person to die for the Christian faith, stoned outside Jerusalem — and as I died I prayed, "Lord, do not hold this sin against them."',
    ],
    clues_ar: [
      'وأنا أُرجَم نظرتُ للأعلى وقلتُ أرى ابن الإنسان واقفاً عن يمين الله، وكان من بين المؤيدين للتنفيذ شابٌ اسمه شاول.',
      'اختُرتُ واحداً من سبعة رجال لخدمة الموائد والاعتناء بالأرامل، لكنني أجريتُ أيضاً عجائب وآيات عظيمة بين الشعب.',
      'كنتُ أول من مات في سبيل الإيمان المسيحي، رُجمتُ خارج أورشليم وفي موتي صلّيتُ: يا رب لا تقم لهم هذه الخطية.',
    ],
    biography:
      'Stephen was one of the seven men chosen by the early Jerusalem church to oversee the fair distribution of food to Hellenistic Jewish widows — described as a man "full of faith and of the Holy Spirit." But his ministry quickly expanded beyond serving tables: he performed great signs and wonders and engaged so powerfully in debate that his opponents could not withstand his wisdom. Brought before the Sanhedrin on false charges of blasphemy, he gave a sweeping speech retelling Israel\'s history of rejecting God\'s messengers. When he declared that he saw Jesus standing at God\'s right hand, the crowd rushed him, dragged him outside the city, and stoned him to death — making him the first Christian martyr.',
    key_verse: 'Lord Jesus, receive my spirit. Lord, do not hold this sin against them.',
    key_verse_ref: 'Acts 7:59–60',
    testament: 'NT',
  },
  {
    id: 'zacchaeus',
    name_en: 'Zacchaeus',
    name_ar: 'زكا',
    clues: [
      'When Jesus told me He was coming to my house, the crowd was deeply offended — because men like me were considered the worst kind of traitor to our people.',
      'I could not see over the crowd, so I ran ahead and climbed a sycamore-fig tree to get a view as the Teacher passed through town.',
      'I was the chief tax collector of Jericho, hated and wealthy — until Jesus looked up into a tree, called my name, and everything changed.',
    ],
    clues_ar: [
      'حين أخبر يسوع أنه سيأتي لبيتي غضب الحشد غضباً شديداً، لأن أمثالي كانوا يُعدّون أسوأ خائن لشعبه.',
      'لم أستطع الرؤية فوق الحشد فركضتُ أمامهم وتسلّقتُ جميزة لأرى المعلم وهو يمر في المدينة.',
      'كنتُ رئيس العشارين في أريحا، مكروهاً وثرياً، حتى نظر يسوع إلى الشجرة وناداني باسمي فتغيّر كل شيء.',
    ],
    biography:
      'Zacchaeus was the chief tax collector in Jericho, a man who had grown wealthy by collecting more than Rome required and keeping the difference — a practice that made him deeply despised by his fellow Jews. When Jesus passed through Jericho, Zacchaeus was so desperate to see him that he climbed a sycamore tree despite his short stature. Jesus spotted him, called him by name, and invited himself to Zacchaeus\'s home — scandalizing the crowd who called Zacchaeus a sinner. The encounter transformed him on the spot: he announced he would give half his wealth to the poor and repay anyone he\'d cheated four times over. Jesus declared, "Today salvation has come to this house."',
    key_verse: 'Today salvation has come to this house, because this man, too, is a son of Abraham.',
    key_verse_ref: 'Luke 19:9',
    testament: 'NT',
  },
  {
    id: 'thomas',
    name_en: 'Thomas',
    name_ar: 'توما',
    clues: [
      'I traveled further than almost any other apostle — tradition says I brought the gospel all the way to India, where churches still trace their founding to me.',
      'When the other disciples told me they had seen Jesus alive, I said unless I put my finger in his nail-scars and my hand in his side, I would not believe.',
      'When Jesus raised Lazarus, I was the one who said to the other disciples, "Let us also go, that we may die with him" — showing I was willing to follow even to death.',
    ],
    clues_ar: [
      'سافرتُ أبعد من أي رسول آخر تقريباً، تقليدياً وصلتُ بالإنجيل حتى الهند وكنائس هناك لا تزال تنسب تأسيسها إليّ.',
      'حين أخبرني التلاميذ أنهم رأوا يسوع حياً، قلتُ: إن لم أضع أصبعي في آثار المسامير ويدي في جنبه لن أؤمن.',
      'حين أراد يسوع إقامة لعازر قلتُ للتلاميذ: لنذهب نحن أيضاً لنموت معه، دليلاً على استعدادي للتبعة حتى الموت.',
    ],
    biography:
      'Thomas, called "the Twin," was one of the twelve apostles — a loyal but sometimes melancholy follower of Jesus who expressed his devotion by being willing to die alongside him. His defining moment came after the resurrection: absent when Jesus first appeared to the disciples, he flatly refused to believe without physical proof. Eight days later, Jesus appeared again and offered Thomas exactly the evidence he demanded. Thomas\'s response — "My Lord and my God!" — is one of the clearest confessions of Christ\'s divinity in the entire New Testament. According to strong tradition and the Thomas Christians of Kerala, India, he carried the gospel as far as the Indian subcontinent where he was martyred with a spear.',
    key_verse: 'My Lord and my God!',
    key_verse_ref: 'John 20:28',
    testament: 'NT',
  },
  {
    id: 'lydia',
    name_en: 'Lydia',
    name_ar: 'ليديا',
    clues: [
      'Paul and his companions found me outside a city gate by a river on the Sabbath — the only place of prayer in a city without a synagogue.',
      'As I listened to Paul speak, the Lord opened my heart to respond — and I became the first recorded Christian convert on the European continent.',
      'I was a successful businesswoman from Thyatira who dealt in expensive purple cloth, and I immediately offered Paul and his team my home as their base of operations.',
    ],
    clues_ar: [
      'وجدني بولس ورفاقه خارج باب المدينة عند نهر يوم السبت، الوحيد مكان للصلاة في مدينة بلا كنيس.',
      'بينما كنتُ أستمع لبولس يتكلم فتح الرب قلبي لأستجيب، فأصبحتُ أول من تسجّل إيمانه بالمسيح في القارة الأوروبية.',
      'كنتُ امرأة أعمال ناجحة من ثياتيرا أتاجر بالقماش الأرجواني الثمين، وفوراً عرضتُ على بولس وفريقه بيتي قاعدةً للعمل.',
    ],
    biography:
      'Lydia was a God-fearing Gentile woman from Thyatira in Asia Minor who had settled in Philippi, a leading city of Macedonia (northern Greece), where she ran a successful trade in purple cloth — a luxury good worn by royalty and the wealthy. When Paul arrived in Philippi on his second missionary journey, he found a small group of women gathered for prayer by the riverside, and there he met Lydia. As she listened, "the Lord opened her heart," she was baptized along with her household, and she became the first convert in what would become Europe. She immediately offered her home as the base for the new church in Philippi — the church Paul would later write one of his most affectionate letters to.',
    key_verse: 'If you consider me a believer in the Lord, come and stay at my house.',
    key_verse_ref: 'Acts 16:15',
    testament: 'NT',
  },
  {
    id: 'barnabas',
    name_en: 'Barnabas',
    name_ar: 'برنابا',
    clues: [
      'When everyone in Jerusalem was afraid of a certain newly-converted former persecutor, I was the one who vouched for him and brought him to meet the apostles.',
      'I had a falling-out with my ministry partner over whether to give a young man who had once abandoned the team a second chance — and time proved me right.',
      'The apostles nicknamed me "Son of Encouragement," and I proved it by selling a field I owned and laying the money at the apostles\' feet.',
    ],
    clues_ar: [
      'حين خاف كل من في أورشليم من مضطهد معيّن اعتنق الإيمان حديثاً، كنتُ أنا من ضمن له وأحضره لمقابلة الرسل.',
      'وقعتُ في خلاف مع شريكي في الخدمة حول إعطاء شاب تخلّى مرة عن الفريق فرصة ثانية، والزمن أثبت صوابي.',
      'لقّبني الرسل "ابن الوعظ" وأثبتُ جدارة اللقب ببيع حقل يملكه ووضع المال عند قدمي الرسل.',
    ],
    biography:
      'Barnabas, born Joseph, was a Levite from Cyprus whose nickname "Son of Encouragement" (Barnabas) was given by the apostles because it perfectly captured his gift. He was among the first to sell property and donate the proceeds to the Jerusalem community, setting a standard of radical generosity. When everyone feared the newly-converted Saul of Tarsus, it was Barnabas who took the risk of vouching for him and introducing him to the apostles. He was sent to the new church in Antioch, was Paul\'s missionary partner on the first journey, and later took his cousin John Mark under his wing after Paul refused to give him another chance — a decision tradition suggests produced the Gospel of Mark.',
    key_verse: 'He was a good man, full of the Holy Spirit and faith, and a great number of people were brought to the Lord.',
    key_verse_ref: 'Acts 11:24',
    testament: 'NT',
  },
  {
    id: 'nicodemus',
    name_en: 'Nicodemus',
    name_ar: 'نيقوديموس',
    clues: [
      'I brought 75 pounds of myrrh and aloe to help prepare a body for burial — a kingly amount of spices for a man most of my colleagues had despised.',
      'I came to Jesus under cover of darkness, perhaps afraid of what my colleagues on the ruling council would think if they saw me.',
      'Jesus told me I must be "born again" — and I didn\'t understand, asking how a grown man could re-enter his mother\'s womb.',
    ],
    clues_ar: [
      'جلبتُ 75 رطلاً من المرّ والعود لتجهيز جسد للدفن، كمية ملكية من الطيب لرجل احتقره معظم زملائي.',
      'جئتُ إلى يسوع تحت جنح الظلام، ربما خشيةً من رأي زملائي في مجلس الحكم لو رأوني.',
      'أخبرني يسوع أنه يجب أن أُولَد من جديد، فلم أفهم وسألتُ: كيف يستطيع إنسان بالغ أن يدخل بطن أمه ثانية؟',
    ],
    biography:
      'Nicodemus was a Pharisee and a member of the Sanhedrin, the Jewish ruling council in Jerusalem — a respected teacher of Israel with power and reputation to protect. He came to Jesus by night, recognizing him as a teacher from God, and received the most famous theological conversation in the Gospels: the need to be born again of water and Spirit. He next appears defending Jesus in the Sanhedrin when his colleagues rushed to judgment. His third and final appearance is the most striking: after the crucifixion he came openly, with 75 pounds of burial spices, to honor Jesus in death — a declaration that could no longer be hidden. Tradition holds that he was later baptized by Peter and John.',
    key_verse: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    key_verse_ref: 'John 3:16',
    testament: 'NT',
  },
  {
    id: 'prodigal-father',
    name_en: "The Prodigal Son's Father",
    name_ar: 'أبو الابن الضال',
    clues: [
      'When my older son refused to come to the party and accused me of favoritism, I went out and pleaded with him too — I had love enough for both sons.',
      'I gave my younger son his entire inheritance while I was still alive — which in my culture was the same as wishing me dead.',
      'I saw my son returning from a long way off, ran to meet him, fell on his neck and kissed him, and threw him a party before he could even finish his apology.',
    ],
    clues_ar: [
      'حين رفض ابني الكبير الدخول للحفل واتهمني بالمحاباة، خرجتُ وترجّيتُه أنا أيضاً لأن محبتي تكفي لكليهما.',
      'أعطيتُ ابني الصغير ميراثه كاملاً وأنا لا أزال حياً، وهو في ثقافتنا يعني أنه تمنّى موتي.',
      'رأيتُ ابني قادماً من بعيد فركضتُ لاستقباله وعانقتُه وقبّلتُه وأقمتُ له وليمة قبل أن يُتمّ اعترافه.',
    ],
    biography:
      'The father in Jesus\'s parable of the Prodigal Son is not given a name, yet he may be the most vivid portrait of God\'s character in all of Scripture. When his younger son demanded his inheritance early and left to waste it in reckless living, the father did not pursue him — but he watched and waited. The moment he spotted his son on the horizon, he ran — an undignified act for a man of dignity — threw his arms around him, restored him fully with a robe, ring, and sandals, and threw a celebration. When the older son\'s resentment boiled over, the father went out to him too with the same tender appeal. Jesus told this parable to show what God is like toward those who return to Him.',
    key_verse: 'While he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.',
    key_verse_ref: 'Luke 15:20',
    testament: 'NT',
  },
  {
    id: 'martha',
    name_en: 'Martha',
    name_ar: 'مرثا',
    clues: [
      'I made a confession of faith so profound and clear that theologians place it alongside Peter\'s great confession — I declared Jesus to be the Christ, the Son of God, the one who was to come into the world.',
      'While my sister sat at Jesus\'s feet listening, I was busy in the kitchen — and I had the boldness to ask Jesus to tell her to help me.',
      'When my brother died and Jesus arrived four days late, I ran out to meet Him and cried, "Lord, if you had been here, my brother would not have died."',
    ],
    clues_ar: [
      'أدليتُ باعتراف إيمان عميق وصريح حتى يضعه اللاهوتيون جنب اعتراف بطرس العظيم، أعلنتُ أن يسوع هو المسيح ابن الله الذي كان آتياً إلى العالم.',
      'بينما جلست أختي عند قدمي يسوع تستمع، كنتُ مشغولة في المطبخ وأجرأتُ على أن أطلب من يسوع أن يقول لها لتساعدني.',
      'حين مات أخي ووصل يسوع بعد أربعة أيام، ركضتُ لأقابله وصرختُ: يا رب لو كنتَ ههنا لما مات أخي.',
    ],
    biography:
      'Martha of Bethany was one of Jesus\'s closest and most beloved friends, along with her sister Mary and brother Lazarus. She was a woman of practical service and deep hospitality, famously "distracted by much serving" when Jesus visited — a moment Jesus gently rebuked without dismissing her. But her greater glory came in John 11: when Lazarus died and Jesus arrived to find her in grief, it was Martha — not Mary — who ran to meet Jesus first and uttered the stunning confession, "I believe that you are the Messiah, the Son of God, who is to come into the world." Jesus proceeded to raise Lazarus from the dead. Martha\'s faith was not merely in a wise teacher but in the Resurrection and the Life Himself.',
    key_verse: 'I am the resurrection and the life. The one who believes in me will live, even though they die.',
    key_verse_ref: 'John 11:25',
    testament: 'NT',
  },
];
