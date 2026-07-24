// LevelX Video Lessons — YouTube Data API v3 fetcher + CEFR classifier
// Falls back to rich mock data when API key is not configured

const LESSONS_CONFIG = {
  API_KEY: '', // Set your YouTube Data API v3 key here
  CACHE_KEY: 'levelx_lessons_cache',
  CACHE_TTL: 60 * 60 * 6 * 1000, // 6 hours
  CHANNELS: [
    {
      id: 'UCazamqahramoniy',
      handle: '@azamqahramoniy',
      name: 'Azam Qahramoniy',
      channelId: 'UCazamqahramoniy_placeholder',
      avatar: '👨‍🏫',
      color: '#3b82f6',
      bio: "Azam Qahramoniy — ingliz tili o'qituvchisi va YouTube bloger. CEFR metodologiyasi asosida A1 dan C1 gacha barcha darajalar uchun qiziqarli darslar tayyorlaydi.",
      students: 85000
    },
    {
      id: 'UCnsflamultilevelhub',
      handle: '@nsflamultilevelhub',
      name: 'NSFLA Multilevel Hub',
      channelId: 'UCnsflamultilevelhub_placeholder',
      avatar: '🎓',
      color: '#8b5cf6',
      bio: "NSFLA Multilevel Hub — ko'p darajali ingliz tili ta'lim markazi. Grammatika, lug'at, tinglab tushunish va so'zlashuv ko'nikmalarini mukammal rivojlantirishga yo'naltirilgan.",
      students: 42000
    },
    {
      id: 'UCabdulloh_john_ruziev',
      handle: '@abdulloh_john_ruziev',
      name: 'Abdulloh John Ruziev',
      channelId: 'UCabdulloh_john_ruziev_placeholder',
      avatar: '📚',
      color: '#10b981',
      bio: "Abdulloh John Ruziev — tajribali ingliz tili o'qituvchisi. Amaliy mashqlar, real hayot dialoglar va IELTS/TOEFL tayyorgarlik darslari bilan mashhur.",
      students: 63000
    }
  ]
};


// ─── CEFR CLASSIFIER ────────────────────────────────────────────────────────
const CEFR_KEYWORDS = {
  A1: ['beginner','starter','basic','alphabet','greetings','hello','numbers','colors','family','animals',
       'simple sentences','a1','level 1','boshlovchi','asosiy','salom','raqamlar'],
  A2: ['elementary','a2','level 2','simple past','present simple','daily routine','shopping','directions',
       'common phrases','everyday english','oddiy','kundalik'],
  B1: ['intermediate','b1','level 3','present perfect','conditionals','travel','work','opinions',
       'reading comprehension','o\'rta daraja','mustaqil'],
  B2: ['upper intermediate','b2','level 4','passive voice','reported speech','advanced grammar',
       'academic','ielts','debate','o\'rtadan yuqori'],
  C1: ['advanced','c1','level 5','complex grammar','fluency','proficiency','nuance','idiomatic',
       'academic writing','ilg\'or'],
  C2: ['proficient','c2','level 6','mastery','near native','sophisticated','literature','c2','professional english']
};

const SKILL_KEYWORDS = {
  grammar:    ['grammar','tense','verb','noun','adjective','pronoun','preposition','clause','sentence','grammatika','fe\'l','zamon'],
  vocabulary: ['vocabulary','words','word','idioms','phrases','expressions','lug\'at','so\'zlar','iboralar'],
  speaking:   ['speaking','conversation','dialogue','pronunciation','speaking skills','gapirish','talaffuz','suhbat'],
  listening:  ['listening','audio','hear','podcast','comprehension','tinglash','eshitish'],
  reading:    ['reading','text','passage','article','story','o\'qish','matn'],
  writing:    ['writing','essay','paragraph','composition','yozish','insho']
};

const ENGLISH_KEYWORDS = ['english','ingliz','grammar','vocabulary','ielts','toefl','speaking','listening',
  'reading','writing','pronunciation','tense','cefr','lesson','dars','o\'rganish','learning'];

function classifyCEFR(title, description, tags = []) {
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  const scores = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  for (const [level, kws] of Object.entries(CEFR_KEYWORDS)) {
    kws.forEach(kw => { if (text.includes(kw)) scores[level] += 1; });
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'B1'; // default B1
}

function classifySkills(title, description, tags = []) {
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  const found = [];
  for (const [skill, kws] of Object.entries(SKILL_KEYWORDS)) {
    if (kws.some(kw => text.includes(kw))) found.push(skill);
  }
  return found.length > 0 ? found : ['grammar'];
}

function isEnglishLesson(title, description, tags = []) {
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  return ENGLISH_KEYWORDS.some(kw => text.includes(kw));
}

function isShortOrLive(item) {
  const type = item.snippet?.liveBroadcastContent;
  if (type === 'live' || type === 'upcoming') return true;
  const dur = item.contentDetails?.duration || '';
  // ISO 8601 duration — Shorts are typically < 65 seconds (PT1M5S or less)
  const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (match) {
    const h = parseInt(match[1] || 0), m = parseInt(match[2] || 0), s = parseInt(match[3] || 0);
    const total = h * 3600 + m * 60 + s;
    if (total > 0 && total < 65) return true;
  }
  return false;
}

function parseDuration(iso) {
  const match = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = parseInt(match[1] || 0), m = parseInt(match[2] || 0), s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function formatViews(n) {
  if (!n) return '0';
  const num = parseInt(n);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
}


// ─── YOUTUBE API FETCHER ─────────────────────────────────────────────────────
async function fetchChannelVideos(channel) {
  if (!LESSONS_CONFIG.API_KEY) return null;
  try {
    // 1. Get uploads playlist ID
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&forHandle=${channel.handle.replace('@','')}&key=${LESSONS_CONFIG.API_KEY}`
    );
    const chData = await chRes.json();
    if (!chData.items?.length) return null;
    const uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;
    const chStats   = chData.items[0].statistics;

    // 2. Get playlist items (up to 200)
    let videos = [], pageToken = '';
    do {
      const plRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=50&pageToken=${pageToken}&key=${LESSONS_CONFIG.API_KEY}`
      );
      const plData = await plRes.json();
      videos.push(...(plData.items || []));
      pageToken = plData.nextPageToken || '';
    } while (pageToken && videos.length < 200);

    // 3. Get video details in batches of 50
    const videoIds = videos.map(v => v.contentDetails.videoId).join(',');
    const detRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${LESSONS_CONFIG.API_KEY}`
    );
    const detData = await detRes.json();

    // 4. Filter and classify
    const lessons = [];
    for (const v of (detData.items || [])) {
      if (isShortOrLive(v)) continue;
      const title = v.snippet.title;
      const desc  = v.snippet.description || '';
      const tags  = v.snippet.tags || [];
      if (!isEnglishLesson(title, desc, tags)) continue;
      lessons.push({
        id:          v.id,
        title,
        description: desc.slice(0, 300),
        thumbnail:   v.snippet.thumbnails?.maxres?.url || v.snippet.thumbnails?.high?.url || '',
        channelId:   channel.id,
        channelName: channel.name,
        teacherAvatar: channel.avatar,
        teacherColor:  channel.color,
        publishedAt:   v.snippet.publishedAt,
        duration:      parseDuration(v.contentDetails.duration),
        views:         formatViews(v.statistics.viewCount),
        viewCount:     parseInt(v.statistics.viewCount || 0),
        level:         classifyCEFR(title, desc, tags),
        skills:        classifySkills(title, desc, tags),
        tags,
        playlistId: null
      });
    }
    return { channel, stats: chStats, lessons };
  } catch (e) {
    console.warn('YouTube API error:', e);
    return null;
  }
}

async function fetchAllLessons() {
  // Try cache first
  const cached = localStorage.getItem(LESSONS_CONFIG.CACHE_KEY);
  if (cached) {
    try {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < LESSONS_CONFIG.CACHE_TTL) return data;
    } catch {}
  }

  // Try API
  if (LESSONS_CONFIG.API_KEY) {
    const results = await Promise.all(LESSONS_CONFIG.CHANNELS.map(fetchChannelVideos));
    const valid = results.filter(Boolean);
    if (valid.length) {
      localStorage.setItem(LESSONS_CONFIG.CACHE_KEY, JSON.stringify({ data: valid, ts: Date.now() }));
      return valid;
    }
  }

  // Fallback to mock data
  return getMockLessonsData();
}


// ─── MOCK DATA ───────────────────────────────────────────────────────────────
function getMockLessonsData() {
  const mock = [
    // ── Azam Qahramoniy ──
    { id:'aq_01', title:"A1 | Ingliz tili asoslari — To Be fe'li", description:"To be fe'lini to'liq o'rganamiz: am, is, are. Misollar va mashqlar bilan.",
      thumbnail:'https://picsum.photos/seed/aq01/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-01-15', duration:'12:34', views:'45K', viewCount:45000,
      level:'A1', skills:['grammar'], tags:['english','grammar','a1','beginner'], playlistId:'PL_azam_a1' },
    { id:'aq_02', title:"A1 | Ingliz tilida salomlashish va tanishish", description:"Kundalik salomlashish iboralari: Hello, Hi, Good morning va boshqalar.",
      thumbnail:'https://picsum.photos/seed/aq02/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-01-22', duration:'9:45', views:'38K', viewCount:38000,
      level:'A1', skills:['speaking','vocabulary'], tags:['english','speaking','greetings','a1'], playlistId:'PL_azam_a1' },
    { id:'aq_03', title:"A2 | Present Simple — Har kuni nima qilamiz?", description:"Present Simple zamonini o'rganamiz. Affirmative, Negative, Question shakllar.",
      thumbnail:'https://picsum.photos/seed/aq03/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-02-01', duration:'18:20', views:'62K', viewCount:62000,
      level:'A2', skills:['grammar'], tags:['english','grammar','present simple','a2'], playlistId:'PL_azam_a2' },
    { id:'aq_04', title:"A2 | 500 ta eng zarur inglizcha so'zlar", description:"Kundalik hayotda eng ko'p ishlatiladigan 500 ta so'z va ularning tarjimasini o'rganamiz.",
      thumbnail:'https://picsum.photos/seed/aq04/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-02-10', duration:'24:15', views:'89K', viewCount:89000,
      level:'A2', skills:['vocabulary'], tags:['english','vocabulary','words','a2'], playlistId:'PL_azam_vocab' },
    { id:'aq_05', title:"B1 | Present Perfect — Tajriba va natijalar", description:"Present Perfect zamonini chuqur o'rganamiz. Have/Has + V3. Real misollar.",
      thumbnail:'https://picsum.photos/seed/aq05/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-03-01', duration:'22:08', views:'51K', viewCount:51000,
      level:'B1', skills:['grammar'], tags:['english','grammar','present perfect','b1'], playlistId:'PL_azam_b1' },
    { id:'aq_06', title:"B1 | Conditional Sentences — Shart gaplar", description:"If clauses: Zero, First va Second Conditional. Amaliy mashqlar va misollar.",
      thumbnail:'https://picsum.photos/seed/aq06/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-03-15', duration:'28:45', views:'44K', viewCount:44000,
      level:'B1', skills:['grammar'], tags:['english','conditionals','grammar','b1'], playlistId:'PL_azam_b1' },
    { id:'aq_07', title:"B2 | Passive Voice — Noaniq shaxs gaplari", description:"Passive voice konstruktsiyalarini barcha zamonlarda qo'llashni o'rganamiz.",
      thumbnail:'https://picsum.photos/seed/aq07/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-04-01', duration:'31:12', views:'33K', viewCount:33000,
      level:'B2', skills:['grammar'], tags:['english','passive voice','grammar','b2'], playlistId:'PL_azam_b2' },
    { id:'aq_08', title:"B2 | Advanced Vocabulary — Academic so'zlar", description:"IELTS va akademik ingliz tili uchun zarur bo'lgan yuqori darajali so'zlar.",
      thumbnail:'https://picsum.photos/seed/aq08/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-04-20', duration:'35:30', views:'28K', viewCount:28000,
      level:'B2', skills:['vocabulary'], tags:['english','vocabulary','academic','b2','ielts'], playlistId:'PL_azam_b2' },
    { id:'aq_09', title:"C1 | Complex Grammar — Inversion va Emphasis", description:"Murakkab grammatik tuzilmalar: inversion, cleft sentences, emphasis.",
      thumbnail:'https://picsum.photos/seed/aq09/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-05-10', duration:'42:18', views:'19K', viewCount:19000,
      level:'C1', skills:['grammar'], tags:['english','advanced','grammar','c1'], playlistId:'PL_azam_c1' },
    { id:'aq_10', title:"A1 | Ingliz tilida sonlar va sanalar", description:"1 dan 1000 gacha sonlar, kun, oy, yil — ingliz tilida sanalarni aytish.",
      thumbnail:'https://picsum.photos/seed/aq10/480/270', channelId:'UCazamqahramoniy', channelName:'Azam Qahramoniy',
      teacherAvatar:'👨‍🏫', teacherColor:'#3b82f6', publishedAt:'2024-01-28', duration:'14:55', views:'71K', viewCount:71000,
      level:'A1', skills:['vocabulary'], tags:['english','numbers','a1','beginner'], playlistId:'PL_azam_a1' },
  ];
  return mock;
}


// ── NSFLA & Abdulloh John mock lessons (appended to getMockLessonsData) ──────
const _nsfla = [
  { id:'ns_01', title:"A1 Beginner English — Introduction Lesson", description:"First lesson for absolute beginners. Learn the alphabet, basic sounds, and first words.",
    thumbnail:'https://picsum.photos/seed/ns01/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-01-10', duration:'15:22', views:'32K', viewCount:32000,
    level:'A1', skills:['speaking','vocabulary'], tags:['english','beginner','a1','introduction'], playlistId:'PL_ns_a1' },
  { id:'ns_02', title:"A2 English Listening — Daily Conversations", description:"Improve your listening skills with real-life daily conversations at elementary level.",
    thumbnail:'https://picsum.photos/seed/ns02/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-02-05', duration:'20:14', views:'27K', viewCount:27000,
    level:'A2', skills:['listening'], tags:['english','listening','a2','conversation'], playlistId:'PL_ns_a2' },
  { id:'ns_03', title:"B1 Grammar — Modal Verbs Complete Guide", description:"Can, could, may, might, should, must, will, would — full explanation with examples.",
    thumbnail:'https://picsum.photos/seed/ns03/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-03-10', duration:'33:47', views:'41K', viewCount:41000,
    level:'B1', skills:['grammar'], tags:['english','grammar','modal verbs','b1'], playlistId:'PL_ns_b1' },
  { id:'ns_04', title:"B1 Speaking — Express Your Opinion Fluently", description:"Phrases and structures to express opinions, agree, and disagree in English.",
    thumbnail:'https://picsum.photos/seed/ns04/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-03-25', duration:'25:09', views:'35K', viewCount:35000,
    level:'B1', skills:['speaking'], tags:['english','speaking','b1','opinion'], playlistId:'PL_ns_b1' },
  { id:'ns_05', title:"B2 Reading — Academic Texts and Comprehension", description:"Learn to read and understand complex academic texts. Scanning and skimming strategies.",
    thumbnail:'https://picsum.photos/seed/ns05/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-04-15', duration:'38:22', views:'22K', viewCount:22000,
    level:'B2', skills:['reading'], tags:['english','reading','b2','academic'], playlistId:'PL_ns_b2' },
  { id:'ns_06', title:"B2 Writing — Essay Writing Masterclass", description:"Structure perfect essays: introduction, body paragraphs, conclusion. B2 writing skills.",
    thumbnail:'https://picsum.photos/seed/ns06/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-05-01', duration:'45:33', views:'18K', viewCount:18000,
    level:'B2', skills:['writing'], tags:['english','writing','essay','b2'], playlistId:'PL_ns_b2' },
  { id:'ns_07', title:"C1 Advanced Vocabulary — Idiomatic Expressions", description:"Master advanced idioms and expressions used by native speakers in C1-level contexts.",
    thumbnail:'https://picsum.photos/seed/ns07/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-06-01', duration:'40:15', views:'14K', viewCount:14000,
    level:'C1', skills:['vocabulary'], tags:['english','vocabulary','idioms','c1','advanced'], playlistId:'PL_ns_c1' },
  { id:'ns_08', title:"A1 Pronunciation — English Sounds for Beginners", description:"Learn English vowel and consonant sounds. IPA basics for absolute beginners.",
    thumbnail:'https://picsum.photos/seed/ns08/480/270', channelId:'UCnsflamultilevelhub', channelName:'NSFLA Multilevel Hub',
    teacherAvatar:'🎓', teacherColor:'#8b5cf6', publishedAt:'2024-02-14', duration:'17:40', views:'48K', viewCount:48000,
    level:'A1', skills:['speaking'], tags:['english','pronunciation','a1','sounds'], playlistId:'PL_ns_a1' },
];

const _abdulloh = [
  { id:'ab_01', title:"A2 | Ingliz tilida do'konda xarid qilish dialogi", description:"Do'konda xarid qilish — amaliy dialog va iboralar. Can I have...? How much is...?",
    thumbnail:'https://picsum.photos/seed/ab01/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-02-08', duration:'16:28', views:'55K', viewCount:55000,
    level:'A2', skills:['speaking','vocabulary'], tags:['english','speaking','shopping','a2'], playlistId:'PL_ab_a2' },
  { id:'ab_02', title:"B1 | Past Simple vs Past Continuous — Farqini bilamizmi?", description:"O'tgan zamon fe'llarini qachon ishlatish kerak? Amaliy mashqlar va misollar.",
    thumbnail:'https://picsum.photos/seed/ab02/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-03-05', duration:'26:50', views:'43K', viewCount:43000,
    level:'B1', skills:['grammar'], tags:['english','grammar','past tense','b1'], playlistId:'PL_ab_b1' },
  { id:'ab_03', title:"B1 | IELTS Listening — Band 6 uchun strategiyalar", description:"IELTS listening testida band 6 olish uchun eng samarali strategiyalar va mashqlar.",
    thumbnail:'https://picsum.photos/seed/ab03/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-03-20', duration:'39:15', views:'76K', viewCount:76000,
    level:'B1', skills:['listening'], tags:['ielts','listening','b1','strategy'], playlistId:'PL_ab_ielts' },
  { id:'ab_04', title:"B2 | IELTS Speaking — Part 1, 2, 3 to'liq tayyorgarlik", description:"IELTS speaking imtihonining barcha qismlarini muvaffaqiyatli topshirish sirlari.",
    thumbnail:'https://picsum.photos/seed/ab04/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-04-10', duration:'52:30', views:'91K', viewCount:91000,
    level:'B2', skills:['speaking'], tags:['ielts','speaking','b2','exam'], playlistId:'PL_ab_ielts' },
  { id:'ab_05', title:"B2 | Academic Writing Task 2 — Essay Templates", description:"IELTS Writing Task 2 uchun universal shablonlar va band 7+ olish usullari.",
    thumbnail:'https://picsum.photos/seed/ab05/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-04-25', duration:'44:20', views:'67K', viewCount:67000,
    level:'B2', skills:['writing'], tags:['ielts','writing','b2','essay','task 2'], playlistId:'PL_ab_ielts' },
  { id:'ab_06', title:"C1 | Advanced Speaking — Native Level Fluency Tips", description:"C1 darajasida gapirish: gap to'ldirgichlar, iboralar, va tabiiy oqim sirlari.",
    thumbnail:'https://picsum.photos/seed/ab06/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-05-15', duration:'36:55', views:'29K', viewCount:29000,
    level:'C1', skills:['speaking'], tags:['english','speaking','fluency','c1','advanced'], playlistId:'PL_ab_c1' },
  { id:'ab_07', title:"A2 | Ingliz tilida yo'l ko'rsatish — Directions", description:"Directions va prepositions of place: turn left, go straight, next to, opposite.",
    thumbnail:'https://picsum.photos/seed/ab07/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-02-20', duration:'13:42', views:'38K', viewCount:38000,
    level:'A2', skills:['speaking','vocabulary'], tags:['english','directions','a2','vocabulary'], playlistId:'PL_ab_a2' },
  { id:'ab_08', title:"C1 | IELTS Reading — Band 7.5+ Strategy", description:"Advanced reading comprehension strategies for IELTS band 7.5 and above.",
    thumbnail:'https://picsum.photos/seed/ab08/480/270', channelId:'UCabdulloh_john_ruziev', channelName:'Abdulloh John Ruziev',
    teacherAvatar:'📚', teacherColor:'#10b981', publishedAt:'2024-06-10', duration:'48:05', views:'52K', viewCount:52000,
    level:'C1', skills:['reading'], tags:['ielts','reading','c1','band 7'], playlistId:'PL_ab_ielts' },
];

// Patch getMockLessonsData to return all channels
const _origMockFn = getMockLessonsData;
window._mockLessonsRaw = () => {
  const azam = _origMockFn();
  return [
    { channel: LESSONS_CONFIG.CHANNELS[0], stats: { subscriberCount:'85000', videoCount:'120', viewCount:'3200000' }, lessons: azam },
    { channel: LESSONS_CONFIG.CHANNELS[1], stats: { subscriberCount:'42000', videoCount:'85',  viewCount:'1800000' }, lessons: _nsfla },
    { channel: LESSONS_CONFIG.CHANNELS[2], stats: { subscriberCount:'63000', videoCount:'95',  viewCount:'2600000' }, lessons: _abdulloh }
  ];
};

// Override fetchAllLessons to use full mock when no API key
const _origFetch = fetchAllLessons;
window.fetchAllLessons = async function() {
  if (LESSONS_CONFIG.API_KEY) return _origFetch();
  return window._mockLessonsRaw();
};

// Expose config and helpers globally
window.LESSONS_CONFIG  = LESSONS_CONFIG;
window.classifyCEFR    = classifyCEFR;
window.classifySkills  = classifySkills;
window.parseDuration   = parseDuration;
window.formatViews     = formatViews;
window.formatDate      = formatDate;
